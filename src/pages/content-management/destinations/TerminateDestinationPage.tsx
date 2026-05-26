"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DestinationService } from "@/services/destinationService";
import {
  DestinationForTerminate,
  DestinationSearchItem,
  SingleDestinationResponse,
} from "@/types/destination-types";
import { AlertTriangle, Activity, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import ImageModal from "@/components/common-components/ImageModal";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { DestinationStats } from "@/components/destinations-components/terminate-destination-components/DestinationStats";
import { BasicInfoPanel } from "@/components/destinations-components/terminate-destination-components/BasicInfoPanel";
import { ActivitiesList } from "@/components/destinations-components/terminate-destination-components/ActivitiesList";
import {
  TerminationItem,
  TerminationModal,
} from "@/components/common-components/terminate-components/TerminationModal";
import { ImagesPanel } from "@/components/common-components/terminate-components/ImagesPanel";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import { hexToRgba } from "@/utils/functions";
import { DESTINATION_TERMINATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { ImageModalImage } from "@/types/common-components-types";

const TerminateDestinationPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  const [destinations, setDestinations] = useState<DestinationForTerminate[]>(
    [],
  );
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationForTerminate | null>(
      initialDestinationId && initialDestinationName
        ? {
            destinationId: parseInt(initialDestinationId),
            destinationName: initialDestinationName,
          }
        : null,
    );
  const [destinationDetails, setDestinationDetails] =
    useState<SingleDestinationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load destinations",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setDestinationDetails(null);
    try {
      const response = await DestinationService.getDestinationById(id);
      setDestinationDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destination details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load destination details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectDestination = async (id: number, name: string) => {
    setSelectedDestination({ destinationId: id, destinationName: name });
    await fetchDestinationDetails(id);

    const url = new URL(window.location.href);
    url.searchParams.set("destination-id", id.toString());
    url.searchParams.set("destination-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearDestinationSelection = () => {
    setSelectedDestination(null);
    setDestinationDetails(null);
    setError(null);
    setSuccess(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("destination-id");
    url.searchParams.delete("destination-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedDestination) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedDestination) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await DestinationService.terminateDestination(
        selectedDestination.destinationId,
      );

      setSuccess("Destination terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedDestination.destinationName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearDestinationSelection();
        fetchDestinations();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate destination");
      setToast({
        type: "error",
        title: "Termination Failed",
        message:
          err.message || "Failed to terminate destination. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!destinationDetails?.images) return [];
    return destinationDetails.images.map((img) => ({
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

  // Convert destinations to search items format
  const searchItems: DestinationSearchItem[] = destinations.map((dest) => ({
    id: dest.destinationId,
    name: dest.destinationName,
  }));

  const selectedSearchItem: DestinationSearchItem | null = selectedDestination
    ? {
        id: selectedDestination.destinationId,
        name: selectedDestination.destinationName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedDestination
    ? {
        id: selectedDestination.destinationId,
        name: selectedDestination.destinationName,
        type: "destination",
      }
    : null;

  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
  }, []);

  useEffect(() => {
    if (initialDestinationId && !destinationDetails) {
      handleSelectDestination(
        parseInt(initialDestinationId),
        initialDestinationName,
      );
    }
  }, [initialDestinationId, initialDestinationName]);

  if (loading && !selectedDestination) {
    return (
      <CommonLoading
        message="Loading destinations..."
        subMessage="Please wait while we fetch available destinations"
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

      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Destination"
            description="Permanently remove a destination from the system"
            breadcrumbItems={DESTINATION_TERMINATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedDestination && (
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
                  Select Destination to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a destination to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<DestinationSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectDestination(item.id, item.name)
                }
                onClearSelection={handleClearDestinationSelection}
                initialSearchTerm={initialDestinationName}
                placeholder="Search destinations..."
                title="Destinations"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        <SelectedItemBar
          item={
            selectedDestination
              ? {
                  id: selectedDestination.destinationId,
                  name: selectedDestination.destinationName,
                }
              : null
          }
          onClear={handleClearDestinationSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {selectedDestination && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
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
                  Destination Termination Review
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
                  #{selectedDestination.destinationId}
                </span>
              </div>
            </div>

            {loadingDetails && (
              <CommonLoading
                message="Loading destination details..."
                subMessage="Please wait while we fetch the destination information"
                size="lg"
              />
            )}

            {!loadingDetails && destinationDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <DestinationStats destinationDetails={destinationDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  <div className="space-y-5">
                    <BasicInfoPanel destinationDetails={destinationDetails} />
                    <ImagesPanel
                      images={destinationDetails.images.map((img) => ({
                        id: img.imageId,
                        url: img.imageUrl,
                        name: img.imageName,
                        description: img.imageDescription,
                      }))}
                      onImageClick={handleImageClick}
                      title="Destination Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  <div className="space-y-5">
                    <div
                      className="rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        background: hexToRgba(theme.warning, 0.05),
                        border: `1.5px solid ${hexToRgba(theme.warning, 0.3)}`,
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{
                          borderBottom: `1px solid ${hexToRgba(theme.warning, 0.3)}`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Activity
                            className="w-4 h-4"
                            style={{ color: theme.warning }}
                          />
                          <h3
                            className="text-sm font-semibold"
                            style={{ color: theme.text }}
                          >
                            Activities ({destinationDetails.activities.length})
                          </h3>
                        </div>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: hexToRgba(theme.warning, 0.1),
                            color: theme.warning,
                            border: `1px solid ${hexToRgba(theme.warning, 0.2)}`,
                          }}
                        >
                          All will be removed
                        </span>
                      </div>
                      <div className="px-4 py-4">
                        <ActivitiesList
                          activities={destinationDetails.activities}
                        />
                      </div>
                    </div>

                    <ImpactWarning entityType="destination" />
                  </div>
                </div>

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
                        Terminate Destination Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !destinationDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Destination"
                message="The destination couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearDestinationSelection}
                onRetry={() =>
                  selectedDestination &&
                  fetchDestinationDetails(selectedDestination.destinationId)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      <TerminationModal
        isOpen={showConfirmModal}
        item={terminationItem}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
      />

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

export default TerminateDestinationPage;
