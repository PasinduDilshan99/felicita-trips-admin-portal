// app/destinations/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import DestinationCard from "@/components/destinations-components/DestinationCard";
import DestinationListCard from "@/components/destinations-components/DestinationListCard";
import Pagination from "@/components/common-components/Pagination";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { DestinationService } from "@/services/destinationService";
import {
  DestinationFilterParams,
  Destination,
} from "@/types/destination-types";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  DESTINATION_PAGE_URL,
  DESTINATIONS_VIEW_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Destination Name" },
  { value: "destination_id", label: "Destination ID" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "location", label: "Location" },
];

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: DestinationFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.destinationCategory)
    params.set("destinationCategory", filters.destinationCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

const urlParamsToFilters = (
  params: URLSearchParams,
): DestinationFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    destinationCategory: params.get("destinationCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

// Loading component
const LoadingComponent = ({ theme }: { theme: any }) => (
  <div
    className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
    style={{
      backgroundColor: theme.surface,
      borderColor: theme.border,
    }}
  >
    <Loader2
      className="w-12 h-12 animate-spin"
      style={{ color: theme.primary }}
    />
    <span className="mt-4 text-lg font-medium" style={{ color: theme.text }}>
      Loading destinations...
    </span>
  </div>
);

// Main component wrapped with Suspense for useSearchParams
const DestinationsViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Destinations", href: `${DESTINATION_PAGE_URL}` },
    { label: "View", href: `${DESTINATIONS_VIEW_PAGE_URL}` },
  ];

  const [filters, setFilters] = useState<DestinationFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<ImageModalImage[]>([]);

  // Get destination categories from CommonContext
  const getDestinationCategories = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (categories && categories.destinationCategoryList) {
      return categories.destinationCategoryList.map((cat) => ({
        value: cat.destinationCategoryName,
        label: cat.destinationCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // Get status options
  const getStatusOptions = () => [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Destination Name",
      type: "text",
      placeholder: "Search by name...",
      width: "full",
    },
    {
      key: "duration",
      label: "Duration (hours)",
      type: "number",
      placeholder: "Duration in hours",
      min: 0,
      step: 1,
      width: "third",
    },
    {
      key: "destinationCategory",
      label: "Category",
      type: "select",
      options: getDestinationCategories(),
      width: "third",
    },
    {
      key: "season",
      label: "Season",
      type: "select",
      options: availableSeasons.map((season) => ({
        value: season,
        label: season,
      })),
      width: "third",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusOptions(),
      width: "third",
    },
  ];

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: DestinationFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchDestinations = useCallback(
    async (currentFilters: DestinationFilterParams) => {
      setLoading(true);
      try {
        const apiFilters = {
          ...currentFilters,
          minPrice: null,
          maxPrice: null,
        };

        const response = await DestinationService.getDestinations(apiFilters);
        const data = response.data;

        setDestinations(data.destinationResponseDtos);
        setTotalItems(data.destinationCount);

        const seasons = DestinationService.extractSeasons(
          data.destinationResponseDtos,
        );
        setAvailableSeasons(seasons);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  // Initial load from URL params
  useEffect(() => {
    const initialFilters = urlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters(initialFilters);
    fetchDestinations(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchDestinations(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchDestinations]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: DestinationFilterParams = {
      name: null,
      minPrice: null,
      maxPrice: null,
      duration: null,
      destinationCategory: null,
      season: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: undefined,
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchDestinations(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: DestinationFilterParams = {
      ...filters,
      sortBy: undefined,
      sortDirection: "ASC" as const, // Add 'as const' to fix the type
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: newSortBy || undefined,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Handle image click for modal
  const handleImageClick = (destination: Destination, imageIndex: number) => {
    const images: ImageModalImage[] = destination.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
    setModalImages(images);
    setSelectedImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.destinationCategory) {
      activeFilters.push({
        key: "destinationCategory",
        label: "Category",
        value: filters.destinationCategory,
      });
    }
    if (filters.season) {
      activeFilters.push({
        key: "season",
        label: "Season",
        value: filters.season,
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
      });
    }
    if (filters.duration) {
      activeFilters.push({
        key: "duration",
        label: "Duration",
        value: `${filters.duration} hours`,
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (!filters.sortBy) return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: filters.sortDirection || "ASC",
    };
  };

  const currentStart =
    destinations.length > 0
      ? (filters.pageNumber - 1) * filters.pageSize + 1
      : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    duration: filters.duration,
    destinationCategory: filters.destinationCategory,
    season: filters.season,
    status: filters.status,
  };

  if (categoriesLoading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch available categories"
        size="md"
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Destinations View"
            description="Explore and manage travel destinations with rich visual experience"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <FilterPanel
            filters={filterPanelFilters}
            fields={filterFields}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            onPageSizeChange={handlePageSizeChange}
            onSortChange={handleSortChange}
            pageSize={filters.pageSize}
            pageSizeOptions={[6, 9, 12, 24, 48]}
            showPageSize={true}
            showSorting={true}
            sortOptions={SORT_OPTIONS}
            sortBy={filters.sortBy || ""}
            sortDirection={filters.sortDirection || "ASC"}
            title="Filter Destinations"
            searchButtonText="Search"
            resetButtonText="Reset"
            showActiveFilters={false}
            collapsible={true}
            isLoading={loading}
          />
        </div>

        {/* Active Filters Display */}
        <ActiveFilters
          filters={getActiveFilters()}
          sortFilter={getSortFilter()}
          onRemoveFilter={handleRemoveFilter}
          onRemoveSort={handleRemoveSort}
          onClearAll={handleReset}
          title="Active Filters"
          showClearAll={true}
          variant="default"
        />

        {/* Results Header with View Toggle */}
        <div className="mb-6">
          <ResultsHeader
            title="Destinations"
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <CommonLoading
            message="Loading destinations..."
            subMessage="Fetching the latest travel experiences"
            size="lg"
          />
        )}
        {/* Destinations Grid/List */}
        {!loading && (
          <>
            {destinations.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {destinations.map((destination) => (
                      <DestinationCard
                        key={destination.destinationId}
                        destination={destination}
                        onImageClick={(imageIndex) =>
                          handleImageClick(destination, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {destinations.map((destination) => (
                      <DestinationListCard
                        key={destination.destinationId}
                        destination={destination}
                        onImageClick={(imageIndex) =>
                          handleImageClick(destination, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10">
                  <Pagination
                    currentPage={filters.pageNumber}
                    totalItems={totalItems}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                    showResultsCount={true}
                    showFirstLastButtons={true}
                    showProgressBar={true}
                    size="md"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        images={modalImages}
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

// Wrap with Suspense for useSearchParams
const DestinationsViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <DestinationsViewContent />
    </Suspense>
  );
};

export default DestinationsViewPage;
