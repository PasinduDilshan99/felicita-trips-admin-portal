"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageService } from "@/services/packageService";
import { VehicleService } from "@/services/vehicleService";
import { ServiceProviderService } from "@/services/serviceProviderService";
import {
  TourIdName,
  TourDetailsForPackage,
  DayAccommodation,
  Inclusion,
  Exclusion,
  Condition,
  TravelTipRequest,
  PackageImageRequest,
} from "@/types/package-types";
import { VehicleIdName } from "@/types/vehicle-types";
import { ServiceProviderIdName } from "@/types/service-provider-types";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const AddNewPackagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTourId = searchParams?.get("tour-id");
  const initialTourName = searchParams?.get("tour-name");

  // Tour Selection State
  const [tourSearch, setTourSearch] = useState("");
  const [tourResults, setTourResults] = useState<TourIdName[]>([]);
  const [showTourDropdown, setShowTourDropdown] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(
    initialTourId ? parseInt(initialTourId) : null
  );
  const [selectedTourName, setSelectedTourName] = useState(
    initialTourName || ""
  );

  // Vehicle State
  const [vehicles, setVehicles] = useState<VehicleIdName[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Service Provider (Hotel) State
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderIdName[]>([]);
  const [loadingServiceProviders, setLoadingServiceProviders] = useState(false);

  // Tour Details State
  const [tourDetails, setTourDetails] = useState<TourDetailsForPackage | null>(null);
  const [loadingTourDetails, setLoadingTourDetails] = useState(false);

  // Package Form State
  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    packageType: 1,
    totalPrice: 0,
    discountPercentage: 0,
    startDate: "",
    endDate: "",
    color: "#3B82F6",
    hoverColor: "#2563EB",
    minPersonCount: 2,
    maxPersonCount: 10,
    pricePerPerson: 0,
    status: "ACTIVE",
  });

  // Dynamic Arrays
  const [dayAccommodations, setDayAccommodations] = useState<DayAccommodation[]>([]);
  const [packageInclusions, setPackageInclusions] = useState<Inclusion[]>([]);
  const [packageExclusions, setPackageExclusions] = useState<Exclusion[]>([]);
  const [packageConditions, setPackageConditions] = useState<Condition[]>([]);
  const [packageTravelTips, setPackageTravelTips] = useState<TravelTipRequest[]>([]);
  const [packageImages, setPackageImages] = useState<PackageImageRequest[]>([
    {
      name: "",
      description: "",
      status: "ACTIVE",
      imageUrl: "",
      color: "#3B82F6",
      createdBy: 1,
    },
  ]);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTours, setIsLoadingTours] = useState(false);

  // Fetch vehicles and service providers on component mount
  useEffect(() => {
    fetchVehicles();
    fetchServiceProviders();
  }, []);

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await VehicleService.getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Fetch all service providers (hotels)
  const fetchServiceProviders = async () => {
    try {
      setLoadingServiceProviders(true);
      const response = await ServiceProviderService.getAllServiceProviders();
      setServiceProviders(response.data);
    } catch (error) {
      console.error("Error fetching service providers:", error);
      toast.error("Failed to load hotels");
    } finally {
      setLoadingServiceProviders(false);
    }
  };

  // Fetch tours on search input
  useEffect(() => {
    const searchTours = async () => {
      if (!tourSearch.trim()) {
        setTourResults([]);
        return;
      }

      try {
        setIsLoadingTours(true);
        const response = await PackageService.getAllTours();
        const filteredTours = response.data.filter((tour) =>
          tour.tourName.toLowerCase().includes(tourSearch.toLowerCase())
        );
        setTourResults(filteredTours);
      } catch (error) {
        console.error("Error searching tours:", error);
        toast.error("Failed to search tours");
      } finally {
        setIsLoadingTours(false);
      }
    };

    searchTours();
  }, [tourSearch]);

  // Fetch tour details when a tour is selected
  useEffect(() => {
    if (selectedTourId) {
      fetchTourDetails(selectedTourId);
    }
  }, [selectedTourId]);

  const fetchTourDetails = async (tourId: number) => {
    try {
      setLoadingTourDetails(true);
      const response = await PackageService.getTourDetailsForPackage(tourId);
      setTourDetails(response.data);

      // Initialize day accommodations based on tour days
      const initialDayAccommodations: DayAccommodation[] = response.data.days.map((day) => ({
        dayNumber: day.day,
        breakfast: true,
        breakfastDescription: "Breakfast at hotel",
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
        otherNotes: `Day ${day.day} - ${day.destinations.map((d) => d.name).join(", ")}`,
      }));
      setDayAccommodations(initialDayAccommodations);

      // Initialize inclusions, exclusions, conditions, travel tips from tour
      const initialInclusions: Inclusion[] = response.data.inclusions.map((text, index) => ({
        inclusionText: text,
        displayOrder: index + 1,
        status: "ACTIVE",
      }));
      setPackageInclusions(initialInclusions);

      const initialExclusions: Exclusion[] = response.data.exclusions.map((text, index) => ({
        exclusionText: text,
        displayOrder: index + 1,
        status: "ACTIVE",
      }));
      setPackageExclusions(initialExclusions);

      const initialConditions: Condition[] = response.data.conditions.map((text, index) => ({
        conditionText: text,
        displayOrder: index + 1,
        status: "ACTIVE",
      }));
      setPackageConditions(initialConditions);

      const initialTravelTips: TravelTipRequest[] = response.data.travelTips.map((tip, index) => ({
        tipTitle: tip.tipTitle,
        tipDescription: tip.tipDescription,
        displayOrder: index + 1,
        status: "ACTIVE",
      }));
      setPackageTravelTips(initialTravelTips);
    } catch (error) {
      console.error("Error fetching tour details:", error);
      toast.error("Failed to load tour details");
    } finally {
      setLoadingTourDetails(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));

      // Calculate price per person if relevant fields change
      if (name === "totalPrice" || name === "discountPercentage" || name === "maxPersonCount") {
        const currentTotal = name === "totalPrice" ? numValue : formData.totalPrice;
        const currentDiscount = name === "discountPercentage" ? numValue : formData.discountPercentage;
        const currentMaxGroup = name === "maxPersonCount" ? numValue : formData.maxPersonCount;
        
        const discountedPrice = currentTotal * (1 - currentDiscount / 100);
        const perPerson = currentMaxGroup > 0 ? discountedPrice / currentMaxGroup : 0;
        
        setFormData((prev) => ({
          ...prev,
          pricePerPerson: parseFloat(perPerson.toFixed(2)),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle tour selection
  const handleTourSelect = (tour: TourIdName) => {
    setSelectedTourId(tour.tourId);
    setSelectedTourName(tour.tourName);
    setTourSearch(tour.tourName);
    setShowTourDropdown(false);
  };

  // Handle day accommodation changes
  const handleDayAccommodationChange = (
    index: number,
    field: keyof DayAccommodation,
    value: any
  ) => {
    const updated = [...dayAccommodations];
    updated[index] = { ...updated[index], [field]: value };
    setDayAccommodations(updated);
  };

  // Handle array item changes (inclusions, exclusions, etc.)
  const handleArrayItemChange = (
    array: any[],
    setArray: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    setArray(updated);
  };

  // Add new item to array
  const addArrayItem = (
    array: any[],
    setArray: React.Dispatch<React.SetStateAction<any[]>>,
    template: any
  ) => {
    setArray([...array, { ...template }]);
  };

  // Remove item from array
  const removeArrayItem = (
    array: any[],
    setArray: React.Dispatch<React.SetStateAction<any[]>>,
    index: number
  ) => {
    const updated = [...array];
    updated.splice(index, 1);
    setArray(updated);
  };

  // Handle image changes
  const handleImageChange = (
    index: number,
    field: keyof PackageImageRequest,
    value: string
  ) => {
    const updated = [...packageImages];
    updated[index] = { ...updated[index], [field]: value };
    setPackageImages(updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTourId) {
      toast.error("Please select a tour");
      return;
    }

    if (!formData.packageName.trim()) {
      toast.error("Package name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (formData.totalPrice <= 0) {
      toast.error("Total price must be greater than 0");
      return;
    }

    if (formData.startDate === "" || formData.endDate === "") {
      toast.error("Start date and end date are required");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return;
    }

    // Validate day accommodations
    for (const day of dayAccommodations) {
      if (day.hotelId <= 0) {
        toast.error(`Please select a hotel for Day ${day.dayNumber}`);
        return;
      }
      if (day.transportId <= 0) {
        toast.error(`Please select a vehicle for Day ${day.dayNumber}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        packageType: formData.packageType,
        tourId: selectedTourId,
        name: formData.packageName,
        description: formData.description,
        totalPrice: formData.totalPrice,
        discountPercentage: formData.discountPercentage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        color: formData.color,
        status: formData.status,
        hoverColor: formData.hoverColor,
        minPersonCount: formData.minPersonCount,
        maxPersonCount: formData.maxPersonCount,
        pricePerPerson: formData.pricePerPerson,
        createdBy: 1, // Replace with actual user ID from context
        images: packageImages.filter((img) => img.name && img.imageUrl),
        dayAccommodations,
        inclusions: packageInclusions.filter((inc) => inc.inclusionText.trim()),
        exclusions: packageExclusions.filter((exc) => exc.exclusionText.trim()),
        conditions: packageConditions.filter((cond) => cond.conditionText.trim()),
        travelTips: packageTravelTips.filter(
          (tip) => tip.tipTitle.trim() && tip.tipDescription.trim()
        ),
      };

      const response = await PackageService.addPackage(requestData);

      if (response.code === 200) {
        toast.success("Package created successfully!");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Error creating package:", error);
      toast.error(error.message || "Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no tour selected, show tour selection
  if (!selectedTourId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Package</h1>
            <p className="text-gray-600 mt-2">First, select a tour for your package</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tour
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={tourSearch}
                  onChange={(e) => {
                    setTourSearch(e.target.value);
                    setShowTourDropdown(true);
                  }}
                  onFocus={() => setShowTourDropdown(true)}
                  onBlur={() => setTimeout(() => setShowTourDropdown(false), 200)}
                  placeholder="Type to search tours..."
                  className="text-gray-800 w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isLoadingTours && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {showTourDropdown && tourResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {tourResults.map((tour) => (
                    <button
                      key={tour.tourId}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleTourSelect(tour);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{tour.tourName}</div>
                      <div className="text-sm text-gray-500">Tour ID: {tour.tourId}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-500">Or</p>
              <button
                onClick={() => router.push("/dashboard/tours")}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Browse all tours →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If tour is selected, show package form
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Package</h1>
              <p className="text-gray-600 mt-2">
                Based on tour:{" "}
                <span className="font-semibold text-blue-600">{selectedTourName}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTourId(null);
                setSelectedTourName("");
                setTourSearch("");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Change Tour
            </button>
          </div>
        </div>

        {loadingTourDetails || loadingVehicles || loadingServiceProviders ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading resources...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tour Details Preview */}
            {tourDetails && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tour Overview</h2>
                <div className="text-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Tour Type:</span> {tourDetails.tourType}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> {tourDetails.tourCategory}
                      </p>
                      <p>
                        <span className="font-medium">Route:</span> {tourDetails.startLocation} → {tourDetails.endLocation}
                      </p>
                      <p>
                        <span className="font-medium">Season:</span> {tourDetails.season}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Assigned Coordinator</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {tourDetails.assignedUser.firstName} {tourDetails.assignedUser.lastName}
                      </p>
                      <p className="text-sm text-gray-600">@{tourDetails.assignedUser.username}</p>
                      <p className="text-sm text-gray-500 mt-2">{tourDetails.assignMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Tour Days Preview */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-4">Tour Itinerary</h3>
                  <div className="space-y-4">
                    {tourDetails.days.map((day) => (
                      <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-lg text-gray-900 mb-2">Day {day.day}</h4>
                        <div className="space-y-3">
                          {day.destinations.map((destination) => (
                            <div key={destination.destinationId} className="ml-4">
                              <p className="font-medium text-gray-800">{destination.name}</p>
                              <p className="text-sm text-gray-600">{destination.description}</p>
                              {destination.activities.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Activities:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {destination.activities.map((activity) => (
                                      <li key={activity.activityId}>{activity.name}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Package Basic Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Package Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Premium Sigiriya Experience"
                  />
                </div>

                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Type *
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">Standard</option>
                    <option value="2">Premium</option>
                    <option value="3">Luxury</option>
                    <option value="4">Budget</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your package..."
                  />
                </div>

                {/* Pricing Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Price (LKR) *
                  </label>
                  <input
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Group Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Group Size *
                  </label>
                  <input
                    type="number"
                    name="minPersonCount"
                    value={formData.minPersonCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Group Size *
                  </label>
                  <input
                    type="number"
                    name="maxPersonCount"
                    value={formData.maxPersonCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Price Per Person (Calculated) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Person (LKR)
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerPerson.toFixed(2)}
                    readOnly
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">Calculated automatically</p>
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-10 h-10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={handleInputChange}
                      name="color"
                      className="text-gray-800 flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hover Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="hoverColor"
                      value={formData.hoverColor}
                      onChange={handleInputChange}
                      className="w-10 h-10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.hoverColor}
                      onChange={handleInputChange}
                      name="hoverColor"
                      className="text-gray-800 flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Day Accommodations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Day Accommodations</h2>
                <button
                  type="button"
                  onClick={() => {
                    const newDayNumber = dayAccommodations.length + 1;
                    addArrayItem(dayAccommodations, setDayAccommodations, {
                      dayNumber: newDayNumber,
                      breakfast: true,
                      breakfastDescription: "Breakfast at hotel",
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
                      otherNotes: `Day ${newDayNumber} details`,
                    });
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Day
                </button>
              </div>

              <div className="space-y-6">
                {dayAccommodations.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Day {day.dayNumber}</h3>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(dayAccommodations, setDayAccommodations, dayIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Show tour destinations for this day */}
                    {tourDetails?.days.find((d) => d.day === day.dayNumber) && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Tour Destinations:</h4>
                        <ul className="text-sm text-blue-700">
                          {tourDetails.days
                            .find((d) => d.day === day.dayNumber)
                            ?.destinations.map((dest) => (
                              <li key={dest.destinationId}>• {dest.name}</li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Meal Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.breakfast}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "breakfast", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.breakfastDescription || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "breakfastDescription", e.target.value)}
                            placeholder="Breakfast description"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lunch</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.lunch}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "lunch", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.lunchDescription || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "lunchDescription", e.target.value)}
                            placeholder="Lunch description"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dinner</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.dinner}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "dinner", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.dinnerDescription || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "dinnerDescription", e.target.value)}
                            placeholder="Dinner description"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Morning Tea</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.morningTea}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "morningTea", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.morningTeaDescription || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "morningTeaDescription", e.target.value)}
                            placeholder="Morning tea description"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Evening Tea</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.eveningTea}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "eveningTea", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.eveningTeaDescription || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "eveningTeaDescription", e.target.value)}
                            placeholder="Evening tea description"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Snacks</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={day.snacks}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "snacks", e.target.checked)}
                            className="rounded"
                          />
                          <input
                            type="text"
                            value={day.snackNote || ""}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "snackNote", e.target.value)}
                            placeholder="Snack details"
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      {/* Hotel Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hotel *
                        </label>
                        <div className="relative">
                          <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={day.hotelId}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "hotelId", parseInt(e.target.value))}
                            className="text-gray-800 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select a hotel</option>
                            {serviceProviders.map((hotel) => (
                              <option key={hotel.serviceProviderId} value={hotel.serviceProviderId}>
                                {hotel.serviceProviderName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {day.hotelId > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {serviceProviders.find(h => h.serviceProviderId === day.hotelId)?.serviceProviderName}
                          </p>
                        )}
                      </div>

                      {/* Vehicle Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle *
                        </label>
                        <div className="relative">
                          <TruckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            value={day.transportId}
                            onChange={(e) => handleDayAccommodationChange(dayIndex, "transportId", parseInt(e.target.value))}
                            className="text-gray-800 w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select a vehicle</option>
                            {vehicles.map((vehicle) => (
                              <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                {vehicle.registerNumber}
                              </option>
                            ))}
                          </select>
                        </div>
                        {day.transportId > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {vehicles.find(v => v.vehicleId === day.transportId)?.registerNumber}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other Notes</label>
                        <textarea
                          value={day.otherNotes || ""}
                          onChange={(e) => handleDayAccommodationChange(dayIndex, "otherNotes", e.target.value)}
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
                          rows={2}
                          placeholder="Additional notes for this day..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Inclusions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Package Inclusions</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(packageInclusions, setPackageInclusions, {
                      inclusionText: "",
                      displayOrder: packageInclusions.length + 1,
                      status: "ACTIVE",
                    })
                  }
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Inclusion
                </button>
              </div>

              <div className="space-y-4">
                {packageInclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={inclusion.inclusionText}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageInclusions,
                          setPackageInclusions,
                          index,
                          "inclusionText",
                          e.target.value
                        )
                      }
                      className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="e.g., Airport pickup and drop"
                    />
                    <input
                      type="number"
                      value={inclusion.displayOrder}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageInclusions,
                          setPackageInclusions,
                          index,
                          "displayOrder",
                          parseInt(e.target.value)
                        )
                      }
                      className="text-gray-800 w-20 px-3 py-2 border border-gray-300 rounded"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(packageInclusions, setPackageInclusions, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Exclusions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Package Exclusions</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(packageExclusions, setPackageExclusions, {
                      exclusionText: "",
                      displayOrder: packageExclusions.length + 1,
                      status: "ACTIVE",
                    })
                  }
                  className="text-gray-800 flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Exclusion
                </button>
              </div>

              <div className="space-y-4">
                {packageExclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={exclusion.exclusionText}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageExclusions,
                          setPackageExclusions,
                          index,
                          "exclusionText",
                          e.target.value
                        )
                      }
                      className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="e.g., International airfare"
                    />
                    <input
                      type="number"
                      value={exclusion.displayOrder}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageExclusions,
                          setPackageExclusions,
                          index,
                          "displayOrder",
                          parseInt(e.target.value)
                        )
                      }
                      className="text-gray-800 w-20 px-3 py-2 border border-gray-300 rounded"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(packageExclusions, setPackageExclusions, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Conditions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Package Conditions</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(packageConditions, setPackageConditions, {
                      conditionText: "",
                      displayOrder: packageConditions.length + 1,
                      status: "ACTIVE",
                    })
                  }
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Condition
                </button>
              </div>

              <div className="space-y-4">
                {packageConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={condition.conditionText}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageConditions,
                          setPackageConditions,
                          index,
                          "conditionText",
                          e.target.value
                        )
                      }
                      className="text-gray-800 flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="e.g., Minimum two passengers required"
                    />
                    <input
                      type="number"
                      value={condition.displayOrder}
                      onChange={(e) =>
                        handleArrayItemChange(
                          packageConditions,
                          setPackageConditions,
                          index,
                          "displayOrder",
                          parseInt(e.target.value)
                        )
                      }
                      className="text-gray-800 w-20 px-3 py-2 border border-gray-300 rounded"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(packageConditions, setPackageConditions, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Travel Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Travel Tips</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(packageTravelTips, setPackageTravelTips, {
                      tipTitle: "",
                      tipDescription: "",
                      displayOrder: packageTravelTips.length + 1,
                      status: "ACTIVE",
                    })
                  }
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Travel Tip
                </button>
              </div>

              <div className="space-y-6">
                {packageTravelTips.map((tip, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={tip.tipTitle}
                          onChange={(e) =>
                            handleArrayItemChange(
                              packageTravelTips,
                              setPackageTravelTips,
                              index,
                              "tipTitle",
                              e.target.value
                            )
                          }
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded mb-2"
                          placeholder="Tip Title (e.g., Footwear)"
                        />
                        <textarea
                          value={tip.tipDescription}
                          onChange={(e) =>
                            handleArrayItemChange(
                              packageTravelTips,
                              setPackageTravelTips,
                              index,
                              "tipDescription",
                              e.target.value
                            )
                          }
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
                          rows={2}
                          placeholder="Tip Description"
                        />
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <input
                          type="number"
                          value={tip.displayOrder}
                          onChange={(e) =>
                            handleArrayItemChange(
                              packageTravelTips,
                              setPackageTravelTips,
                              index,
                              "displayOrder",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded"
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem(packageTravelTips, setPackageTravelTips, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Images */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Package Images</h2>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem(packageImages, setPackageImages, {
                      name: "",
                      description: "",
                      status: "ACTIVE",
                      imageUrl: "",
                      color: "#3B82F6",
                      createdBy: 1,
                    })
                  }
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packageImages.map((image, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">Image {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(packageImages, setPackageImages, index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image Name</label>
                        <input
                          type="text"
                          value={image.name}
                          onChange={(e) => handleImageChange(index, "name", e.target.value)}
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="e.g., Hero Image"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={image.description}
                          onChange={(e) => handleImageChange(index, "description", e.target.value)}
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="Image description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={image.imageUrl}
                          onChange={(e) => handleImageChange(index, "imageUrl", e.target.value)}
                          className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={image.color}
                            onChange={(e) => handleImageChange(index, "color", e.target.value)}
                            className="w-8 h-8 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={image.color}
                            onChange={(e) => handleImageChange(index, "color", e.target.value)}
                            className="text-gray-800 flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Package...
                    </div>
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddNewPackagePage;