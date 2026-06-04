"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PackageScheduleService } from "@/services/packageScheduleService";
import { PackageScheduleDetails } from "@/types/package-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useImageGallery } from "@/hooks/useImageGallery";
import { CommonMetadata } from "@/components/common-components/details-view/CommonMetadata";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import {
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  Hotel,
  DollarSign,
} from "lucide-react";
import {
  PACKAGE_DETAILS_VIEW_PAGE_URL,
  PACKAGE_SCHEDULE_TERMINATE_URL,
  PACKAGE_SCHEDULE_UPDATE_URL,
  PACKAGE_SCHEDULE_VIEW_PAGE_URL,
  PACKAGES_VIEW_PAGE_URL,
  TOUR_DETAILS_VIEW_PAGE_URL,
  TOUR_SCHEDULE_DETAILS_VIEW_URL,
} from "@/utils/urls";
import { PackageScheduleOverview } from "@/components/package-schedules-components/package-schedule-details-view-components/PackageScheduleOverview";
import { CommonQuickStats } from "@/components/common-components/details-view/CommonQuickStats";
import { PackageScheduleFeatures } from "@/components/package-schedules-components/package-schedule-details-view-components/PackageScheduleFeatures";
import { PackageScheduleAccommodations } from "@/components/package-schedules-components/package-schedule-details-view-components/PackageScheduleAccommodations";
import { PackageScheduleRelatedInfo } from "@/components/package-schedules-components/package-schedule-details-view-components/PackageScheduleRelatedInfo";
import { PACKAGE_SCHEDULE_DETAILS_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";

const PackageScheduleDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scheduleId = parseInt(params?.scheduleId as string);

  const [packageSchedule, setPackageSchedule] =
    useState<PackageScheduleDetails | null>(null);
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
    ...PACKAGE_SCHEDULE_DETAILS_VIEW_PAGE_BREADCRUMB_DATA,
    {
      label: packageSchedule?.packageScheduleName || "Details",
      href: `${PACKAGES_VIEW_PAGE_URL}/${scheduleId}`,
    },
  ];

  useEffect(() => {
    if (scheduleId) fetchPackageSchedule();
    return () => resetGallery();
  }, [scheduleId]);

  const fetchPackageSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await PackageScheduleService.getPackageScheduleDetails(scheduleId);
      setPackageSchedule(response.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load package schedule details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(PACKAGE_SCHEDULE_VIEW_PAGE_URL);
    }
  };
  const handleEdit = () =>
    router.push(
      `${PACKAGE_SCHEDULE_UPDATE_URL}/${scheduleId}?name=${packageSchedule?.packageScheduleName}`,
    );

  const handleDelete = () =>
    router.push(
      `${PACKAGE_SCHEDULE_TERMINATE_URL}/${scheduleId}?name=${packageSchedule?.packageScheduleName}`,
    );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageSchedule?.packageScheduleName,
        text: packageSchedule?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewPackage = () => {
    if (packageSchedule?.packageId) {
      router.push(
        `${PACKAGE_DETAILS_VIEW_PAGE_URL}/${packageSchedule.packageId}?name${packageSchedule.packageName}`,
      );
    }
  };

  const handleViewTour = () => {
    if (packageSchedule?.tourId) {
      router.push(
        `${TOUR_DETAILS_VIEW_PAGE_URL}/${packageSchedule.tourId}?name${packageSchedule.tourName}`,
      );
    }
  };

  const handleViewTourSchedule = () => {
    if (packageSchedule?.tourScheduleId) {
      router.push(
        `${TOUR_SCHEDULE_DETAILS_VIEW_URL}/${packageSchedule.tourScheduleId}?name${packageSchedule.tourScheduleName}`,
      );
    }
  };

  // Status badge component
  const StatusBadge = () => {
    if (!packageSchedule) return null;
    const isActive = packageSchedule.scheduleStatus === "ACTIVE";
    return (
      <span
        className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm text-white ${
          isActive ? "bg-emerald-500" : "bg-gray-500"
        }`}
      >
        {packageSchedule.scheduleStatus}
      </span>
    );
  };

  // Calculate final price after discount
  const discountedPrice = packageSchedule
    ? packageSchedule.totalPrice -
      (packageSchedule.totalPrice * (packageSchedule.discountPercentage || 0)) /
        100
    : 0;

  // Prepare quick stats
  const quickStats = [
    {
      label: "Duration Range",
      value: `${packageSchedule?.durationStart || 0} - ${packageSchedule?.durationEnd || 0} days`,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Package Type",
      value: packageSchedule?.packageTypeName || "N/A",
      icon: Tag,
      color: theme.accent || theme.primary,
    },
    {
      label: "Total Price",
      value: `$${packageSchedule?.totalPrice?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: theme.success,
    },
    {
      label: "Price per Person",
      value: `$${packageSchedule?.pricePerPerson?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: theme.primary,
    },
    {
      label: "Discount",
      value: `${packageSchedule?.discountPercentage || 0}%`,
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
      label: "Features",
      value: packageSchedule?.features?.length || 0,
      icon: CheckCircle,
      color: theme.primary,
    },
    {
      label: "Accommodations",
      value: packageSchedule?.accommodations?.length || 0,
      icon: Hotel,
      color: theme.warning,
    },
  ];

  // Prepare metadata items
  const metadataItems = [
    {
      label: "Schedule Created",
      value: new Date(packageSchedule?.createdAt || "").toLocaleDateString(),
      icon: Calendar,
      date: packageSchedule?.createdAt,
      color: theme.success,
    },
    {
      label: "Schedule Updated",
      value: new Date(packageSchedule?.updatedAt || "").toLocaleDateString(),
      icon: Clock,
      date: packageSchedule?.updatedAt,
      color: theme.primary,
    },
    {
      label: "Package Created",
      value: new Date(
        packageSchedule?.packageCreatedAt || "",
      ).toLocaleDateString(),
      icon: Calendar,
      date: packageSchedule?.packageCreatedAt,
      color: theme.success,
    },
    {
      label: "Package Updated",
      value: new Date(
        packageSchedule?.packageUpdatedAt || "",
      ).toLocaleDateString(),
      icon: Clock,
      date: packageSchedule?.packageUpdatedAt,
      color: theme.primary,
    },
  ];

  if (loading)
    return (
      <CommonLoading
        message={`Loading "${packageSchedule?.packageScheduleName}" schedule details...`}
        subMessage="Fetching package schedule information"
        size="lg"
      />
    );

  if (error || !packageSchedule) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Package Schedule"
        message="The package schedule couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchPackageSchedule}
        backButtonText="Back to Package Schedules"
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
            title={packageSchedule.packageScheduleName}
            description={`Schedule ID: ${packageSchedule.packageScheduleId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ActionButtons
          title={packageSchedule.packageScheduleName}
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
            <PackageScheduleOverview
              name={packageSchedule.packageScheduleName}
              description={packageSchedule.description}
              assumeStartDate={packageSchedule.assumeStartDate}
              assumeEndDate={packageSchedule.assumeEndDate}
              durationStart={packageSchedule.durationStart}
              durationEnd={packageSchedule.durationEnd}
              specialNote={packageSchedule.specialNote}
              color={packageSchedule.color}
            />

            <PackageScheduleFeatures
              features={packageSchedule.features || []}
            />

            <PackageScheduleAccommodations
              accommodations={packageSchedule.accommodations || []}
              packageColor={packageSchedule.color || theme.primary}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CommonQuickStats
              stats={quickStats}
              title="Schedule Stats"
              statusBadge={<StatusBadge />}
              columns={2}
            />

            <PackageScheduleRelatedInfo
              packageId={packageSchedule.packageId}
              packageName={packageSchedule.packageName}
              packageDescription={packageSchedule.packageDescription}
              packageStatus={packageSchedule.packageStatus}
              packageTypeName={packageSchedule.packageTypeName}
              packageTypeDescription={packageSchedule.packageTypeDescription}
              minPersonCount={packageSchedule.minPersonCount}
              maxPersonCount={packageSchedule.maxPersonCount}
              tourId={packageSchedule.tourId}
              tourName={packageSchedule.tourName}
              tourDescription={packageSchedule.tourDescription}
              tourDuration={packageSchedule.tourDuration}
              startLocation={packageSchedule.startLocation}
              endLocation={packageSchedule.endLocation}
              season={packageSchedule.season}
              tourStatus={packageSchedule.tourStatus}
              tourScheduleId={packageSchedule.tourScheduleId}
              tourScheduleName={packageSchedule.tourScheduleName}
              onViewPackage={handleViewPackage}
              onViewTour={handleViewTour}
              onViewTourSchedule={handleViewTourSchedule}
            />

            <CommonMetadata
              items={metadataItems}
              title="Timeline"
              description="Creation and modification dates"
              showCreatedAt={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageScheduleDetailsViewPage;
