"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TourTypeService } from "@/services/tourTypeService";
import { TourService } from "@/services/tourService";
import { OtherService } from "@/services/otherService";
import {
  TourTypeDetails,
  UpdateTourTypeRequest,
  TourTypeImageRequest,
  UpdateTourTypeImageRequest,
  TourReference,
} from "@/types/tour-type-types";
import { TourNameId } from "@/types/tour-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  Loader2,
  Palette,
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
import { motion, AnimatePresence } from "framer-motion";
import { TOUR_TYPES_PAGE_URL } from "@/utils/urls";
import { TourTypeReadOnlyDetails } from "@/components/tour-types-components/update-tour-types-components/TourTypeReadOnlyDetails";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_TYPE_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { cardVariants, sectionVariants } from "@/app/animations/variants";
import { TOUR_TYPE_UPDATE_PRESET_COLORS } from "@/data/colors-data";
import { TOUR_TYPE_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

const UpdateTourTypePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialTypeName = searchParams?.get("tour-type-name") || "";
  const initialTypeId = searchParams?.get("tour-type-id") || "";

  // Build tour types list from common context
  const tourTypesList = React.useMemo(() => {
    if (categories?.tourTypeList) {
      return categories.tourTypeList.map((type) => ({
        id: type.tourTypeId,
        name: type.tourTypeName,
      }));
    }
    return [];
  }, [categories]);

  // State for all tours (for adding/removing)
  const [allTours, setAllTours] = useState<TourNameId[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);

  // State for selected tour type
  const [selectedTourType, setSelectedTourType] = useState<{
    id: number;
    name: string;
  } | null>(
    initialTypeId && initialTypeName
      ? {
          id: parseInt(initialTypeId),
          name: initialTypeName,
        }
      : null,
  );

  // State for original tour type details
  const [originalTourType, setOriginalTourType] =
    useState<TourTypeDetails | null>(null);

  // State for edited tour type
  const [editedTourType, setEditedTourType] = useState<TourTypeDetails | null>(
    null,
  );

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for tours changes
  const [removedTourIds, setRemovedTourIds] = useState<number[]>([]);
  const [addedTourIds, setAddedTourIds] = useState<number[]>([]);

  // State for primary tour changes
  const [primaryTourChanged, setPrimaryTourChanged] = useState(false);

  // State for images changes
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<TourTypeImageRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<
    UpdateTourTypeImageRequest[]
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
    new Set(["basic", "tours", "images"]),
  );

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected tour type changes
  const updateUrlWithSelectedTourType = useCallback(
    (tourType: { id: number; name: string } | null) => {
      const url = new URL(window.location.href);
      if (tourType) {
        url.searchParams.set("tour-type-id", tourType.id.toString());
        url.searchParams.set("tour-type-name", tourType.name);
      } else {
        url.searchParams.delete("tour-type-id");
        url.searchParams.delete("tour-type-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch tours list
  const fetchTours = async () => {
    setLoadingTours(true);
    try {
      const response = await TourService.getAllTourNames();
      setAllTours(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoadingTours(false);
    }
  };

  // Fetch tours on mount
  useEffect(() => {
    fetchTours();
  }, []);

  // If initialTypeId is provided, fetch details
  useEffect(() => {
    if (initialTypeId && !originalTourType && !loadingDetails) {
      handleSelectTourType(parseInt(initialTypeId), initialTypeName);
    }
  }, [initialTypeId, initialTypeName]);

  const handleSelectTourType = async (id: number, name: string) => {
    const newSelectedTourType = { id, name };
    setSelectedTourType(newSelectedTourType);
    updateUrlWithSelectedTourType(newSelectedTourType);
    await fetchTourTypeDetails(id);
  };

  const fetchTourTypeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalTourType(null);
    setEditedTourType(null);
    setBasicDetailsChanged(false);
    setRemovedTourIds([]);
    setAddedTourIds([]);
    setRemovedImageIds([]);
    setNewImages([]);
    setUpdatedImages([]);
    setPrimaryTourChanged(false);

    try {
      const response = await TourTypeService.getTourTypeDetails(id);
      const tourTypeData = response.data;
      setOriginalTourType(tourTypeData);
      setEditedTourType(tourTypeData);
    } catch (err: any) {
      setError(err.message || "Failed to load tour type details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load tour type details",
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

      const newImage: TourTypeImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedTourType) {
        const tempImage = {
          imageId: Date.now(),
          name: imageName,
          description: imageDescription,
          imageUrl: cloudinaryUrl,
          status: "ACTIVE",
        };
        setEditedTourType({
          ...editedTourType,
          images: [...editedTourType.images, tempImage],
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
    if (!editedTourType) return;
    setBasicDetailsChanged(true);
    setEditedTourType({
      ...editedTourType,
      [field]: value,
    });
  };

  // Handle tour changes
  const handleAddTour = (tourId: number) => {
    setAddedTourIds((prev) => [...prev, tourId]);
    const tour = allTours.find((t) => t.tourId === tourId);
    if (tour && editedTourType) {
      // Create a temporary tour reference for UI display
      const tempTour: TourReference = {
        tourId: tour.tourId,
        tourName: tour.tourName,
        description: "",
        duration: 0,
        latitude: 0,
        longitude: 0,
        startLocation: "",
        endLocation: "",
        season: "",
        status: "ACTIVE",
        primaryType: false,
      };
      setEditedTourType({
        ...editedTourType,
        tours: [...editedTourType.tours, tempTour],
      });
    }
  };

  const handleRemoveTour = (tourId: number) => {
    setRemovedTourIds((prev) => [...prev, tourId]);
    setEditedTourType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tours: prev.tours.filter((t) => t.tourId !== tourId),
      };
    });
  };

  const handleSetPrimaryTour = (tourId: number) => {
    setPrimaryTourChanged(true);
    setEditedTourType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tours: prev.tours.map((t) => ({
          ...t,
          primaryType: t.tourId === tourId,
        })),
      };
    });
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setEditedTourType((prev) => {
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
      const originalImage = originalTourType?.images.find(
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
    setEditedTourType((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.map((img) =>
          img.imageId === imageId ? { ...img, name, description } : img,
        ),
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      removedTourIds.length > 0 ||
      addedTourIds.length > 0 ||
      primaryTourChanged ||
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    );
  }, [
    basicDetailsChanged,
    removedTourIds,
    addedTourIds,
    primaryTourChanged,
    removedImageIds,
    newImages,
    updatedImages,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateTourTypeRequest | null => {
    if (!editedTourType || !selectedTourType) return null;

    return {
      typeId: selectedTourType.id,
      typeName: editedTourType.typeName,
      description: editedTourType.description,
      color: editedTourType.color || "",
      hoverColor: editedTourType.hoverColor || "",
      status: editedTourType.status as "ACTIVE" | "INACTIVE",
      addTourIds: addedTourIds,
      removeTourIds: removedTourIds,
      addImages: newImages,
      updateImages: updatedImages,
      removeImageIds: removedImageIds,
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
      const response = await TourTypeService.updateTourType(updateData);

      setSuccess(
        `Tour Type "${editedTourType?.typeName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedTourType?.typeName} has been updated successfully.`,
        actionLink: `${TOUR_TYPES_PAGE_URL}/view?id=${selectedTourType?.id}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedTourType) {
          fetchTourTypeDetails(selectedTourType.id);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update tour type");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update tour type. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalTourType) {
      setEditedTourType(originalTourType);
      setBasicDetailsChanged(false);
      setRemovedTourIds([]);
      setAddedTourIds([]);
      setRemovedImageIds([]);
      setNewImages([]);
      setUpdatedImages([]);
      setPrimaryTourChanged(false);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearTourTypeSelection = () => {
    setSelectedTourType(null);
    setOriginalTourType(null);
    setEditedTourType(null);
    setToast(null);
    updateUrlWithSelectedTourType(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalTourType || !editedTourType) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "typeName", label: "Tour Type Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalTourType[key as keyof TourTypeDetails];
      const newValue = editedTourType[key as keyof TourTypeDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalTourType.color !== editedTourType.color) {
      changes.push({
        field: "Color",
        oldValue: originalTourType.color,
        newValue: editedTourType.color,
      });
    }
    if (originalTourType.hoverColor !== editedTourType.hoverColor) {
      changes.push({
        field: "Hover Color",
        oldValue: originalTourType.hoverColor,
        newValue: editedTourType.hoverColor,
      });
    }

    if (removedTourIds.length > 0 || addedTourIds.length > 0) {
      changes.push({
        field: "Associated Tours",
        oldValue: originalTourType.tours.length,
        newValue: editedTourType.tours.length,
      });
    }

    if (primaryTourChanged) {
      const originalPrimary =
        originalTourType.tours.find((t) => t.primaryType)?.tourName || "None";
      const newPrimary =
        editedTourType.tours.find((t) => t.primaryType)?.tourName || "None";
      changes.push({
        field: "Primary Tour",
        oldValue: originalPrimary,
        newValue: newPrimary,
      });
    }

    if (
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    ) {
      changes.push({
        field: "Images",
        oldValue: originalTourType.images.length,
        newValue: editedTourType.images.length,
      });
    }

    return changes;
  };

  // Build search items from tour types (from common context)
  const searchItems: SearchItem[] = tourTypesList.map((type) => ({
    id: type.id,
    name: type.name,
  }));

  const selectedSearchItem = selectedTourType
    ? {
        id: selectedTourType.id,
        name: selectedTourType.name,
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
        message="Loading tour types..."
        subMessage="Please wait while we fetch available tour types"
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
        message="Unable to load tour types. Please try again."
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
          actionText="View Tour Type"
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
            title="Update Tour Type"
            description="Edit and update existing tour type information"
            breadcrumbItems={TOUR_TYPE_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedTourType && (
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
              Select Tour Type to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectTourType(item.id as number, item.name)
              }
              onClearSelection={handleClearTourTypeSelection}
              initialSearchTerm={initialTypeName}
              placeholder="Search tour types..."
              title="Tour Types"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Tour Type Info Bar */}
        {selectedTourType && (
          <SelectedItemBar
            item={{
              id: selectedTourType.id,
              name: selectedTourType.name,
            }}
            onClear={handleClearTourTypeSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Tour Type"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading tour type details..."
            subMessage="Please wait while we fetch the tour type information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Tour Type Details Form */}
        {editedTourType && selectedTourType && (
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
                      Core details about the tour type (editable)
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
                    {/* Tour Type Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Tour Type Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedTourType.typeName}
                        onChange={(e) =>
                          handleBasicFieldChange("typeName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged
                            ? theme.primary
                            : theme.border,
                        }}
                        placeholder="e.g., Adventure Tour"
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
                        value={editedTourType.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Tour type description..."
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
                          {TOUR_TYPE_UPDATE_PRESET_COLORS.map((color) => (
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
                                  editedTourType.color === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedTourType.color === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedTourType.color || "#000000"}
                            onChange={(e) =>
                              handleBasicFieldChange("color", e.target.value)
                            }
                            className="w-12 h-10 rounded border cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                          <input
                            type="text"
                            value={editedTourType.color || ""}
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
                          {TOUR_TYPE_UPDATE_PRESET_COLORS.map((color) => (
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
                                  editedTourType.hoverColor === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedTourType.hoverColor === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedTourType.hoverColor || "#000000"}
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
                            value={editedTourType.hoverColor || ""}
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
                        {TOUR_TYPE_UPDATE_STATUS_OPTIONS.map((opt) => {
                          const isSelected =
                            editedTourType.status === opt.value;
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

            {/* Read-only Tour Type Details Components */}
            <TourTypeReadOnlyDetails
              tourType={editedTourType}
              allTours={allTours}
              loadingTours={loadingTours}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onAddTour={handleAddTour}
              onRemoveTour={handleRemoveTour}
              onSetPrimaryTour={handleSetPrimaryTour}
              onRemoveImage={handleRemoveImage}
              onAddNewImage={handleAddNewImage}
              onUpdateImage={handleUpdateImage}
              uploadingImages={uploadingImages}
              theme={theme}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedTourType && originalTourType && (
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
                {loadingUpdate ? "Updating..." : "Update Tour Type"}
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
                      Click "Update Tour Type" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalTourType && editedTourType && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedTourType.typeName}
            changedFields={getChangedFields()}
            confirmText="Update Tour Type"
            cancelText="Cancel"
            title="Confirm Tour Type Update"
            message={`You are about to update "${editedTourType.typeName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateTourTypePage;
