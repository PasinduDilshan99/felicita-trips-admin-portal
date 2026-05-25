// app/activity-categories/view/[categoryId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
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
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";

// Import sub-components
// Icons
import {
  Tag,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Clock,
  Activity,
} from "lucide-react";

// Constants for routing
import { ACTIVITIES_VIEW_PAGE_URL } from "@/utils/urls";
import { ActivityCategoryOverview } from "@/components/activity-categories-components/activity-category-details-view-components/ActivityCategoryOverview";
import { ActivityCategoryActivitiesList } from "@/components/activity-categories-components/activity-category-details-view-components/ActivityCategoryActivitiesList";

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ActivityCategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const categoryId = parseInt(params?.categoryId as string);

  const [activityCategory, setActivityCategory] =
    useState<ActivityCategoryDetails | null>(null);
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
    { label: "Activity Categories", href: ACTIVITIES_VIEW_PAGE_URL },
    { label: "View", href: ACTIVITIES_VIEW_PAGE_URL },
    {
      label: activityCategory?.categoryName || "Details",
      href: `${ACTIVITIES_VIEW_PAGE_URL}/${categoryId}`,
    },
  ];

  useEffect(() => {
    if (categoryId) fetchActivityCategory();
    return () => resetGallery();
  }, [categoryId]);

  const fetchActivityCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await ActivityCategoryService.getActivityCategoryDetails(categoryId);
      setActivityCategory(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load activity category details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!activityCategory) return [];
    return activityCategory.images.map((img: ActivityCategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!activityCategory) return [];
    return activityCategory.images.map((img: ActivityCategoryImage) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.push(ACTIVITIES_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${categoryId}?name=${activityCategory?.categoryName}`,
    );

  const handleDelete = () =>
    router.push(
      `${ACTIVITIES_VIEW_PAGE_URL}/${categoryId}?name=${activityCategory?.categoryName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activityCategory?.categoryName,
        text: activityCategory?.description,
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

  // Status badge component
  const StatusBadge = () => {
    if (!activityCategory) return null;
    const statusConfig = {
      ACTIVE: { icon: CheckCircle, bg: "#10b981", text: "Active" },
      INACTIVE: { icon: AlertCircle, bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { icon: XCircle, bg: "#ef4444", text: "Terminated" },
    };
    const config =
      statusConfig[activityCategory.status as keyof typeof statusConfig] ||
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
          {activityCategory.status}
        </span>
      </div>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!activityCategory) return null;
    const displayColor = activityCategory.color || theme.primary;
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
      label: "Primary Activities",
      value: activityCategory?.primaryActivities?.length || 0,
      icon: Activity,
      color: theme.warning,
    },
    {
      label: "Other Activities",
      value: activityCategory?.otherActivities?.length || 0,
      icon: Activity,
      color: theme.primary,
    },
    {
      label: "Total Activities",
      value:
        (activityCategory?.primaryActivities?.length || 0) +
        (activityCategory?.otherActivities?.length || 0),
      icon: Activity,
      color: theme.success,
    },
    {
      label: "Total Images",
      value: activityCategory?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value:
        activityCategory?.createdByName ||
        `User #${activityCategory?.createdBy}`,
      icon: User,
      date: activityCategory?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: activityCategory?.updatedByName
        ? activityCategory.updatedByName
        : activityCategory?.updatedBy
          ? `User #${activityCategory.updatedBy}`
          : "Never",
      icon: Clock,
      date: activityCategory?.updatedAt,
      color: theme.primary,
    },
  ];

  if (activityCategory?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: activityCategory.terminatedBy
        ? `User #${activityCategory.terminatedBy}`
        : "Unknown",
      icon: User,
      date: activityCategory.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${activityCategory?.categoryName}" category details...`}
        subMessage="Fetching activity category information"
        size="lg"
      />
    );

  if (error || !activityCategory) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Activity Category"
        message="The activity category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchActivityCategory}
        backButtonText="Back to Activity Categories"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  const totalActivities =
    (activityCategory.primaryActivities?.length || 0) +
    (activityCategory.otherActivities?.length || 0);

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
            title={activityCategory.categoryName}
            description={`Category ID: ${activityCategory.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={activityCategory.categoryName}
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
              onPrev={() => handlePrevImage(activityCategory.images.length)}
              onNext={() => handleNextImage(activityCategory.images.length)}
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
                      activityCategory.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <Tag
                    className="w-10 h-10"
                    style={{ color: activityCategory.color || theme.primary }}
                  />
                </div>
              }
            />

            <ActivityCategoryOverview
              name={activityCategory.categoryName}
              description={activityCategory.description}
              color={activityCategory.color}
              hoverColor={activityCategory.hoverColor}
            />

            <ActivityCategoryActivitiesList
              primaryActivities={activityCategory.primaryActivities || []}
              otherActivities={activityCategory.otherActivities || []}
              categoryColor={activityCategory.color || theme.primary}
              onViewActivity={handleViewActivity}
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
                date: activityCategory.createdAt,
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
      {isModalOpen && activityCategory && (
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

      {isExpandedGalleryOpen && activityCategory && (
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
