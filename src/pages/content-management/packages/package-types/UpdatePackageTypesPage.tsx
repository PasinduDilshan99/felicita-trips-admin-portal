"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageTypeService } from "@/services/packageTypeService";
import { OtherService } from "@/services/otherService";
import {
  PackageTypeDetails,
  UpdatePackageTypeRequest,
  PackageTypeImageRequest,
  UpdatePackageTypeImageRequest,
} from "@/types/package-type-types";
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
import { PACKAGE_TYPE_DETAILS_VIEW_URL } from "@/utils/urls";
import { PackageTypeReadOnlyDetails } from "@/components/package-types-components/update-package-types-components/PackageTypeReadOnlyDetails";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PACKAGE_TYPE_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { cardVariants, sectionVariants } from "@/app/animations/variants";
import { PACKAGE_TYPE_UPDATE_PRESET_COLORS } from "@/data/colors-data";
import { PACKAGE_TYPE_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

const UpdatePackageTypePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialTypeName = searchParams?.get("package-type-name") || "";
  const initialTypeId = searchParams?.get("package-type-id") || "";

  // Build package types list from common context
  const packageTypesList = React.useMemo(() => {
    if (categories?.packageCategoryList) {
      return categories.packageCategoryList.map((type) => ({
        id: type.packageCategoryId,
        name: type.packageCategoryName,
      }));
    }
    return [];
  }, [categories]);

  const [selectedType, setSelectedType] = useState<{
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
  const [originalType, setOriginalType] = useState<PackageTypeDetails | null>(
    null,
  );
  const [editedType, setEditedType] = useState<PackageTypeDetails | null>(null);
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<PackageTypeImageRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<
    UpdatePackageTypeImageRequest[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic", "packages", "images"]),
  );

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

  // Update URL when selected type changes
  const updateUrlWithSelectedType = useCallback(
    (type: { id: number; name: string } | null) => {
      const url = new URL(window.location.href);
      if (type) {
        url.searchParams.set("package-type-id", type.id.toString());
        url.searchParams.set("package-type-name", type.name);
      } else {
        url.searchParams.delete("package-type-id");
        url.searchParams.delete("package-type-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // If initialTypeId is provided, fetch details
  useEffect(() => {
    if (initialTypeId && !originalType && !loadingDetails) {
      handleSelectType(parseInt(initialTypeId), initialTypeName);
    }
  }, [initialTypeId, initialTypeName]);

  const handleSelectType = async (id: number, name: string) => {
    const newSelectedType = { id, name };
    setSelectedType(newSelectedType);
    updateUrlWithSelectedType(newSelectedType);
    await fetchTypeDetails(id);
  };

  const fetchTypeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalType(null);
    setEditedType(null);
    setBasicDetailsChanged(false);
    setRemovedImageIds([]);
    setNewImages([]);
    setUpdatedImages([]);

    try {
      const response = await PackageTypeService.getPackageTypeDetails(id);
      const typeData = response.data;
      setOriginalType(typeData);
      setEditedType(typeData);
    } catch (err: any) {
      setError(err.message || "Failed to load package type details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load package type details",
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

      const newImage: PackageTypeImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedType) {
        const tempImage = {
          imageId: Date.now(),
          name: imageName,
          description: imageDescription,
          imageUrl: cloudinaryUrl,
          status: "ACTIVE",
        };
        setEditedType({
          ...editedType,
          images: [...editedType.images, tempImage],
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
    if (!editedType) return;
    setBasicDetailsChanged(true);
    setEditedType({
      ...editedType,
      [field]: value,
    });
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setEditedType((prev) => {
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
      const originalImage = originalType?.images.find(
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
    setEditedType((prev) => {
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
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    );
  }, [basicDetailsChanged, removedImageIds, newImages, updatedImages]);

  // Prepare update data
  const prepareUpdateData = (): UpdatePackageTypeRequest | null => {
    if (!editedType || !selectedType) return null;

    return {
      typeId: selectedType.id,
      typeName: editedType.typeName,
      description: editedType.description,
      color: editedType.color,
      hoverColor: editedType.hoverColor,
      status: editedType.status as "ACTIVE" | "INACTIVE",
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
      const response = await PackageTypeService.updatePackageType(updateData);

      setSuccess(
        `Package Type "${editedType?.typeName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedType?.typeName} has been updated successfully.`,
        actionLink: `${PACKAGE_TYPE_DETAILS_VIEW_URL}/${selectedType?.id}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedType) {
          fetchTypeDetails(selectedType.id);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update package type");
      setToast({
        type: "error",
        title: "Update Failed",
        message:
          err.message || "Failed to update package type. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalType) {
      setEditedType(originalType);
      setBasicDetailsChanged(false);
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

  const handleClearTypeSelection = () => {
    setSelectedType(null);
    setOriginalType(null);
    setEditedType(null);
    setToast(null);
    updateUrlWithSelectedType(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalType || !editedType) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "typeName", label: "Package Type Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalType[key as keyof PackageTypeDetails];
      const newValue = editedType[key as keyof PackageTypeDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalType.color !== editedType.color) {
      changes.push({
        field: "Color",
        oldValue: originalType.color,
        newValue: editedType.color,
      });
    }
    if (originalType.hoverColor !== editedType.hoverColor) {
      changes.push({
        field: "Hover Color",
        oldValue: originalType.hoverColor,
        newValue: editedType.hoverColor,
      });
    }

    if (
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    ) {
      changes.push({
        field: "Images",
        oldValue: originalType.images.length,
        newValue: editedType.images.length,
      });
    }

    return changes;
  };

  // Build search items from package types (from common context)
  const searchItems: SearchItem[] = packageTypesList.map((type) => ({
    id: type.id,
    name: type.name,
  }));

  const selectedSearchItem = selectedType
    ? {
        id: selectedType.id,
        name: selectedType.name,
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
        message="Loading package types..."
        subMessage="Please wait while we fetch available package types"
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
        message="Unable to load package types. Please try again."
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
          actionText="View Package Type"
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
            title="Update Package Type"
            description="Edit and update existing package type information"
            breadcrumbItems={PACKAGE_TYPE_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedType && (
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
              Select Package Type to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectType(item.id as number, item.name)
              }
              onClearSelection={handleClearTypeSelection}
              initialSearchTerm={initialTypeName}
              placeholder="Search package types..."
              title="Package Types"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Type Info Bar */}
        {selectedType && (
          <SelectedItemBar
            item={{
              id: selectedType.id,
              name: selectedType.name,
            }}
            onClear={handleClearTypeSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Type"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading package type details..."
            subMessage="Please wait while we fetch the package type information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Type Details Form */}
        {editedType && selectedType && (
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
                      Core details about the package type (editable)
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
                    {/* Type Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Package Type Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedType.typeName}
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
                        placeholder="e.g., Luxury Package"
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
                        value={editedType.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Package type description..."
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
                          {PACKAGE_TYPE_UPDATE_PRESET_COLORS.map((color) => (
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
                                  editedType.color === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedType.color === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedType.color}
                            onChange={(e) =>
                              handleBasicFieldChange("color", e.target.value)
                            }
                            className="w-12 h-10 rounded border cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                          <input
                            type="text"
                            value={editedType.color}
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
                          {PACKAGE_TYPE_UPDATE_PRESET_COLORS.map((color) => (
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
                                  editedType.hoverColor === color
                                    ? theme.text
                                    : "transparent",
                                boxShadow:
                                  editedType.hoverColor === color
                                    ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editedType.hoverColor}
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
                            value={editedType.hoverColor}
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
                        {PACKAGE_TYPE_UPDATE_STATUS_OPTIONS.map((opt) => {
                          const isSelected = editedType.status === opt.value;
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

            {/* Read-only Package Type Details Components */}
            <PackageTypeReadOnlyDetails
              type={editedType}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onRemoveImage={handleRemoveImage}
              onAddNewImage={handleAddNewImage}
              onUpdateImage={handleUpdateImage}
              uploadingImages={uploadingImages}
              theme={theme}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedType && originalType && (
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
                {loadingUpdate ? "Updating..." : "Update Package Type"}
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
                      Click "Update Package Type" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalType && editedType && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedType.typeName}
            changedFields={getChangedFields()}
            confirmText="Update Package Type"
            cancelText="Cancel"
            title="Confirm Package Type Update"
            message={`You are about to update "${editedType.typeName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdatePackageTypePage;
