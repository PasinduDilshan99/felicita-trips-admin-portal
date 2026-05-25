"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import { ActivityService } from "@/services/activityService";
import { OtherService } from "@/services/otherService";
import {
  ActivityCategoryDetails,
  UpdateActivityCategoryRequest,
  ActivityCategoryImageRequest,
  UpdateActivityCategoryImageRequest,
} from "@/types/activity-category-types";
import { ActivityIdName } from "@/types/activity-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  Loader2,
  Palette,
  Tag,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ACTIVITY_CATEGORIES_PAGE_URL } from "@/utils/urls";
import { ActivityCategoryReadOnlyDetails } from "@/components/activity-categories-components/update-activity-category-components/ActivityCategoryReadOnlyDetails";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Category is active",
    color: "#059669",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Category is inactive",
    color: "#6b7280",
  },
  {
    value: "TERMINATED",
    label: "Terminated",
    description: "Category is terminated",
    color: "#ef4444",
  },
];

const PRESET_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#06B6D4",
  "#84CC16",
];

const UpdateActivityCategoryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialCategoryName = searchParams?.get("category-name") || "";
  const initialCategoryId = searchParams?.get("category-id") || "";

  // Build categories list from common context
  const categoriesList = React.useMemo(() => {
    if (categories?.activityCategoryList) {
      return categories.activityCategoryList.map((cat) => ({
        id: cat.activityCategoryId,
        name: cat.activityCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // State for all activities (for adding/removing)
  const [allActivities, setAllActivities] = useState<ActivityIdName[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(
    initialCategoryId && initialCategoryName
      ? {
          id: parseInt(initialCategoryId),
          name: initialCategoryName,
        }
      : null,
  );

  // State for original category details
  const [originalCategory, setOriginalCategory] =
    useState<ActivityCategoryDetails | null>(null);

  // State for edited category
  const [editedCategory, setEditedCategory] =
    useState<ActivityCategoryDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for activities changes
  const [removedActivityIds, setRemovedActivityIds] = useState<number[]>([]);
  const [addedActivityIds, setAddedActivityIds] = useState<number[]>([]);

  // State for images changes
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<ActivityCategoryImageRequest[]>(
    [],
  );
  const [updatedImages, setUpdatedImages] = useState<
    UpdateActivityCategoryImageRequest[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic", "activities", "images"]),
  );

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Activity Categories", href: ACTIVITY_CATEGORIES_PAGE_URL },
    {
      label: "Update",
      href: ACTIVITY_CATEGORIES_PAGE_URL,
    },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected category changes
  const updateUrlWithSelectedCategory = useCallback(
    (category: { id: number; name: string } | null) => {
      const url = new URL(window.location.href);
      if (category) {
        url.searchParams.set("category-id", category.id.toString());
        url.searchParams.set("category-name", category.name);
      } else {
        url.searchParams.delete("category-id");
        url.searchParams.delete("category-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch activities list
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await ActivityService.getActivityIdsAndNames();
      setAllActivities(response.data);
    } catch (err: any) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, []);

  // If initialCategoryId is provided, fetch details
  useEffect(() => {
    if (initialCategoryId && !originalCategory && !loadingDetails) {
      handleSelectCategory(parseInt(initialCategoryId), initialCategoryName);
    }
  }, [initialCategoryId, initialCategoryName]);

  const handleSelectCategory = async (id: number, name: string) => {
    const newSelectedCategory = { id, name };
    setSelectedCategory(newSelectedCategory);
    updateUrlWithSelectedCategory(newSelectedCategory);
    await fetchCategoryDetails(id);
  };

  const fetchCategoryDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalCategory(null);
    setEditedCategory(null);
    setBasicDetailsChanged(false);
    setRemovedActivityIds([]);
    setAddedActivityIds([]);
    setRemovedImageIds([]);
    setNewImages([]);
    setUpdatedImages([]);

    try {
      const response =
        await ActivityCategoryService.getActivityCategoryDetails(id);
      const categoryData = response.data;
      setOriginalCategory(categoryData);
      setEditedCategory(categoryData);
    } catch (err: any) {
      setError(err.message || "Failed to load category details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load category details",
      });
    } finally {
      setLoadingDetails(false);
    }
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

      const newImage: ActivityCategoryImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedCategory) {
        const tempImage = {
          imageId: Date.now(),
          imageName: imageName,
          imageDescription: imageDescription,
          imageUrl: cloudinaryUrl,
          imageStatus: "ACTIVE",
          createdAt: new Date().toISOString(),
          createdBy: null,
          updatedAt: new Date().toISOString(),
          updatedBy: null,
          terminatedAt: null,
          terminatedBy: null,
        };
        setEditedCategory({
          ...editedCategory,
          images: [...editedCategory.images, tempImage],
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

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedCategory) return;
    setBasicDetailsChanged(true);
    setEditedCategory({
      ...editedCategory,
      [field]: value,
    });
  };

  // Handle activity changes
  const handleAddActivity = (activityId: number) => {
    setAddedActivityIds((prev) => [...prev, activityId]);
    const activity = allActivities.find((a) => a.activityId === activityId);
    if (activity && editedCategory) {
      setEditedCategory({
        ...editedCategory,
        otherActivities: [
          ...editedCategory.otherActivities,
          {
            activityId: activity.activityId,
            activityName: activity.activityName,
          },
        ],
      });
    }
  };

  const handleRemoveActivity = (activityId: number, isPrimary: boolean) => {
    setRemovedActivityIds((prev) => [...prev, activityId]);
    if (isPrimary) {
      setEditedCategory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          primaryActivities: prev.primaryActivities.filter(
            (a) => a.activityId !== activityId,
          ),
        };
      });
    } else {
      setEditedCategory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          otherActivities: prev.otherActivities.filter(
            (a) => a.activityId !== activityId,
          ),
        };
      });
    }
  };

  const handleMakePrimary = (activityId: number) => {
    const activity = editedCategory?.otherActivities.find(
      (a) => a.activityId === activityId,
    );
    if (activity && editedCategory) {
      setEditedCategory({
        ...editedCategory,
        primaryActivities: [...editedCategory.primaryActivities, activity],
        otherActivities: editedCategory.otherActivities.filter(
          (a) => a.activityId !== activityId,
        ),
      });
    }
  };

  const handleRemovePrimary = (activityId: number) => {
    const activity = editedCategory?.primaryActivities.find(
      (a) => a.activityId === activityId,
    );
    if (activity && editedCategory) {
      setEditedCategory({
        ...editedCategory,
        primaryActivities: editedCategory.primaryActivities.filter(
          (a) => a.activityId !== activityId,
        ),
        otherActivities: [...editedCategory.otherActivities, activity],
      });
    }
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setEditedCategory((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.filter((img) => img.imageId !== imageId),
      };
    });
  };

  const handleUpdateImage = (
    imageId: number,
    name: string,
    description: string,
  ) => {
    const existingUpdate = updatedImages.find((u) => u.imageId === imageId);
    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((u) =>
          u.imageId === imageId ? { ...u, name, description } : u,
        ),
      );
    } else {
      const originalImage = originalCategory?.images.find(
        (img) => img.imageId === imageId,
      );
      setUpdatedImages((prev) => [
        ...prev,
        {
          imageId,
          name,
          description,
          imageUrl: originalImage?.imageUrl || "",
          status: "ACTIVE",
        },
      ]);
    }
    setEditedCategory((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.map((img) =>
          img.imageId === imageId
            ? { ...img, imageName: name, imageDescription: description }
            : img,
        ),
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      removedActivityIds.length > 0 ||
      addedActivityIds.length > 0 ||
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    );
  }, [
    basicDetailsChanged,
    removedActivityIds,
    addedActivityIds,
    removedImageIds,
    newImages,
    updatedImages,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateActivityCategoryRequest | null => {
    if (!editedCategory || !selectedCategory) return null;

    return {
      categoryId: selectedCategory.id,
      categoryName: editedCategory.categoryName,
      description: editedCategory.description,
      color: editedCategory.color,
      hoverColor: editedCategory.hoverColor,
      status: editedCategory.status as "ACTIVE" | "INACTIVE",
      removeActivityIds: removedActivityIds,
      addActivityIds: addedActivityIds,
      addImages: newImages,
      removeImageIds: removedImageIds,
      updateImages: updatedImages,
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
      const response =
        await ActivityCategoryService.updateActivityCategory(updateData);

      setSuccess(
        `Category "${editedCategory?.categoryName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedCategory?.categoryName} has been updated successfully.`,
        actionLink: `${ACTIVITY_CATEGORIES_PAGE_URL}/view?id=${selectedCategory?.id}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedCategory) {
          fetchCategoryDetails(selectedCategory.id);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update category");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update category. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalCategory) {
      setEditedCategory(originalCategory);
      setBasicDetailsChanged(false);
      setRemovedActivityIds([]);
      setAddedActivityIds([]);
      setRemovedImageIds([]);
      setNewImages([]);
      setUpdatedImages([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearCategorySelection = () => {
    setSelectedCategory(null);
    setOriginalCategory(null);
    setEditedCategory(null);
    setToast(null);
    updateUrlWithSelectedCategory(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalCategory || !editedCategory) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "categoryName", label: "Category Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalCategory[key as keyof ActivityCategoryDetails];
      const newValue = editedCategory[key as keyof ActivityCategoryDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalCategory.color !== editedCategory.color) {
      changes.push({
        field: "Color",
        oldValue: originalCategory.color,
        newValue: editedCategory.color,
      });
    }
    if (originalCategory.hoverColor !== editedCategory.hoverColor) {
      changes.push({
        field: "Hover Color",
        oldValue: originalCategory.hoverColor,
        newValue: editedCategory.hoverColor,
      });
    }

    if (removedActivityIds.length > 0 || addedActivityIds.length > 0) {
      changes.push({
        field: "Activities",
        oldValue:
          originalCategory.primaryActivities.length +
          originalCategory.otherActivities.length,
        newValue:
          editedCategory.primaryActivities.length +
          editedCategory.otherActivities.length,
      });
    }

    if (
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    ) {
      changes.push({
        field: "Images",
        oldValue: originalCategory.images.length,
        newValue: editedCategory.images.length,
      });
    }

    return changes;
  };

  // Build search items from categories (from common context)
  const searchItems: SearchItem[] = categoriesList.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  const selectedSearchItem = selectedCategory
    ? {
        id: selectedCategory.id,
        name: selectedCategory.name,
      }
    : null;

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Show loading state from common context
  if (commonLoading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch available categories"
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
        message="Unable to load categories. Please try again."
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
    <motion.div
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
          actionText="View Category"
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
            title="Update Activity Category"
            description="Edit and update existing activity category information"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedCategory && (
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
              Select Activity Category to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectCategory(item.id as number, item.name)
              }
              onClearSelection={handleClearCategorySelection}
              initialSearchTerm={initialCategoryName}
              placeholder="Search activity categories..."
              title="Activity Categories"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Category Info Bar */}
        {selectedCategory && (
          <SelectedItemBar
            item={{
              id: selectedCategory.id,
              name: selectedCategory.name,
            }}
            onClear={handleClearCategorySelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Category"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading category details..."
            subMessage="Please wait while we fetch the category information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Category Details Form */}
        {editedCategory && selectedCategory && (
          <div className="space-y-6">
            {/* Basic Information Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <button
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("basic")
                    ? `${theme.primary}05`
                    : "transparent",
                  borderBottom: expandedSections.has("basic")
                    ? `1px solid ${theme.border}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Basic Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Core details about the category (editable)
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("basic")
                      ? "rotate(180deg)"
                      : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("basic") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6 space-y-5"
                  >
                    {/* Category Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Category Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedCategory.categoryName}
                        onChange={(e) =>
                          handleBasicFieldChange("categoryName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged
                            ? theme.primary
                            : theme.border,
                        }}
                        placeholder="e.g., Adventure Activities"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editedCategory.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Category description..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Palette className="w-3.5 h-3.5" />
                          Color
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange("color", color)
                              }
                              className="w-8 h-8 rounded-full border-2 transition-all"
                              style={{
                                backgroundColor: color,
                                borderColor:
                                  editedCategory.color === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedCategory.color === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedCategory.color}
                            onChange={(e) =>
                              handleBasicFieldChange("color", e.target.value)
                            }
                            className="w-12 h-10 rounded border cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                          <input
                            type="text"
                            value={editedCategory.color}
                            onChange={(e) =>
                              handleBasicFieldChange("color", e.target.value)
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            placeholder="#000000"
                            {...focusHandlers}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Palette className="w-3.5 h-3.5" />
                          Hover Color
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange("hoverColor", color)
                              }
                              className="w-8 h-8 rounded-full border-2 transition-all"
                              style={{
                                backgroundColor: color,
                                borderColor:
                                  editedCategory.hoverColor === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedCategory.hoverColor === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedCategory.hoverColor}
                            onChange={(e) =>
                              handleBasicFieldChange(
                                "hoverColor",
                                e.target.value,
                              )
                            }
                            className="w-12 h-10 rounded border cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                          <input
                            type="text"
                            value={editedCategory.hoverColor}
                            onChange={(e) =>
                              handleBasicFieldChange(
                                "hoverColor",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            placeholder="#000000"
                            {...focusHandlers}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {STATUS_OPTIONS.map((opt) => {
                          const isSelected =
                            editedCategory.status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange("status", opt.value)
                              }
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? `${opt.color}10`
                                  : theme.background,
                                borderColor: isSelected
                                  ? opt.color
                                  : theme.border,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: opt.color }}
                              />
                              <div className="flex-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected ? opt.color : theme.text,
                                  }}
                                >
                                  {opt.label}
                                </span>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {opt.description}
                                </p>
                              </div>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4"
                                  style={{ color: opt.color }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Read-only Activity Category Details Components */}
            <ActivityCategoryReadOnlyDetails
              category={editedCategory}
              allActivities={allActivities}
              loadingActivities={loadingActivities}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onMakePrimary={handleMakePrimary}
              onRemovePrimary={handleRemovePrimary}
              onRemoveImage={handleRemoveImage}
              onAddNewImage={handleAddNewImage}
              onUpdateImage={handleUpdateImage}
              uploadingImages={uploadingImages}
              theme={theme}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedCategory && originalCategory && (
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
                {loadingUpdate ? "Updating..." : "Update Category"}
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
                      Click "Update Category" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalCategory && editedCategory && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedCategory.categoryName}
            changedFields={getChangedFields()}
            confirmText="Update Category"
            cancelText="Cancel"
            title="Confirm Category Update"
            message={`You are about to update "${editedCategory.categoryName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateActivityCategoryPage;
