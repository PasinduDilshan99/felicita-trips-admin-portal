// app/activity-schedules/view/[scheduleId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { ActivityScheduleService } from "@/services/activityScheduleService";
import {
  ActivityScheduleDetails,
  ActivityScheduleImage,
} from "@/types/activity-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";

// Import sub-components
import { ActivityScheduleOverview } from "@/components/activity-schedules-components/activity-schedule-details-view-components/ActivityScheduleOverview";
import { ActivityScheduleRelatedInfo } from "@/components/activity-schedules-components/activity-schedule-details-view-components/ActivityScheduleRelatedInfo";

// Icons
import {
  Calendar,
  Clock,
  Activity,
  Tag,
  Image,
  CheckCircle,
  AlertCircle,
  User,
  DollarSign,
  Users,
} from "lucide-react";

// Constants for routing
import {
  ACTIVITIES_VIEW_PAGE_URL,
  DESTINATIONS_VIEW_PAGE_URL,
  TOURS_VIEW_PAGE_URL,
  PACKAGES_VIEW_PAGE_URL,
} from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { ActivityScheduleCategories } from "@/components/activity-schedules-components/activity-schedule-details-view-components/ActivityScheduleCategories";

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ActivityScheduleDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scheduleId = parseInt(params?.scheduleId as string);

  const [activitySchedule, setActivitySchedule] =
    useState<ActivityScheduleDetails | null>(null);
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
    { label: "Activity Schedules", href: ACTIVITIES_VIEW_PAGE_URL },
    { label: "View", href: ACTIVITIES_VIEW_PAGE_URL },
    {
      label: activitySchedule?.activityScheduleName || "Details",
      href: `${ACTIVITIES_VIEW_PAGE_URL}/${scheduleId}`,
    },
  ];

  useEffect(() => {
    if (scheduleId) fetchActivitySchedule();
    return () => resetGallery();
  }, [scheduleId]);

  const fetchActivitySchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await ActivityScheduleService.getActivityScheduleDetails(scheduleId);
      setActivitySchedule(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load activity schedule details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!activitySchedule?.images?.length) return [];
    return activitySchedule.images.map((img: ActivityScheduleImage) => ({
      url: img.image_url,
      name: img.name,
      description: img.description || undefined,
      id: img.id,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!activitySchedule?.images?.length) return [];
    return activitySchedule.images.map((img: ActivityScheduleImage) => ({
      url: img.image_url,
      name: img.name,
      description: img.description || undefined,
      id: img.id,
    }));
  };

  const handleBack = () => router.push(ACTIVITIES_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${scheduleId}?name=${activitySchedule?.activityScheduleName}`,
    );

  const handleDelete = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${scheduleId}?name=${activitySchedule?.activityScheduleName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activitySchedule?.activityScheduleName,
        text: activitySchedule?.scheduleDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewActivity = () => {
    if (activitySchedule?.activityId) {
      router.push(`${ACTIVITIES_VIEW_PAGE_URL}/${activitySchedule.activityId}`);
    }
  };

  const handleViewDestination = () => {
    if (activitySchedule?.destinationId) {
      router.push(
        `${DESTINATIONS_VIEW_PAGE_URL}/${activitySchedule.destinationId}`,
      );
    }
  };

  const handleViewTour = () => {
    if (activitySchedule?.tourId) {
      router.push(`${TOURS_VIEW_PAGE_URL}/${activitySchedule.tourId}`);
    }
  };

  const handleViewTourSchedule = () => {
    if (activitySchedule?.tourScheduleId) {
      router.push(
        `${ACTIVITIES_VIEW_PAGE_URL}/${activitySchedule.tourScheduleId}`,
      );
    }
  };

  const handleViewPackage = () => {
    if (activitySchedule?.packageId) {
      router.push(`${PACKAGES_VIEW_PAGE_URL}/${activitySchedule.packageId}`);
    }
  };

  const handleViewPackageSchedule = () => {
    if (activitySchedule?.packageScheduleId) {
      router.push(
        `${ACTIVITIES_VIEW_PAGE_URL}/${activitySchedule.packageScheduleId}`,
      );
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!activitySchedule) return null;
    const isActive = activitySchedule.scheduleStatus === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {activitySchedule.scheduleStatus}
      </span>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Duration Range",
      value: `${activitySchedule?.scheduleDurationHoursStart || 0} - ${activitySchedule?.scheduleDurationHoursEnd || 0} hours`,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Price (Local)",
      value: `$${activitySchedule?.priceLocal?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: theme.success,
    },
    {
      label: "Price (Foreigners)",
      value: `$${activitySchedule?.priceForeigners?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: theme.primary,
    },
    {
      label: "Participant Range",
      value: `${activitySchedule?.minParticipate || 0} - ${activitySchedule?.maxParticipate || 0} persons`,
      icon: Users,
      color: theme.warning,
    },
    {
      label: "Categories",
      value: activitySchedule?.activityCategoryDtos?.length || 0,
      icon: Tag,
      color: theme.accent || theme.primary,
    },
    {
      label: "Images",
      value: activitySchedule?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Schedule Created",
      value: new Date(
        activitySchedule?.scheduleCreatedAt || "",
      ).toLocaleDateString(),
      icon: Calendar,
      date: activitySchedule?.scheduleCreatedAt,
      color: theme.success,
    },
    {
      label: "Schedule Updated",
      value: new Date(
        activitySchedule?.scheduleUpdatedAt || "",
      ).toLocaleDateString(),
      icon: Clock,
      date: activitySchedule?.scheduleUpdatedAt,
      color: theme.primary,
    },
    {
      label: "Activity Created",
      value: new Date(
        activitySchedule?.activityCreatedAt || "",
      ).toLocaleDateString(),
      icon: Calendar,
      date: activitySchedule?.activityCreatedAt,
      color: theme.success,
    },
    {
      label: "Activity Updated",
      value: new Date(
        activitySchedule?.activityUpdatedAt || "",
      ).toLocaleDateString(),
      icon: Clock,
      date: activitySchedule?.activityUpdatedAt,
      color: theme.primary,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${activitySchedule?.activityScheduleName}" schedule details...`}
        subMessage="Fetching activity schedule information"
        size="lg"
      />
    );

  if (error || !activitySchedule) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Activity Schedule"
        message="The activity schedule couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchActivitySchedule}
        backButtonText="Back to Activity Schedules"
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
            title={activitySchedule.activityScheduleName}
            description={`Schedule ID: ${activitySchedule.activityScheduleId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={activitySchedule.activityScheduleName}
          showShare={true}
          showEdit={true}
          showDelete={true}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <CommonHeroImage
              images={getGalleryImages()}
              currentIndex={currentIndex}
              onPrev={() =>
                handlePrevImage(activitySchedule.images?.length || 0)
              }
              onNext={() =>
                handleNextImage(activitySchedule.images?.length || 0)
              }
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
              fallbackIcon={
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                >
                  <Activity
                    className="w-10 h-10"
                    style={{ color: theme.primary }}
                  />
                </div>
              }
            />

            <ActivityScheduleOverview
              name={activitySchedule.activityScheduleName}
              description={activitySchedule.scheduleDescription}
              assumeStartDate={activitySchedule.scheduleAssumeStartDate}
              assumeEndDate={activitySchedule.scheduleAssumeEndDate}
              durationStart={activitySchedule.scheduleDurationHoursStart}
              durationEnd={activitySchedule.scheduleDurationHoursEnd}
              specialNote={activitySchedule.scheduleSpecialNote}
            />

            <ActivityScheduleCategories
              categories={activitySchedule.activityCategoryDtos || []}
            />

            <ActivityScheduleRelatedInfo
              activityId={activitySchedule.activityId}
              activityName={activitySchedule.activityName}
              activityDescription={activitySchedule.activityDescription}
              activityStatus={activitySchedule.activityStatus}
              durationHours={activitySchedule.durationHours}
              availableFrom={activitySchedule.availableFrom}
              availableTo={activitySchedule.availableTo}
              priceLocal={activitySchedule.priceLocal}
              priceForeigners={activitySchedule.priceForeigners}
              minParticipate={activitySchedule.minParticipate}
              maxParticipate={activitySchedule.maxParticipate}
              season={activitySchedule.season}
              destinationId={activitySchedule.destinationId}
              destinationName={activitySchedule.destinationName}
              tourId={activitySchedule.tourId}
              tourName={activitySchedule.tourName}
              tourDescription={activitySchedule.tourDescription}
              tourDuration={activitySchedule.tourDuration}
              startLocation={activitySchedule.startLocation}
              endLocation={activitySchedule.endLocation}
              tourStatus={activitySchedule.tourStatus}
              tourScheduleId={activitySchedule.tourScheduleId}
              tourScheduleName={activitySchedule.tourScheduleName}
              tourScheduleStartDate={activitySchedule.tourScheduleStartDate}
              tourScheduleEndDate={activitySchedule.tourScheduleEndDate}
              tourScheduleDurationStart={
                activitySchedule.tourScheduleDurationStart
              }
              tourScheduleDurationEnd={activitySchedule.tourScheduleDurationEnd}
              tourScheduleStatus={activitySchedule.tourScheduleStatus}
              packageId={activitySchedule.packageId}
              packageName={activitySchedule.packageName}
              packageDescription={activitySchedule.packageDescription}
              totalPrice={activitySchedule.totalPrice}
              discountPercentage={activitySchedule.discountPercentage}
              pricePerPerson={activitySchedule.pricePerPerson}
              minPersonCount={activitySchedule.minPersonCount}
              maxPersonCount={activitySchedule.maxPersonCount}
              packageStatus={activitySchedule.packageStatus}
              packageScheduleId={activitySchedule.packageScheduleId}
              packageScheduleName={activitySchedule.packageScheduleName}
              packageScheduleStartDate={
                activitySchedule.packageScheduleStartDate
              }
              packageScheduleEndDate={activitySchedule.packageScheduleEndDate}
              packageScheduleDurationStart={
                activitySchedule.packageScheduleDurationStart
              }
              packageScheduleDurationEnd={
                activitySchedule.packageScheduleDurationEnd
              }
              packageScheduleStatus={activitySchedule.packageScheduleStatus}
              onViewActivity={handleViewActivity}
              onViewDestination={handleViewDestination}
              onViewTour={handleViewTour}
              onViewTourSchedule={handleViewTourSchedule}
              onViewPackage={handleViewPackage}
              onViewPackageSchedule={handleViewPackageSchedule}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Schedule Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Timeline"
              description="Creation and modification dates"
              showCreatedAt={false}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Activity Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && activitySchedule?.images?.length && (
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

      {isExpandedGalleryOpen && activitySchedule?.images?.length && (
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

export default ActivityScheduleDetailsViewPage;
