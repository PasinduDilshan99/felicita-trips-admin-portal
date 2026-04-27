"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { DestinationForTerminate, SingleDestinationResponse } from "@/types/destination-types";
import { CheckCircle, XCircle, X, AlertTriangle, Loader2, Activity } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

import { DestinationSearch } from "@/components/destinations-components/terminate-destination-components/DestinationSearch";
import { DestinationStats } from "@/components/destinations-components/terminate-destination-components/DestinationStats";
import { BasicInfoPanel } from "@/components/destinations-components/terminate-destination-components/BasicInfoPanel";
import { ActivitiesList } from "@/components/destinations-components/terminate-destination-components/ActivitiesList";
import { ImpactWarning } from "@/components/destinations-components/terminate-destination-components/ImpactWarning";
import { TerminationModal } from "@/components/destinations-components/terminate-destination-components/TerminationModal";
import { ImagesPanel } from "@/components/destinations-components/terminate-destination-components/ImagesPanel";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TerminateDestinationPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  const [destinations, setDestinations] = useState<DestinationForTerminate[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialDestinationName);
  const [selectedDestination, setSelectedDestination] = useState<DestinationForTerminate | null>(
    initialDestinationId && initialDestinationName
      ? { destinationId: parseInt(initialDestinationId), destinationName: initialDestinationName }
      : null
  );
  const [destinationDetails, setDestinationDetails] = useState<SingleDestinationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Destinations", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}` },
    { label: "Terminate", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate` },
  ];

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
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
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectDestination = async (id: number, name: string) => {
    setSelectedDestination({ destinationId: id, destinationName: name });
    setSearchTerm(name);
    await fetchDestinationDetails(id);
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
      await DestinationService.terminateDestination(selectedDestination.destinationId);
      
      setSuccess("Destination terminated successfully!");
      setShowConfirmModal(false);
      
      setTimeout(() => {
        setSelectedDestination(null);
        setDestinationDetails(null);
        setSearchTerm("");
        fetchDestinations();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate destination");
    } finally {
      setLoadingTerminate(false);
    }
  };

  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
  }, []);

  useEffect(() => {
    if (initialDestinationId && !destinationDetails) {
      handleSelectDestination(parseInt(initialDestinationId), initialDestinationName);
    }
  }, [initialDestinationId, initialDestinationName]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Destination"
            description="Permanently remove a destination from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div
            className="mb-8 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
              border: `1px solid ${hexToRgba(theme.success, 0.3)}`,
            }}
          >
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 flex-shrink-0" style={{ color: theme.success }} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold" style={{ color: theme.success }}>Operation Successful!</h3>
                <p className="mt-1" style={{ color: theme.textSecondary }}>{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-8 p-6 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
              border: `1px solid ${hexToRgba(theme.error, 0.3)}`,
            }}
          >
            <div className="flex items-center gap-4">
              <XCircle className="w-8 h-8 flex-shrink-0" style={{ color: theme.error }} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold" style={{ color: theme.error }}>Error</h3>
                <p className="mt-1" style={{ color: theme.textSecondary }}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-2 rounded-lg transition-colors hover:opacity-70"
                style={{ color: theme.error }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div
          className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b" style={{ borderColor: theme.border }}>
            <span
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: hexToRgba(theme.primary, 0.1), color: theme.primary }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
                Select Destination to Terminate
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Search and select a destination to review its data before termination
              </p>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5">
            <DestinationSearch
              destinations={destinations}
              loading={loading}
              selectedDestination={selectedDestination}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectDestination={handleSelectDestination}
            />
          </div>
        </div>

        {/* Destination Details Section */}
        {selectedDestination && (
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
                style={{ background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`, color: "#fff" }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold" style={{ color: theme.error }}>Destination Termination Review</h2>
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
                <span className="text-xs" style={{ color: theme.error }}>ID</span>
                <span className="text-sm font-bold" style={{ color: theme.error }}>
                  #{selectedDestination.destinationId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: hexToRgba(theme.primary, 0.1) }}
                >
                  <Loader2 size={22} className="animate-spin" style={{ color: theme.primary }} />
                </div>
                <p className="text-sm" style={{ color: theme.textSecondary }}>Loading destination details…</p>
              </div>
            ) : destinationDetails ? (
              <div className="p-5 sm:p-6 space-y-6">
                <DestinationStats destinationDetails={destinationDetails} />

                <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel destinationDetails={destinationDetails} />
                    <ImagesPanel images={destinationDetails.images} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <div
                      className="rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        background: hexToRgba(theme.warning, 0.05),
                        border: `1.5px solid ${hexToRgba(theme.warning, 0.3)}`,
                      }}
                    >
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${hexToRgba(theme.warning, 0.3)}` }}>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" style={{ color: theme.warning }} />
                          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>Activities ({destinationDetails.activities.length})</h3>
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
                        <ActivitiesList activities={destinationDetails.activities} />
                      </div>
                    </div>

                    <ImpactWarning />
                  </div>
                </div>

                {/* Termination Button */}
                <div className="flex justify-center pt-4" style={{ borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}` }}>
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Terminate Destination Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <AlertTriangle size={36} style={{ color: theme.textSecondary }} />
                <p className="text-sm font-medium" style={{ color: theme.text }}>Could not load destination details</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Please try selecting the destination again</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminationModal
        isOpen={showConfirmModal}
        selectedDestination={selectedDestination}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
      />
    </div>
  );
};

export default TerminateDestinationPage;