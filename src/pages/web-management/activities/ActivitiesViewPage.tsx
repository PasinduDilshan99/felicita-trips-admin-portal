// app/activities/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback } from "react";
import ActivityFilter from "@/components/activities-components/ActivityFilter";
import ActivityCard from "@/components/activities-components/ActivityCard";
import ActivityListCard from "@/components/activities-components/ActivityListCard";
import ActivityPagination from "@/components/activities-components/ActivityPagination";
import { ActivityService } from "@/services/activityService";
import { ActivityFilterParams, Activity } from "@/types/activity-types";
import { Loader2, Grid, List, LayoutDashboard, Users, Clock, DollarSign } from "lucide-react";

const ActivitiesViewPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Activities",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`,
    },
  ];

  const [filters, setFilters] = useState<ActivityFilterParams>({
    name: null,
    minPrice: null,
    maxPrice: null,
    duration: null,
    activityCategory: null,
    season: null,
    status: null,
    pageSize: 6,
    pageNumber: 1,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  
  // New state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchActivities = useCallback(async (currentFilters: ActivityFilterParams) => {
    setLoading(true);
    try {
      const response = await ActivityService.getActivities(currentFilters);
      const data = response.data;
      
      setActivities(data.activityResponseDtos);
      setTotalItems(data.activityCount);

      // Extract unique categories and seasons
      const categories = ActivityService.extractCategories(data.activityResponseDtos);
      const seasons = ActivityService.extractSeasons(data.activityResponseDtos);
      
      setAvailableCategories(categories);
      setAvailableSeasons(seasons);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchActivities(filters);
  }, []);

  // Track previous filters for comparison
  const [prevFilters, setPrevFilters] = useState(filters);

  // Auto-refetch when pageSize or pageNumber changes
  useEffect(() => {
    if (filters.pageSize !== prevFilters.pageSize || filters.pageNumber !== prevFilters.pageNumber) {
      fetchActivities(filters);
      setPrevFilters(filters);
    }
  }, [filters.pageSize, filters.pageNumber, fetchActivities]);

  const handleFilterChange = (newFilters: ActivityFilterParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Reset to first page when searching and fetch data
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    fetchActivities(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Calculate statistics
  const calculateStats = () => {
    const activeActivities = activities.filter(a => a.status === 'ACTIVE').length;
    const inactiveActivities = activities.filter(a => a.status === 'INACTIVE').length;
    const avgPrice = activities.length > 0 
      ? Math.round(activities.reduce((sum, a) => sum + a.price_local, 0) / activities.length)
      : 0;
    const totalSchedules = activities.reduce((sum, a) => sum + a.schedules.length, 0);
    
    return { activeActivities, inactiveActivities, avgPrice, totalSchedules };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <PageHeader
            title="Activities View"
            description="Explore and manage travel activities and experiences"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeActivities}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Price</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">LKR {stats.avgPrice.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSchedules}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <ActivityFilter
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
                Activity Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing <span className="font-semibold text-blue-600">{((filters.pageNumber - 1) * filters.pageSize) + 1}</span> to{' '}
                <span className="font-semibold text-blue-600">{Math.min(filters.pageNumber * filters.pageSize, totalItems)}</span> of{' '}
                <span className="font-semibold text-blue-600">{totalItems}</span> activities
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
            <span className="mt-4 text-lg font-medium text-gray-700">Loading activities...</span>
            <p className="mt-2 text-gray-500">Fetching exciting travel experiences</p>
          </div>
        )}

        {/* Activities Grid/List */}
        {!loading && (
          <>
            {activities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <LayoutDashboard className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">No activities found</div>
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
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6 mb-8">
                    {activities.map((activity) => (
                      <ActivityListCard
                        key={activity.id}
                        activity={activity}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10">
                  <ActivityPagination
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

export default ActivitiesViewPage;