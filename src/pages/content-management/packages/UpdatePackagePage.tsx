"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageService } from "@/services/packageService";
import { TourService } from "@/services/tourService";
import { OtherService } from "@/services/otherService";
import {
  PackageNameId,
  PackageAllDetails,
  UpdatePackageRequest,
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
import { TourNameId } from "@/types/tour-types";
import { Search, Edit, Save, RefreshCw, Loader2 } from "lucide-react";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { PACKAGES_PAGE_URL } from "@/utils/urls";
import PackageDetailsForm from "@/components/packages-components/package-update-components/PackageDetailsForm";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PACKAGE_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const UpdatePackagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialPackageName = searchParams?.get("package-name") || "";
  const initialPackageId = searchParams?.get("package-id") || "";

  // State for packages list
  const [packages, setPackages] = useState<PackageNameId[]>([]);

  // State for tours list (for dropdown)
  const [tours, setTours] = useState<TourNameId[]>([]);
  const [loadingTours, setLoadingTours] = useState(false);

  // State for selected package
  const [selectedPackage, setSelectedPackage] = useState<PackageNameId | null>(
    initialPackageId && initialPackageName
      ? {
          packageId: parseInt(initialPackageId),
          packageName: initialPackageName,
        }
      : null,
  );

  // State for original package details
  const [originalPackage, setOriginalPackage] =
    useState<PackageAllDetails | null>(null);

  // State for edited package
  const [editedPackage, setEditedPackage] = useState<PackageAllDetails | null>(
    null,
  );

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for images changes
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<PackageImageRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<UpdateImageRequest[]>([]);

  // State for features changes
  const [addedFeatures, setAddedFeatures] = useState<AddFeatureRequest[]>([]);
  const [removedFeatures, setRemovedFeatures] = useState<number[]>([]);
  const [updatedFeatures, setUpdatedFeatures] = useState<
    UpdateFeatureRequest[]
  >([]);

  // State for day accommodations changes
  const [addedDayAccommodations, setAddedDayAccommodations] = useState<
    AddDayAccommodationRequest[]
  >([]);
  const [removedDayAccommodations, setRemovedDayAccommodations] = useState<
    number[]
  >([]);
  const [updatedDayAccommodations, setUpdatedDayAccommodations] = useState<
    UpdateDayAccommodationRequest[]
  >([]);

  // State for inclusions changes
  const [addedInclusions, setAddedInclusions] = useState<Inclusion[]>([]);
  const [removedInclusions, setRemovedInclusions] = useState<number[]>([]);
  const [updatedInclusions, setUpdatedInclusions] = useState<
    UpdateInclusionRequest[]
  >([]);

  // State for exclusions changes
  const [addedExclusions, setAddedExclusions] = useState<Exclusion[]>([]);
  const [removedExclusions, setRemovedExclusions] = useState<number[]>([]);
  const [updatedExclusions, setUpdatedExclusions] = useState<
    UpdateExclusionRequest[]
  >([]);

  // State for conditions changes
  const [addedConditions, setAddedConditions] = useState<Condition[]>([]);
  const [removedConditions, setRemovedConditions] = useState<number[]>([]);
  const [updatedConditions, setUpdatedConditions] = useState<
    UpdateConditionRequest[]
  >([]);

  // State for travel tips changes
  const [addedTravelTips, setAddedTravelTips] = useState<TravelTipRequest[]>(
    [],
  );
  const [removedTravelTips, setRemovedTravelTips] = useState<number[]>([]);
  const [updatedTravelTips, setUpdatedTravelTips] = useState<
    UpdateTravelTipRequest[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Fetch packages list on initial load
  useEffect(() => {
    if (!selectedPackage) {
      fetchPackages();
    }
  }, []);

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, []);

  // If initialPackageId is provided, fetch details
  useEffect(() => {
    if (initialPackageId && !originalPackage) {
      handleSelectPackage(parseInt(initialPackageId), initialPackageName);
    }
  }, [initialPackageId, initialPackageName]);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageService.getAllPackageNames();
      setPackages(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load packages");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load packages",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    setLoadingTours(true);
    try {
      const response = await TourService.getAllTourNames();
      setTours(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoadingTours(false);
    }
  };

  const handleSelectPackage = async (id: number, name: string) => {
    setSelectedPackage({ packageId: id, packageName: name });
    await fetchPackageDetails(id);
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

  const handleAddNewImage = async (
    imageFile: File,
    imageName: string,
    imageDescription: string,
    color: string,
  ) => {
    setUploadingImages(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile);

      const newImage: PackageImageRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
        color: color,
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedPackage) {
        const tempImage = {
          imageId: Date.now(),
          imageName: imageName,
          imageDescription: imageDescription,
          imageUrl: cloudinaryUrl,
          color: color,
        };
        setEditedPackage({
          ...editedPackage,
          packageImages: [...editedPackage.packageImages, tempImage],
        });
      }
    } catch (error: any) {
      setError(error.message || "Failed to upload image");
      setToast({
        type: "error",
        title: "Upload Failed",
        message: error.message || "Failed to upload image",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const fetchPackageDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalPackage(null);
    setEditedPackage(null);

    // Reset all change states
    setBasicDetailsChanged(false);
    setRemovedImages([]);
    setNewImages([]);
    setUpdatedImages([]);
    setAddedFeatures([]);
    setRemovedFeatures([]);
    setUpdatedFeatures([]);
    setAddedDayAccommodations([]);
    setRemovedDayAccommodations([]);
    setUpdatedDayAccommodations([]);
    setAddedInclusions([]);
    setRemovedInclusions([]);
    setUpdatedInclusions([]);
    setAddedExclusions([]);
    setRemovedExclusions([]);
    setUpdatedExclusions([]);
    setAddedConditions([]);
    setRemovedConditions([]);
    setUpdatedConditions([]);
    setAddedTravelTips([]);
    setRemovedTravelTips([]);
    setUpdatedTravelTips([]);

    try {
      const response = await PackageService.getPackageAllDetails(id);
      const packageData = response.data;
      setOriginalPackage(packageData);
      setEditedPackage(packageData);
    } catch (err: any) {
      setError(err.message || "Failed to load package details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load package details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedPackage) return;
    setBasicDetailsChanged(true);
    setEditedPackage({
      ...editedPackage,
      [field]: value,
    });
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImages((prev) => [...prev, imageId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        packageImages: prev.packageImages.filter(
          (img) => img.imageId !== imageId,
        ),
      };
    });
  };

  const handleUpdateImage = (
    imageId: number,
    name: string,
    description: string,
    color: string,
  ) => {
    const existingUpdate = updatedImages.find((u) => u.imageId === imageId);
    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((u) =>
          u.imageId === imageId
            ? { ...u, imageName: name, imageDescription: description, color }
            : u,
        ),
      );
    } else {
      const originalImage = originalPackage?.packageImages.find(
        (img) => img.imageId === imageId,
      );
      setUpdatedImages((prev) => [
        ...prev,
        {
          imageId,
          imageName: name,
          imageDescription: description,
          imageUrl: originalImage?.imageUrl || "",
          status: "ACTIVE",
          color: color,
        },
      ]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        packageImages: prev.packageImages.map((img) =>
          img.imageId === imageId
            ? {
                ...img,
                imageName: name,
                imageDescription: description,
                color: color,
              }
            : img,
        ),
      };
    });
  };

  // Handle feature changes
  const handleAddFeature = (feature: AddFeatureRequest) => {
    setAddedFeatures((prev) => [...prev, feature]);
  };

  const handleRemoveFeature = (featureId: number) => {
    setRemovedFeatures((prev) => [...prev, featureId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        packageFeatures: prev.packageFeatures.filter(
          (f) => f.featureId !== featureId,
        ),
      };
    });
  };

  const handleUpdateFeature = (feature: UpdateFeatureRequest) => {
    const existingUpdate = updatedFeatures.find(
      (u) => u.featureId === feature.featureId,
    );
    if (existingUpdate) {
      setUpdatedFeatures((prev) =>
        prev.map((u) => (u.featureId === feature.featureId ? feature : u)),
      );
    } else {
      setUpdatedFeatures((prev) => [...prev, feature]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        packageFeatures: prev.packageFeatures.map((f) =>
          f.featureId === feature.featureId
            ? {
                ...f,
                featureName: feature.featureName,
                featureValue: feature.featureValue,
                featureDescription: feature.featureDescription,
                color: feature.color,
                specialNote: feature.specialNote,
              }
            : f,
        ),
      };
    });
  };

  // Handle day accommodation changes
  const handleAddDayAccommodation = (
    accommodation: AddDayAccommodationRequest,
  ) => {
    setAddedDayAccommodations((prev) => [...prev, accommodation]);
  };

  const handleRemoveDayAccommodation = (accommodationId: number) => {
    setRemovedDayAccommodations((prev) => [...prev, accommodationId]);
  };

  const handleUpdateDayAccommodation = (
    accommodation: UpdateDayAccommodationRequest,
  ) => {
    const existingUpdate = updatedDayAccommodations.find(
      (u) =>
        u.packageDayAccommodationId === accommodation.packageDayAccommodationId,
    );
    if (existingUpdate) {
      setUpdatedDayAccommodations((prev) =>
        prev.map((u) =>
          u.packageDayAccommodationId ===
          accommodation.packageDayAccommodationId
            ? accommodation
            : u,
        ),
      );
    } else {
      setUpdatedDayAccommodations((prev) => [...prev, accommodation]);
    }
  };

  // Handle inclusion changes
  const handleAddInclusion = (inclusionText: string, displayOrder: number) => {
    setAddedInclusions((prev) => [
      ...prev,
      { inclusionText, displayOrder, status: "ACTIVE" },
    ]);
  };

  const handleRemoveInclusion = (inclusionId: number) => {
    setRemovedInclusions((prev) => [...prev, inclusionId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inclusions: prev.inclusions.filter((inc) => inc.id !== inclusionId),
      };
    });
  };

  const handleUpdateInclusion = (
    inclusionId: number,
    inclusionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedInclusions.find(
      (u) => u.packageInclusionId === inclusionId,
    );
    if (existingUpdate) {
      setUpdatedInclusions((prev) =>
        prev.map((u) =>
          u.packageInclusionId === inclusionId
            ? { ...u, inclusionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedInclusions((prev) => [
        ...prev,
        {
          packageInclusionId: inclusionId,
          inclusionText,
          displayOrder,
          status,
        },
      ]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inclusions: prev.inclusions.map((inc) =>
          inc.id === inclusionId
            ? { ...inc, description: inclusionText, displayOrder }
            : inc,
        ),
      };
    });
  };

  // Handle exclusion changes
  const handleAddExclusion = (exclusionText: string, displayOrder: number) => {
    setAddedExclusions((prev) => [
      ...prev,
      { exclusionText, displayOrder, status: "ACTIVE" },
    ]);
  };

  const handleRemoveExclusion = (exclusionId: number) => {
    setRemovedExclusions((prev) => [...prev, exclusionId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exclusions: prev.exclusions.filter((exc) => exc.id !== exclusionId),
      };
    });
  };

  const handleUpdateExclusion = (
    exclusionId: number,
    exclusionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedExclusions.find(
      (u) => u.packageExclusionId === exclusionId,
    );
    if (existingUpdate) {
      setUpdatedExclusions((prev) =>
        prev.map((u) =>
          u.packageExclusionId === exclusionId
            ? { ...u, exclusionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedExclusions((prev) => [
        ...prev,
        {
          packageExclusionId: exclusionId,
          exclusionText,
          displayOrder,
          status,
        },
      ]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exclusions: prev.exclusions.map((exc) =>
          exc.id === exclusionId
            ? { ...exc, description: exclusionText, displayOrder }
            : exc,
        ),
      };
    });
  };

  // Handle condition changes
  const handleAddCondition = (conditionText: string, displayOrder: number) => {
    setAddedConditions((prev) => [
      ...prev,
      { conditionText, displayOrder, status: "ACTIVE" },
    ]);
  };

  const handleRemoveCondition = (conditionId: number) => {
    setRemovedConditions((prev) => [...prev, conditionId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conditions: prev.conditions.filter((cond) => cond.id !== conditionId),
      };
    });
  };

  const handleUpdateCondition = (
    conditionId: number,
    conditionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedConditions.find(
      (u) => u.packageConditionId === conditionId,
    );
    if (existingUpdate) {
      setUpdatedConditions((prev) =>
        prev.map((u) =>
          u.packageConditionId === conditionId
            ? { ...u, conditionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedConditions((prev) => [
        ...prev,
        {
          packageConditionId: conditionId,
          conditionText,
          displayOrder,
          status,
        },
      ]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conditions: prev.conditions.map((cond) =>
          cond.id === conditionId
            ? { ...cond, description: conditionText, displayOrder }
            : cond,
        ),
      };
    });
  };

  // Handle travel tip changes
  const handleAddTravelTip = (
    title: string,
    description: string,
    displayOrder: number,
  ) => {
    setAddedTravelTips((prev) => [
      ...prev,
      {
        tipTitle: title,
        tipDescription: description,
        displayOrder,
        status: "ACTIVE",
      },
    ]);
  };

  const handleRemoveTravelTip = (tipId: number) => {
    setRemovedTravelTips((prev) => [...prev, tipId]);
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        travelTips: prev.travelTips.filter((tip) => tip.id !== tipId),
      };
    });
  };

  const handleUpdateTravelTip = (
    tipId: number,
    title: string,
    description: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedTravelTips.find(
      (u) => u.packageTipId === tipId,
    );
    if (existingUpdate) {
      setUpdatedTravelTips((prev) =>
        prev.map((u) =>
          u.packageTipId === tipId
            ? {
                ...u,
                tipTitle: title,
                tipDescription: description,
                displayOrder,
                status,
              }
            : u,
        ),
      );
    } else {
      setUpdatedTravelTips((prev) => [
        ...prev,
        {
          packageTipId: tipId,
          tipTitle: title,
          tipDescription: description,
          displayOrder,
          status,
        },
      ]);
    }
    setEditedPackage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        travelTips: prev.travelTips.map((tip) =>
          tip.id === tipId ? { ...tip, title, description, displayOrder } : tip,
        ),
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      removedImages.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0 ||
      addedFeatures.length > 0 ||
      removedFeatures.length > 0 ||
      updatedFeatures.length > 0 ||
      addedDayAccommodations.length > 0 ||
      removedDayAccommodations.length > 0 ||
      updatedDayAccommodations.length > 0 ||
      addedInclusions.length > 0 ||
      removedInclusions.length > 0 ||
      updatedInclusions.length > 0 ||
      addedExclusions.length > 0 ||
      removedExclusions.length > 0 ||
      updatedExclusions.length > 0 ||
      addedConditions.length > 0 ||
      removedConditions.length > 0 ||
      updatedConditions.length > 0 ||
      addedTravelTips.length > 0 ||
      removedTravelTips.length > 0 ||
      updatedTravelTips.length > 0
    );
  }, [
    basicDetailsChanged,
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
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdatePackageRequest | null => {
    if (!editedPackage || !selectedPackage) return null;

    // Find package type ID from name
    const packageType = categories?.packageCategoryList?.find(
      (p) => p.packageCategoryName === editedPackage.packageTypeName,
    );

    return {
      packageId: selectedPackage.packageId,
      packageBasicDetails: {
        packageType: packageType?.packageCategoryId || 0,
        tourId: editedPackage.tourId,
        name: editedPackage.packageName,
        description: editedPackage.packageDescription,
        totalPrice: editedPackage.totalPrice,
        discountPercentage: editedPackage.discountPercentage,
        startDate: editedPackage.startDate,
        endDate: editedPackage.endDate,
        color: editedPackage.color,
        hoverColor: editedPackage.hoverColor,
        status: editedPackage.packageStatus,
        minPersonCount: editedPackage.minPersonCount,
        maxPersonCount: editedPackage.maxPersonCount,
        pricePerPerson: editedPackage.pricePerPerson,
      },
      removedImageIds: removedImages,
      addImages: newImages,
      updatedImages: updatedImages,
      addFeatures: addedFeatures,
      removeFeatureIds: removedFeatures,
      updatedFeatures: updatedFeatures,
      addDayAccommodations: addedDayAccommodations,
      removeDayAccommodationIds: removedDayAccommodations,
      updatedDayAccommodations: updatedDayAccommodations,
      addInclusions: addedInclusions,
      removeInclusionIds: removedInclusions,
      updatedInclusions: updatedInclusions,
      addExclusions: addedExclusions,
      removeExclusionIds: removedExclusions,
      updatedExclusions: updatedExclusions,
      addConditions: addedConditions,
      removeConditionIds: removedConditions,
      updatedConditions: updatedConditions,
      addTravelTips: addedTravelTips,
      removeTravelTipIds: removedTravelTips,
      updatedTravelTips: updatedTravelTips,
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await PackageService.updatePackage(updateData);

      setSuccess(
        `Package "${editedPackage?.packageName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedPackage?.packageName} has been updated successfully.`,
        actionLink: `${PACKAGES_PAGE_URL}/view?id=${selectedPackage?.packageId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedPackage) {
          fetchPackageDetails(selectedPackage.packageId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update package");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update package. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalPackage) {
      setEditedPackage(originalPackage);
      setBasicDetailsChanged(false);
      setRemovedImages([]);
      setNewImages([]);
      setUpdatedImages([]);
      setAddedFeatures([]);
      setRemovedFeatures([]);
      setUpdatedFeatures([]);
      setAddedDayAccommodations([]);
      setRemovedDayAccommodations([]);
      setUpdatedDayAccommodations([]);
      setAddedInclusions([]);
      setRemovedInclusions([]);
      setUpdatedInclusions([]);
      setAddedExclusions([]);
      setRemovedExclusions([]);
      setUpdatedExclusions([]);
      setAddedConditions([]);
      setRemovedConditions([]);
      setUpdatedConditions([]);
      setAddedTravelTips([]);
      setRemovedTravelTips([]);
      setUpdatedTravelTips([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearPackageSelection = () => {
    setSelectedPackage(null);
    setOriginalPackage(null);
    setEditedPackage(null);
    setToast(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("package-id");
    url.searchParams.delete("package-name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalPackage || !editedPackage) return [];

    const changes: ChangedField[] = [];

    // Basic field changes
    const basicFields = [
      { key: "packageName", label: "Package Name" },
      { key: "packageDescription", label: "Description" },
      { key: "totalPrice", label: "Total Price" },
      { key: "discountPercentage", label: "Discount Percentage" },
      { key: "pricePerPerson", label: "Price Per Person" },
      { key: "minPersonCount", label: "Min Persons" },
      { key: "maxPersonCount", label: "Max Persons" },
      { key: "packageStatus", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalPackage[key as keyof PackageAllDetails];
      const newValue = editedPackage[key as keyof PackageAllDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    // Date changes
    if (originalPackage.startDate !== editedPackage.startDate) {
      changes.push({
        field: "Start Date",
        oldValue: originalPackage.startDate,
        newValue: editedPackage.startDate,
      });
    }
    if (originalPackage.endDate !== editedPackage.endDate) {
      changes.push({
        field: "End Date",
        oldValue: originalPackage.endDate,
        newValue: editedPackage.endDate,
      });
    }

    // Images
    if (
      removedImages.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    ) {
      changes.push({
        field: "Images",
        oldValue: originalPackage.packageImages.length,
        newValue: editedPackage.packageImages.length,
      });
    }

    // Features
    if (
      addedFeatures.length > 0 ||
      removedFeatures.length > 0 ||
      updatedFeatures.length > 0
    ) {
      changes.push({
        field: "Features",
        oldValue: originalPackage.packageFeatures.length,
        newValue: editedPackage.packageFeatures.length,
      });
    }

    // Day Accommodations
    if (
      addedDayAccommodations.length > 0 ||
      removedDayAccommodations.length > 0 ||
      updatedDayAccommodations.length > 0
    ) {
      changes.push({
        field: "Day Accommodations",
        oldValue: "Modified",
        newValue: "Modified",
      });
    }

    // Inclusions
    if (
      addedInclusions.length > 0 ||
      removedInclusions.length > 0 ||
      updatedInclusions.length > 0
    ) {
      changes.push({
        field: "Inclusions",
        oldValue: originalPackage.inclusions.length,
        newValue: editedPackage.inclusions.length,
      });
    }

    // Exclusions
    if (
      addedExclusions.length > 0 ||
      removedExclusions.length > 0 ||
      updatedExclusions.length > 0
    ) {
      changes.push({
        field: "Exclusions",
        oldValue: originalPackage.exclusions.length,
        newValue: editedPackage.exclusions.length,
      });
    }

    // Conditions
    if (
      addedConditions.length > 0 ||
      removedConditions.length > 0 ||
      updatedConditions.length > 0
    ) {
      changes.push({
        field: "Conditions",
        oldValue: originalPackage.conditions.length,
        newValue: editedPackage.conditions.length,
      });
    }

    // Travel Tips
    if (
      addedTravelTips.length > 0 ||
      removedTravelTips.length > 0 ||
      updatedTravelTips.length > 0
    ) {
      changes.push({
        field: "Travel Tips",
        oldValue: originalPackage.travelTips.length,
        newValue: editedPackage.travelTips.length,
      });
    }

    return changes;
  };

  // Convert packages to search items format
  const searchItems: SearchItem[] = packages.map((pkg) => ({
    id: pkg.packageId,
    name: pkg.packageName,
  }));

  const selectedSearchItem = selectedPackage
    ? {
        id: selectedPackage.packageId,
        name: selectedPackage.packageName,
      }
    : null;

  // Show loading state
  if (commonLoading || loadingTours) {
    return (
      <CommonLoading
        message="Loading package data..."
        subMessage="Please wait while we fetch available packages and tours"
        size="lg"
      />
    );
  }

  // Show error state
  if (commonError) {
    return (
      <CommonErrorState
        error={commonError}
        title="Failed to Load Data"
        message="Unable to load package data. Please try again."
        variant="error"
        showBackButton={false}
        showRetryButton={true}
        onRetry={() => window.location.reload()}
        retryButtonText="Retry"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Package"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Package"
            description="Edit and update existing package information"
            breadcrumbItems={PACKAGE_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedPackage && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Search className="w-6 h-6" style={{ color: theme.primary }} />
              Select Package to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectPackage(item.id as number, item.name)
              }
              onClearSelection={handleClearPackageSelection}
              initialSearchTerm={initialPackageName}
              placeholder="Search packages..."
              title="Packages"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Package Info Bar */}
        {selectedPackage && (
          <SelectedItemBar
            item={{
              id: selectedPackage.packageId,
              name: selectedPackage.packageName,
            }}
            onClear={handleClearPackageSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Package"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading package details..."
            subMessage="Please wait while we fetch the package information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Package Details Form */}
        {editedPackage && selectedPackage && categories && (
          <PackageDetailsForm
            packageData={editedPackage}
            originalPackage={originalPackage}
            removedImages={removedImages}
            newImages={newImages}
            updatedImages={updatedImages}
            addedFeatures={addedFeatures}
            removedFeatures={removedFeatures}
            updatedFeatures={updatedFeatures}
            addedDayAccommodations={addedDayAccommodations}
            removedDayAccommodations={removedDayAccommodations}
            updatedDayAccommodations={updatedDayAccommodations}
            addedInclusions={addedInclusions}
            removedInclusions={removedInclusions}
            updatedInclusions={updatedInclusions}
            addedExclusions={addedExclusions}
            removedExclusions={removedExclusions}
            updatedExclusions={updatedExclusions}
            addedConditions={addedConditions}
            removedConditions={removedConditions}
            updatedConditions={updatedConditions}
            addedTravelTips={addedTravelTips}
            removedTravelTips={removedTravelTips}
            updatedTravelTips={updatedTravelTips}
            availablePackageTypes={categories.packageCategoryList || []}
            availableTours={tours}
            onBasicFieldChange={handleBasicFieldChange}
            onRemoveImage={handleRemoveImage}
            onAddNewImage={handleAddNewImage}
            onUpdateImage={handleUpdateImage}
            onAddFeature={handleAddFeature}
            onRemoveFeature={handleRemoveFeature}
            onUpdateFeature={handleUpdateFeature}
            onAddDayAccommodation={handleAddDayAccommodation}
            onRemoveDayAccommodation={handleRemoveDayAccommodation}
            onUpdateDayAccommodation={handleUpdateDayAccommodation}
            onAddInclusion={handleAddInclusion}
            onRemoveInclusion={handleRemoveInclusion}
            onUpdateInclusion={handleUpdateInclusion}
            onAddExclusion={handleAddExclusion}
            onRemoveExclusion={handleRemoveExclusion}
            onUpdateExclusion={handleUpdateExclusion}
            onAddCondition={handleAddCondition}
            onRemoveCondition={handleRemoveCondition}
            onUpdateCondition={handleUpdateCondition}
            onAddTravelTip={handleAddTravelTip}
            onRemoveTravelTip={handleRemoveTravelTip}
            onUpdateTravelTip={handleUpdateTravelTip}
            uploadingImages={uploadingImages}
          />
        )}

        {/* Action Buttons */}
        {editedPackage && originalPackage && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate || uploadingImages}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate || uploadingImages}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Package"}
              </button>
            </div>

            {/* Uploading Indicator */}
            {uploadingImages && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{ color: theme.primary }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      Uploading images to Cloudinary...
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Please wait for all images to finish uploading before
                      updating
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Change Indicator */}
            {hasChanges() && !uploadingImages && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Click "Update Package" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalPackage && editedPackage && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedPackage.packageName}
            changedFields={getChangedFields()}
            confirmText="Update Package"
            cancelText="Cancel"
            title="Confirm Package Update"
            message={`You are about to update "${editedPackage.packageName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </div>
  );
};

export default UpdatePackagePage;
