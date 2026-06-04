"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TourService } from "@/services/tourService";
import { TourAllDetails, TourImage } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal from "@/components/common-components/ImageModal";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import { TourQuickStats } from "@/components/tours-components/tour-details-view-components/TourQuickStats";
import { TourScheduleList } from "@/components/tours-components/tour-details-view-components/TourScheduleList";
import { TourDayByDay } from "@/components/tours-components/tour-details-view-components/TourDayByDay";
import { TourInclusionsExclusions } from "@/components/tours-components/tour-details-view-components/TourInclusionsExclusions";
import { TourConditionsTips } from "@/components/tours-components/tour-details-view-components/TourConditionsTips";
import { TourLocationMap } from "@/components/tours-components/tour-details-view-components/TourLocationMap";
import {
  TOUR_TERMINATE_PAGE_URL,
  TOUR_UPDATE_PAGE_URL,
  TOURS_VIEW_PAGE_URL,
} from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { TourOverview } from "@/components/tours-components/tour-details-view-components/TourOverview";
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_DETAILS_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const TourDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const tourId = parseInt(params?.tourId as string);

  const [tour, setTour] = useState<TourAllDetails | null>(null);
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
    ...TOUR_DETAILS_VIEW_PAGE_BREADCRUMB_DATA,
    {
      label: tour?.tourName || "Details",
      href: `${TOURS_VIEW_PAGE_URL}/${tourId}`,
    },
  ];

  useEffect(() => {
    if (tourId) fetchTour();
    return () => resetGallery();
  }, [tourId]);

  const fetchTour = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TourService.getTourAllDetails(tourId);
      setTour(response.data);
    } catch {
      setError("Failed to load tour details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!tour) return [];
    return tour.images.map((img: TourImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!tour) return [];
    return tour.images.map((img: TourImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.back();

  const handleEdit = () =>
    router.push(`${TOUR_UPDATE_PAGE_URL}/${tourId}?name=${tour?.tourName}`);

  const handleDelete = () =>
    router.push(`${TOUR_TERMINATE_PAGE_URL}/${tourId}?name=${tour?.tourName}`);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour?.tourName,
        text: tour?.tourDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!tour) return null;
    const isActive = tour.statusName === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {tour.statusName}
      </span>
    );
  };

  // Calculate stats
  const totalImages = tour?.images?.length ?? 0;
  const totalSchedules = tour?.schedules?.length ?? 0;
  const totalInclusions = tour?.inclusions?.length ?? 0;
  const totalExclusions = tour?.exclusions?.length ?? 0;
  const totalDays = tour?.dayToDayResponses?.length ?? 0;
  const totalDestinations =
    tour?.dayToDayResponses?.reduce(
      (acc, day) => acc + (day.destinations?.length ?? 0),
      0,
    ) ?? 0;
  const totalActivities =
    tour?.dayToDayResponses?.reduce(
      (acc, day) =>
        acc +
        (day.destinations?.reduce(
          (sum, dest) => sum + (dest.activities?.length ?? 0),
          0,
        ) ?? 0),
      0,
    ) ?? 0;

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${tour?.tourName}" tour details...`}
        subMessage="Preparing your tour information"
        size="lg"
      />
    );

  if (error || !tour) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Tour"
        message="The tour couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchTour}
        backButtonText="Back to Tours"
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
            title={tour.tourName}
            description={`Tour ID: ${tour.tourId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={tour.tourName}
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
              onPrev={() => handlePrevImage(tour.images.length)}
              onNext={() => handleNextImage(tour.images.length)}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
            />

            <TourOverview
              description={tour.tourDescription}
              tourTypeDtos={tour.tourTypeDtos}
              tourCategoryDto={tour.tourCategoryDto}
              seasonName={tour.seasonName}
              seasonDescription={tour.seasonDescription}
              startLocation={tour.startLocation}
              endLocation={tour.endLocation}
              duration={tour.duration}
              assignToName={tour.assignToName}
              assignMessage={tour.assignMessage}
            />

            <TourScheduleList schedules={tour.schedules || []} />

            <TourDayByDay dayToDayResponses={tour.dayToDayResponses || []} />

            <TourInclusionsExclusions
              inclusions={tour.inclusions || []}
              exclusions={tour.exclusions || []}
            />

            <TourConditionsTips
              conditions={tour.conditions || []}
              travelTips={tour.travelTips || []}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <TourQuickStats
              duration={tour.duration}
              totalDays={totalDays}
              totalDestinations={totalDestinations}
              totalActivities={totalActivities}
              totalSchedules={totalSchedules}
              totalInclusions={totalInclusions}
              totalExclusions={totalExclusions}
              totalImages={totalImages}
              status={tour.statusName}
              tourTypeDtos={tour.tourTypeDtos}
              tourCategoryDto={tour.tourCategoryDto}
              seasonName={tour.seasonName}
            />

            <TourLocationMap
              latitude={tour.latitude}
              longitude={tour.longitude}
              startLocation={tour.startLocation}
              endLocation={tour.endLocation}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Tour Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && tour && (
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

      {isExpandedGalleryOpen && tour && (
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

export default TourDetailsViewPage;
