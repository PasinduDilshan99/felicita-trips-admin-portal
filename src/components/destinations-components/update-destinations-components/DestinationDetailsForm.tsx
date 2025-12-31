// components/destinations-components/DestinationDetailsForm.tsx
import React, { useState } from "react";
import {
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
} from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  Globe,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";

interface DestinationDetailsFormProps {
  destination: SingleDestinationResponse;
  originalDestination: SingleDestinationResponse | null;
  removedImages: number[];
  removedActivities: number[];
  newImages: NewImageRequest[];
  newActivities: NewActivityRequest[];
  availableCategories: string[];
  availableActivityCategories: string[];
  availableSeasons: string[];
  onFieldChange: (field: string, value: any) => void;
  onRemoveImage: (imageId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onAddNewImage: (image: NewImageRequest) => void;
  onAddNewActivity: (activity: NewActivityRequest) => void;
  onUpdateActivity: (activity: Activity) => void;
  onUpdateImage: (image: Image) => void;
}

const DestinationDetailsForm: React.FC<DestinationDetailsFormProps> = ({
  destination,
  originalDestination,
  removedImages,
  removedActivities,
  newImages,
  newActivities,
  availableCategories,
  availableActivityCategories,
  availableSeasons,
  onFieldChange,
  onRemoveImage,
  onRemoveActivity,
  onAddNewImage,
  onAddNewActivity,
  onUpdateActivity,
  onUpdateImage,
}) => {
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [newImageData, setNewImageData] = useState<NewImageRequest>({
    name: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
  });
  const [newActivityData, setNewActivityData] = useState<NewActivityRequest>({
    name: "",
    description: "",
    activityCategory: "",
    durationHover: 0,
    availableFrom: "",
    availableTo: "",
    priceLocal: 0,
    priceForeigners: 0,
    minParticipate: 1,
    maxParticipate: 10,
    seasons: [],
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

  // Toggle activity expansion
  const toggleActivity = (activityId: number) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Handle new image submission
  const handleAddImage = () => {
    if (!newImageData.name.trim() || !newImageData.imageUrl.trim()) {
      alert("Image name and URL are required");
      return;
    }

    onAddNewImage({ ...newImageData });
    setNewImageData({
      name: "",
      description: "",
      imageUrl: "",
      status: "ACTIVE",
    });
    setShowNewImageForm(false);
  };

  // Handle new activity submission
  const handleAddActivity = () => {
    if (!newActivityData.name.trim() || !newActivityData.description.trim()) {
      alert("Activity name and description are required");
      return;
    }

    onAddNewActivity({ ...newActivityData });
    setNewActivityData({
      name: "",
      description: "",
      activityCategory: "",
      durationHover: 0,
      availableFrom: "",
      availableTo: "",
      priceLocal: 0,
      priceForeigners: 0,
      minParticipate: 1,
      maxParticipate: 10,
      seasons: [],
      status: "ACTIVE",
      activityImages: [],
    });
    setShowNewActivityForm(false);
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={destination.categoryName}
              onChange={(e) => onFieldChange("categoryName", e.target.value)}
              className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                hasChanged("categoryName")
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
              ({destination.images.length} existing, {newImages.length} new)
            </span>
          </h2>
          <button
            onClick={() => setShowNewImageForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors duration-200 flex items-center gap-2"
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
          {destination.images.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No images found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destination.images.map((image) => (
                <div
                  key={image.imageId}
                  className={`relative group rounded-xl overflow-hidden border-2 ${
                    isImageRemoved(image.imageId)
                      ? "border-red-300 bg-red-50"
                      : hasChanged("images")
                      ? "border-blue-200"
                      : "border-gray-200"
                  }`}
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
                  {isImageRemoved(image.imageId) && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                        Marked for Removal
                      </span>
                    </div>
                  )}
                </div>
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
                  className="relative group rounded-xl overflow-hidden border-2 border-green-300 bg-green-50"
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
                onClick={() => setShowNewImageForm(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={newImageData.imageUrl}
                  onChange={(e) =>
                    setNewImageData({
                      ...newImageData,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
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
                    setNewImageData({
                      ...newImageData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  rows={2}
                />
              </div>
              <button
                onClick={handleAddImage}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600"
              >
                Add Image
              </button>
            </div>
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
              ({destination.activities.length} existing, {newActivities.length}{" "}
              new)
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
            <div
              key={activity.activityId}
              className={`border-2 rounded-xl overflow-hidden ${
                isActivityRemoved(activity.activityId)
                  ? "border-red-300 bg-red-50"
                  : hasChanged("activities")
                  ? "border-blue-200"
                  : "border-gray-200"
              }`}
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
                        {activity.activitiesCategory} • {activity.durationHours}{" "}
                        hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        LKR {activity.priceLocal.toLocaleString()}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={activity.activitiesCategory}
                          onChange={(e) =>
                            onUpdateActivity({
                              ...activity,
                              activitiesCategory: e.target.value,
                            })
                          }
                          className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                        >
                          <option value="">Select category</option>
                          {availableActivityCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
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
                          className="text-gray-600 w-full px-3 py-2 rounded-lg border border-gray-300"
                          rows={2}
                        />
                      </div>
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
                    </div>
                  </div>
                )}
              </div>
              {isActivityRemoved(activity.activityId) && (
                <div className="px-4 py-2 bg-red-500 text-white text-sm font-medium">
                  Marked for Removal
                </div>
              )}
            </div>
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
                        {activity.activityCategory} • {activity.durationHover}{" "}
                        hours
                      </p>
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

        {/* New Activity Form (would be similar to New Image Form) */}

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

            <div className="space-y-4">
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Guided Rock Climb"
                />
              </div>

              {/* Activity Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={newActivityData.activityCategory}
                  onChange={(e) =>
                    setNewActivityData({
                      ...newActivityData,
                      activityCategory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {availableActivityCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe the activity in detail"
                />
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2.5"
                  />
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1500.00"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4000.00"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Seasons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seasons *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSeasons.map((season) => (
                    <label key={season} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newActivityData.seasons.includes(season)}
                        onChange={(e) => {
                          const newSeasons = e.target.checked
                            ? [...newActivityData.seasons, season]
                            : newActivityData.seasons.filter(
                                (s) => s !== season
                              );
                          setNewActivityData({
                            ...newActivityData,
                            seasons: newSeasons,
                          });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {season}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activity Images Section */}
              <div className="pt-4 border-t border-gray-300">
                <h4 className="text-md font-medium text-gray-800 mb-3">
                  Activity Images (Optional)
                </h4>

                {/* Add Image Button for Activity */}
                <button
                  type="button"
                  onClick={() => {
                    setNewActivityData({
                      ...newActivityData,
                      activityImages: [
                        ...newActivityData.activityImages,
                        {
                          name: "",
                          description: "",
                          imageUrl: "",
                          status: "ACTIVE",
                        },
                      ],
                    });
                  }}
                  className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Activity Image
                </button>

                {/* Activity Images List */}
                {newActivityData.activityImages.map((image, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-800">
                        Activity Image {index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...newActivityData.activityImages];
                          newImages.splice(index, 1);
                          setNewActivityData({
                            ...newActivityData,
                            activityImages: newImages,
                          });
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Image URL *
                        </label>
                        <input
                          type="text"
                          value={image.imageUrl}
                          onChange={(e) => {
                            const newImages = [
                              ...newActivityData.activityImages,
                            ];
                            newImages[index] = {
                              ...image,
                              imageUrl: e.target.value,
                            };
                            setNewActivityData({
                              ...newActivityData,
                              activityImages: newImages,
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Image Name *
                        </label>
                        <input
                          type="text"
                          value={image.name}
                          onChange={(e) => {
                            const newImages = [
                              ...newActivityData.activityImages,
                            ];
                            newImages[index] = {
                              ...image,
                              name: e.target.value,
                            };
                            setNewActivityData({
                              ...newActivityData,
                              activityImages: newImages,
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="e.g., Starting Point View"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description
                        </label>
                        <textarea
                          value={image.description}
                          onChange={(e) => {
                            const newImages = [
                              ...newActivityData.activityImages,
                            ];
                            newImages[index] = {
                              ...image,
                              description: e.target.value,
                            };
                            setNewActivityData({
                              ...newActivityData,
                              activityImages: newImages,
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          rows={2}
                          placeholder="Describe this image"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setShowNewActivityForm(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-colors duration-200 font-medium"
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
