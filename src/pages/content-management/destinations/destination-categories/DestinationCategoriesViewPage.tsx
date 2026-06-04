"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { ActiveCategory } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import CategoryCard from "@/components/destination-categories-components/destination-categories-view-components/CategoryCard";
import CategoryListCard from "@/components/destination-categories-components/destination-categories-view-components/CategoryListCard";
import { EmptyState } from "@/components/common-components/EmptyState";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { DESTINATION_CATEGORY_VIEW_PAGE_URL } from "@/utils/urls";
import { DESTINATION_CATEGORY_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import { FilterField, SortOption } from "@/types/filter-types";
import { CategoryFilterParams } from "@/types/destination-category-types";
import {
  destinationCategoryFiltersToUrlParams,
  destinationCategoryUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { DESTINATION_CATEGORY_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import FilterPanel from "@/components/common-components/FilterPanel";

const SORT_OPTIONS: SortOption[] = DESTINATION_CATEGORY_VIEW_SORTING_OPTIONS;

const sortCategories = (
  categoriesList: ActiveCategory[],
  sortBy?: string,
  sortDirection: "ASC" | "DESC" = "ASC",
): ActiveCategory[] => {
  if (!sortBy) return categoriesList;

  const sorted = [...categoriesList];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "categoryId":
        comparison = a.categoryId - b.categoryId;
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "ASC" ? comparison : -comparison;
  });

  return sorted;
};

const DestinationCategoriesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [categories, setCategories] = useState<ActiveCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    ActiveCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState<CategoryFilterParams>(() =>
    destinationCategoryUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    ),
  );

  const getSortLabel = (sortBy: string): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Category Name",
      type: "text",
      placeholder: "Search by category name...",
      width: "full",
    },
    {
      key: "categoryStatus",
      label: "Status",
      type: "select",
      options: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
      ],
      width: "third",
    },
  ];

  const updateURL = useCallback(
    (newFilters: CategoryFilterParams) => {
      const params = destinationCategoryFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${DESTINATION_CATEGORY_VIEW_PAGE_URL}?${queryString}`
        : DESTINATION_CATEGORY_VIEW_PAGE_URL;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getActiveCategories();
      const data = response.data;
      setCategories(data);

      const urlFilters = destinationCategoryUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      applyFilters(data, urlFilters);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [searchParams]);

  const applyFilters = (
    categoriesList: ActiveCategory[],
    currentFilters: CategoryFilterParams,
  ) => {
    let filtered = [...categoriesList];

    if (currentFilters.name) {
      const searchLower = currentFilters.name.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.category.toLowerCase().includes(searchLower) ||
          category.categoryDescription.toLowerCase().includes(searchLower),
      );
    }

    if (currentFilters.categoryStatus) {
      filtered = filtered.filter(
        (category) => category.categoryStatus === currentFilters.categoryStatus,
      );
    }

    filtered = sortCategories(
      filtered,
      currentFilters.sortBy,
      currentFilters.sortDirection,
    );

    setFilteredCategories(filtered);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = destinationCategoryUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      applyFilters(categories, urlFilters);
    }
  }, [searchParams, isInitialLoad, categories]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: CategoryFilterParams = {
      name: null,
      categoryStatus: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: undefined,
      sortDirection: "ASC" as const,
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    applyFilters(categories, resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: CategoryFilterParams = {
      ...filters,
      sortBy: undefined,
      sortDirection: "ASC" as const,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: newSortBy || undefined,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const startIndex = (filters.pageNumber - 1) * filters.pageSize;
  const endIndex = startIndex + filters.pageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  const totalItems = filteredCategories.length;
  const currentStart = paginatedCategories.length > 0 ? startIndex + 1 : 0;
  const currentEnd = Math.min(endIndex, totalItems);

  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({
        key: "name",
        label: "Category Name",
        value: filters.name,
      });
    }
    if (filters.categoryStatus) {
      activeFilters.push({
        key: "categoryStatus",
        label: "Status",
        value: filters.categoryStatus === "ACTIVE" ? "Active" : "Inactive",
      });
    }

    return activeFilters;
  };

  const getSortFilter = () => {
    if (!filters.sortBy) return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: filters.sortDirection || "ASC",
    };
  };

  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    categoryStatus: filters.categoryStatus,
  };

  if (loading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Fetching destination categories with rich content"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Categories"
        message="Unable to load destination categories. Please try again."
        variant="error"
        showBackButton={false}
        showRetryButton={true}
        onRetry={fetchCategories}
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Destination Categories"
            description="Manage and explore destination categories with rich visual experience"
            breadcrumbItems={DESTINATION_CATEGORY_VIEW_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section - Using FilterPanel with sorting */}
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
            pageSizeOptions={[6, 9, 12, 24]}
            showPageSize={true}
            showSorting={true}
            sortOptions={SORT_OPTIONS}
            sortBy={filters.sortBy || ""}
            sortDirection={filters.sortDirection || "ASC"}
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

        {/* Results Header */}
        <ResultsHeader
          title="Destination Categories"
          currentStart={currentStart}
          currentEnd={currentEnd}
          totalItems={totalItems}
          viewMode={viewMode}
          onViewModeChange={toggleViewMode}
        />

        {paginatedCategories.length === 0 ? (
          <EmptyState
            entityType="destinationCategory"
            onClearFilters={handleReset}
            hideAction={false}
            isFiltered={getActiveFilters().length > 0 || !!filters.sortBy}
            actionLabel="Clear Filters"
          />
        ) : (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedCategories.map((category) => (
                  <CategoryCard key={category.categoryId} category={category} />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-6 mb-8">
                {paginatedCategories.map((category) => (
                  <CategoryListCard
                    key={category.categoryId}
                    category={category}
                  />
                ))}
              </div>
            )}

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
      </div>
    </div>
  );
};

const DestinationCategoriesViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: `${theme.primary}20`,
              borderTopColor: theme.primary,
            }}
          />
          <span
            className="mt-4 text-lg font-medium"
            style={{ color: theme.text }}
          >
            Loading...
          </span>
        </div>
      }
    >
      <DestinationCategoriesViewContent />
    </Suspense>
  );
};

export default DestinationCategoriesViewPage;