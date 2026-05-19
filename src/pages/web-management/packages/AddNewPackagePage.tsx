"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  ToastNotification,
  ToastType,
} from "@/components/common-components/ToastNotification";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { PackageService } from "@/services/packageService";
import { TourService } from "@/services/tourService";
import {
  AddPackageRequest,
  PackageImageRequest,
  AddFeatureRequest,
  DayAccommodation,
  Inclusion,
  Exclusion,
  Condition,
  TravelTipRequest,
  HotelNameId,
  VehicleNumberIdType,
} from "@/types/package-types";
import { Tour, TourNameId } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Loader,
  Search,
  ChevronDown,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Tag,
  Sun,
  Clock,
  CheckCircle,
} from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";

// Import package-specific components
import { PackageTypeSelector } from "@/components/packages-components/package-create-components/PackageTypeSelector";
import { FeaturesForm } from "@/components/packages-components/package-create-components/FeaturesForm";
import { DayAccommodationsForm } from "@/components/packages-components/package-create-components/DayAccommodationsForm";
import { InclusionsExclusionsForm } from "@/components/packages-components/package-create-components/InclusionsExclusionsForm";
import { ConditionsTipsForm } from "@/components/packages-components/package-create-components/ConditionsTipsForm";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  packageId?: number;
}

