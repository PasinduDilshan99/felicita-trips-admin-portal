"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageService } from "@/services/packageService";
import { ServiceProviderService } from "@/services/serviceProviderService";
import { VehicleService } from "@/services/vehicleService";
import {
  PackageNameId,
  PackageAllDetails,
  PackageFeatureResponse,
  PackageImageResponse,
  PackageInclusionResponse,
  PackageExclusionResponse,
  PackageConditionResponse,
  PackageTravelTipResponse,
  DayAccommodationResponse,
  UpdatePackageRequest,
  PackageBasicDetails,
  PackageImageRequest,
  UpdateImageRequest,
  AddFeatureRequest,
  UpdateFeatureRequest,
  AddDayAccommodationRequest,
  UpdateDayAccommodationRequest,
  Inclusion,
  UpdateInclusionRequest,
  Exclusion,
  UpdateExclusionRequest,
  Condition,
  UpdateConditionRequest,
  TravelTipRequest,
  UpdateTravelTipRequest,
} from "@/types/package-types";
import { ServiceProviderIdName as ServiceProviderType } from "@/types/service-provider-types";
import { VehicleIdName as VehicleType } from "@/types/vehicle-types";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CameraIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

// Notification Component
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  packageName?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, packageName, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 30; // seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - (100 / (duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-slide-in">
      <div className={`relative overflow-hidden rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {type === 'success' ? 
                <CheckCircleIcon className="w-5 h-5" /> : 
                <ExclamationTriangleIcon className="w-5 h-5" />
              }
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-semibold ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {type === 'success' ? 'Package Updated Successfully!' : 'Update Failed'}
              </h3>
              <p className={`text-sm mt-1 ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
              {packageName && type === 'success' && (
                <p className="text-xs text-green-600 mt-1">
                  Package: <span className="font-medium">{packageName}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`h-1 w-full ${
          type === 'success' ? 'bg-green-200' : 'bg-red-200'
        }`}>
          <div
            className={`h-full transition-all duration-100 ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Change Badge Component
const ChangeBadge: React.FC<{ count: number; type: 'add' | 'remove' | 'update' }> = ({ count, type }) => {
  if (count === 0) return null;
  
  const config = {
    add: { color: 'bg-green-100 text-green-800', text: 'to add' },
    remove: { color: 'bg-red-100 text-red-800', text: 'to remove' },
    update: { color: 'bg-blue-100 text-blue-800', text: 'updated' }
  }[type];

  return (
    <span className={`px-2 py-1 ${config.color} text-xs rounded-full ml-2`}>
      {count} {config.text}
    </span>
  );
};

const UpdatePackagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPackageId = searchParams?.get("package-id");
  const initialPackageName = searchParams?.get("package-name");

  // Package Selection State
  const [packageSearch, setPackageSearch] = useState("");
  const [packageResults, setPackageResults] = useState<PackageNameId[]>([]);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageNameId | null>(
    initialPackageId && initialPackageName
      ? { packageId: parseInt(initialPackageId), packageName: initialPackageName }
      : null
  );
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Package Details State
  const [packageDetails, setPackageDetails] = useState<PackageAllDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // External Data State
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderType[]>([]);
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [loadingExternalData, setLoadingExternalData] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState<UpdatePackageRequest>({
    packageId: 0,
    packageBasicDetails: {
      packageType: 1,
      tourId: 0,
      name: "",
      description: "",
      totalPrice: 0,
      discountPercentage: 0,
      startDate: "",
      endDate: "",
      color: "#3B82F6",
      hoverColor: "#2563EB",
      status: "ACTIVE",
      minPersonCount: 2,
      maxPersonCount: 10,
      pricePerPerson: 0,
    },
    removedImageIds: [],
    addImages: [],
    updatedImages: [],
    addFeatures: [],
    removeFeatureIds: [],
    updatedFeatures: [],
    addDayAccommodations: [],
    removeDayAccommodationIds: [],
    updatedDayAccommodations: [],
    addInclusions: [],
    removeInclusionIds: [],
    updatedInclusions: [],
    addExclusions: [],
    removeExclusionIds: [],
    updatedExclusions: [],
    addConditions: [],
    removeConditionIds: [],
    updatedConditions: [],
    addTravelTips: [],
    removeTravelTipIds: [],
    updatedTravelTips: [],
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    packageName?: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize data
  useEffect(() => {
    fetchExternalData();
    if (!selectedPackage) {
      fetchPackageNames();
    }
  }, []);

  // Load package details if initialPackageId exists
  useEffect(() => {
    if (initialPackageId && !selectedPackage) {
      const initialPackage = {
        packageId: parseInt(initialPackageId),
        packageName: initialPackageName || `Package ${initialPackageId}`
      };
      handleSelectPackage(initialPackage);
    }
  }, [initialPackageId, initialPackageName]);

  // Load package details when selected
  useEffect(() => {
    if (selectedPackage) {
      fetchPackageDetails(selectedPackage.packageId);
    }
  }, [selectedPackage]);

  // Filter packages based on search
  const filteredPackages = packageResults.filter(
    (pkg) =>
      pkg.packageName.toLowerCase().includes(packageSearch.toLowerCase()) ||
      pkg.packageId.toString().includes(packageSearch)
  );

  // Check for changes in form data
  useEffect(() => {
    const calculateChanges = () => {
      const totalChanges = 
        formData.removedImageIds.length +
        formData.addImages.length +
        formData.updatedImages.length +
        formData.addFeatures.length +
        formData.removeFeatureIds.length +
        formData.updatedFeatures.length +
        formData.addDayAccommodations.length +
        formData.removeDayAccommodationIds.length +
        formData.updatedDayAccommodations.length +
        formData.addInclusions.length +
        formData.removeInclusionIds.length +
        formData.updatedInclusions.length +
        formData.addExclusions.length +
        formData.removeExclusionIds.length +
        formData.updatedExclusions.length +
        formData.addConditions.length +
        formData.removeConditionIds.length +
        formData.updatedConditions.length +
        formData.addTravelTips.length +
        formData.removeTravelTipIds.length +
        formData.updatedTravelTips.length;

      // Check if basic details have changed
      const hasBasicChanges = packageDetails && (
        formData.packageBasicDetails.name !== packageDetails.packageName ||
        formData.packageBasicDetails.description !== packageDetails.packageDescription ||
        formData.packageBasicDetails.totalPrice !== packageDetails.totalPrice ||
        formData.packageBasicDetails.discountPercentage !== packageDetails.discountPercentage ||
        formData.packageBasicDetails.startDate !== packageDetails.startDate ||
        formData.packageBasicDetails.endDate !== packageDetails.endDate ||
        formData.packageBasicDetails.color !== packageDetails.color ||
        formData.packageBasicDetails.hoverColor !== packageDetails.hoverColor ||
        formData.packageBasicDetails.status !== packageDetails.packageStatus ||
        formData.packageBasicDetails.minPersonCount !== packageDetails.minPersonCount ||
        formData.packageBasicDetails.maxPersonCount !== packageDetails.maxPersonCount ||
        formData.packageBasicDetails.pricePerPerson !== packageDetails.pricePerPerson
      );

      setHasChanges(totalChanges > 0 || hasBasicChanges );
    };

    calculateChanges();
  }, [formData, packageDetails]);

  // Fetch all package names
  const fetchPackageNames = async () => {
    setLoadingPackages(true);
    try {
      const response = await PackageService.getAllPackageNames();
      setPackageResults(response.data);
    } catch (error: any) {
      showNotification('error', error.message || "Failed to load packages");
    } finally {
      setLoadingPackages(false);
    }
  };

  // Fetch external data (hotels and vehicles)
  const fetchExternalData = async () => {
    setLoadingExternalData(true);
    try {
      const [hotelsRes, vehiclesRes] = await Promise.all([
        ServiceProviderService.getAllServiceProviders(),
        VehicleService.getAllVehicles()
      ]);
      setServiceProviders(hotelsRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error: any) {
      showNotification('error', "Failed to load hotels and vehicles");
    } finally {
      setLoadingExternalData(false);
    }
  };

  // Fetch package details
  const fetchPackageDetails = async (packageId: number) => {
    setLoadingDetails(true);
    try {
      const response = await PackageService.getPackageAllDetails(packageId);
      const details = response.data;
      setPackageDetails(details);

      // Initialize form data with fetched details
      setFormData({
        packageId: details.packageId,
        packageBasicDetails: {
          packageType: 1, // You'll need to map this from packageTypeName
          tourId: details.tourId,
          name: details.packageName,
          description: details.packageDescription,
          totalPrice: details.totalPrice,
          discountPercentage: details.discountPercentage,
          startDate: details.startDate,
          endDate: details.endDate,
          color: details.color,
          hoverColor: details.hoverColor,
          status: details.packageStatus,
          minPersonCount: details.minPersonCount,
          maxPersonCount: details.maxPersonCount,
          pricePerPerson: details.pricePerPerson,
        },
        removedImageIds: [],
        addImages: [],
        updatedImages: [],
        addFeatures: [],
        removeFeatureIds: [],
        updatedFeatures: [],
        addDayAccommodations: [],
        removeDayAccommodationIds: [],
        updatedDayAccommodations: [],
        addInclusions: [],
        removeInclusionIds: [],
        updatedInclusions: [],
        addExclusions: [],
        removeExclusionIds: [],
        updatedExclusions: [],
        addConditions: [],
        removeConditionIds: [],
        updatedConditions: [],
        addTravelTips: [],
        removeTravelTipIds: [],
        updatedTravelTips: [],
      });
    } catch (error: any) {
      showNotification('error', error.message || "Failed to load package details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle package selection
  const handleSelectPackage = (pkg: PackageNameId) => {
    setSelectedPackage(pkg);
    setPackageSearch(pkg.packageName);
    setShowPackageDropdown(false);
  };

  // Handle basic details changes
  const handleBasicDetailsChange = (field: keyof PackageBasicDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      packageBasicDetails: {
        ...prev.packageBasicDetails,
        [field]: value,
      },
    }));

    // Recalculate price per person if relevant fields change
    if (field === 'totalPrice' || field === 'discountPercentage' || field === 'maxPersonCount') {
      const currentTotal = field === 'totalPrice' ? value : formData.packageBasicDetails.totalPrice;
      const currentDiscount = field === 'discountPercentage' ? value : formData.packageBasicDetails.discountPercentage;
      const currentMaxGroup = field === 'maxPersonCount' ? value : formData.packageBasicDetails.maxPersonCount;
      
      const discountedPrice = currentTotal * (1 - currentDiscount / 100);
      const perPerson = currentMaxGroup > 0 ? discountedPrice / currentMaxGroup : 0;
      
      setFormData(prev => ({
        ...prev,
        packageBasicDetails: {
          ...prev.packageBasicDetails,
          pricePerPerson: parseFloat(perPerson.toFixed(2)),
        },
      }));
    }
  };

  // Get current value for existing items (merged from packageDetails and formData)
  const getCurrentImage = (imageId: number) => {
    const original = packageDetails?.packageImages.find(img => img.imageId === imageId);
    if (!original) return null;
    
    const updated = formData.updatedImages.find(img => img.imageId === imageId);
    return updated ? { ...original, ...updated } : original;
  };

  const getCurrentFeature = (featureId: number) => {
    const original = packageDetails?.packageFeatures.find(feat => feat.featureId === featureId);
    if (!original) return null;
    
    const updated = formData.updatedFeatures.find(feat => feat.featureId === featureId);
    return updated ? { ...original, ...updated } : original;
  };

  const getCurrentInclusion = (inclusionId: number) => {
    const original = packageDetails?.inclusions.find(inc => inc.id === inclusionId);
    if (!original) return null;
    
    const updated = formData.updatedInclusions.find(inc => inc.packageInclusionId === inclusionId);
    return updated ? { ...original, description: updated.inclusionText, displayOrder: updated.displayOrder } : original;
  };

  const getCurrentExclusion = (exclusionId: number) => {
    const original = packageDetails?.exclusions.find(exc => exc.id === exclusionId);
    if (!original) return null;
    
    const updated = formData.updatedExclusions.find(exc => exc.packageExclusionId === exclusionId);
    return updated ? { ...original, description: updated.exclusionText, displayOrder: updated.displayOrder } : original;
  };

  const getCurrentCondition = (conditionId: number) => {
    const original = packageDetails?.conditions.find(cond => cond.id === conditionId);
    if (!original) return null;
    
    const updated = formData.updatedConditions.find(cond => cond.packageConditionId === conditionId);
    return updated ? { ...original, description: updated.conditionText, displayOrder: updated.displayOrder } : original;
  };

  const getCurrentTravelTip = (tipId: number) => {
    const original = packageDetails?.travelTips.find(tip => tip.id === tipId);
    if (!original) return null;
    
    const updated = formData.updatedTravelTips.find(tip => tip.packageTipId === tipId);
    return updated ? { ...original, title: updated.tipTitle, description: updated.tipDescription, displayOrder: updated.displayOrder } : original;
  };

  const getCurrentDayAccommodation = (dayId: number) => {
    const original = packageDetails?.dayAccommodationResponses.packageDayByDayDtoList.find(day => day.packageDayAccommodationId === dayId);
    if (!original) return null;
    
    const updated = formData.updatedDayAccommodations.find(day => day.packageDayAccommodationId === dayId);
    return updated ? { ...original, ...updated } : original;
  };

  // Image Management
  const handleAddImage = () => {
    const newImage: PackageImageRequest = {
      name: "",
      description: "",
      status: "ACTIVE",
      imageUrl: "",
      color: "#3B82F6",
      createdBy: 1,
    };
    setFormData(prev => ({
      ...prev,
      addImages: [...prev.addImages, newImage],
    }));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setFormData(prev => ({
      ...prev,
      removedImageIds: [...prev.removedImageIds, imageId],
    }));
  };

  const handleUpdateImage = (imageId: number, field: keyof UpdateImageRequest, value: any) => {
    const existingImage = packageDetails?.packageImages.find(img => img.imageId === imageId);
    if (!existingImage) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedImages.findIndex(
        img => img.imageId === imageId
      );

      if (existingUpdateIndex >= 0) {
        const updatedImages = [...prev.updatedImages];
        updatedImages[existingUpdateIndex] = {
          ...updatedImages[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedImages };
      } else {
        const updateData: UpdateImageRequest = {
          imageId,
          imageName: existingImage.imageName,
          imageDescription: existingImage.imageDescription,
          status: "ACTIVE",
          imageUrl: existingImage.imageUrl,
          color: existingImage.color,
          [field]: value,
        };
        return { ...prev, updatedImages: [...prev.updatedImages, updateData] };
      }
    });
  };

  // Feature Management
  const handleAddFeature = () => {
    const newFeature: AddFeatureRequest = {
      featureName: "",
      featureValue: "",
      featureDescription: "",
      status: "ACTIVE",
      color: "#3B82F6",
      hoverColor: "#2563EB",
      specialNote: "",
    };
    setFormData(prev => ({
      ...prev,
      addFeatures: [...prev.addFeatures, newFeature],
    }));
  };

  const handleRemoveExistingFeature = (featureId: number) => {
    setFormData(prev => ({
      ...prev,
      removeFeatureIds: [...prev.removeFeatureIds, featureId],
    }));
  };

  const handleUpdateFeature = (featureId: number, field: keyof UpdateFeatureRequest, value: any) => {
    const existingFeature = packageDetails?.packageFeatures.find(feat => feat.featureId === featureId);
    if (!existingFeature) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedFeatures.findIndex(
        feat => feat.featureId === featureId
      );

      if (existingUpdateIndex >= 0) {
        const updatedFeatures = [...prev.updatedFeatures];
        updatedFeatures[existingUpdateIndex] = {
          ...updatedFeatures[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedFeatures };
      } else {
        const updateData: UpdateFeatureRequest = {
          featureId,
          featureName: existingFeature.featureName,
          featureValue: existingFeature.featureValue,
          featureDescription: existingFeature.featureDescription,
          status: "ACTIVE",
          color: existingFeature.color,
          hoverColor: existingFeature.hoverColor || "#2563EB",
          specialNote: existingFeature.specialNote || "",
          [field]: value,
        };
        return { ...prev, updatedFeatures: [...prev.updatedFeatures, updateData] };
      }
    });
  };

  // Day Accommodation Management
  const handleAddDayAccommodation = () => {
    const newDay: AddDayAccommodationRequest = {
      dayNumber: (packageDetails?.dayAccommodationResponses.packageDayByDayDtoList.length || 0) + 1,
      breakfast: true,
      breakfastDescription: "Hotel buffet breakfast",
      lunch: true,
      lunchDescription: "Lunch at local restaurant",
      dinner: true,
      dinnerDescription: "Dinner at hotel",
      morningTea: true,
      morningTeaDescription: "Morning tea",
      eveningTea: true,
      eveningTeaDescription: "Evening tea",
      snacks: true,
      snackNote: "Light snacks provided",
      hotelId: serviceProviders.length > 0 ? serviceProviders[0].serviceProviderId : 1,
      transportId: vehicles.length > 0 ? vehicles[0].vehicleId : 1,
      otherNotes: "",
    };
    setFormData(prev => ({
      ...prev,
      addDayAccommodations: [...prev.addDayAccommodations, newDay],
    }));
  };

  const handleRemoveExistingDayAccommodation = (dayAccommodationId: number) => {
    setFormData(prev => ({
      ...prev,
      removeDayAccommodationIds: [...prev.removeDayAccommodationIds, dayAccommodationId],
    }));
  };

  const handleUpdateDayAccommodation = (dayAccommodationId: number, field: keyof UpdateDayAccommodationRequest, value: any) => {
    const existingDay = packageDetails?.dayAccommodationResponses.packageDayByDayDtoList.find(
      day => day.packageDayAccommodationId === dayAccommodationId
    );
    if (!existingDay) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedDayAccommodations.findIndex(
        day => day.packageDayAccommodationId === dayAccommodationId
      );

      if (existingUpdateIndex >= 0) {
        const updatedDays = [...prev.updatedDayAccommodations];
        updatedDays[existingUpdateIndex] = {
          ...updatedDays[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedDayAccommodations: updatedDays };
      } else {
        const updateData: UpdateDayAccommodationRequest = {
          packageDayAccommodationId: dayAccommodationId,
          dayNumber: existingDay.dayNumber,
          breakfast: existingDay.breakfast,
          breakfastDescription: existingDay.breakfastDescription,
          lunch: existingDay.lunch,
          lunchDescription: existingDay.lunchDescription,
          dinner: existingDay.dinner,
          dinnerDescription: existingDay.dinnerDescription,
          morningTea: existingDay.morningTea,
          morningTeaDescription: existingDay.morningTeaDescription,
          eveningTea: existingDay.eveningTea,
          eveningTeaDescription: existingDay.eveningTeaDescription,
          snacks: existingDay.snacks,
          snackNote: existingDay.snackNote,
          hotelId: existingDay.hotelId,
          transportId: existingDay.transportId,
          otherNotes: existingDay.otherNotes,
          status: "ACTIVE",
          [field]: value,
        };
        return { ...prev, updatedDayAccommodations: [...prev.updatedDayAccommodations, updateData] };
      }
    });
  };

  // Inclusion Management
  const handleAddInclusion = () => {
    const newInclusion: Inclusion = {
      inclusionText: "",
      displayOrder: (packageDetails?.inclusions.length || 0) + (formData.addInclusions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData(prev => ({
      ...prev,
      addInclusions: [...prev.addInclusions, newInclusion],
    }));
  };

  const handleRemoveExistingInclusion = (inclusionId: number) => {
    setFormData(prev => ({
      ...prev,
      removeInclusionIds: [...prev.removeInclusionIds, inclusionId],
    }));
  };

  const handleUpdateInclusion = (inclusionId: number, field: keyof UpdateInclusionRequest, value: any) => {
    const existingInclusion = packageDetails?.inclusions.find(inc => inc.id === inclusionId);
    if (!existingInclusion) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedInclusions.findIndex(
        inc => inc.packageInclusionId === inclusionId
      );

      if (existingUpdateIndex >= 0) {
        const updatedInclusions = [...prev.updatedInclusions];
        updatedInclusions[existingUpdateIndex] = {
          ...updatedInclusions[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedInclusions };
      } else {
        const updateData: UpdateInclusionRequest = {
          packageInclusionId: inclusionId,
          inclusionText: existingInclusion.description,
          displayOrder: existingInclusion.displayOrder,
          status: "ACTIVE",
          [field]: value,
        };
        return { ...prev, updatedInclusions: [...prev.updatedInclusions, updateData] };
      }
    });
  };

  // Exclusion Management
  const handleAddExclusion = () => {
    const newExclusion: Exclusion = {
      exclusionText: "",
      displayOrder: (packageDetails?.exclusions.length || 0) + (formData.addExclusions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData(prev => ({
      ...prev,
      addExclusions: [...prev.addExclusions, newExclusion],
    }));
  };

  const handleRemoveExistingExclusion = (exclusionId: number) => {
    setFormData(prev => ({
      ...prev,
      removeExclusionIds: [...prev.removeExclusionIds, exclusionId],
    }));
  };

  const handleUpdateExclusion = (exclusionId: number, field: keyof UpdateExclusionRequest, value: any) => {
    const existingExclusion = packageDetails?.exclusions.find(exc => exc.id === exclusionId);
    if (!existingExclusion) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedExclusions.findIndex(
        exc => exc.packageExclusionId === exclusionId
      );

      if (existingUpdateIndex >= 0) {
        const updatedExclusions = [...prev.updatedExclusions];
        updatedExclusions[existingUpdateIndex] = {
          ...updatedExclusions[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedExclusions };
      } else {
        const updateData: UpdateExclusionRequest = {
          packageExclusionId: exclusionId,
          exclusionText: existingExclusion.description,
          displayOrder: existingExclusion.displayOrder,
          status: "ACTIVE",
          [field]: value,
        };
        return { ...prev, updatedExclusions: [...prev.updatedExclusions, updateData] };
      }
    });
  };

  // Condition Management
  const handleAddCondition = () => {
    const newCondition: Condition = {
      conditionText: "",
      displayOrder: (packageDetails?.conditions.length || 0) + (formData.addConditions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData(prev => ({
      ...prev,
      addConditions: [...prev.addConditions, newCondition],
    }));
  };

  const handleRemoveExistingCondition = (conditionId: number) => {
    setFormData(prev => ({
      ...prev,
      removeConditionIds: [...prev.removeConditionIds, conditionId],
    }));
  };

  const handleUpdateCondition = (conditionId: number, field: keyof UpdateConditionRequest, value: any) => {
    const existingCondition = packageDetails?.conditions.find(cond => cond.id === conditionId);
    if (!existingCondition) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedConditions.findIndex(
        cond => cond.packageConditionId === conditionId
      );

      if (existingUpdateIndex >= 0) {
        const updatedConditions = [...prev.updatedConditions];
        updatedConditions[existingUpdateIndex] = {
          ...updatedConditions[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedConditions };
      } else {
        const updateData: UpdateConditionRequest = {
          packageConditionId: conditionId,
          conditionText: existingCondition.description,
          displayOrder: existingCondition.displayOrder,
          status: "ACTIVE",
          [field]: value,
        };
        return { ...prev, updatedConditions: [...prev.updatedConditions, updateData] };
      }
    });
  };

  // Travel Tip Management
  const handleAddTravelTip = () => {
    const newTravelTip: TravelTipRequest = {
      tipTitle: "",
      tipDescription: "",
      displayOrder: (packageDetails?.travelTips.length || 0) + (formData.addTravelTips.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData(prev => ({
      ...prev,
      addTravelTips: [...prev.addTravelTips, newTravelTip],
    }));
  };

  const handleRemoveExistingTravelTip = (travelTipId: number) => {
    setFormData(prev => ({
      ...prev,
      removeTravelTipIds: [...prev.removeTravelTipIds, travelTipId],
    }));
  };

  const handleUpdateTravelTip = (travelTipId: number, field: keyof UpdateTravelTipRequest, value: any) => {
    const existingTip = packageDetails?.travelTips.find(tip => tip.id === travelTipId);
    if (!existingTip) return;

    setFormData(prev => {
      const existingUpdateIndex = prev.updatedTravelTips.findIndex(
        tip => tip.packageTipId === travelTipId
      );

      if (existingUpdateIndex >= 0) {
        const updatedTravelTips = [...prev.updatedTravelTips];
        updatedTravelTips[existingUpdateIndex] = {
          ...updatedTravelTips[existingUpdateIndex],
          [field]: value,
        };
        return { ...prev, updatedTravelTips };
      } else {
        const updateData: UpdateTravelTipRequest = {
          packageTipId: travelTipId,
          tipTitle: existingTip.title,
          tipDescription: existingTip.description,
          displayOrder: existingTip.displayOrder,
          status: "ACTIVE",
          [field]: value,
        };
        return { ...prev, updatedTravelTips: [...prev.updatedTravelTips, updateData] };
      }
    });
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string, packageName?: string) => {
    setNotification({
      type,
      message,
      packageName: packageName || selectedPackage?.packageName
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 30000);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) {
      showNotification('error', "No changes to update");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.packageBasicDetails.name.trim()) {
        throw new Error("Package name is required");
      }
      if (!formData.packageBasicDetails.description.trim()) {
        throw new Error("Description is required");
      }
      if (formData.packageBasicDetails.totalPrice <= 0) {
        throw new Error("Total price must be greater than 0");
      }
      if (!formData.packageBasicDetails.startDate || !formData.packageBasicDetails.endDate) {
        throw new Error("Start date and end date are required");
      }

      const startDate = new Date(formData.packageBasicDetails.startDate);
      const endDate = new Date(formData.packageBasicDetails.endDate);
      if (endDate < startDate) {
        throw new Error("End date must be after start date");
      }

      // Send update request
      const response = await PackageService.updatePackage(formData);

      if (response.code === 200) {
        showNotification('success', "Package updated successfully!", formData.packageBasicDetails.name);
        
        // Refresh package details
        if (selectedPackage) {
          await fetchPackageDetails(selectedPackage.packageId);
        }
      } else {
        throw new Error(response.message || "Failed to update package");
      }
    } catch (error: any) {
      showNotification('error', error.message || "Failed to update package");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total changes for display
  const calculateTotalChanges = () => {
    return (
      formData.removedImageIds.length +
      formData.addImages.length +
      formData.updatedImages.length +
      formData.addFeatures.length +
      formData.removeFeatureIds.length +
      formData.updatedFeatures.length +
      formData.addDayAccommodations.length +
      formData.removeDayAccommodationIds.length +
      formData.updatedDayAccommodations.length +
      formData.addInclusions.length +
      formData.removeInclusionIds.length +
      formData.updatedInclusions.length +
      formData.addExclusions.length +
      formData.removeExclusionIds.length +
      formData.updatedExclusions.length +
      formData.addConditions.length +
      formData.removeConditionIds.length +
      formData.updatedConditions.length +
      formData.addTravelTips.length +
      formData.removeTravelTipIds.length +
      formData.updatedTravelTips.length
    );
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedPackage) {
      fetchPackageDetails(selectedPackage.packageId);
    }
  };

  // If no package selected, show package selection
  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Update Package</h1>
            <p className="text-gray-600 mt-2">Select a package to update its details</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="relative mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search Package *
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={packageSearch}
                  onChange={(e) => {
                    setPackageSearch(e.target.value);
                    setShowPackageDropdown(true);
                  }}
                  onFocus={() => setShowPackageDropdown(true)}
                  placeholder="Type package name or ID to search..."
                  className="text-gray-800 w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                {loadingPackages && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* Package Dropdown */}
              {showPackageDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl max-h-72 overflow-auto">
                  {loadingPackages ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading packages...</p>
                    </div>
                  ) : filteredPackages.length === 0 ? (
                    <div className="p-8 text-center">
                      <ExclamationTriangleIcon className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No packages found</p>
                      <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <button
                        key={pkg.packageId}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectPackage(pkg);
                        }}
                        className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b last:border-b-0 transition-colors duration-150 group"
                      >
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {pkg.packageName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">ID: {pkg.packageId}</div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Click outside to close dropdown */}
              {showPackageDropdown && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowPackageDropdown(false)}
                />
              )}
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push("/dashboard/packages")}
                className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-semibold shadow-sm hover:shadow"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2.5" />
                Back to Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If loading details
  if (loadingDetails || loadingExternalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <InformationCircleIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Package Details...</h3>
          <p className="text-gray-600 max-w-md">
            Fetching package information, hotels, and vehicles. This may take a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          packageName={notification.packageName}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Update Package</h1>
                <p className="text-gray-600 mt-2">
                  Editing: <span className="font-semibold text-blue-600">{selectedPackage.packageName}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasChanges && (
                  <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <CloudArrowUpIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{calculateTotalChanges()} pending changes</span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(null);
                    setPackageSearch("");
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl border border-gray-300 hover:border-gray-400 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-medium shadow-sm"
                >
                  Change Package
                </button>
              </div>
            </div>
          </div>

          {packageDetails && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Package Basic Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                      <InformationCircleIcon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Basic Information</h2>
                      <p className="text-gray-600 text-sm mt-1">Core package details and pricing</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                    Edit fields to update
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Package Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      value={formData.packageBasicDetails.name}
                      onChange={(e) => handleBasicDetailsChange('name', e.target.value)}
                      className="text-gray-800 w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., Premium Sigiriya Experience"
                      required
                    />
                    {formData.packageBasicDetails.name !== packageDetails.packageName && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-600 font-medium">Modified from original</span>
                      </div>
                    )}
                  </div>

                  {/* Package Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Package Type *
                    </label>
                    <select
                      value={formData.packageBasicDetails.packageType}
                      onChange={(e) => handleBasicDetailsChange('packageType', parseInt(e.target.value))}
                      className="text-gray-800 w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                      required
                    >
                      <option value="1">Standard</option>
                      <option value="2">Premium</option>
                      <option value="3">Luxury</option>
                      <option value="4">Budget</option>
                      <option value="5">All-Inclusive</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description *
                    </label>
                    <textarea
                      value={formData.packageBasicDetails.description}
                      onChange={(e) => handleBasicDetailsChange('description', e.target.value)}
                      rows={3}
                      className="text-gray-800 w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Describe your package in detail..."
                      required
                    />
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Total Price (LKR) *
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.packageBasicDetails.totalPrice}
                        onChange={(e) => handleBasicDetailsChange('totalPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={formData.packageBasicDetails.discountPercentage}
                      onChange={(e) => handleBasicDetailsChange('discountPercentage', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="text-gray-800 w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Group Size */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Minimum Group Size *
                    </label>
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.packageBasicDetails.minPersonCount}
                        onChange={(e) => handleBasicDetailsChange('minPersonCount', parseInt(e.target.value) || 2)}
                        min="1"
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Maximum Group Size *
                    </label>
                    <div className="relative">
                      <UsersIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.packageBasicDetails.maxPersonCount}
                        onChange={(e) => handleBasicDetailsChange('maxPersonCount', parseInt(e.target.value) || 10)}
                        min="1"
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Price Per Person (Calculated) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price Per Person (LKR)
                    </label>
                    <div className="relative">
                      <ChartBarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.packageBasicDetails.pricePerPerson.toFixed(2)}
                        readOnly
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Calculated automatically based on discount and group size</p>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Start Date *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.packageBasicDetails.startDate}
                        onChange={(e) => handleBasicDetailsChange('startDate', e.target.value)}
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      End Date *
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.packageBasicDetails.endDate}
                        onChange={(e) => handleBasicDetailsChange('endDate', e.target.value)}
                        className="text-gray-800 w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.packageBasicDetails.color}
                          onChange={(e) => handleBasicDetailsChange('color', e.target.value)}
                          className="w-12 h-12 cursor-pointer rounded-xl border-2 border-gray-300"
                        />
                        <div 
                          className="absolute inset-0 rounded-xl border-2 border-white shadow-sm"
                          style={{ backgroundColor: formData.packageBasicDetails.color }}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.packageBasicDetails.color}
                        onChange={(e) => handleBasicDetailsChange('color', e.target.value)}
                        className="text-gray-800 flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Hover Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.packageBasicDetails.hoverColor}
                          onChange={(e) => handleBasicDetailsChange('hoverColor', e.target.value)}
                          className="w-12 h-12 cursor-pointer rounded-xl border-2 border-gray-300"
                        />
                        <div 
                          className="absolute inset-0 rounded-xl border-2 border-white shadow-sm"
                          style={{ backgroundColor: formData.packageBasicDetails.hoverColor }}
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.packageBasicDetails.hoverColor}
                        onChange={(e) => handleBasicDetailsChange('hoverColor', e.target.value)}
                        className="text-gray-800 flex-1 px-4 py-3.5 border-2 border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Status *
                    </label>
                    <select
                      value={formData.packageBasicDetails.status}
                      onChange={(e) => handleBasicDetailsChange('status', e.target.value)}
                      className="text-gray-800 w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Package Images Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-200 rounded-xl">
                      <CameraIcon className="w-7 h-7 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Images Management</h2>
                      <p className="text-gray-600 text-sm mt-1">Manage package images and thumbnails</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removedImageIds.length} type="remove" />
                      <ChangeBadge count={formData.addImages.length} type="add" />
                      <ChangeBadge count={formData.updatedImages.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Image
                  </button>
                </div>

                {/* Existing Images */}
                {packageDetails.packageImages
                  .filter(img => !formData.removedImageIds.includes(img.imageId))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Images</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.packageImages.length} images total
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {packageDetails.packageImages
                        .filter(img => !formData.removedImageIds.includes(img.imageId))
                        .map((image) => {
                          const currentImage = getCurrentImage(image.imageId);
                          return (
                            <div 
                              key={image.imageId} 
                              className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-200"
                            >
                              <div className="flex justify-between items-center mb-5">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {currentImage?.imageName || image.imageName}
                                </h4>
                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(image.imageId)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    title="Remove image"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                  <input
                                    type="text"
                                    value={currentImage?.imageUrl || image.imageUrl}
                                    onChange={(e) => handleUpdateImage(image.imageId, 'imageUrl', e.target.value)}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                  <textarea
                                    value={currentImage?.imageDescription || image.imageDescription}
                                    onChange={(e) => handleUpdateImage(image.imageId, 'imageDescription', e.target.value)}
                                    rows={2}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Image description"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <input
                                        type="color"
                                        value={currentImage?.color || image.color}
                                        onChange={(e) => handleUpdateImage(image.imageId, 'color', e.target.value)}
                                        className="w-10 h-10 cursor-pointer rounded-lg border-2 border-gray-300"
                                      />
                                      <div 
                                        className="absolute inset-0 rounded-lg border-2 border-white shadow-sm"
                                        style={{ backgroundColor: currentImage?.color || image.color }}
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={currentImage?.color || image.color}
                                      onChange={(e) => handleUpdateImage(image.imageId, 'color', e.target.value)}
                                      className="text-gray-800 flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                                  <span>ID: {image.imageId}</span>
                                  {currentImage !== image && (
                                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      Modified
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Images to Add */}
                {formData.addImages.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Images to Add</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {formData.addImages.map((image, index) => (
                        <div key={index} className="border-2 border-dashed border-blue-300 rounded-xl p-5 bg-blue-50/50">
                          <div className="flex justify-between items-center mb-5">
                            <h4 className="font-semibold text-gray-900">New Image {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  addImages: prev.addImages.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image Name</label>
                              <input
                                type="text"
                                value={image.name}
                                onChange={(e) => {
                                  const newImages = [...formData.addImages];
                                  newImages[index].name = e.target.value;
                                  setFormData(prev => ({ ...prev, addImages: newImages }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., Hero Image"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <input
                                type="text"
                                value={image.description}
                                onChange={(e) => {
                                  const newImages = [...formData.addImages];
                                  newImages[index].description = e.target.value;
                                  setFormData(prev => ({ ...prev, addImages: newImages }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Image description"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                              <input
                                type="text"
                                value={image.imageUrl}
                                onChange={(e) => {
                                  const newImages = [...formData.addImages];
                                  newImages[index].imageUrl = e.target.value;
                                  setFormData(prev => ({ ...prev, addImages: newImages }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <input
                                    type="color"
                                    value={image.color}
                                    onChange={(e) => {
                                      const newImages = [...formData.addImages];
                                      newImages[index].color = e.target.value;
                                      setFormData(prev => ({ ...prev, addImages: newImages }));
                                    }}
                                    className="w-10 h-10 cursor-pointer rounded-lg border-2 border-gray-300"
                                  />
                                  <div 
                                    className="absolute inset-0 rounded-lg border-2 border-white shadow-sm"
                                    style={{ backgroundColor: image.color }}
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={image.color}
                                  onChange={(e) => {
                                    const newImages = [...formData.addImages];
                                    newImages[index].color = e.target.value;
                                    setFormData(prev => ({ ...prev, addImages: newImages }));
                                  }}
                                  className="text-gray-800 flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Package Features Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-200 rounded-xl">
                      <TagIcon className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Features Management</h2>
                      <p className="text-gray-600 text-sm mt-1">Manage package features and specifications</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeFeatureIds.length} type="remove" />
                      <ChangeBadge count={formData.addFeatures.length} type="add" />
                      <ChangeBadge count={formData.updatedFeatures.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Feature
                  </button>
                </div>

                {/* Existing Features */}
                {packageDetails.packageFeatures
                  .filter(feat => !formData.removeFeatureIds.includes(feat.featureId))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Features</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.packageFeatures.length} features total
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {packageDetails.packageFeatures
                        .filter(feat => !formData.removeFeatureIds.includes(feat.featureId))
                        .map((feature) => {
                          const currentFeature = getCurrentFeature(feature.featureId);
                          return (
                            <div 
                              key={feature.featureId} 
                              className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all duration-200"
                            >
                              <div className="flex justify-between items-center mb-5">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {currentFeature?.featureName || feature.featureName}
                                </h4>
                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingFeature(feature.featureId)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    title="Remove feature"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Value</label>
                                  <input
                                    type="text"
                                    value={currentFeature?.featureValue || feature.featureValue}
                                    onChange={(e) => handleUpdateFeature(feature.featureId, 'featureValue', e.target.value)}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., 5-Star"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                  <textarea
                                    value={currentFeature?.featureDescription || feature.featureDescription}
                                    onChange={(e) => handleUpdateFeature(feature.featureId, 'featureDescription', e.target.value)}
                                    rows={2}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Feature description"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <input
                                        type="color"
                                        value={currentFeature?.color || feature.color}
                                        onChange={(e) => handleUpdateFeature(feature.featureId, 'color', e.target.value)}
                                        className="w-10 h-10 cursor-pointer rounded-lg border-2 border-gray-300"
                                      />
                                      <div 
                                        className="absolute inset-0 rounded-lg border-2 border-white shadow-sm"
                                        style={{ backgroundColor: currentFeature?.color || feature.color }}
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={currentFeature?.color || feature.color}
                                      onChange={(e) => handleUpdateFeature(feature.featureId, 'color', e.target.value)}
                                      className="text-gray-800 flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Note</label>
                                  <input
                                    type="text"
                                    value={currentFeature?.specialNote || feature.specialNote}
                                    onChange={(e) => handleUpdateFeature(feature.featureId, 'specialNote', e.target.value)}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Special note about this feature"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                                  <span>ID: {feature.featureId}</span>
                                  {currentFeature !== feature && (
                                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                      Modified
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Features to Add */}
                {formData.addFeatures.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Features to Add</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {formData.addFeatures.map((feature, index) => (
                        <div key={index} className="border-2 border-dashed border-purple-300 rounded-xl p-5 bg-purple-50/50">
                          <div className="flex justify-between items-center mb-5">
                            <h4 className="font-semibold text-gray-900">New Feature {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  addFeatures: prev.addFeatures.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                              <input
                                type="text"
                                value={feature.featureName}
                                onChange={(e) => {
                                  const newFeatures = [...formData.addFeatures];
                                  newFeatures[index].featureName = e.target.value;
                                  setFormData(prev => ({ ...prev, addFeatures: newFeatures }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., Hotel Type"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Feature Value</label>
                              <input
                                type="text"
                                value={feature.featureValue}
                                onChange={(e) => {
                                  const newFeatures = [...formData.addFeatures];
                                  newFeatures[index].featureValue = e.target.value;
                                  setFormData(prev => ({ ...prev, addFeatures: newFeatures }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., 5-Star"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                value={feature.featureDescription}
                                onChange={(e) => {
                                  const newFeatures = [...formData.addFeatures];
                                  newFeatures[index].featureDescription = e.target.value;
                                  setFormData(prev => ({ ...prev, addFeatures: newFeatures }));
                                }}
                                rows={2}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Feature description"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <input
                                    type="color"
                                    value={feature.color}
                                    onChange={(e) => {
                                      const newFeatures = [...formData.addFeatures];
                                      newFeatures[index].color = e.target.value;
                                      setFormData(prev => ({ ...prev, addFeatures: newFeatures }));
                                    }}
                                    className="w-10 h-10 cursor-pointer rounded-lg border-2 border-gray-300"
                                  />
                                  <div 
                                    className="absolute inset-0 rounded-lg border-2 border-white shadow-sm"
                                    style={{ backgroundColor: feature.color }}
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={feature.color}
                                  onChange={(e) => {
                                    const newFeatures = [...formData.addFeatures];
                                    newFeatures[index].color = e.target.value;
                                    setFormData(prev => ({ ...prev, addFeatures: newFeatures }));
                                  }}
                                  className="text-gray-800 flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Day Accommodations Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
                      <CalendarIcon className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Day Accommodations Management</h2>
                      <p className="text-gray-600 text-sm mt-1">Manage daily schedules, hotels, and transport</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeDayAccommodationIds.length} type="remove" />
                      <ChangeBadge count={formData.addDayAccommodations.length} type="add" />
                      <ChangeBadge count={formData.updatedDayAccommodations.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDayAccommodation}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Day
                  </button>
                </div>

                {/* Existing Day Accommodations */}
                {packageDetails.dayAccommodationResponses?.packageDayByDayDtoList
                  .filter(day => !formData.removeDayAccommodationIds.includes(day.packageDayAccommodationId))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Day Accommodations</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.dayAccommodationResponses.packageDayByDayDtoList.length} days total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {packageDetails.dayAccommodationResponses.packageDayByDayDtoList
                        .filter(day => !formData.removeDayAccommodationIds.includes(day.packageDayAccommodationId))
                        .map((day) => {
                          const currentDay = getCurrentDayAccommodation(day.packageDayAccommodationId);
                          return (
                            <div 
                              key={day.packageDayAccommodationId} 
                              className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-all duration-200"
                            >
                              <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg font-bold">
                                    Day {currentDay?.dayNumber || day.dayNumber}
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Accommodation Details
                                  </h3>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingDayAccommodation(day.packageDayAccommodationId)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                    title="Remove day"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Meal Options */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700">Breakfast</label>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={currentDay?.breakfast || day.breakfast}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'breakfast', e.target.checked)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                      />
                                      <input
                                        type="text"
                                        value={currentDay?.breakfastDescription || day.breakfastDescription || ''}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'breakfastDescription', e.target.value)}
                                        placeholder="Breakfast details"
                                        className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700">Lunch</label>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={currentDay?.lunch || day.lunch}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'lunch', e.target.checked)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                      />
                                      <input
                                        type="text"
                                        value={currentDay?.lunchDescription || day.lunchDescription || ''}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'lunchDescription', e.target.value)}
                                        placeholder="Lunch details"
                                        className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <label className="text-sm font-medium text-gray-700">Dinner</label>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={currentDay?.dinner || day.dinner}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'dinner', e.target.checked)}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                      />
                                      <input
                                        type="text"
                                        value={currentDay?.dinnerDescription || day.dinnerDescription || ''}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'dinnerDescription', e.target.value)}
                                        placeholder="Dinner details"
                                        className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Accommodation Details */}
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel</label>
                                    <div className="relative">
                                      <BuildingOfficeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                      <select
                                        value={currentDay?.hotelId || day.hotelId}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'hotelId', parseInt(e.target.value))}
                                        className="text-gray-800 w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                      >
                                        <option value="">Select a hotel</option>
                                        {serviceProviders.map((hotel) => (
                                          <option key={hotel.serviceProviderId} value={hotel.serviceProviderId}>
                                            {hotel.serviceProviderName}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    {(currentDay?.hotelId || day.hotelId) > 0 && (
                                      <p className="text-sm text-green-600 mt-2">
                                        Selected: {serviceProviders.find(h => h.serviceProviderId === (currentDay?.hotelId || day.hotelId))?.serviceProviderName}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle</label>
                                    <div className="relative">
                                      <TruckIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                      <select
                                        value={currentDay?.transportId || day.transportId}
                                        onChange={(e) => handleUpdateDayAccommodation(day.packageDayAccommodationId, 'transportId', parseInt(e.target.value))}
                                        className="text-gray-800 w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                      >
                                        <option value="">Select a vehicle</option>
                                        {vehicles.map((vehicle) => (
                                          <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.registerNumber}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    {(currentDay?.transportId || day.transportId) > 0 && (
                                      <p className="text-sm text-green-600 mt-2">
                                        Selected: {vehicles.find(v => v.vehicleId === (currentDay?.transportId || day.transportId))?.registerNumber}
                                      </p>
                                    )}
                                  </div>

                                  {currentDay !== day && (
                                    <div className="flex justify-end">
                                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        Modified
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Day Accommodations to Add */}
                {formData.addDayAccommodations.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Day Accommodations to Add</h3>
                    <div className="space-y-6">
                      {formData.addDayAccommodations.map((day, index) => (
                        <div key={index} className="border-2 border-dashed border-green-300 rounded-xl p-6 bg-green-50/50">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold">
                                Day {day.dayNumber}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                New Accommodation Details
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  addDayAccommodations: prev.addDayAccommodations.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Meal Options */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <label className="text-sm font-medium text-gray-700">Breakfast</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={day.breakfast}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].breakfast = e.target.checked;
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                  />
                                  <input
                                    type="text"
                                    value={day.breakfastDescription || ''}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].breakfastDescription = e.target.value;
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    placeholder="Breakfast details"
                                    className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <label className="text-sm font-medium text-gray-700">Lunch</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={day.lunch}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].lunch = e.target.checked;
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                  />
                                  <input
                                    type="text"
                                    value={day.lunchDescription || ''}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].lunchDescription = e.target.value;
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    placeholder="Lunch details"
                                    className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Accommodation Details */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel *</label>
                                <div className="relative">
                                  <BuildingOfficeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <select
                                    value={day.hotelId}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].hotelId = parseInt(e.target.value);
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    className="text-gray-800 w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                  >
                                    <option value="">Select a hotel</option>
                                    {serviceProviders.map((hotel) => (
                                      <option key={hotel.serviceProviderId} value={hotel.serviceProviderId}>
                                        {hotel.serviceProviderName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle *</label>
                                <div className="relative">
                                  <TruckIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <select
                                    value={day.transportId}
                                    onChange={(e) => {
                                      const newDays = [...formData.addDayAccommodations];
                                      newDays[index].transportId = parseInt(e.target.value);
                                      setFormData(prev => ({ ...prev, addDayAccommodations: newDays }));
                                    }}
                                    className="text-gray-800 w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                  >
                                    <option value="">Select a vehicle</option>
                                    {vehicles.map((vehicle) => (
                                      <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                        {vehicle.registerNumber}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inclusions Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl">
                      <CheckIcon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Inclusions Management</h2>
                      <p className="text-gray-600 text-sm mt-1">What's included in the package</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeInclusionIds.length} type="remove" />
                      <ChangeBadge count={formData.addInclusions.length} type="add" />
                      <ChangeBadge count={formData.updatedInclusions.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Inclusion
                  </button>
                </div>

                {/* Existing Inclusions */}
                {packageDetails.inclusions
                  .filter(inc => !formData.removeInclusionIds.includes(inc.id))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Inclusions</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.inclusions.length} inclusions total
                      </span>
                    </div>
                    <div className="space-y-4">
                      {packageDetails.inclusions
                        .filter(inc => !formData.removeInclusionIds.includes(inc.id))
                        .map((inclusion) => {
                          const currentInclusion = getCurrentInclusion(inclusion.id);
                          return (
                            <div 
                              key={inclusion.id} 
                              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 transition-all duration-200"
                            >
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={currentInclusion?.description || inclusion.description}
                                  onChange={(e) => handleUpdateInclusion(inclusion.id, 'inclusionText', e.target.value)}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="e.g., Hotel accommodation"
                                />
                              </div>
                              <div className="w-24">
                                <input
                                  type="number"
                                  value={currentInclusion?.displayOrder || inclusion.displayOrder}
                                  onChange={(e) => handleUpdateInclusion(inclusion.id, 'displayOrder', parseInt(e.target.value))}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  min="1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingInclusion(inclusion.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                                title="Remove inclusion"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              {currentInclusion !== inclusion && (
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <PencilIcon className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Inclusions to Add */}
                {formData.addInclusions.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Inclusions to Add</h3>
                    <div className="space-y-4">
                      {formData.addInclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/50">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={inclusion.inclusionText}
                              onChange={(e) => {
                                const newInclusions = [...formData.addInclusions];
                                newInclusions[index].inclusionText = e.target.value;
                                setFormData(prev => ({ ...prev, addInclusions: newInclusions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="e.g., Hotel accommodation"
                            />
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              value={inclusion.displayOrder}
                              onChange={(e) => {
                                const newInclusions = [...formData.addInclusions];
                                newInclusions[index].displayOrder = parseInt(e.target.value);
                                setFormData(prev => ({ ...prev, addInclusions: newInclusions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addInclusions: prev.addInclusions.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Exclusions Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-100 to-rose-200 rounded-xl">
                      <XMarkIcon className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Exclusions Management</h2>
                      <p className="text-gray-600 text-sm mt-1">What's not included in the package</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeExclusionIds.length} type="remove" />
                      <ChangeBadge count={formData.addExclusions.length} type="add" />
                      <ChangeBadge count={formData.updatedExclusions.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Exclusion
                  </button>
                </div>

                {/* Existing Exclusions */}
                {packageDetails.exclusions
                  .filter(exc => !formData.removeExclusionIds.includes(exc.id))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Exclusions</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.exclusions.length} exclusions total
                      </span>
                    </div>
                    <div className="space-y-4">
                      {packageDetails.exclusions
                        .filter(exc => !formData.removeExclusionIds.includes(exc.id))
                        .map((exclusion) => {
                          const currentExclusion = getCurrentExclusion(exclusion.id);
                          return (
                            <div 
                              key={exclusion.id} 
                              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 transition-all duration-200"
                            >
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={currentExclusion?.description || exclusion.description}
                                  onChange={(e) => handleUpdateExclusion(exclusion.id, 'exclusionText', e.target.value)}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="e.g., International airfare"
                                />
                              </div>
                              <div className="w-24">
                                <input
                                  type="number"
                                  value={currentExclusion?.displayOrder || exclusion.displayOrder}
                                  onChange={(e) => handleUpdateExclusion(exclusion.id, 'displayOrder', parseInt(e.target.value))}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  min="1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingExclusion(exclusion.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                                title="Remove exclusion"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              {currentExclusion !== exclusion && (
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <PencilIcon className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Exclusions to Add */}
                {formData.addExclusions.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Exclusions to Add</h3>
                    <div className="space-y-4">
                      {formData.addExclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border-2 border-dashed border-red-300 rounded-xl bg-red-50/50">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={exclusion.exclusionText}
                              onChange={(e) => {
                                const newExclusions = [...formData.addExclusions];
                                newExclusions[index].exclusionText = e.target.value;
                                setFormData(prev => ({ ...prev, addExclusions: newExclusions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="e.g., International airfare"
                            />
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              value={exclusion.displayOrder}
                              onChange={(e) => {
                                const newExclusions = [...formData.addExclusions];
                                newExclusions[index].displayOrder = parseInt(e.target.value);
                                setFormData(prev => ({ ...prev, addExclusions: newExclusions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addExclusions: prev.addExclusions.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conditions Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl">
                      <ExclamationTriangleIcon className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Package Conditions Management</h2>
                      <p className="text-gray-600 text-sm mt-1">Terms and conditions for the package</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeConditionIds.length} type="remove" />
                      <ChangeBadge count={formData.addConditions.length} type="add" />
                      <ChangeBadge count={formData.updatedConditions.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Condition
                  </button>
                </div>

                {/* Existing Conditions */}
                {packageDetails.conditions
                  .filter(cond => !formData.removeConditionIds.includes(cond.id))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Conditions</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.conditions.length} conditions total
                      </span>
                    </div>
                    <div className="space-y-4">
                      {packageDetails.conditions
                        .filter(cond => !formData.removeConditionIds.includes(cond.id))
                        .map((condition) => {
                          const currentCondition = getCurrentCondition(condition.id);
                          return (
                            <div 
                              key={condition.id} 
                              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-amber-300 transition-all duration-200"
                            >
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={currentCondition?.description || condition.description}
                                  onChange={(e) => handleUpdateCondition(condition.id, 'conditionText', e.target.value)}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  placeholder="e.g., Valid passport required"
                                />
                              </div>
                              <div className="w-24">
                                <input
                                  type="number"
                                  value={currentCondition?.displayOrder || condition.displayOrder}
                                  onChange={(e) => handleUpdateCondition(condition.id, 'displayOrder', parseInt(e.target.value))}
                                  className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  min="1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingCondition(condition.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                                title="Remove condition"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              {currentCondition !== condition && (
                                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                  <PencilIcon className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Conditions to Add */}
                {formData.addConditions.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Conditions to Add</h3>
                    <div className="space-y-4">
                      {formData.addConditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/50">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={condition.conditionText}
                              onChange={(e) => {
                                const newConditions = [...formData.addConditions];
                                newConditions[index].conditionText = e.target.value;
                                setFormData(prev => ({ ...prev, addConditions: newConditions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="e.g., Valid passport required"
                            />
                          </div>
                          <div className="w-24">
                            <input
                              type="number"
                              value={condition.displayOrder}
                              onChange={(e) => {
                                const newConditions = [...formData.addConditions];
                                newConditions[index].displayOrder = parseInt(e.target.value);
                                setFormData(prev => ({ ...prev, addConditions: newConditions }));
                              }}
                              className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              min="1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addConditions: prev.addConditions.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-3 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Travel Tips Management */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl">
                      <InformationCircleIcon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Travel Tips Management</h2>
                      <p className="text-gray-600 text-sm mt-1">Helpful tips and advice for travelers</p>
                    </div>
                    <div className="flex gap-2">
                      <ChangeBadge count={formData.removeTravelTipIds.length} type="remove" />
                      <ChangeBadge count={formData.addTravelTips.length} type="add" />
                      <ChangeBadge count={formData.updatedTravelTips.length} type="update" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTravelTip}
                    className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <PlusIcon className="w-5 h-5 mr-2.5" />
                    Add New Travel Tip
                  </button>
                </div>

                {/* Existing Travel Tips */}
                {packageDetails.travelTips
                  .filter(tip => !formData.removeTravelTipIds.includes(tip.id))
                  .length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Current Travel Tips</h3>
                      <span className="text-sm text-gray-500">
                        {packageDetails.travelTips.length} tips total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {packageDetails.travelTips
                        .filter(tip => !formData.removeTravelTipIds.includes(tip.id))
                        .map((tip) => {
                          const currentTip = getCurrentTravelTip(tip.id);
                          return (
                            <div 
                              key={tip.id} 
                              className="p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 space-y-4">
                                  <input
                                    type="text"
                                    value={currentTip?.title || tip.title}
                                    onChange={(e) => handleUpdateTravelTip(tip.id, 'tipTitle', e.target.value)}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-semibold"
                                    placeholder="Tip Title"
                                  />
                                  <textarea
                                    value={currentTip?.description || tip.description}
                                    onChange={(e) => handleUpdateTravelTip(tip.id, 'tipDescription', e.target.value)}
                                    className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    rows={2}
                                    placeholder="Tip Description"
                                  />
                                </div>
                                <div className="ml-5 flex flex-col items-end space-y-3">
                                  <div className="w-28">
                                    <input
                                      type="number"
                                      value={currentTip?.displayOrder || tip.displayOrder}
                                      onChange={(e) => handleUpdateTravelTip(tip.id, 'displayOrder', parseInt(e.target.value))}
                                      className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                                      min="1"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveExistingTravelTip(tip.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                      title="Remove travel tip"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                    {currentTip !== tip && (
                                      <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                                        <PencilIcon className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* New Travel Tips to Add */}
                {formData.addTravelTips.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">New Travel Tips to Add</h3>
                    <div className="space-y-6">
                      {formData.addTravelTips.map((travelTip, index) => (
                        <div key={index} className="p-5 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50/50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 space-y-4">
                              <input
                                type="text"
                                value={travelTip.tipTitle}
                                onChange={(e) => {
                                  const newTips = [...formData.addTravelTips];
                                  newTips[index].tipTitle = e.target.value;
                                  setFormData(prev => ({ ...prev, addTravelTips: newTips }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-semibold"
                                placeholder="Tip Title"
                              />
                              <textarea
                                value={travelTip.tipDescription}
                                onChange={(e) => {
                                  const newTips = [...formData.addTravelTips];
                                  newTips[index].tipDescription = e.target.value;
                                  setFormData(prev => ({ ...prev, addTravelTips: newTips }));
                                }}
                                className="text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                rows={2}
                                placeholder="Tip Description"
                              />
                            </div>
                            <div className="ml-5 flex flex-col items-end space-y-3">
                              <div className="w-28">
                                <input
                                  type="number"
                                  value={travelTip.displayOrder}
                                  onChange={(e) => {
                                    const newTips = [...formData.addTravelTips];
                                    newTips[index].displayOrder = parseInt(e.target.value);
                                    setFormData(prev => ({ ...prev, addTravelTips: newTips }));
                                  }}
                                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                                  min="1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    addTravelTips: prev.addTravelTips.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Reset Changes
                    </button>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {hasChanges && (
                      <div className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg">
                        <div className="flex items-center gap-3">
                          <CloudArrowUpIcon className="w-5 h-5" />
                          <div className="text-center">
                            <div className="font-bold text-lg">{calculateTotalChanges()}</div>
                            <div className="text-xs opacity-90">pending changes</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || !hasChanges}
                      className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl disabled:hover:shadow-xl disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Updating Package...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CloudArrowUpIcon className="w-5 h-5 mr-3" />
                          Update Package
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdatePackagePage;