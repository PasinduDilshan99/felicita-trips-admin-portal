"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, Activity, Image, Star, TrendingUp } from "lucide-react";
import { DestinationService } from "@/services/destinationService";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import ImageModal from "@/components/common-components/ImageModal";
import {
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  DESTINATION_CATEGORY_DETAILS_VIEW_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
  DESTINATION_TERMINATE_PAGE_URL,
  DESTINATION_UPDATE_PAGE_URL,
} from "@/utils/urls";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import { DESTINATION_VIEW_DETAILS_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { LocationMap } from "@/components/destinations-components/view-destination-details-components/LocationMap";
import {
  ACTIVITY_DETAILS_VIEW_PRIVILEGE,
  DESTINATION_CATEGORY_DETAILS_VIEW_PRIVILEGE,
  DESTINATION_DETAILS_VIEW_PRIVILEGE,
  DESTINATION_TERMINATE_PRIVILEGE,
  DESTINATION_UPDATE_PRIVILEGE,
} from "@/utils/privileges";
import PrivilegedTag from "@/components/common-components/secure/PrivilegedTag";

const DestinationDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const destinationId = parseInt(params?.destinationId as string);

  const [destination, setDestination] =
    useState<SingleDestinationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgTransition, setImgTransition] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedGalleryOpen, setIsExpandedGalleryOpen] = useState(false);

  const breadcrumbItems = [
    ...DESTINATION_VIEW_DETAILS_PAGE_BREADCRUMB_DATA,
    {
      label: destination?.destinationName || "Details",
      href: `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destinationId}?name${destination?.destinationName}`,
    },
  ];

  useEffect(() => {
    if (destinationId) fetchDestination();
  }, [destinationId]);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await DestinationService.getDestinationById(destinationId);
      setDestination(response.data);
    } catch {
      setError("Failed to load destination details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const changeImage = (idx: number) => {
    setImgTransition(true);
    setTimeout(() => {
      setCurrentImageIndex(idx);
      setImgTransition(false);
    }, 160);
  };

  const handlePrevImage = () => {
    if (!destination) return;
    const next =
      currentImageIndex === 0
        ? destination.images.length - 1
        : currentImageIndex - 1;
    changeImage(next);
  };

  const handleNextImage = () => {
    if (!destination) return;
    changeImage((currentImageIndex + 1) % destination.images.length);
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!destination) return [];
    return destination.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBack = () => router.back();
  const handleEdit = () =>
    router.push(
      `${DESTINATION_UPDATE_PAGE_URL}/${destinationId}?name=${destination?.destinationName}`,
    );
  const handleDelete = () =>
    router.push(
      `${DESTINATION_TERMINATE_PAGE_URL}/${destinationId}?name=${destination?.destinationName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.destinationName,
        text: destination?.destinationDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const totalActivities = destination?.activities?.length ?? 0;
  const totalImages = destination?.images?.length ?? 0;
  const avgDuration =
    totalActivities > 0
      ? Math.round(
          (destination!.activities!.reduce(
            (s, a) => s + (a.durationHours ?? 0),
            0,
          ) ?? 0) / totalActivities,
        )
      : 0;

  const commonGalleryImages =
    destination?.images.map((img) => ({
      id: img.imageId,
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
    })) || [];

  const statusBadge = destination && (
    <div className="flex gap-2">
      {destination.statusName && (
        <span
          className="px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor:
              destination.statusName === "Active"
                ? "rgba(34, 197, 94, 0.9)"
                : "rgba(239, 68, 68, 0.9)",
            color: "white",
          }}
        >
          {destination.statusName}
        </span>
      )}
      {destination.wish && (
        <span
          className="px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(236, 72, 153, 0.9)",
            color: "white",
          }}
        >
          ❤️ Wishlisted
        </span>
      )}
    </div>
  );

  const quickStats = [
    {
      label: "Total Activities",
      value: totalActivities,
      icon: Activity,
      color: theme.primary,
    },
    {
      label: "Total Images",
      value: totalImages,
      icon: Image,
      color: theme.secondary || theme.primary,
    },
    {
      label: "Avg. Duration",
      value: `${avgDuration} hours`,
      icon: Clock,
      color: "#f59e0b",
    },
    {
      label: "Popularity",
      value: destination?.wish ? "Trending" : "Standard",
      icon: destination?.wish ? TrendingUp : Star,
      color: destination?.wish ? "#ec4899" : "#fbbf24",
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading destination(${destination?.destinationName}) Details...`}
        subMessage="Fetching the latest travel experiences"
        size="lg"
        fullScreen
      />
    );
  if (error || !destination) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Destination"
        message="The destination couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchDestination}
        backButtonText="Back to Destinations"
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
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Destination Details"
            description={`Destination ID: ${destination.destinationId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionButtons
          title={destination.destinationName}
          showShare={true}
          showEdit={true}
          showDelete={true}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sharePrivileges={[DESTINATION_DETAILS_VIEW_PRIVILEGE]}
          editPrivileges={[DESTINATION_UPDATE_PRIVILEGE]}
          deletePrivileges={[DESTINATION_TERMINATE_PRIVILEGE]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="flex flex-col gap-5">
            <CommonHeroImage
              images={commonGalleryImages}
              currentIndex={currentImageIndex}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              statusBadge={statusBadge}
              aspectRatio="video"
              showThumbnails={true}
              showCounter={true}
            />

            {/* Categories Section */}
            {destination.destinationCategoryDetailsDtos &&
              destination.destinationCategoryDetailsDtos.length > 0 && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="px-4 sm:px-6 py-3 sm:py-4"
                    style={{ borderBottom: `1px solid ${theme.border}` }}
                  >
                    <h2
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: theme.text }}
                    >
                      Categories
                    </h2>
                    <p
                      className="text-[10px] sm:text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Destination classifications and tags
                    </p>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-wrap gap-2">
                      {destination.destinationCategoryDetailsDtos.map(
                        (category) => (
                          <PrivilegedTag
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            requiredPrivilege={
                              DESTINATION_CATEGORY_DETAILS_VIEW_PRIVILEGE
                            }
                            navigateTo={(id, name) => {
                              return `${DESTINATION_CATEGORY_DETAILS_VIEW_URL}/${id}?name=${name}`;
                            }}
                            variant="primary"
                            size="md"
                            showTooltip={true}
                            tooltipText="Login required to view category"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

            {destination.activities && destination.activities.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="px-4 sm:px-6 py-3 sm:py-4"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <h2
                    className="text-base sm:text-lg font-semibold"
                    style={{ color: theme.text }}
                  >
                    Activities ({destination.activities.length})
                  </h2>
                  <p
                    className="text-[10px] sm:text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Things to do and experiences
                  </p>
                </div>
                <div className="px-4 sm:px-6 py-4 sm:py-5">
                  <div className="space-y-3">
                    {destination.activities.map((activity, idx) => (
                      <PrivilegedTag
                        key={idx}
                        id={activity.activityId}
                        name={activity.activityName}
                        requiredPrivilege={ACTIVITY_DETAILS_VIEW_PRIVILEGE}
                        navigateTo={(activityId, activityName) => {
                          return ACTIVITY_DETAILS_VIEW_PAGE_URL;
                        }}
                        showTooltip={true}
                        tooltipText="You need permission to view this activity"
                        asDiv={true}
                        className="block w-full"
                      >
                        <div
                          className="p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]"
                          style={{
                            backgroundColor: `${theme.primary}04`,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3
                                className="text-sm sm:text-base font-semibold mb-1"
                                style={{ color: theme.text }}
                              >
                                {activity.activityName}
                              </h3>
                              {activity.activityDescription && (
                                <p
                                  className="text-xs sm:text-sm"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {activity.activityDescription}
                                </p>
                              )}
                            </div>
                            {activity.durationHours && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5">
                                <Clock
                                  className="w-3 h-3"
                                  style={{ color: theme.primary }}
                                />
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: theme.text }}
                                >
                                  {activity.durationHours}h
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </PrivilegedTag>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Destination Stats"
              statusBadge={statusBadge}
              columns={2}
            />

            <CommonGalleryMini
              images={commonGalleryImages}
              onImageClick={handleImageClick}
              onViewAll={() => setIsExpandedGalleryOpen(true)}
              title="Image Gallery"
              showCount={true}
              maxDisplayCount={4}
            />

            {destination.latitude && destination.longitude && (
              <LocationMap
                location={destination.location || "Destination Location"}
                latitude={destination.latitude}
                longitude={destination.longitude}
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && destination && (
        <ImageModal
          isOpen={isModalOpen}
          images={getModalImages()}
          initialIndex={currentImageIndex}
          onClose={handleModalClose}
          showNavigation={true}
          showDownload={true}
          showZoom={true}
          allowKeyboardNavigation={true}
        />
      )}

      {isExpandedGalleryOpen && destination && (
        <CommonExpandedGallery
          images={commonGalleryImages}
          onClose={() => setIsExpandedGalleryOpen(false)}
          onImageClick={(index) => {
            setCurrentImageIndex(index);
            setIsExpandedGalleryOpen(false);
            setIsModalOpen(true);
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

export default DestinationDetailsPage;