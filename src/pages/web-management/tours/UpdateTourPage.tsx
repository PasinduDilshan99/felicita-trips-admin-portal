// app/tours/update/page.tsx (corrected version)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { TourService } from "@/services/tourService";
import { ActivityService } from "@/services/activityService";
import { DestinationService } from "@/services/destinationService";
import { OtherService } from "@/services/otherService";
import {
  TourNameId,
  TourAllDetails,
  UpdateTourRequest,
  UpdateTourBasicDetails,
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
  ActivityCategory,
  DestinationCategory,
  TourType,
  TourCategory,
  SeasonType,
} from "@/types/common-types";
import { ActivityIdName } from "@/types/activity-types";
import { DestinationForTour } from "@/types/destination-types";
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
import { TOURS_PAGE_URL } from "@/utils/urls";
import TourDetailsForm from "@/components/tours-components/tour-update-components/TourDetailsForm";

const UpdateTourPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    categories,
    loading: commonLoading,
    error: commonError,
  } = useCommon();

  const initialTourName = searchParams?.get("tour-name") || "";
  const initialTourId = searchParams?.get("tour-id") || "";

  // State for tours list
  const [tours, setTours] = useState<TourNameId[]>([]);

  // State for destinations and activities
  const [destinations, setDestinations] = useState<DestinationForTour[]>([]);
  const [activities, setActivities] = useState<ActivityIdName[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // State for selected tour
  const [selectedTour, setSelectedTour] = useState<TourNameId | null>(
    initialTourId && initialTourName
      ? {
          tourId: parseInt(initialTourId),
          tourName: initialTourName,
        }
      : null,
  );

  // State for original tour details
  const [originalTour, setOriginalTour] = useState<TourAllDetails | null>(null);

  // State for edited tour
  const [editedTour, setEditedTour] = useState<TourAllDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for tour types changes
  const [removedTourTypes, setRemovedTourTypes] = useState<number[]>([]);
  const [newTourTypes, setNewTourTypes] = useState<number[]>([]);
  const [updatedTourTypes, setUpdatedTourTypes] = useState<UpdateTourType[]>(
    [],
  );

  // State for tour categories changes
  const [removedTourCategories, setRemovedTourCategories] = useState<number[]>(
    [],
  );
  const [newTourCategories, setNewTourCategories] = useState<number[]>([]);
  const [updatedTourCategories, setUpdatedTourCategories] = useState<
    UpdateTourCategory[]
  >([]);

  // State for images changes
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<TourImageInput[]>([]);
  const [updatedImages, setUpdatedImages] = useState<UpdateImageInput[]>([]);

  // State for day-to-day itinerary changes
  const [addedDestinations, setAddedDestinations] = useState<
    TourDestinationInput[]
  >([]);
  const [removedDestinations, setRemovedDestinations] = useState<number[]>([]);
  const [removedActivities, setRemovedActivities] = useState<number[]>([]);
  const [updatedDestinations, setUpdatedDestinations] = useState<
    UpdateDestinationInput[]
  >([]);

  // State for inclusions
  const [addedInclusions, setAddedInclusions] = useState<InclusionInput[]>([]);
  const [removedInclusions, setRemovedInclusions] = useState<number[]>([]);
  const [updatedInclusions, setUpdatedInclusions] = useState<
    UpdateInclusionInput[]
  >([]);

  // State for exclusions
  const [addedExclusions, setAddedExclusions] = useState<ExclusionInput[]>([]);
  const [removedExclusions, setRemovedExclusions] = useState<number[]>([]);
  const [updatedExclusions, setUpdatedExclusions] = useState<
    UpdateExclusionInput[]
  >([]);

  // State for conditions
  const [addedConditions, setAddedConditions] = useState<ConditionInput[]>([]);
  const [removedConditions, setRemovedConditions] = useState<number[]>([]);
  const [updatedConditions, setUpdatedConditions] = useState<
    UpdateConditionInput[]
  >([]);

  // State for travel tips
  const [addedTravelTips, setAddedTravelTips] = useState<TravelTipInput[]>([]);
  const [removedTravelTips, setRemovedTravelTips] = useState<number[]>([]);
  const [updatedTravelTips, setUpdatedTravelTips] = useState<
    UpdateTravelTipInput[]
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

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Tours", href: TOURS_PAGE_URL },
    {
      label: "Update",
      href: TOURS_PAGE_URL,
    },
  ];

  // Fetch tours list on initial load
  useEffect(() => {
    if (!selectedTour) {
      fetchTours();
    }
  }, []);

  // Fetch destinations and activities
  useEffect(() => {
    fetchDestinationsAndActivities();
  }, []);

  // If initialTourId is provided, fetch details
  useEffect(() => {
    if (initialTourId && !originalTour) {
      handleSelectTour(parseInt(initialTourId), initialTourName);
    }
  }, [initialTourId, initialTourName]);

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TourService.getAllTourNames();
      setTours(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load tours",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationsAndActivities = async () => {
    setLoadingDestinations(true);
    setLoadingActivities(true);
    try {
      const [destinationsRes, activitiesRes] = await Promise.all([
        DestinationService.getDestinationNames(),
        ActivityService.getActivityIdsAndNames(),
      ]);
      setDestinations(destinationsRes.data);
      setActivities(activitiesRes.data);
    } catch (err: any) {
      console.error("Failed to fetch destinations/activities:", err);
    } finally {
      setLoadingDestinations(false);
      setLoadingActivities(false);
    }
  };

  const handleSelectTour = async (id: number, name: string) => {
    setSelectedTour({ tourId: id, tourName: name });
    await fetchTourDetails(id);
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
  ) => {
    setUploadingImages(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageFile);

      const newImage: TourImageInput = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedTour) {
        const tempImage = {
          imageId: Date.now(),
          imageName: imageName,
          imageDescription: imageDescription,
          imageUrl: cloudinaryUrl,
        };
        setEditedTour({
          ...editedTour,
          images: [...editedTour.images, tempImage],
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

  const fetchTourDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalTour(null);
    setEditedTour(null);

    // Reset all change states
    setBasicDetailsChanged(false);
    setRemovedTourTypes([]);
    setNewTourTypes([]);
    setUpdatedTourTypes([]);
    setRemovedTourCategories([]);
    setNewTourCategories([]);
    setUpdatedTourCategories([]);
    setRemovedImages([]);
    setNewImages([]);
    setUpdatedImages([]);
    setAddedDestinations([]);
    setRemovedDestinations([]);
    setRemovedActivities([]);
    setUpdatedDestinations([]);
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
      const response = await TourService.getTourAllDetails(id);
      const tourData = response.data;
      setOriginalTour(tourData);
      setEditedTour(tourData);
    } catch (err: any) {
      setError(err.message || "Failed to load tour details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load tour details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedTour) return;
    setBasicDetailsChanged(true);
    setEditedTour({
      ...editedTour,
      [field]: value,
    });
  };

  // Handle tour type changes
  const handleAddTourType = (typeId: number) => {
    setNewTourTypes((prev) => [...prev, typeId]);
  };

  const handleRemoveTourType = (typeId: number) => {
    setRemovedTourTypes((prev) => [...prev, typeId]);
    setEditedTour((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tourTypeDtos: prev.tourTypeDtos.filter((t) => t.tourTypeId !== typeId),
      };
    });
  };

  const handleUpdateTourType = (
    typeId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedTourTypes.find(
      (u) => u.tourTypeId === typeId,
    );
    if (existingUpdate) {
      setUpdatedTourTypes((prev) =>
        prev.map((u) =>
          u.tourTypeId === typeId ? { ...u, isPrimary, status } : u,
        ),
      );
    } else {
      setUpdatedTourTypes((prev) => [
        ...prev,
        { tourTypeId: typeId, isPrimary, status },
      ]);
    }
  };

  // Handle tour category changes
  const handleAddTourCategory = (categoryId: number) => {
    setNewTourCategories((prev) => [...prev, categoryId]);
  };

  const handleRemoveTourCategory = (categoryId: number) => {
    setRemovedTourCategories((prev) => [...prev, categoryId]);
    setEditedTour((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tourCategoryDto: prev.tourCategoryDto.filter(
          (c) => c.tourCategoryId !== categoryId,
        ),
      };
    });
  };

  const handleUpdateTourCategory = (
    categoryId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedTourCategories.find(
      (u) => u.tourCategoryId === categoryId,
    );
    if (existingUpdate) {
      setUpdatedTourCategories((prev) =>
        prev.map((u) =>
          u.tourCategoryId === categoryId ? { ...u, isPrimary, status } : u,
        ),
      );
    } else {
      setUpdatedTourCategories((prev) => [
        ...prev,
        { tourCategoryId: categoryId, isPrimary, status },
      ]);
    }
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImages((prev) => [...prev, imageId]);
    setEditedTour((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.filter((img) => img.imageId !== imageId),
      };
    });
  };

  const handleUpdateImage = (
    imageId: number,
    name: string,
    description: string,
  ) => {
    const existingUpdate = updatedImages.find((u) => u.imageId === imageId);
    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((u) =>
          u.imageId === imageId
            ? { ...u, name, imageDescription: description }
            : u,
        ),
      );
    } else {
      const originalImage = originalTour?.images.find(
        (img) => img.imageId === imageId,
      );
      setUpdatedImages((prev) => [
        ...prev,
        {
          imageId,
          name,
          imageDescription: description,
          imageUrl: originalImage?.imageUrl || "",
          status: "ACTIVE",
        },
      ]);
    }
    setEditedTour((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        images: prev.images.map((img) =>
          img.imageId === imageId
            ? { ...img, imageName: name, imageDescription: description }
            : img,
        ),
      };
    });
  };

  // Handle day-to-day itinerary changes
  const handleAddDestination = (
    destinationId: number,
    activityId: number,
    dayNumber: number,
  ) => {
    setAddedDestinations((prev) => [
      ...prev,
      { destinationId, activityId, dayNumber },
    ]);
  };

  const handleRemoveDestination = (tourDestinationId: number) => {
    setRemovedDestinations((prev) => [...prev, tourDestinationId]);
  };

  const handleRemoveActivity = (activityId: number) => {
    setRemovedActivities((prev) => [...prev, activityId]);
  };

  const handleUpdateDestination = (
    tourDestinationId: number,
    dayNumber: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedDestinations.find(
      (u) => u.tourDestinationId === tourDestinationId,
    );
    if (existingUpdate) {
      setUpdatedDestinations((prev) =>
        prev.map((u) =>
          u.tourDestinationId === tourDestinationId
            ? { ...u, dayNumber, status }
            : u,
        ),
      );
    } else {
      const originalDest = originalTour?.dayToDayResponses
        .flatMap((d) => d.destinations)
        .find((d) => d.destination.destinationId === tourDestinationId);
      setUpdatedDestinations((prev) => [
        ...prev,
        {
          tourDestinationId,
          destinationId: originalDest?.destination.destinationId || 0,
          activityId: originalDest?.activities[0]?.activityId || 0,
          dayNumber,
          status,
        },
      ]);
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
  };

  const handleUpdateInclusion = (
    inclusionId: number,
    inclusionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedInclusions.find(
      (u) => u.inclusionId === inclusionId,
    );
    if (existingUpdate) {
      setUpdatedInclusions((prev) =>
        prev.map((u) =>
          u.inclusionId === inclusionId
            ? { ...u, inclusionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedInclusions((prev) => [
        ...prev,
        { inclusionId, inclusionText, displayOrder, status },
      ]);
    }
    setEditedTour((prev) => {
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
  };

  const handleUpdateExclusion = (
    exclusionId: number,
    exclusionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedExclusions.find(
      (u) => u.exclusionId === exclusionId,
    );
    if (existingUpdate) {
      setUpdatedExclusions((prev) =>
        prev.map((u) =>
          u.exclusionId === exclusionId
            ? { ...u, exclusionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedExclusions((prev) => [
        ...prev,
        { exclusionId, exclusionText, displayOrder, status },
      ]);
    }
    setEditedTour((prev) => {
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
  };

  const handleUpdateCondition = (
    conditionId: number,
    conditionText: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedConditions.find(
      (u) => u.conditionId === conditionId,
    );
    if (existingUpdate) {
      setUpdatedConditions((prev) =>
        prev.map((u) =>
          u.conditionId === conditionId
            ? { ...u, conditionText, displayOrder, status }
            : u,
        ),
      );
    } else {
      setUpdatedConditions((prev) => [
        ...prev,
        { conditionId, conditionText, displayOrder, status },
      ]);
    }
    setEditedTour((prev) => {
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

  const handleRemoveTravelTip = (travelTipId: number) => {
    setRemovedTravelTips((prev) => [...prev, travelTipId]);
  };

  const handleUpdateTravelTip = (
    travelTipId: number,
    title: string,
    description: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => {
    const existingUpdate = updatedTravelTips.find(
      (u) => u.travelTipId === travelTipId,
    );
    if (existingUpdate) {
      setUpdatedTravelTips((prev) =>
        prev.map((u) =>
          u.travelTipId === travelTipId
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
          travelTipId,
          tipTitle: title,
          tipDescription: description,
          displayOrder,
          status,
        },
      ]);
    }
    setEditedTour((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        travelTips: prev.travelTips.map((tip) =>
          tip.id === travelTipId
            ? { ...tip, title, description, displayOrder }
            : tip,
        ),
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      removedTourTypes.length > 0 ||
      newTourTypes.length > 0 ||
      updatedTourTypes.length > 0 ||
      removedTourCategories.length > 0 ||
      newTourCategories.length > 0 ||
      updatedTourCategories.length > 0 ||
      removedImages.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0 ||
      addedDestinations.length > 0 ||
      removedDestinations.length > 0 ||
      removedActivities.length > 0 ||
      updatedDestinations.length > 0 ||
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
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateTourRequest | null => {
    if (!editedTour || !selectedTour) return null;

    // Find season ID from season name
    const season = categories?.seasonsList?.find(
      (s) => s.seasonName === editedTour.seasonName
    );

    return {
      tourId: selectedTour.tourId,
      tourBasicDetails: {
        tourName: editedTour.tourName,
        tourDescription: editedTour.tourDescription,
        duration: editedTour.duration,
        latitude: editedTour.latitude,
        longitude: editedTour.longitude,
        startLocation: editedTour.startLocation,
        endLocation: editedTour.endLocation,
        season: season?.seasonId || 0,
        status: editedTour.statusName,
        assignTo: editedTour.assignTo,
        assignMessage: editedTour.assignMessage,
      },
      addTourTypes: newTourTypes,
      removeTourTypes: removedTourTypes,
      updateTourTypes: updatedTourTypes,
      addTourCategories: newTourCategories,
      removeTourCategories: removedTourCategories,
      updateTourCategories: updatedTourCategories,
      addDestinations: addedDestinations,
      removeDestinations: removedDestinations,
      removeActivities: removedActivities,
      updateDestinations: updatedDestinations,
      addImages: newImages,
      removeImages: removedImages,
      updateImages: updatedImages,
      addInclusions: addedInclusions,
      removeInclusions: removedInclusions,
      updateInclusions: updatedInclusions,
      addExclusions: addedExclusions,
      removeExclusions: removedExclusions,
      updateExclusions: updatedExclusions,
      addConditions: addedConditions,
      removeConditions: removedConditions,
      updateConditions: updatedConditions,
      addTravelTips: addedTravelTips,
      removeTravelTips: removedTravelTips,
      updateTravelTips: updatedTravelTips,
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
      const response = await TourService.updateTour(updateData);

      setSuccess(`Tour "${editedTour?.tourName}" updated successfully!`);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedTour?.tourName} has been updated successfully.`,
        actionLink: `${TOURS_PAGE_URL}/view?id=${selectedTour?.tourId}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedTour) {
          fetchTourDetails(selectedTour.tourId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update tour");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update tour. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalTour) {
      setEditedTour(originalTour);
      setBasicDetailsChanged(false);
      setRemovedTourTypes([]);
      setNewTourTypes([]);
      setUpdatedTourTypes([]);
      setRemovedTourCategories([]);
      setNewTourCategories([]);
      setUpdatedTourCategories([]);
      setRemovedImages([]);
      setNewImages([]);
      setUpdatedImages([]);
      setAddedDestinations([]);
      setRemovedDestinations([]);
      setRemovedActivities([]);
      setUpdatedDestinations([]);
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

  const handleClearTourSelection = () => {
    setSelectedTour(null);
    setOriginalTour(null);
    setEditedTour(null);
    setToast(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("tour-id");
    url.searchParams.delete("tour-name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalTour || !editedTour) return [];

    const changes: ChangedField[] = [];

    // Basic field changes
    const basicFields = [
      { key: "tourName", label: "Tour Name" },
      { key: "tourDescription", label: "Tour Description" },
      { key: "duration", label: "Duration (days)" },
      { key: "startLocation", label: "Start Location" },
      { key: "endLocation", label: "End Location" },
      { key: "statusName", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalTour[key as keyof TourAllDetails];
      const newValue = editedTour[key as keyof TourAllDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    // Coordinate changes
    if (originalTour.latitude !== editedTour.latitude) {
      changes.push({
        field: "Latitude",
        oldValue: originalTour.latitude,
        newValue: editedTour.latitude,
      });
    }
    if (originalTour.longitude !== editedTour.longitude) {
      changes.push({
        field: "Longitude",
        oldValue: originalTour.longitude,
        newValue: editedTour.longitude,
      });
    }

    // Tour Types
    if (
      removedTourTypes.length > 0 ||
      newTourTypes.length > 0 ||
      updatedTourTypes.length > 0
    ) {
      changes.push({
        field: "Tour Types",
        oldValue: originalTour.tourTypeDtos.length,
        newValue: editedTour.tourTypeDtos.length,
      });
    }

    // Tour Categories
    if (
      removedTourCategories.length > 0 ||
      newTourCategories.length > 0 ||
      updatedTourCategories.length > 0
    ) {
      changes.push({
        field: "Tour Categories",
        oldValue: originalTour.tourCategoryDto.length,
        newValue: editedTour.tourCategoryDto.length,
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
        oldValue: originalTour.images.length,
        newValue: editedTour.images.length,
      });
    }

    // Day-to-Day Itinerary
    if (
      addedDestinations.length > 0 ||
      removedDestinations.length > 0 ||
      updatedDestinations.length > 0
    ) {
      changes.push({
        field: "Day-to-Day Itinerary",
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
        oldValue: originalTour.inclusions.length,
        newValue: editedTour.inclusions.length,
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
        oldValue: originalTour.exclusions.length,
        newValue: editedTour.exclusions.length,
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
        oldValue: originalTour.conditions.length,
        newValue: editedTour.conditions.length,
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
        oldValue: originalTour.travelTips.length,
        newValue: editedTour.travelTips.length,
      });
    }

    return changes;
  };

  // Convert tours to search items format
  const searchItems: SearchItem[] = tours.map((tour) => ({
    id: tour.tourId,
    name: tour.tourName,
  }));

  const selectedSearchItem = selectedTour
    ? {
        id: selectedTour.tourId,
        name: selectedTour.tourName,
      }
    : null;

  // Show loading state
  if (commonLoading || loadingDestinations || loadingActivities) {
    return (
      <CommonLoading
        message="Loading tour data..."
        subMessage="Please wait while we fetch available tours and categories"
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
        message="Unable to load tour data. Please try again."
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
          actionText="View Tour"
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
            title="Update Tour"
            description="Edit and update existing tour information"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedTour && (
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
              Select Tour to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectTour(item.id as number, item.name)
              }
              onClearSelection={handleClearTourSelection}
              initialSearchTerm={initialTourName}
              placeholder="Search tours..."
              title="Tours"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Tour Info Bar */}
        {selectedTour && (
          <SelectedItemBar
            item={{
              id: selectedTour.tourId,
              name: selectedTour.tourName,
            }}
            onClear={handleClearTourSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Tour"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading tour details..."
            subMessage="Please wait while we fetch the tour information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Tour Details Form */}
        {editedTour && selectedTour && categories && (
          <TourDetailsForm
            tour={editedTour}
            originalTour={originalTour}
            removedTourTypes={removedTourTypes}
            newTourTypes={newTourTypes}
            updatedTourTypes={updatedTourTypes}
            removedTourCategories={removedTourCategories}
            newTourCategories={newTourCategories}
            updatedTourCategories={updatedTourCategories}
            removedImages={removedImages}
            newImages={newImages}
            updatedImages={updatedImages}
            addedDestinations={addedDestinations}
            removedDestinations={removedDestinations}
            removedActivities={removedActivities}
            updatedDestinations={updatedDestinations}
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
            availableTourTypes={categories.tourTypeList || []}
            availableTourCategories={categories.tourCategoryList || []}
            availableDestinationCategories={categories.destinationCategoryList || []}
            availableActivityCategories={categories.activityCategoryList || []}
            availableSeasons={categories.seasonsList || []}
            availableDestinations={destinations}
            availableActivities={activities}
            onBasicFieldChange={handleBasicFieldChange}
            onAddTourType={handleAddTourType}
            onRemoveTourType={handleRemoveTourType}
            onUpdateTourType={handleUpdateTourType}
            onAddTourCategory={handleAddTourCategory}
            onRemoveTourCategory={handleRemoveTourCategory}
            onUpdateTourCategory={handleUpdateTourCategory}
            onRemoveImage={handleRemoveImage}
            onAddNewImage={handleAddNewImage}
            onUpdateImage={handleUpdateImage}
            onAddDestination={handleAddDestination}
            onRemoveDestination={handleRemoveDestination}
            onRemoveActivity={handleRemoveActivity}
            onUpdateDestination={handleUpdateDestination}
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
        {editedTour && originalTour && (
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
                {loadingUpdate ? "Updating..." : "Update Tour"}
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
                      Click "Update Tour" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalTour && editedTour && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedTour.tourName}
            changedFields={getChangedFields()}
            confirmText="Update Tour"
            cancelText="Cancel"
            title="Confirm Tour Update"
            message={`You are about to update "${editedTour.tourName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateTourPage;