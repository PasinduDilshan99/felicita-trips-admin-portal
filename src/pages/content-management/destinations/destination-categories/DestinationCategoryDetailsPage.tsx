"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal from "@/components/common-components/ImageModal";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  MapPin,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Tag,
  Calendar,
} from "lucide-react";
import {
  CategoryDetailsByIdResponse,
  CategoryImage,
} from "@/types/destination-types";
import { DESTINATION_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import {
  DESTINATION_CATEGORY_TERMINATE_URL,
  DESTINATION_CATEGORY_UPDATE_URL,
  DESTINATION_CATEGORY_VIEW_PAGE_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import { ImageModalImage } from "@/types/common-components-types";
import { hexToRgba } from "@/utils/functions";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { DestinationCategoryOverview } from "@/components/destination-categories-components/destination-category-details-view-components/DestinationCategoryOverview";
import { DestinationCategoryDestinationsList } from "@/components/destination-categories-components/destination-category-details-view-components/DestinationCategoryDestinationsList";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";

const DestinationCategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const categoryId = parseInt(params?.categoryId as string);

  const [category, setCategory] = useState<CategoryDetailsByIdResponse | null>(
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
    ...DESTINATION_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA,
    {
      label: category?.category || "Details",
      href: `${DESTINATION_CATEGORY_VIEW_PAGE_URL}/${categoryId}`,
    },
  ];

  useEffect(() => {
    if (categoryId) fetchCategory();
    return () => resetGallery();
  }, [categoryId]);

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await DestinationService.getCategoryDetailsById(categoryId);
      setCategory(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load destination category details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!category) return [];
    return category.images.map((img: CategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!category) return [];
    return category.images.map((img: CategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.back();

  const handleEdit = () =>
    router.push(
      `${DESTINATION_CATEGORY_UPDATE_URL}/${categoryId}?name=${category?.category}`,
    );

  const handleDelete = () =>
    router.push(
      `${DESTINATION_CATEGORY_TERMINATE_URL}/${categoryId}?name=${category?.category}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: category?.category,
        text: category?.categoryDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewDestination = (
    destinationId: number,
    destinationName: string,
  ) => {
    router.push(
      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destinationId}?name=${destinationName}`,
    );
  };

  const StatusBadge = () => {
    if (!category) return null;
    const statusConfig = {
      ACTIVE: { icon: CheckCircle, bg: "#10b981", text: "Active" },
      INACTIVE: { icon: AlertCircle, bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { icon: XCircle, bg: "#ef4444", text: "Terminated" },
    };
    const config =
      statusConfig[category.categoryStatus as keyof typeof statusConfig] ||
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
          {category.categoryStatus}
        </span>
      </div>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!category) return null;
    const displayColor = category.color || theme.primary;
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
  const primaryDestinations =
    category?.destinations?.filter((d) => d.primary) || [];
  const otherDestinations =
    category?.destinations?.filter((d) => !d.primary) || [];

  const quickStats = [
    {
      label: "Primary Destinations",
      value: primaryDestinations.length,
      icon: MapPin,
      color: theme.warning,
    },
    {
      label: "Other Destinations",
      value: otherDestinations.length,
      icon: MapPin,
      color: theme.primary,
    },
    {
      label: "Total Destinations",
      value: category?.destinations?.length || 0,
      icon: MapPin,
      color: theme.success,
    },
    {
      label: "Total Images",
      value: category?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created At",
      value: new Date(category?.createdAt || "").toLocaleDateString(),
      icon: Calendar,
      date: category?.createdAt,
      color: theme.success,
    },
    {
      label: "Updated At",
      value: new Date(category?.updatedAt || "").toLocaleDateString(),
      icon: Clock,
      date: category?.updatedAt,
      color:theme.primary,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${category?.category}" category details...`}
        subMessage="Fetching destination category information"
        size="lg"
      />
    );

  if (error || !category) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Destination Category"
        message="The destination category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchCategory}
        backButtonText="Back to Destination Categories"
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
            title={category.category}
            description={`Category ID: ${category.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={category.category}
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
              onPrev={() => handlePrevImage(category.images.length)}
              onNext={() => handleNextImage(category.images.length)}
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
                      category.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <Tag
                    className="w-10 h-10"
                    style={{ color: category.color || theme.primary }}
                  />
                </div>
              }
            />

            <DestinationCategoryOverview
              name={category.category}
              description={category.categoryDescription}
              color={category.color}
              hoverColor={category.hoverColor}
            />

            <DestinationCategoryDestinationsList
              destinations={category.destinations || []}
              categoryColor={category.color || theme.primary}
              onViewDestination={handleViewDestination}
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
              title="Timeline"
              description="Creation and modification dates"
              showCreatedAt={false}
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
      {isModalOpen && category && (
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

      {isExpandedGalleryOpen && category && (
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

export default DestinationCategoryDetailsPage;
