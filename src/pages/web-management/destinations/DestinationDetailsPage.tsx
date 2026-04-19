"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { SingleDestinationResponse } from "@/types/destination-types";

// Import components
import { ExpandedGallery } from "@/components/destinations-components/view-destination-details-components/ExpandedGallery";
import { LoadingState } from "@/components/destinations-components/view-destination-details-components/LoadingState";
import { ErrorState } from "@/components/destinations-components/view-destination-details-components/ErrorState";
import { ActionButtons } from "@/components/destinations-components/view-destination-details-components/ActionButtons";
import { HeroImage } from "@/components/destinations-components/view-destination-details-components/HeroImage";
import { DestinationOverview } from "@/components/destinations-components/view-destination-details-components/DestinationOverview";
import { ActivitiesList } from "@/components/destinations-components/view-destination-details-components/ActivitiesList";
import { QuickStats } from "@/components/destinations-components/view-destination-details-components/QuickStats";
import { CategoriesList } from "@/components/destinations-components/view-destination-details-components/CategoriesList";
import { LocationMap } from "@/components/destinations-components/view-destination-details-components/LocationMap";
import { GalleryMini } from "@/components/destinations-components/view-destination-details-components/GalleryMini";
import { useTheme } from "@/contexts/ThemeContext";
import { ImageModal } from "@/components/destinations-components/view-destination-details-components/ImageModal";

const DestinationDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const destinationId = parseInt(params?.destinationId as string);

  const [destination, setDestination] = useState<SingleDestinationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgTransition, setImgTransition] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedGalleryOpen, setIsExpandedGalleryOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Destinations", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}` },
    { label: "View", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view` },
    { label: destination?.destinationName || "Details", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${destinationId}` },
  ];

  useEffect(() => {
    if (destinationId) fetchDestination();
  }, [destinationId]);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationById(destinationId);
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
    const next = currentImageIndex === 0 ? destination.images.length - 1 : currentImageIndex - 1;
    changeImage(next);
  };

  const handleNextImage = () => {
    if (!destination) return;
    changeImage((currentImageIndex + 1) % destination.images.length);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleBack = () => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`);
  const handleEdit = () => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/update?destinationId=${destinationId}&name=${destination?.destinationName}`);
  const handleDelete = () => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate?destinationId=${destinationId}&name=${destination?.destinationName}`);
  
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
  const avgDuration = totalActivities > 0
    ? Math.round((destination!.activities!.reduce((s, a) => s + (a.durationHours ?? 0), 0) ?? 0) / totalActivities)
    : 0;

  if (loading) return <LoadingState />;
  if (error || !destination) return <ErrorState error={error} onBack={handleBack} />;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: theme.background }}>
      {/* Topbar */}
      <div 
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{ 
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border 
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <PageHeader
            title={destination.destinationName}
            description={`Destination ID: ${destination.destinationId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ActionButtons
          onBack={handleBack}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            <HeroImage
              images={destination.images}
              currentIndex={currentImageIndex}
              statusName={destination.statusName}
              isWishlisted={destination.wish}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              onImageChange={changeImage}
              imgTransition={imgTransition}
            />

            <DestinationOverview
              description={destination.destinationDescription}
              location={destination.location}
              latitude={destination.latitude}
              longitude={destination.longitude}
              categories={destination.destinationCategoryDetailsDtos || []}
            />

            <ActivitiesList activities={destination.activities || []} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <QuickStats
              totalActivities={totalActivities}
              totalImages={totalImages}
              avgDuration={avgDuration}
              isWishlisted={destination.wish}
            />

            <CategoriesList categories={destination.destinationCategoryDetailsDtos || []} />

            <LocationMap
              location={destination.location}
              latitude={destination.latitude}
              longitude={destination.longitude}
            />

            <GalleryMini
              images={destination.images}
              onImageClick={handleImageClick}
              onViewAll={() => setIsExpandedGalleryOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && destination && (
        <ImageModal
          images={destination.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNavigate={(index) => {
            setCurrentImageIndex(index);
            setImgTransition(false);
          }}
        />
      )}

      {isExpandedGalleryOpen && destination && (
        <ExpandedGallery
          images={destination.images}
          onClose={() => setIsExpandedGalleryOpen(false)}
          onImageClick={(index) => {
            setCurrentImageIndex(index);
            setIsExpandedGalleryOpen(false);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default DestinationDetailsPage;