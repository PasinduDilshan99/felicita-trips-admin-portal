// app/destinations/trending/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import {
  TrendingDestination,
  DestinationForTerminate,
  SingleDestinationResponse,
} from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import TrendingDestinationsList from "@/components/web-page-management-components/trending-destinations-components/TrendingDestinationsList";
import AddTrendingDestinationForm from "@/components/web-page-management-components/trending-destinations-components/AddTrendingDestinationForm";
import {
  TRENDING_DESTINATIONS_MANAGE_URL,
  WEB_HOME_PAGE_URL,
  WEB_PAGE_MANAGEMENT_URL,
} from "@/utils/urls";
import { hexToRgba } from "@/utils/functions";

interface DestinationSearchItem extends SearchItem {
  id: number;
  name: string;
}

const breadcrumbItems = [
  { label: "Dashboard", href: "/" },
  { label: "Web Page Management", href: WEB_PAGE_MANAGEMENT_URL },
  { label: "Home Page", href: WEB_HOME_PAGE_URL },
  { label: "Trending Destinations", href: TRENDING_DESTINATIONS_MANAGE_URL },
];

const TrendingDestinationsChangePage = () => {
  const { theme } = useTheme();

  const [trendingDestinations, setTrendingDestinations] = useState<
    TrendingDestination[]
  >([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for adding new trending destination
  const [destinations, setDestinations] = useState<DestinationForTerminate[]>(
    [],
  );
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationForTerminate | null>(null);
  const [selectedDestinationDetails, setSelectedDestinationDetails] =
    useState<SingleDestinationResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // State for termination
  const [terminating, setTerminating] = useState<number | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Fetch trending destinations on mount
  useEffect(() => {
    fetchTrendingDestinations();
  }, []);

  const fetchTrendingDestinations = async () => {
    setLoadingTrending(true);
    setError(null);
    try {
      const response = await DestinationService.getTrendingDestinations();
      setTrendingDestinations(response.data);
    } catch (err: any) {
      console.error("Error fetching trending destinations:", err);
      setError(err.message || "Failed to load trending destinations");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load trending destinations",
      });
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchDestinationsForTerminate = async () => {
    setLoadingDestinations(true);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
    } catch (err: any) {
      console.error("Error fetching destinations:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load destinations",
      });
    } finally {
      setLoadingDestinations(false);
    }
  };

  const fetchDestinationDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const response = await DestinationService.getDestinationById(id);
      setSelectedDestinationDetails(response.data);
    } catch (err: any) {
      console.error("Error fetching destination details:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load destination details",
      });
      setSelectedDestination(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectDestination = async (item: DestinationSearchItem) => {
    const id = item.id as number;
    const name = item.name;
    setSelectedDestination({ destinationId: id, destinationName: name });
    await fetchDestinationDetails(id);
  };

  const handleClearSelection = () => {
    setSelectedDestination(null);
    setSelectedDestinationDetails(null);
  };

  const handleAddTrendingDestination = async () => {
    if (!selectedDestination || !selectedDestinationDetails) return;

    setAdding(true);
    try {
      const response = await DestinationService.addTrendingDestination({
        destinationId: selectedDestination.destinationId,
        destinationName: selectedDestination.destinationName,
        status: "ACTIVE",
      });

      setToast({
        type: "success",
        title: "Success!",
        message:
          response.message ||
          `${selectedDestination.destinationName} has been added to trending destinations!`,
      });

      // Reset add form
      setSelectedDestination(null);
      setSelectedDestinationDetails(null);
      setShowAddForm(false);

      // Refresh trending destinations list
      await fetchTrendingDestinations();
    } catch (err: any) {
      console.error("Error adding trending destination:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to add trending destination",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleTerminateTrendingDestination = async (
    destinationId: number,
    destinationName: string,
  ) => {
    setTerminating(destinationId);
    try {
      const response = await DestinationService.terminateTrendingDestination({
        destinationId,
        destinationName,
        status: "INACTIVE",
      });

      setToast({
        type: "success",
        title: "Removed Successfully!",
        message:
          response.message ||
          `${destinationName} has been removed from trending destinations!`,
      });

      // Refresh trending destinations list
      await fetchTrendingDestinations();
    } catch (err: any) {
      console.error("Error terminating trending destination:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove trending destination",
      });
    } finally {
      setTerminating(null);
    }
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
    fetchDestinationsForTerminate();
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setSelectedDestination(null);
    setSelectedDestinationDetails(null);
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

  // Custom render function for destination items
  const renderDestinationItem = (
    item: DestinationSearchItem,
    searchTerm: string,
    isActive: boolean,
  ) => {
    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.18),
              color: theme.primary,
              fontWeight: 600,
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      );
    };

    return (
      <>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
              : hexToRgba(theme.primary, 0.1),
          }}
        >
          <span
            className="text-sm"
            style={{ color: isActive ? "#fff" : theme.primary }}
          >
            📍
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm" style={{ color: theme.text }}>
            {highlightMatch(item.name, searchTerm)}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            ID: {item.id}
          </div>
        </div>
      </>
    );
  };

  if (loadingTrending) {
    return (
      <CommonLoading
        message="Loading trending destinations..."
        subMessage="Please wait while we fetch trending destinations"
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
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Trending Destinations"
            description="Manage destinations that appear on the trending section"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add New Section */}
        {!showAddForm ? (
          <div className="mb-8">
            <button
              onClick={handleAddNewClick}
              className="cursor-pointer group relative px-6 py-3 rounded-xl font-medium flex items-center gap-2.5 overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: "#fff",
                boxShadow: `0 4px 15px -3px ${theme.primary}55`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 25px -4px ${theme.primary}88`;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 15px -3px ${theme.primary}55`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Shimmer overlay */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.4s infinite",
                }}
              />

              {/* Icon with subtle scale */}
              <span
                className="relative text-base transition-transform duration-300 group-hover:rotate-90"
                style={{ lineHeight: 1 }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1.5V14.5M1.5 8H14.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="relative text-sm tracking-wide font-semibold">
                Add New Trending Destination
              </span>
            </button>
          </div>
        ) : (
          <AddTrendingDestinationForm
            searchItems={searchItems}
            loadingDestinations={loadingDestinations}
            selectedSearchItem={selectedSearchItem}
            selectedDestinationDetails={selectedDestinationDetails}
            loadingDetails={loadingDetails}
            adding={adding}
            onSelectDestination={handleSelectDestination}
            onClearSelection={handleClearSelection}
            onAdd={handleAddTrendingDestination}
            onCancel={handleCancelAdd}
            renderDestinationItem={renderDestinationItem}
          />
        )}

        {/* Trending Destinations List */}
        {error ? (
          <CommonErrorState
            error={error}
            title="Failed to Load Trending Destinations"
            message="Unable to load trending destinations. Please try again."
            variant="error"
            showRetryButton={true}
            onRetry={fetchTrendingDestinations}
            fullScreen={false}
          />
        ) : trendingDestinations.length === 0 ? (
          <div
            className="rounded-2xl shadow-lg p-12 text-center"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span className="text-6xl mb-4 block">🔥</span>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: theme.text }}
            >
              No Trending Destinations
            </h3>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Click the "Add New Trending Destination" button to add
              destinations to the trending section.
            </p>
          </div>
        ) : (
          <TrendingDestinationsList
            destinations={trendingDestinations}
            onTerminate={handleTerminateTrendingDestination}
            terminatingId={terminating}
          />
        )}
      </div>
    </div>
  );
};

export default TrendingDestinationsChangePage;
