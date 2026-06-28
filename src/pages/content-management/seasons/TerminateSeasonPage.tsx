"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SeasonService } from "@/services/seasonService";
import {
  SeasonDetails,
  SeasonIdAndName,
  SeasonSearchItem,
} from "@/types/season-types";
import {
  AlertTriangle,
  Search,
  Calendar,
  Activity,
  MapPin,
  AlertCircle,
  Image as ImageIcon,
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
import { ImageModalImage } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { SEASON_TERMINATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { hexToRgba } from "@/utils/functions";
import { SeasonStats } from "@/components/season-components/terminate-season-components/SeasonStats";
import { BasicInfoPanel } from "@/components/season-components/terminate-season-components/BasicInfoPanel";
import { ClimateInfoPanel } from "@/components/season-components/terminate-season-components/ClimateInfoPanel";
import { ActivitiesList } from "@/components/season-components/terminate-season-components/ActivitiesList";
import { ToursList } from "@/components/season-components/terminate-season-components/ToursList";

const TerminateSeasonPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSeasonName = searchParams?.get("season-name") || "";
  const initialSeasonId = searchParams?.get("season-id") || "";

  const [seasons, setSeasons] = useState<SeasonIdAndName[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<SeasonIdAndName | null>(
    initialSeasonId && initialSeasonName
      ? {
          seasonId: parseInt(initialSeasonId),
          seasonName: initialSeasonName,
        }
      : null,
  );
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(
    null,
  );
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

  const fetchSeasons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SeasonService.getSeasonIdAndName();
      setSeasons(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load seasons");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load seasons",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setSeasonDetails(null);
    try {
      const response = await SeasonService.getSeasonDetails(id);
      setSeasonDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load season details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load season details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectSeason = async (id: number, name: string) => {
    setSelectedSeason({ seasonId: id, seasonName: name });
    await fetchSeasonDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("season-id", id.toString());
    url.searchParams.set("season-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearSeasonSelection = () => {
    setSelectedSeason(null);
    setSeasonDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("season-id");
    url.searchParams.delete("season-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedSeason) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedSeason) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await SeasonService.terminateSeason(selectedSeason.seasonId);

      setSuccess("Season terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedSeason.seasonName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearSeasonSelection();
        fetchSeasons();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate season");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate season. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!seasonDetails?.seasonImages) return [];
    return seasonDetails.seasonImages.map((img) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || "",
      id: img.id,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  // Convert seasons to search items format
  const searchItems: SeasonSearchItem[] = seasons.map((season) => ({
    id: season.seasonId,
    name: season.seasonName,
  }));

  const selectedSearchItem: SeasonSearchItem | null = selectedSeason
    ? {
        id: selectedSeason.seasonId,
        name: selectedSeason.seasonName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedSeason
    ? {
        id: selectedSeason.seasonId,
        name: selectedSeason.seasonName,
        type: "custom",
        additionalInfo: "Season",
      }
    : null;

  useEffect(() => {
    if (!selectedSeason) {
      fetchSeasons();
    }
  }, []);

  useEffect(() => {
    if (initialSeasonId && !seasonDetails) {
      handleSelectSeason(parseInt(initialSeasonId), initialSeasonName);
    }
  }, [initialSeasonId, initialSeasonName]);

  if (loading && !selectedSeason) {
    return (
      <CommonLoading
        message="Loading seasons..."
        subMessage="Please wait while we fetch available seasons"
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
            title="Terminate Season"
            description="Permanently remove a season from the system"
            breadcrumbItems={SEASON_TERMINATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no season is selected */}
        {!selectedSeason && (
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
                  Select Season to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a season to review its data before
                  termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<SeasonSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectSeason(item.id, item.name)}
                onClearSelection={handleClearSeasonSelection}
                initialSearchTerm={initialSeasonName}
                placeholder="Search seasons..."
                title="Seasons"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Season Info Bar */}
        <SelectedItemBar
          item={
            selectedSeason
              ? {
                  id: selectedSeason.seasonId,
                  name: selectedSeason.seasonName,
                }
              : null
          }
          onClear={handleClearSeasonSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Season Details Section */}
        {selectedSeason && (
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
                  Season Termination Review
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
                  #{selectedSeason.seasonId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading season details..."
                subMessage="Please wait while we fetch the season information"
                size="lg"
              />
            )}

            {/* Season Details Content */}
            {!loadingDetails && seasonDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <SeasonStats seasonDetails={seasonDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel seasonDetails={seasonDetails} />
                    <ClimateInfoPanel seasonDetails={seasonDetails} />
                    <ImagesPanel
                      images={seasonDetails.seasonImages.map((img) => ({
                        id: img.id,
                        url: img.imageUrl,
                        name: img.name,
                        description: img.description || "",
                      }))}
                      onImageClick={handleImageClick}
                      title="Season Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <ActivitiesList activities={seasonDetails.activities} />
                    <ToursList tours={seasonDetails.tours} />

                    {/* Custom Impact Warning for Seasons */}
                    <ImpactWarning
                      title="Season Termination Impact"
                      customItems={[
                        {
                          icon: <Activity size={11} />,
                          text: `All ${seasonDetails.activities.length} activity(ies) associated with this season will lose their season reference`,
                        },
                        {
                          icon: <MapPin size={11} />,
                          text: `All ${seasonDetails.tours.length} tour(s) associated with this season will lose their season reference`,
                        },
                        {
                          icon: <Calendar size={11} />,
                          text: "All date range and month settings will be permanently deleted",
                        },
                        {
                          icon: <ImageIcon size={11} />,
                          text: "All season images will be permanently deleted from storage",
                        },
                        {
                          icon: <AlertCircle size={11} />,
                          text: "This action cannot be undone — recovery is not possible",
                        },
                        {
                          icon: <AlertCircle size={11} />,
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
                        Terminate Season Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !seasonDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Season"
                message="The season couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearSeasonSelection}
                onRetry={() =>
                  selectedSeason && fetchSeasonDetails(selectedSeason.seasonId)
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
        title="Confirm Season Termination"
        description="You are about to permanently terminate:"
        warningMessage={`All ${seasonDetails?.activities.length || 0} activity(ies) and ${seasonDetails?.tours.length || 0} tour(s) associated with this season will lose their season reference, and all season images will be permanently deleted.`}
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

export default TerminateSeasonPage;
