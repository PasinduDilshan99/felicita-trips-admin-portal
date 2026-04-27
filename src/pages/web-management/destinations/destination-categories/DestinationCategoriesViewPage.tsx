// app/destinations/categories/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { LoadingState } from "@/components/destinations-components/view-destinations-components/LoadingState";
import Pagination from "@/components/destinations-components/DestinationPagination";
import { ResultsHeader } from "@/components/destinations-components/view-destinations-components/ResultsHeader";
import { ActiveCategory } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import CategoryFilter from "@/components/destination-categories-components/destination-categories-view-components/CategoryFilter";
import CategoryCard from "@/components/destination-categories-components/destination-categories-view-components/CategoryCard";
import CategoryListCard from "@/components/destination-categories-components/destination-categories-view-components/CategoryListCard";
import { CategoryEmptyState } from "@/components/destination-categories-components/destination-categories-view-components/CategoryEmptyState";
import { useRouter, useSearchParams } from "next/navigation";

// Category Filter Params
interface CategoryFilterParams {
  searchTerm: string | null;
  categoryStatus: "ACTIVE" | "INACTIVE" | null;
  pageSize: number;
  pageNumber: number;
}

// Utility functions for URL params management
const filtersToUrlParams = (filters: CategoryFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.categoryStatus) params.set("categoryStatus", filters.categoryStatus);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());

  return params;
};

const urlParamsToFilters = (params: URLSearchParams): CategoryFilterParams => {
  return {
    searchTerm: params.get("searchTerm") || null,
    categoryStatus: (params.get("categoryStatus") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber") ? parseInt(params.get("pageNumber")!) : 1,
  };
};

// Main component wrapped with Suspense
const DestinationCategoriesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Categories",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
    },
  ];

  const [categories, setCategories] = useState<ActiveCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ActiveCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState<CategoryFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams())
  );

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: CategoryFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`;

      router.replace(newURL, { scroll: false });
    },
    [router]
  );

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DestinationService.getActiveCategories();
      const data = response.data;
      setCategories(data);

      // Apply initial filtering based on URL params
      const urlFilters = urlParamsToFilters(searchParams || new URLSearchParams());
      applyFilters(data, urlFilters);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [searchParams]);

  const applyFilters = (
    categoriesList: ActiveCategory[],
    currentFilters: CategoryFilterParams
  ) => {
    let filtered = [...categoriesList];

    // Apply search term filter
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.category.toLowerCase().includes(searchLower) ||
          category.categoryDescription.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (currentFilters.categoryStatus) {
      filtered = filtered.filter(
        (category) => category.categoryStatus === currentFilters.categoryStatus
      );
    }

    setFilteredCategories(filtered);
  };

  // Initial load from URL params
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(searchParams || new URLSearchParams());
      setFilters(urlFilters);
      applyFilters(categories, urlFilters);
    }
  }, [searchParams, isInitialLoad, categories]);

  const handleFilterChange = (newFilters: CategoryFilterParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    applyFilters(categories, updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: CategoryFilterParams = {
      searchTerm: null,
      categoryStatus: null,
      pageSize: 6,
      pageNumber: 1,
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    applyFilters(categories, resetFilters);
  };

  const handleRemoveFilter = (key: keyof CategoryFilterParams) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
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

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    // No need to reapply filters for page change as it just affects pagination of already filtered data
    // But we keep the URL updated
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Pagination calculations
  const startIndex = (filters.pageNumber - 1) * filters.pageSize;
  const endIndex = startIndex + filters.pageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  const totalItems = filteredCategories.length;
  const currentStart = paginatedCategories.length > 0 ? startIndex + 1 : 0;
  const currentEnd = Math.min(endIndex, totalItems);

  // Get active filters for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.categoryStatus) count++;
    return count;
  };

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
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <CategoryFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <ActiveCategoryFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleReset}
          />
        )}

        {/* Results Header */}
        <ResultsHeader
          currentStart={currentStart}
          currentEnd={currentEnd}
          totalItems={totalItems}
          viewMode={viewMode}
          onViewModeChange={toggleViewMode}
        />

        {/* Loading State */}
        {loading && (
          <LoadingState
            message="Loading categories..."
            subMessage="Fetching destination categories with rich content"
          />
        )}

        {/* Categories Grid/List */}
        {!loading && (
          <>
            {paginatedCategories.length === 0 ? (
              <CategoryEmptyState
                onClearFilters={handleReset}
                hasActiveFilters={getActiveFilterCount() > 0}
                searchTerm={filters.searchTerm}
              />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedCategories.map((category) => (
                      <CategoryCard
                        key={category.categoryId}
                        category={category}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
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

                {/* Pagination */}
                {totalItems > filters.pageSize && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={filters.pageNumber}
                      totalItems={totalItems}
                      pageSize={filters.pageSize}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Active Filters Component for Categories
const ActiveCategoryFilters: React.FC<{
  filters: CategoryFilterParams;
  onRemoveFilter: (key: keyof CategoryFilterParams) => void;
  onClearAll: () => void;
}> = ({ filters, onRemoveFilter, onClearAll }) => {
  const { theme } = useTheme();
  const { Filter, X } = require("lucide-react");

  interface ActiveFilterItem {
    key: keyof CategoryFilterParams;
    label: string;
    value: string;
  }

  const activeFilters: ActiveFilterItem[] = [];

  if (filters.searchTerm) {
    activeFilters.push({
      key: "searchTerm",
      label: "Search",
      value: filters.searchTerm,
    });
  }
  if (filters.categoryStatus) {
    activeFilters.push({
      key: "categoryStatus",
      label: "Status",
      value: filters.categoryStatus,
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div
      className="rounded-xl shadow-sm border p-4 mb-6 transition-colors duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: theme.primary }} />
          <span
            className="text-sm font-medium"
            style={{ color: theme.textSecondary }}
          >
            Active Filters:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-300"
              style={{
                backgroundColor: `${theme.primary}10`,
                border: `1px solid ${theme.primary}30`,
              }}
            >
              <span className="font-medium" style={{ color: theme.primary }}>
                {filter.label}:
              </span>
              <span style={{ color: theme.text }}>{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-1 transition-colors hover:opacity-70"
                style={{ color: theme.primary }}
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClearAll}
          className="text-sm transition-colors flex items-center gap-1 hover:opacity-70"
          style={{ color: theme.error }}
        >
          <X className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>
    </div>
  );
};

// Wrap with Suspense
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
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: theme.primary }}
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