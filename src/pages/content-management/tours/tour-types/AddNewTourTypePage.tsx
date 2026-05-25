"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  ToastNotification,
  ToastType,
} from "@/components/common-components/ToastNotification";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Loader,
  Tag,
  Palette,
  FileText,
  Image as ImageIcon,
  Hash,
} from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import {
  AddTourTypeRequest,
  TourTypeImageRequest,
} from "@/types/tour-type-types";
import { TourTypeService } from "@/services/tourTypeService";
import { TourSelector } from "@/components/common-components/TourSelector";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const AddNewTourTypePage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Tour Types",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tour-types`,
    },
    {
      label: "Add New Tour Type",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tour-types/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddTourTypeRequest>({
    typeName: "",
    description: "",
    color: "#10b981",
    hoverColor: "#059669",
    status: "ACTIVE",
    tourIds: [],
    images: [],
  });

  // Image state
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File; uploading?: boolean; uploadError?: string }[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle color change
  const handleColorChange = (color: string, field: "color" | "hoverColor") => {
    setFormData({ ...formData, [field]: color });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  // Handle status change
  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  // Handle tour selection
  const handleTourIdsChange = (tourIds: number[]) => {
    setFormData({ ...formData, tourIds });
    if (errors.tourIds) setErrors({ ...errors, tourIds: "" });
  };

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: TourTypeImageRequest[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.typeName.trim()) {
      newErrors.typeName = "Tour type name is required";
    } else if (formData.typeName.length > 100) {
      newErrors.typeName = "Tour type name must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.color) {
      newErrors.color = "Color is required";
    }

    if (!formData.hoverColor) {
      newErrors.hoverColor = "Hover color is required";
    }

    if (formData.tourIds.length === 0) {
      newErrors.tourIds = "At least one tour must be selected";
    }

    const hasUploadingImages = imagePreviews.some(
      (preview) => preview.uploading,
    );
    if (hasUploadingImages) {
      newErrors.images = "Please wait for all images to finish uploading";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit tour type
  const submitTourType = async () => {
    setLoading(true);
    try {
      const response = await TourTypeService.addTourType(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Tour Type Created Successfully!",
          message: `${formData.typeName} has been added to tour types.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add tour type");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle create button click - opens dialog
  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle confirm create from dialog
  const handleConfirmCreate = async () => {
    await submitTourType();
  };

  // Reset form
  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFormData({
      typeName: "",
      description: "",
      color: "#10b981",
      hoverColor: "#059669",
      status: "ACTIVE",
      tourIds: [],
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Tour Type"
            description="Create a new type to categorize your tours"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* Basic Information Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-6 py-4"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Tag className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{ color: theme.text }}
                    >
                      Tour Type Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Basic details for the tour type
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <InputField
                    label="Tour Type Name"
                    name="typeName"
                    value={formData.typeName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Adventure, Luxury, Family, Group"
                    maxLength={100}
                    showCounter
                    error={errors.typeName}
                    helperText="Unique name for this tour type"
                  />

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Describe what this tour type represents..."
                    maxLength={500}
                    showCounter
                    error={errors.description}
                    helperText="Brief description of the tour type"
                  />

                  <StatusSelector
                    value={formData.status}
                    onChange={handleStatusChange}
                    required
                  />
                </div>
              </div>

              {/* Colors Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-6 py-4"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.warning}18`,
                      color: theme.warning,
                    }}
                  >
                    <Palette className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{ color: theme.text }}
                    >
                      Branding Colors
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Customize the tour type appearance
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tour Type Color */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Tour Type Color
                        <span style={{ color: theme.error }}> *</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) =>
                              handleColorChange(e.target.value, "color")
                            }
                            className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) =>
                            handleColorChange(e.target.value, "color")
                          }
                          className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-mono"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: errors.color
                              ? theme.error
                              : theme.border,
                            color: theme.text,
                          }}
                          placeholder="#000000"
                        />
                      </div>
                      {errors.color && (
                        <p
                          className="mt-1.5 text-xs"
                          style={{ color: theme.error }}
                        >
                          {errors.color}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 transition-all duration-200"
                          style={{
                            backgroundColor: formData.color,
                            borderColor: theme.border,
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Preview color
                        </span>
                      </div>
                    </div>

                    {/* Hover Color */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Hover Color
                        <span style={{ color: theme.error }}> *</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={formData.hoverColor}
                            onChange={(e) =>
                              handleColorChange(e.target.value, "hoverColor")
                            }
                            className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.hoverColor}
                          onChange={(e) =>
                            handleColorChange(e.target.value, "hoverColor")
                          }
                          className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-mono"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: errors.hoverColor
                              ? theme.error
                              : theme.border,
                            color: theme.text,
                          }}
                          placeholder="#000000"
                        />
                      </div>
                      {errors.hoverColor && (
                        <p
                          className="mt-1.5 text-xs"
                          style={{ color: theme.error }}
                        >
                          {errors.hoverColor}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                          style={{
                            backgroundColor: formData.hoverColor,
                            borderColor: theme.border,
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Preview on hover
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Selector Card */}
              <TourSelector
                selectedTourIds={formData.tourIds}
                onChange={handleTourIdsChange}
                error={errors.tourIds}
                required
              />

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Tour Type"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Image Uploader */}
            <ImageUploader<TourTypeImageRequest>
              images={formData.images}
              imagePreviews={imagePreviews}
              onImagePreviewsChange={handleImagePreviewsChange}
              onImagesChange={handleImagesChange}
              onUploadingChange={handleUploadingImagesChange}
              errors={errors}
              showColorPicker={false}
              title="Tour Type Images"
              description="Upload images or add by URL to represent this tour type"
            />

            {/* Form Summary */}
            <FormSummary
              title="Tour Type Summary"
              sections={[
                {
                  label: "Tour Type Name",
                  value: formData.typeName || "Not set",
                  icon: "tag",
                  color: theme.primary,
                },
                {
                  label: "Description",
                  value: formData.description
                    ? formData.description.length > 60
                      ? `${formData.description.substring(0, 60)}...`
                      : formData.description
                    : "Not set",
                  icon: "file",
                  color: theme.textSecondary,
                },
                {
                  label: "Color",
                  value: formData.color || "Not set",
                  icon: "palette",
                  color: formData.color,
                },
                {
                  label: "Hover Color",
                  value: formData.hoverColor || "Not set",
                  icon: "palette",
                  color: formData.hoverColor,
                },
                {
                  label: "Status",
                  value: formData.status || "Not set",
                  icon: "eye",
                  color:
                    formData.status === "ACTIVE"
                      ? theme.success
                      : theme.textSecondary,
                },
                {
                  label: "Tours",
                  value: `${formData.tourIds.length} tour(s) selected`,
                  icon: "eye",
                  color: theme.success,
                },
                {
                  label: "Images",
                  value:
                    formData.images.length > 0
                      ? `${formData.images.length} image(s)`
                      : "No images (optional)",
                  icon: "image",
                  color: theme.error,
                },
              ]}
              tips={[
                "Choose a unique and descriptive tour type name",
                "Select colors that represent the tour type well",
                "Add relevant tours to this type for better organization",
                "Upload representative images for better visualization",
                "Inactive tour types won't be visible to customers",
                "Tour types help customers filter and find tours easily",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Tour Type",
          message: "Are you sure you want to create this tour type?",
          itemName: formData.typeName || "Untitled Tour Type",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Verify that the selected tours belong to this type",
            "Check that colors are visually appealing and accessible",
            "You can edit this tour type anytime after creation",
            "Tours will be organized under this type for better filtering",
          ],
        }}
        confirmText="Create Tour Type"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Tour type created successfully");
          // Optional: Redirect after success
          // setTimeout(() => {
          //   router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tour-types`);
          // }, 1500);
        }}
        onError={(error) => {
          console.error("Failed to create tour type:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create tour type. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewTourTypePage;
