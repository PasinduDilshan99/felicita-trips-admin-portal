// app/activity-categories/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import {
  ActivityCategory,
  ActivityCategoryImage,
} from "@/types/activity-category-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { ACTIVITY_CATEGORIES_PAGE_URL, WEB_MANAGEMENT_URL } from "@/utils/urls";
import ActivityCategoryCard from "@/components/activity-categories-components/view-activity-category-components/ActivityCategoryCard";
import ActivityCategoryListCard from "@/components/activity-categories-components/view-activity-category-components/ActivityCategoryListCard";

// Sort options for activity categories
const SORT_OPTIONS = [
  { value: "categoryName", label: "Category Name" },
  { value: "createdAt", label: "Created Date" },
  { value: "categoryStatus", label: "Status" },
  { value: "numberOfActivities", label: "Number of Activities" },
  { value: "updatedAt", label: "Updated Date" },
];

// Filter params interface
interface ActivityCategoryFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: ActivityCategoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
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
): ActivityCategoryFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "categoryName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as "ASC" | "DESC",
  };
};

// Main component wrapped with Suspense for useSearchParams
const ActivityCategoriesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Activity Categories", href: ACTIVITY_CATEGORIES_PAGE_URL },
    { label: "View", href: ACTIVITY_CATEGORIES_PAGE_URL },
  ];

  const [filters, setFilters] = useState<ActivityCategoryFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [allCategories, setAllCategories] = useState<ActivityCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    ActivityCategory[]
  >([]);
  const [displayedCategories, setDisplayedCategories] = useState<
    ActivityCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter options state (derived from data)
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<ImageModalImage[]>([]);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ActivityCategoryService.getActivityCategories();

      if (response.code === 200 && response.data) {
        setAllCategories(response.data);

        // Extract unique statuses for filter options
        const statuses = [
          ...new Set(response.data.map((cat) => cat.categoryStatus)),
        ];
        setAvailableStatuses(statuses);

        return response.data;
      } else {
        setAllCategories([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching activity categories:", error);
      setAllCategories([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort categories based on filters
  const filterAndSortCategories = useCallback(
    (
      categories: ActivityCategory[],
      currentFilters: ActivityCategoryFilterParams,
    ) => {
      let result = [...categories];

      // Apply name filter
      if (currentFilters.name) {
        const searchTerm = currentFilters.name.toLowerCase();
        result = result.filter((cat) =>
          cat.categoryName.toLowerCase().includes(searchTerm),
        );
      }

      // Apply status filter
      if (currentFilters.status) {
        result = result.filter(
          (cat) => cat.categoryStatus === currentFilters.status,
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (currentFilters.sortBy) {
          case "categoryName":
            aVal = a.categoryName;
            bVal = b.categoryName;
            break;
          case "createdAt":
            aVal = new Date(a.createdAt).getTime();
            bVal = new Date(b.createdAt).getTime();
            break;
          case "updatedAt":
            aVal = new Date(a.updatedAt).getTime();
            bVal = new Date(b.updatedAt).getTime();
            break;
          case "categoryStatus":
            aVal = a.categoryStatus;
            bVal = b.categoryStatus;
            break;
          case "numberOfActivities":
            aVal = a.numberOfActivities;
            bVal = b.numberOfActivities;
            break;
          default:
            aVal = a.categoryName;
            bVal = b.categoryName;
        }

        if (currentFilters.sortDirection === "ASC") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      return result;
    },
    [],
  );

  // Update filtered and displayed categories when data or filters change
  useEffect(() => {
    if (allCategories.length > 0) {
      const filtered = filterAndSortCategories(allCategories, filters);
      setFilteredCategories(filtered);
      setTotalItems(filtered.length);

      // Apply pagination
      const start = (filters.pageNumber - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      setDisplayedCategories(filtered.slice(start, end));
    }
  }, [allCategories, filters, filterAndSortCategories]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      setIsInitialLoad(false);
    };

    loadData();
  }, [fetchCategories]);

  // Apply URL filters after data is loaded and when searchParams change
  useEffect(() => {
    if (!isInitialLoad && allCategories.length > 0) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
    }
  }, [searchParams, isInitialLoad, allCategories.length]);

  const updateURL = useCallback(
    (newFilters: ActivityCategoryFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${ACTIVITY_CATEGORIES_PAGE_URL}/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${ACTIVITY_CATEGORIES_PAGE_URL}/view`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSearch = () => {
    updateURL(filters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters: ActivityCategoryFilterParams = { 
      ...filters, 
      pageSize: newPageSize, 
      pageNumber: 1 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters: ActivityCategoryFilterParams = { 
      ...filters, 
      pageNumber: page 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: ActivityCategoryFilterParams = {
      name: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "categoryName",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters: ActivityCategoryFilterParams = { 
      ...filters, 
      [key]: null, 
      pageNumber: 1 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: ActivityCategoryFilterParams = {
      ...filters,
      sortBy: "categoryName",
      sortDirection: "ASC",
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters: ActivityCategoryFilterParams = {
      ...filters,
      sortBy: newSortBy,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Handle image click for modal
  const handleImageClick = (category: ActivityCategory, imageIndex: number) => {
    const images: ImageModalImage[] = (category.images || []).map(
      (img: ActivityCategoryImage) => ({
        url: img.imageUrl,
        name: img.imageName,
        description: img.imageDescription || "",
        id: img.imageId,
      }),
    );
    setModalImages(images);
    setSelectedImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  // Get status options for filter
  const getStatusOptions = () => {
    return availableStatuses.map((status) => ({
      value: status,
      label:
        status === "ACTIVE"
          ? "Active"
          : status === "INACTIVE"
            ? "Inactive"
            : "Terminated",
    }));
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Category Name",
      type: "search",
      placeholder: "Search by category name...",
      width: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusOptions(),
      width: "third",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value:
          filters.status === "ACTIVE"
            ? "Active"
            : filters.status === "INACTIVE"
              ? "Inactive"
              : "Terminated",
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (
      !filters.sortBy ||
      (filters.sortBy === "categoryName" && filters.sortDirection === "ASC")
    )
      return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: filters.sortDirection || "ASC",
    };
  };

  const currentStart =
    displayedCategories.length > 0
      ? (filters.pageNumber - 1) * filters.pageSize + 1
      : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    status: filters.status,
  };

  if (loading && isInitialLoad) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch activity categories"
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
            title="Activity Categories View"
            description="Explore and manage activity categories and their associated activities"
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
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            title="Filter Categories"
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
            title="Activity Categories"
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
          />
        </div>

        {/* Loading State for filter changes */}
        {loading && !isInitialLoad && (
          <CommonLoading
            message="Updating categories..."
            subMessage="Please wait"
            size="lg"
          />
        )}

        {/* Categories Grid/List */}
        {!loading && (
          <>
            {displayedCategories.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedCategories.map((category) => (
                      <ActivityCategoryCard
                        key={category.categoryId}
                        category={category}
                        onImageClick={(imageIndex) =>
                          handleImageClick(category, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {displayedCategories.map((category) => (
                      <ActivityCategoryListCard
                        key={category.categoryId}
                        category={category}
                        onImageClick={(imageIndex) =>
                          handleImageClick(category, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalItems > filters.pageSize && (
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
                )}
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
const ViewActivityCategoryPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <ActivityCategoriesViewContent />
    </Suspense>
  );
};

export default ViewActivityCategoryPage;