// pages/web-management/activities/AddNewActivityPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { ActivityService } from "@/services/activityService";
import {
  AddActivityFormData,
  ActivityImageRequest,
  ActivityRequirementRequest,
  DestinationOption,
} from "@/types/activity-types";
import {
  Clock,
  DollarSign,
  FileText,
  Plus,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2,
  Eye,
  Shield,
  Save,
  Users,
  MapPin,
  ListChecks,
  Image as ImageIcon,
  Search,
} from "lucide-react";

const AddNewActivityPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Activities",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    },
    {
      label: "Add New",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/add`,
    },
  ];

  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<AddActivityFormData>(
    ActivityService.getDefaultFormData()
  );

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>(["All year"]);
  
  // Destination selection state
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(null);
  
  // Image preview state
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File }[]
  >([]);
  const [newImage, setNewImage] = useState<ActivityImageRequest>({
    name: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  // Requirement state
  const [newRequirement, setNewRequirement] = useState<ActivityRequirementRequest>({
    name: "",
    value: "",
    description: "",
    color: "#3B82F6",
    status: "ACTIVE",
  });

  // Initialize data
  useEffect(() => {
    loadCategories();
    loadSeasons();
    loadDestinations();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesList = await ActivityService.getActivityCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadSeasons = async () => {
    try {
      const seasonsList = ActivityService.getSeasons();
      setSeasons(["All year", ...seasonsList]);
    } catch (error) {
      console.error("Error loading seasons:", error);
    }
  };

  const loadDestinations = async () => {
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      if (response.code === 200) {
        setDestinations(response.data);
      }
    } catch (error) {
      console.error("Error loading destinations:", error);
    }
  };

  // Filter destinations based on search
  const filteredDestinations = destinations.filter(dest =>
    dest.destinationName.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  // Handle destination selection
  const handleDestinationSelect = (destination: DestinationOption) => {
    setSelectedDestination(destination);
    setFormData(prev => ({ ...prev, destinationId: destination.destinationId }));
    setDestinationSearch(destination.destinationName);
    setShowDestinationDropdown(false);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number inputs
    if (["durationHours", "priceLocal", "priceForeigners", "minParticipate", "maxParticipate"].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === "" ? null : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Handle time input changes
  const handleTimeChange = (field: "availableFrom" | "availableTo", value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;

        // Add to image previews
        setImagePreviews((prev) => [...prev, { url: imageUrl, file }]);

        // Add to form data images
        const newImageData: ActivityImageRequest = {
          name: file.name.split(".")[0],
          description: `Uploaded image: ${file.name}`,
          imageUrl,
          status: "ACTIVE",
        };

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImageData],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle manual image URL addition
  const handleAddImage = () => {
    if (!newImage.name.trim() || !newImage.imageUrl.trim()) {
      setErrors((prev) => ({
        ...prev,
        image: "Image name and URL are required",
      }));
      return;
    }

    if (!newImage.imageUrl.startsWith("http")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please use a valid HTTP/HTTPS URL for the image",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { ...newImage }],
    }));

    setImagePreviews((prev) => [...prev, { url: newImage.imageUrl }]);

    setNewImage({
      name: "",
      description: "",
      imageUrl: "",
      status: "ACTIVE",
    });

    if (errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add requirement
  const handleAddRequirement = () => {
    if (!newRequirement.name.trim() || !newRequirement.value.trim()) {
      setErrors((prev) => ({
        ...prev,
        requirement: "Requirement name and value are required",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { ...newRequirement }],
    }));

    setNewRequirement({
      name: "",
      value: "",
      description: "",
      color: "#3B82F6",
      status: "ACTIVE",
    });

    if (errors.requirement) {
      setErrors((prev) => ({
        ...prev,
        requirement: "",
      }));
    }
  };

  // Remove requirement
  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const validationErrors = ActivityService.validateActivityForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      console.log("=================formData===================");
      console.log("Raw form data:", formData);

      // Prepare submission data using service method
      const submissionData = ActivityService.prepareActivityData(formData);

      console.log("Processed submission data:", submissionData);
      console.log("====================================");

      // Call API to add activity using service
      await ActivityService.addActivity(submissionData);

      setSuccess(true);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        handleReset();
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`);
      }, 2000);

    } catch (error: any) {
      console.error("Submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to add activity. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(ActivityService.getDefaultFormData());
    setImagePreviews([]);
    setDestinationSearch("");
    setSelectedDestination(null);
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Activity"
            description="Create a new activity with all details"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  Activity Added Successfully!
                </h3>
                <p className="text-green-600 mt-1">
                  Redirecting to activities list...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">
                  Submission Failed
                </h3>
                <p className="text-red-600 mt-1">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination Selection Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Destination Selection
                </h2>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={destinationSearch}
                        onChange={(e) => {
                          setDestinationSearch(e.target.value);
                          setShowDestinationDropdown(true);
                        }}
                        onFocus={() => setShowDestinationDropdown(true)}
                        placeholder="Search for a destination..."
                        className={`text-gray-600 w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.destinationId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    
                    {showDestinationDropdown && filteredDestinations.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                        {filteredDestinations.map((destination) => (
                          <div
                            key={destination.destinationId}
                            onClick={() => handleDestinationSelect(destination)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">
                              {destination.destinationName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {destination.destinationId}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedDestination && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedDestination.destinationName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Destination ID: {selectedDestination.destinationId}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDestination(null);
                              setDestinationSearch("");
                              setFormData(prev => ({ ...prev, destinationId: null }));
                            }}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {errors.destinationId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.destinationId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  Activity Information
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter activity name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter activity description"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category & Season */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="activitiesCategory"
                        value={formData.activitiesCategory}
                        onChange={handleInputChange}
                        className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.activitiesCategory
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.activitiesCategory && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.activitiesCategory}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Season
                      </label>
                      <select
                        name="season"
                        value={formData.season}
                        onChange={handleInputChange}
                        className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        {seasons.map((season) => (
                          <option key={season} value={season}>
                            {season}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule & Duration Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  Schedule & Duration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Hours) *
                    </label>
                    <input
                      type="number"
                      name="durationHours"
                      value={formData.durationHours || ""}
                      onChange={handleInputChange}
                      step="0.5"
                      min="0.5"
                      max="24"
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.durationHours
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 4.5"
                    />
                    {errors.durationHours && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.durationHours}
                      </p>
                    )}
                  </div>

                  {/* Available From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From *
                    </label>
                    <input
                      type="time"
                      value={formData.availableFrom}
                      onChange={(e) => handleTimeChange("availableFrom", e.target.value)}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.availableFrom
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.availableFrom && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.availableFrom}
                      </p>
                    )}
                  </div>

                  {/* Available To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available To *
                    </label>
                    <input
                      type="time"
                      value={formData.availableTo}
                      onChange={(e) => handleTimeChange("availableTo", e.target.value)}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.availableTo
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.availableTo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.availableTo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Time Info */}
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                  <p className="text-sm text-purple-700">
                    ⏰ Activity will be available from {formData.availableFrom} to {formData.availableTo} 
                    {formData.durationHours && ` (${formData.durationHours} hours)`}
                  </p>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                  Pricing
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Local Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local Price (LKR) *
                    </label>
                    <input
                      type="number"
                      name="priceLocal"
                      value={formData.priceLocal || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.priceLocal
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 3000"
                    />
                    {errors.priceLocal && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.priceLocal}
                      </p>
                    )}
                  </div>

                  {/* Foreigner Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foreigner Price (LKR) *
                    </label>
                    <input
                      type="number"
                      name="priceForeigners"
                      value={formData.priceForeigners || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.priceForeigners
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 8000"
                    />
                    {errors.priceForeigners && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.priceForeigners}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Participants Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-rose-600" />
                  Participants
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Minimum Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Participants *
                    </label>
                    <input
                      type="number"
                      name="minParticipate"
                      value={formData.minParticipate || ""}
                      onChange={handleInputChange}
                      min="1"
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.minParticipate
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 1"
                    />
                    {errors.minParticipate && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.minParticipate}
                      </p>
                    )}
                  </div>

                  {/* Maximum Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Participants *
                    </label>
                    <input
                      type="number"
                      name="maxParticipate"
                      value={formData.maxParticipate || ""}
                      onChange={handleInputChange}
                      min="1"
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.maxParticipate
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 10"
                    />
                    {errors.maxParticipate && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.maxParticipate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ListChecks className="w-6 h-6 text-emerald-600" />
                  Requirements
                </h2>

                <div className="space-y-6">
                  {/* Add Requirement Form */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requirement Name *
                        </label>
                        <input
                          type="text"
                          value={newRequirement.name}
                          onChange={(e) => setNewRequirement({ ...newRequirement, name: e.target.value })}
                          className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Footwear"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={newRequirement.value}
                          onChange={(e) => setNewRequirement({ ...newRequirement, value: e.target.value })}
                          className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Hiking shoes"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newRequirement.description}
                          onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                          className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Proper hiking shoes required"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newRequirement.color}
                            onChange={(e) => setNewRequirement({ ...newRequirement, color: e.target.value })}
                            className="w-10 h-10 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={newRequirement.color}
                            onChange={(e) => setNewRequirement({ ...newRequirement, color: e.target.value })}
                            className="text-gray-600 flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={newRequirement.status}
                          onChange={(e) => setNewRequirement({ ...newRequirement, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                          className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Requirement
                    </button>

                    {errors.requirement && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.requirement}
                      </p>
                    )}
                  </div>

                  {/* Requirements List */}
                  {formData.requirements.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Added Requirements ({formData.requirements.length})
                      </h3>
                      {formData.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between group hover:border-gray-300 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: req.color }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {req.name}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {req.value}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  req.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {req.status}
                                </span>
                              </div>
                              {req.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {req.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveRequirement(index)}
                            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Remove requirement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ListChecks className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No requirements added yet</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Add requirements like age limits, equipment needed, etc.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl border-2 border-blue-500 hover:from-blue-700 hover:to-indigo-700 hover:border-blue-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Activity...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Add Activity
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Image Upload & Preview */}
          <div className="space-y-8">
            {/* Image Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Upload Images
              </h3>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Image Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      Click to upload images
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </label>
                </div>
              </div>

              {/* Manual Image URL */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Add by URL
                  </label>
                  <input
                    type="text"
                    value={newImage.imageUrl}
                    onChange={(e) =>
                      setNewImage({ ...newImage, imageUrl: e.target.value })
                    }
                    className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Name
                  </label>
                  <input
                    type="text"
                    value={newImage.name}
                    onChange={(e) =>
                      setNewImage({ ...newImage, name: e.target.value })
                    }
                    className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Main View, Action Shot, etc."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddImage}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              {errors.images && (
                <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Gallery Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Image Preview ({imagePreviews.length})
                </h3>
                {imagePreviews.length > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-sm font-medium">
                    {imagePreviews.length} images
                  </span>
                )}
              </div>

              {imagePreviews.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No images added yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload or add images to preview
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-medium truncate">
                            {formData.images[index]?.name ||
                              `Image ${index + 1}`}
                          </p>
                          <p className="text-white/80 text-xs truncate">
                            {formData.images[index]?.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && imagePreviews.length === 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                  <p className="text-red-600 text-sm">{errors.images}</p>
                </div>
              )}
            </div>

            {/* Form Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                Form Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">Activity</span>
                  <span className="font-semibold text-gray-900 truncate ml-2">
                    {formData.name || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Destination</span>
                  <span className="font-semibold text-gray-900 truncate ml-2">
                    {selectedDestination?.destinationName || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">
                    {formData.activitiesCategory || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {formData.durationHours ? `${formData.durationHours} hours` : "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold text-gray-900">
                    {formData.priceLocal && formData.priceForeigners 
                      ? `LKR ${formData.priceLocal} - ${formData.priceForeigners}`
                      : "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-sky-50 rounded-lg">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold text-gray-900">
                    {formData.minParticipate && formData.maxParticipate 
                      ? `${formData.minParticipate}-${formData.maxParticipate}`
                      : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Help & Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Tips & Guidelines
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Select the correct destination first
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Provide clear pricing for both local and foreign visitors
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Set realistic participant limits
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Add requirements like equipment, age limits, or skill levels
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Use high-quality images that showcase the activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewActivityPage;