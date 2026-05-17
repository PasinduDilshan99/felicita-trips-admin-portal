"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import {
  ActivityCategoryDetails,
  ActivityCategoryImage,
} from "@/types/activity-category-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";

// Import other sub-components
import { CategoryActivitiesList } from "@/components/activity-categories-components/activity-category-details-view-components/CategoryActivitiesList";
import { CategoryQuickStats } from "@/components/activity-categories-components/activity-category-details-view-components/CategoryQuickStats";
import { CategoryMetadata } from "@/components/activity-categories-components/activity-category-details-view-components/CategoryMetadata";
import { ACTIVITY_CATEGORY_VIEW_PAGE_URL } from "@/utils/urls";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { CategoryOverview } from "@/components/activity-categories-components/activity-category-details-view-components/CategoryOverview";

const ActivityCategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const categoryId = parseInt(params?.categoryId as string);

  const [category, setCategory] = useState<ActivityCategoryDetails | null>(
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
    { label: "Activity Categories", href: ACTIVITY_CATEGORY_VIEW_PAGE_URL },
    { label: "View", href: ACTIVITY_CATEGORY_VIEW_PAGE_URL },
    {
      label: category?.categoryName || "Details",
      href: `${ACTIVITY_CATEGORY_VIEW_PAGE_URL}/${categoryId}`,
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
        await ActivityCategoryService.getActivityCategoryDetails(categoryId);
      setCategory(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load category details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!category) return [];
    return category.images.map((img: ActivityCategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!category) return [];
    return category.images.map((img: ActivityCategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.push(ACTIVITY_CATEGORY_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${ACTIVITY_CATEGORY_VIEW_PAGE_URL}/${categoryId}?name=${category?.categoryName}`,
    );

  const handleDelete = () =>
    router.push(
      `${ACTIVITY_CATEGORY_VIEW_PAGE_URL}/${categoryId}?name=${category?.categoryName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: category?.categoryName,
        text: category?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!category) return null;
    const statusColors = {
      ACTIVE: { bg: "#10b981", text: "Active" },
      INACTIVE: { bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { bg: "#ef4444", text: "Terminated" },
    };
    const status =
      statusColors[category.status as keyof typeof statusColors] ||
      statusColors.INACTIVE;
    return (
      <span
        className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white"
        style={{ backgroundColor: status.bg }}
      >
        {status.text}
      </span>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!category) return null;
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm bg-black/50">
        <div
          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-white text-[10px] sm:text-xs font-medium">
          Category Color
        </span>
      </div>
    );
  };

  // Calculate stats
  const totalImages = category?.images?.length ?? 0;
  const totalPrimaryActivities = category?.primaryActivities?.length ?? 0;
  const totalOtherActivities = category?.otherActivities?.length ?? 0;
  const totalActivities = totalPrimaryActivities + totalOtherActivities;

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${category?.categoryName}" category details...`}
        subMessage="Fetching category information"
        size="lg"
      />
    );

  if (error || !category) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Category"
        message="The activity category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchCategory}
        backButtonText="Back to Categories"
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
            title={category.categoryName}
            description={`Category ID: ${category.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={category.categoryName}
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
              onPrev={() => handlePrevImage(category.images.length)}
              onNext={() => handleNextImage(category.images.length)}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={<StatusBadge />}
              topRightBadge={<ColorBadge />}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
            />

            <CategoryOverview
              name={category.categoryName}
              description={category.description}
              color={category.color}
              hoverColor={category.hoverColor}
            />

            <CategoryActivitiesList
              primaryActivities={category.primaryActivities}
              otherActivities={category.otherActivities}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CategoryQuickStats
              totalImages={totalImages}
              totalPrimaryActivities={totalPrimaryActivities}
              totalOtherActivities={totalOtherActivities}
              totalActivities={totalActivities}
              status={category.status}
              color={category.color}
            />

            <CategoryMetadata
              createdAt={category.createdAt}
              createdBy={category.createdBy}
              createdByName={category.createdByName}
              updatedAt={category.updatedAt}
              updatedBy={category.updatedBy}
              updatedByName={category.updatedByName}
              terminatedAt={category.terminatedAt}
              terminatedBy={category.terminatedBy}
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

export default ActivityCategoryDetailsPage;
