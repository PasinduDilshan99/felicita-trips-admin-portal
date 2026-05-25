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
import { TourService } from "@/services/tourService";
import {
  AddTourRequest,
  TourDestinationInput,
  InclusionInput,
  ExclusionInput,
  ConditionInput,
  TravelTipInput,
  TourDays,
} from "@/types/tour-types";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader } from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { FormSummary } from "@/components/common-components/FormSummary";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { PricingForm } from "@/components/common-components/PricingForm";
import { CategorySelector } from "@/components/common-components/CategorySelector";
import { adaptTourCategories, adaptTourTypes } from "@/utils/category-adapters";

// Import tour-specific components
import { TourLocationForm } from "@/components/tours-components/tour-create-components/TourLocationForm";
import { TourDestinationsForm } from "@/components/tours-components/tour-create-components/TourDestinationsForm";
import { InclusionsExclusionsForm } from "@/components/tours-components/tour-create-components/InclusionsExclusionsForm";
import { ConditionsTipsForm } from "@/components/tours-components/tour-create-components/ConditionsTipsForm";
import { AssignToSelector } from "@/components/tours-components/tour-create-components/AssignToSelector";
import { TourInfoForm } from "@/components/tours-components/tour-create-components/TourInfoForm";
import { SeasonSelector } from "@/components/common-components/SeasonSelector";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  tourId?: number;
}

