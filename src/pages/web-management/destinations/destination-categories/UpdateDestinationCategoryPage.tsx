// app/destinations/categories/update/page.tsx
"use client";

import React, { useState, useEffect, useId, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  PLACE_HOLDER_IMAGE,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Tag,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Trash2,
  Move,
  AlertCircle,
  CheckCircle2,
  Palette,
  FileText,
  Eye,
  Loader2,
  CheckCircle,
  Search,
  MapPin,
} from "lucide-react";
import { OtherService } from "@/services/otherService";
import {
  AddDestinationCategoryImageRequest,
  UpdateDestinationCategoryImageRequest,
  UpdateDestinationCategoryRequest,
} from "@/types/destination-types";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Visible to customers",
    color: "#16a34a",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Hidden from customers",
    color: "#6b7280",
  },
];

const CATEGORY_NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

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

const UpdateDestinationCategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();
  const uid = useId();
  const statusRef = useRef<HTMLSelectElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get category ID from query params (handle null case)
  const categoryIdFromQuery = searchParams?.get("categoryId") ?? null;

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    categoryId: 0,
    category: "",
    description: "",
    status: "ACTIVE",
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Categories",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
    },
    {
      label: "Update",
      href: "#",
    },
  ];

  // Get destination categories from CommonContext
  const destinationCategories = categories?.destinationCategoryList || [];

  const filteredCategories = destinationCategories.filter((cat) =>
    cat.destinationCategoryName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const categoryNameLength = (formData.category ?? "").length;
  const descriptionLength = (formData.description ?? "").length;
  const descPct = (descriptionLength / DESCRIPTION_MAX) * 100;
  const descColor =
    descPct > 90 ? theme.error : descPct > 70 ? "#f59e0b" : theme.primary;

  // Load category data when selected
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
        data.images.map((img) => ({
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
    } finally {
      setLoadingCategory(false);
    }
  }, []);

  // Load category if categoryId is in URL query params
  useEffect(() => {
    if (categoryIdFromQuery) {
      const id = parseInt(categoryIdFromQuery);
      if (!isNaN(id)) {
        // Find the category name from the list
        const foundCategory = destinationCategories.find(cat => cat.destinationCategoryId === id);
        setSelectedCategory({ 
          id, 
          name: foundCategory?.destinationCategoryName || "" 
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
    } else if (formData.category.length > CATEGORY_NAME_MAX) {
      newErrors.category = `Category name must be less than ${CATEGORY_NAME_MAX} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Category description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > DESCRIPTION_MAX) {
      newErrors.description = `Description must be less than ${DESCRIPTION_MAX} characters`;
    }

    if (!formData.color) {
      newErrors.color = "Primary color is required";
    }

    if (!formData.hoverColor) {
      newErrors.hoverColor = "Hover color is required";
    }

    // Validate new images have names
    for (let i = 0; i < newImages.length; i++) {
      if (!newImages[i].name.trim()) {
        newErrors[`new_image_${i}_name`] = `Image ${i + 1} name is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusClick = (value: string) => {
    if (!statusRef.current) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value",
    )?.set;
    nativeInputValueSetter?.call(statusRef.current, value);
    statusRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleColorChange = (field: "color" | "hoverColor", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectCategory = (
    category: (typeof destinationCategories)[0],
  ) => {
    setSelectedCategory({
      id: category.destinationCategoryId,
      name: category.destinationCategoryName,
    });
    setSearchTerm(category.destinationCategoryName);
    setShowDropdown(false);
    setIsFocused(false);

    // Update URL with selected category as query param
    const url = new URL(window.location.href);
    url.searchParams.set(
      "categoryId",
      category.destinationCategoryId.toString(),
    );
    router.replace(url.toString(), { scroll: false });

    loadCategoryData(category.destinationCategoryId);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setShowDropdown(false);
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
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (newImages.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setUploadingImages(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages((prev) => [
          ...prev,
          {
            name: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            imageUrl: "",
            status: "ACTIVE",
            imageFile: file,
            uploadProgress: 0,
            previewUrl: reader.result as string,
            isNew: true,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }

    setUploadingImages(false);
    e.target.value = "";
  };

  const uploadNewImages = async (): Promise<
    AddDestinationCategoryImageRequest[]
  > => {
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

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, isRemoved: true } : img,
      ),
    );
    setRemoveImageIds((prev) => [...prev, imageId]);
  };

  const restoreExistingImage = (imageId: number) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, isRemoved: false } : img,
      ),
    );
    setRemoveImageIds((prev) => prev.filter((id) => id !== imageId));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExistingImageName = (imageId: number, name: string) => {
    setExistingImages((prev) =>
      prev.map((img) => (img.imageId === imageId ? { ...img, name } : img)),
    );
  };

  const updateExistingImageDescription = (
    imageId: number,
    description: string,
  ) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.imageId === imageId ? { ...img, description } : img,
      ),
    );
  };

  const updateExistingImageStatus = (
    imageId: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    setExistingImages((prev) =>
      prev.map((img) => (img.imageId === imageId ? { ...img, status } : img)),
    );
  };

  const updateNewImageName = (index: number, name: string) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, name } : img)),
    );
    if (errors[`new_image_${index}_name`]) {
      setErrors((prev) => ({ ...prev, [`new_image_${index}_name`]: "" }));
    }
  };

  const updateNewImageDescription = (index: number, description: string) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, description } : img)),
    );
  };

  const updateNewImageStatus = (
    index: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    setNewImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, status } : img)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      setErrors({ select: "Please select a category to update" });
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage(null);

    try {
      // Upload new images to Cloudinary
      const uploadedNewImages = await uploadNewImages();

      // Prepare update images (existing images that are not removed)
      const updateImages: UpdateDestinationCategoryImageRequest[] =
        existingImages
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

      setSuccessMessage(response.message || "Category updated successfully!");

      setTimeout(() => {
        router.push(
          `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
        );
      }, 2000);
    } catch (error) {
      console.error("Error updating category:", error);
      setErrors({ submit: "Failed to update category. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

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
      )
    );
  };

  // Show category selection if no category is selected (no ID in URL)
  if (!selectedCategory && !categoryIdFromQuery) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
          style={{
            backgroundColor: `${theme.surface}D9`,
            borderColor: theme.border,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <PageHeader
              title="Update Category"
              description="Search and select a category to update"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
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
              <Search className="w-5 h-5" style={{ color: theme.primary }} />
              Select Category to Update
            </h2>

            {errors.select && (
              <p className="text-sm mb-4" style={{ color: theme.error }}>
                {errors.select}
              </p>
            )}

            {/* Enhanced Search Input - Similar to DestinationSearch */}
            <div className="relative">
              <div
                className={`flex items-center rounded-xl border-2 transition-all duration-200 ${
                  isFocused ? "focused" : ""
                }${selectedCategory ? " has-value" : ""}`}
                style={{
                  borderColor: isFocused ? theme.primary : theme.border,
                  backgroundColor: isFocused ? hexToRgba(theme.primary, 0.02) : theme.surface,
                  boxShadow: isFocused ? `0 0 0 4px ${hexToRgba(theme.primary, 0.12)}` : "none",
                }}
              >
                <Search
                  className="ml-4 flex-shrink-0"
                  size={17}
                  style={{ color: isFocused ? theme.primary : theme.textSecondary }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                    setIsFocused(false);
                  }}
                  placeholder="Search categories..."
                  className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm"
                  style={{ color: theme.text }}
                />
                {searchTerm && (
                  <button
                    className="mr-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: hexToRgba(theme.primary, 0.15), color: theme.primary }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                {selectedCategory && (
                  <div
                    className="mr-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    }}
                  >
                    <MapPin size={10} style={{ color: "#fff" }} />
                    <span className="text-xs font-semibold text-white">
                      ID: {selectedCategory.id}
                    </span>
                  </div>
                )}
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                <div
                  className="absolute z-50 w-full mt-2 rounded-xl border-2 shadow-lg overflow-hidden animate-fadeIn"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div className="max-h-72 overflow-y-auto">
                    {categoriesLoading ? (
                      <div className="p-8 text-center">
                        <Loader2
                          className="w-8 h-8 animate-spin mx-auto"
                          style={{ color: theme.primary }}
                        />
                        <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
                          Loading categories...
                        </p>
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="p-8 text-center">
                        <AlertCircle
                          className="w-8 h-8 mx-auto mb-2"
                          style={{ color: theme.textSecondary }}
                        />
                        <p style={{ color: theme.textSecondary }}>No categories found</p>
                        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                          Try a different search term
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map((category, idx) => {
                        const isActive = selectedCategory?.id === category.destinationCategoryId;
                        return (
                          <button
                            key={category.destinationCategoryId}
                            className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                              isActive ? "active" : ""
                            }`}
                            style={{
                              backgroundColor: isActive ? hexToRgba(theme.primary, 0.08) : "transparent",
                              borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                              animation: `fadeInUp 0.25s ease-out ${idx * 0.03}s both`,
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                            onClick={() => handleSelectCategory(category)}
                          >
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                              style={{
                                background: isActive
                                  ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                                  : hexToRgba(theme.primary, 0.1),
                              }}
                            >
                              <Tag
                                size={14}
                                style={{ color: isActive ? "#fff" : theme.primary }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm" style={{ color: theme.text }}>
                                {highlightMatch(category.destinationCategoryName, searchTerm)}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                                {category.destinationCategoryDescription.length > 60
                                  ? `${category.destinationCategoryDescription.substring(0, 60)}...`
                                  : category.destinationCategoryDescription}
                              </div>
                            </div>
                            {isActive && (
                              <CheckCircle2
                                className="flex-shrink-0"
                                size={16}
                                style={{ color: theme.primary }}
                              />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <style jsx>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fadeIn {
                animation: fadeInUp 0.2s ease-out;
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }

  // Loading category data
  if (loadingCategory) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div
            className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: theme.primary }}
            />
            <span
              className="mt-4 text-lg font-medium"
              style={{ color: theme.text }}
            >
              Loading category details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error loading category
  if (errors.load) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div
            className="rounded-xl shadow-sm border p-16 text-center"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(
                  theme.error,
                  0.1,
                )}, ${hexToRgba(theme.error, 0.05)})`,
              }}
            >
              <AlertCircle
                className="w-12 h-12"
                style={{ color: theme.error }}
              />
            </div>
            <div
              className="text-2xl font-semibold mb-2"
              style={{ color: theme.text }}
            >
              {errors.load}
            </div>
            <button
              onClick={handleClearSelection}
              className="px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto mt-6"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: "#fff",
              }}
            >
              Go Back to Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <PageHeader
            title={`Update Category: ${formData.category}`}
            description="Edit destination category details"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selected Category Info Bar */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.1),
            border: `1px solid ${theme.primary}`,
          }}
        >
          <div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Currently Editing:
            </div>
            <div className="font-semibold" style={{ color: theme.primary }}>
              {selectedCategory?.name}
            </div>
          </div>
          <button
            onClick={handleClearSelection}
            className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
            style={{
              backgroundColor: theme.error,
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <X className="w-4 h-4" />
            Change Category
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
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
                    <FileText className="w-4 h-4" />
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
                  {/* Category Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor={`${uid}-category`}
                        className="text-sm font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        Category Name
                        <span style={{ color: theme.error }}> *</span>
                      </label>
                      <span
                        className="text-xs tabular-nums"
                        style={{
                          color:
                            categoryNameLength > CATEGORY_NAME_MAX * 0.9
                              ? theme.error
                              : theme.textSecondary,
                        }}
                      >
                        {categoryNameLength}/{CATEGORY_NAME_MAX}
                      </span>
                    </div>
                    <input
                      id={`${uid}-category`}
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Beaches, Mountains, Historical Sites"
                      maxLength={CATEGORY_NAME_MAX}
                      className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                      style={{
                        ...fieldBase,
                        borderColor: errors.category
                          ? theme.error
                          : theme.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = errors.category
                          ? theme.error
                          : theme.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${
                          errors.category ? theme.error : theme.primary
                        }18`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.category
                          ? theme.error
                          : theme.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {errors.category && (
                      <p
                        className="mt-1.5 text-xs flex items-center gap-1"
                        style={{ color: theme.error }}
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor={`${uid}-description`}
                        className="text-sm font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                        <span style={{ color: theme.error }}> *</span>
                      </label>
                    </div>
                    <textarea
                      id={`${uid}-description`}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Describe what makes this category special…"
                      maxLength={DESCRIPTION_MAX}
                      className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                      style={{
                        ...fieldBase,
                        borderColor: errors.description
                          ? theme.error
                          : theme.border,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = errors.description
                          ? theme.error
                          : theme.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${
                          errors.description ? theme.error : theme.primary
                        }18`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.description
                          ? theme.error
                          : theme.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />

                    <div className="mt-2 space-y-1">
                      <div
                        className="w-full h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: theme.border }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(descPct, 100)}%`,
                            backgroundColor: descColor,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        {errors.description ? (
                          <p
                            className="text-xs flex items-center gap-1"
                            style={{ color: theme.error }}
                          >
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            {errors.description}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span
                          className="text-xs tabular-nums ml-auto"
                          style={{ color: descColor }}
                        >
                          {descriptionLength}/{DESCRIPTION_MAX}
                        </span>
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

                    <select
                      ref={statusRef}
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="sr-only"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-3">
                      {STATUS_OPTIONS.map((opt) => {
                        const isSelected = formData.status === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleStatusClick(opt.value)}
                            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200"
                            style={{
                              backgroundColor: isSelected
                                ? `${opt.color}10`
                                : theme.background,
                              borderColor: isSelected
                                ? opt.color
                                : theme.border,
                              boxShadow: isSelected
                                ? `0 0 0 3px ${opt.color}18`
                                : "none",
                            }}
                          >
                            <span
                              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: isSelected
                                  ? `${opt.color}20`
                                  : `${theme.border}60`,
                              }}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor: isSelected
                                    ? opt.color
                                    : theme.textSecondary,
                                }}
                              />
                            </span>
                            <span className="min-w-0">
                              <span
                                className="block text-sm font-semibold leading-tight"
                                style={{
                                  color: isSelected ? opt.color : theme.text,
                                }}
                              >
                                {opt.label}
                              </span>
                              <span
                                className="block text-xs mt-0.5"
                                style={{ color: theme.textSecondary }}
                              >
                                {opt.description}
                              </span>
                            </span>
                            {isSelected && (
                              <CheckCircle2
                                className="w-4 h-4 ml-auto flex-shrink-0"
                                style={{ color: opt.color }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Images Section */}
              {existingImages.filter((img) => !img.isRemoved).length > 0 && (
                <div
                  className="rounded-2xl shadow-lg p-6"
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <h2
                    className="text-xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: theme.text }}
                  >
                    <ImageIcon
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                    Existing Images
                    <span
                      className="text-sm px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.1),
                        color: theme.primary,
                      }}
                    >
                      {existingImages.filter((img) => !img.isRemoved).length}
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {existingImages.map(
                      (image) =>
                        !image.isRemoved && (
                          <div
                            key={image.imageId}
                            className="flex flex-col gap-2 p-3 rounded-lg transition-all duration-200"
                            style={{
                              backgroundColor: hexToRgba(
                                theme.textSecondary,
                                0.05,
                              ),
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={image.imageUrl || PLACE_HOLDER_IMAGE}
                                alt={image.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={image.name}
                                  onChange={(e) =>
                                    updateExistingImageName(
                                      image.imageId,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2 py-1 rounded text-sm focus:outline-none"
                                  style={{
                                    backgroundColor: theme.background,
                                    color: theme.text,
                                    border: `1px solid ${theme.border}`,
                                  }}
                                  placeholder="Image name"
                                />
                                <input
                                  type="text"
                                  value={image.description}
                                  onChange={(e) =>
                                    updateExistingImageDescription(
                                      image.imageId,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2 py-1 rounded text-xs focus:outline-none"
                                  style={{
                                    backgroundColor: theme.background,
                                    color: theme.textSecondary,
                                    border: `1px solid ${theme.border}`,
                                  }}
                                  placeholder="Image description"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeExistingImage(image.imageId)
                                }
                                className="p-2 rounded-lg transition-all duration-200 hover:opacity-70"
                                style={{ color: theme.error }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Image Status */}
                            <div className="flex gap-2 ml-[72px]">
                              <button
                                type="button"
                                onClick={() =>
                                  updateExistingImageStatus(
                                    image.imageId,
                                    "ACTIVE",
                                  )
                                }
                                className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                                  image.status === "ACTIVE"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                              >
                                Active
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateExistingImageStatus(
                                    image.imageId,
                                    "INACTIVE",
                                  )
                                }
                                className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                                  image.status === "INACTIVE"
                                    ? "bg-gray-500 text-white"
                                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                              >
                                Inactive
                              </button>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}

              {/* Removed Images Section */}
              {existingImages.filter((img) => img.isRemoved).length > 0 && (
                <div
                  className="rounded-2xl shadow-lg p-6 opacity-75"
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.error}`,
                  }}
                >
                  <h2
                    className="text-xl font-semibold mb-4 flex items-center gap-2"
                    style={{ color: theme.error }}
                  >
                    <Trash2 className="w-5 h-5" />
                    Removed Images (Will be deleted on save)
                    <span
                      className="text-sm px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: hexToRgba(theme.error, 0.1),
                        color: theme.error,
                      }}
                    >
                      {existingImages.filter((img) => img.isRemoved).length}
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {existingImages.map(
                      (image) =>
                        image.isRemoved && (
                          <div
                            key={image.imageId}
                            className="flex items-center gap-3 p-3 rounded-lg opacity-60"
                            style={{
                              backgroundColor: hexToRgba(
                                theme.textSecondary,
                                0.05,
                              ),
                              border: `1px solid ${theme.border}`,
                            }}
                          >
                            <img
                              src={image.imageUrl || PLACE_HOLDER_IMAGE}
                              alt={image.name}
                              className="w-16 h-16 rounded-lg object-cover grayscale"
                            />
                            <div className="flex-1">
                              <div
                                className="font-medium line-through"
                                style={{ color: theme.textSecondary }}
                              >
                                {image.name}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Will be permanently deleted
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                restoreExistingImage(image.imageId)
                              }
                              className="p-2 rounded-lg transition-all duration-200 hover:opacity-70"
                              style={{ color: theme.primary }}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}

              {/* New Images Section */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: theme.primary }}
                  />
                  Add New Images
                  <span
                    className="text-sm px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    {newImages.length}/10
                  </span>
                </h2>

                {/* Image Upload Area */}
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-4"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: hexToRgba(theme.background, 0.5),
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.primary,
                      0.05,
                    );
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.background,
                      0.5,
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    const input = document.createElement("input");
                    input.files = e.dataTransfer.files;
                    handleImageUpload({ target: input } as any);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="new-image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="new-image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload
                      className="w-12 h-12"
                      style={{ color: theme.textSecondary }}
                    />
                    <span style={{ color: theme.textSecondary }}>
                      Click or drag images here to upload
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Maximum 10 images total, up to 5MB each
                    </span>
                  </label>
                </div>

                {/* New Images List */}
                {newImages.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto mt-4">
                    {newImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 p-3 rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: hexToRgba(theme.success, 0.05),
                          border: `1px solid ${theme.success}40`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              image.previewUrl ||
                              image.imageUrl ||
                              PLACE_HOLDER_IMAGE
                            }
                            alt={image.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={image.name}
                              onChange={(e) =>
                                updateNewImageName(index, e.target.value)
                              }
                              className="w-full px-2 py-1 rounded text-sm focus:outline-none"
                              style={{
                                backgroundColor: theme.background,
                                color: theme.text,
                                border: `1px solid ${
                                  errors[`new_image_${index}_name`]
                                    ? theme.error
                                    : theme.border
                                }`,
                              }}
                              placeholder="Image name *"
                            />
                            <input
                              type="text"
                              value={image.description}
                              onChange={(e) =>
                                updateNewImageDescription(index, e.target.value)
                              }
                              className="w-full px-2 py-1 rounded text-xs focus:outline-none"
                              style={{
                                backgroundColor: theme.background,
                                color: theme.textSecondary,
                                border: `1px solid ${theme.border}`,
                              }}
                              placeholder="Image description (optional)"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="p-2 rounded-lg transition-all duration-200 hover:opacity-70"
                            style={{ color: theme.error }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Move
                            className="w-4 h-4"
                            style={{ color: theme.textSecondary }}
                          />
                        </div>

                        {/* New Image Status */}
                        <div className="flex gap-2 ml-[72px]">
                          <button
                            type="button"
                            onClick={() =>
                              updateNewImageStatus(index, "ACTIVE")
                            }
                            className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                              image.status === "ACTIVE"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateNewImageStatus(index, "INACTIVE")
                            }
                            className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                              image.status === "INACTIVE"
                                ? "bg-gray-500 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                          >
                            Inactive
                          </button>
                        </div>

                        {errors[`new_image_${index}_name`] && (
                          <p
                            className="text-xs ml-[72px]"
                            style={{ color: theme.error }}
                          >
                            {errors[`new_image_${index}_name`]}
                          </p>
                        )}

                        {image.uploadProgress !== undefined &&
                          image.uploadProgress < 100 && (
                            <div
                              className="ml-[72px] w-full h-1 rounded-full overflow-hidden"
                              style={{
                                backgroundColor: hexToRgba(theme.primary, 0.2),
                              }}
                            >
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${image.uploadProgress}%`,
                                  backgroundColor: theme.primary,
                                }}
                              />
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview & Colors */}
            <div className="space-y-6">
              {/* Color Picker */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Palette
                    className="w-5 h-5"
                    style={{ color: theme.primary }}
                  />
                  Brand Colors
                </h2>

                <div className="space-y-4">
                  {/* Primary Color */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Primary Color *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          handleColorChange("color", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          handleColorChange("color", e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-lg focus:outline-none"
                        style={{
                          border: `1px solid ${errors.color ? theme.error : theme.border}`,
                          backgroundColor: theme.background,
                          color: theme.text,
                        }}
                      />
                    </div>
                    {errors.color && (
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.error }}
                      >
                        {errors.color}
                      </p>
                    )}
                  </div>

                  {/* Hover Color */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Hover Color *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={formData.hoverColor}
                        onChange={(e) =>
                          handleColorChange("hoverColor", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.hoverColor}
                        onChange={(e) =>
                          handleColorChange("hoverColor", e.target.value)
                        }
                        className="flex-1 px-3 py-2 rounded-lg focus:outline-none"
                        style={{
                          border: `1px solid ${errors.hoverColor ? theme.error : theme.border}`,
                          backgroundColor: theme.background,
                          color: theme.text,
                        }}
                      />
                    </div>
                    {errors.hoverColor && (
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.error }}
                      >
                        {errors.hoverColor}
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: theme.border }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: theme.textSecondary }}
                    >
                      Gradient Preview
                    </label>
                    <div
                      className="h-16 rounded-lg transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${formData.color}, ${formData.hoverColor})`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Preview */}
              <div
                className="rounded-2xl shadow-lg p-6 sticky top-24"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Eye className="w-5 h-5" style={{ color: theme.primary }} />
                  Live Preview
                </h2>

                <div
                  className="rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(
                      formData.color,
                      0.05,
                    )}, ${hexToRgba(formData.hoverColor, 0.05)})`,
                    border: `1px solid ${formData.color}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(
                          formData.color,
                          0.2,
                        )}, ${hexToRgba(formData.hoverColor, 0.1)})`,
                      }}
                    >
                      <Tag
                        className="w-5 h-5"
                        style={{ color: formData.color }}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: formData.color }}
                      >
                        {formData.category || "Category Name"}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <div
                          className="w-6 h-1.5 rounded-full"
                          style={{ backgroundColor: formData.color }}
                        />
                        <div
                          className="w-6 h-1.5 rounded-full"
                          style={{ backgroundColor: formData.hoverColor }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {formData.description ||
                      "Category description will appear here..."}
                  </p>
                  {(existingImages.filter((img) => !img.isRemoved).length > 0 ||
                    newImages.length > 0) && (
                    <div className="mt-3 flex gap-2">
                      {[
                        ...existingImages.filter((img) => !img.isRemoved),
                        ...newImages,
                      ]
                        .slice(0, 3)
                        .map((img, idx) => (
                          <img
                            key={idx}
                            src={img.imageUrl || PLACE_HOLDER_IMAGE}
                            alt={img.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ))}
                      {[
                        ...existingImages.filter((img) => !img.isRemoved),
                        ...newImages,
                      ].length > 3 && (
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: hexToRgba(
                              theme.textSecondary,
                              0.1,
                            ),
                            color: theme.textSecondary,
                          }}
                        >
                          +
                          {[
                            ...existingImages.filter((img) => !img.isRemoved),
                            ...newImages,
                          ].length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
              style={{
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hexToRgba(
                  theme.primary,
                  0.05,
                );
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${formData.color}, ${formData.hoverColor})`,
                color: "#fff",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Category
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              className="fixed bottom-4 right-4 rounded-lg shadow-lg p-4 flex items-center gap-2 animate-slide-up"
              style={{
                backgroundColor: theme.success,
                color: "#fff",
              }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div
              className="fixed bottom-4 right-4 rounded-lg shadow-lg p-4 flex items-center gap-2 animate-slide-up"
              style={{
                backgroundColor: theme.error,
                color: "#fff",
              }}
            >
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateDestinationCategoryPage;