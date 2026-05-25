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
import { OtherService } from "@/services/otherService";
import {
  DestinationForTerminate,
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
  UpdateDestinationRequest,
  DestinationCategoryDetailsDtos,
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
  X,
} from "lucide-react";
import DestinationDetailsForm from "@/components/destinations-components/update-destinations-components/DestinationDetailsForm";
import UpdateConfirmationModal from "@/components/destinations-components/update-destinations-components/UpdateConfirmationModal";
import {
  ActivityCategory,
  DestinationCategory,
  SeasonType,
} from "@/types/common-types";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  DESTINATION_CATEGORY_UPDATE_URL,
  DESTINATION_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";
import { hexToRgba } from "@/utils/functions";

const UpdateDestinationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  // Use the common context
  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  // State for destinations list
  const [destinations, setDestinations] = useState<DestinationForTerminate[]>(
    [],
  );

  // State for selected destination
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationForTerminate | null>(
      initialDestinationId && initialDestinationName
        ? {
            destinationId: parseInt(initialDestinationId),
            destinationName: initialDestinationName,
          }
        : null,
    );

  // State for original destination details
  const [originalDestination, setOriginalDestination] =
    useState<SingleDestinationResponse | null>(null);

  // State for edited destination
  const [editedDestination, setEditedDestination] =
    useState<SingleDestinationResponse | null>(null);

  // State for category changes
  const [originalCategoryIds, setOriginalCategoryIds] = useState<number[]>([]);
  const [currentCategoryIds, setCurrentCategoryIds] = useState<number[]>([]);

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Derive available categories from context
  const [availableCategories, setAvailableCategories] = useState<
    DestinationCategory[]
  >([]);
  const [availableActivityCategories, setAvailableActivityCategories] =
    useState<ActivityCategory[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<SeasonType[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    {
      label: "Destinations",
      href: DESTINATION_PAGE_URL,
    },
    {
      label: "Update",
      href: DESTINATION_CATEGORY_UPDATE_URL,
    },
  ];

  // Extract categories from context data
  useEffect(() => {
    if (categories) {
      setAvailableCategories(categories.destinationCategoryList);
      setAvailableActivityCategories(categories.activityCategoryList);
      setAvailableSeasons(categories.seasonsList);
    }
  }, [categories]);

  // Fetch destinations list on initial load
  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
  }, []);

  // If initialDestinationId is provided, fetch details
  useEffect(() => {
    if (initialDestinationId && !originalDestination) {
      handleSelectDestination(
        parseInt(initialDestinationId),
        initialDestinationName,
      );
    }
  }, [initialDestinationId, initialDestinationName]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load destinations",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle destination selection
  const handleSelectDestination = async (id: number, name: string) => {
    setSelectedDestination({ destinationId: id, destinationName: name });
    await fetchDestinationDetails(id);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const response = await OtherService.uploadImage(file);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  // Handle new image addition with Cloudinary upload
  const handleAddNewImage = async (
    imageFile: File,
    imageName: string,
    imageDescription: string,
  ) => {
    setUploadingImages(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile);

      const newImage: NewImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedDestination) {
        const tempImage: Image = {
          imageId: Date.now(),
          imageName: imageName,
          imageDescription: imageDescription,
          imageUrl: cloudinaryUrl,
        };
        setEditedDestination({
          ...editedDestination,
          images: [...editedDestination.images, tempImage],
        });
      }
    } catch (error: any) {
      setError(error.message || "Failed to upload image");
      setToast({
        type: "error",
        title: "Upload Failed",
        message: error.message || "Failed to upload image",
      });
    } finally {
      setUploadingImages(false);
    }
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
    setOriginalCategoryIds([]);
    setCurrentCategoryIds([]);

    try {
      const response = await DestinationService.getDestinationById(id);
      const destinationData = response.data;
      setOriginalDestination(destinationData);
      setEditedDestination(destinationData);

      const categoryIds =
        destinationData.destinationCategoryDetailsDtos?.map(
          (cat: DestinationCategoryDetailsDtos) => cat.id,
        ) || [];
      setOriginalCategoryIds(categoryIds);
      setCurrentCategoryIds(categoryIds);
    } catch (err: any) {
      setError(err.message || "Failed to load destination details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load destination details",
      });
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

  // Handle category changes
  const handleCategoryChange = (categoryId: number) => {
    setCurrentCategoryIds((prev) => {
      let newIds: number[];
      if (prev.includes(categoryId)) {
        newIds = prev.filter((id) => id !== categoryId);
      } else {
        newIds = [...prev, categoryId];
      }
      return newIds;
    });
  };

  // Handle image removal
  const handleRemoveImage = (imageId: number) => {
    if (!editedDestination) return;

    setRemovedImages((prev) => [...prev, imageId]);

    setEditedDestination({
      ...editedDestination,
      images: editedDestination.images.filter((img) => img.imageId !== imageId),
    });
  };

  // Handle activity removal
  const handleRemoveActivity = (activityId: number) => {
    if (!editedDestination) return;

    setRemovedActivities((prev) => [...prev, activityId]);

    setEditedDestination({
      ...editedDestination,
      activities: editedDestination.activities.filter(
        (act) => act.activityId !== activityId,
      ),
    });
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
        act.activityId === updatedActivity.activityId ? updatedActivity : act,
      ),
    });
  };

  // Handle update existing image
  const handleUpdateImage = (updatedImage: Image) => {
    if (!editedDestination) return;

    setEditedDestination({
      ...editedDestination,
      images: editedDestination.images.map((img) =>
        img.imageId === updatedImage.imageId ? updatedImage : img,
      ),
    });
  };

  // Calculate category changes
  const getCategoryChanges = useCallback(() => {
    const removedCategoryIds = originalCategoryIds.filter(
      (id) => !currentCategoryIds.includes(id),
    );
    const addedCategoryIds = currentCategoryIds.filter(
      (id) => !originalCategoryIds.includes(id),
    );
    return { removedCategoryIds, addedCategoryIds };
  }, [originalCategoryIds, currentCategoryIds]);

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalDestination || !editedDestination) return false;

    const basicFieldsChanged =
      originalDestination.destinationName !==
        editedDestination.destinationName ||
      originalDestination.destinationDescription !==
        editedDestination.destinationDescription ||
      originalDestination.location !== editedDestination.location ||
      originalDestination.latitude !== editedDestination.latitude ||
      originalDestination.longitude !== editedDestination.longitude ||
      originalDestination.statusName !== editedDestination.statusName;

    const { removedCategoryIds, addedCategoryIds } = getCategoryChanges();
    const categoriesChanged =
      removedCategoryIds.length > 0 || addedCategoryIds.length > 0;

    const itemsChanged =
      removedImages.length > 0 ||
      removedActivities.length > 0 ||
      newImages.length > 0 ||
      newActivities.length > 0;

    return basicFieldsChanged || categoriesChanged || itemsChanged;
  }, [
    originalDestination,
    editedDestination,
    removedImages,
    removedActivities,
    newImages,
    newActivities,
    getCategoryChanges,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateDestinationRequest | null => {
    if (!editedDestination || !selectedDestination) return null;

    const { removedCategoryIds, addedCategoryIds } = getCategoryChanges();

    return {
      destinationId: selectedDestination.destinationId,
      name: editedDestination.destinationName,
      description: editedDestination.destinationDescription,
      status: editedDestination.statusName as "ACTIVE" | "INACTIVE",
      removedestinationCategoriesIdList: removedCategoryIds,
      adddestinationCategoriesIdList: addedCategoryIds,
      location: editedDestination.location,
      latitude: editedDestination.latitude,
      longitude: editedDestination.longitude,
      extraPrice: editedDestination.extraPrice || undefined,
      extraPriceNote: editedDestination.extraPriceNote || "",
      removeImages: removedImages,
      newImages: newImages,
      removeActivities: removedActivities,
      newActivities: newActivities,
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

      const successMsg = `Destination "${editedDestination?.destinationName}" updated successfully!`;
      setSuccess(successMsg);

      // Show success toast with navigation link
      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedDestination?.destinationName} has been updated successfully.`,
        actionLink: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view?id=${selectedDestination?.destinationId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedDestination) {
          fetchDestinationDetails(selectedDestination.destinationId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update destination");
      setToast({
        type: "error",
        title: "Update Failed",
        message:
          err.message || "Failed to update destination. Please try again.",
      });
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
      setCurrentCategoryIds(originalCategoryIds);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearDestinationSelection = () => {
    setSelectedDestination(null);
    setOriginalDestination(null);
    setEditedDestination(null);
    setRemovedImages([]);
    setRemovedActivities([]);
    setNewImages([]);
    setNewActivities([]);
    setOriginalCategoryIds([]);
    setCurrentCategoryIds([]);
    setToast(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("destination-id");
    url.searchParams.delete("destination-name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = () => {
    if (!originalDestination || !editedDestination) return [];

    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }> = [];

    const fields = [
      { key: "destinationName", label: "Destination Name" },
      { key: "destinationDescription", label: "Description" },
      { key: "location", label: "Location" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
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

    const { removedCategoryIds, addedCategoryIds } = getCategoryChanges();
    if (removedCategoryIds.length > 0) {
      changes.push({
        field: "Categories to Remove",
        oldValue: originalCategoryIds.length,
        newValue: originalCategoryIds.length - removedCategoryIds.length,
      });
    }
    if (addedCategoryIds.length > 0) {
      changes.push({
        field: "Categories to Add",
        oldValue: originalCategoryIds.length,
        newValue: originalCategoryIds.length + addedCategoryIds.length,
      });
    }

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

  // Convert destinations to search items format
  const searchItems = destinations.map((dest) => ({
    id: dest.destinationId,
    name: dest.destinationName,
  }));

  const selectedSearchItem = selectedDestination
    ? {
        id: selectedDestination.destinationId,
        name: selectedDestination.destinationName,
      }
    : null;

  // Show loading state if common data is loading
  if (commonLoading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch available categories"
        size="lg"
      />
    );
  }

  // Show error state if common data failed to load
  if (commonError) {
    return (
      <CommonErrorState
        error={commonError}
        title="Failed to Load Categories"
        message="Unable to load destination categories. Please try again."
        variant="error"
        showBackButton={false}
        showRetryButton={true}
        onRetry={() => window.location.reload()}
        retryButtonText="Retry"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Destination"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Destination"
            description="Edit and update existing destination information"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no destination is selected */}
        {!selectedDestination && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Search className="w-6 h-6" style={{ color: theme.primary }} />
              Select Destination to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectDestination(item.id as number, item.name)
              }
              onClearSelection={handleClearDestinationSelection}
              initialSearchTerm={initialDestinationName}
              placeholder="Search destinations..."
              title="Destinations"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}
        {/* Selected Destination Info Bar */}
        <SelectedItemBar
          item={
            selectedDestination
              ? {
                  id: selectedDestination.destinationId,
                  name: selectedDestination.destinationName,
                }
              : null
          }
          onClear={handleClearDestinationSelection}
          variant="primary"
          title="Currently Editing"
          showId={true}
          clearButtonText="Change Destination"
          size="md"
        />
        {loadingDetails && (
          <CommonLoading
            message="Loading destination details..."
            subMessage="Please wait while we fetch the destination information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
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
            currentCategoryIds={currentCategoryIds}
            originalCategoryIds={originalCategoryIds}
            availableCategories={availableCategories}
            availableActivityCategories={availableActivityCategories}
            availableSeasons={availableSeasons}
            onFieldChange={handleFieldChange}
            onCategoryChange={handleCategoryChange}
            onRemoveImage={handleRemoveImage}
            onRemoveActivity={handleRemoveActivity}
            onAddNewImage={handleAddNewImage}
            onAddNewActivity={handleAddNewActivity}
            onUpdateActivity={handleUpdateActivity}
            onUpdateImage={handleUpdateImage}
            uploadingImages={uploadingImages}
          />
        )}
        {/* Action Buttons */}
        {editedDestination && originalDestination && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate || uploadingImages}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate || uploadingImages}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Destination"}
              </button>
            </div>

            {/* Uploading Indicator */}
            {uploadingImages && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{ color: theme.primary }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      Uploading images to Cloudinary...
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Please wait for all images to finish uploading before
                      updating
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Change Indicator */}
            {hasChanges() && !uploadingImages && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
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
            removedCategoryIds={getCategoryChanges().removedCategoryIds}
            addedCategoryIds={getCategoryChanges().addedCategoryIds}
            availableCategories={availableCategories}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateDestinationPage;
