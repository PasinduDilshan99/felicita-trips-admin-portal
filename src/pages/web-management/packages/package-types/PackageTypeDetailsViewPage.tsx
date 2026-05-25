// app/package-types/view/[typeId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { PackageTypeService } from "@/services/packageTypeService";
import {
  PackageTypeDetails,
  PackageTypeImage,
} from "@/types/package-type-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import { CommonHeroImage } from "@/components/common-components/details-view/CommonHeroImage";
import { CommonGalleryMini } from "@/components/common-components/details-view/CommonGalleryMini";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";

// Import sub-components
import { PackageTypeOverview } from "@/components/package-types-components/package-type-details-view-components/PackageTypeOverview";
import { PackageTypePackagesList } from "@/components/package-types-components/package-type-details-view-components/PackageTypePackagesList";

// Icons
import {
  Package,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Clock,
  Tag,
} from "lucide-react";

// Constants for routing
import { PACKAGE_TYPES_PAGE_URL, PACKAGES_VIEW_PAGE_URL } from "@/utils/urls";
import { CommonExpandedGallery } from "@/components/common-components/details-view/CommonExpandedGallery";

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const PackageTypeDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const typeId = parseInt(params?.typeId as string);

  const [packageType, setPackageType] = useState<PackageTypeDetails | null>(
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
    { label: "Package Types", href: PACKAGE_TYPES_PAGE_URL },
    { label: "View", href: PACKAGES_VIEW_PAGE_URL },
    {
      label: packageType?.typeName || "Details",
      href: `${PACKAGES_VIEW_PAGE_URL}/${typeId}`,
    },
  ];

  useEffect(() => {
    if (typeId) fetchPackageType();
    return () => resetGallery();
  }, [typeId]);

  const fetchPackageType = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageTypeService.getPackageTypeDetails(typeId);
      setPackageType(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load package type details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!packageType) return [];
    return packageType.images.map((img: PackageTypeImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  // Prepare common gallery images
  const getGalleryImages = () => {
    if (!packageType) return [];
    return packageType.images.map((img: PackageTypeImage) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  const handleBack = () => router.push(PACKAGES_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${PACKAGES_VIEW_PAGE_URL}/${typeId}?name=${packageType?.typeName}`,
    );

  const handleDelete = () =>
    router.push(
      `${PACKAGES_VIEW_PAGE_URL}/${typeId}?name=${packageType?.typeName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageType?.typeName,
        text: packageType?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewPackage = (packageId: number) => {
    router.push(`${PACKAGES_VIEW_PAGE_URL}/${packageId}`);
  };

  // Status badge component
  const StatusBadge = () => {
    if (!packageType) return null;
    const statusConfig = {
      ACTIVE: { icon: CheckCircle, bg: "#10b981", text: "Active" },
      INACTIVE: { icon: AlertCircle, bg: "#f59e0b", text: "Inactive" },
      TERMINATED: { icon: XCircle, bg: "#ef4444", text: "Terminated" },
    };
    const config =
      statusConfig[packageType.status as keyof typeof statusConfig] ||
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
          {packageType.status}
        </span>
      </div>
    );
  };

  // Color badge component
  const ColorBadge = () => {
    if (!packageType) return null;
    const displayColor = packageType.color || theme.primary;
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
      label: "Total Packages",
      value: packageType?.totalPackages || 0,
      icon: Package,
      color: theme.primary,
    },
    {
      label: "Total Images",
      value: packageType?.images?.length || 0,
      icon: Image,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Created By",
      value: packageType?.createdByName || `User #${packageType?.createdBy}`,
      icon: User,
      date: packageType?.createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: packageType?.updatedByName
        ? packageType.updatedByName
        : packageType?.updatedBy
          ? `User #${packageType.updatedBy}`
          : "Never",
      icon: Clock,
      date: packageType?.updatedAt,
      color: theme.primary,
    },
  ];

  if (packageType?.terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: packageType.terminatedBy
        ? `User #${packageType.terminatedBy}`
        : "Unknown",
      icon: User,
      date: packageType.terminatedAt,
      color: theme.error,
    });
  }

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${packageType?.typeName}" package type details...`}
        subMessage="Fetching package type information"
        size="lg"
      />
    );

  if (error || !packageType) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Package Type"
        message="The package type couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchPackageType}
        backButtonText="Back to Package Types"
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
            title={packageType.typeName}
            description={`Package Type ID: ${packageType.typeId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={packageType.typeName}
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
              onPrev={() => handlePrevImage(packageType.images.length)}
              onNext={() => handleNextImage(packageType.images.length)}
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
                      packageType.color || theme.primary,
                      0.1,
                    ),
                  }}
                >
                  <Tag
                    className="w-10 h-10"
                    style={{ color: packageType.color || theme.primary }}
                  />
                </div>
              }
            />

            <PackageTypeOverview
              name={packageType.typeName}
              description={packageType.description}
              color={packageType.color}
              hoverColor={packageType.hoverColor}
            />

            <PackageTypePackagesList
              packages={packageType.packageBasicDetails || []}
              packageTypeColor={packageType.color || theme.primary}
              onViewPackage={handleViewPackage}
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
                date: packageType.createdAt,
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
      {isModalOpen && packageType && (
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

      {isExpandedGalleryOpen && packageType && (
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

export default PackageTypeDetailsViewPage;
