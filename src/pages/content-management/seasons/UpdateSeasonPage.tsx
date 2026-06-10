"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SeasonService } from "@/services/seasonService";
import { ActivityService } from "@/services/activityService";
import { TourService } from "@/services/tourService";
import { OtherService } from "@/services/otherService";
import {
  SeasonDetails,
  UpdateSeasonRequest,
  SeasonImageInsertRequest,
  SeasonImageUpdateRequest,
  SeasonActivity,
  SeasonTour,
} from "@/types/season-types";
import { ActivityIdName } from "@/types/activity-types";
import { TourNameId } from "@/types/tour-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  Loader2,
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  ChevronDown,
  Star,
} from "lucide-react";
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
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SEASONS_PAGE_URL } from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { SEASON_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { SeasonReadOnlyDetails } from "@/components/season-components/update-season-components/SeasonReadOnlyDetails";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

const STATUS_OPTIONS = [
  {
    value: "1",
    label: "Active",
    description: "Season is active",
    color: "#059669",
  },
  {
    value: "0",
    label: "Inactive",
    description: "Season is inactive",
    color: "#6b7280",
  },
];

const MONSOON_TYPES = [
  {
    value: "NORTHEAST",
    label: "Northeast Monsoon",
    description: "Northeast monsoon season",
  },
  {
    value: "SOUTHWEST",
    label: "Southwest Monsoon",
    description: "Southwest monsoon season",
  },
  {
    value: "INTER_MONSOON",
    label: "Inter Monsoon",
    description: "Inter monsoon period",
  },
  { value: "NONE", label: "None", description: "No specific monsoon pattern" },
];

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const UpdateSeasonPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const initialSeasonName = searchParams?.get("season-name") || "";
  const initialSeasonId = searchParams?.get("season-id") || "";

  // State for seasons list
  const [seasons, setSeasons] = useState<Array<{ id: number; name: string }>>(
    [],
  );

  // State for activities and tours
  const [allActivities, setAllActivities] = useState<ActivityIdName[]>([]);
  const [allTours, setAllTours] = useState<TourNameId[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingTours, setLoadingTours] = useState(false);

  // State for selected season
  const [selectedSeason, setSelectedSeason] = useState<{
    id: number;
    name: string;
  } | null>(
    initialSeasonId && initialSeasonName
      ? {
          id: parseInt(initialSeasonId),
          name: initialSeasonName,
        }
      : null,
  );

  // State for original season details
  const [originalSeason, setOriginalSeason] = useState<SeasonDetails | null>(
    null,
  );

  // State for edited season
  const [editedSeason, setEditedSeason] = useState<SeasonDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // State for activities changes
  const [removedActivityIds, setRemovedActivityIds] = useState<number[]>([]);
  const [addedActivityIds, setAddedActivityIds] = useState<number[]>([]);

  // State for tours changes
  const [removedTourIds, setRemovedTourIds] = useState<number[]>([]);
  const [addedTourIds, setAddedTourIds] = useState<number[]>([]);

  // State for images changes
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<SeasonImageInsertRequest[]>([]);
  const [updatedImages, setUpdatedImages] = useState<
    SeasonImageUpdateRequest[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic", "activities", "tours", "images"]),
  );

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected season changes
  const updateUrlWithSelectedSeason = useCallback(
    (season: { id: number; name: string } | null) => {
      const url = new URL(window.location.href);
      if (season) {
        url.searchParams.set("season-id", season.id.toString());
        url.searchParams.set("season-name", season.name);
      } else {
        url.searchParams.delete("season-id");
        url.searchParams.delete("season-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch seasons list
  // Fetch seasons list
  const fetchSeasons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SeasonService.getSeasonIdAndName();
      // Map the response to match the expected state structure
      const mappedSeasons = response.data.map((season) => ({
        id: season.seasonId,
        name: season.seasonName,
      }));
      setSeasons(mappedSeasons);
    } catch (err: any) {
      setError(err.message || "Failed to load seasons");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load seasons",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities and tours
  const fetchActivitiesAndTours = async () => {
    setLoadingActivities(true);
    setLoadingTours(true);
    try {
      const [activitiesRes, toursRes] = await Promise.all([
        ActivityService.getActivityIdsAndNames(),
        TourService.getAllTourNames(),
      ]);
      setAllActivities(activitiesRes.data);
      setAllTours(toursRes.data);
    } catch (err: any) {
      console.error("Failed to fetch activities/tours:", err);
    } finally {
      setLoadingActivities(false);
      setLoadingTours(false);
    }
  };

  // Fetch seasons list on initial load
  useEffect(() => {
    if (!selectedSeason) {
      fetchSeasons();
    }
  }, []);

  // Fetch activities and tours
  useEffect(() => {
    fetchActivitiesAndTours();
  }, []);

  // If initialSeasonId is provided, fetch details
  useEffect(() => {
    if (initialSeasonId && !originalSeason && !loadingDetails) {
      handleSelectSeason(parseInt(initialSeasonId), initialSeasonName);
    }
  }, [initialSeasonId, initialSeasonName]);

  const handleSelectSeason = async (id: number, name: string) => {
    const newSelectedSeason = { id, name };
    setSelectedSeason(newSelectedSeason);
    updateUrlWithSelectedSeason(newSelectedSeason);
    await fetchSeasonDetails(id);
  };

  const fetchSeasonDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalSeason(null);
    setEditedSeason(null);
    setBasicDetailsChanged(false);
    setRemovedActivityIds([]);
    setAddedActivityIds([]);
    setRemovedTourIds([]);
    setAddedTourIds([]);
    setRemovedImageIds([]);
    setNewImages([]);
    setUpdatedImages([]);

    try {
      const response = await SeasonService.getSeasonDetails(id);
      const seasonData = response.data;
      setOriginalSeason(seasonData);
      setEditedSeason(seasonData);
    } catch (err: any) {
      setError(err.message || "Failed to load season details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load season details",
      });
    } finally {
      setLoadingDetails(false);
    }
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

      const newImage: SeasonImageInsertRequest = {
        name: imageName,
        description: imageDescription,
        imageUrl: cloudinaryUrl,
        status: "ACTIVE",
      };

      setNewImages((prev) => [...prev, newImage]);

      if (editedSeason) {
        const tempImage = {
          id: Date.now(),
          name: imageName,
          description: imageDescription,
          imageUrl: cloudinaryUrl,
          status: 1,
        };
        setEditedSeason({
          ...editedSeason,
          seasonImages: [...editedSeason.seasonImages, tempImage],
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

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedSeason) return;
    setBasicDetailsChanged(true);
    setEditedSeason({
      ...editedSeason,
      [field]: value,
    });
  };

  // Handle activity changes
  const handleAddActivity = (activityId: number) => {
    setAddedActivityIds((prev) => [...prev, activityId]);
    const activity = allActivities.find((a) => a.activityId === activityId);
    if (activity && editedSeason) {
      const tempActivity: SeasonActivity = {
        activityId: activity.activityId,
        activityName: activity.activityName,
        activityDescription: "",
        activityStatus: "ACTIVE",
      };
      setEditedSeason({
        ...editedSeason,
        activities: [...editedSeason.activities, tempActivity],
      });
    }
  };

  const handleRemoveActivity = (activityId: number) => {
    setRemovedActivityIds((prev) => [...prev, activityId]);
    setEditedSeason((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: prev.activities.filter((a) => a.activityId !== activityId),
      };
    });
  };

  // Handle tour changes
  const handleAddTour = (tourId: number) => {
    setAddedTourIds((prev) => [...prev, tourId]);
    const tour = allTours.find((t) => t.tourId === tourId);
    if (tour && editedSeason) {
      const tempTour: SeasonTour = {
        tourId: tour.tourId,
        tourName: tour.tourName,
        tourDescription: "",
        tourStatus: "ACTIVE",
      };
      setEditedSeason({
        ...editedSeason,
        tours: [...editedSeason.tours, tempTour],
      });
    }
  };

  const handleRemoveTour = (tourId: number) => {
    setRemovedTourIds((prev) => [...prev, tourId]);
    setEditedSeason((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tours: prev.tours.filter((t) => t.tourId !== tourId),
      };
    });
  };

  // Handle image changes
  const handleRemoveImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setEditedSeason((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        seasonImages: prev.seasonImages.filter((img) => img.id !== imageId),
      };
    });
  };

  const handleUpdateImage = (
    imageId: number,
    name: string,
    description: string,
  ) => {
    const existingUpdate = updatedImages.find((u) => u.id === imageId);
    if (existingUpdate) {
      setUpdatedImages((prev) =>
        prev.map((u) => (u.id === imageId ? { ...u, name, description } : u)),
      );
    } else {
      const originalImage = originalSeason?.seasonImages.find(
        (img) => img.id === imageId,
      );
      setUpdatedImages((prev) => [
        ...prev,
        {
          id: imageId,
          name,
          description,
          imageUrl: originalImage?.imageUrl || "",
          status: "ACTIVE",
        },
      ]);
    }
    setEditedSeason((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        seasonImages: prev.seasonImages.map((img) =>
          img.id === imageId ? { ...img, name, description } : img,
        ),
      };
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return (
      basicDetailsChanged ||
      removedActivityIds.length > 0 ||
      addedActivityIds.length > 0 ||
      removedTourIds.length > 0 ||
      addedTourIds.length > 0 ||
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    );
  }, [
    basicDetailsChanged,
    removedActivityIds,
    addedActivityIds,
    removedTourIds,
    addedTourIds,
    removedImageIds,
    newImages,
    updatedImages,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateSeasonRequest | null => {
    if (!editedSeason || !selectedSeason) return null;

    return {
      id: selectedSeason.id,
      name: editedSeason.name,
      standardName: editedSeason.standardName,
      localName: editedSeason.localName,
      startMonth: editedSeason.startMonth,
      endMonth: editedSeason.endMonth,
      monsoonType: editedSeason.monsoonType,
      weatherSummary: editedSeason.weatherSummary,
      temperatureMin: editedSeason.temperatureMin,
      temperatureMax: editedSeason.temperatureMax,
      rainfallPattern: editedSeason.rainfallPattern,
      isPeak: editedSeason.isPeak,
      displayOrder: editedSeason.displayOrder,
      description: editedSeason.description,
      status: editedSeason.status.toString(),
      imageInsertRequests: newImages,
      imageUpdateRequests: updatedImages,
      imageRemoveRequests: removedImageIds,
      insertActivitiesIds: addedActivityIds,
      removeActivitiesIds: removedActivityIds,
      insertTourIds: addedTourIds,
      removeTourIds: removedTourIds,
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
      const response = await SeasonService.updateSeason(updateData);

      setSuccess(`Season "${editedSeason?.name}" updated successfully!`);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedSeason?.name} has been updated successfully.`,
        actionLink: `${SEASONS_PAGE_URL}/view?id=${selectedSeason?.id}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedSeason) {
          fetchSeasonDetails(selectedSeason.id);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update season");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update season. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalSeason) {
      setEditedSeason(originalSeason);
      setBasicDetailsChanged(false);
      setRemovedActivityIds([]);
      setAddedActivityIds([]);
      setRemovedTourIds([]);
      setAddedTourIds([]);
      setRemovedImageIds([]);
      setNewImages([]);
      setUpdatedImages([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearSeasonSelection = () => {
    setSelectedSeason(null);
    setOriginalSeason(null);
    setEditedSeason(null);
    setToast(null);
    updateUrlWithSelectedSeason(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalSeason || !editedSeason) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "name", label: "Season Name" },
      { key: "standardName", label: "Standard Name" },
      { key: "localName", label: "Local Name" },
      { key: "description", label: "Description" },
      { key: "weatherSummary", label: "Weather Summary" },
      { key: "rainfallPattern", label: "Rainfall Pattern" },
      { key: "monsoonType", label: "Monsoon Type" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalSeason[key as keyof SeasonDetails];
      const newValue = editedSeason[key as keyof SeasonDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalSeason.startMonth !== editedSeason.startMonth) {
      const oldMonth =
        MONTHS.find((m) => m.value === originalSeason.startMonth)?.label ||
        originalSeason.startMonth;
      const newMonth =
        MONTHS.find((m) => m.value === editedSeason.startMonth)?.label ||
        editedSeason.startMonth;
      changes.push({
        field: "Start Month",
        oldValue: oldMonth,
        newValue: newMonth,
      });
    }
    if (originalSeason.endMonth !== editedSeason.endMonth) {
      const oldMonth =
        MONTHS.find((m) => m.value === originalSeason.endMonth)?.label ||
        originalSeason.endMonth;
      const newMonth =
        MONTHS.find((m) => m.value === editedSeason.endMonth)?.label ||
        editedSeason.endMonth;
      changes.push({
        field: "End Month",
        oldValue: oldMonth,
        newValue: newMonth,
      });
    }
    if (originalSeason.temperatureMin !== editedSeason.temperatureMin) {
      changes.push({
        field: "Min Temperature",
        oldValue: `${originalSeason.temperatureMin}°C`,
        newValue: `${editedSeason.temperatureMin}°C`,
      });
    }
    if (originalSeason.temperatureMax !== editedSeason.temperatureMax) {
      changes.push({
        field: "Max Temperature",
        oldValue: `${originalSeason.temperatureMax}°C`,
        newValue: `${editedSeason.temperatureMax}°C`,
      });
    }
    if (originalSeason.isPeak !== editedSeason.isPeak) {
      changes.push({
        field: "Peak Season",
        oldValue: originalSeason.isPeak ? "Yes" : "No",
        newValue: editedSeason.isPeak ? "Yes" : "No",
      });
    }
    if (originalSeason.displayOrder !== editedSeason.displayOrder) {
      changes.push({
        field: "Display Order",
        oldValue: originalSeason.displayOrder,
        newValue: editedSeason.displayOrder,
      });
    }
    if (originalSeason.status !== editedSeason.status) {
      const oldStatus =
        STATUS_OPTIONS.find((s) => s.value === originalSeason.status.toString())
          ?.label || originalSeason.status;
      const newStatus =
        STATUS_OPTIONS.find((s) => s.value === editedSeason.status.toString())
          ?.label || editedSeason.status;
      changes.push({
        field: "Status",
        oldValue: oldStatus,
        newValue: newStatus,
      });
    }

    if (removedActivityIds.length > 0 || addedActivityIds.length > 0) {
      changes.push({
        field: "Associated Activities",
        oldValue: originalSeason.activities.length,
        newValue: editedSeason.activities.length,
      });
    }

    if (removedTourIds.length > 0 || addedTourIds.length > 0) {
      changes.push({
        field: "Associated Tours",
        oldValue: originalSeason.tours.length,
        newValue: editedSeason.tours.length,
      });
    }

    if (
      removedImageIds.length > 0 ||
      newImages.length > 0 ||
      updatedImages.length > 0
    ) {
      changes.push({
        field: "Images",
        oldValue: originalSeason.seasonImages.length,
        newValue: editedSeason.seasonImages.length,
      });
    }

    return changes;
  };

  // Build search items from seasons
  const searchItems: SearchItem[] = seasons.map((season) => ({
    id: season.id,
    name: season.name,
  }));

  const selectedSearchItem = selectedSeason
    ? {
        id: selectedSeason.id,
        name: selectedSeason.name,
      }
    : null;

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Show loading state
  if (loading) {
    return (
      <CommonLoading
        message="Loading seasons..."
        subMessage="Please wait while we fetch available seasons"
        size="lg"
      />
    );
  }

  return (
    <motion.div
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
          actionText="View Season"
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
            title="Update Season"
            description="Edit and update existing season information"
            breadcrumbItems={SEASON_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedSeason && (
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
              Select Season to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectSeason(item.id as number, item.name)
              }
              onClearSelection={handleClearSeasonSelection}
              initialSearchTerm={initialSeasonName}
              placeholder="Search seasons..."
              title="Seasons"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Season Info Bar */}
        {selectedSeason && (
          <SelectedItemBar
            item={{
              id: selectedSeason.id,
              name: selectedSeason.name,
            }}
            onClear={handleClearSeasonSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Season"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading season details..."
            subMessage="Please wait while we fetch the season information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Season Details Form */}
        {editedSeason && selectedSeason && (
          <div className="space-y-6">
            {/* Basic Information Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <button
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("basic")
                    ? `${theme.primary}05`
                    : "transparent",
                  borderBottom: expandedSections.has("basic")
                    ? `1px solid ${theme.border}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Basic Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Core details about the season (editable)
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("basic")
                      ? "rotate(180deg)"
                      : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("basic") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6 space-y-5"
                  >
                    {/* Season Names */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          Season Name{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={editedSeason.name}
                          onChange={(e) =>
                            handleBasicFieldChange("name", e.target.value)
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{
                            ...fieldBase,
                            borderColor: basicDetailsChanged
                              ? theme.primary
                              : theme.border,
                          }}
                          placeholder="e.g., Summer Season"
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          Standard Name
                        </label>
                        <input
                          type="text"
                          value={editedSeason.standardName}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "standardName",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="e.g., Dry Season"
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          Local Name
                        </label>
                        <input
                          type="text"
                          value={editedSeason.localName}
                          onChange={(e) =>
                            handleBasicFieldChange("localName", e.target.value)
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="e.g., Grishma Ruthu"
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editedSeason.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Season description..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Month Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Start Month{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <select
                          value={editedSeason.startMonth}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "startMonth",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        >
                          {MONTHS.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          End Month{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <select
                          value={editedSeason.endMonth}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "endMonth",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        >
                          {MONTHS.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Weather Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Thermometer className="w-3.5 h-3.5" />
                          Min Temperature (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editedSeason.temperatureMin}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "temperatureMin",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Thermometer className="w-3.5 h-3.5" />
                          Max Temperature (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editedSeason.temperatureMax}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "temperatureMax",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <CloudRain className="w-3.5 h-3.5" />
                        Rainfall Pattern
                      </label>
                      <textarea
                        value={editedSeason.rainfallPattern}
                        onChange={(e) =>
                          handleBasicFieldChange(
                            "rainfallPattern",
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Describe the rainfall pattern..."
                        {...focusHandlers}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <Wind className="w-3.5 h-3.5" />
                        Weather Summary
                      </label>
                      <textarea
                        value={editedSeason.weatherSummary}
                        onChange={(e) =>
                          handleBasicFieldChange(
                            "weatherSummary",
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Summary of weather conditions..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Monsoon Type */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <Wind className="w-3.5 h-3.5" />
                        Monsoon Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {MONSOON_TYPES.map((type) => {
                          const isSelected =
                            editedSeason.monsoonType === type.value;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange(
                                  "monsoonType",
                                  type.value,
                                )
                              }
                              className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? `${theme.primary}10`
                                  : theme.background,
                                borderColor: isSelected
                                  ? theme.primary
                                  : theme.border,
                              }}
                            >
                              <span
                                className="text-sm font-medium"
                                style={{
                                  color: isSelected
                                    ? theme.primary
                                    : theme.text,
                                }}
                              >
                                {type.label}
                              </span>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                {type.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Peak Season & Display Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editedSeason.isPeak}
                            onChange={(e) =>
                              handleBasicFieldChange("isPeak", e.target.checked)
                            }
                            className="w-4 h-4 rounded"
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: theme.textSecondary }}
                          >
                            Peak Season
                          </span>
                          {editedSeason.isPeak && (
                            <Star
                              className="w-3.5 h-3.5"
                              style={{
                                color: theme.warning,
                                fill: theme.warning,
                              }}
                            />
                          )}
                        </label>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editedSeason.displayOrder}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "displayOrder",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {STATUS_OPTIONS.map((opt) => {
                          const isSelected =
                            editedSeason.status.toString() === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange(
                                  "status",
                                  parseInt(opt.value),
                                )
                              }
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? `${opt.color}10`
                                  : theme.background,
                                borderColor: isSelected
                                  ? opt.color
                                  : theme.border,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: opt.color }}
                              />
                              <div className="flex-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected ? opt.color : theme.text,
                                  }}
                                >
                                  {opt.label}
                                </span>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {opt.description}
                                </p>
                              </div>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4"
                                  style={{ color: opt.color }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Read-only Season Details Components */}
            <SeasonReadOnlyDetails
              season={editedSeason}
              allActivities={allActivities}
              allTours={allTours}
              loadingActivities={loadingActivities}
              loadingTours={loadingTours}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onAddTour={handleAddTour}
              onRemoveTour={handleRemoveTour}
              onRemoveImage={handleRemoveImage}
              onAddNewImage={handleAddNewImage}
              onUpdateImage={handleUpdateImage}
              uploadingImages={uploadingImages}
              theme={theme}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedSeason && originalSeason && (
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
                {loadingUpdate ? "Updating..." : "Update Season"}
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
                      Click "Update Season" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalSeason && editedSeason && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedSeason.name}
            changedFields={getChangedFields()}
            confirmText="Update Season"
            cancelText="Cancel"
            title="Confirm Season Update"
            message={`You are about to update "${editedSeason.name}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateSeasonPage;
