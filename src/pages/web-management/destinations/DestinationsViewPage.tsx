// app/destinations/view/page.tsx - Alternative simpler version
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback } from "react";
import DestinationFilter from "@/components/destinations-components/DestinationFilter";
import DestinationCard from "@/components/destinations-components/DestinationCard";
import Pagination from "@/components/destinations-components/DestinationPagination";
import { DestinationService } from "@/services/destinationService";
import { DestinationFilterParams, Destination } from "@/types/destination-types";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Destinations View"
          description="Manage travel destination locations"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Filter Section */}
        <DestinationFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          availableCategories={availableCategories}
          availableSeasons={availableSeasons}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading destinations...</span>
          </div>
        )}

        {/* Destinations Grid */}
        {!loading && (
          <>
            {destinations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-500 text-lg">No destinations found</div>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {destinations.map((destination) => (
                    <DestinationCard
                      key={destination.destinationId}
                      destination={destination}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={filters.pageNumber}
                  totalItems={totalItems}
                  pageSize={filters.pageSize}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DestinationsViewPage;