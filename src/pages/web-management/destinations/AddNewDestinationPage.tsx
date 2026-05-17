"use client";

import React, { useState, useEffect } from "react";
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
import { DestinationService } from "@/services/destinationService";
import { OtherService } from "@/services/otherService";
import {
  AddDestinationRequest,
  DestinationImageRequest,
} from "@/types/destination-types";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader } from "lucide-react";

// Import common components
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { DestinationInfoForm } from "@/components/destinations-components/add-destination-components/DestinationInfoForm";
import { LocationForm } from "@/components/destinations-components/add-destination-components/LocationForm";
import { CategorySelector } from "@/components/common-components/CategorySelector";
import { adaptDestinationCategories } from "@/utils/category-adapters";
import { PricingForm } from "@/components/common-components/PricingForm";

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

  const destinationCategories = categories?.destinationCategoryList || [];

  const normalizedCategories = adaptDestinationCategories(
    destinationCategories,
  );
  const selectedItems = selectedCategoryIds.map((id) => ({ id }));

  // Get destination categories from context

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

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: DestinationImageRequest[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Destination name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    // if (formData.destinationCategoriesIdList.length === 0)
    //   newErrors.destinationCategoriesIdList =
    //     "At least one category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.latitude < -90 || formData.latitude > 90)
      newErrors.latitude = "Latitude must be between -90 and 90";
    if (formData.longitude < -180 || formData.longitude > 180)
      newErrors.longitude = "Longitude must be between -180 and 180";

    const hasUploadingImages = imagePreviews.some(
      (preview) => preview.uploading,
    );
    if (hasUploadingImages)
      newErrors.images = "Please wait for all images to finish uploading";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
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
        if (
          image.imageUrl &&
          !image.imageUrl.startsWith("http") &&
          !image.imageUrl.startsWith("https")
        ) {
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
        setToast({
          show: true,
          type: "success",
          title: "Destination Created Successfully!",
          message: `${formData.name} has been added to your destinations.`,
        });

        handleReset();
      } else {
        throw new Error(response.message || "Failed to add destination");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setToast({
        show: true,
        type: "error",
        title: "Submission Failed",
        message:
          error.message || "Failed to add destination. Please try again.",
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
          actionLink={
            toast.type === "success" ? getDestinationLink() : undefined
          }
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
                categories={normalizedCategories}
                selectedItems={selectedItems}
                onCategoryAdd={(categoryId) => {
                  setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
                }}
                onCategoryRemove={(categoryId) => {
                  setSelectedCategoryIds(
                    selectedCategoryIds.filter((id) => id !== categoryId),
                  );
                }}
                mode="simple"
                title="Destination Categories"
                description="Select categories for your destination"
                error={errors.destinationCategoriesIdList}
                showDescriptions
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
                errors={errors}
                onInputChange={handleInputChange}
                mode="destination"
                title="Pricing Information"
                description="Optional pricing details for customers"
              />

              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={() => {}}
                onReset={handleReset}
                errors={errors}
                submitText="Destination"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <ImageUploader
              images={formData.images}
              imagePreviews={imagePreviews}
              onImagePreviewsChange={handleImagePreviewsChange}
              onImagesChange={handleImagesChange}
              onUploadingChange={handleUploadingImagesChange}
              errors={errors}
            />

            <FormSummary
              title="Destination Summary"
              sections={[
                {
                  label: "Destination",
                  value: formData.name || "Not set",
                  icon: "eye",
                  color: theme.primary,
                },
                {
                  label: "Categories",
                  value:
                    formData.destinationCategoriesIdList?.length > 0
                      ? formData.destinationCategoriesIdList
                          .map((id) => getCategoryName(id))
                          .join(", ")
                      : "Not set",
                  icon: "tag",
                  color: theme.success,
                },
                {
                  label: "Location",
                  value: formData.location || "Not set",
                  icon: "map",
                  color: theme.accent,
                },
                {
                  label: "Coordinates",
                  value:
                    formData.latitude && formData.longitude
                      ? `${formData.latitude.toFixed(4)}°, ${formData.longitude.toFixed(4)}°`
                      : "Not set",
                  icon: "map",
                  color: theme.warning,
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
                  label: "Extra Price",
                  value: formData.extraPrice
                    ? `$${formData.extraPrice.toFixed(2)}`
                    : "No extra price",
                  icon: "dollar",
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
                "Images are automatically uploaded to Cloudinary for optimal performance",
                "Use descriptive names and detailed descriptions (max 1000 characters)",
                "Add high-quality images (max 5MB each) for better presentation",
                "You can select multiple categories for better discoverability",
                "Verify coordinates for accurate location mapping",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewDestinationPage;
