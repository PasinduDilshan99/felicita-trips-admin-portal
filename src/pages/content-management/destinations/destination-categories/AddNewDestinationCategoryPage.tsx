"use client";

import React, { useState } from "react";
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
import { DestinationService } from "@/services/destinationService";
import { AddDestinationCategoryRequest, AddDestinationCategoryImageRequest } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { Tag, Palette, FileText, Image as ImageIcon, MapPin } from "lucide-react";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const AddNewDestinationCategoryPage = () => {
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
      label: "Destination Categories",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/destination-categories`,
    },
    {
      label: "Add New Category",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/destination-categories/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddDestinationCategoryRequest>({
    category: "",
    description: "",
    status: "ACTIVE",
    color: "#10b981",
    hoverColor: "#059669",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: AddDestinationCategoryImageRequest[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category name is required";
    } else if (formData.category.length > 100) {
      newErrors.category = "Category name must be less than 100 characters";
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

    const hasUploadingImages = imagePreviews.some((preview) => preview.uploading);
    if (hasUploadingImages) {
      newErrors.images = "Please wait for all images to finish uploading";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit destination category
  const submitDestinationCategory = async () => {
    setLoading(true);
    try {
      const response = await DestinationService.addDestinationCategory(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Destination Category Created Successfully!",
          message: `${formData.category} has been added to destination categories.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add destination category");
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
    await submitDestinationCategory();
  };

  // Reset form
  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFormData({
      category: "",
      description: "",
      status: "ACTIVE",
      color: "#10b981",
      hoverColor: "#059669",
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
            title="Add New Destination Category"
            description="Create a new category to organize your destinations"
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
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{ color: theme.text }}
                    >
                      Category Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Basic details for the destination category
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <InputField
                    label="Category Name"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Beaches, Mountains, Historical, Cultural, Wildlife"
                    maxLength={100}
                    showCounter
                    error={errors.category}
                    helperText="Unique name for this category"
                  />

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Describe what this category represents..."
                    maxLength={500}
                    showCounter
                    error={errors.description}
                    helperText="Brief description of the category"
                  />

                  <StatusSelector
                    value={formData.status as "ACTIVE" | "INACTIVE"}
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
                      Customize the category appearance
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Color */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Category Color
                        <span style={{ color: theme.error }}> *</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => handleColorChange(e.target.value, "color")}
                            className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => handleColorChange(e.target.value, "color")}
                          className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-mono"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: errors.color ? theme.error : theme.border,
                            color: theme.text,
                          }}
                          placeholder="#000000"
                        />
                      </div>
                      {errors.color && (
                        <p className="mt-1.5 text-xs" style={{ color: theme.error }}>
                          {errors.color}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 transition-all duration-200"
                          style={{ backgroundColor: formData.color, borderColor: theme.border }}
                        />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
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
                            onChange={(e) => handleColorChange(e.target.value, "hoverColor")}
                            className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                            style={{ borderColor: theme.border }}
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.hoverColor}
                          onChange={(e) => handleColorChange(e.target.value, "hoverColor")}
                          className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-mono"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: errors.hoverColor ? theme.error : theme.border,
                            color: theme.text,
                          }}
                          placeholder="#000000"
                        />
                      </div>
                      {errors.hoverColor && (
                        <p className="mt-1.5 text-xs" style={{ color: theme.error }}>
                          {errors.hoverColor}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                          style={{ backgroundColor: formData.hoverColor, borderColor: theme.border }}
                        />
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
                          Preview on hover
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Category"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Image Uploader */}
            <ImageUploader<AddDestinationCategoryImageRequest>
              images={formData.images}
              imagePreviews={imagePreviews}
              onImagePreviewsChange={handleImagePreviewsChange}
              onImagesChange={handleImagesChange}
              onUploadingChange={handleUploadingImagesChange}
              errors={errors}
              showColorPicker={false}
              title="Category Images"
              description="Upload images or add by URL to represent this category"
            />

            {/* Form Summary */}
            <FormSummary
              title="Category Summary"
              sections={[
                {
                  label: "Category Name",
                  value: formData.category || "Not set",
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
                  color: formData.status === "ACTIVE" ? theme.success : theme.textSecondary,
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
                "Choose a unique and descriptive category name",
                "Select colors that represent the category well",
                "Upload representative images for better visualization",
                "Inactive categories won't be visible to customers",
                "Categories help organize destinations and improve navigation",
                "Destinations can be filtered by categories on the frontend",
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
          title: "Create New Destination Category",
          message: "Are you sure you want to create this destination category?",
          itemName: formData.category || "Untitled Category",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Check that colors are visually appealing and accessible",
            "You can edit this category anytime after creation",
            "Destinations will be organized under this category",
            "Categories improve destination search and filtering",
            "Use descriptive names that clearly represent the category",
          ],
        }}
        confirmText="Create Category"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Destination category created successfully");
          // Optional: Redirect after success
          // setTimeout(() => {
          //   router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/destination-categories`);
          // }, 1500);
        }}
        onError={(error) => {
          console.error("Failed to create destination category:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message: error.message || "Failed to create destination category. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewDestinationCategoryPage;