"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SeasonService } from "@/services/seasonService";
import { SeasonDetails, SeasonImage } from "@/types/season-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal from "@/components/common-components/ImageModal";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Calendar,
  Clock,
  CloudRain,
  Thermometer,
  Image,
  Activity,
  MapPin,
  Star,
} from "lucide-react";
import {
  SEASONS_VIEW_PAGE_URL,
  SEASON_UPDATE_PAGE_URL,
  SEASON_TERMINATE_PAGE_URL,
  ACTIVITIES_VIEW_PAGE_URL,
  TOURS_VIEW_PAGE_URL,
} from "@/utils/urls";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { ImageModalImage } from "@/types/common-components-types";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { SeasonOverview } from "@/components/season-components/season-details-view-components/SeasonOverview";
import { SeasonWeatherInfo } from "@/components/season-components/season-details-view-components/SeasonWeatherInfo";
import { SeasonActivitiesList } from "@/components/season-components/season-details-view-components/SeasonActivitiesList";
import { SeasonToursList } from "@/components/season-components/season-details-view-components/SeasonToursList";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { SEASON_VIEW_DETAILS_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { getMonthName } from "@/utils/commonFunctions";
import { hexToRgba } from "@/utils/functions";

const SeasonDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const seasonId = parseInt(params?.seasonId as string);

  const [season, setSeason] = useState<SeasonDetails | null>(null);
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
    ...SEASON_VIEW_DETAILS_PAGE_BREADCRUMB_DATA,
    {
      label: season?.name || "Details",
      href: `${SEASONS_VIEW_PAGE_URL}/${seasonId}`,
    },
  ];

  useEffect(() => {
    if (seasonId) fetchSeason();
    return () => resetGallery();
  }, [seasonId]);

  const fetchSeason = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SeasonService.getSeasonDetails(seasonId);
      setSeason(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load season details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!season) return [];
    return season.seasonImages.map((img: SeasonImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.id,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!season) return [];
    return season.seasonImages.map((img: SeasonImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.id,
    }));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(SEASONS_VIEW_PAGE_URL);
    }
  };
  const handleEdit = () =>
    router.push(`${SEASON_UPDATE_PAGE_URL}/${seasonId}?name=${season?.name}`);

  const handleDelete = () =>
    router.push(
      `${SEASON_TERMINATE_PAGE_URL}/${seasonId}?name=${season?.name}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: season?.name,
        text: season?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewActivity = (activityId: number) => {
    router.push(`${ACTIVITIES_VIEW_PAGE_URL}/${activityId}`);
  };

  const handleViewTour = (tourId: number) => {
    router.push(`${TOURS_VIEW_PAGE_URL}/${tourId}`);
  };

  // Status badge component
  const StatusBadge = () => {
    if (!season) return null;
    const isActive = season.status === 1;
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {season.status === 1 ? "ACTIVE" : "INACTIVE"}
      </span>
    );
  };

  // Peak badge component
  const PeakBadge = () => {
    if (!season) return null;
    if (!season.isPeak) return null;
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm bg-amber-500/80">
        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        <span className="text-white text-[10px] sm:text-xs font-medium">
          Peak Season
        </span>
      </div>
    );
  };

  // Get monsoon type color
  const getMonsoonTypeColor = (type: string): string => {
    switch (type?.toLowerCase()) {
      case "northeast monsoon":
        return "#3b82f6";
      case "southwest monsoon":
        return "#10b981";
      case "inter-monsoon":
        return "#f59e0b";
      default:
        return theme.primary;
    }
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Season Period",
      value: `${getMonthName(season?.startMonth || 1)} - ${getMonthName(season?.endMonth || 12)}`,
      icon: Calendar,
      color: theme.primary,
    },
    {
      label: "Temperature Range",
      value: `${season?.temperatureMin || 0}°C - ${season?.temperatureMax || 0}°C`,
      icon: Thermometer,
      color: season?.isPeak ? theme.warning : theme.success,
    },
    {
      label: "Monsoon Type",
      value: season?.monsoonType || "N/A",
      icon: CloudRain,
      color: getMonsoonTypeColor(season?.monsoonType || ""),
    },
    {
      label: "Activities",
      value: season?.activities?.length || 0,
      icon: Activity,
      color: theme.accent || theme.primary,
    },
    {
      label: "Tours",
      value: season?.tours?.length || 0,
      icon: MapPin,
      color: theme.primary,
    },
    {
      label: "Images",
      value: season?.seasonImages?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Display Order",
      value: season?.displayOrder?.toString() || "0",
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Created At",
      value: new Date(season?.createdAt || "").toLocaleDateString(),
      icon: Calendar,
      date: season?.createdAt,
      color: theme.success,
    },
    {
      label: "Updated At",
      value: new Date(season?.updatedAt || "").toLocaleDateString(),
      icon: Clock,
      date: season?.updatedAt,
      color: theme.primary,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${season?.name}" season details...`}
        subMessage="Fetching season information"
        size="lg"
      />
    );

  if (error || !season) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Season"
        message="The season couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchSeason}
        backButtonText="Back to Seasons"
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
            title={season.name}
            description={`Season ID: ${season.id}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={season.name}
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
              onPrev={() => handlePrevImage(season.seasonImages.length)}
              onNext={() => handleNextImage(season.seasonImages.length)}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              topRightBadge={<PeakBadge />}
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

            <SeasonOverview
              name={season.name}
              standardName={season.standardName}
              localName={season.localName}
              description={season.description}
              startMonth={season.startMonth}
              endMonth={season.endMonth}
              isPeak={season.isPeak}
              displayOrder={season.displayOrder}
            />

            <SeasonWeatherInfo
              temperatureMin={season.temperatureMin}
              temperatureMax={season.temperatureMax}
              weatherSummary={season.weatherSummary}
              rainfallPattern={season.rainfallPattern}
              monsoonType={season.monsoonType}
            />

            <SeasonActivitiesList
              activities={season.activities || []}
              onViewActivity={handleViewActivity}
            />

            <SeasonToursList
              tours={season.tours || []}
              onViewTour={handleViewTour}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Season Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Additional Info"
              description="Display order and timestamps"
              showCreatedAt={false}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Season Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && season && (
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

      {isExpandedGalleryOpen && season && (
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

export default SeasonDetailsViewPage;
