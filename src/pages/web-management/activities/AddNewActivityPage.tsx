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
import { ActivityService } from "@/services/activityService";
import {
  AddActivityRequest,
  ActivityCategory,
  ActivityRequirementRequest,
} from "@/types/activity-types";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader } from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { DestinationSelector } from "@/components/common-components/DestinationSelector";
import { ActivityInfoForm } from "@/components/activities-components/activity-create-components/ActivityInfoForm";
import { ParticipationForm } from "@/components/activities-components/activity-create-components/ParticipationForm";
import { RequirementsForm } from "@/components/activities-components/activity-create-components/RequirementsForm";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { ScheduleForm } from "@/components/activities-components/activity-create-components/ScheduleForm";
import { CategorySelector } from "@/components/common-components/CategorySelector";
import { adaptActivityCategories } from "@/utils/category-adapters";
import { PricingForm } from "@/components/common-components/PricingForm";
import { SeasonSelector } from "@/components/common-components/SeasonSelector";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  activityId?: number;
}

const AddNewActivityPage = () => {
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
      label: "Activities",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activities`,
    },
    {
      label: "Add New Activity",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activities/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddActivityRequest>({
    destinationId: 0,
    name: "",
    description: "",
    categories: [],
    durationHours: 0,
    availableFrom: "",
    availableTo: "",
    priceLocal: 0,
    priceForeigners: 0,
    minParticipate: 1,
    maxParticipate: 20,
    seasonId: 0,
    status: "ACTIVE",
    images: [],
    requirements: [],
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
    activityId: undefined,
  });

  // Get destination categories for activity categories
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

    let processedValue: any = value;
    if (
      name === "durationHours" ||
      name === "priceLocal" ||
      name === "priceForeigners" ||
      name === "minParticipate" ||
      name === "maxParticipate"
    ) {
      processedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle destination change
  const handleDestinationChange = (destinationId: number) => {
    setFormData({ ...formData, destinationId });
    if (errors.destinationId) {
      setErrors({ ...errors, destinationId: "" });
    }
  };

  const normalizedCategories = adaptActivityCategories(
    categories?.activityCategoryList || [],
  );

  // Convert selected categories to the expected format
  const selectedItems = formData.categories.map((cat) => ({
    id: cat.categoryId,
    isPrimary: cat.isPrimary,
    status: cat.status,
  }));

  // Handle status change
  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  // Handle season change
  const handleSeasonChange = (seasonId: number) => {
    setFormData({ ...formData, seasonId });
    if (errors.seasonId) {
      setErrors({ ...errors, seasonId: "" });
    }
  };

  // Handle category changes
  const handleCategoryChange = (categoryId: number, isPrimary: boolean) => {
    const existingIndex = formData.categories.findIndex(
      (c) => c.categoryId === categoryId,
    );

    let newCategories: ActivityCategory[];

    if (existingIndex >= 0) {
      newCategories = formData.categories.map((cat, index) => {
        if (index === existingIndex) {
          return { ...cat, isPrimary };
        }
        if (isPrimary && cat.isPrimary) {
          return { ...cat, isPrimary: false };
        }
        return cat;
      });
    } else {
      let shouldBePrimary = isPrimary;
      let updatedCategories = [...formData.categories];

      if (isPrimary) {
        updatedCategories = updatedCategories.map((cat) => ({
          ...cat,
          isPrimary: false,
        }));
      } else if (updatedCategories.length === 0) {
        shouldBePrimary = true;
      }

      newCategories = [
        ...updatedCategories,
        {
          categoryId,
          isPrimary: shouldBePrimary,
          status: "ACTIVE" as const,
        },
      ];
    }

    setFormData({ ...formData, categories: newCategories });
    if (errors.categories) {
      setErrors({ ...errors, categories: "" });
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (c) => c.categoryId !== categoryId,
      ),
    });
  };

  // Handle requirements change
  const handleRequirementsChange = (
    requirements: ActivityRequirementRequest[],
  ) => {
    setFormData({ ...formData, requirements });
  };

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: any[]) => {
    setFormData({ ...formData, images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.destinationId) {
      newErrors.destinationId = "Please select a destination";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Activity name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }
    if (formData.categories.filter((c) => c.isPrimary).length !== 1) {
      newErrors.categories = "Exactly one primary category must be selected";
    }
    if (!formData.durationHours || formData.durationHours <= 0) {
      newErrors.durationHours = "Valid duration is required";
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = "Available from date is required";
    }
    if (!formData.availableTo) {
      newErrors.availableTo = "Available to date is required";
    }
    if (
      formData.availableFrom &&
      formData.availableTo &&
      new Date(formData.availableFrom) > new Date(formData.availableTo)
    ) {
      newErrors.availableTo = "Available to date must be after from date";
    }
    if (!formData.priceLocal || formData.priceLocal < 0) {
      newErrors.priceLocal = "Valid local price is required";
    }
    if (!formData.priceForeigners || formData.priceForeigners < 0) {
      newErrors.priceForeigners = "Valid foreigner price is required";
    }
    if (!formData.minParticipate || formData.minParticipate < 1) {
      newErrors.minParticipate = "Minimum participants must be at least 1";
    }
    if (
      !formData.maxParticipate ||
      formData.maxParticipate < formData.minParticipate
    ) {
      newErrors.maxParticipate = "Maximum must be greater than minimum";
    }
    if (!formData.seasonId) {
      newErrors.seasonId = "Please select a season";
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

  // Actual submission logic
  const submitActivity = async () => {
    setLoading(true);

    try {
      const submissionData: AddActivityRequest = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        durationHours: parseFloat(formData.durationHours.toFixed(1)),
        priceLocal: parseFloat(formData.priceLocal.toFixed(2)),
        priceForeigners: parseFloat(formData.priceForeigners.toFixed(2)),
        minParticipate: parseInt(formData.minParticipate.toString()),
        maxParticipate: parseInt(formData.maxParticipate.toString()),
      };

      const response = await ActivityService.addActivity(submissionData);

      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Activity Created Successfully!",
          message: `${formData.name} has been added to your activities.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add activity");
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
    await submitActivity();
  };

  // Reset form
  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:")) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setFormData({
      destinationId: 0,
      name: "",
      description: "",
      categories: [],
      durationHours: 0,
      availableFrom: "",
      availableTo: "",
      priceLocal: 0,
      priceForeigners: 0,
      minParticipate: 1,
      maxParticipate: 20,
      seasonId: 0,
      status: "ACTIVE",
      images: [],
      requirements: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Get activity detail link
  const getActivityLink = (): string => {
    if (toast.activityId) {
      return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activities/${toast.activityId}`;
    }
    return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activities`;
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
          actionLink={toast.type === "success" ? getActivityLink() : undefined}
          actionText="View Activity"
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
            title="Add New Activity"
            description="Create a new activity with all details"
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
              <FormCard>
                <DestinationSelector
                  value={formData.destinationId}
                  onChange={handleDestinationChange}
                  error={errors.destinationId}
                  required
                />
              </FormCard>

              <ActivityInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
              />

              <CategorySelector
                categories={normalizedCategories}
                selectedItems={selectedItems}
                onCategoryAdd={(categoryId) => {
                  const hasPrimary = formData.categories.some(
                    (c) => c.isPrimary,
                  );
                  const newCategory = {
                    categoryId,
                    isPrimary: !hasPrimary,
                    status: "ACTIVE" as const,
                  };
                  setFormData({
                    ...formData,
                    categories: [...formData.categories, newCategory],
                  });
                }}
                onCategoryRemove={(categoryId) => {
                  setFormData({
                    ...formData,
                    categories: formData.categories.filter(
                      (c) => c.categoryId !== categoryId,
                    ),
                  });
                }}
                onSetPrimary={(categoryId) => {
                  setFormData({
                    ...formData,
                    categories: formData.categories.map((cat) => ({
                      ...cat,
                      isPrimary: cat.categoryId === categoryId,
                    })),
                  });
                }}
                mode="primary-secondary"
                title="Activity Categories"
                description="Select activity categories and set one as primary"
                error={errors.categories}
                showDescriptions
              />

              <ScheduleForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <PricingForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                mode="activity"
                title="Activity Pricing"
                description="Set pricing for local and foreign participants"
              />

              <ParticipationForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <FormCard>
                <SeasonSelector
                  value={formData.seasonId}
                  onChange={handleSeasonChange}
                  error={errors.seasonId}
                  required
                />
              </FormCard>

              <RequirementsForm
                requirements={formData.requirements}
                onRequirementsChange={handleRequirementsChange}
              />

              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitButtonType="button"
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
              title="Activity Summary"
              sections={[
                {
                  label: "Activity",
                  value: formData.name || "Not set",
                  icon: "activity",
                  color: theme.primary,
                },
                {
                  label: "Destination",
                  value: formData.destinationId
                    ? `ID: ${formData.destinationId}`
                    : "Not set",
                  icon: "map",
                  color: theme.accent,
                },
                {
                  label: "Categories",
                  value:
                    formData.categories.length > 0
                      ? formData.categories
                          .map((c) => getCategoryName(c.categoryId))
                          .join(", ")
                      : "Not set",
                  icon: "tag",
                  color: theme.success,
                },
                {
                  label: "Duration",
                  value: formData.durationHours
                    ? `${formData.durationHours} hours`
                    : "Not set",
                  icon: "clock",
                  color: theme.warning,
                },
                {
                  label: "Pricing",
                  value:
                    formData.priceLocal && formData.priceForeigners
                      ? `Local: $${formData.priceLocal} | Foreign: $${formData.priceForeigners}`
                      : "Not set",
                  icon: "dollar",
                  color: theme.success,
                },
                {
                  label: "Participants",
                  value:
                    formData.minParticipate && formData.maxParticipate
                      ? `${formData.minParticipate} - ${formData.maxParticipate}`
                      : "Not set",
                  icon: "users",
                  color: theme.error,
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
                {
                  label: "Requirements",
                  value:
                    formData.requirements.length > 0
                      ? `${formData.requirements.length} requirement(s)`
                      : "No requirements",
                  icon: "clipboard",
                  color: theme.warning,
                },
              ]}
              tips={[
                "Set accurate pricing for local and foreign participants",
                "Define clear participation limits for better planning",
                "Select the appropriate season for availability",
                "Add images to showcase the activity",
                "Include any special requirements participants should know",
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
          title: "Create New Activity",
          message: "Are you sure you want to create this activity?",
          itemName: formData.name || "Untitled Activity",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Double-check pricing for local and foreign participants",
            "Verify the season and availability dates",
            "You can edit this activity anytime after creation",
          ],
        }}
        confirmText="Create Activity"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Activity created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create activity:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create activity. Please try again.",
            activityId: undefined,
          });
        }}
      />
    </div>
  );
};

export default AddNewActivityPage;
