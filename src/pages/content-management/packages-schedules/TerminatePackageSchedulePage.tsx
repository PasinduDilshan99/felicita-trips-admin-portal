// app/web-management/package-schedules/terminate/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import { PackageScheduleService } from "@/services/packageScheduleService";
import { PackageScheduleDetails, PackageScheduleIdAndName } from "@/types/package-schedule-types";
import { AlertTriangle, Search, Calendar, Clock, MapPin, Hotel, Package, DollarSign, Users, Gift, AlertCircle, Tag, Hash, Percent, Car, Utensils, Coffee, Sun, Moon, Bed } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import { TerminationItem, TerminationModal } from "@/components/common-components/terminate-components/TerminationModal";

import { PackageScheduleStats } from "@/components/package-schedules-components/terminate-package-schedule-components/PackageScheduleStats";
import { BasicInfoPanel } from "@/components/package-schedules-components/terminate-package-schedule-components/BasicInfoPanel";
import { PackageInfoPanel } from "@/components/package-schedules-components/terminate-package-schedule-components/PackageInfoPanel";
import { TourInfoPanel } from "@/components/package-schedules-components/terminate-package-schedule-components/TourInfoPanel";
import { FeaturesList } from "@/components/package-schedules-components/terminate-package-schedule-components/FeaturesList";
import { AccommodationsList } from "@/components/package-schedules-components/terminate-package-schedule-components/AccommodationsList";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type for search items
interface PackageScheduleSearchItem {
  id: number;
  name: string;
}

const TerminatePackageSchedulePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialScheduleName = searchParams?.get("schedule-name") || "";
  const initialScheduleId = searchParams?.get("schedule-id") || "";

  const [schedules, setSchedules] = useState<PackageScheduleIdAndName[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<PackageScheduleIdAndName | null>(
    initialScheduleId && initialScheduleName
      ? {
          packageScheduleId: parseInt(initialScheduleId),
          packageScheduleName: initialScheduleName,
        }
      : null,
  );
  const [scheduleDetails, setScheduleDetails] = useState<PackageScheduleDetails | null>(null);
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

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Package Schedules",
      href: `${WEB_MANAGEMENT_PATH}/package-schedules`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}/package-schedules/terminate`,
    },
  ];

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageScheduleService.getPackageScheduleIdAndNames();
      setSchedules(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load package schedules");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load package schedules",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setScheduleDetails(null);
    try {
      const response = await PackageScheduleService.getPackageScheduleDetails(id);
      setScheduleDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load schedule details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load schedule details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectSchedule = async (id: number, name: string) => {
    setSelectedSchedule({ packageScheduleId: id, packageScheduleName: name });
    await fetchScheduleDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("schedule-id", id.toString());
    url.searchParams.set("schedule-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearScheduleSelection = () => {
    setSelectedSchedule(null);
    setScheduleDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("schedule-id");
    url.searchParams.delete("schedule-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedSchedule) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedSchedule) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await PackageScheduleService.terminatePackageSchedule(selectedSchedule.packageScheduleId);

      setSuccess("Package schedule terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedSchedule.packageScheduleName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearScheduleSelection();
        fetchSchedules();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate schedule");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate schedule. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Convert schedules to search items format
  const searchItems: PackageScheduleSearchItem[] = schedules.map((schedule) => ({
    id: schedule.packageScheduleId,
    name: schedule.packageScheduleName,
  }));

  const selectedSearchItem: PackageScheduleSearchItem | null = selectedSchedule
    ? {
        id: selectedSchedule.packageScheduleId,
        name: selectedSchedule.packageScheduleName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedSchedule
    ? {
        id: selectedSchedule.packageScheduleId,
        name: selectedSchedule.packageScheduleName,
        type: "custom",
        additionalInfo: "Package Schedule",
      }
    : null;

  useEffect(() => {
    if (!selectedSchedule) {
      fetchSchedules();
    }
  }, []);

  useEffect(() => {
    if (initialScheduleId && !scheduleDetails) {
      handleSelectSchedule(parseInt(initialScheduleId), initialScheduleName);
    }
  }, [initialScheduleId, initialScheduleName]);

  if (loading && !selectedSchedule) {
    return (
      <CommonLoading
        message="Loading package schedules..."
        subMessage="Please wait while we fetch available schedules"
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
            title="Terminate Package Schedule"
            description="Permanently remove a package schedule from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no schedule is selected */}
        {!selectedSchedule && (
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
                  Select Package Schedule to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a schedule to review its data before termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<PackageScheduleSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectSchedule(item.id, item.name)}
                onClearSelection={handleClearScheduleSelection}
                initialSearchTerm={initialScheduleName}
                placeholder="Search package schedules..."
                title="Package Schedules"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Schedule Info Bar */}
        <SelectedItemBar
          item={
            selectedSchedule
              ? {
                  id: selectedSchedule.packageScheduleId,
                  name: selectedSchedule.packageScheduleName,
                }
              : null
          }
          onClear={handleClearScheduleSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Schedule Details Section */}
        {selectedSchedule && (
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
                  Package Schedule Termination Review
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
                  #{selectedSchedule.packageScheduleId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading schedule details..."
                subMessage="Please wait while we fetch the schedule information"
                size="lg"
              />
            )}

            {/* Schedule Details Content */}
            {!loadingDetails && scheduleDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <PackageScheduleStats scheduleDetails={scheduleDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel scheduleDetails={scheduleDetails} />
                    <PackageInfoPanel scheduleDetails={scheduleDetails} />
                    <TourInfoPanel scheduleDetails={scheduleDetails} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <FeaturesList features={scheduleDetails.features} />
                    <AccommodationsList accommodations={scheduleDetails.accommodations} />

                    {/* Custom Impact Warning for Package Schedules */}
                    <ImpactWarning
                      title="Schedule Termination Impact"
                      customItems={[
                        {
                          icon: <Package size={11} />,
                          text: `The package "${scheduleDetails.packageName}" will lose this schedule`,
                        },
                        {
                          icon: <Calendar size={11} />,
                          text: "All schedule date and time settings will be permanently deleted",
                        },
                        {
                          icon: <Hotel size={11} />,
                          text: `All ${scheduleDetails.accommodations.length} accommodation(s) will be permanently removed`,
                        },
                        {
                          icon: <Gift size={11} />,
                          text: `All ${scheduleDetails.features.length} feature(s) will be permanently removed`,
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
                        Terminate Schedule Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !scheduleDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Schedule"
                message="The schedule couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearScheduleSelection}
                onRetry={() =>
                  selectedSchedule && fetchScheduleDetails(selectedSchedule.packageScheduleId)
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
        title="Confirm Schedule Termination"
        description="You are about to permanently terminate:"
        warningMessage={`The package "${scheduleDetails?.packageName || selectedSchedule?.packageScheduleName}" will lose this schedule, and all schedule data including ${scheduleDetails?.accommodations.length || 0} accommodations and ${scheduleDetails?.features.length || 0} features will be permanently deleted.`}
      />
    </div>
  );
};

export default TerminatePackageSchedulePage;