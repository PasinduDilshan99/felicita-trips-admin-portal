// app/tour-schedules/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { TourScheduleService } from "@/services/tourScheduleService";
import {
  TourScheduleFilterParams,
  TourScheduleListItem,
  TourScheduleParamsData,
} from "@/types/tour-schedule-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { WEB_MANAGEMENT_URL } from "@/utils/urls";
import TourScheduleCard from "@/components/tour-schedules-components/view-tour-schedule-components/TourScheduleCard";
import TourScheduleListCard from "@/components/tour-schedules-components/view-tour-schedule-components/TourScheduleListCard";

// Sort options for tour schedules (from API params)
const DEFAULT_SORT_OPTIONS = [
  { value: "tourScheduleName", label: "Schedule Name" },
  { value: "tourName", label: "Tour Name" },
  { value: "assumeStartDate", label: "Start Date" },
  { value: "assumeEndDate", label: "End Date" },
  { value: "durationStart", label: "Duration Start" },
  { value: "durationEnd", label: "Duration End" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: TourScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.tourTypeId)
    params.set("tourTypeId", filters.tourTypeId.toString());
  if (filters.tourCategoryId)
    params.set("tourCategoryId", filters.tourCategoryId.toString());
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.seasonId) params.set("seasonId", filters.seasonId.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

const urlParamsToFilters = (
  params: URLSearchParams,
): TourScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    tourTypeId: params.get("tourTypeId")
      ? parseInt(params.get("tourTypeId")!)
      : null,
    tourCategoryId: params.get("tourCategoryId")
      ? parseInt(params.get("tourCategoryId")!)
      : null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    seasonId: params.get("seasonId") ? parseInt(params.get("seasonId")!) : null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "",
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

// Main component wrapped with Suspense for useSearchParams
const TourSchedulesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  // State for filter request params
  const [requestParams, setRequestParams] =
    useState<TourScheduleParamsData | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Tour Schedules", href: WEB_MANAGEMENT_URL },
    { label: "View", href: WEB_MANAGEMENT_URL },
  ];

  const [filters, setFilters] = useState<TourScheduleFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [schedules, setSchedules] = useState<TourScheduleListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch request parameters for filters
  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response = await TourScheduleService.getTourScheduleParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching tour schedule params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get tour categories from CommonContext
  const getTourCategories = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (categories && categories.tourCategoryList) {
      return categories.tourCategoryList.map((cat) => ({
        value: cat.tourCategoryId.toString(),
        label: cat.tourCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // Get tour types from CommonContext
  const getTourTypes = useCallback((): { value: string; label: string }[] => {
    if (categories && categories.tourTypeList) {
      return categories.tourTypeList.map((type) => ({
        value: type.tourTypeId.toString(),
        label: type.tourTypeName,
      }));
    }
    return [];
  }, [categories]);

  // Get tour options from request params
  const getTourOptions = useCallback((): { value: string; label: string }[] => {
    if (requestParams?.tourIdAndNameResponses) {
      return requestParams.tourIdAndNameResponses.map((tour) => ({
        value: tour.tourId.toString(),
        label: tour.tourName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get season options from request params
  const getSeasonOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.seasonIdAndNameResponses) {
      return requestParams.seasonIdAndNameResponses.map((season) => ({
        value: season.seasonId.toString(),
        label: season.seasonName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get duration options from request params
  const getDurationOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.durations) {
      return requestParams.durations.map((duration) => ({
        value: duration,
        label: `${duration} days`,
      }));
    }
    return [];
  }, [requestParams]);

  // Get status options
  const getStatusOptions = () => [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // Get dynamic sort options from request params
  const getSortOptions = useCallback((): { value: string; label: string }[] => {
    if (
      requestParams?.sortByResponses &&
      requestParams.sortByResponses.length > 0
    ) {
      return requestParams.sortByResponses.map((sort) => ({
        value: sort.sortBy,
        label: sort.sortByDisplayName,
      }));
    }
    return DEFAULT_SORT_OPTIONS;
  }, [requestParams]);

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const options = getSortOptions();
    const option = options.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Schedule Name",
      type: "search",
      placeholder: "Search by schedule name...",
      width: "full",
    },
    {
      key: "tourId",
      label: "Tour",
      type: "select",
      options: getTourOptions(),
      width: "third",
    },
    {
      key: "tourCategoryId",
      label: "Tour Category",
      type: "select",
      options: getTourCategories(),
      width: "third",
    },
    {
      key: "tourTypeId",
      label: "Tour Type",
      type: "select",
      options: getTourTypes(),
      width: "third",
    },
    {
      key: "duration",
      label: "Duration (days)",
      type: "select",
      options: getDurationOptions(),
      width: "third",
    },
    {
      key: "seasonId",
      label: "Season",
      type: "select",
      options: getSeasonOptions(),
      width: "third",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusOptions(),
      width: "third",
    },
    {
      key: "fromDate",
      label: "From Date",
      type: "date",
      placeholder: "Start date",
      width: "half",
    },
    {
      key: "toDate",
      label: "To Date",
      type: "date",
      placeholder: "End date",
      width: "half",
    },
  ];

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: TourScheduleFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_URL}/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_URL}/view`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchSchedules = useCallback(
    async (currentFilters: TourScheduleFilterParams) => {
      setLoading(true);
      try {
        const response =
          await TourScheduleService.getTourSchedules(currentFilters);

        if (response.code === 200 && response.data) {
          setSchedules(response.data.tourScheduleResponses || []);
          setTotalItems(response.data.tourScheduleCount || 0);
        } else {
          setSchedules([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching tour schedules:", error);
        setSchedules([]);
        setTotalItems(0);
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
    fetchSchedules(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchSchedules(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchSchedules]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: TourScheduleFilterParams = {
      name: null,
      duration: null,
      tourId: null,
      tourTypeId: null,
      tourCategoryId: null,
      fromDate: null,
      toDate: null,
      seasonId: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchSchedules(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: TourScheduleFilterParams = {
      ...filters,
      sortBy: "",
      sortDirection: "ASC",
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: newSortBy || "",
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchSchedules(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.tourId && requestParams?.tourIdAndNameResponses) {
      const tour = requestParams.tourIdAndNameResponses.find(
        (t) => t.tourId === filters.tourId,
      );
      activeFilters.push({
        key: "tourId",
        label: "Tour",
        value: tour?.tourName || filters.tourId.toString(),
      });
    }
    if (filters.tourCategoryId && categories?.tourCategoryList) {
      const category = categories.tourCategoryList.find(
        (c) => c.tourCategoryId === filters.tourCategoryId,
      );
      activeFilters.push({
        key: "tourCategoryId",
        label: "Tour Category",
        value: category?.tourCategoryName || filters.tourCategoryId.toString(),
      });
    }
    if (filters.tourTypeId && categories?.tourTypeList) {
      const type = categories.tourTypeList.find(
        (t) => t.tourTypeId === filters.tourTypeId,
      );
      activeFilters.push({
        key: "tourTypeId",
        label: "Tour Type",
        value: type?.tourTypeName || filters.tourTypeId.toString(),
      });
    }
    if (filters.duration) {
      activeFilters.push({
        key: "duration",
        label: "Duration",
        value: `${filters.duration} days`,
      });
    }
    if (filters.seasonId && requestParams?.seasonIdAndNameResponses) {
      const season = requestParams.seasonIdAndNameResponses.find(
        (s) => s.seasonId === filters.seasonId,
      );
      activeFilters.push({
        key: "seasonId",
        label: "Season",
        value: season?.seasonName || filters.seasonId.toString(),
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
      });
    }
    if (filters.fromDate) {
      activeFilters.push({
        key: "fromDate",
        label: "From Date",
        value: filters.fromDate,
      });
    }
    if (filters.toDate) {
      activeFilters.push({
        key: "toDate",
        label: "To Date",
        value: filters.toDate,
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
    schedules.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    tourId: filters.tourId,
    tourCategoryId: filters.tourCategoryId,
    tourTypeId: filters.tourTypeId,
    duration: filters.duration,
    seasonId: filters.seasonId,
    status: filters.status,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  };

  if (categoriesLoading || requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading schedule data..."
        subMessage="Please wait while we fetch available tour schedules and filters"
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
            title="Tour Schedules View"
            description="Manage and monitor tour schedules, availability, and itineraries"
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
            sortOptions={getSortOptions()}
            sortBy={filters.sortBy || ""}
            sortDirection={filters.sortDirection || "ASC"}
            title="Filter Tour Schedules"
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
            title="Tour Schedules"
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
            message="Loading schedules..."
            subMessage="Fetching tour schedules and availability"
            size="lg"
          />
        )}

        {/* Schedules Grid/List */}
        {!loading && (
          <>
            {schedules.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {schedules.map((schedule) => (
                      <TourScheduleCard
                        key={schedule.tourScheduleId}
                        schedule={schedule}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {schedules.map((schedule) => (
                      <TourScheduleListCard
                        key={schedule.tourScheduleId}
                        schedule={schedule}
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
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const ViewTourSchedulePage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <TourSchedulesViewContent />
    </Suspense>
  );
};

export default ViewTourSchedulePage;
