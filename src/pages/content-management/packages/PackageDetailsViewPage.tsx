"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PackageService } from "@/services/packageService";
import { PackageAllDetails, PackageImageResponse } from "@/types/package-types";
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
import { PackageOverview } from "@/components/packages-components/package-details-view-components/PackageOverview";
import { PackagePricing } from "@/components/packages-components/package-details-view-components/PackagePricing";
import { PackageFeatures } from "@/components/packages-components/package-details-view-components/PackageFeatures";
import { PackageInclusionsExclusions } from "@/components/packages-components/package-details-view-components/PackageInclusionsExclusions";
import { PackageConditionsTips } from "@/components/packages-components/package-details-view-components/PackageConditionsTips";
import { PackageDayAccommodations } from "@/components/packages-components/package-details-view-components/PackageDayAccommodations";
import { PackageTourInfo } from "@/components/packages-components/package-details-view-components/PackageTourInfo";
import {
  Package,
  Image,
  CheckCircle,
  Calendar,
  Tag,
  DollarSign,
  Users,
} from "lucide-react";
import {
  PACKAGE_TERMINATE_PAGE_URL,
  PACKAGE_UPDATE_PAGE_URL,
  PACKAGES_VIEW_PAGE_URL,
  TOUR_CATEGORY_DETAILS_VIEW_URL,
} from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";
import { PACKAGE_VIEW_DETAILS_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { hexToRgba } from "@/utils/functions";

const PackageDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const packageId = parseInt(params?.packageId as string);

  const [packageData, setPackageData] = useState<PackageAllDetails | null>(
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
    ...PACKAGE_VIEW_DETAILS_PAGE_BREADCRUMB_DATA,
    {
      label: packageData?.packageName || "Details",
      href: `${PACKAGES_VIEW_PAGE_URL}/${packageId}`,
    },
  ];

  useEffect(() => {
    if (packageId) fetchPackage();
    return () => resetGallery();
  }, [packageId]);

  const fetchPackage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageService.getPackageAllDetails(packageId);
      setPackageData(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load package details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!packageData) return [];
    return packageData.packageImages.map((img: PackageImageResponse) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!packageData) return [];
    return packageData.packageImages.map((img: PackageImageResponse) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.back();

  const handleEdit = () =>
    router.push(
      `${PACKAGE_UPDATE_PAGE_URL}/${packageId}?name=${packageData?.packageName}`,
    );

  const handleDelete = () =>
    router.push(
      `${PACKAGE_TERMINATE_PAGE_URL}/${packageId}?name=${packageData?.packageName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData?.packageName,
        text: packageData?.packageDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewTour = () => {
    if (packageData?.tourId) {
      router.push(
        `${TOUR_CATEGORY_DETAILS_VIEW_URL}/${packageData.tourId}?name=${packageData.tourName}`,
      );
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!packageData) return null;
    const isActive = packageData.packageStatus === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {packageData.packageStatus}
      </span>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!packageData) return null;
    const displayColor = packageData.color || theme.primary;
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm bg-black/50">
        <div
          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
          style={{ backgroundColor: displayColor }}
        />
        <span className="text-white text-[10px] sm:text-xs font-medium">
          Package Color
        </span>
      </div>
    );
  };

  // Calculate final price after discount
  const discountedPrice = packageData
    ? packageData.totalPrice -
      (packageData.totalPrice * packageData.discountPercentage) / 100
    : 0;

  // Prepare quick stats
  const quickStats = [
    {
      label: "Package Type",
      value: packageData?.packageTypeName || "N/A",
      icon: Tag,
      color: theme.primary,
    },
    {
      label: "Total Price",
      value: `$${packageData?.totalPrice?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: theme.success,
    },
    {
      label: "Price per Person",
      value: `$${packageData?.pricePerPerson?.toLocaleString() || 0}`,
      icon: Users,
      color: theme.primary,
    },
    {
      label: "Discount",
      value: `${packageData?.discountPercentage || 0}%`,
      icon: Tag,
      color: theme.warning,
    },
    {
      label: "Final Price",
      value: `$${discountedPrice.toLocaleString()}`,
      icon: DollarSign,
      color: theme.success,
    },
    {
      label: "Group Size",
      value: `${packageData?.minPersonCount || 1} - ${packageData?.maxPersonCount || 100} persons`,
      icon: Users,
      color: theme.accent || theme.primary,
    },
    {
      label: "Features",
      value: packageData?.packageFeatures?.length || 0,
      icon: CheckCircle,
      color: theme.primary,
    },
    {
      label: "Images",
      value: packageData?.packageImages?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Valid From",
      value: new Date(packageData?.startDate || "").toLocaleDateString(),
      icon: Calendar,
      date: packageData?.startDate,
      color: theme.success,
    },
    {
      label: "Valid To",
      value: new Date(packageData?.endDate || "").toLocaleDateString(),
      icon: Calendar,
      date: packageData?.endDate,
      color: theme.error,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${packageData?.packageName}" package details...`}
        subMessage="Fetching package information"
        size="lg"
      />
    );

  if (error || !packageData) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Package"
        message="The package couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchPackage}
        backButtonText="Back to Packages"
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
            title={packageData.packageName}
            description={`Package ID: ${packageData.packageId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={packageData.packageName}
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
              onPrev={() => handlePrevImage(packageData.packageImages.length)}
              onNext={() => handleNextImage(packageData.packageImages.length)}
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
                      packageData.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <Package
                    className="w-10 h-10"
                    style={{ color: packageData.color || theme.primary }}
                  />
                </div>
              }
            />

            <PackageOverview
              name={packageData.packageName}
              description={packageData.packageDescription}
              color={packageData.color}
              hoverColor={packageData.hoverColor}
              startDate={packageData.startDate}
              endDate={packageData.endDate}
              packageTypeName={packageData.packageTypeName}
            />

            <PackagePricing
              totalPrice={packageData.totalPrice}
              discountPercentage={packageData.discountPercentage}
              pricePerPerson={packageData.pricePerPerson}
              minPersonCount={packageData.minPersonCount}
              maxPersonCount={packageData.maxPersonCount}
              color={packageData.color}
            />

            <PackageFeatures features={packageData.packageFeatures || []} />

            <PackageDayAccommodations
              accommodations={
                packageData.dayAccommodationResponses?.packageDayByDayDtoList ||
                []
              }
              packageColor={packageData.color}
            />

            <PackageInclusionsExclusions
              inclusions={packageData.inclusions || []}
              exclusions={packageData.exclusions || []}
            />

            <PackageConditionsTips
              conditions={packageData.conditions || []}
              travelTips={packageData.travelTips || []}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Package Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <PackageTourInfo
              tourId={packageData.tourId}
              tourName={packageData.tourName}
              onViewTour={handleViewTour}
            />

            <CommonMetadata
              items={metadataItems}
              title="Validity Period"
              description="Package availability dates"
              showCreatedAt={false}
            />

            <CommonGalleryMini
              images={getGalleryImages()}
              onImageClick={handleImageClick}
              onViewAll={openExpandedGallery}
              title="Package Gallery"
              showCount={true}
              maxDisplayCount={4}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && packageData && (
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

      {isExpandedGalleryOpen && packageData && (
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

export default PackageDetailsViewPage;
