// app/destinations/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback } from "react";
import DestinationFilter from "@/components/destinations-components/DestinationFilter";
import DestinationCard from "@/components/destinations-components/DestinationCard";
import DestinationListCard from "@/components/destinations-components/DestinationListCard";
import Pagination from "@/components/destinations-components/DestinationPagination";
import { DestinationService } from "@/services/destinationService";
import { DestinationFilterParams, Destination } from "@/types/destination-types";
import { Loader2, Grid, List, LayoutDashboard, GalleryVertical } from "lucide-react";

const DestinationsViewPage = () => {
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

  const [filters, setFilters] = useState<DestinationFilterParams>({
    name: null,
    minPrice: null,
    maxPrice: null,
    duration: null,
    destinationCategory: null,
    season: null,
    status: null,
    pageSize: 6,
    pageNumber: 1,
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  
  // New state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchDestinations = useCallback(async (currentFilters: DestinationFilterParams) => {
    setLoading(true);
    try {
      const response = await DestinationService.getDestinations(currentFilters);
      const data = response.data;
      
      setDestinations(data.destinationResponseDtos);
      setTotalItems(data.destinationCount);

      // Extract unique categories and seasons
      const categories = DestinationService.extractCategories(data.destinationResponseDtos);
      const seasons = DestinationService.extractSeasons(data.destinationResponseDtos);
      
      setAvailableCategories(categories);
      setAvailableSeasons(seasons);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDestinations(filters);
  }, []);

  // Track previous filters for comparison
  const [prevFilters, setPrevFilters] = useState(filters);

  // Auto-refetch when pageSize or pageNumber changes
  useEffect(() => {
    if (filters.pageSize !== prevFilters.pageSize || filters.pageNumber !== prevFilters.pageNumber) {
      fetchDestinations(filters);
      setPrevFilters(filters);
    }
  }, [filters.pageSize, filters.pageNumber, fetchDestinations]);

  const handleFilterChange = (newFilters: DestinationFilterParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Reset to first page when searching and fetch data
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    fetchDestinations(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className=" mx-auto px-2 sm:px-4 lg:px-6 py-6">
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
            availableCategories={availableCategories}
            availableSeasons={availableSeasons}
          />
        </div>

        {/* Results Header with View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Destination Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing <span className="font-semibold text-blue-600">{((filters.pageNumber - 1) * filters.pageSize) + 1}</span> to{' '}
                <span className="font-semibold text-blue-600">{Math.min(filters.pageNumber * filters.pageSize, totalItems)}</span> of{' '}
                <span className="font-semibold text-blue-600">{totalItems}</span> destinations
              </p>
            </div>
            
            {/* View Mode Toggle with Enhanced Design */}
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
                  onClick={handleSearch}
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

export default DestinationsViewPage;