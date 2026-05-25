// app/package-schedules/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { PackageScheduleService } from "@/services/packageScheduleService";
import {
  PackageScheduleFilterParams,
  PackageScheduleListItem,
  PackageScheduleParamsData,
} from "@/types/package-schedule-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { WEB_MANAGEMENT_URL } from "@/utils/urls";
import PackageScheduleCard from "@/components/package-schedules-components/view-package-schedule-components/PackageScheduleCard";
import PackageScheduleListCard from "@/components/package-schedules-components/view-package-schedule-components/PackageScheduleListCard";

// Default sort options
const DEFAULT_SORT_OPTIONS = [
  { value: "packageScheduleName", label: "Schedule Name" },
  { value: "packageName", label: "Package Name" },
  { value: "startDate", label: "Start Date" },
  { value: "endDate", label: "End Date" },
  { value: "durationStart", label: "Duration Start" },
  { value: "durationEnd", label: "Duration End" },
  { value: "tourScheduleName", label: "Tour Schedule Name" },
];

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: PackageScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.packageId) params.set("packageId", filters.packageId.toString());
  if (filters.tourScheduleId)
    params.set("tourScheduleId", filters.tourScheduleId.toString());
  if (filters.tourId) params.set("tourId", filters.tourId.toString());
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
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
): PackageScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    packageId: params.get("packageId")
      ? parseInt(params.get("packageId")!)
      : null,
    tourScheduleId: params.get("tourScheduleId")
      ? parseInt(params.get("tourScheduleId")!)
      : null,
    tourId: params.get("tourId") ? parseInt(params.get("tourId")!) : null,
    startDate: params.get("startDate") || null,
    endDate: params.get("endDate") || null,
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
const PackageSchedulesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  // State for filter request params
  const [requestParams, setRequestParams] =
    useState<PackageScheduleParamsData | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Package Schedules", href: WEB_MANAGEMENT_URL },
    { label: "View", href: WEB_MANAGEMENT_URL },
  ];

  const [filters, setFilters] = useState<PackageScheduleFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [schedules, setSchedules] = useState<PackageScheduleListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch request parameters for filters
  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response =
          await PackageScheduleService.getPackageScheduleParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching package schedule params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get package options from request params
  const getPackageOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.packageIdAndNamesResponses) {
      return requestParams.packageIdAndNamesResponses.map((pkg) => ({
        value: pkg.packageId.toString(),
        label: pkg.packageName,
      }));
    }
    return [];
  }, [requestParams]);

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

  // Get tour schedule options from request params
  const getTourScheduleOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.tourScheduleIdAndNameResponses) {
      return requestParams.tourScheduleIdAndNameResponses.map((schedule) => ({
        value: schedule.tourScheduleId.toString(),
        label: schedule.tourScheduleName,
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
      key: "packageId",
      label: "Package",
      type: "select",
      options: getPackageOptions(),
      width: "third",
    },
    {
      key: "tourId",
      label: "Tour",
      type: "select",
      options: getTourOptions(),
      width: "third",
    },
    {
      key: "tourScheduleId",
      label: "Tour Schedule",
      type: "select",
      options: getTourScheduleOptions(),
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
      key: "startDate",
      label: "Start Date",
      type: "date",
      placeholder: "Start date",
      width: "half",
    },
    {
      key: "endDate",
      label: "End Date",
      type: "date",
      placeholder: "End date",
      width: "half",
    },
  ];

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: PackageScheduleFilterParams) => {
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
    async (currentFilters: PackageScheduleFilterParams) => {
      setLoading(true);
      try {
        const response =
          await PackageScheduleService.getPackageSchedules(currentFilters);

        if (response.code === 200 && response.data) {
          setSchedules(response.data.packageScheduleResponses || []);
          setTotalItems(response.data.packageScheduleCount || 0);
        } else {
          setSchedules([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching package schedules:", error);
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
    const resetFilters: PackageScheduleFilterParams = {
      name: null,
      packageId: null,
      tourScheduleId: null,
      tourId: null,
      startDate: null,
      endDate: null,
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
    const updatedFilters: PackageScheduleFilterParams = {
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
    if (filters.packageId && requestParams?.packageIdAndNamesResponses) {
      const pkg = requestParams.packageIdAndNamesResponses.find(
        (p) => p.packageId === filters.packageId,
      );
      activeFilters.push({
        key: "packageId",
        label: "Package",
        value: pkg?.packageName || filters.packageId.toString(),
      });
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
    if (
      filters.tourScheduleId &&
      requestParams?.tourScheduleIdAndNameResponses
    ) {
      const schedule = requestParams.tourScheduleIdAndNameResponses.find(
        (s) => s.tourScheduleId === filters.tourScheduleId,
      );
      activeFilters.push({
        key: "tourScheduleId",
        label: "Tour Schedule",
        value: schedule?.tourScheduleName || filters.tourScheduleId.toString(),
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
      });
    }
    if (filters.startDate) {
      activeFilters.push({
        key: "startDate",
        label: "Start Date",
        value: filters.startDate,
      });
    }
    if (filters.endDate) {
      activeFilters.push({
        key: "endDate",
        label: "End Date",
        value: filters.endDate,
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
    packageId: filters.packageId,
    tourId: filters.tourId,
    tourScheduleId: filters.tourScheduleId,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  if (requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading schedule data..."
        subMessage="Please wait while we fetch available package schedules and filters"
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
            title="Package Schedules View"
            description="Manage and monitor package schedules, availability, and itineraries"
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
            title="Filter Package Schedules"
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
            title="Package Schedules"
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
            subMessage="Fetching package schedules and availability"
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
                      <PackageScheduleCard
                        key={schedule.packageScheduleId}
                        schedule={schedule}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {schedules.map((schedule) => (
                      <PackageScheduleListCard
                        key={schedule.packageScheduleId}
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
const ViewPackageSchedulePage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <PackageSchedulesViewContent />
    </Suspense>
  );
};

export default ViewPackageSchedulePage;
