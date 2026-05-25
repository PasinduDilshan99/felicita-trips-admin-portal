// app/activities/update/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  UpdateActivityRequest,
  AddCategoryRequest,
  UpdateCategoryRequest,
  ActivityImageRequest,
  UpdateImageRequest,
  ActivityRequirementRequest,
  UpdateRequirementRequest,
  ActivityCategoryFullDetail,
} from "@/types/activity-types";
import { OtherService } from "@/services/otherService";
import {
  Activity,
  ActivityIdName,
  ActivityCategoryDetail,
  ActivityImage,
  Requirement,
  Schedule,
} from "@/types/activity-types";
import { ActivityCategory, SeasonType } from "@/types/common-types";
import { Search, Edit, Save, RefreshCw, Loader2 } from "lucide-react";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import { hexToRgba } from "@/utils/functions";
import { ACTIVITY_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";
import { ActivityService } from "@/services/activityService";
import ActivityDetailsForm from "@/components/activities-components/activity-update-components/ActivityDetailsForm";
import { UpdateConfirmationModal } from "@/components/common-components/UpdateConfirmationModal";

const ActivityUpdatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialActivityName = searchParams?.get("activity-name") || "";
  const initialActivityId = searchParams?.get("activity-id") || "";

  // State for activities list
  const [activities, setActivities] = useState<ActivityIdName[]>([]);

  // State for selected activity
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityIdName | null>(
      initialActivityId && initialActivityName
        ? {
            activityId: parseInt(initialActivityId),
            activityName: initialActivityName,
          }
        : null,
    );

  // State for original activity details
  const [originalActivity, setOriginalActivity] = useState<Activity | null>(
    null,
  );

  // State for edited activity
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);

  // State for removed items
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [removedCategories, setRemovedCategories] = useState<number[]>([]);
  const [removedRequirements, setRemovedRequirements] = useState<number[]>([]);

  // State for new/updated items
  const [newImages, setNewImages] = useState<ActivityImageRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<UpdateImageRequest[]>([]);
  const [newCategories, setNewCategories] = useState<AddCategoryRequest[]>([]);
  const [updatedCategories, setUpdatedCategories] = useState<
    UpdateCategoryRequest[]
  >([]);
  const [newRequirements, setNewRequirements] = useState<
    ActivityRequirementRequest[]
  >([]);
  const [updatedRequirements, setUpdatedRequirements] = useState<
    UpdateRequirementRequest[]
  >([]);

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

  // Available data
  const [availableCategories, setAvailableCategories] = useState<
    ActivityCategory[]
  >([]);
  const [availableSeasons, setAvailableSeasons] = useState<SeasonType[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Activities", href: ACTIVITY_DETAILS_VIEW_PAGE_URL },
    {
      label: "Update",
      href: ACTIVITY_DETAILS_VIEW_PAGE_URL,
    },
  ];

  // Extract data from context
  useEffect(() => {
    if (categories?.activityCategoryList) {
      setAvailableCategories(categories?.activityCategoryList);
    }
  }, [categories?.activityCategoryList]);

  // Fetch activities list on initial load
  useEffect(() => {
    if (!selectedActivity) {
      fetchActivities();
    }
  }, []);

  // If initialActivityId is provided, fetch details
  useEffect(() => {
    if (initialActivityId && !originalActivity) {
      handleSelectActivity(parseInt(initialActivityId), initialActivityName);
    }
  }, [initialActivityId, initialActivityName]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ActivityService.getActivityIdsAndNames();
      setActivities(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load activities");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load activities",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectActivity = async (id: number, name: string) => {
    setSelectedActivity({ activityId: id, activityName: name });
    await fetchActivityDetails(id);
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

  const handleAddNewImage = async (
    imageFile: File,
    imageName: string,
    imageDescription: string,
  ) => {
    setUploadingImages(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile);

      const newImage: ActivityImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedActivity) {
        const tempImage: ActivityImage = {
          id: Date.now(),
          name: imageName,
          description: imageDescription,
          image_url: cloudinaryUrl,
          status: 1,
        };
        setEditedActivity({
          ...editedActivity,
          images: [...editedActivity.images, tempImage],
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

  const fetchActivityDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalActivity(null);
    setEditedActivity(null);
    setRemovedImages([]);
    setRemovedCategories([]);
    setRemovedRequirements([]);
    setNewImages([]);
    setUpdatedImages([]);
    setNewCategories([]);
    setUpdatedCategories([]);
    setNewRequirements([]);
    setUpdatedRequirements([]);

    try {
      const response = await ActivityService.getActivityById(id);
      const activityData = response.data;
      setOriginalActivity(activityData);
      setEditedActivity(activityData);
    } catch (err: any) {
      setError(err.message || "Failed to load activity details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load activity details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    if (!editedActivity) return;

    setEditedActivity({
      ...editedActivity,
      [field]: value,
    });
  };

  // Handle category changes
  const handleCategoryPrimaryChange = (
    categoryId: number,
    isPrimary: boolean,
  ) => {
    if (!editedActivity) return;

    const updatedCategories = editedActivity.activities_category.map((cat) =>
      cat.id === categoryId ? { ...cat, is_primary: isPrimary } : cat,
    );

    // Track category update if it exists in original
    const originalCat = originalActivity?.activities_category.find(
      (c) => c.id === categoryId,
    );
    if (originalCat && originalCat.is_primary !== isPrimary) {
      const existingUpdate = updatedCategories.find((u) => u.id === categoryId);
      if (!existingUpdate) {
        setUpdatedCategories((prev) => [
          ...prev,
          {
            categoryId: categoryId,
            isPrimary: isPrimary,
            status: "ACTIVE",
          },
        ]);
      } else {
        setUpdatedCategories((prev) =>
          prev.map((u) =>
            u.categoryId === categoryId ? { ...u, isPrimary } : u,
          ),
        );
      }
    }

    setEditedActivity({
      ...editedActivity,
      activities_category: updatedCategories,
    });
  };

  // Handle category removal
  const handleRemoveCategory = (categoryId: number) => {
    if (!editedActivity) return;

    setRemovedCategories((prev) => [...prev, categoryId]);

    setEditedActivity({
      ...editedActivity,
      activities_category: editedActivity.activities_category.filter(
        (cat) => cat.id !== categoryId,
      ),
    });
  };

  // Handle new category addition
  const handleAddNewCategory = (categoryId: number, isPrimary: boolean) => {
    const category = availableCategories.find(
      (c) => c.activityCategoryId === categoryId,
    );
    if (!category) return;

    const newCategory: AddCategoryRequest = {
      categoryId: categoryId,
      isPrimary: isPrimary,
      status: "ACTIVE",
    };

    setNewCategories((prev) => [...prev, newCategory]);

    if (editedActivity) {
      const tempCategory: ActivityCategoryFullDetail = {
        id: Date.now(),
        name: category.activityCategoryName,
        description: category.activityCategoryDescription || "",
        is_primary: isPrimary,
      };
      setEditedActivity({
        ...editedActivity,
        activities_category: [
          ...editedActivity.activities_category,
          tempCategory,
        ],
      });
    }
  };

  // Handle image removal
  const handleRemoveImage = (imageId: number) => {
    if (!editedActivity) return;

    setRemovedImages((prev) => [...prev, imageId]);

    setEditedActivity({
      ...editedActivity,
      images: editedActivity.images.filter((img) => img.id !== imageId),
    });
  };

  // Handle requirement removal
  const handleRemoveRequirement = (requirementId: number) => {
    if (!editedActivity) return;

    setRemovedRequirements((prev) => [...prev, requirementId]);

    setEditedActivity({
      ...editedActivity,
      requirements: editedActivity.requirements.filter(
        (req) => req.id !== requirementId,
      ),
    });
  };

  // Handle new requirement addition
  const handleAddNewRequirement = (requirement: ActivityRequirementRequest) => {
    setNewRequirements((prev) => [...prev, requirement]);

    if (editedActivity) {
      const tempRequirement: Requirement = {
        id: Date.now(),
        name: requirement.name,
        value: requirement.value,
        description: requirement.description,
        color: requirement.color,
        status: 1,
      };
      setEditedActivity({
        ...editedActivity,
        requirements: [...editedActivity.requirements, tempRequirement],
      });
    }
  };

  // Handle update existing requirement
  const handleUpdateRequirement = (
    updatedRequirement: UpdateRequirementRequest,
  ) => {
    if (!editedActivity) return;

    const existingUpdate = updatedRequirements.find(
      (r) => r.requirementId === updatedRequirement.requirementId,
    );

    if (existingUpdate) {
      setUpdatedRequirements((prev) =>
        prev.map((r) =>
          r.requirementId === updatedRequirement.requirementId
            ? updatedRequirement
            : r,
        ),
      );
    } else {
      setUpdatedRequirements((prev) => [...prev, updatedRequirement]);
    }

    setEditedActivity({
      ...editedActivity,
      requirements: editedActivity.requirements.map((req) =>
        req.id === updatedRequirement.requirementId
          ? {
              ...req,
              name: updatedRequirement.name,
              value: updatedRequirement.value,
              description: updatedRequirement.description,
              color: updatedRequirement.color,
            }
          : req,
      ),
    });
  };

  // Handle update existing image
  const handleUpdateImage = (updatedImage: UpdateImageRequest) => {
    if (!editedActivity) return;

    const existingUpdate = updatedImages.find(
      (img) => img.imageId === updatedImage.imageId,
    );

    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((img) =>
          img.imageId === updatedImage.imageId ? updatedImage : img,
        ),
      );
    } else {
      setUpdatedImages((prev) => [...prev, updatedImage]);
    }

    setEditedActivity({
      ...editedActivity,
      images: editedActivity.images.map((img) =>
        img.id === updatedImage.imageId
          ? {
              ...img,
              name: updatedImage.name,
              description: updatedImage.description,
            }
          : img,
      ),
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalActivity || !editedActivity) return false;

    const basicFieldsChanged =
      originalActivity.name !== editedActivity.name ||
      originalActivity.description !== editedActivity.description ||
      originalActivity.duration_hours !== editedActivity.duration_hours ||
      originalActivity.available_from !== editedActivity.available_from ||
      originalActivity.available_to !== editedActivity.available_to ||
      originalActivity.price_local !== editedActivity.price_local ||
      originalActivity.price_foreigners !== editedActivity.price_foreigners ||
      originalActivity.min_participate !== editedActivity.min_participate ||
      originalActivity.max_participate !== editedActivity.max_participate ||
      originalActivity.seasonId !== editedActivity.seasonId ||
      originalActivity.status !== editedActivity.status;

    const itemsChanged =
      removedImages.length > 0 ||
      removedCategories.length > 0 ||
      removedRequirements.length > 0 ||
      newImages.length > 0 ||
      newCategories.length > 0 ||
      newRequirements.length > 0 ||
      updatedImages.length > 0 ||
      updatedCategories.length > 0 ||
      updatedRequirements.length > 0;

    return basicFieldsChanged || itemsChanged;
  }, [
    originalActivity,
    editedActivity,
    removedImages,
    removedCategories,
    removedRequirements,
    newImages,
    newCategories,
    newRequirements,
    updatedImages,
    updatedCategories,
    updatedRequirements,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateActivityRequest | null => {
    if (!editedActivity || !selectedActivity) return null;

    return {
      activityId: selectedActivity.activityId,
      destinationId: editedActivity.destination_id,
      name: editedActivity.name,
      description: editedActivity.description,
      durationHours: editedActivity.duration_hours,
      availableFrom: editedActivity.available_from,
      availableTo: editedActivity.available_to,
      priceLocal: editedActivity.price_local,
      priceForeigners: editedActivity.price_foreigners,
      minParticipate: editedActivity.min_participate,
      maxParticipate: editedActivity.max_participate,
      seasonId: editedActivity.seasonId,
      status: editedActivity.status as "ACTIVE" | "INACTIVE",
      removeCategoryIds: removedCategories,
      addCategories: newCategories,
      updatedCategories: updatedCategories,
      removeImagesIds: removedImages,
      addImages: newImages,
      updatedImages: updatedImages,
      removeRequirementsIds: removedRequirements,
      addRequirements: newRequirements,
      updatedRequirements: updatedRequirements,
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
      const response = await ActivityService.updateActivity(updateData);

      setSuccess(`Activity "${editedActivity?.name}" updated successfully!`);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedActivity?.name} has been updated successfully.`,
        actionLink: `${ACTIVITY_DETAILS_VIEW_PAGE_URL}/view?id=${selectedActivity?.activityId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedActivity) {
          fetchActivityDetails(selectedActivity.activityId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update activity");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update activity. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalActivity) {
      setEditedActivity(originalActivity);
      setRemovedImages([]);
      setRemovedCategories([]);
      setRemovedRequirements([]);
      setNewImages([]);
      setUpdatedImages([]);
      setNewCategories([]);
      setUpdatedCategories([]);
      setNewRequirements([]);
      setUpdatedRequirements([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearActivitySelection = () => {
    setSelectedActivity(null);
    setOriginalActivity(null);
    setEditedActivity(null);
    setRemovedImages([]);
    setRemovedCategories([]);
    setRemovedRequirements([]);
    setNewImages([]);
    setUpdatedImages([]);
    setNewCategories([]);
    setUpdatedCategories([]);
    setNewRequirements([]);
    setUpdatedRequirements([]);
    setToast(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("activity-id");
    url.searchParams.delete("activity-name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = () => {
    if (!originalActivity || !editedActivity) return [];

    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }> = [];

    const fields = [
      { key: "name", label: "Activity Name" },
      { key: "description", label: "Description" },
      { key: "duration_hours", label: "Duration (hours)" },
      { key: "available_from", label: "Available From" },
      { key: "available_to", label: "Available To" },
      { key: "price_local", label: "Local Price" },
      { key: "price_foreigners", label: "Foreigners Price" },
      { key: "min_participate", label: "Min Participants" },
      { key: "max_participate", label: "Max Participants" },
      { key: "status", label: "Status" },
    ];

    fields.forEach(({ key, label }) => {
      const oldValue = originalActivity[key as keyof Activity];
      const newValue = editedActivity[key as keyof Activity];

      if (oldValue !== newValue) {
        changes.push({
          field: label,
          oldValue,
          newValue,
        });
      }
    });

    if (removedCategories.length > 0) {
      changes.push({
        field: "Categories to Remove",
        oldValue: originalActivity.activities_category.length,
        newValue:
          originalActivity.activities_category.length -
          removedCategories.length,
      });
    }

    if (newCategories.length > 0) {
      changes.push({
        field: "New Categories",
        oldValue: originalActivity.activities_category.length,
        newValue:
          originalActivity.activities_category.length + newCategories.length,
      });
    }

    if (removedImages.length > 0) {
      changes.push({
        field: "Images to Remove",
        oldValue: originalActivity.images.length,
        newValue: originalActivity.images.length - removedImages.length,
      });
    }

    if (newImages.length > 0) {
      changes.push({
        field: "New Images",
        oldValue: originalActivity.images.length,
        newValue: originalActivity.images.length + newImages.length,
      });
    }

    if (removedRequirements.length > 0) {
      changes.push({
        field: "Requirements to Remove",
        oldValue: originalActivity.requirements.length,
        newValue:
          originalActivity.requirements.length - removedRequirements.length,
      });
    }

    if (newRequirements.length > 0) {
      changes.push({
        field: "New Requirements",
        oldValue: originalActivity.requirements.length,
        newValue: originalActivity.requirements.length + newRequirements.length,
      });
    }

    return changes;
  };

  // Convert activities to search items format
  const searchItems: SearchItem[] = activities.map((act) => ({
    id: act.activityId,
    name: act.activityName,
  }));

  const selectedSearchItem = selectedActivity
    ? {
        id: selectedActivity.activityId,
        name: selectedActivity.activityName,
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
        message="Unable to load activity categories. Please try again."
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
          actionText="View Activity"
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
            title="Update Activity"
            description="Edit and update existing activity information"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no activity is selected */}
        {!selectedActivity && (
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
              Select Activity to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectActivity(item.id as number, item.name)
              }
              onClearSelection={handleClearActivitySelection}
              initialSearchTerm={initialActivityName}
              placeholder="Search activities..."
              title="Activities"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Activity Info Bar */}
        {selectedActivity && (
          <SelectedItemBar
            item={{
              id: selectedActivity.activityId,
              name: selectedActivity.activityName,
            }}
            onClear={handleClearActivitySelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Activity"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading activity details..."
            subMessage="Please wait while we fetch the activity information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Activity Details Form */}
        {editedActivity && selectedActivity && (
          <ActivityDetailsForm
            activity={editedActivity}
            originalActivity={originalActivity}
            removedImages={removedImages}
            removedCategories={removedCategories}
            removedRequirements={removedRequirements}
            newImages={newImages}
            newCategories={newCategories}
            newRequirements={newRequirements}
            availableCategories={availableCategories}
            availableSeasons={availableSeasons}
            onFieldChange={handleFieldChange}
            onCategoryPrimaryChange={handleCategoryPrimaryChange}
            onRemoveCategory={handleRemoveCategory}
            onAddNewCategory={handleAddNewCategory}
            onRemoveImage={handleRemoveImage}
            onAddNewImage={handleAddNewImage}
            onUpdateImage={handleUpdateImage}
            onRemoveRequirement={handleRemoveRequirement}
            onAddNewRequirement={handleAddNewRequirement}
            onUpdateRequirement={handleUpdateRequirement}
            uploadingImages={uploadingImages}
          />
        )}

        {/* Action Buttons */}
        {editedActivity && originalActivity && (
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
                {loadingUpdate ? "Updating..." : "Update Activity"}
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
                      Click "Update Activity" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalActivity && editedActivity && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedActivity.name}
            changedFields={getChangedFields()}
            confirmText="Update Activity"
            cancelText="Cancel"
            title="Confirm Activity Update"
            message={`You are about to update "${editedActivity.name}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityUpdatePage;
