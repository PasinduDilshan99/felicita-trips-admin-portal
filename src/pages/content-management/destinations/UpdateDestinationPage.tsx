"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DestinationService } from "@/services/destinationService";
import { OtherService } from "@/services/otherService";
import {
  DestinationForTour,
  SingleDestinationResponse,
  UpdateDestinationRequest,
  NewImageRequest,
  NewActivityRequest,
  UpdateImageRequest,
} from "@/types/destination-types";
import { Search, Edit, Save, RefreshCw, Loader2 } from "lucide-react";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, { SearchItem } from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import { UpdateConfirmationModal, ChangedField } from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { DESTINATION_PAGE_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { DestinationBasicInfoForm } from "@/components/destinations-components/update-destinations-components/DestinationBasicInfoForm";
import { DestinationCategoriesForm } from "@/components/destinations-components/update-destinations-components/DestinationCategoriesForm";
import { DestinationImagesForm } from "@/components/destinations-components/update-destinations-components/DestinationImagesForm";
import { DestinationActivitiesForm } from "@/components/destinations-components/update-destinations-components/DestinationActivitiesForm";
import { DESTINATION_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";
import { DESTINATION_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const UpdateDestinationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { categories, loading: commonLoading, error: commonError } = useCommon();

  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  const [destinations, setDestinations] = useState<DestinationForTour[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<DestinationForTour | null>(
    initialDestinationId && initialDestinationName
      ? {
          destinationId: parseInt(initialDestinationId),
          destinationName: initialDestinationName,
        }
      : null,
  );
  const [originalDestination, setOriginalDestination] = useState<SingleDestinationResponse | null>(null);
  const [editedDestination, setEditedDestination] = useState<SingleDestinationResponse | null>(null);
  const [originalCategoryIds, setOriginalCategoryIds] = useState<number[]>([]);
  const [currentCategoryIds, setCurrentCategoryIds] = useState<number[]>([]);
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [removedActivities, setRemovedActivities] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<NewImageRequest[]>([]);
  const [newActivities, setNewActivities] = useState<NewActivityRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<UpdateImageRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["basic", "categories", "images", "activities"]));

  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const availableCategories = categories?.destinationCategoryList || [];
  const availableActivityCategories = categories?.activityCategoryList || [];
  const availableSeasons = categories?.seasonsList || [];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  const updateUrlWithSelectedDestination = useCallback((destination: DestinationForTour | null) => {
    const url = new URL(window.location.href);
    if (destination) {
      url.searchParams.set("destination-id", destination.destinationId.toString());
      url.searchParams.set("destination-name", destination.destinationName);
    } else {
      url.searchParams.delete("destination-id");
      url.searchParams.delete("destination-name");
    }
    router.replace(url.toString(), { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
  }, []);

  useEffect(() => {
    if (initialDestinationId && !originalDestination && !loadingDetails) {
      handleSelectDestination(parseInt(initialDestinationId), initialDestinationName);
    }
  }, [initialDestinationId, initialDestinationName]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationNames();
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

  const handleSelectDestination = async (id: number, name: string) => {
    const newSelectedDestination = { destinationId: id, destinationName: name };
    setSelectedDestination(newSelectedDestination);
    updateUrlWithSelectedDestination(newSelectedDestination);
    await fetchDestinationDetails(id);
  };

  const fetchDestinationDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalDestination(null);
    setEditedDestination(null);
    setRemovedImages([]);
    setRemovedActivities([]);
    setNewImages([]);
    setNewActivities([]);
    setUpdatedImages([]);
    setOriginalCategoryIds([]);
    setCurrentCategoryIds([]);

    try {
      const response = await DestinationService.getDestinationById(id);
      const destinationData = response.data;
      setOriginalDestination(destinationData);
      setEditedDestination(destinationData);

      const categoryIds = destinationData.destinationCategoryDetailsDtos?.map(
        (cat) => cat.id
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

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const response = await OtherService.uploadImage(file);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const handleAddNewImage = async (imageFile: File, imageName: string, imageDescription: string) => {
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
        const tempImage = {
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

  const handleUpdateImage = (imageId: number, name: string, description: string) => {
    const existingUpdate = updatedImages.find((u) => u.id === imageId);
    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((u) =>
          u.id === imageId ? { ...u, name, description } : u
        )
      );
    } else {
      const originalImage = originalDestination?.images.find((img) => img.imageId === imageId);
      setUpdatedImages((prev) => [
        ...prev,
        {
          id: imageId,
          name,
          description,
          imageUrl: originalImage?.imageUrl || "",
          status: "ACTIVE",
        },
      ]);
    }
    setEditedDestination((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.map((img) =>
          img.imageId === imageId ? { ...img, imageName: name, imageDescription: description } : img
        ),
      };
    });
  };

  const handleAddNewActivity = (activity: NewActivityRequest) => {
    setNewActivities((prev) => [...prev, activity]);
    
    if (editedDestination) {
      const tempActivity = {
        activityId: Date.now(),
        activityName: activity.name,
        activityDescription: activity.description,
        activityCategories: [],
        durationHours: activity.durationHover,
        availableFrom: activity.availableFrom,
        availableTo: activity.availableTo,
        priceLocal: activity.priceLocal,
        priceForeigners: activity.priceForeigners,
        minParticipate: activity.minParticipate,
        maxParticipate: activity.maxParticipate,
        season: "",
      };
      setEditedDestination({
        ...editedDestination,
        activities: [...editedDestination.activities, tempActivity],
      });
    }
  };

  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedDestination) return;
    setEditedDestination({
      ...editedDestination,
      [field]: value,
    });
  };

  const handleCategoryChange = (categoryId: number) => {
    setCurrentCategoryIds(prev => {
      let newIds: number[];
      if (prev.includes(categoryId)) {
        newIds = prev.filter((id) => id !== categoryId);
      } else {
        newIds = [...prev, categoryId];
      }
      return newIds;
    });
  };

  const handleRemoveImage = (imageId: number) => {
    setRemovedImages((prev) => [...prev, imageId]);
    setEditedDestination((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.filter((img) => img.imageId !== imageId),
      };
    });
  };

  const handleRemoveActivity = (activityId: number) => {
    setRemovedActivities((prev) => [...prev, activityId]);
    setEditedDestination((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: prev.activities.filter((act) => act.activityId !== activityId),
      };
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
      originalDestination.destinationName !== editedDestination.destinationName ||
      originalDestination.destinationDescription !== editedDestination.destinationDescription ||
      originalDestination.location !== editedDestination.location ||
      originalDestination.latitude !== editedDestination.latitude ||
      originalDestination.longitude !== editedDestination.longitude ||
      originalDestination.statusName !== editedDestination.statusName ||
      originalDestination.extraPrice !== editedDestination.extraPrice ||
      originalDestination.extraPriceNote !== editedDestination.extraPriceNote;

    const { removedCategoryIds, addedCategoryIds } = getCategoryChanges();
    const categoriesChanged = removedCategoryIds.length > 0 || addedCategoryIds.length > 0;

    const itemsChanged =
      removedImages.length > 0 ||
      removedActivities.length > 0 ||
      newImages.length > 0 ||
      newActivities.length > 0 ||
      updatedImages.length > 0;

    return basicFieldsChanged || categoriesChanged || itemsChanged;
  }, [
    originalDestination,
    editedDestination,
    removedImages,
    removedActivities,
    newImages,
    newActivities,
    updatedImages,
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
      updateImages: updatedImages,
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

      setSuccess(`Destination "${editedDestination?.destinationName}" updated successfully!`);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedDestination?.destinationName} has been updated successfully.`,
        actionLink: `${DESTINATION_PAGE_URL}/view?id=${selectedDestination?.destinationId}`,
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
        message: err.message || "Failed to update destination. Please try again.",
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
      setUpdatedImages([]);
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
    setUpdatedImages([]);
    setOriginalCategoryIds([]);
    setCurrentCategoryIds([]);
    setToast(null);
    updateUrlWithSelectedDestination(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalDestination || !editedDestination) return [];

    const changes: ChangedField[] = [];

    const fields = [
      { key: "destinationName", label: "Destination Name" },
      { key: "destinationDescription", label: "Description" },
      { key: "location", label: "Location" },
      { key: "latitude", label: "Latitude" },
      { key: "longitude", label: "Longitude" },
      { key: "statusName", label: "Status" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = originalDestination[key as keyof SingleDestinationResponse];
      const newValue = editedDestination[key as keyof SingleDestinationResponse];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalDestination.extraPrice !== editedDestination.extraPrice) {
      changes.push({ field: "Extra Price", oldValue: originalDestination.extraPrice || 0, newValue: editedDestination.extraPrice || 0 });
    }
    if (originalDestination.extraPriceNote !== editedDestination.extraPriceNote) {
      changes.push({ field: "Extra Price Note", oldValue: originalDestination.extraPriceNote || "", newValue: editedDestination.extraPriceNote || "" });
    }

    const { removedCategoryIds, addedCategoryIds } = getCategoryChanges();
    if (removedCategoryIds.length > 0 || addedCategoryIds.length > 0) {
      changes.push({
        field: "Categories",
        oldValue: originalCategoryIds.length,
        newValue: currentCategoryIds.length,
      });
    }

    if (removedImages.length > 0 || newImages.length > 0 || updatedImages.length > 0) {
      changes.push({
        field: "Images",
        oldValue: originalDestination.images.length,
        newValue: editedDestination.images.length,
      });
    }

    if (removedActivities.length > 0 || newActivities.length > 0) {
      changes.push({
        field: "Activities",
        oldValue: originalDestination.activities.length,
        newValue: editedDestination.activities.length,
      });
    }

    return changes;
  };

  // Convert destinations to search items format
  const searchItems: SearchItem[] = destinations.map((dest) => ({
    id: dest.destinationId,
    name: dest.destinationName,
  }));

  const selectedSearchItem = selectedDestination
    ? {
        id: selectedDestination.destinationId,
        name: selectedDestination.destinationName,
      }
    : null;

  // Show loading state from common context
  if (commonLoading) {
    return (
      <CommonLoading
        message="Loading destination data..."
        subMessage="Please wait while we fetch available destinations and categories"
        size="lg"
      />
    );
  }

  // Show error state
  if (commonError) {
    return (
      <CommonErrorState
        error={commonError}
        title="Failed to Load Data"
        message="Unable to load destination data. Please try again."
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
            breadcrumbItems={DESTINATION_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
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
              onSelectItem={(item) => handleSelectDestination(item.id as number, item.name)}
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
        {selectedDestination && (
          <SelectedItemBar
            item={{
              id: selectedDestination.destinationId,
              name: selectedDestination.destinationName,
            }}
            onClear={handleClearDestinationSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Destination"
            size="md"
          />
        )}

        {/* Loading Details */}
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
          <div className="space-y-6">
            {/* Basic Information Section */}
            <DestinationBasicInfoForm
              destination={editedDestination}
              originalDestination={originalDestination}
              onFieldChange={handleBasicFieldChange}
              statusOptions={DESTINATION_UPDATE_STATUS_OPTIONS}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            {/* Categories Section */}
            <DestinationCategoriesForm
              currentCategoryIds={currentCategoryIds}
              originalCategoryIds={originalCategoryIds}
              availableCategories={availableCategories}
              onCategoryChange={handleCategoryChange}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            {/* Images Section */}
            <DestinationImagesForm
              images={editedDestination.images}
              removedImages={removedImages}
              newImages={newImages}
              updatedImages={updatedImages}
              uploadingImages={uploadingImages}
              onRemoveImage={handleRemoveImage}
              onAddNewImage={handleAddNewImage}
              onUpdateImage={handleUpdateImage}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />

            {/* Activities Section */}
            <DestinationActivitiesForm
              activities={editedDestination.activities}
              removedActivities={removedActivities}
              newActivities={newActivities}
              availableActivityCategories={availableActivityCategories}
              availableSeasons={availableSeasons}
              onRemoveActivity={handleRemoveActivity}
              onAddNewActivity={handleAddNewActivity}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              theme={theme}
            />
          </div>
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
                  e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
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
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      Uploading images to Cloudinary...
                    </p>
                    <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                      Please wait for all images to finish uploading before updating
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
                    <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
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
            isLoading={loadingUpdate}
            type="update"
            itemName={editedDestination.destinationName}
            changedFields={getChangedFields()}
            confirmText="Update Destination"
            cancelText="Cancel"
            title="Confirm Destination Update"
            message={`You are about to update "${editedDestination.destinationName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateDestinationPage;