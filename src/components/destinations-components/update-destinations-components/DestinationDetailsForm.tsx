// components/destinations-components/DestinationDetailsForm.tsx
import React, { useState, useRef } from "react";
import {
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
} from "@/types/destination-types";
import { OtherService } from "@/services/otherService";
import {
  Image as ImageIcon,
  Globe,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { DestinationCategory, ActivityCategory, SeasonType } from "@/types/common-types";

interface DestinationDetailsFormProps {
  destination: SingleDestinationResponse;
  originalDestination: SingleDestinationResponse | null;
  removedImages: number[];
  removedActivities: number[];
  newImages: NewImageRequest[];
  newActivities: NewActivityRequest[];
  currentCategoryIds: number[];
  originalCategoryIds: number[];
  availableCategories: DestinationCategory[];
  availableActivityCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  onFieldChange: (field: string, value: any) => void;
  onCategoryChange: (categoryId: number) => void;
  onRemoveImage: (imageId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onAddNewImage: (file: File, name: string, description: string) => Promise<void>;
  onAddNewActivity: (activity: NewActivityRequest) => void;
  onUpdateActivity: (activity: Activity) => void;
  onUpdateImage: (image: Image) => void;
  uploadingImages: boolean;
}

const DestinationDetailsForm: React.FC<DestinationDetailsFormProps> = ({
  destination,
  originalDestination,
  removedImages,
  removedActivities,
  newImages,
  newActivities,
  currentCategoryIds,
  originalCategoryIds,
  availableCategories,
  availableActivityCategories,
  availableSeasons,
  onFieldChange,
  onCategoryChange,
  onRemoveImage,
  onRemoveActivity,
  onAddNewImage,
  onAddNewActivity,
  onUpdateActivity,
  onUpdateImage,
  uploadingImages,
}) => {
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [uploadingLocalImage, setUploadingLocalImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newImageData, setNewImageData] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });
  
  const [newActivityData, setNewActivityData] = useState<NewActivityRequest>({
    name: "",
    description: "",
    addActivityCategoriesId: [],
    removeActivityCategoriesId: [],
    durationHover: 0,
    availableFrom: "",
    availableTo: "",
    priceLocal: 0,
    priceForeigners: 0,
    minParticipate: 1,
    maxParticipate: 10,
    seasonId: 0,
    status: "ACTIVE",
    activityImages: [],
  });

  // Helper to check if a field has changed
  const hasChanged = (field: string): boolean => {
    if (!originalDestination) return false;
    return (
      originalDestination[field as keyof SingleDestinationResponse] !==
      destination[field as keyof SingleDestinationResponse]
    );
  };

  // Helper to check if an image is marked for removal
  const isImageRemoved = (imageId: number): boolean => {
    return removedImages.includes(imageId);
  };

  // Helper to check if an activity is marked for removal
  const isActivityRemoved = (activityId: number): boolean => {
    return removedActivities.includes(activityId);
  };

  // Helper to check if category is selected
  const isCategorySelected = (categoryId: number): boolean => {
    return currentCategoryIds.includes(categoryId);
  };

  // Helper to check if category is newly added
  const isCategoryNewlyAdded = (categoryId: number): boolean => {
    return currentCategoryIds.includes(categoryId) && !originalCategoryIds.includes(categoryId);
  };

  // Helper to check if category is marked for removal
  const isCategoryRemoved = (categoryId: number): boolean => {
    return originalCategoryIds.includes(categoryId) && !currentCategoryIds.includes(categoryId);
  };

  // Toggle activity expansion
  const toggleActivity = (activityId: number) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Handle file selection for image upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setNewImageData({ ...newImageData, file });
    }
  };

  // Handle new image submission with Cloudinary upload
  const handleAddImage = async () => {
    if (!newImageData.name.trim()) {
      alert("Image name is required");
      return;
    }
    if (!newImageData.file) {
      alert("Please select an image file");
      return;
    }

    setUploadingLocalImage(true);
    try {
      await onAddNewImage(newImageData.file, newImageData.name, newImageData.description);
      setNewImageData({ name: "", description: "", file: null });
      setShowNewImageForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingLocalImage(false);
    }
  };

  // Handle new activity submission
  const handleAddActivity = () => {
    if (!newActivityData.name.trim() || !newActivityData.description.trim()) {
      alert("Activity name and description are required");
      return;
    }
    if (!newActivityData.seasonId) {
      alert("Please select a season");
      return;
    }

    onAddNewActivity({ ...newActivityData });
    setNewActivityData({
      name: "",
      description: "",
      addActivityCategoriesId: [],
      removeActivityCategoriesId: [],
      durationHover: 0,
      availableFrom: "",
      availableTo: "",
      priceLocal: 0,
      priceForeigners: 0,
      minParticipate: 1,
      maxParticipate: 10,
      seasonId: 0,
      status: "ACTIVE",
      activityImages: [],
    });
    setShowNewActivityForm(false);
  };

  // Handle activity category change for new activity
  const handleActivityCategoryChange = (categoryId: number, isAdding: boolean) => {
    if (isAdding) {
      setNewActivityData({
        ...newActivityData,
        addActivityCategoriesId: [...newActivityData.addActivityCategoriesId, categoryId],
        removeActivityCategoriesId: newActivityData.removeActivityCategoriesId.filter(
          (id) => id !== categoryId
        ),
      });
    } else {
      setNewActivityData({
        ...newActivityData,
        removeActivityCategoriesId: [...newActivityData.removeActivityCategoriesId, categoryId],
        addActivityCategoriesId: newActivityData.addActivityCategoriesId.filter(
          (id) => id !== categoryId
        ),
      });
    }
  };

  // Handle existing activity category change (multi-select) - categories are strings (names)
  const handleExistingActivityCategoryChange = (activity: Activity, categoryName: string, isChecked: boolean) => {
    let updatedCategories: string[];
    
    if (isChecked) {
      updatedCategories = [...activity.activityCategories, categoryName];
    } else {
      updatedCategories = activity.activityCategories.filter(name => name !== categoryName);
    }
    
    onUpdateActivity({
      ...activity,
      activityCategories: updatedCategories,
    });
  };

  // Get category color
  const getCategoryColor = (categoryId: number): string => {
    const category = availableCategories.find(
      (cat) => cat.destinationCategoryId === categoryId
    );
    return category?.destinationCategoryColor || "#3B82F6";
  };

  // Get category name
  const getCategoryName = (categoryId: number): string => {
    const category = availableCategories.find(
      (cat) => cat.destinationCategoryId === categoryId
    );
    return category?.destinationCategoryName || `Category ${categoryId}`;
  };

  // Get season name by ID for display
  const getSeasonNameById = (seasonId: number): string => {
    const season = availableSeasons.find(
      (s) => s.seasonId === seasonId
    );
    return season?.seasonName || `Season ${seasonId}`;
  };

  // Get season ID by name
  const getSeasonIdByName = (seasonName: string): number => {
    const season = availableSeasons.find(
      (s) => s.seasonName === seasonName
    );
    return season?.seasonId || 0;
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Edit className="w-6 h-6 text-blue-600" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Name *
            </label>
            <input
              type="text"
              value={destination.destinationName}
              onChange={(e) => onFieldChange("destinationName", e.target.value)}
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("destinationName")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {hasChanged("destinationName") && (
              <p className="mt-2 text-sm text-blue-600">
                This field has been modified
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={destination.statusName}
              onChange={(e) => onFieldChange("statusName", e.target.value)}
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("statusName")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Categories - Multi-select */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories * (Select one or more)
            </label>
            <div className="rounded-xl border-2 border-gray-200 p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {currentCategoryIds.length > 0 ? (
                  currentCategoryIds.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `${getCategoryColor(categoryId)}20`,
                        color: getCategoryColor(categoryId),
                        border: `1px solid ${getCategoryColor(categoryId)}40`,
                      }}
                    >
                      {getCategoryName(categoryId)}
                      <button
                        type="button"
                        onClick={() => onCategoryChange(categoryId)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    No categories selected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {availableCategories.map((category) => (
                  <label
                    key={category.destinationCategoryId}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      isCategorySelected(category.destinationCategoryId)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCategorySelected(category.destinationCategoryId)}
                      onChange={() => onCategoryChange(category.destinationCategoryId)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span
                        className="text-sm"
                        style={{
                          color: isCategorySelected(category.destinationCategoryId)
                            ? getCategoryColor(category.destinationCategoryId)
                            : "#374151",
                        }}
                      >
                        {category.destinationCategoryName}
                      </span>
                      {isCategoryNewlyAdded(category.destinationCategoryId) && (
                        <span className="ml-2 text-xs text-green-600">(New)</span>
                      )}
                      {isCategoryRemoved(category.destinationCategoryId) && (
                        <span className="ml-2 text-xs text-red-600">(Removing)</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {currentCategoryIds.length !== originalCategoryIds.length && (
              <p className="mt-2 text-sm text-blue-600">
                Categories have been modified
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={destination.destinationDescription}
              onChange={(e) =>
                onFieldChange("destinationDescription", e.target.value)
              }
              rows={4}
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("destinationDescription")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={destination.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("location")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          </div>

          {/* Extra Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Price (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={destination.extraPrice || ""}
              onChange={(e) =>
                onFieldChange("extraPrice", parseFloat(e.target.value))
              }
              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0.00"
            />
          </div>

          {/* Extra Price Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Price Note
            </label>
            <input
              type="text"
              value={destination.extraPriceNote || ""}
              onChange={(e) => onFieldChange("extraPriceNote", e.target.value)}
              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., Entrance fee, Tax, etc."
            />
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={destination.latitude}
              onChange={(e) =>
                onFieldChange("latitude", parseFloat(e.target.value))
              }
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("latitude")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={destination.longitude}
              onChange={(e) =>
                onFieldChange("longitude", parseFloat(e.target.value))
              }
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("longitude")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Images Management Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-rose-600" />
            Images Management
            <span className="text-sm font-normal text-gray-500">
              ({destination.images.length - removedImages.length} existing, {newImages.length} new)
            </span>
          </h2>
          <button
            onClick={() => setShowNewImageForm(true)}
            disabled={uploadingImages || uploadingLocalImage}
            className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add New Image
          </button>
        </div>

        {/* Existing Images */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Existing Images
          </h3>
          {destination.images.filter(img => !isImageRemoved(img.imageId)).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No images found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destination.images.map((image) => (
                !isImageRemoved(image.imageId) && (
                  <div
                    key={image.imageId}
                    className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium truncate">
                          {image.imageName}
                        </p>
                        <p className="text-white/80 text-xs truncate">
                          {image.imageDescription}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveImage(image.imageId)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* New Images */}
        {newImages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              New Images to Add
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newImages.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {image.description}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                    New
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Form */}
        {showNewImageForm && (
          <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Image
              </h3>
              <button
                onClick={() => {
                  setShowNewImageForm(false);
                  setNewImageData({ name: "", description: "", file: null });
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image File * (Max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-file-input"
                  />
                  <label htmlFor="image-file-input" className="cursor-pointer block">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      {newImageData.file ? newImageData.file.name : "Click to select image"}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {newImageData.file && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(newImageData.file)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Name *
                </label>
                <input
                  type="text"
                  value={newImageData.name}
                  onChange={(e) =>
                    setNewImageData({ ...newImageData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Main View"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newImageData.description}
                  onChange={(e) =>
                    setNewImageData({ ...newImageData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNewImageForm(false);
                    setNewImageData({ name: "", description: "", file: null });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  disabled={uploadingLocalImage || !newImageData.file}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploadingLocalImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload to Cloudinary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Uploading Indicator */}
        {(uploadingImages || uploadingLocalImage) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-600">
              {uploadingLocalImage ? "Uploading image to Cloudinary..." : "Processing images..."}
            </span>
          </div>
        )}
      </div>

      {/* Activities Management Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="w-6 h-6 text-purple-600" />
            Activities Management
            <span className="text-sm font-normal text-gray-500">
              ({destination.activities.length - removedActivities.length} existing, {newActivities.length} new)
            </span>
          </h2>
          <button
            onClick={() => setShowNewActivityForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Activity
          </button>
        </div>

        {/* Existing Activities */}
        <div className="space-y-4">
          {destination.activities.map((activity) => (
            !isActivityRemoved(activity.activityId) && (
              <div
                key={activity.activityId}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-200 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActivity(activity.activityId)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedActivities.includes(activity.activityId) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {activity.activityName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activity.activityCategories?.join(", ") || "No categories"} • {activity.durationHours} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          LKR {activity.priceLocal?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-500">Local</div>
                      </div>
                      <button
                        onClick={() => onRemoveActivity(activity.activityId)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Remove activity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {expandedActivities.includes(activity.activityId) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Activity Name
                          </label>
                          <input
                            type="text"
                            value={activity.activityName}
                            onChange={(e) =>
                              onUpdateActivity({
                                ...activity,
                                activityName: e.target.value,
                              })
                            }
                            className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Activity Categories (Select one or more)
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                            {availableActivityCategories.map((category) => (
                              <label key={category.activityCategoryId} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={activity.activityCategories?.includes(category.activityCategoryName) || false}
                                  onChange={(e) => handleExistingActivityCategoryChange(
                                    activity, 
                                    category.activityCategoryName, 
                                    e.target.checked
                                  )}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{category.activityCategoryName}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={activity.activityDescription}
                            onChange={(e) =>
                              onUpdateActivity({
                                ...activity,
                                activityDescription: e.target.value,
                              })
                            }
                            className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (hours)
                            </label>
                            <input
                              type="number"
                              value={activity.durationHours}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  durationHours: parseFloat(e.target.value),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Season
                            </label>
                            <select
                              value={getSeasonIdByName(activity.season)}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  season: getSeasonNameById(parseInt(e.target.value)),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            >
                              <option value={0}>Select season</option>
                              {availableSeasons.map((season) => (
                                <option key={season.seasonId} value={season.seasonId}>
                                  {season.seasonName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Available From
                            </label>
                            <input
                              type="time"
                              value={activity.availableFrom || ""}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  availableFrom: e.target.value,
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Available To
                            </label>
                            <input
                              type="time"
                              value={activity.availableTo || ""}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  availableTo: e.target.value,
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Local Price (LKR)
                            </label>
                            <input
                              type="number"
                              value={activity.priceLocal}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  priceLocal: parseFloat(e.target.value),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Foreigners Price (LKR)
                            </label>
                            <input
                              type="number"
                              value={activity.priceForeigners}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  priceForeigners: parseFloat(e.target.value),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Participants
                            </label>
                            <input
                              type="number"
                              value={activity.minParticipate}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  minParticipate: parseInt(e.target.value),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Participants
                            </label>
                            <input
                              type="number"
                              value={activity.maxParticipate}
                              onChange={(e) =>
                                onUpdateActivity({
                                  ...activity,
                                  maxParticipate: parseInt(e.target.value),
                                })
                              }
                              className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ))}
        </div>

        {/* New Activities */}
        {newActivities.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              New Activities to Add
            </h3>
            <div className="space-y-4">
              {newActivities.map((activity, index) => (
                <div
                  key={index}
                  className="border-2 border-green-300 bg-green-50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Duration: {activity.durationHover} hours
                      </p>
                      {activity.addActivityCategoriesId.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Categories: {activity.addActivityCategoriesId.map(id => {
                            const cat = availableActivityCategories.find(c => c.activityCategoryId === id);
                            return cat?.activityCategoryName || `Category ${id}`;
                          }).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          LKR {activity.priceLocal.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Local</div>
                      </div>
                      <div className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                        New
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Activity Form */}
        {showNewActivityForm && (
          <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Activity
              </h3>
              <button
                onClick={() => setShowNewActivityForm(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {/* Activity Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={newActivityData.name}
                  onChange={(e) =>
                    setNewActivityData({
                      ...newActivityData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Guided Rock Climb"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newActivityData.description}
                  onChange={(e) =>
                    setNewActivityData({
                      ...newActivityData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe the activity in detail"
                />
              </div>

              {/* Activity Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Categories (Select one or more)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {availableActivityCategories.map((category) => (
                    <label key={category.activityCategoryId} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newActivityData.addActivityCategoriesId.includes(category.activityCategoryId)}
                        onChange={(e) => handleActivityCategoryChange(category.activityCategoryId, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{category.activityCategoryName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    value={newActivityData.durationHover}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        durationHover: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Season *
                  </label>
                  <select
                    value={newActivityData.seasonId}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        seasonId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  >
                    <option value={0}>Select season</option>
                    {availableSeasons.map((season) => (
                      <option key={season.seasonId} value={season.seasonId}>
                        {season.seasonName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From *
                  </label>
                  <input
                    type="time"
                    value={newActivityData.availableFrom}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        availableFrom: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                {/* Available To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available To *
                  </label>
                  <input
                    type="time"
                    value={newActivityData.availableTo}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        availableTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={newActivityData.priceLocal}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        priceLocal: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                {/* Foreigners Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foreigners Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={newActivityData.priceForeigners}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        priceForeigners: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Participants *
                  </label>
                  <input
                    type="number"
                    value={newActivityData.minParticipate}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        minParticipate: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    value={newActivityData.maxParticipate}
                    onChange={(e) =>
                      setNewActivityData({
                        ...newActivityData,
                        maxParticipate: parseInt(e.target.value) || 10,
                      })
                    }
                    min="1"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newActivityData.status}
                  onChange={(e) =>
                    setNewActivityData({
                      ...newActivityData,
                      status: e.target.value as "ACTIVE" | "INACTIVE",
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setShowNewActivityForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 font-medium"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailsForm;