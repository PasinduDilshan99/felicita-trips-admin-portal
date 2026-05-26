import React from "react";
import {
  SingleDestinationResponse,
  Activity,
  Image,
  NewActivityRequest,
  NewImageRequest,
} from "@/types/destination-types";
import { DestinationCategory, ActivityCategory, SeasonType } from "@/types/common-types";
import { CategorySelector } from "@/components/common-components/CategorySelector";
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
  const hasChanged = (field: string): boolean => {
    if (!originalDestination) return false;
    return (
      originalDestination[field as keyof SingleDestinationResponse] !==
      destination[field as keyof SingleDestinationResponse]
    );
  };

  // Transform available categories to the format expected by Common CategorySelector
  const transformedCategories = availableCategories.map((cat) => ({
    id: cat.destinationCategoryId,
    name: cat.destinationCategoryName,
    color: cat.destinationCategoryColor || undefined,
    description: cat.destinationCategoryDescription || undefined,
  }));

  // Transform selected category IDs to the format expected by Common CategorySelector
  const selectedCategoryItems = currentCategoryIds.map((id) => ({
    id,
    isPrimary: false, // Simple mode doesn't use isPrimary
  }));

  // Handle category add/remove
  const handleCategoryAdd = (categoryId: number) => {
    onCategoryChange(categoryId);
  };

  const handleCategoryRemove = (categoryId: number) => {
    onCategoryChange(categoryId);
  };

  // Get category changes for display (optional - can be used to show modification status)
  const hasCategoryChanges = () => {
    const removed = originalCategoryIds.filter(id => !currentCategoryIds.includes(id));
    const added = currentCategoryIds.filter(id => !originalCategoryIds.includes(id));
    return removed.length > 0 || added.length > 0;
  };

  return (
    <div className="space-y-8">
      <BasicInfoForm
        destination={destination}
        hasChanged={hasChanged}
        onFieldChange={onFieldChange}
      />

      {/* Use Common CategorySelector */}
      <CategorySelector
        categories={transformedCategories}
        selectedItems={selectedCategoryItems}
        onCategoryAdd={handleCategoryAdd}
        onCategoryRemove={handleCategoryRemove}
        mode="simple"
        title="Categories"
        description="Select categories for this destination"
        showDescriptions={true}
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