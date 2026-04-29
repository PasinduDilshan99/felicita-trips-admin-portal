// Updated AddNewDestinationPage.tsx - Key modifications
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { ToastNotification, ToastType } from "@/components/common-components/ToastNotification";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { OtherService } from "@/services/otherService";
import {
  AddDestinationRequest,
  DestinationImageRequest,
} from "@/types/destination-types";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader } from "lucide-react";

// Import components
import { CategorySelector } from "@/components/destinations-components/add-destination-components/CategorySelector";
import { LocationForm } from "@/components/destinations-components/add-destination-components/LocationForm";
import { PricingForm } from "@/components/destinations-components/add-destination-components/PricingForm";
import { ImageUploader } from "@/components/destinations-components/add-destination-components/ImageUploader";
import { FormActions } from "@/components/destinations-components/add-destination-components/FormActions";
import { FormSummary } from "@/components/destinations-components/add-destination-components/FormSummary";
import { DestinationInfoForm } from "@/components/destinations-components/add-destination-components/DestinationInfoForm";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  destinationId?: number;
}

const AddNewDestinationPage = () => {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Add New",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddDestinationRequest>({
    name: "",
    description: "",
    status: "ACTIVE",
    destinationCategoriesIdList: [],
    location: "",
    latitude: 0,
    longitude: 0,
    extraPrice: undefined,
    extraPriceNote: "",
    images: [],
  });

  // Image preview state
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File; uploading?: boolean; uploadError?: string }[]
  >([]);
  const [newImage, setNewImage] = useState<DestinationImageRequest>({
    name: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
    destinationId: undefined,
  });
  const [lastCreatedDestinationId, setLastCreatedDestinationId] = useState<number | null>(null);

  // Get destination categories from context
  const destinationCategories = categories?.destinationCategoryList || [];

  // Helper functions
  const getCategoryName = (categoryId: number): string => {
    const category = destinationCategories.find(
      (cat) => cat.destinationCategoryId === categoryId,
    );
    return category
      ? category.destinationCategoryName
      : `Category ${categoryId}`;
  };

  const getCategoryColor = (categoryId: number): string => {
    const category = destinationCategories.find(
      (cat) => cat.destinationCategoryId === categoryId,
    );
    return category?.destinationCategoryColor || theme.primary;
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude" || name === "extraPrice") {
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      let newSelectedIds: number[];
      if (prev.includes(categoryId)) {
        newSelectedIds = prev.filter((id) => id !== categoryId);
      } else {
        newSelectedIds = [...prev, categoryId];
      }
      setFormData({
        ...formData,
        destinationCategoriesIdList: newSelectedIds,
      });
      if (errors.destinationCategoriesIdList) {
        setErrors({ ...errors, destinationCategoriesIdList: "" });
      }
      return newSelectedIds;
    });
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

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: `File ${file.name} exceeds 5MB limit`,
        }));
        continue;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: `File ${file.name} is not an image`,
        }));
        continue;
      }

      const tempPreview = {
        url: URL.createObjectURL(file),
        file: file,
        uploading: true,
      };
      setImagePreviews((prev) => [...prev, tempPreview]);

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(file);
        setImagePreviews((prev) =>
          prev.map((preview) =>
            preview.file === file
              ? { ...preview, url: cloudinaryUrl, uploading: false }
              : preview,
          ),
        );

        const newImageData: DestinationImageRequest = {
          name: file.name.split(".")[0],
          description: `Uploaded image: ${file.name}`,
          imageUrl: cloudinaryUrl,
          status: "ACTIVE",
        };

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImageData],
        }));
        if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
      } catch (error: any) {
        setImagePreviews((prev) =>
          prev.filter((preview) => preview.file !== file),
        );
        setErrors((prev) => ({
          ...prev,
          image: `Failed to upload ${file.name}: ${error.message}`,
        }));
      }
    }

    setUploadingImages(false);
  };

  // Handle manual image addition
  const handleAddImage = () => {
    if (!newImage.name.trim() || !newImage.imageUrl.trim()) {
      setErrors((prev) => ({
        ...prev,
        image: "Image name and URL are required",
      }));
      return;
    }
    try {
      new URL(newImage.imageUrl);
    } catch {
      setErrors((prev) => ({ ...prev, image: "Please enter a valid URL" }));
      return;
    }

    setImagePreviews((prev) => [
      ...prev,
      { url: newImage.imageUrl, uploading: false },
    ]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { ...newImage }],
    }));
    setNewImage({ name: "", description: "", imageUrl: "", status: "ACTIVE" });
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    if (previewToRemove?.url && previewToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle new image field changes
  const handleNewImageChange = (field: string, value: string) => {
    setNewImage((prev) => ({ ...prev, [field]: value }));
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
          }));
          setLoading(false);
          if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
        },
        (error) => {
          setLoading(false);
          let errorMessage = "Unable to get current location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please enter coordinates manually.";
          }
          setErrors((prev) => ({ ...prev, location: errorMessage }));
        },
      );
    } else {
      setErrors((prev) => ({
        ...prev,
        location: "Geolocation is not supported by your browser.",
      }));
    }
  };

  // Validate form - MODIFIED: images and extra price are NOT required
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Destination name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.destinationCategoriesIdList.length === 0)
      newErrors.destinationCategoriesIdList =
        "At least one category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.latitude < -90 || formData.latitude > 90)
      newErrors.latitude = "Latitude must be between -90 and 90";
    if (formData.longitude < -180 || formData.longitude > 180)
      newErrors.longitude = "Longitude must be between -180 and 180";
    // REMOVED: images validation - now optional
    // REMOVED: extra price validation - now optional

    const hasUploadingImages = imagePreviews.some(
      (preview) => preview.uploading,
    );
    if (hasUploadingImages)
      newErrors.images = "Please wait for all images to finish uploading";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - MODIFIED: shows toast notification instead of inline success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    try {
      const preparedImages = formData.images.map((image) => {
        // Skip URL validation if no image URL (optional images)
        if (image.imageUrl && !image.imageUrl.startsWith("http") && !image.imageUrl.startsWith("https")) {
          throw new Error(
            `Invalid image URL for "${image.name}". Please use HTTP/HTTPS URLs.`,
          );
        }
        return {
          ...image,
          name: image.name?.trim() || "",
          description: image.description?.trim() || "",
          status: image.status as "ACTIVE" | "INACTIVE",
        };
      });

      const submissionData: AddDestinationRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        destinationCategoriesIdList: formData.destinationCategoriesIdList,
        location: formData.location.trim(),
        latitude: parseFloat(formData.latitude.toFixed(6)),
        longitude: parseFloat(formData.longitude.toFixed(6)),
        extraPrice: formData.extraPrice
          ? parseFloat(formData.extraPrice.toFixed(2))
          : undefined,
        extraPriceNote: formData.extraPriceNote?.trim() || undefined,
        images: preparedImages,
      };

      const response = await DestinationService.addDestination(submissionData);

      if (response.code === 200) {
        // Store the created destination ID for navigation
        // const destinationId = response.data?.destinationId || response.data?.id;
        const destinationId = 1;
        setLastCreatedDestinationId(destinationId);
        
        // Show success toast
        setToast({
          show: true,
          type: "success",
          title: "Destination Created Successfully!",
          message: `${formData.name} has been added to your destinations.`,
          destinationId: destinationId,
        });
        
        // Reset form
        handleReset();
      } else {
        throw new Error(response.message || "Failed to add destination");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      // Show error toast
      setToast({
        show: true,
        type: "error",
        title: "Submission Failed",
        message: error.message || "Failed to add destination. Please try again.",
        destinationId: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
      destinationCategoriesIdList: [],
      location: "",
      latitude: 0,
      longitude: 0,
      extraPrice: undefined,
      extraPriceNote: "",
      images: [],
    });
    setSelectedCategoryIds([]);
    setImagePreviews([]);
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Get destination detail link
  const getDestinationLink = (): string => {
    if (toast.destinationId) {
      return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${toast.destinationId}`;
    }
    return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`;
  };

  if (categoriesLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <Loader
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: theme.primary }}
          />
          <p style={{ color: theme.textSecondary }}>Loading categories...</p>
        </div>
      </div>
    );
  }

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
          actionLink={toast.type === "success" ? getDestinationLink() : undefined}
          actionText="View Destination"
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
            title="Add New Destination"
            description="Create a new travel destination with all details"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <DestinationInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <CategorySelector
                categories={destinationCategories}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={handleCategoryChange}
                error={errors.destinationCategoriesIdList}
              />

              <LocationForm
                formData={formData}
                errors={errors}
                loading={loading}
                onInputChange={handleInputChange}
                onGetCurrentLocation={handleGetCurrentLocation}
              />

              <PricingForm
                formData={formData}
                onInputChange={handleInputChange}
              />

              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={() => {}}
                onReset={handleReset}
                errors={errors}
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <ImageUploader
              images={formData.images}
              imagePreviews={imagePreviews}
              newImage={newImage}
              uploadingImages={uploadingImages}
              errors={errors}
              onNewImageChange={handleNewImageChange}
              onAddImage={handleAddImage}
              onFileUpload={handleFileUpload}
              onRemoveImage={handleRemoveImage}
            />

            <FormSummary
              formData={formData}
              categories={destinationCategories}
              getCategoryName={getCategoryName}
              getCategoryColor={getCategoryColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewDestinationPage;