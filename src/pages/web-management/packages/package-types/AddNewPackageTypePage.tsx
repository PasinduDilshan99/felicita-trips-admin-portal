"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  ToastNotification,
  ToastType,
} from "@/components/common-components/ToastNotification";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { Tag, Palette, FileText, Image as ImageIcon, Package } from "lucide-react";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { AddPackageTypeRequest, PackageTypeImageRequest } from "@/types/package-type-types";
import { PackageTypeService } from "@/services/packageTypeService";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const AddNewPackageTypePage = () => {
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
      label: "Package Types",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/package-types`,
    },
    {
      label: "Add New Package Type",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/package-types/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddPackageTypeRequest>({
    typeName: "",
    description: "",
    color: "#10b981",
    hoverColor: "#059669",
    status: "ACTIVE",
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

  const handleImagesChange = (images: PackageTypeImageRequest[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.typeName.trim()) {
      newErrors.typeName = "Package type name is required";
    } else if (formData.typeName.length > 100) {
      newErrors.typeName = "Package type name must be less than 100 characters";
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

  // Submit package type
  const submitPackageType = async () => {
    setLoading(true);
    try {
      const response = await PackageTypeService.addPackageType(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Package Type Created Successfully!",
          message: `${formData.typeName} has been added to package types.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add package type");
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
    await submitPackageType();
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
            title="Add New Package Type"
            description="Create a new type to categorize your packages"
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
                    <Package className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{ color: theme.text }}
                    >
                      Package Type Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Basic details for the package type
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <InputField
                    label="Package Type Name"
                    name="typeName"
                    value={formData.typeName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Standard, Premium, Luxury, Economy, Family"
                    maxLength={100}
                    showCounter
                    error={errors.typeName}
                    helperText="Unique name for this package type"
                  />

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Describe what this package type represents..."
                    maxLength={500}
                    showCounter
                    error={errors.description}
                    helperText="Brief description of the package type"
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
                      Customize the package type appearance
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Package Type Color */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Package Type Color
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
                submitText="Package Type"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Image Uploader */}
            <ImageUploader<PackageTypeImageRequest>
              images={formData.images}
              imagePreviews={imagePreviews}
              onImagePreviewsChange={handleImagePreviewsChange}
              onImagesChange={handleImagesChange}
              onUploadingChange={handleUploadingImagesChange}
              errors={errors}
              showColorPicker={false}
              title="Package Type Images"
              description="Upload images or add by URL to represent this package type"
            />

            {/* Form Summary */}
            <FormSummary
              title="Package Type Summary"
              sections={[
                {
                  label: "Package Type Name",
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
                "Choose a unique and descriptive package type name",
                "Select colors that represent the package type well",
                "Upload representative images for better visualization",
                "Inactive package types won't be visible to customers",
                "Package types help organize and filter packages",
                "Common types include: Standard, Premium, Luxury, Economy",
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
          title: "Create New Package Type",
          message: "Are you sure you want to create this package type?",
          itemName: formData.typeName || "Untitled Package Type",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Check that colors are visually appealing and accessible",
            "You can edit this package type anytime after creation",
            "Packages will be organized under this type for better filtering",
            "Package types help customers find the right package tier",
            "Use names that clearly indicate the package level/quality",
          ],
        }}
        confirmText="Create Package Type"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Package type created successfully");
          // Optional: Redirect after success
          // setTimeout(() => {
          //   router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/package-types`);
          // }, 1500);
        }}
        onError={(error) => {
          console.error("Failed to create package type:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message: error.message || "Failed to create package type. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewPackageTypePage;