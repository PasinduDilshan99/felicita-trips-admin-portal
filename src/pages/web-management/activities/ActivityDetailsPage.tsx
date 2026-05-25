// app/activities/view/[activityId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { ActivityService } from "@/services/activityService";
import { Activity, ActivityImage } from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";

// Import sub-components
import { ActivityOverview } from "@/components/activities-components/activity-details-view-components/ActivityOverview";
import { ActivityPricing } from "@/components/activities-components/activity-details-view-components/ActivityPricing";
import { ActivityScheduleList } from "@/components/activities-components/activity-details-view-components/ActivityScheduleList";
import { ActivityRequirements } from "@/components/activities-components/activity-details-view-components/ActivityRequirements";
import { ActivityCategories } from "@/components/activities-components/activity-details-view-components/ActivityCategories";
import { ActivityQuickStats } from "@/components/activities-components/activity-details-view-components/ActivityQuickStats";

// Constants for routing
import {
  ACTIVITIES_VIEW_PAGE_URL,
  ACTIVITY_CATEGORIES_PAGE_URL,
} from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";

const ActivityDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const activityId = parseInt(params?.activityId as string);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentIndex,
    imgTransition,
    isModalOpen,
    isExpandedGalleryOpen,
    changeImage,
    handlePrevImage,
    handleNextImage,
    handleImageClick,
    handleModalClose,
    openExpandedGallery,
    closeExpandedGallery,
    resetGallery,
  } = useImageGallery({ initialIndex: 0 });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Activities", href: ACTIVITY_CATEGORIES_PAGE_URL },
    { label: "View", href: ACTIVITIES_VIEW_PAGE_URL },
    {
      label: activity?.name || "Details",
      href: `${ACTIVITIES_VIEW_PAGE_URL}/${activityId}`,
    },
  ];

  useEffect(() => {
    if (activityId) fetchActivity();
    return () => resetGallery();
  }, [activityId]);

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ActivityService.getActivityById(activityId);
      setActivity(response.data);
    } catch {
      setError("Failed to load activity details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!activity) return [];
    return activity.images.map((img: ActivityImage) => ({
      url: img.image_url,
      name: img.name,
      description: img.description,
      id: img.id,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!activity) return [];
    return activity.images.map((img: ActivityImage) => ({
      url: img.image_url,
      name: img.name,
      description: img.description,
      id: img.id,
    }));
  };

  const handleBack = () => router.push(ACTIVITIES_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${activityId}?name=${activity?.name}`,
    );

  const handleDelete = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${activityId}?name=${activity?.name}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity?.name,
        text: activity?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!activity) return null;
    const isActive = activity.status === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {activity.status}
      </span>
    );
  };

  // Calculate stats
  const totalSchedules = activity?.schedules?.length ?? 0;
  const totalRequirements = activity?.requirements?.length ?? 0;
  const totalImages = activity?.images?.length ?? 0;
  const priceRange = activity
    ? `$${activity.price_local} - $${activity.price_foreigners}`
    : "N/A";

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${activity?.name}" activity details...`}
        subMessage="Preparing activity information"
        size="lg"
      />
    );

  if (error || !activity) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Activity"
        message="The activity couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchActivity}
        backButtonText="Back to Activities"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={activity.name}
            description={`Activity ID: ${activity.id} • ${activity.destinationName}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={activity.name}
          showShare={true}
          showEdit={true}
          showDelete={true}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <CommonHeroImage
              images={getGalleryImages()}
              currentIndex={currentIndex}
              onPrev={() => handlePrevImage(activity.images.length)}
              onNext={() => handleNextImage(activity.images.length)}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
            />

            <ActivityOverview
              name={activity.name}
              description={activity.description}
              destinationName={activity.destinationName}
              availableFrom={activity.available_from}
              availableTo={activity.available_to}
              durationHours={activity.duration_hours}
            />

            <ActivityPricing
              priceLocal={activity.price_local}
              priceForeigners={activity.price_foreigners}
              minParticipants={activity.min_participate}
              maxParticipants={activity.max_participate}
            />

            <ActivityScheduleList schedules={activity.schedules || []} />

            <ActivityRequirements requirements={activity.requirements || []} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <ActivityQuickStats
              totalSchedules={totalSchedules}
              totalRequirements={totalRequirements}
              totalImages={totalImages}
              durationHours={activity.duration_hours}
              priceRange={priceRange}
              seasonName={activity.seasonName}
              status={activity.status}
            />

            <ActivityCategories
              categories={activity.activities_category || []}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && activity && (
        <ImageModal
          isOpen={isModalOpen}
          images={getModalImages()}
          initialIndex={currentIndex}
          onClose={handleModalClose}
          showNavigation={true}
          showDownload={true}
          showZoom={true}
          allowKeyboardNavigation={true}
        />
      )}

      {isExpandedGalleryOpen && activity && (
        <CommonExpandedGallery
          images={getGalleryImages()}
          onClose={closeExpandedGallery}
          onImageClick={(index) => {
            handleImageClick(index);
            closeExpandedGallery();
          }}
          showFullSizeButton={true}
          fullSizeButtonText="Open Full Size Viewer"
          allowKeyboardNavigation={true}
          showImageInfo={true}
        />
      )}
    </div>
  );
};

export default ActivityDetailsPage;