const AddNewTourPage = () => {
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
      label: "Tours",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tours`,
    },
    {
      label: "Add New Tour",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tours/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddTourRequest>({
    name: "",
    description: "",
    duration: 0,
    latitude: 0,
    longitude: 0,
    startLocation: "",
    endLocation: "",
    season: 0,
    status: "ACTIVE",
    assignTo: 0,
    assignMessage: "",
    tourTypes: [],
    tourCategories: [],
    itinerary: [] as TourDays[],
    images: [],
    inclusions: [],
    exclusions: [],
    conditions: [],
    travelTips: [],
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
    tourId: undefined,
  });

  // Get categories from context
  const tourCategoriesList = categories?.tourCategoryList || [];
  const tourTypesList = categories?.tourTypeList || [];

  // Normalized categories for selector
  const normalizedTourCategories = adaptTourCategories(tourCategoriesList);
  const normalizedTourTypes = adaptTourTypes(tourTypesList);

  // Convert selected IDs to the format expected by CategorySelector
  const selectedTourCategoryItems = formData.tourCategories.map((id) => ({
    id,
  }));
  const selectedTourTypeItems = formData.tourTypes.map((id) => ({ id }));

  // Helper functions for summary
  const getCategoryName = (categoryId: number): string => {
    const category = tourCategoriesList.find(
      (cat) => cat.tourCategoryId === categoryId,
    );
    return category ? category.tourCategoryName : `Category ${categoryId}`;
  };

  const getTourTypeName = (typeId: number): string => {
    const type = tourTypesList.find((t) => t.tourTypeId === typeId);
    return type ? type.tourTypeName : `Type ${typeId}`;
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
      name === "duration" ||
      name === "latitude" ||
      name === "longitude" ||
      name === "season" ||
      name === "assignTo"
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

  // Handle status change
  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  // Handle season change
  const handleSeasonChange = (seasonId: number) => {
    setFormData({ ...formData, season: seasonId });
    if (errors.season) {
      setErrors({ ...errors, season: "" });
    }
  };

  // Handle assign to change
  const handleAssignToChange = (assignToId: number) => {
    setFormData({ ...formData, assignTo: assignToId });
    if (errors.assignTo) {
      setErrors({ ...errors, assignTo: "" });
    }
  };

  // Handle tour categories change
  const handleTourCategoriesAdd = (categoryId: number) => {
    setFormData({
      ...formData,
      tourCategories: [...formData.tourCategories, categoryId],
    });
    if (errors.tourCategories) {
      setErrors({ ...errors, tourCategories: "" });
    }
  };

  const handleTourCategoriesRemove = (categoryId: number) => {
    setFormData({
      ...formData,
      tourCategories: formData.tourCategories.filter((id) => id !== categoryId),
    });
  };

  // Handle tour types change
  const handleTourTypesAdd = (typeId: number) => {
    setFormData({
      ...formData,
      tourTypes: [...formData.tourTypes, typeId],
    });
    if (errors.tourTypes) {
      setErrors({ ...errors, tourTypes: "" });
    }
  };

  const handleTourTypesRemove = (typeId: number) => {
    setFormData({
      ...formData,
      tourTypes: formData.tourTypes.filter((id) => id !== typeId),
    });
  };

  // Handle destinations change
  const handleItineraryChange = (itinerary: TourDays[]) => {
    setFormData({ ...formData, itinerary });
    if (errors.itinerary) {
      setErrors({ ...errors, itinerary: "" });
    }
  };

  // Handle inclusions change
  const handleInclusionsChange = (inclusions: InclusionInput[]) => {
    setFormData({ ...formData, inclusions });
  };

  // Handle exclusions change
  const handleExclusionsChange = (exclusions: ExclusionInput[]) => {
    setFormData({ ...formData, exclusions });
  };

  // Handle conditions change
  const handleConditionsChange = (conditions: ConditionInput[]) => {
    setFormData({ ...formData, conditions });
  };

  // Handle travel tips change
  const handleTravelTipsChange = (travelTips: TravelTipInput[]) => {
    setFormData({ ...formData, travelTips });
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

    if (!formData.name.trim()) {
      newErrors.name = "Tour name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Valid duration is required";
    }
    if (!formData.startLocation.trim()) {
      newErrors.startLocation = "Start location is required";
    }
    if (!formData.endLocation.trim()) {
      newErrors.endLocation = "End location is required";
    }
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }
    if (!formData.season) {
      newErrors.season = "Please select a season";
    }
    if (!formData.assignTo) {
      newErrors.assignTo = "Please select an assignee";
    }
    if (formData.tourCategories.length === 0) {
      newErrors.tourCategories = "At least one tour category is required";
    }
    if (formData.tourTypes.length === 0) {
      newErrors.tourTypes = "At least one tour type is required";
    }
    if (formData.itinerary.length === 0) {
      newErrors.destinations = "At least one destination is required";
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
  const submitTour = async () => {
    setLoading(true);

    try {
      const submissionData: AddTourRequest = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        startLocation: formData.startLocation.trim(),
        endLocation: formData.endLocation.trim(),
        assignMessage: formData.assignMessage.trim(),
        duration: parseInt(formData.duration.toString()),
        latitude: parseFloat(formData.latitude.toFixed(6)),
        longitude: parseFloat(formData.longitude.toFixed(6)),
      };

      console.log("=================submissionData===================");
      console.log(submissionData);
      console.log("====================================");
      const response = await TourService.addTour(submissionData);

      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Tour Created Successfully!",
          message: `${formData.name} has been added to your tours.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add tour");
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
    await submitTour();
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
      duration: 0,
      latitude: 0,
      longitude: 0,
      startLocation: "",
      endLocation: "",
      season: 0,
      status: "ACTIVE",
      assignTo: 0,
      assignMessage: "",
      tourTypes: [],
      tourCategories: [],
      itinerary: [],
      images: [],
      inclusions: [],
      exclusions: [],
      conditions: [],
      travelTips: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Get tour detail link
  const getTourLink = (): string => {
    if (toast.tourId) {
      return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tours/${toast.tourId}`;
    }
    return `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tours`;
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
          actionLink={toast.type === "success" ? getTourLink() : undefined}
          actionText="View Tour"
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
            title="Add New Tour"
            description="Create a new tour package with all details"
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
              <TourInfoForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onStatusChange={handleStatusChange}
              />

              <TourLocationForm
                formData={formData}
                errors={errors}
                loading={loading}
                onInputChange={handleInputChange}
              />

              <FormCard>
                <SeasonSelector
                  value={formData.season}
                  onChange={handleSeasonChange}
                  error={errors.season}
                  required
                />
              </FormCard>

              <FormCard>
                <AssignToSelector
                  value={formData.assignTo}
                  onChange={handleAssignToChange}
                  assignMessage={formData.assignMessage}
                  onAssignMessageChange={(message) => {
                    setFormData({ ...formData, assignMessage: message });
                  }}
                  error={errors.assignTo}
                  required
                />
              </FormCard>

              <CategorySelector
                categories={normalizedTourCategories}
                selectedItems={selectedTourCategoryItems}
                onCategoryAdd={handleTourCategoriesAdd}
                onCategoryRemove={handleTourCategoriesRemove}
                mode="simple"
                title="Tour Categories"
                description="Select categories for your tour"
                error={errors.tourCategories}
                showDescriptions
              />

              <CategorySelector
                categories={normalizedTourTypes}
                selectedItems={selectedTourTypeItems}
                onCategoryAdd={handleTourTypesAdd}
                onCategoryRemove={handleTourTypesRemove}
                mode="simple"
                title="Tour Types"
                description="Select types for your tour"
                error={errors.tourTypes}
                showDescriptions
              />

              <TourDestinationsForm
                days={formData.itinerary}
                onDaysChange={handleItineraryChange}
                error={errors.itinerary}
              />

              <PricingForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                mode="tour"
                title="Tour Pricing"
                description="Set pricing for the tour"
              />

              <InclusionsExclusionsForm
                inclusions={formData.inclusions}
                exclusions={formData.exclusions}
                onInclusionsChange={handleInclusionsChange}
                onExclusionsChange={handleExclusionsChange}
              />

              <ConditionsTipsForm
                conditions={formData.conditions}
                travelTips={formData.travelTips}
                onConditionsChange={handleConditionsChange}
                onTravelTipsChange={handleTravelTipsChange}
              />

              <FormActions
                loading={loading}
                uploadingImages={uploadingImages}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Tour"
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
              title="Tour Summary"
              sections={[
                {
                  label: "Tour Name",
                  value: formData.name || "Not set",
                  icon: "eye",
                  color: theme.primary,
                },
                {
                  label: "Duration",
                  value: formData.duration
                    ? `${formData.duration} days`
                    : "Not set",
                  icon: "clock",
                  color: theme.warning,
                },
                {
                  label: "Tour Categories",
                  value:
                    formData.tourCategories.length > 0
                      ? formData.tourCategories
                          .map((id) => getCategoryName(id))
                          .join(", ")
                      : "Not set",
                  icon: "tag",
                  color: theme.success,
                },
                {
                  label: "Tour Types",
                  value:
                    formData.tourTypes.length > 0
                      ? formData.tourTypes
                          .map((id) => getTourTypeName(id))
                          .join(", ")
                      : "Not set",
                  icon: "tag",
                  color: theme.accent,
                },
                {
                  label: "Start Location",
                  value: formData.startLocation || "Not set",
                  icon: "map",
                  color: theme.accent,
                },
                {
                  label: "End Location",
                  value: formData.endLocation || "Not set",
                  icon: "map",
                  color: theme.accent,
                },
                {
                  label: "Destinations",
                  value:
                    formData.itinerary.length > 0
                      ? `${formData.itinerary.length} destination(s)`
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
                "Add detailed itinerary for better customer experience",
                "Include all inclusions and exclusions clearly",
                "Set accurate pricing and duration",
                "Add high-quality images to showcase the tour",
                "Provide travel tips for better preparation",
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
          title: "Create New Tour",
          message: "Are you sure you want to create this tour package?",
          itemName: formData.name || "Untitled Tour",
          type: "create",
          estimatedTime: "~3-4 seconds",
          tips: [
            "Make sure all images are uploaded successfully",
            "Double-check the itinerary and destinations",
            "Verify inclusions and exclusions are accurate",
            "Review pricing and duration details",
            "You can edit this tour anytime after creation",
          ],
        }}
        confirmText="Create Tour"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Tour created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create tour:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create tour. Please try again.",
            tourId: undefined,
          });
        }}
      />
    </div>
  );
};

export default AddNewTourPage;
