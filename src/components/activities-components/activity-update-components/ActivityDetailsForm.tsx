"use client";

import React from "react";
import { Activity } from "@/types/activity-types";
import {
  AddCategoryRequest,
  ActivityImageRequest,
  ActivityRequirementRequest,
  UpdateImageRequest,
  UpdateRequirementRequest,
} from "@/types/activity-types";
import { ActivityCategory, SeasonType } from "@/types/common-types";
import { BasicInfoForm } from "./BasicInfoForm";
import { CategoriesManagement } from "./CategoriesManagement";
import { ImagesManagement } from "./ImagesManagement";
import { RequirementsManagement } from "./RequirementsManagement";

interface ActivityDetailsFormProps {
  activity: Activity;
  originalActivity: Activity | null;
  removedImages: number[];
  removedCategories: number[];
  removedRequirements: number[];
  newImages: ActivityImageRequest[];
  newCategories: AddCategoryRequest[];
  newRequirements: ActivityRequirementRequest[];
  availableCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  onFieldChange: (field: string, value: any) => void;
  onCategoryPrimaryChange: (categoryId: number, isPrimary: boolean) => void;
  onRemoveCategory: (categoryId: number) => void;
  onAddNewCategory: (categoryId: number, isPrimary: boolean) => void;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (
    file: File,
    name: string,
    description: string,
  ) => Promise<void>;
  onUpdateImage: (image: UpdateImageRequest) => void;
  onRemoveRequirement: (requirementId: number) => void;
  onAddNewRequirement: (requirement: ActivityRequirementRequest) => void;
  onUpdateRequirement: (requirement: UpdateRequirementRequest) => void;
  uploadingImages: boolean;
}

const ActivityDetailsForm: React.FC<ActivityDetailsFormProps> = ({
  activity,
  originalActivity,
  removedImages,
  removedCategories,
  removedRequirements,
  newImages,
  newCategories,
  newRequirements,
  availableCategories,
  availableSeasons,
  onFieldChange,
  onCategoryPrimaryChange,
  onRemoveCategory,
  onAddNewCategory,
  onRemoveImage,
  onAddNewImage,
  onUpdateImage,
  onRemoveRequirement,
  onAddNewRequirement,
  onUpdateRequirement,
  uploadingImages,
}) => {
  const hasChanged = (field: string): boolean => {
    if (!originalActivity) return false;
    return (
      originalActivity[field as keyof Activity] !==
      activity[field as keyof Activity]
    );
  };

  const getOriginalCategoryIds = (): number[] => {
    if (!originalActivity) return [];
    return originalActivity.activities_category.map((cat) => cat.id);
  };

  const getCurrentCategoryIds = (): number[] => {
    return activity.activities_category.map((cat) => cat.id);
  };

  return (
    <div className="space-y-8">
      <BasicInfoForm
        activity={activity}
        hasChanged={hasChanged}
        onFieldChange={onFieldChange}
        availableSeasons={availableSeasons}
      />

      <CategoriesManagement
        categories={activity.activities_category}
        originalCategoryIds={getOriginalCategoryIds()}
        currentCategoryIds={getCurrentCategoryIds()}
        removedCategories={removedCategories}
        newCategories={newCategories}
        availableCategories={availableCategories}
        onCategoryPrimaryChange={onCategoryPrimaryChange}
        onRemoveCategory={onRemoveCategory}
        onAddNewCategory={onAddNewCategory}
      />

      <ImagesManagement
        images={activity.images}
        removedImages={removedImages}
        newImages={newImages}
        uploadingImages={uploadingImages}
        onRemoveImage={onRemoveImage}
        onAddNewImage={onAddNewImage}
        onUpdateImage={onUpdateImage}
      />

      <RequirementsManagement
        requirements={activity.requirements}
        removedRequirements={removedRequirements}
        newRequirements={newRequirements}
        onRemoveRequirement={onRemoveRequirement}
        onAddNewRequirement={onAddNewRequirement}
        onUpdateRequirement={onUpdateRequirement}
      />
    </div>
  );
};

export default ActivityDetailsForm;
