// app/web-management/packages/terminate/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import { PackageService } from "@/services/packageService";
import { TourPackage, PackageNameId } from "@/types/package-types";
import { AlertTriangle, Search, MapPin, Calendar, Clock, DollarSign, Users, Percent, Gift } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImagesPanel } from "@/components/common-components/terminate-components/ImagesPanel";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import { TerminationItem, TerminationModal } from "@/components/common-components/terminate-components/TerminationModal";
import { PackageStats } from "@/components/packages-components/terminate-package-components/PackageStats";
import { BasicInfoPanel } from "@/components/packages-components/terminate-package-components/BasicInfoPanel";
import { TourInfoPanel } from "@/components/packages-components/terminate-package-components/TourInfoPanel";
import { FeaturesList } from "@/components/packages-components/terminate-package-components/FeaturesList";
import { SchedulesList } from "@/components/packages-components/terminate-package-components/SchedulesList";


const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type for search items
interface PackageSearchItem {
  id: number;
  name: string;
}

const TerminatePackagePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPackageName = searchParams?.get("package-name") || "";
  const initialPackageId = searchParams?.get("package-id") || "";

  const [packages, setPackages] = useState<PackageNameId[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageNameId | null>(
    initialPackageId && initialPackageName
      ? {
          packageId: parseInt(initialPackageId),
          packageName: initialPackageName,
        }
      : null,
  );
  const [packageDetails, setPackageDetails] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Packages",
      href: `${WEB_MANAGEMENT_PATH}/packages`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}/packages/terminate`,
    },
  ];

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageService.getAllPackageNames();
      setPackages(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load packages");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load packages",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setPackageDetails(null);
    try {
      const response = await PackageService.getPackageById(id);
      setPackageDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load package details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load package details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectPackage = async (id: number, name: string) => {
    setSelectedPackage({ packageId: id, packageName: name });
    await fetchPackageDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("package-id", id.toString());
    url.searchParams.set("package-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearPackageSelection = () => {
    setSelectedPackage(null);
    setPackageDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("package-id");
    url.searchParams.delete("package-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedPackage) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedPackage) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await PackageService.terminatePackage(selectedPackage.packageId);

      setSuccess("Package terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedPackage.packageName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearPackageSelection();
        fetchPackages();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate package");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate package. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!packageDetails?.images) return [];
    return packageDetails.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  // Convert packages to search items format
  const searchItems: PackageSearchItem[] = packages.map((pkg) => ({
    id: pkg.packageId,
    name: pkg.packageName,
  }));

  const selectedSearchItem: PackageSearchItem | null = selectedPackage
    ? {
        id: selectedPackage.packageId,
        name: selectedPackage.packageName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedPackage
    ? {
        id: selectedPackage.packageId,
        name: selectedPackage.packageName,
        type: "custom",
        additionalInfo: packageDetails?.packageTypeName,
      }
    : null;

  useEffect(() => {
    if (!selectedPackage) {
      fetchPackages();
    }
  }, []);

  useEffect(() => {
    if (initialPackageId && !packageDetails) {
      handleSelectPackage(parseInt(initialPackageId), initialPackageName);
    }
  }, [initialPackageId, initialPackageName]);

  if (loading && !selectedPackage) {
    return (
      <CommonLoading
        message="Loading packages..."
        subMessage="Please wait while we fetch available packages"
        size="lg"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Details"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Package"
            description="Permanently remove a tour package from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no package is selected */}
        {!selectedPackage && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                }}
              >
                <Search className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select Package to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a package to review its data before termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<PackageSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectPackage(item.id, item.name)}
                onClearSelection={handleClearPackageSelection}
                initialSearchTerm={initialPackageName}
                placeholder="Search packages..."
                title="Packages"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Package Info Bar */}
        <SelectedItemBar
          item={
            selectedPackage
              ? {
                  id: selectedPackage.packageId,
                  name: selectedPackage.packageName,
                }
              : null
          }
          onClear={handleClearPackageSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Package Details Section */}
        {selectedPackage && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
            {/* Warning Header */}
            <div
              className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-4"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.08)}, ${hexToRgba(theme.error, 0.03)})`,
                borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                  color: "#fff",
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold" style={{ color: theme.error }}>
                  Package Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot be undone.
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.08),
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                <span className="text-xs" style={{ color: theme.error }}>
                  ID
                </span>
                <span className="text-sm font-bold" style={{ color: theme.error }}>
                  #{selectedPackage.packageId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading package details..."
                subMessage="Please wait while we fetch the package information"
                size="lg"
              />
            )}

            {/* Package Details Content */}
            {!loadingDetails && packageDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <PackageStats packageDetails={packageDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel packageDetails={packageDetails} />
                    <TourInfoPanel packageDetails={packageDetails} />
                    <ImagesPanel
                      images={packageDetails.images.map((img) => ({
                        id: img.imageId,
                        url: img.imageUrl,
                        name: img.imageName,
                        description: img.imageDescription,
                      }))}
                      onImageClick={handleImageClick}
                      title="Package Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <FeaturesList features={packageDetails.features} />
                    <SchedulesList schedules={packageDetails.schedules} />

                    {/* Custom Impact Warning for Packages */}
                    <ImpactWarning
                      title="Package Termination Impact"
                      customItems={[
                        {
                          icon: <Calendar size={11} />,
                          text: "All schedules associated with this package will be permanently deleted",
                        },
                        {
                          icon: <Gift size={11} />,
                          text: "All package features and benefits will be permanently removed",
                        },
                        {
                          icon: <DollarSign size={11} />,
                          text: "All pricing and discount information will be permanently deleted",
                        },
                        {
                          icon: <Users size={11} />,
                          text: "All participant capacity settings will be removed",
                        },
                        {
                          icon: <AlertTriangle size={11} />,
                          text: "This action cannot be undone — recovery is not possible",
                        },
                        {
                          icon: <AlertTriangle size={11} />,
                          text: "This termination will be logged for audit trail purposes",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Termination Button */}
                <div
                  className="flex justify-center pt-4"
                  style={{
                    borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
                    style={{
                      background: loadingTerminate
                        ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)`
                        : `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.8)})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="animate-pulse">Processing…</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Terminate Package Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !packageDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Package"
                message="The package couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearPackageSelection}
                onRetry={() =>
                  selectedPackage && fetchPackageDetails(selectedPackage.packageId)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminationModal
        isOpen={showConfirmModal}
        item={terminationItem}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
        title="Confirm Package Termination"
        description="You are about to permanently terminate:"
        warningMessage="All schedules, features, pricing information, and images linked to this package will be permanently deleted."
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={() => setImageModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </div>
  );
};

export default TerminatePackagePage;