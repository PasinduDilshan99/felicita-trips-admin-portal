"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PackageTypeService } from "@/services/packageTypeService";
import {
  PackageTypeDetails,
  PackageTypeSearchItem,
} from "@/types/package-type-types";
import {
  AlertTriangle,
  Search,
  Palette,
  Info,
  Package,
  Star,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import ImageModal from "@/components/common-components/ImageModal";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImagesPanel } from "@/components/common-components/terminate-components/ImagesPanel";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import {
  TerminationItem,
  TerminationModal,
} from "@/components/common-components/terminate-components/TerminationModal";
import { useCommon } from "@/contexts/CommonContext";
import { PackageTypeStats } from "@/components/package-types-components/terminate-package-type-components/PackageTypeStats";
import { BasicInfoPanel } from "@/components/package-types-components/terminate-package-type-components/BasicInfoPanel";
import { PackagesList } from "@/components/package-types-components/terminate-package-type-components/PackagesList";
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PACKAGE_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { hexToRgba } from "@/utils/functions";

const TerminatePackageTypePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, loading: commonLoading } = useCommon();

  const initialPackageTypeName = searchParams?.get("package-type-name") || "";
  const initialPackageTypeId = searchParams?.get("package-type-id") || "";

  const [selectedPackageType, setSelectedPackageType] = useState<{
    typeId: number;
    typeName: string;
  } | null>(
    initialPackageTypeId && initialPackageTypeName
      ? {
          typeId: parseInt(initialPackageTypeId),
          typeName: initialPackageTypeName,
        }
      : null,
  );
  const [packageTypeDetails, setPackageTypeDetails] =
    useState<PackageTypeDetails | null>(null);
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

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const packageTypes = categories?.packageCategoryList || [];

  const searchItems: PackageTypeSearchItem[] = packageTypes.map((type) => ({
    id: type.packageCategoryId,
    name: type.packageCategoryName,
  }));

  const fetchPackageTypeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setPackageTypeDetails(null);
    try {
      const response = await PackageTypeService.getPackageTypeDetails(id);
      setPackageTypeDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load package type details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load package type details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectPackageType = async (id: number, name: string) => {
    setSelectedPackageType({ typeId: id, typeName: name });
    await fetchPackageTypeDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("package-type-id", id.toString());
    url.searchParams.set("package-type-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearPackageTypeSelection = () => {
    setSelectedPackageType(null);
    setPackageTypeDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("package-type-id");
    url.searchParams.delete("package-type-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedPackageType) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedPackageType) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await PackageTypeService.terminatePackageType(selectedPackageType.typeId);

      setSuccess("Package type terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedPackageType.typeName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearPackageTypeSelection();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate package type");
      setToast({
        type: "error",
        title: "Termination Failed",
        message:
          err.message || "Failed to terminate package type. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!packageTypeDetails?.images) return [];
    return packageTypeDetails.images.map((img) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || "",
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const selectedSearchItem: PackageTypeSearchItem | null = selectedPackageType
    ? {
        id: selectedPackageType.typeId,
        name: selectedPackageType.typeName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedPackageType
    ? {
        id: selectedPackageType.typeId,
        name: selectedPackageType.typeName,
        type: "custom",
        additionalInfo: "Package Type",
      }
    : null;

  useEffect(() => {
    if (initialPackageTypeId && !packageTypeDetails) {
      handleSelectPackageType(
        parseInt(initialPackageTypeId),
        initialPackageTypeName,
      );
    }
  }, [initialPackageTypeId, initialPackageTypeName]);

  if (
    (commonLoading && packageTypes.length === 0) ||
    (loading && !selectedPackageType)
  ) {
    return (
      <CommonLoading
        message="Loading package types..."
        subMessage="Please wait while we fetch available package types"
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
            title="Terminate Package Type"
            description="Permanently remove a package type from the system"
            breadcrumbItems={PACKAGE_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no package type is selected */}
        {!selectedPackageType && (
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
                  Select Package Type to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a package type to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<PackageTypeSearchItem>
                items={searchItems}
                loading={commonLoading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectPackageType(item.id, item.name)
                }
                onClearSelection={handleClearPackageTypeSelection}
                initialSearchTerm={initialPackageTypeName}
                placeholder="Search package types..."
                title="Package Types"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Package Type Info Bar */}
        <SelectedItemBar
          item={
            selectedPackageType
              ? {
                  id: selectedPackageType.typeId,
                  name: selectedPackageType.typeName,
                }
              : null
          }
          onClear={handleClearPackageTypeSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Package Type Details Section */}
        {selectedPackageType && (
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
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.error }}
                >
                  Package Type Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot
                  be undone.
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
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.error }}
                >
                  #{selectedPackageType.typeId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading package type details..."
                subMessage="Please wait while we fetch the package type information"
                size="lg"
              />
            )}

            {/* Package Type Details Content */}
            {!loadingDetails && packageTypeDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <PackageTypeStats packageTypeDetails={packageTypeDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel packageTypeDetails={packageTypeDetails} />
                    <ImagesPanel
                      images={packageTypeDetails.images.map((img) => ({
                        id: img.imageId,
                        url: img.imageUrl,
                        name: img.name,
                        description: img.description || "",
                      }))}
                      onImageClick={handleImageClick}
                      title="Package Type Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <PackagesList
                      packages={packageTypeDetails.packageBasicDetails}
                    />

                    {/* Custom Impact Warning for Package Types */}
                    <ImpactWarning
                      title="Package Type Termination Impact"
                      customItems={[
                        {
                          icon: <Package size={11} />,
                          text: `All ${packageTypeDetails.totalPackages} packages using this type will lose their type association`,
                        },
                        {
                          icon: <Star size={11} />,
                          text: "Packages that have this as primary type will need to be reassigned",
                        },
                        {
                          icon: <Palette size={11} />,
                          text: "All color and styling settings will be permanently removed",
                        },
                        {
                          icon: <Info size={11} />,
                          text: "All package type descriptions and metadata will be deleted",
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
                        Terminate Package Type Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !packageTypeDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Package Type"
                message="The package type couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearPackageTypeSelection}
                onRetry={() =>
                  selectedPackageType &&
                  fetchPackageTypeDetails(selectedPackageType.typeId)
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
        title="Confirm Package Type Termination"
        description="You are about to permanently terminate:"
        warningMessage={`All ${packageTypeDetails?.totalPackages || 0} packages associated with this type will lose their type association, and all package type images will be permanently deleted.`}
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

export default TerminatePackageTypePage;
