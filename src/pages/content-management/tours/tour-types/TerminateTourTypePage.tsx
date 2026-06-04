"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TourTypeService } from "@/services/tourTypeService";
import { TourTypeBasic, TourTypeSearchItem } from "@/types/tour-type-types";
import { AlertTriangle, Search, Palette, Info, Hash } from "lucide-react";
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
import { TourTypeStats } from "@/components/tour-types-components/terminate-tour-type-components/TourTypeStats";
import { BasicInfoPanel } from "@/components/tour-types-components/terminate-tour-type-components/BasicInfoPanel";
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { hexToRgba } from "@/utils/functions";

const TerminateTourTypePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, loading: commonLoading } = useCommon();

  const initialTourTypeName = searchParams?.get("tour-type-name") || "";
  const initialTourTypeId = searchParams?.get("tour-type-id") || "";

  const [selectedTourType, setSelectedTourType] = useState<{
    typeId: number;
    typeName: string;
  } | null>(
    initialTourTypeId && initialTourTypeName
      ? {
          typeId: parseInt(initialTourTypeId),
          typeName: initialTourTypeName,
        }
      : null,
  );
  const [tourTypeDetails, setTourTypeDetails] = useState<TourTypeBasic | null>(
    null,
  );
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

  const tourTypes = categories?.tourTypeList || [];

  const searchItems: TourTypeSearchItem[] = tourTypes.map((type) => ({
    id: type.tourTypeId,
    name: type.tourTypeName,
  }));

  const fetchTourTypeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setTourTypeDetails(null);
    try {
      const response = await TourTypeService.getTourTypeDetails(id);
      setTourTypeDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour type details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load tour type details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectTourType = async (id: number, name: string) => {
    setSelectedTourType({ typeId: id, typeName: name });
    await fetchTourTypeDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("tour-type-id", id.toString());
    url.searchParams.set("tour-type-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearTourTypeSelection = () => {
    setSelectedTourType(null);
    setTourTypeDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("tour-type-id");
    url.searchParams.delete("tour-type-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedTourType) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedTourType) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await TourTypeService.terminateTourType(selectedTourType.typeId);

      setSuccess("Tour type terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedTourType.typeName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearTourTypeSelection();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate tour type");
      setToast({
        type: "error",
        title: "Termination Failed",
        message:
          err.message || "Failed to terminate tour type. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!tourTypeDetails?.images) return [];
    return tourTypeDetails.images.map((img) => ({
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

  const selectedSearchItem: TourTypeSearchItem | null = selectedTourType
    ? {
        id: selectedTourType.typeId,
        name: selectedTourType.typeName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedTourType
    ? {
        id: selectedTourType.typeId,
        name: selectedTourType.typeName,
        type: "custom",
        additionalInfo: "Tour Type",
      }
    : null;

  useEffect(() => {
    if (initialTourTypeId && !tourTypeDetails) {
      handleSelectTourType(parseInt(initialTourTypeId), initialTourTypeName);
    }
  }, [initialTourTypeId, initialTourTypeName]);

  if (
    (commonLoading && tourTypes.length === 0) ||
    (loading && !selectedTourType)
  ) {
    return (
      <CommonLoading
        message="Loading tour types..."
        subMessage="Please wait while we fetch available tour types"
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
            title="Terminate Tour Type"
            description="Permanently remove a tour type from the system"
            breadcrumbItems={TOUR_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no tour type is selected */}
        {!selectedTourType && (
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
                  Select Tour Type to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a tour type to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<TourTypeSearchItem>
                items={searchItems}
                loading={commonLoading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectTourType(item.id, item.name)
                }
                onClearSelection={handleClearTourTypeSelection}
                initialSearchTerm={initialTourTypeName}
                placeholder="Search tour types..."
                title="Tour Types"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Tour Type Info Bar */}
        <SelectedItemBar
          item={
            selectedTourType
              ? {
                  id: selectedTourType.typeId,
                  name: selectedTourType.typeName,
                }
              : null
          }
          onClear={handleClearTourTypeSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Tour Type Details Section */}
        {selectedTourType && (
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
                  Tour Type Termination Review
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
                  #{selectedTourType.typeId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading tour type details..."
                subMessage="Please wait while we fetch the tour type information"
                size="lg"
              />
            )}

            {/* Tour Type Details Content */}
            {!loadingDetails && tourTypeDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <TourTypeStats tourTypeDetails={tourTypeDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel tourTypeDetails={tourTypeDetails} />
                    <ImagesPanel
                      images={tourTypeDetails.images.map((img) => ({
                        id: img.imageId,
                        url: img.imageUrl,
                        name: img.name,
                        description: img.description || "",
                      }))}
                      onImageClick={handleImageClick}
                      title="Tour Type Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    {/* Custom Impact Warning for Tour Types */}
                    <ImpactWarning
                      title="Tour Type Termination Impact"
                      customItems={[
                        {
                          icon: <Hash size={11} />,
                          text: "All tours using this tour type will lose their tour type association",
                        },
                        {
                          icon: <Palette size={11} />,
                          text: "All color and styling settings will be permanently removed",
                        },
                        {
                          icon: <Info size={11} />,
                          text: "All tour type descriptions and metadata will be deleted",
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
                        Terminate Tour Type Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !tourTypeDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Tour Type"
                message="The tour type couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearTourTypeSelection}
                onRetry={() =>
                  selectedTourType &&
                  fetchTourTypeDetails(selectedTourType.typeId)
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
        title="Confirm Tour Type Termination"
        description="You are about to permanently terminate:"
        warningMessage="All tours associated with this tour type will lose their type association, and all tour type images will be permanently deleted."
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

export default TerminateTourTypePage;
