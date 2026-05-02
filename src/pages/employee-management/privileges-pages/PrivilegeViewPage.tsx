// app/user-management/privileges/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { PrivilegeService } from "@/services/privilegeService";
import { PrivilegeFilterParams, Privilege } from "@/types/privilege-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import PrivilegeCard from "@/components/employee-management-components/privilege-components/privilege-view-components/PrivilegeCard";
import PrivilegeListCard from "@/components/employee-management-components/privilege-components/privilege-view-components/PrivilegeListCard";
import {
  EMPLOYEE_MANAGEMENT_URL,
  PRIVILEGES_MANAGEMENT_PAGE_URL,
  PRIVILEGES_VIEW_PAGE_URL,
} from "@/utils/urls";

// Sort options
const SORT_OPTIONS = [
  { value: "name", label: "Privilege Name" },
  { value: "privilegeId", label: "Privilege ID" },
  { value: "privilegeStatus", label: "Status" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

// Status options
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: PrivilegeFilterParams,
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

const urlParamsToFilters = (params: URLSearchParams): PrivilegeFilterParams => {
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 12,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") as
      | "name"
      | "privilegeId"
      | "privilegeStatus"
      | "createdAt"
      | "updatedAt"
      | undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

const breadcrumbItems = [
  { label: "Dashboard", href: "/" },
  { label: "Employee Management", href: EMPLOYEE_MANAGEMENT_URL },
  { label: "Privileges", href: PRIVILEGES_MANAGEMENT_PAGE_URL },
];

const PrivilegeViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [filters, setFilters] = useState<PrivilegeFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Privilege Name",
      type: "text",
      placeholder: "Search by name...",
      width: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: STATUS_OPTIONS,
      width: "third",
    },
  ];

  // Get sort label for display
  const getSortLabel = (sortBy: string): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: PrivilegeFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${PRIVILEGES_VIEW_PAGE_URL}?${queryString}`
        : `${PRIVILEGES_VIEW_PAGE_URL}`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchPrivileges = useCallback(
    async (currentFilters: PrivilegeFilterParams) => {
      setLoading(true);
      setError(null);
      try {
        // IMPORTANT: Convert page number from 1-based (UI) to 0-based (API)
        const apiFilters = {
          ...currentFilters,
          pageNumber: Math.max(0, (currentFilters.pageNumber || 1) - 1), // Convert to 0-based for API
        };

        const response = await PrivilegeService.getAllPrivileges(apiFilters);
        setPrivileges(response.data.privilegeResponses);
        setTotalItems(response.data.totalResponse);
      } catch (err: any) {
        console.error("Error fetching privileges:", err);
        setError(err.message || "Failed to load privileges");
        setToast({
          type: "error",
          title: "Error",
          message: err.message || "Failed to load privileges",
        });
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
    fetchPrivileges(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchPrivileges(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchPrivileges]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: PrivilegeFilterParams = {
      name: null,
      status: null,
      pageSize: 12,
      pageNumber: 1,
      sortBy: undefined,
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchPrivileges(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: PrivilegeFilterParams = {
      ...filters,
      sortBy: undefined,
      sortDirection: "ASC" as const,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handleSortChange = (
    newSortBy: string,
    newSortDirection: "ASC" | "DESC",
  ) => {
    const updatedFilters = {
      ...filters,
      sortBy: (newSortBy as any) || undefined,
      sortDirection: newSortDirection,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPrivileges(updatedFilters);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({
        key: "name",
        label: "Privilege Name",
        value: filters.name,
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
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

  // Calculate pagination values
  const currentStart =
    privileges.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );
  const totalPages = Math.ceil(totalItems / filters.pageSize);

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    status: filters.status,
  };

  if (error && !loading) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Privileges"
        message="Unable to load privileges. Please try again."
        variant="error"
        showRetryButton={true}
        onRetry={() => fetchPrivileges(filters)}
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

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
            title="Privileges"
            description="Manage user privileges and permissions"
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
            pageSizeOptions={[12, 15, 20, 30, 50]}
            showPageSize={true}
            showSorting={true}
            sortOptions={SORT_OPTIONS}
            sortBy={filters.sortBy || ""}
            sortDirection={filters.sortDirection || "ASC"}
            title="Filter Privileges"
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
            title="Privileges"
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <CommonLoading
            message="Loading privileges..."
            subMessage="Fetching privilege data"
            size="lg"
          />
        )}

        {/* Privileges Grid/List View */}
        {!loading && privileges.length > 0 && (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {privileges.map((privilege) => (
                  <PrivilegeCard
                    key={privilege.privilegeId}
                    privilege={privilege}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4 mb-8">
                {privileges.map((privilege) => (
                  <PrivilegeListCard
                    key={privilege.privilegeId}
                    privilege={privilege}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && privileges.length === 0 && (
          <div
            className="rounded-xl shadow-sm border p-12 text-center"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: theme.text }}
            >
              No Privileges Found
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
              {getActiveFilters().length > 0 || filters.sortBy
                ? "Try adjusting your filters or clear them to see all privileges."
                : "Click the 'Add Privilege' button to create your first privilege."}
            </p>
            {(getActiveFilters().length > 0 || filters.sortBy) && (
              <CommonButton variant="outline" onClick={handleReset}>
                Clear Filters
              </CommonButton>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalItems > filters.pageSize && totalPages >= 2 && (
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
      </div>
    </div>
  );
};

// Wrap with Suspense for useSearchParams
const PrivilegeViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading
          message="Loading privileges..."
          size="lg"
          fullScreen={false}
        />
      }
    >
      <PrivilegeViewContent />
    </Suspense>
  );
};

export default PrivilegeViewPage;
