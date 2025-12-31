// app/destinations/update/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import {
  DestinationForTerminate,
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
  UpdateDestinationRequest,
} from "@/types/destination-types";
import {
  Search,
  Edit,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import DestinationSearch from "@/components/destinations-components/update-destinations-components/DestinationSearch";
import DestinationDetailsForm from "@/components/destinations-components/update-destinations-components/DestinationDetailsForm";
import UpdateConfirmationModal from "@/components/destinations-components/update-destinations-components/UpdateConfirmationModal";

const UpdateDestinationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  // State for destinations list
  const [destinations, setDestinations] = useState<DestinationForTerminate[]>(
    []
  );

  // State for selected destination
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationForTerminate | null>(
      initialDestinationId && initialDestinationName
        ? {
            destinationId: parseInt(initialDestinationId),
            destinationName: initialDestinationName,
          }
        : null
    );

  // State for original destination details
  const [originalDestination, setOriginalDestination] =
    useState<SingleDestinationResponse | null>(null);

  // State for edited destination
  const [editedDestination, setEditedDestination] =
    useState<SingleDestinationResponse | null>(null);

  // State for removed items
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [removedActivities, setRemovedActivities] = useState<number[]>([]);

  // State for new items
  const [newImages, setNewImages] = useState<NewImageRequest[]>([]);
  const [newActivities, setNewActivities] = useState<NewActivityRequest[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableActivityCategories, setAvailableActivityCategories] =
    useState<string[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Update",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/update`,
    },
  ];

  // Fetch destinations list on initial load
  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
    loadLookupData();
  }, []);

  // If initialDestinationId is provided, fetch details
  useEffect(() => {
    if (initialDestinationId && !originalDestination) {
      handleSelectDestination(
        parseInt(initialDestinationId),
        initialDestinationName
      );
    }
  }, [initialDestinationId, initialDestinationName]);

  const loadLookupData = async () => {
    try {
      const [categories, activityCategories] = await Promise.all([
        DestinationService.getCategories(),
        DestinationService.getActivityCategories(),
      ]);
      setAvailableCategories(categories);
      setAvailableActivityCategories(activityCategories);
      setAvailableSeasons(DestinationService.getSeasons());
    } catch (err) {
      console.error("Error loading lookup data:", err);
    }
  };

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  // Handle destination selection
  const handleSelectDestination = async (id: number, name: string) => {
    setSelectedDestination({ destinationId: id, destinationName: name });
    await fetchDestinationDetails(id);
  };

  // Fetch destination details
  const fetchDestinationDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalDestination(null);
    setEditedDestination(null);
    setRemovedImages([]);
    setRemovedActivities([]);
    setNewImages([]);
    setNewActivities([]);
    try {
      const response = await DestinationService.getDestinationById(id);
      setOriginalDestination(response.data);
      setEditedDestination(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destination details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    if (!editedDestination) return;

    setEditedDestination({
      ...editedDestination,
      [field]: value,
    });
  };

  // Handle image removal
  const handleRemoveImage = (imageId: number) => {
    if (!editedDestination) return;

    // Add to removed images list
    setRemovedImages((prev) => [...prev, imageId]);

    // Remove from edited destination
    setEditedDestination({
      ...editedDestination,
      images: editedDestination.images.filter((img) => img.imageId !== imageId),
    });
  };

  // Handle activity removal
  const handleRemoveActivity = (activityId: number) => {
    if (!editedDestination) return;

    // Add to removed activities list
    setRemovedActivities((prev) => [...prev, activityId]);

    // Remove from edited destination
    setEditedDestination({
      ...editedDestination,
      activities: editedDestination.activities.filter(
        (act) => act.activityId !== activityId
      ),
    });
  };

  // Handle new image addition
  const handleAddNewImage = (image: NewImageRequest) => {
    setNewImages((prev) => [...prev, image]);
  };

  // Handle new activity addition
  const handleAddNewActivity = (activity: NewActivityRequest) => {
    setNewActivities((prev) => [...prev, activity]);
  };

  // Handle update existing activity
  const handleUpdateActivity = (updatedActivity: Activity) => {
    if (!editedDestination) return;

    setEditedDestination({
      ...editedDestination,
      activities: editedDestination.activities.map((act) =>
        act.activityId === updatedActivity.activityId ? updatedActivity : act
      ),
    });
  };

  // Handle update existing image
  const handleUpdateImage = (updatedImage: Image) => {
    if (!editedDestination) return;

    setEditedDestination({
      ...editedDestination,
      images: editedDestination.images.map((img) =>
        img.imageId === updatedImage.imageId ? updatedImage : img
      ),
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalDestination || !editedDestination) return false;

    // Check basic fields
    const basicFieldsChanged =
      originalDestination.destinationName !==
        editedDestination.destinationName ||
      originalDestination.destinationDescription !==
        editedDestination.destinationDescription ||
      originalDestination.location !== editedDestination.location ||
      originalDestination.latitude !== editedDestination.latitude ||
      originalDestination.longitude !== editedDestination.longitude ||
      originalDestination.categoryName !== editedDestination.categoryName ||
      originalDestination.statusName !== editedDestination.statusName;

    // Check if any items were removed or added
    const itemsChanged =
      removedImages.length > 0 ||
      removedActivities.length > 0 ||
      newImages.length > 0 ||
      newActivities.length > 0;

    return basicFieldsChanged || itemsChanged;
  }, [
    originalDestination,
    editedDestination,
    removedImages,
    removedActivities,
    newImages,
    newActivities,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateDestinationRequest | null => {
    if (!editedDestination || !selectedDestination) return null;

    return {
      destinationId: selectedDestination.destinationId,
      name: editedDestination.destinationName,
      description: editedDestination.destinationDescription,
      status: editedDestination.statusName as "ACTIVE" | "INACTIVE",
      destinationCategory: editedDestination.categoryName,
      location: editedDestination.location,
      latitude: editedDestination.latitude,
      longitude: editedDestination.longitude,
      extraPrice: editedDestination.extraPrice || undefined, // Handle optional
      extraPriceNote: editedDestination.extraPriceNote || "",
      removeImages: removedImages, // Use the correct state variable name
      newImages,
      removeActivities: removedActivities, // Use the correct state variable name
      newActivities,
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await DestinationService.updateDestination(updateData);

      setSuccess(`Destination updated successfully! ID: ${response.data.id}`);
      setShowConfirmModal(false);

      // Refresh the data after successful update
      setTimeout(() => {
        if (selectedDestination) {
          fetchDestinationDetails(selectedDestination.destinationId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update destination");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalDestination) {
      setEditedDestination(originalDestination);
      setRemovedImages([]);
      setRemovedActivities([]);
      setNewImages([]);
      setNewActivities([]);
      setError(null);
      setSuccess(null);
    }
  };

  // Get changed fields for confirmation modal
  const getChangedFields = () => {
    if (!originalDestination || !editedDestination) return [];

    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }> = [];

    // Basic fields
    const fields = [
      { key: "destinationName", label: "Destination Name" },
      { key: "destinationDescription", label: "Description" },
      { key: "location", label: "Location" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
      { key: "categoryName", label: "Category" },
      { key: "statusName", label: "Status" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue =
        originalDestination[key as keyof SingleDestinationResponse];
      const newValue =
        editedDestination[key as keyof SingleDestinationResponse];

      if (oldValue !== newValue) {
        changes.push({
          field: label,
          oldValue,
          newValue,
        });
      }
    });

    // Add counts of removed/added items
    if (removedImages.length > 0) {
      changes.push({
        field: "Images to Remove",
        oldValue: originalDestination.images.length,
        newValue: originalDestination.images.length - removedImages.length,
      });
    }

    if (newImages.length > 0) {
      changes.push({
        field: "New Images",
        oldValue: originalDestination.images.length,
        newValue: originalDestination.images.length + newImages.length,
      });
    }

    if (removedActivities.length > 0) {
      changes.push({
        field: "Activities to Remove",
        oldValue: originalDestination.activities.length,
        newValue:
          originalDestination.activities.length - removedActivities.length,
      });
    }

    if (newActivities.length > 0) {
      changes.push({
        field: "New Activities",
        oldValue: originalDestination.activities.length,
        newValue: originalDestination.activities.length + newActivities.length,
      });
    }

    return changes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Destination"
            description="Edit and update existing destination information"
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
                  Update Successful!
                </h3>
                <p className="text-green-600 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-600" />
            Select Destination to Update
          </h2>

          <DestinationSearch
            destinations={destinations}
            loading={loading}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            initialSearchTerm={initialDestinationName}
          />
        </div>

        {/* Loading State for Details */}
        {loadingDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading destination details...</p>
          </div>
        )}

        {/* Destination Details Form */}
        {editedDestination && selectedDestination && (
          <DestinationDetailsForm
            destination={editedDestination}
            originalDestination={originalDestination}
            removedImages={removedImages}
            removedActivities={removedActivities}
            newImages={newImages}
            newActivities={newActivities}
            availableCategories={availableCategories}
            availableActivityCategories={availableActivityCategories}
            availableSeasons={availableSeasons}
            onFieldChange={handleFieldChange}
            onRemoveImage={handleRemoveImage}
            onRemoveActivity={handleRemoveActivity}
            onAddNewImage={handleAddNewImage}
            onAddNewActivity={handleAddNewActivity}
            onUpdateActivity={handleUpdateActivity}
            onUpdateImage={handleUpdateImage}
          />
        )}

        {/* Action Buttons */}
        {editedDestination && originalDestination && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl border-2 border-blue-500 hover:from-blue-700 hover:to-indigo-700 hover:border-blue-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Destination"}
              </button>
            </div>

            {/* Change Indicator */}
            {hasChanges() && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-blue-700 font-medium">
                      You have unsaved changes
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      Click "Update Destination" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalDestination && editedDestination && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            loading={loadingUpdate}
            changedFields={getChangedFields()}
            originalDestination={originalDestination}
            editedDestination={editedDestination}
            removedImages={removedImages}
            newImages={newImages}
            removedActivities={removedActivities}
            newActivities={newActivities}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateDestinationPage;
