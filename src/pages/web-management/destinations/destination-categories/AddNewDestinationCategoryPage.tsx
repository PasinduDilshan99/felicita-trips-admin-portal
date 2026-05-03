// app/destinations/categories/add/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CategoryBasicInfoForm from "@/components/destination-categories-components/destination-categories-add-components/CategoryBasicInfoForm";
import CategoryImagesUpload from "@/components/destination-categories-components/destination-categories-add-components/CategoryImagesUpload";
import CategoryColorsForm from "@/components/destination-categories-components/destination-categories-add-components/CategoryColorsForm";
import CategoryPreview from "@/components/destination-categories-components/destination-categories-add-components/CategoryPreview";
import { OtherService } from "@/services/otherService";
import {
  DESTINATION_CATEGORIES_PAGE_URL,
  DESTINATION_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";
import { CategoryFormActions } from "@/components/destination-categories-components/destination-categories-add-components/CategoryFormActions";

interface CategoryImage {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  uploadProgress?: number;
  previewUrl?: string;
}

const AddNewDestinationCategoryPage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    color: "#3B82F6",
    hoverColor: "#2563EB",
    images: [] as CategoryImage[],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    {
      label: "Destinations",
      href: DESTINATION_PAGE_URL,
    },
    {
      label: "Categories",
      href: DESTINATION_CATEGORIES_PAGE_URL,
    },
    {
      label: "Add New",
      href: "#",
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category name is required";
    } else if (formData.category.length < 2) {
      newErrors.category = "Category name must be at least 2 characters";
    } else if (formData.category.length > 100) {
      newErrors.category = "Category name must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Category description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.color) {
      newErrors.color = "Primary color is required";
    }

    if (!formData.hoverColor) {
      newErrors.hoverColor = "Hover color is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    for (let i = 0; i < formData.images.length; i++) {
      if (!formData.images[i].name.trim()) {
        newErrors[`image_${i}_name`] = `Image ${i + 1} name is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageStatusChange = (
    index: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, status } : img,
      ),
    }));
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const response = await OtherService.uploadImage(file);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  };

  const addImages = (newImages: CategoryImage[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const updateImageName = (index: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, name } : img,
      ),
    }));
    if (errors[`image_${index}_name`]) {
      setErrors((prev) => ({ ...prev, [`image_${index}_name`]: "" }));
    }
  };

  const updateImageDescription = (index: number, description: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, description } : img,
      ),
    }));
  };

  const updateImageProgress = (index: number, progress: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, uploadProgress: progress } : img,
      ),
    }));
  };

  const updateImageUrl = (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, imageUrl: url } : img,
      ),
    }));
  };

  const uploadAllImages = async (): Promise<
    Array<{
      name: string;
      description: string;
      imageUrl: string;
      status: "ACTIVE" | "INACTIVE";
    }>
  > => {
    const uploadedImages = [];

    for (let i = 0; i < formData.images.length; i++) {
      const image = formData.images[i];

      if (image.imageUrl) {
        uploadedImages.push({
          name: image.name,
          description: image.description,
          imageUrl: image.imageUrl,
          status: image.status,
        });
      } else if (image.imageFile) {
        try {
          updateImageProgress(i, 50);
          const uploadedUrl = await uploadImageToCloudinary(image.imageFile);
          updateImageUrl(i, uploadedUrl);
          updateImageProgress(i, 100);

          uploadedImages.push({
            name: image.name,
            description: image.description,
            imageUrl: uploadedUrl,
            status: image.status,
          });
        } catch (error) {
          console.error(`Failed to upload ${image.name}:`, error);
          throw new Error(`Failed to upload ${image.name}`);
        }
      }
    }

    return uploadedImages;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setToast(null);

    try {
      const uploadedImages = await uploadAllImages();

      const requestData = {
        category: formData.category,
        description: formData.description,
        status: formData.status,
        color: formData.color,
        hoverColor: formData.hoverColor,
        images: uploadedImages.map((img) => ({
          name: img.name,
          description: img.description,
          imageUrl: img.imageUrl,
          status: img.status,
        })),
      };

      const response =
        await DestinationService.addDestinationCategory(requestData);

      setToast({
        type: "success",
        title: "Success!",
        message: response.message || "Category created successfully!",
      });

      setTimeout(() => {
        router.push(
          `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
        );
      }, 2000);
    } catch (error) {
      console.error("Error creating category:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to create category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      category: "",
      description: "",
      status: "ACTIVE",
      color: "#3B82F6",
      hoverColor: "#2563EB",
      images: [],
    });
    setErrors({});
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <CommonLoading
        message="Creating category..."
        subMessage="Please wait while we create the category"
        size="lg"
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
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Category"
            description="Create a new destination category"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <CategoryBasicInfoForm
              category={formData.category}
              description={formData.description}
              status={formData.status}
              errors={errors}
              onFieldChange={handleFieldChange}
            />

            <CategoryImagesUpload
              images={formData.images}
              errors={errors}
              onAddImages={addImages}
              onRemoveImage={removeImage}
              onUpdateImageName={updateImageName}
              onUpdateImageDescription={updateImageDescription}
              onUpdateImageStatus={handleImageStatusChange}
              onUpdateImageProgress={updateImageProgress}
            />
          </div>

          {/* Right Column - Preview & Colors */}
          <div className="space-y-6">
            <CategoryColorsForm
              color={formData.color}
              hoverColor={formData.hoverColor}
              errors={errors}
              onColorChange={(color) => handleFieldChange("color", color)}
              onHoverColorChange={(color) =>
                handleFieldChange("hoverColor", color)
              }
            />

            <CategoryPreview
              categoryName={formData.category}
              description={formData.description}
              color={formData.color}
              hoverColor={formData.hoverColor}
              images={formData.images}
            />
          </div>
        </div>

        {/* Form Actions at Bottom */}
        <div className="mt-8">
          <CategoryFormActions
            loading={loading}
            onSave={handleSubmit}
            onReset={handleReset}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNewDestinationCategoryPage;