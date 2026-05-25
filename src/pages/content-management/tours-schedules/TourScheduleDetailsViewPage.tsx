// app/tour-schedules/view/[scheduleId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { TourScheduleService } from "@/services/tourScheduleService";
import {
  TourScheduleDetails,
  TourScheduleImage,
} from "@/types/tour-schedule-types";
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
import { TourScheduleAccommodations } from "@/components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleAccommodations";
import { TourScheduleCategoriesTypes } from "@/components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleCategoriesTypes";
import { TourScheduleTourInfo } from "@/components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleTourInfo";

// Icons
import {
  Calendar,
  Clock,
  Tag,
  Image,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  Building,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Hotel,
  Bus,
  FileText,
} from "lucide-react";

// Constants for routing
import { TOURS_VIEW_PAGE_URL } from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { TourScheduleOverview } from "@/components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleOverview";

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TourScheduleDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scheduleId = parseInt(params?.scheduleId as string);

  const [tourSchedule, setTourSchedule] = useState<TourScheduleDetails | null>(
    null,
  );
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
    { label: "Tour Schedules", href: TOURS_VIEW_PAGE_URL },
    { label: "View", href: TOURS_VIEW_PAGE_URL },
    {
      label: tourSchedule?.tourScheduleName || "Details",
      href: `${TOURS_VIEW_PAGE_URL}/${scheduleId}`,
    },
  ];

  useEffect(() => {
    if (scheduleId) fetchTourSchedule();
    return () => resetGallery();
  }, [scheduleId]);

  const fetchTourSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await TourScheduleService.getTourScheduleDetails(scheduleId);
      setTourSchedule(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load tour schedule details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!tourSchedule) return [];
    return tourSchedule.images.map((img: TourScheduleImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!tourSchedule) return [];
    return tourSchedule.images.map((img: TourScheduleImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.push(TOURS_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${TOURS_VIEW_PAGE_URL}/${scheduleId}?name=${tourSchedule?.tourScheduleName}`,
    );

  const handleDelete = () =>
    router.push(
      `${TOURS_VIEW_PAGE_URL}/${scheduleId}?name=${tourSchedule?.tourScheduleName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tourSchedule?.tourScheduleName,
        text: tourSchedule?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewTour = () => {
    if (tourSchedule?.tourId) {
      router.push(`${TOURS_VIEW_PAGE_URL}/${tourSchedule.tourId}`);
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!tourSchedule) return null;
    const isActive = tourSchedule.scheduleStatus === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {tourSchedule.scheduleStatus}
      </span>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Duration Range",
      value: `${tourSchedule?.durationStart} - ${tourSchedule?.durationEnd} days`,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Categories",
      value: tourSchedule?.categories?.length || 0,
      icon: Tag,
      color: theme.accent || theme.primary,
    },
    {
      label: "Types",
      value: tourSchedule?.types?.length || 0,
      icon: Tag,
      color: theme.primary,
    },
    {
      label: "Accommodations",
      value: tourSchedule?.accommodations?.length || 0,
      icon: Hotel,
      color: theme.success,
    },
    {
      label: "Total Images",
      value: tourSchedule?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Schedule Created",
      value: new Date(tourSchedule?.createdAt || "").toLocaleDateString(),
      icon: Calendar,
      date: tourSchedule?.createdAt,
      color: theme.success,
    },
    {
      label: "Schedule Updated",
      value: new Date(tourSchedule?.updatedAt || "").toLocaleDateString(),
      icon: Clock,
      date: tourSchedule?.updatedAt,
      color: theme.primary,
    },
    {
      label: "Tour Created",
      value: new Date(tourSchedule?.tourCreatedAt || "").toLocaleDateString(),
      icon: Calendar,
      date: tourSchedule?.tourCreatedAt,
      color: theme.success,
    },
    {
      label: "Tour Updated",
      value: new Date(tourSchedule?.tourUpdatedAt || "").toLocaleDateString(),
      icon: Clock,
      date: tourSchedule?.tourUpdatedAt,
      color: theme.primary,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${tourSchedule?.tourScheduleName}" schedule details...`}
        subMessage="Fetching tour schedule information"
        size="lg"
      />
    );

  if (error || !tourSchedule) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Tour Schedule"
        message="The tour schedule couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchTourSchedule}
        backButtonText="Back to Tour Schedules"
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
            title={tourSchedule.tourScheduleName}
            description={`Schedule ID: ${tourSchedule.tourScheduleId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={tourSchedule.tourScheduleName}
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
              onPrev={() => handlePrevImage(tourSchedule.images.length)}
              onNext={() => handleNextImage(tourSchedule.images.length)}
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
                  <Calendar
                    className="w-10 h-10"
                    style={{ color: theme.primary }}
                  />
                </div>
              }
            />

            <TourScheduleOverview
              name={tourSchedule.tourScheduleName}
              description={tourSchedule.description}
              assumeStartDate={tourSchedule.assumeStartDate}
              assumeEndDate={tourSchedule.assumeEndDate}
              durationStart={tourSchedule.durationStart}
              durationEnd={tourSchedule.durationEnd}
              specialNote={tourSchedule.specialNote}
            />

            <TourScheduleAccommodations
              accommodations={tourSchedule.accommodations || []}
            />

            <TourScheduleCategoriesTypes
              categories={tourSchedule.categories || []}
              types={tourSchedule.types || []}
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

            <TourScheduleTourInfo
              tourId={tourSchedule.tourId}
              tourName={tourSchedule.tourName}
              tourDescription={tourSchedule.tourDescription}
              tourDuration={tourSchedule.tourDuration}
              startLocation={tourSchedule.startLocation}
              endLocation={tourSchedule.endLocation}
              latitude={tourSchedule.latitude}
              longitude={tourSchedule.longitude}
              season={tourSchedule.season}
              tourStatus={tourSchedule.tourStatus}
              assignMessage={tourSchedule.assignMessage}
              onViewTour={handleViewTour}
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
              title="Schedule Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && tourSchedule && (
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

      {isExpandedGalleryOpen && tourSchedule && (
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

export default TourScheduleDetailsViewPage;
