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
import { Loader2, Grid, List, LayoutDashboard, X, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";

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

// Component to display active filters
// Update the ActiveFilters component to properly type the filter keys

// Component to display active filters
const ActiveFilters = ({ 
  filters, 
  onRemoveFilter, 
  onClearAll,
  availableCategories,
  availableSeasons 
}: { 
  filters: DestinationFilterParams;
  onRemoveFilter: (key: keyof DestinationFilterParams) => void;
  onClearAll: () => void;
  availableCategories: string[];
  availableSeasons: string[];
}) => {
  // Define the type for active filter items
  interface ActiveFilterItem {
    key: keyof DestinationFilterParams;
    label: string;
    value: string;
  }

  const activeFilters: ActiveFilterItem[] = [];
  
  // Check each filter and add to array if active
  if (filters.name) {
    activeFilters.push({ key: 'name', label: 'Name', value: filters.name });
  }
  
  if (filters.destinationCategory) {
    activeFilters.push({ key: 'destinationCategory', label: 'Category', value: filters.destinationCategory });
  }
  
  if (filters.season) {
    activeFilters.push({ key: 'season', label: 'Season', value: filters.season });
  }
  
  if (filters.status) {
    activeFilters.push({ key: 'status', label: 'Status', value: filters.status });
  }
  
  if (filters.duration) {
    activeFilters.push({ key: 'duration', label: 'Duration', value: `${filters.duration} hours` });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Active Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm"
            >
              <span className="font-medium text-blue-700">{filter.label}:</span>
              <span className="text-gray-700">{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>
    </div>
  );
};

// Main component wrapped with Suspense for useSearchParams
const DestinationsViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();

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

  // Initialize filters from URL params - handle null case
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

  // Handle removing a single filter
  const handleRemoveFilter = (key: keyof DestinationFilterParams) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  if (categoriesLoading) {
    return (
      <div className="bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
          <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <span className="mt-4 text-lg font-medium text-gray-700">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
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

        {/* Results Header with View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Destination Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing <span className="font-semibold text-blue-600">
                  {destinations.length > 0 ? ((filters.pageNumber - 1) * filters.pageSize) + 1 : 0}
                </span> to{' '}
                <span className="font-semibold text-blue-600">
                  {Math.min(filters.pageNumber * filters.pageSize, totalItems)}
                </span> of{' '}
                <span className="font-semibold text-blue-600">{totalItems}</span> destinations
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600 font-medium">
                View as:
              </div>
              <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-1">
                <button
                  onClick={() => toggleViewMode('grid')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Grid</span>
                </button>
                <button
                  onClick={() => toggleViewMode('list')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full"></div>
              </div>
            </div>
            <span className="mt-4 text-lg font-medium text-gray-700">Loading destinations...</span>
            <p className="mt-2 text-gray-500">Fetching the latest travel experiences</p>
          </div>
        )}

        {/* Destinations Grid/List */}
        {!loading && (
          <>
            {destinations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <LayoutDashboard className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">No destinations found</div>
                <p className="text-gray-500 mb-6">Try adjusting your search filters or explore different categories</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
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
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <span className="mt-4 text-lg font-medium text-gray-700">Loading...</span>
      </div>
    }>
      <DestinationsViewContent />
    </Suspense>
  );
};

export default DestinationsViewPage;