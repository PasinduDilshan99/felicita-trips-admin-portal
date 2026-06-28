"use client";

import React, { useState } from "react";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import { FormActions } from "@/components/common-components/FormActions";
import { ImageUploader } from "@/components/common-components/ImageUploader";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { SeasonService } from "@/services/seasonService";
import {
  AddSeasonRequest,
  SeasonImageInsertRequest,
} from "@/types/season-types";
import { ToastState } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { SEASON_CREATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { SeasonBasicInfo } from "@/components/season-components/create-season-components/SeasonBasicInfo";
import { SeasonSettings } from "@/components/season-components/create-season-components/SeasonSettings";
import { ActivityTourSelector } from "@/components/season-components/create-season-components/ActivityTourSelector";
import { CREATE_SEASON_TIPS } from "@/data/tips-data";

const AddNewSeasonPage = () => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<AddSeasonRequest>({
    name: "",
    standardName: "",
    localName: "",
    startMonth: 1,
    endMonth: 12,
    monsoonType: "",
    weatherSummary: "",
    temperatureMin: 0,
    temperatureMax: 0,
    rainfallPattern: "",
    isPeak: false,
    displayOrder: 0,
    description: "",
    status: "ACTIVE",
    imageInsertRequests: [],
    insertActivitiesIds: [],
    insertTourIds: [],
  });
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File; uploading?: boolean; uploadError?: string }[]
  >([]);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (
      name === "temperatureMin" ||
      name === "temperatureMax" ||
      name === "displayOrder" ||
      name === "startMonth" ||
      name === "endMonth"
    ) {
      processedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  const handlePeakChange = (checked: boolean) => {
    setFormData({ ...formData, isPeak: checked });
  };

  const handleActivityChange = (activityIds: number[]) => {
    setFormData({ ...formData, insertActivitiesIds: activityIds });
    if (errors.insertActivitiesIds)
      setErrors({ ...errors, insertActivitiesIds: "" });
  };

  const handleTourChange = (tourIds: number[]) => {
    setFormData({ ...formData, insertTourIds: tourIds });
    if (errors.insertTourIds) setErrors({ ...errors, insertTourIds: "" });
  };

  // Image handling
  const handleImagePreviewsChange = (previews: typeof imagePreviews) => {
    setImagePreviews(previews);
  };

  const handleImagesChange = (images: SeasonImageInsertRequest[]) => {
    setFormData({ ...formData, imageInsertRequests: images });
  };

  const handleUploadingImagesChange = (uploading: boolean) => {
    setUploadingImages(uploading);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Season name is required";
    if (!formData.standardName.trim())
      newErrors.standardName = "Standard name is required";
    if (!formData.startMonth) newErrors.startMonth = "Start month is required";
    if (!formData.endMonth) newErrors.endMonth = "End month is required";
    if (formData.startMonth > formData.endMonth) {
      newErrors.endMonth = "End month must be after start month";
    }
    if (!formData.monsoonType)
      newErrors.monsoonType = "Monsoon type is required";
    if (!formData.weatherSummary.trim())
      newErrors.weatherSummary = "Weather summary is required";
    if (!formData.temperatureMin)
      newErrors.temperatureMin = "Minimum temperature is required";
    if (!formData.temperatureMax)
      newErrors.temperatureMax = "Maximum temperature is required";
    if (!formData.rainfallPattern.trim())
      newErrors.rainfallPattern = "Rainfall pattern is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.insertActivitiesIds.length === 0)
      newErrors.insertActivitiesIds = "At least one activity is required";
    if (formData.insertTourIds.length === 0)
      newErrors.insertTourIds = "At least one tour is required";

    const hasUploadingImages = imagePreviews.some(
      (preview) => preview.uploading,
    );
    if (hasUploadingImages)
      newErrors.images = "Please wait for all images to finish uploading";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit season
  const submitSeason = async () => {
    setLoading(true);
    try {
      const response = await SeasonService.addSeason(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Season Created Successfully!",
          message: `${formData.name} has been added.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add season");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleConfirmCreate = async () => {
    await submitSeason();
  };

  const handleReset = () => {
    imagePreviews.forEach((preview) => {
      if (preview.url && preview.url.startsWith("blob:"))
        URL.revokeObjectURL(preview.url);
    });
    setFormData({
      name: "",
      standardName: "",
      localName: "",
      startMonth: 1,
      endMonth: 12,
      monsoonType: "",
      weatherSummary: "",
      temperatureMin: 0,
      temperatureMax: 0,
      rainfallPattern: "",
      isPeak: false,
      displayOrder: 0,
      description: "",
      status: "ACTIVE",
      imageInsertRequests: [],
      insertActivitiesIds: [],
      insertTourIds: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Season"
            description="Create a new season for tours and activities"
            breadcrumbItems={SEASON_CREATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <SeasonBasicInfo
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
            <SeasonSettings
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onStatusChange={handleStatusChange}
              onPeakChange={handlePeakChange}
            />
            <ActivityTourSelector
              selectedActivityIds={formData.insertActivitiesIds}
              selectedTourIds={formData.insertTourIds}
              onActivityChange={handleActivityChange}
              onTourChange={handleTourChange}
              errors={{
                activities: errors.insertActivitiesIds,
                tours: errors.insertTourIds,
              }}
            />
            <FormActions
              loading={loading}
              uploadingImages={uploadingImages}
              onSubmit={handleCreateClick}
              onReset={handleReset}
              errors={errors}
              submitText="Season"
              submitButtonType="button"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <ImageUploader<SeasonImageInsertRequest>
              images={formData.imageInsertRequests}
              imagePreviews={imagePreviews}
              onImagePreviewsChange={handleImagePreviewsChange}
              onImagesChange={handleImagesChange}
              onUploadingChange={handleUploadingImagesChange}
              errors={errors}
              showColorPicker={false}
              title="Season Images"
              description="Upload images representing this season"
            />
          </div>
        </div>
      </div>

      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Season",
          message: "Are you sure you want to create this season?",
          itemName: formData.name || "Untitled Season",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: CREATE_SEASON_TIPS,
        }}
        confirmText="Create Season"
        cancelText="Cancel"
        onError={(error) => {
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message || "Failed to create season. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewSeasonPage;
