"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { RoleService } from "@/services/roleService";
import { RoleFilterParams, Role } from "@/types/role-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import { ROLES_VIEW_PAGE_URL } from "@/utils/urls";
import RoleCard from "@/components/employee-management-components/roles-components/role-view-components/RoleCard";
import RoleListCard from "@/components/employee-management-components/roles-components/role-view-components/RoleListCard";
import {
  rolesViewFiltersToUrlParams,
  rolesViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { FilterField } from "@/types/filter-types";
import { ROLE_VIEW_STATUS_OPTIONS } from "@/data/status-options-data";
import { ROLE_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { ROLE_VIEW_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const RoleViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [filters, setFilters] = useState<RoleFilterParams>(() =>
    rolesViewUrlParamsToFilters(searchParams || new URLSearchParams()),
  );
  const [roles, setRoles] = useState<Role[]>([]);
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
      label: "Role Name",
      type: "text",
      placeholder: "Search by name...",
      width: "full",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ROLE_VIEW_STATUS_OPTIONS,
      width: "third",
    },
  ];

  // Get sort label for display
  const getSortLabel = (sortBy: string): string => {
    const option = ROLE_VIEW_SORTING_OPTIONS.find(
      (opt) => opt.value === sortBy,
    );
    return option ? option.label : sortBy;
  };

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: RoleFilterParams) => {
      const params = rolesViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${ROLES_VIEW_PAGE_URL}?${queryString}`
        : `${ROLES_VIEW_PAGE_URL}`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchRoles = useCallback(async (currentFilters: RoleFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const apiFilters = {
        ...currentFilters,
        pageNumber: Math.max(0, (currentFilters.pageNumber || 1) - 1),
      };

      const response = await RoleService.getAllRoles(apiFilters);
      setRoles(response.data.roleResponses);
      setTotalItems(response.data.totalResponse);
    } catch (err: any) {
      console.error("Error fetching roles:", err);
      setError(err.message || "Failed to load roles");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load roles",
      });
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Initial load from URL params
  useEffect(() => {
    const initialFilters = rolesViewUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters(initialFilters);
    fetchRoles(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = rolesViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchRoles(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchRoles]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchRoles(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchRoles(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchRoles(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: RoleFilterParams = {
      name: null,
      status: null,
      pageSize: 12,
      pageNumber: 1,
      sortBy: undefined,
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchRoles(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchRoles(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: RoleFilterParams = {
      ...filters,
      sortBy: undefined,
      sortDirection: "ASC" as const,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchRoles(updatedFilters);
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
    fetchRoles(updatedFilters);
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
        label: "Role Name",
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
    roles.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
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
        title="Failed to Load Roles"
        message="Unable to load roles. Please try again."
        variant="error"
        showRetryButton={true}
        onRetry={() => fetchRoles(filters)}
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
            title="Roles"
            description="Manage user roles and permissions"
            breadcrumbItems={ROLE_VIEW_BREADCRUMB_DATA}
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
            sortOptions={ROLE_VIEW_SORTING_OPTIONS}
            sortBy={filters.sortBy || ""}
            sortDirection={filters.sortDirection || "ASC"}
            title="Filter Roles"
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
            title="Roles"
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
            message="Loading roles..."
            subMessage="Fetching role data"
            size="lg"
          />
        )}

        {/* Roles Grid/List View */}
        {!loading && roles.length > 0 && (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {roles.map((role) => (
                  <RoleCard key={role.roleId} role={role} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4 mb-8">
                {roles.map((role) => (
                  <RoleListCard key={role.roleId} role={role} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && roles.length === 0 && (
          <div
            className="rounded-xl shadow-sm border p-12 text-center"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="text-6xl mb-4">👥</div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: theme.text }}
            >
              No Roles Found
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
              {getActiveFilters().length > 0 || filters.sortBy
                ? "Try adjusting your filters or clear them to see all roles."
                : "Click the 'Add Role' button to create your first role."}
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
const RoleViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading
          message="Loading roles..."
          size="lg"
          fullScreen={false}
        />
      }
    >
      <RoleViewContent />
    </Suspense>
  );
};

export default RoleViewPage;
