// app/tour-types/view/[typeId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { TourTypeService } from "@/services/tourTypeService";
import { TourTypeDetails, TourTypeImage } from "@/types/tour-type-types";
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
import { TourTypeToursList } from "@/components/tour-types-components/tour-type-details-components/TourTypeToursList";

import { TOUR_TYPES_PAGE_URL } from "@/utils/urls";
import { TourTypeOverview } from "@/components/tour-types-components/tour-type-details-components/TourTypeOverview";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { Package, Image, CheckCircle, XCircle, AlertCircle, User, Clock, UserX } from "lucide-react";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TourTypeDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const typeId = parseInt(params?.typeId as string);

  const [tourType, setTourType] = useState<TourTypeDetails | null>(null);
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
    { label: "Tour Types", href: TOUR_TYPES_PAGE_URL },
    { label: "View", href: TOUR_TYPES_PAGE_URL },
    {
      label: tourType?.typeName || "Details",
      href: `${TOUR_TYPES_PAGE_URL}/${typeId}`,
    },
  ];

  useEffect(() => {
    if (typeId) fetchTourType();
    return () => resetGallery();
  }, [typeId]);

  const fetchTourType = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TourTypeService.getTourTypeDetails(typeId);
      setTourType(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load tour type details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!tourType) return [];
    return tourType.images.map((img: TourTypeImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!tourType) return [];
    return tourType.images.map((img: TourTypeImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.push(TOUR_TYPES_PAGE_URL);

  const handleEdit = () =>
    router.push(`${TOUR_TYPES_PAGE_URL}/${typeId}?name=${tourType?.typeName}`);

  const handleDelete = () =>
    router.push(`${TOUR_TYPES_PAGE_URL}/${typeId}?name=${tourType?.typeName}`);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tourType?.typeName,
        text: tourType?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!tourType) return null;
    const statusConfig = {
      ACTIVE: { icon: CheckCircle, bg: "#10b981", text: "Active" },
      INACTIVE: { icon: AlertCircle, bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { icon: XCircle, bg: "#ef4444", text: "Terminated" },
    };
    const config =
      statusConfig[tourType.status as keyof typeof statusConfig] ||
      statusConfig.INACTIVE;
    const Icon = config.icon;

    return (
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full"
        style={{
          backgroundColor: hexToRgba(config.bg, 0.1),
        }}
      >
        <Icon
          className="w-3 h-3 sm:w-3.5 sm:h-3.5"
          style={{ color: config.bg }}
        />
        <span
          className="text-[10px] sm:text-xs font-medium"
          style={{ color: config.bg }}
        >
          {tourType.status}
        </span>
      </div>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!tourType) return null;
    const displayColor = tourType.color || theme.primary;
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm bg-black/50">
        <div
          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: displayColor }}
        />
        <span className="text-white text-[10px] sm:text-xs font-medium">
          Type Color
        </span>
      </div>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Total Tours",
      value: tourType?.totalTours || 0,
      icon: Package,
      color: theme.primary,
    },
    {
      label: "Total Images",
      value: tourType?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value: tourType?.createdByName || `User #${tourType?.createdBy}`,
      icon: User,
      date: tourType?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: tourType?.updatedByName
        ? tourType.updatedByName
        : tourType?.updatedBy
          ? `User #${tourType.updatedBy}`
          : "Never",
      icon: Clock,
      date: tourType?.updatedAt,
      color: theme.primary,
    },
  ];

  if (tourType?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: tourType.terminatedBy
        ? `User #${tourType.terminatedBy}`
        : "Unknown",
      icon: UserX,
      date: tourType.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${tourType?.typeName}" tour type details...`}
        subMessage="Fetching tour type information"
        size="lg"
      />
    );

  if (error || !tourType) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Tour Type"
        message="The tour type couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchTourType}
        backButtonText="Back to Tour Types"
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
            title={tourType.typeName}
            description={`Tour Type ID: ${tourType.typeId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={tourType.typeName}
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
              onPrev={() => handlePrevImage(tourType.images.length)}
              onNext={() => handleNextImage(tourType.images.length)}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              topRightBadge={<ColorBadge />}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
              fallbackIcon={
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: hexToRgba(
                      tourType.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <span className="text-4xl">🏷️</span>
                </div>
              }
            />

            <TourTypeOverview
              name={tourType.typeName}
              description={tourType.description}
              color={tourType.color}
              hoverColor={tourType.hoverColor}
            />

            <TourTypeToursList
              tours={tourType.tours || []}
              tourTypeColor={tourType.color || theme.primary}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Quick Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <CommonMetadata
              items={metadataItems}
              title="Metadata"
              description="Creation and modification information"
              createdAt={{
                date: tourType.createdAt,
                label: "Created At",
              }}
              showCreatedAt={true}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Type Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && tourType && (
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

      {isExpandedGalleryOpen && tourType && (
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

export default TourTypeDetailsViewPage;
