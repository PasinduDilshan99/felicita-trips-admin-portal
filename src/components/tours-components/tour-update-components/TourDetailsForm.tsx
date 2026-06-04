"use client";

import React from "react";
import {
  TourAllDetails,
  UpdateTourType,
  UpdateTourCategory,
  TourDestinationInput,
  UpdateDestinationInput,
  TourImageInput,
  UpdateImageInput,
  InclusionInput,
  UpdateInclusionInput,
  ExclusionInput,
  UpdateExclusionInput,
  ConditionInput,
  UpdateConditionInput,
  TravelTipInput,
  UpdateTravelTipInput,
} from "@/types/tour-types";
import {
  TourType,
  TourCategory,
  DestinationCategory,
  ActivityCategory,
  SeasonType,
} from "@/types/common-types";
import { BasicInfoForm } from "./BasicInfoForm";
import { TourTypesAndCategoriesForm } from "./TourTypesAndCategoriesForm";
import { ImagesManagement } from "./ImagesManagement";
import { DayToDayItineraryForm } from "./DayToDayItineraryForm";
import { InclusionsExclusionsConditionsForm } from "./InclusionsExclusionsConditionsForm";
import { TravelTipsForm } from "./TravelTipsForm";

interface TourDetailsFormProps {
  tour: TourAllDetails;
  originalTour: TourAllDetails | null;
  removedTourTypes: number[];
  newTourTypes: number[];
  updatedTourTypes: UpdateTourType[];
  removedTourCategories: number[];
  newTourCategories: number[];
  updatedTourCategories: UpdateTourCategory[];
  removedImages: number[];
  newImages: TourImageInput[];
  updatedImages: UpdateImageInput[];
  addedDestinations: TourDestinationInput[];
  removedDestinations: number[];
  removedActivities: number[];
  updatedDestinations: UpdateDestinationInput[];
  addedInclusions: InclusionInput[];
  removedInclusions: number[];
  updatedInclusions: UpdateInclusionInput[];
  addedExclusions: ExclusionInput[];
  removedExclusions: number[];
  updatedExclusions: UpdateExclusionInput[];
  addedConditions: ConditionInput[];
  removedConditions: number[];
  updatedConditions: UpdateConditionInput[];
  addedTravelTips: TravelTipInput[];
  removedTravelTips: number[];
  updatedTravelTips: UpdateTravelTipInput[];
  availableTourTypes: TourType[];
  availableTourCategories: TourCategory[];
  availableDestinationCategories: DestinationCategory[];
  availableActivityCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  availableDestinations: any[];
  availableActivities: any[];
  onBasicFieldChange: (field: string, value: any) => void;
  onAddTourType: (typeId: number) => void;
  onRemoveTourType: (typeId: number) => void;
  onUpdateTourType: (
    typeId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddTourCategory: (categoryId: number) => void;
  onRemoveTourCategory: (categoryId: number) => void;
  onUpdateTourCategory: (
    categoryId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (
    file: File,
    name: string,
    description: string,
  ) => Promise<void>;
  onUpdateImage: (imageId: number, name: string, description: string) => void;
  onAddDestination: (
    destinationId: number,
    activityId: number,
    dayNumber: number,
  ) => void;
  onRemoveDestination: (tourDestinationId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onUpdateDestination: (
    tourDestinationId: number,
    dayNumber: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddActivityToDestination?: (
    destinationId: number,
    activityId: number,
  ) => void;
  onAddInclusion: (text: string, displayOrder: number) => void;
  onRemoveInclusion: (id: number) => void;
  onUpdateInclusion: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddExclusion: (text: string, displayOrder: number) => void;
  onRemoveExclusion: (id: number) => void;
  onUpdateExclusion: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddCondition: (text: string, displayOrder: number) => void;
  onRemoveCondition: (id: number) => void;
  onUpdateCondition: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddTravelTip: (
    title: string,
    description: string,
    displayOrder: number,
  ) => void;
  onRemoveTravelTip: (id: number) => void;
  onUpdateTravelTip: (
    id: number,
    title: string,
    description: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  uploadingImages: boolean;
}

const TourDetailsForm: React.FC<TourDetailsFormProps> = ({
  tour,
  originalTour,
  removedTourTypes,
  newTourTypes,
  updatedTourTypes,
  removedTourCategories,
  newTourCategories,
  updatedTourCategories,
  removedImages,
  newImages,
  updatedImages,
  addedDestinations,
  removedDestinations,
  removedActivities,
  updatedDestinations,
  addedInclusions,
  removedInclusions,
  updatedInclusions,
  addedExclusions,
  removedExclusions,
  updatedExclusions,
  addedConditions,
  removedConditions,
  updatedConditions,
  addedTravelTips,
  removedTravelTips,
  updatedTravelTips,
  availableTourTypes,
  availableTourCategories,
  availableDestinationCategories,
  availableActivityCategories,
  availableSeasons,
  availableDestinations,
  availableActivities,
  onBasicFieldChange,
  onAddTourType,
  onRemoveTourType,
  onUpdateTourType,
  onAddTourCategory,
  onRemoveTourCategory,
  onUpdateTourCategory,
  onRemoveImage,
  onAddNewImage,
  onUpdateImage,
  onAddDestination,
  onRemoveDestination,
  onRemoveActivity,
  onUpdateDestination,
  onAddActivityToDestination,
  onAddInclusion,
  onRemoveInclusion,
  onUpdateInclusion,
  onAddExclusion,
  onRemoveExclusion,
  onUpdateExclusion,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  onAddTravelTip,
  onRemoveTravelTip,
  onUpdateTravelTip,
  uploadingImages,
}) => {
  const hasChanged = (field: string): boolean => {
    if (!originalTour) return false;
    return (
      originalTour[field as keyof TourAllDetails] !==
      tour[field as keyof TourAllDetails]
    );
  };

  return (
    <div className="space-y-8">
      <BasicInfoForm
        tour={tour}
        hasChanged={hasChanged}
        onFieldChange={onBasicFieldChange}
        availableSeasons={availableSeasons}
      />

      <TourTypesAndCategoriesForm
        tourTypes={tour.tourTypeDtos}
        tourCategories={tour.tourCategoryDto}
        removedTourTypes={removedTourTypes}
        newTourTypes={newTourTypes}
        updatedTourTypes={updatedTourTypes}
        removedTourCategories={removedTourCategories}
        newTourCategories={newTourCategories}
        updatedTourCategories={updatedTourCategories}
        availableTourTypes={availableTourTypes}
        availableTourCategories={availableTourCategories}
        onAddTourType={onAddTourType}
        onRemoveTourType={onRemoveTourType}
        onUpdateTourType={onUpdateTourType}
        onAddTourCategory={onAddTourCategory}
        onRemoveTourCategory={onRemoveTourCategory}
        onUpdateTourCategory={onUpdateTourCategory}
      />

      <ImagesManagement
        images={tour.images}
        removedImages={removedImages}
        newImages={newImages}
        updatedImages={updatedImages}
        uploadingImages={uploadingImages}
        onRemoveImage={onRemoveImage}
        onAddNewImage={onAddNewImage}
        onUpdateImage={onUpdateImage}
      />

      <DayToDayItineraryForm
        dayToDayResponses={tour.dayToDayResponses}
        addedDestinations={addedDestinations}
        removedDestinations={removedDestinations}
        removedActivities={removedActivities}
        updatedDestinations={updatedDestinations}
        availableDestinations={availableDestinations}
        availableActivities={availableActivities}
        availableDestinationCategories={availableDestinationCategories}
        availableActivityCategories={availableActivityCategories}
        onAddDestination={onAddDestination}
        onRemoveDestination={onRemoveDestination}
        onRemoveActivity={onRemoveActivity}
        onUpdateDestination={onUpdateDestination}
        onAddActivityToDestination={onAddActivityToDestination}
      />

      <InclusionsExclusionsConditionsForm
        inclusions={tour.inclusions}
        exclusions={tour.exclusions}
        conditions={tour.conditions}
        addedInclusions={addedInclusions}
        removedInclusions={removedInclusions}
        updatedInclusions={updatedInclusions}
        addedExclusions={addedExclusions}
        removedExclusions={removedExclusions}
        updatedExclusions={updatedExclusions}
        addedConditions={addedConditions}
        removedConditions={removedConditions}
        updatedConditions={updatedConditions}
        onAddInclusion={onAddInclusion}
        onRemoveInclusion={onRemoveInclusion}
        onUpdateInclusion={onUpdateInclusion}
        onAddExclusion={onAddExclusion}
        onRemoveExclusion={onRemoveExclusion}
        onUpdateExclusion={onUpdateExclusion}
        onAddCondition={onAddCondition}
        onRemoveCondition={onRemoveCondition}
        onUpdateCondition={onUpdateCondition}
      />

      <TravelTipsForm
        travelTips={tour.travelTips}
        addedTravelTips={addedTravelTips}
        removedTravelTips={removedTravelTips}
        updatedTravelTips={updatedTravelTips}
        onAddTravelTip={onAddTravelTip}
        onRemoveTravelTip={onRemoveTravelTip}
        onUpdateTravelTip={onUpdateTravelTip}
      />
    </div>
  );
};

export default TourDetailsForm;
