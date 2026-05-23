// components/packages-components/update-package-components/PackageDetailsForm.tsx
"use client";

import React from "react";
import {
  PackageAllDetails,
  PackageImageRequest,
  UpdateImageRequest,
  AddFeatureRequest,
  UpdateFeatureRequest,
  AddDayAccommodationRequest,
  UpdateDayAccommodationRequest,
  Inclusion,
  UpdateInclusionRequest,
  Exclusion,
  UpdateExclusionRequest,
  Condition,
  UpdateConditionRequest,
  TravelTipRequest,
  UpdateTravelTipRequest,
} from "@/types/package-types";
import { PackageCategory } from "@/types/common-types";
import { TourNameId } from "@/types/tour-types";
import { BasicInfoForm } from "./BasicInfoForm";
import { ImagesManagement } from "./ImagesManagement";
import { FeaturesManagement } from "./FeaturesManagement";
import { DayAccommodationsForm } from "./DayAccommodationsForm";
import { InclusionsExclusionsConditionsForm } from "./InclusionsExclusionsConditionsForm";
import { TravelTipsForm } from "./TravelTipsForm";

interface PackageDetailsFormProps {
  packageData: PackageAllDetails;
  originalPackage: PackageAllDetails | null;
  removedImages: number[];
  newImages: PackageImageRequest[];
  updatedImages: UpdateImageRequest[];
  addedFeatures: AddFeatureRequest[];
  removedFeatures: number[];
  updatedFeatures: UpdateFeatureRequest[];
  addedDayAccommodations: AddDayAccommodationRequest[];
  removedDayAccommodations: number[];
  updatedDayAccommodations: UpdateDayAccommodationRequest[];
  addedInclusions: Inclusion[];
  removedInclusions: number[];
  updatedInclusions: UpdateInclusionRequest[];
  addedExclusions: Exclusion[];
  removedExclusions: number[];
  updatedExclusions: UpdateExclusionRequest[];
  addedConditions: Condition[];
  removedConditions: number[];
  updatedConditions: UpdateConditionRequest[];
  addedTravelTips: TravelTipRequest[];
  removedTravelTips: number[];
  updatedTravelTips: UpdateTravelTipRequest[];
  availablePackageTypes: PackageCategory[];
  availableTours: TourNameId[];
  onBasicFieldChange: (field: string, value: any) => void;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (file: File, name: string, description: string, color: string) => Promise<void>;
  onUpdateImage: (imageId: number, name: string, description: string, color: string) => void;
  onAddFeature: (feature: AddFeatureRequest) => void;
  onRemoveFeature: (featureId: number) => void;
  onUpdateFeature: (feature: UpdateFeatureRequest) => void;
  onAddDayAccommodation: (accommodation: AddDayAccommodationRequest) => void;
  onRemoveDayAccommodation: (accommodationId: number) => void;
  onUpdateDayAccommodation: (accommodation: UpdateDayAccommodationRequest) => void;
  onAddInclusion: (text: string, displayOrder: number) => void;
  onRemoveInclusion: (id: number) => void;
  onUpdateInclusion: (id: number, text: string, displayOrder: number, status: "ACTIVE" | "INACTIVE") => void;
  onAddExclusion: (text: string, displayOrder: number) => void;
  onRemoveExclusion: (id: number) => void;
  onUpdateExclusion: (id: number, text: string, displayOrder: number, status: "ACTIVE" | "INACTIVE") => void;
  onAddCondition: (text: string, displayOrder: number) => void;
  onRemoveCondition: (id: number) => void;
  onUpdateCondition: (id: number, text: string, displayOrder: number, status: "ACTIVE" | "INACTIVE") => void;
  onAddTravelTip: (title: string, description: string, displayOrder: number) => void;
  onRemoveTravelTip: (id: number) => void;
  onUpdateTravelTip: (id: number, title: string, description: string, displayOrder: number, status: "ACTIVE" | "INACTIVE") => void;
  uploadingImages: boolean;
}

const PackageDetailsForm: React.FC<PackageDetailsFormProps> = ({
  packageData,
  originalPackage,
  removedImages,
  newImages,
  updatedImages,
  addedFeatures,
  removedFeatures,
  updatedFeatures,
  addedDayAccommodations,
  removedDayAccommodations,
  updatedDayAccommodations,
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
  availablePackageTypes,
  availableTours,
  onBasicFieldChange,
  onRemoveImage,
  onAddNewImage,
  onUpdateImage,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  onAddDayAccommodation,
  onRemoveDayAccommodation,
  onUpdateDayAccommodation,
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
    if (!originalPackage) return false;
    return originalPackage[field as keyof PackageAllDetails] !== packageData[field as keyof PackageAllDetails];
  };

  return (
    <div className="space-y-8">
      <BasicInfoForm
        packageData={packageData}
        hasChanged={hasChanged}
        onFieldChange={onBasicFieldChange}
        availablePackageTypes={availablePackageTypes}
        availableTours={availableTours}
      />

      <ImagesManagement
        images={packageData.packageImages}
        removedImages={removedImages}
        newImages={newImages}
        updatedImages={updatedImages}
        uploadingImages={uploadingImages}
        onRemoveImage={onRemoveImage}
        onAddNewImage={onAddNewImage}
        onUpdateImage={onUpdateImage}
      />

      <FeaturesManagement
        features={packageData.packageFeatures}
        addedFeatures={addedFeatures}
        removedFeatures={removedFeatures}
        updatedFeatures={updatedFeatures}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
        onUpdateFeature={onUpdateFeature}
      />

      <DayAccommodationsForm
        dayAccommodations={packageData.dayAccommodationResponses?.packageDayByDayDtoList || []}
        addedDayAccommodations={addedDayAccommodations}
        removedDayAccommodations={removedDayAccommodations}
        updatedDayAccommodations={updatedDayAccommodations}
        onAddDayAccommodation={onAddDayAccommodation}
        onRemoveDayAccommodation={onRemoveDayAccommodation}
        onUpdateDayAccommodation={onUpdateDayAccommodation}
      />

      <InclusionsExclusionsConditionsForm
        inclusions={packageData.inclusions}
        exclusions={packageData.exclusions}
        conditions={packageData.conditions}
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
        travelTips={packageData.travelTips}
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

export default PackageDetailsForm;