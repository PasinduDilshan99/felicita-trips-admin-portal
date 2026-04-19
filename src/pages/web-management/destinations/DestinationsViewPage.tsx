// app/destinations/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import DestinationFilter from "@/components/destinations-components/DestinationFilter";
import DestinationCard from "@/components/destinations-components/DestinationCard";
import DestinationListCard from "@/components/destinations-components/DestinationListCard";
import Pagination from "@/components/destinations-components/DestinationPagination";
import { DestinationService } from "@/services/destinationService";
import { DestinationFilterParams, Destination } from "@/types/destination-types";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LoadingState } from "@/components/destinations-components/view-destinations-components/LoadingState";
import { ActiveFilters } from "@/components/destinations-components/view-destinations-components/ActiveFilters";
import { ResultsHeader } from "@/components/destinations-components/view-destinations-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";


// Utility functions for URL params management
const filtersToUrlParams = (filters: DestinationFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.destinationCategory) params.set("destinationCategory", filters.destinationCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1) params.set("pageNumber", filters.pageNumber.toString());
  
  return params;
};

const urlParamsToFilters = (params: URLSearchParams): DestinationFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration") ? parseFloat(params.get("duration")!) : null,
    destinationCategory: params.get("destinationCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as 'ACTIVE' | 'INACTIVE' | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber") ? parseInt(params.get("pageNumber")!) : 1,
  };
};

// Main component wrapped with Suspense for useSearchParams
const DestinationsViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
    },
  ];

  const [filters, setFilters] = useState<DestinationFilterParams>(() => 
    urlParamsToFilters(searchParams || new URLSearchParams())
  );
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get destination categories from CommonContext
  const getDestinationCategories = useCallback((): string[] => {
    if (categories && categories.destinationCategoryList) {
      return categories.destinationCategoryList.map(
        (cat) => cat.destinationCategoryName
      );
    }
    return [];
  }, [categories]);

  // Update URL with current filters
  const updateURL = useCallback((newFilters: DestinationFilterParams) => {
    const params = filtersToUrlParams(newFilters);
    const queryString = params.toString();
    const newURL = queryString 
      ? `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view?${queryString}`
      : `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`;
    
    router.replace(newURL, { scroll: false });
  }, [router]);

  const fetchDestinations = useCallback(async (currentFilters: DestinationFilterParams) => {
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

      const seasons = DestinationService.extractSeasons(data.destinationResponseDtos);
      setAvailableSeasons(seasons);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Initial load from URL params
  useEffect(() => {
    const initialFilters = urlParamsToFilters(searchParams || new URLSearchParams());
    setFilters(initialFilters);
    fetchDestinations(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(searchParams || new URLSearchParams());
      setFilters(urlFilters);
      fetchDestinations(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchDestinations]);

  const handleFilterChange = (newFilters: DestinationFilterParams) => {
    setFilters(newFilters);
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
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchDestinations(resetFilters);
  };

  const handleRemoveFilter = (key: keyof DestinationFilterParams) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const currentStart = destinations.length > 0 ? ((filters.pageNumber - 1) * filters.pageSize) + 1 : 0;
  const currentEnd = Math.min(filters.pageNumber * filters.pageSize, totalItems);

  if (categoriesLoading) {
    return (
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
          <LoadingState message="Loading categories..." subMessage="Please wait while we fetch available categories" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <PageHeader
            title="Destinations View"
            description="Explore and manage travel destinations with rich visual experience"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <DestinationFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            onPageSizeChange={handlePageSizeChange}
            availableCategories={getDestinationCategories()}
            availableSeasons={availableSeasons}
          />
        </div>

        {/* Active Filters Display */}
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleReset}
          availableCategories={getDestinationCategories()}
          availableSeasons={availableSeasons}
        />

        {/* Results Header */}
        <ResultsHeader
          currentStart={currentStart}
          currentEnd={currentEnd}
          totalItems={totalItems}
          viewMode={viewMode}
          onViewModeChange={toggleViewMode}
        />

        {/* Loading State */}
        {loading && <LoadingState message="Loading destinations..." subMessage="Fetching the latest travel experiences" />}

        {/* Destinations Grid/List */}
        {!loading && (
          <>
            {destinations.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {destinations.map((destination) => (
                      <DestinationCard
                        key={destination.destinationId}
                        destination={destination}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6 mb-8">
                    {destinations.map((destination) => (
                      <DestinationListCard
                        key={destination.destinationId}
                        destination={destination}
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
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const DestinationsViewPage = () => {
  const { theme } = useTheme();
  
  return (
    <Suspense fallback={
      <div 
        className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
        style={{ 
          backgroundColor: theme.surface,
          borderColor: theme.border 
        }}
      >
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: theme.primary }} />
        <span className="mt-4 text-lg font-medium" style={{ color: theme.text }}>Loading...</span>
      </div>
    }>
      <DestinationsViewContent />
    </Suspense>
  );
};

export default DestinationsViewPage;