// app/destinations/categories/update/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { UpdateDestinationCategoryRequest } from "@/types/destination-types";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import CategoryBasicInfoForm from "@/components/destination-categories-components/destination-categories-update-components/CategoryBasicInfoForm";
import ExistingImagesManager from "@/components/destination-categories-components/destination-categories-update-components/ExistingImagesManager";
import RemovedImagesManager from "@/components/destination-categories-components/destination-categories-update-components/RemovedImagesManager";
import NewImagesUploader from "@/components/destination-categories-components/destination-categories-update-components/NewImagesUploader";
import { OtherService } from "@/services/otherService";
import CategoryColorsForm from "@/components/destination-categories-components/destination-categories-add-components/CategoryColorsForm";
import CategoryPreview from "@/components/destination-categories-components/destination-categories-add-components/CategoryPreview";
import { CategoryUpdateFormActions } from "@/components/destination-categories-components/destination-categories-update-components/CategoryUpdateFormActions";
import { hexToRgba } from "@/utils/functions";
import {
  DESTINATION_CATEGORIES_PAGE_URL,
  DESTINATION_CATEGORY_VIEW_PAGE_URL,
  DESTINATION_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";

interface ExistingImage {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  isRemoved?: boolean;
}

interface NewImage {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  uploadProgress?: number;
  previewUrl?: string;
  isNew?: boolean;
}

// Category search item interface
interface CategorySearchItem extends SearchItem {
  id: number;
  name: string;
  description?: string;
}

const UpdateDestinationCategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();

  const categoryIdFromQuery = searchParams?.get("categoryId") ?? null;

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    categoryId: 0,
    category: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | string,
    color: "#3B82F6",
    hoverColor: "#2563EB",
  });

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
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
    { label: "Update", href: "#" },
  ];

  const destinationCategories = categories?.destinationCategoryList || [];

  // Convert categories to search items format
  const searchItems: CategorySearchItem[] = destinationCategories.map(
    (cat) => ({
      id: cat.destinationCategoryId,
      name: cat.destinationCategoryName,
      description: cat.destinationCategoryDescription,
    }),
  );

  const selectedSearchItem: CategorySearchItem | null = selectedCategory
    ? {
        id: selectedCategory.id,
        name: selectedCategory.name,
        description: destinationCategories.find(
          (cat) => cat.destinationCategoryId === selectedCategory.id,
        )?.destinationCategoryDescription,
      }
    : null;

  const loadCategoryData = useCallback(async (categoryId: number) => {
    setLoadingCategory(true);
    setErrors({});
    try {
      const response =
        await DestinationService.getCategoryDetailsById(categoryId);
      const data = response.data;

      setFormData({
        categoryId: data.categoryId,
        category: data.category,
        description: data.categoryDescription,
        status: data.categoryStatus,
        color: data.color,
        hoverColor: data.hoverColor,
      });

      setExistingImages(
        data.images.map((img: any) => ({
          imageId: img.imageId,
          name: img.imageName,
          description: img.imageDescription || "",
          imageUrl: img.imageUrl,
          status: img.imageStatus as "ACTIVE" | "INACTIVE",
          isRemoved: false,
        })),
      );

      setNewImages([]);
      setRemoveImageIds([]);
    } catch (error) {
      console.error("Error loading category:", error);
      setErrors({ load: "Failed to load category details" });
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to load category details",
      });
    } finally {
      setLoadingCategory(false);
    }
  }, []);

  useEffect(() => {
    if (categoryIdFromQuery) {
      const id = parseInt(categoryIdFromQuery);
      if (!isNaN(id)) {
        const foundCategory = destinationCategories.find(
          (cat) => cat.destinationCategoryId === id,
        );
        setSelectedCategory({
          id,
          name: foundCategory?.destinationCategoryName || "",
        });
        loadCategoryData(id);
      }
    }
  }, [categoryIdFromQuery, loadCategoryData, destinationCategories]);

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

    for (let i = 0; i < newImages.length; i++) {
      if (!newImages[i].name.trim()) {
        newErrors[`new_image_${i}_name`] = `Image ${i + 1} name is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const uploadNewImages = async (): Promise<any[]> => {
    const uploadedImages = [];

    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i];

      if (image.imageUrl) {
        uploadedImages.push({
          name: image.name,
          description: image.description,
          imageUrl: image.imageUrl,
          status: image.status,
        });
      } else if (image.imageFile) {
        setNewImages((prev) =>
          prev.map((img, idx) =>
            idx === i ? { ...img, uploadProgress: 50 } : img,
          ),
        );

        const uploadedUrl = await uploadImageToCloudinary(image.imageFile);

        setNewImages((prev) =>
          prev.map((img, idx) =>
            idx === i
              ? { ...img, imageUrl: uploadedUrl, uploadProgress: 100 }
              : img,
          ),
        );

        uploadedImages.push({
          name: image.name,
          description: image.description,
          imageUrl: uploadedUrl,
          status: image.status,
        });
      }
    }

    return uploadedImages;
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setErrors({ select: "Please select a category to update" });
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setToast(null);

    try {
      const uploadedNewImages = await uploadNewImages();

      const updateImages = existingImages
        .filter((img) => !img.isRemoved)
        .map((img) => ({
          imageId: img.imageId,
          name: img.name,
          description: img.description,
          imageUrl: img.imageUrl,
          status: img.status,
        }));

      const requestData: UpdateDestinationCategoryRequest = {
        categoryId: formData.categoryId,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        color: formData.color,
        hoverColor: formData.hoverColor,
        removeImageIds: removeImageIds,
        updateImages: updateImages,
        newImages: uploadedNewImages,
      };

      const response =
        await DestinationService.updateDestinationCategory(requestData);

      setToast({
        type: "success",
        title: "Success!",
        message: response.message || "Category updated successfully!",
        actionLink: DESTINATION_CATEGORY_VIEW_PAGE_URL,
      });

      setTimeout(() => {
        router.push(DESTINATION_CATEGORY_VIEW_PAGE_URL);
      }, 2000);
    } catch (error) {
      console.error("Error updating category:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to update category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleReset = () => {
    if (selectedCategory) {
      loadCategoryData(selectedCategory.id);
    }
    setToast(null);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("categoryId");
    router.replace(url.toString(), { scroll: false });
    setFormData({
      categoryId: 0,
      category: "",
      description: "",
      status: "ACTIVE",
      color: "#3B82F6",
      hoverColor: "#2563EB",
    });
    setExistingImages([]);
    setNewImages([]);
    setRemoveImageIds([]);
    setToast(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, isRemoved: true } : img,
      ),
    );
    setRemoveImageIds((prev) => [...prev, imageId]);
  };

  const handleRestoreExistingImage = (imageId: number) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, isRemoved: false } : img,
      ),
    );
    setRemoveImageIds((prev) => prev.filter((id) => id !== imageId));
  };

  const handleUpdateExistingImage = (
    imageId: number,
    updates: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "INACTIVE";
    },
  ) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, ...updates } : img,
      ),
    );
  };

  const handleAddNewImages = (images: NewImage[]) => {
    setNewImages((prev) => [...prev, ...images]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNewImage = (
    index: number,
    updates: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "INACTIVE";
    },
  ) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, ...updates } : img)),
    );
    if (updates.name && errors[`new_image_${index}_name`]) {
      setErrors((prev) => ({ ...prev, [`new_image_${index}_name`]: "" }));
    }
  };

  const handleUpdateImageProgress = (index: number, progress: number) => {
    setNewImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploadProgress: progress } : img,
      ),
    );
  };

  const handleSelectCategory = (item: CategorySearchItem) => {
    const id = item.id as number;
    const name = item.name;
    setSelectedCategory({ id, name });
    const url = new URL(window.location.href);
    url.searchParams.set("categoryId", id.toString());
    router.replace(url.toString(), { scroll: false });
    loadCategoryData(id);
  };

  // Custom render function for category items
  const renderCategoryItem = (
    item: CategorySearchItem,
    searchTerm: string,
    isActive: boolean,
  ) => {
    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.18),
              color: theme.primary,
              fontWeight: 600,
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      );
    };

    return (
      <>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
              : hexToRgba(theme.primary, 0.1),
          }}
        >
          <span
            className="text-sm"
            style={{ color: isActive ? "#fff" : theme.primary }}
          >
            📁
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm" style={{ color: theme.text }}>
            {highlightMatch(item.name, searchTerm)}
          </div>
          {item.description && (
            <div
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {item.description.length > 60
                ? `${item.description.substring(0, 60)}...`
                : item.description}
            </div>
          )}
        </div>
      </>
    );
  };

  if (categoriesLoading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch available categories"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (!selectedCategory && !categoryIdFromQuery) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
          style={{
            backgroundColor: `${theme.surface}D9`,
            borderColor: theme.border,
          }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title="Update Category"
              description="Search and select a category to update"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="rounded-2xl shadow-lg p-8"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              Select Category to Update
            </h2>

            {errors.select && (
              <p className="text-sm mb-4" style={{ color: theme.error }}>
                {errors.select}
              </p>
            )}

            <CommonSearch<CategorySearchItem>
              items={searchItems}
              loading={categoriesLoading}
              selectedItem={selectedSearchItem}
              onSelectItem={handleSelectCategory}
              onClearSelection={handleClearSelection}
              initialSearchTerm=""
              placeholder="Search categories..."
              title="Categories"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
              renderItem={renderCategoryItem}
            />
          </div>
        </div>
      </div>
    );
  }

  if (loadingCategory) {
    return (
      <CommonLoading
        message="Loading category details..."
        subMessage="Please wait while we fetch category information"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (errors.load) {
    return (
      <CommonErrorState
        error={errors.load}
        title="Failed to Load Category"
        message="The category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleClearSelection}
        onRetry={() =>
          selectedCategory && loadCategoryData(selectedCategory.id)
        }
        backButtonText="Go Back to Selection"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Categories"
        />
      )}

      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={`Update Category: ${formData.category}`}
            description="Edit destination category details"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SelectedItemBar
          item={
            selectedCategory
              ? {
                  id: selectedCategory.id,
                  name: selectedCategory.name,
                }
              : null
          }
          onClear={handleClearSelection}
          variant="primary"
          title="Currently Editing"
          showId={true}
          clearButtonText="Change Category"
          size="md"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CategoryBasicInfoForm
              category={formData.category}
              description={formData.description}
              status={formData.status}
              errors={errors}
              onFieldChange={handleFieldChange}
            />

            <ExistingImagesManager
              images={existingImages.filter((img) => !img.isRemoved)}
              onRemoveImage={handleRemoveExistingImage}
              onUpdateImage={handleUpdateExistingImage}
            />

            <RemovedImagesManager
              images={existingImages.filter((img) => img.isRemoved)}
              onRestoreImage={handleRestoreExistingImage}
            />

            <NewImagesUploader
              images={newImages}
              errors={errors}
              onAddImages={handleAddNewImages}
              onRemoveImage={handleRemoveNewImage}
              onUpdateImage={handleUpdateNewImage}
              onUpdateImageProgress={handleUpdateImageProgress}
            />
          </div>

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
              images={[
                ...existingImages
                  .filter((img) => !img.isRemoved)
                  .map((img) => ({
                    previewUrl: img.imageUrl,
                    imageUrl: img.imageUrl,
                    name: img.name,
                  })),
                ...newImages,
              ]}
            />
          </div>
        </div>

        {/* Form Actions at Bottom */}
        <div className="mt-8">
          <CategoryUpdateFormActions
            loading={loading}
            uploadingImages={uploadingImages}
            onSave={handleSubmit}
            onReset={handleReset}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateDestinationCategoryPage;
