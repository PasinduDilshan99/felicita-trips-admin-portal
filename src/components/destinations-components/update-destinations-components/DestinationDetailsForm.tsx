// components/destinations-components/DestinationDetailsForm.tsx
import React from "react";
import {
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
} from "@/types/destination-types";
import { DestinationCategory, ActivityCategory, SeasonType } from "@/types/common-types";
import { CategorySelector } from "./CategorySelector";
import { ImagesManagement } from "./ImagesManagement";
import { ActivitiesManagement } from "./ActivitiesManagement";
import { BasicInfoForm } from "./BasicInfoForm";

interface DestinationDetailsFormProps {
  destination: SingleDestinationResponse;
  originalDestination: SingleDestinationResponse | null;
  removedImages: number[];
  removedActivities: number[];
  newImages: NewImageRequest[];
  newActivities: NewActivityRequest[];
  currentCategoryIds: number[];
  originalCategoryIds: number[];
  availableCategories: DestinationCategory[];
  availableActivityCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  onFieldChange: (field: string, value: any) => void;
  onCategoryChange: (categoryId: number) => void;
  onRemoveImage: (imageId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onAddNewImage: (file: File, name: string, description: string) => Promise<void>;
  onAddNewActivity: (activity: NewActivityRequest) => void;
  onUpdateActivity: (activity: Activity) => void;
  onUpdateImage: (image: Image) => void;
  uploadingImages: boolean;
}

const DestinationDetailsForm: React.FC<DestinationDetailsFormProps> = ({
  destination,
  originalDestination,
  removedImages,
  removedActivities,
  newImages,
  newActivities,
  currentCategoryIds,
  originalCategoryIds,
  availableCategories,
  availableActivityCategories,
  availableSeasons,
  onFieldChange,
  onCategoryChange,
  onRemoveImage,
  onRemoveActivity,
  onAddNewImage,
  onAddNewActivity,
  onUpdateActivity,
  uploadingImages,
}) => {
  // Helper to check if a field has changed
  const hasChanged = (field: string): boolean => {
    if (!originalDestination) return false;
    return (
      originalDestination[field as keyof SingleDestinationResponse] !==
      destination[field as keyof SingleDestinationResponse]
    );
  };

  return (
    <div className="space-y-8">
      <BasicInfoForm
        destination={destination}
        hasChanged={hasChanged}
        onFieldChange={onFieldChange}
      />

      <CategorySelector
        currentCategoryIds={currentCategoryIds}
        originalCategoryIds={originalCategoryIds}
        availableCategories={availableCategories}
        onCategoryChange={onCategoryChange}
      />

      <ImagesManagement
        images={destination.images}
        removedImages={removedImages}
        newImages={newImages}
        uploadingImages={uploadingImages}
        onRemoveImage={onRemoveImage}
        onAddNewImage={onAddNewImage}
      />

      <ActivitiesManagement
        activities={destination.activities}
        removedActivities={removedActivities}
        newActivities={newActivities}
        availableActivityCategories={availableActivityCategories}
        availableSeasons={availableSeasons}
        onRemoveActivity={onRemoveActivity}
        onAddNewActivity={onAddNewActivity}
        onUpdateActivity={onUpdateActivity}
      />
    </div>
  );
};

export default DestinationDetailsForm;