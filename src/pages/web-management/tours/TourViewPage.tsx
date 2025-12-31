// app/tours/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback } from "react";
import TourFilter from "@/components/tours-components/TourFilter";
import TourCard from "@/components/tours-components/TourCard";
import TourListCard from "@/components/tours-components/TourListCard";
import TourPagination from "@/components/tours-components/TourPagination";
import { TourService } from "@/services/tourService";
import { TourFilterParams, Tour } from "@/types/tour-types";
import { Loader2, Grid, List, Globe, MapPin, Calendar, Users, Clock, TrendingUp } from "lucide-react";

const TourViewPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Tours",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`,
    },
  ];

  const [filters, setFilters] = useState<TourFilterParams>({
    name: null,
    minPrice: null,
    maxPrice: null,
    duration: null,
    tourType: null,
    tourCategory: null,
    season: null,
    location: null,
    pageSize: 6,
    pageNumber: 1,
  });

  const [tours, setTours] = useState<Tour[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableTourTypes, setAvailableTourTypes] = useState<string[]>([]);
  const [availableTourCategories, setAvailableTourCategories] = useState<string[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  
  // New state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchTours = useCallback(async (currentFilters: TourFilterParams) => {
    setLoading(true);
    try {
      const response = await TourService.getTours(currentFilters);
      const data = response.data;
      
      setTours(data.tourResponseDtoList);
      setTotalItems(data.totalTours);

      // Extract unique values for filters
      const tourTypes = TourService.extractTourTypes(data.tourResponseDtoList);
      const tourCategories = TourService.extractTourCategories(data.tourResponseDtoList);
      const seasons = TourService.extractSeasons(data.tourResponseDtoList);
      const locations = TourService.extractLocations(data.tourResponseDtoList);
      
      setAvailableTourTypes(tourTypes);
      setAvailableTourCategories(tourCategories);
      setAvailableSeasons(seasons);
      setAvailableLocations(locations);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTours(filters);
  }, []);

  // Track previous filters for comparison
  const [prevFilters, setPrevFilters] = useState(filters);

  // Auto-refetch when pageSize or pageNumber changes
  useEffect(() => {
    if (filters.pageSize !== prevFilters.pageSize || filters.pageNumber !== prevFilters.pageNumber) {
      fetchTours(filters);
      setPrevFilters(filters);
    }
  }, [filters.pageSize, filters.pageNumber, fetchTours]);

  const handleFilterChange = (newFilters: TourFilterParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Reset to first page when searching and fetch data
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    fetchTours(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Calculate statistics
  const calculateStats = () => {
    const activeTours = tours.filter(t => t.statusName === 'ACTIVE').length;
    const upcomingSchedules = tours.reduce((sum, tour) => sum + TourService.getScheduleCountForNextMonths(tour, 3), 0);
    const avgDuration = tours.length > 0 
      ? Math.round(tours.reduce((sum, t) => sum + t.duration, 0) / tours.length)
      : 0;
    const totalImages = tours.reduce((sum, tour) => sum + tour.images.length, 0);
    
    return { activeTours, upcomingSchedules, avgDuration, totalImages };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <PageHeader
            title="Tours View"
            description="Explore and manage comprehensive travel tours and packages"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeTours}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingSchedules}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Duration</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgDuration} days</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <TourFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            availableTourTypes={availableTourTypes}
            availableTourCategories={availableTourCategories}
            availableSeasons={availableSeasons}
            availableLocations={availableLocations}
          />
        </div>

        {/* Results Header with View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tour Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing <span className="font-semibold text-blue-600">{((filters.pageNumber - 1) * filters.pageSize) + 1}</span> to{' '}
                <span className="font-semibold text-blue-600">{Math.min(filters.pageNumber * filters.pageSize, totalItems)}</span> of{' '}
                <span className="font-semibold text-blue-600">{totalItems}</span> tours
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
            <span className="mt-4 text-lg font-medium text-gray-700">Loading tours...</span>
            <p className="mt-2 text-gray-500">Fetching amazing travel packages</p>
          </div>
        )}

        {/* Tours Grid/List */}
        {!loading && (
          <>
            {tours.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Globe className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">No tours found</div>
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
                    {tours.map((tour) => (
                      <TourCard
                        key={tour.tourId}
                        tour={tour}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6 mb-8">
                    {tours.map((tour) => (
                      <TourListCard
                        key={tour.tourId}
                        tour={tour}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10">
                  <TourPagination
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

export default TourViewPage;