const AddNewPackagePage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Tour selection state
  const [tours, setTours] = useState<TourNameId[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState<TourNameId | null>(null);
  const [selectedTourDetails, setSelectedTourDetails] = useState<Tour | null>(
    null,
  );
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingTourDetails, setLoadingTourDetails] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add after other state declarations
  const [hotels, setHotels] = useState<HotelNameId[]>([]);
  const [vehicles, setVehicles] = useState<VehicleNumberIdType[]>([]);
  const [loadingParameters, setLoadingParameters] = useState(false);

  // Package form state
  const [formData, setFormData] = useState<AddPackageRequest>({
    packageType: 1, // Set a default package type (e.g., 1 for Standard)
    tourId: 0,
    name: "",
    description: "",
    totalPrice: 0,
    discountPercentage: 0,
    startDate: new Date().toISOString().split("T")[0], // Set today's date as default
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0], // Set next month as default
    color: "#10b981",
    status: "ACTIVE",
    hoverColor: "#059669",
    minPersonCount: 1,
    maxPersonCount: 20,
    pricePerPerson: 0,
    images: [],
    addFeatures: [],
    dayAccommodations: [],
    inclusions: [],
    exclusions: [],
    conditions: [],
    travelTips: [],
  });

  // Image state
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File; uploading?: boolean; uploadError?: string }[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
    packageId: undefined,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Packages",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/packages`,
    },
    {
      label: "Add New Package",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/packages/add`,
    },
  ];

  // Fetch tours on mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoadingTours(true);
        const response = await TourService.getAllTourNames();
        if (response.code === 200 && response.data) {
          setTours(response.data);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTours = tours.filter((tour) =>
    tour.tourName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectTour = async (tour: TourNameId) => {
    setSelectedTour(tour);
    setIsDropdownOpen(false);
    setSearchQuery("");

    try {
      setLoadingTourDetails(true);
      setLoadingParameters(true);

      const [tourResponse, paramsResponse] = await Promise.all([
        TourService.getTourById(tour.tourId),
        PackageService.getPackageParameters(tour.tourId),
      ]);

      if (tourResponse.code === 200 && tourResponse.data) {
        const tourDetails = tourResponse.data;
        setSelectedTourDetails(tourDetails);

        // Auto-fill package form with tour details
        setFormData((prev) => ({
          ...prev,
          tourId: tour.tourId,
          name: `${tourDetails.tourName} Package`,
          description: tourDetails.tourDescription,
        }));

        // Initialize day accommodations based on tour duration
        const initialAccommodations: DayAccommodation[] = Array.from(
          { length: tourDetails.duration },
          (_, i) => ({
            dayNumber: i + 1,
            breakfast: false,
            breakfastDescription: null,
            lunch: false,
            lunchDescription: null,
            dinner: false,
            dinnerDescription: null,
            morningTea: false,
            morningTeaDescription: null,
            eveningTea: false,
            eveningTeaDescription: null,
            snacks: false,
            snackNote: null,
            hotelId: 0,
            transportId: 0,
            otherNotes: null,
          }),
        );

        setFormData((prev) => ({
          ...prev,
          dayAccommodations: initialAccommodations,
        }));
      }

      // Handle package parameters
      if (paramsResponse.code === 200 && paramsResponse.data) {
        const params = paramsResponse.data;

        // Set hotels and vehicles
        setHotels(params.hotelsNamesAndIdsDtos || []);
        setVehicles(params.vehicleNumberIdTypeDtos || []);

        // Pre-fill inclusions, exclusions, conditions, travelTips
        setFormData((prev) => ({
          ...prev,
          inclusions: (params.inclusions || []).map((text, index) => ({
            inclusionText: text,
            displayOrder: index,
            status: "ACTIVE",
          })),
          exclusions: (params.exclusions || []).map((text, index) => ({
            exclusionText: text,
            displayOrder: index,
            status: "ACTIVE",
          })),
          conditions: (params.conditions || []).map((text, index) => ({
            conditionText: text,
            displayOrder: index,
            status: "ACTIVE",
          })),
          travelTips: (params.travelTips || []).map((tip, index) => ({
            tipTitle: tip.title,
            tipDescription: tip.description,
            displayOrder: index,
            status: "ACTIVE",
          })),
        }));
      }
    } catch (error) {
      console.error("Error fetching tour details:", error);
      setToast({
        show: true,
        type: "error",
        title: "Error",
        message: "Failed to load tour details",
        packageId: undefined,
      });
    } finally {
      setLoadingTourDetails(false);
      setLoadingParameters(false);
    }
  };

  const handleClearTour = () => {
    setSelectedTour(null);
    setSelectedTourDetails(null);
    setFormData({
      packageType: 1,
      tourId: 0,
      name: "",
      description: "",
      totalPrice: 0,
      discountPercentage: 0,
      startDate: "",
      endDate: "",
      color: "#10b981",
      status: "ACTIVE",
      hoverColor: "#059669",
      minPersonCount: 1,
      maxPersonCount: 20,
      pricePerPerson: 0,
      images: [],
      addFeatures: [],
      dayAccommodations: [],
      inclusions: [],
      exclusions: [],
      conditions: [],
      travelTips: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (
      name === "totalPrice" ||
      name === "discountPercentage" ||
      name === "minPersonCount" ||
      name === "maxPersonCount" ||
      name === "pricePerPerson" ||
      name === "packageType"
    ) {
      processedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  const handlePackageTypeChange = (packageType: number) => {
    setFormData({ ...formData, packageType });
    if (errors.packageType) setErrors({ ...errors, packageType: "" });
  };

  const handleFeaturesChange = (features: AddFeatureRequest[]) => {
    setFormData({ ...formData, addFeatures: features });
  };

  const handleDayAccommodationsChange = (
    accommodations: DayAccommodation[],
  ) => {
    setFormData({ ...formData, dayAccommodations: accommodations });
  };

  const handleInclusionsChange = (inclusions: Inclusion[]) => {
    setFormData({ ...formData, inclusions });
  };

  const handleExclusionsChange = (exclusions: Exclusion[]) => {
    setFormData({ ...formData, exclusions });
  };

  const handleConditionsChange = (conditions: Condition[]) => {
    setFormData({ ...formData, conditions });
  };

  const handleTravelTipsChange = (travelTips: TravelTipRequest[]) => {
    setFormData({ ...formData, travelTips });
  };

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: PackageImageRequest[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.packageType)
      newErrors.packageType = "Package type is required";
    if (!formData.name.trim()) newErrors.name = "Package name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.totalPrice || formData.totalPrice <= 0)
      newErrors.totalPrice = "Valid total price is required";
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      newErrors.discountPercentage = "Discount must be between 0 and 100";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.minPersonCount || formData.minPersonCount < 1) {
      newErrors.minPersonCount = "Minimum persons must be at least 1";
    }
    if (
      !formData.maxPersonCount ||
      formData.maxPersonCount < formData.minPersonCount
    ) {
      newErrors.maxPersonCount = "Maximum must be greater than minimum";
    }
    if (!formData.pricePerPerson || formData.pricePerPerson <= 0) {
      newErrors.pricePerPerson = "Valid price per person is required";
    }
    if (formData.addFeatures.length === 0) {
      newErrors.addFeatures = "At least one feature is required";
    }
    if (formData.dayAccommodations.length === 0) {
      newErrors.dayAccommodations = "Day accommodations are required";
    }

    const hasUploadingImages = imagePreviews.some(
      (preview) => preview.uploading,
    );
    if (hasUploadingImages)
      newErrors.images = "Please wait for all images to finish uploading";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actual submission logic
  const submitPackage = async () => {
    setLoading(true);
    try {
      const response = await PackageService.addPackage(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Package Created Successfully!",
          message: `${formData.name} has been added to your packages.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add package");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle create button click - opens dialog
  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Handle confirm create from dialog
  const handleConfirmCreate = async () => {
    await submitPackage();
  };

  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFormData({
      packageType: 1,
      tourId: selectedTour?.tourId || 0,
      name: selectedTourDetails
        ? `${selectedTourDetails.tourName} Package`
        : "",
      description: selectedTourDetails?.tourDescription || "",
      totalPrice: 0,
      discountPercentage: 0,
      startDate: "",
      endDate: "",
      color: "#10b981",
      status: "ACTIVE",
      hoverColor: "#059669",
      minPersonCount: 1,
      maxPersonCount: 20,
      pricePerPerson: 0,
      images: [],
      addFeatures: [],
      dayAccommodations: selectedTourDetails
        ? Array.from({ length: selectedTourDetails.duration }, (_, i) => ({
            dayNumber: i + 1,
            breakfast: false,
            breakfastDescription: null,
            lunch: false,
            lunchDescription: null,
            dinner: false,
            dinnerDescription: null,
            morningTea: false,
            morningTeaDescription: null,
            eveningTea: false,
            eveningTeaDescription: null,
            snacks: false,
            snackNote: null,
            hotelId: 0,
            transportId: 0,
            otherNotes: null,
          }))
        : [],
      inclusions: [],
      exclusions: [],
      conditions: [],
      travelTips: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const getPackageLink = (): string => {
    if (toast.packageId) {
      return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/packages/${toast.packageId}`;
    }
    return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/packages`;
  };

  // Render selected tour details
  const renderSelectedTourDetails = () => {
    if (!selectedTourDetails) return null;

    return (
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.primary}30`,
          boxShadow: `0 0 0 2px ${theme.primary}10`,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            backgroundColor: `${theme.primary}08`,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" style={{ color: theme.success }} />
            <div>
              <h2
                className="text-base font-semibold"
                style={{ color: theme.text }}
              >
                Selected Tour
              </h2>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Tour details that will be used for this package
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearTour}
            className="text-sm px-3 py-1 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.error }}
          >
            Change Tour
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: theme.primary }} />
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Tour Name
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {selectedTourDetails.tourName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.primary }} />
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Duration
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {selectedTourDetails.duration} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Route
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {selectedTourDetails.startLocation} →{" "}
                  {selectedTourDetails.endLocation}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" style={{ color: theme.primary }} />
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Season
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {selectedTourDetails.seasonName}
                </p>
              </div>
            </div>
          </div>

          {selectedTourDetails.tourDescription && (
            <div
              className="mt-3 pt-3 border-t"
              style={{ borderColor: theme.border }}
            >
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Description
              </p>
              <p className="text-sm mt-1" style={{ color: theme.text }}>
                {selectedTourDetails.tourDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render tour search
  const renderTourSearch = () => (
    <div className="mb-8">
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div className="text-center mb-6">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: theme.text }}
          >
            {selectedTourDetails ? "Change Tour" : "Select a Tour"}
          </h2>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {selectedTourDetails
              ? "Search and select a different tour"
              : "Search and select a tour to create a package for"}
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: theme.textSecondary }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tours by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200"
              style={{
                color: theme.textSecondary,
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="absolute w-full mt-2 rounded-xl shadow-lg"
              style={{
                zIndex: 200,
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {loadingTours ? (
                <div
                  className="p-4 text-center text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  Loading tours...
                </div>
              ) : filteredTours.length === 0 ? (
                <div
                  className="p-4 text-center text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  No tours found
                </div>
              ) : (
                filteredTours.map((tour) => (
                  <button
                    key={tour.tourId}
                    type="button"
                    onClick={() => handleSelectTour(tour)}
                    className="w-full px-4 py-3 text-left transition-colors"
                    style={{
                      backgroundColor:
                        selectedTour?.tourId === tour.tourId
                          ? `${theme.primary}10`
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTour?.tourId !== tour.tourId)
                        e.currentTarget.style.backgroundColor = `${theme.border}30`;
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTour?.tourId !== tour.tourId)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {tour.tourName}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render package details form
  const renderPackageDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form className="space-y-8">
          {/* Basic Information */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: theme.text }}
              >
                Package Information
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Basic details for the package
              </p>
            </div>
            <div className="px-6 py-6 space-y-4">
              <PackageTypeSelector
                value={formData.packageType}
                onChange={handlePackageTypeChange}
                error={errors.packageType}
              />
              <InputField
                label="Package Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Luxury Sri Lanka Package"
                error={errors.name}
              />
              <InputField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                type="textarea"
                required
                rows={4}
                placeholder="Describe what makes this package special..."
                error={errors.description}
              />
              <StatusSelector
                value={formData.status as "ACTIVE" | "INACTIVE"}
                onChange={handleStatusChange}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center gap-2">
                <DollarSign
                  className="w-4 h-4"
                  style={{ color: theme.success }}
                />
                <h2
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Pricing
                </h2>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Total Price"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  type="number"
                  required
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  error={errors.totalPrice}
                  helperText="Total package price"
                />
                <InputField
                  label="Discount Percentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder="0"
                  error={errors.discountPercentage}
                  helperText="Discount percentage (0-100)"
                />
              </div>
              <InputField
                label="Price Per Person"
                name="pricePerPerson"
                value={formData.pricePerPerson}
                onChange={handleInputChange}
                type="number"
                required
                min={0}
                step={0.01}
                placeholder="0.00"
                error={errors.pricePerPerson}
                helperText="Price per person after discount"
              />
            </div>
          </div>

          {/* Date & Capacity */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: theme.warning }}
                />
                <h2
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Availability & Capacity
                </h2>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  type="date"
                  required
                  error={errors.startDate}
                />
                <InputField
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  type="date"
                  required
                  error={errors.endDate}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Minimum Persons"
                  name="minPersonCount"
                  value={formData.minPersonCount}
                  onChange={handleInputChange}
                  type="number"
                  required
                  min={1}
                  step={1}
                  placeholder="1"
                  error={errors.minPersonCount}
                />
                <InputField
                  label="Maximum Persons"
                  name="maxPersonCount"
                  value={formData.maxPersonCount}
                  onChange={handleInputChange}
                  type="number"
                  required
                  min={1}
                  step={1}
                  placeholder="20"
                  error={errors.maxPersonCount}
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: theme.text }}
              >
                Branding Colors
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Package Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-12 h-10 rounded border cursor-pointer"
                      style={{ borderColor: theme.border }}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="flex-1 px-4 py-2 rounded-xl border-2 text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Hover Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="hoverColor"
                      value={formData.hoverColor}
                      onChange={handleInputChange}
                      className="w-12 h-10 rounded border cursor-pointer"
                      style={{ borderColor: theme.border }}
                    />
                    <input
                      type="text"
                      value={formData.hoverColor}
                      onChange={(e) =>
                        setFormData({ ...formData, hoverColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 rounded-xl border-2 text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FeaturesForm
            features={formData.addFeatures}
            onFeaturesChange={handleFeaturesChange}
            error={errors.addFeatures}
          />

          <DayAccommodationsForm
            accommodations={formData.dayAccommodations}
            onAccommodationsChange={handleDayAccommodationsChange}
            hotels={hotels}
            vehicles={vehicles}
            error={errors.dayAccommodations}
          />

          <InclusionsExclusionsForm
            inclusions={formData.inclusions}
            exclusions={formData.exclusions}
            onInclusionsChange={handleInclusionsChange}
            onExclusionsChange={handleExclusionsChange}
          />

          <ConditionsTipsForm
            conditions={formData.conditions}
            travelTips={formData.travelTips}
            onConditionsChange={handleConditionsChange}
            onTravelTipsChange={handleTravelTipsChange}
          />

          <FormActions
            loading={loading}
            uploadingImages={uploadingImages}
            onSubmit={handleCreateClick}
            onReset={handleReset}
            errors={errors}
            submitText="Package"
            submitButtonType="button"
          />
        </form>
      </div>

      <div className="space-y-8">
        <ImageUploader<PackageImageRequest>
          images={formData.images}
          imagePreviews={imagePreviews}
          onImagePreviewsChange={handleImagePreviewsChange}
          onImagesChange={handleImagesChange}
          onUploadingChange={handleUploadingImagesChange}
          errors={errors}
          showColorPicker={true}
          defaultColor="#10b981"
          title="Package Images"
          description="Upload images or add by URL (each image can have an accent color)"
        />
        <FormSummary
          title="Package Summary"
          sections={[
            {
              label: "Package Name",
              value: formData.name || "Not set",
              icon: "eye",
              color: theme.primary,
            },
            {
              label: "Total Price",
              value: formData.totalPrice
                ? `$${formData.totalPrice.toFixed(2)}`
                : "Not set",
              icon: "dollar",
              color: theme.success,
            },
            {
              label: "Price Per Person",
              value: formData.pricePerPerson
                ? `$${formData.pricePerPerson.toFixed(2)}`
                : "Not set",
              icon: "dollar",
              color: theme.success,
            },
            {
              label: "Discount",
              value: formData.discountPercentage
                ? `${formData.discountPercentage}%`
                : "0%",
              icon: "dollar",
              color: theme.warning,
            },
            {
              label: "Date Range",
              value:
                formData.startDate && formData.endDate
                  ? `${formData.startDate} to ${formData.endDate}`
                  : "Not set",
              icon: "calendar",
              color: theme.accent,
            },
            {
              label: "Capacity",
              value:
                formData.minPersonCount && formData.maxPersonCount
                  ? `${formData.minPersonCount} - ${formData.maxPersonCount} persons`
                  : "Not set",
              icon: "users",
              color: theme.error,
            },
            {
              label: "Features",
              value: `${formData.addFeatures.length} feature(s)`,
              icon: "tag",
              color: theme.success,
            },
            {
              label: "Status",
              value: formData.status || "Not set",
              icon: "eye",
              color:
                formData.status === "ACTIVE"
                  ? theme.success
                  : theme.textSecondary,
            },
            {
              label: "Images",
              value:
                formData.images.length > 0
                  ? `${formData.images.length} image(s)`
                  : "No images",
              icon: "image",
              color: theme.error,
            },
          ]}
          tips={[
            "Set competitive pricing for better conversions",
            "Define clear date ranges for availability",
            "Add high-quality images to showcase the package",
            "Ensure discount percentage is accurate",
            "Set appropriate participant limits",
          ]}
        />
      </div>
    </div>
  );

  // Main render
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
          actionLink={toast.type === "success" ? getPackageLink() : undefined}
          actionText="View Package"
        />
      )}

      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Package"
            description="Create a new tour package"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTourSearch()}
        {selectedTourDetails && renderSelectedTourDetails()}
        {selectedTourDetails && renderPackageDetails()}
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Package",
          message: "Are you sure you want to create this tour package?",
          itemName: formData.name || "Untitled Package",
          type: "create",
          estimatedTime: "~3-4 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Verify that day accommodations are properly configured",
            "Check that inclusions and exclusions are accurate",
            "Ensure pricing and discount percentages are correct",
            "Review date ranges and participant limits",
            "You can edit this package anytime after creation",
          ],
        }}
        confirmText="Create Package"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Package created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create package:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create package. Please try again.",
            packageId: undefined,
          });
        }}
      />
    </div>
  );
};

export default AddNewPackagePage;
