// app/activity-schedules/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { ActivityScheduleService } from "@/services/activityScheduleService";
import {
  ActivityScheduleFilterParams,
  ActivityScheduleListItem,
  ActivityScheduleParamsData,
  ActivityScheduleImage,
} from "@/types/activity-schedule-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { WEB_MANAGEMENT_URL } from "@/utils/urls";
import ActivityScheduleCard from "@/components/activity-schedules-components/view-activity-schedule-components/ActivityScheduleCard";
import ActivityScheduleListCard from "@/components/activity-schedules-components/view-activity-schedule-components/ActivityScheduleListCard";

// Sort options for activity schedules (from API params)
const SORT_OPTIONS = [
  { value: "activityName", label: "Activity Name" },
  { value: "activityScheduleName", label: "Schedule Name" },
  { value: "durationHours", label: "Duration" },
  { value: "priceLocal", label: "Local Price" },
  { value: "priceForeigners", label: "Foreigner Price" },
  { value: "scheduleAssumeStartDate", label: "Start Date" },
  { value: "scheduleAssumeEndDate", label: "End Date" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: ActivityScheduleFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.activityId)
    params.set("activityId", filters.activityId.toString());
  if (filters.destinationId)
    params.set("destinationId", filters.destinationId.toString());
  if (filters.packageScheduleId)
    params.set("packageScheduleId", filters.packageScheduleId.toString());
  if (filters.tourScheduleId)
    params.set("tourScheduleId", filters.tourScheduleId.toString());
  if (filters.activityCategory)
    params.set("activityCategory", filters.activityCategory);
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.season) params.set("season", filters.season);
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
): ActivityScheduleFilterParams => {
  return {
    name: params.get("name") || null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    activityId: params.get("activityId")
      ? parseInt(params.get("activityId")!)
      : null,
    destinationId: params.get("destinationId")
      ? parseInt(params.get("destinationId")!)
      : null,
    packageScheduleId: params.get("packageScheduleId")
      ? parseInt(params.get("packageScheduleId")!)
      : null,
    tourScheduleId: params.get("tourScheduleId")
      ? parseInt(params.get("tourScheduleId")!)
      : null,
    activityCategory: params.get("activityCategory") || null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    season: params.get("season") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || null,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

// Main component wrapped with Suspense for useSearchParams
const ActivitySchedulesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  // State for filter request params
  const [requestParams, setRequestParams] =
    useState<ActivityScheduleParamsData | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Activity Schedules", href: WEB_MANAGEMENT_URL },
    { label: "View", href: WEB_MANAGEMENT_URL },
  ];

  const [filters, setFilters] = useState<ActivityScheduleFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [schedules, setSchedules] = useState<ActivityScheduleListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<ImageModalImage[]>([]);

  // Fetch request parameters for filters
  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response =
          await ActivityScheduleService.getActivityScheduleParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
        }
      } catch (error) {
        console.error("Error fetching activity schedule params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get activity categories from CommonContext
  const getActivityCategories = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (categories && categories.activityCategoryList) {
      return categories.activityCategoryList.map((cat) => ({
        value: cat.activityCategoryName,
        label: cat.activityCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // Get activity options from request params
  const getActivityOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.activityIdAndNameResponses) {
      return requestParams.activityIdAndNameResponses.map((activity) => ({
        value: activity.activityId.toString(),
        label: activity.activityName,
      }));
    }
    return [];
  }, [requestParams]);

  // Get destination options from request params
  const getDestinationOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.destinationIdAndNameResponses) {
      return requestParams.destinationIdAndNameResponses.map((dest) => ({
        value: dest.destinationId.toString(),
        label: dest.destinationName,
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

  // Get package schedule options from request params
  const getPackageScheduleOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (requestParams?.packageScheduleIdAndNameResponses) {
      return requestParams.packageScheduleIdAndNameResponses.map(
        (schedule) => ({
          value: schedule.packageScheduleId.toString(),
          label: schedule.packageScheduleName,
        }),
      );
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
        value: season.seasonName,
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
        label: `${duration} hours`,
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
    return SORT_OPTIONS;
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
      key: "activityId",
      label: "Activity",
      type: "select",
      options: getActivityOptions(),
      width: "third",
    },
    {
      key: "destinationId",
      label: "Destination",
      type: "select",
      options: getDestinationOptions(),
      width: "third",
    },
    {
      key: "activityCategory",
      label: "Activity Category",
      type: "select",
      options: getActivityCategories(),
      width: "third",
    },
    {
      key: "duration",
      label: "Duration (hours)",
      type: "select",
      options: getDurationOptions(),
      width: "third",
    },
    {
      key: "season",
      label: "Season",
      type: "select",
      options: getSeasonOptions(),
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
      key: "packageScheduleId",
      label: "Package Schedule",
      type: "select",
      options: getPackageScheduleOptions(),
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
    (newFilters: ActivityScheduleFilterParams) => {
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
    async (currentFilters: ActivityScheduleFilterParams) => {
      setLoading(true);
      try {
        const response =
          await ActivityScheduleService.getActivitySchedules(currentFilters);

        if (response.code === 200 && response.data) {
          setSchedules(response.data.activityScheduleResponseDtos || []);
          setTotalItems(response.data.activityCount || 0);
        } else {
          setSchedules([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching activity schedules:", error);
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
    const resetFilters: ActivityScheduleFilterParams = {
      name: null,
      duration: null,
      activityId: null,
      destinationId: null,
      packageScheduleId: null,
      tourScheduleId: null,
      activityCategory: null,
      fromDate: null,
      toDate: null,
      season: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: null,
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
    const updatedFilters: ActivityScheduleFilterParams = {
      ...filters,
      sortBy: null,
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
      sortBy: newSortBy || null,
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

  // Handle image click for modal
  const handleImageClick = (
    schedule: ActivityScheduleListItem,
    imageIndex: number,
  ) => {
    const images: ImageModalImage[] = (schedule.images || []).map(
      (img: ActivityScheduleImage) => ({
        url: img.image_url,
        name: img.name,
        description: img.description || "",
        id: img.id,
      }),
    );
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
    if (filters.activityId && requestParams?.activityIdAndNameResponses) {
      const activity = requestParams.activityIdAndNameResponses.find(
        (a) => a.activityId === filters.activityId,
      );
      activeFilters.push({
        key: "activityId",
        label: "Activity",
        value: activity?.activityName || filters.activityId.toString(),
      });
    }
    if (filters.destinationId && requestParams?.destinationIdAndNameResponses) {
      const destination = requestParams.destinationIdAndNameResponses.find(
        (d) => d.destinationId === filters.destinationId,
      );
      activeFilters.push({
        key: "destinationId",
        label: "Destination",
        value: destination?.destinationName || filters.destinationId.toString(),
      });
    }
    if (filters.activityCategory) {
      activeFilters.push({
        key: "activityCategory",
        label: "Category",
        value: filters.activityCategory,
      });
    }
    if (filters.duration) {
      activeFilters.push({
        key: "duration",
        label: "Duration",
        value: `${filters.duration} hours`,
      });
    }
    if (filters.season) {
      activeFilters.push({
        key: "season",
        label: "Season",
        value: filters.season,
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
    if (
      filters.packageScheduleId &&
      requestParams?.packageScheduleIdAndNameResponses
    ) {
      const schedule = requestParams.packageScheduleIdAndNameResponses.find(
        (s) => s.packageScheduleId === filters.packageScheduleId,
      );
      activeFilters.push({
        key: "packageScheduleId",
        label: "Package Schedule",
        value:
          schedule?.packageScheduleName || filters.packageScheduleId.toString(),
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
    activityId: filters.activityId,
    destinationId: filters.destinationId,
    activityCategory: filters.activityCategory,
    duration: filters.duration,
    season: filters.season,
    tourScheduleId: filters.tourScheduleId,
    packageScheduleId: filters.packageScheduleId,
    status: filters.status,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  };

  if (categoriesLoading || requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading schedule data..."
        subMessage="Please wait while we fetch available schedules and filters"
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
            title="Activity Schedules View"
            description="Manage and monitor activity schedules, availability, and pricing"
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
            title="Filter Activity Schedules"
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
            title="Activity Schedules"
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
            subMessage="Fetching activity schedules and availability"
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
                      <ActivityScheduleCard
                        key={`${schedule.activityId}-${schedule.scheduleId}`}
                        schedule={schedule}
                        onImageClick={(imageIndex) =>
                          handleImageClick(schedule, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {schedules.map((schedule) => (
                      <ActivityScheduleListCard
                        key={`${schedule.activityId}-${schedule.scheduleId}`}
                        schedule={schedule}
                        onImageClick={(imageIndex) =>
                          handleImageClick(schedule, imageIndex)
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
const ViewActivitySchedulePage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <ActivitySchedulesViewContent />
    </Suspense>
  );
};

export default ViewActivitySchedulePage;
