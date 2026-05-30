"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TourCategoryService } from "@/services/tourCategoryService";
import {
  TourCategoryDetails,
  TourCategoryImage,
} from "@/types/tour-category-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal from "@/components/common-components/ImageModal";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Package,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Clock,
  UserX,
} from "lucide-react";
import { TOUR_CATEGORIES_PAGE_URL, TOUR_CATEGORY_TERMINATE_URL, TOUR_CATEGORY_UPDATE_URL } from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { TourCategoryOverview } from "@/components/tour-types-components/tour-category-details-components/TourCategoryOverview";
import { TourCategoryToursList } from "@/components/tour-types-components/tour-category-details-components/TourCategoryToursList";
import { ImageModalImage } from "@/types/common-components-types";
import { hexToRgba } from "@/utils/functions";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const TourCategoryDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const categoryId = parseInt(params?.categoryId as string);

  const [tourCategory, setTourCategory] = useState<TourCategoryDetails | null>(
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
    ...TOUR_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA,
    {
      label: tourCategory?.categoryName || "Details",
      href: `${TOUR_CATEGORIES_PAGE_URL}/${categoryId}`,
    },
  ];

  useEffect(() => {
    if (categoryId) fetchTourCategory();
    return () => resetGallery();
  }, [categoryId]);

  const fetchTourCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await TourCategoryService.getTourCategoryDetails(categoryId);
      setTourCategory(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load tour category details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!tourCategory) return [];
    return tourCategory.images.map((img: TourCategoryImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!tourCategory) return [];
    return tourCategory.images.map((img: TourCategoryImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.back();

  const handleEdit = () =>
    router.push(
      `${TOUR_CATEGORY_UPDATE_URL}/${categoryId}?name=${tourCategory?.categoryName}`,
    );

  const handleDelete = () =>
    router.push(
      `${TOUR_CATEGORY_TERMINATE_URL}/${categoryId}?name=${tourCategory?.categoryName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tourCategory?.categoryName,
        text: tourCategory?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!tourCategory) return null;
    const statusConfig = {
      ACTIVE: { icon: CheckCircle, bg: "#10b981", text: "Active" },
      INACTIVE: { icon: AlertCircle, bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { icon: XCircle, bg: "#ef4444", text: "Terminated" },
    };
    const config =
      statusConfig[tourCategory.status as keyof typeof statusConfig] ||
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
          {tourCategory.status}
        </span>
      </div>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!tourCategory) return null;
    const displayColor = tourCategory.color || theme.primary;
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm bg-black/50">
        <div
          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: displayColor }}
        />
        <span className="text-white text-[10px] sm:text-xs font-medium">
          Category Color
        </span>
      </div>
    );
  };

  // Prepare quick stats
  const quickStats = [
    {
      label: "Total Tours",
      value: tourCategory?.totalTours || 0,
      icon: Package,
      color: theme.primary,
    },
    {
      label: "Total Images",
      value: tourCategory?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value: tourCategory?.createdByName || `User #${tourCategory?.createdBy}`,
      icon: User,
      date: tourCategory?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: tourCategory?.updatedByName
        ? tourCategory.updatedByName
        : tourCategory?.updatedBy
          ? `User #${tourCategory.updatedBy}`
          : "Never",
      icon: Clock,
      date: tourCategory?.updatedAt,
      color: theme.primary,
    },
  ];

  if (tourCategory?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: tourCategory.terminatedBy
        ? `User #${tourCategory.terminatedBy}`
        : "Unknown",
      icon: UserX,
      date: tourCategory.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${tourCategory?.categoryName}" tour category details...`}
        subMessage="Fetching tour category information"
        size="lg"
      />
    );

  if (error || !tourCategory) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Tour Category"
        message="The tour category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchTourCategory}
        backButtonText="Back to Tour Categories"
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
            title={tourCategory.categoryName}
            description={`Tour Category ID: ${tourCategory.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={tourCategory.categoryName}
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
              onPrev={() => handlePrevImage(tourCategory.images.length)}
              onNext={() => handleNextImage(tourCategory.images.length)}
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
                      tourCategory.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <span className="text-4xl">📁</span>
                </div>
              }
            />

            <TourCategoryOverview
              name={tourCategory.categoryName}
              description={tourCategory.description}
              color={tourCategory.color}
              hoverColor={tourCategory.hoverColor}
            />

            <TourCategoryToursList
              tours={tourCategory.tours || []}
              tourCategoryColor={tourCategory.color || theme.primary}
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
                date: tourCategory.createdAt,
                label: "Created At",
              }}
              showCreatedAt={true}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Category Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && tourCategory && (
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

      {isExpandedGalleryOpen && tourCategory && (
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

export default TourCategoryDetailsViewPage;
