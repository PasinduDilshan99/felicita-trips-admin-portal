// app/user-management/employees/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { EmployeeService } from "@/services/employeeService";
import { EmployeeFilterParams, EmployeeBasic, EmployeeFilterOptions, FilterOption } from "@/types/employee-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import { EMPLOYEE_MANAGEMENT_URL, EMPLOYEES_VIEW_PAGE_URL } from "@/utils/urls";
import EmployeeCard from "@/components/employee-management-components/employee-components/employee-view-components/EmployeeCard";
import EmployeeListCard from "@/components/employee-management-components/employee-components/employee-view-components/EmployeeListCard";

// Sort options
const SORT_OPTIONS = [
  { value: "employeeType", label: "Employee Type" },
  { value: "department", label: "Department" },
  { value: "employmentType", label: "Employment Type" },
  { value: "workLocation", label: "Work Location" },
  { value: "employeeGrade", label: "Employee Grade" },
  { value: "supervisor", label: "Supervisor" },
  { value: "reportingManager", label: "Reporting Manager" },
  { value: "fullName", label: "Full Name" },
  { value: "employeeCode", label: "Employee Code" },
  { value: "employeeId", label: "Employee ID" },
  { value: "status", label: "Status" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

// Utility functions for URL params management
const filtersToUrlParams = (filters: EmployeeFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.employeeTypeId)
    params.set("employeeTypeId", filters.employeeTypeId.toString());
  if (filters.departmentId)
    params.set("departmentId", filters.departmentId.toString());
  if (filters.employmentType)
    params.set("employmentType", filters.employmentType);
  if (filters.workLocation) params.set("workLocation", filters.workLocation);
  if (filters.employeeGrade) params.set("employeeGrade", filters.employeeGrade);
  if (filters.supervisorId)
    params.set("supervisorId", filters.supervisorId.toString());
  if (filters.reportingManagerId)
    params.set("reportingManagerId", filters.reportingManagerId.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

const urlParamsToFilters = (params: URLSearchParams): EmployeeFilterParams => {
  return {
    name: params.get("name") || null,
    employeeTypeId: params.get("employeeTypeId")
      ? parseInt(params.get("employeeTypeId")!)
      : null,
    status: params.get("status") || null,
    departmentId: params.get("departmentId")
      ? parseInt(params.get("departmentId")!)
      : null,
    employmentType: params.get("employmentType") || null,
    workLocation: params.get("workLocation") || null,
    employeeGrade: params.get("employeeGrade") || null,
    supervisorId: params.get("supervisorId")
      ? parseInt(params.get("supervisorId")!)
      : null,
    reportingManagerId: params.get("reportingManagerId")
      ? parseInt(params.get("reportingManagerId")!)
      : null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 12,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

const breadcrumbItems = [
  { label: "Dashboard", href: "/" },
  { label: "Employee Management", href: EMPLOYEE_MANAGEMENT_URL },
  { label: "Employees", href: EMPLOYEES_VIEW_PAGE_URL },
];

const EmployeeViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [filters, setFilters] = useState<EmployeeFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Filter options state
  const [filterOptions, setFilterOptions] = useState<EmployeeFilterOptions>({
    employeeTypes: [],
    departments: [],
    employmentTypes: [],
    workLocations: [],
    employeeGrades: [],
    supervisors: [],
    reportingManagers: [],
    statuses: [],
  });

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await EmployeeService.getEmployeeFilterOptions();
      setFilterOptions(response.data);
    } catch (err: any) {
      console.error("Error fetching filter options:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load filter options",
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  // Define filter fields for the FilterPanel (dynamically populated from API)
  const getFilterFields = (): FilterField[] => {
    const fields: FilterField[] = [
      {
        key: "name",
        label: "Employee Name",
        type: "text",
        placeholder: "Search by name or email...",
        width: "full",
      },
    ];

    if (filterOptions.employeeTypes.length > 0) {
      fields.push({
        key: "employeeTypeId",
        label: "Employee Type",
        type: "select",
        options: filterOptions.employeeTypes.map(opt => ({ value: opt.id, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.departments.length > 0) {
      fields.push({
        key: "departmentId",
        label: "Department",
        type: "select",
        options: filterOptions.departments.map(opt => ({ value: opt.id, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.employmentTypes.length > 0) {
      fields.push({
        key: "employmentType",
        label: "Employment Type",
        type: "select",
        options: filterOptions.employmentTypes.map(opt => ({ value: opt.label, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.workLocations.length > 0) {
      fields.push({
        key: "workLocation",
        label: "Work Location",
        type: "select",
        options: filterOptions.workLocations.map(opt => ({ value: opt.label, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.employeeGrades.length > 0) {
      fields.push({
        key: "employeeGrade",
        label: "Employee Grade",
        type: "select",
        options: filterOptions.employeeGrades.map(opt => ({ value: opt.label, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.supervisors.length > 0) {
      fields.push({
        key: "supervisorId",
        label: "Supervisor",
        type: "select",
        options: filterOptions.supervisors.map(opt => ({ value: opt.id, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.reportingManagers.length > 0) {
      fields.push({
        key: "reportingManagerId",
        label: "Reporting Manager",
        type: "select",
        options: filterOptions.reportingManagers.map(opt => ({ value: opt.id, label: opt.label })),
        width: "third",
      });
    }

    if (filterOptions.statuses.length > 0) {
      fields.push({
        key: "status",
        label: "Status",
        type: "select",
        options: filterOptions.statuses.map(opt => ({ value: opt.label, label: opt.label })),
        width: "third",
      });
    }

    return fields;
  };

  // Get sort label for display
  const getSortLabel = (sortBy: string): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option ? option.label : sortBy;
  };

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: EmployeeFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${EMPLOYEES_VIEW_PAGE_URL}?${queryString}`
        : `${EMPLOYEES_VIEW_PAGE_URL}`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchEmployees = useCallback(
    async (currentFilters: EmployeeFilterParams) => {
      setLoading(true);
      setError(null);
      try {
        // IMPORTANT: Convert page number from 1-based (UI) to 0-based (API)
        const apiFilters = {
          ...currentFilters,
          pageNumber: Math.max(0, (currentFilters.pageNumber || 1) - 1),
        };

        const response = await EmployeeService.getEmployeeBasicDetails(apiFilters);
        setEmployees(response.data);
        setTotalItems(response.data?.length || 0);
      } catch (err: any) {
        console.error("Error fetching employees:", err);
        setError(err.message || "Failed to load employees");
        setToast({
          type: "error",
          title: "Error",
          message: err.message || "Failed to load employees",
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
    fetchEmployees(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchEmployees(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchEmployees]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchEmployees(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchEmployees(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchEmployees(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: EmployeeFilterParams = {
      name: null,
      employeeTypeId: null,
      status: null,
      departmentId: null,
      employmentType: null,
      workLocation: null,
      employeeGrade: null,
      supervisorId: null,
      reportingManagerId: null,
      pageSize: 12,
      pageNumber: 1,
      sortBy: undefined,
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchEmployees(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchEmployees(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: EmployeeFilterParams = {
      ...filters,
      sortBy: undefined,
      sortDirection: "ASC" as const,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchEmployees(updatedFilters);
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
    fetchEmployees(updatedFilters);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Helper function to get option label by value
  const getOptionLabel = (options: FilterOption[], value: number | string | null, defaultValue: string): string => {
    if (!value) return defaultValue;
    const option = options.find(opt => opt.id === value || opt.label === value);
    return option?.label || String(value);
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> = [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Employee Name", value: filters.name });
    }
    if (filters.employeeTypeId) {
      activeFilters.push({
        key: "employeeTypeId",
        label: "Employee Type",
        value: getOptionLabel(filterOptions.employeeTypes, filters.employeeTypeId, String(filters.employeeTypeId)),
      });
    }
    if (filters.departmentId) {
      activeFilters.push({
        key: "departmentId",
        label: "Department",
        value: getOptionLabel(filterOptions.departments, filters.departmentId, String(filters.departmentId)),
      });
    }
    if (filters.employmentType) {
      activeFilters.push({
        key: "employmentType",
        label: "Employment Type",
        value: getOptionLabel(filterOptions.employmentTypes, filters.employmentType, filters.employmentType),
      });
    }
    if (filters.workLocation) {
      activeFilters.push({
        key: "workLocation",
        label: "Work Location",
        value: getOptionLabel(filterOptions.workLocations, filters.workLocation, filters.workLocation),
      });
    }
    if (filters.employeeGrade) {
      activeFilters.push({
        key: "employeeGrade",
        label: "Employee Grade",
        value: getOptionLabel(filterOptions.employeeGrades, filters.employeeGrade, filters.employeeGrade),
      });
    }
    if (filters.supervisorId) {
      activeFilters.push({
        key: "supervisorId",
        label: "Supervisor",
        value: getOptionLabel(filterOptions.supervisors, filters.supervisorId, String(filters.supervisorId)),
      });
    }
    if (filters.reportingManagerId) {
      activeFilters.push({
        key: "reportingManagerId",
        label: "Reporting Manager",
        value: getOptionLabel(filterOptions.reportingManagers, filters.reportingManagerId, String(filters.reportingManagerId)),
      });
    }
    if (filters.status) {
      activeFilters.push({
        key: "status",
        label: "Status",
        value: getOptionLabel(filterOptions.statuses, filters.status, filters.status),
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

  // Pagination calculations
  const currentStart = employees.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(filters.pageNumber * filters.pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / filters.pageSize);

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    employeeTypeId: filters.employeeTypeId,
    departmentId: filters.departmentId,
    employmentType: filters.employmentType,
    workLocation: filters.workLocation,
    employeeGrade: filters.employeeGrade,
    supervisorId: filters.supervisorId,
    reportingManagerId: filters.reportingManagerId,
    status: filters.status,
  };

  if ((loadingOptions || (loading && isInitialLoad)) && !error) {
    return (
      <CommonLoading
        message="Loading employees..."
        subMessage="Please wait while we fetch employee data"
        size="lg"
      />
    );
  }

  if (error && !loading) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Employees"
        message="Unable to load employees. Please try again."
        variant="error"
        showRetryButton={true}
        onRetry={() => fetchEmployees(filters)}
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
            title="Employees"
            description="Manage employee information and details"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <FilterPanel
            filters={filterPanelFilters}
            fields={getFilterFields()}
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
            title="Filter Employees"
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
          <div className="flex items-center justify-between">
            <ResultsHeader
              title="Employees"
              currentStart={currentStart}
              currentEnd={currentEnd}
              totalItems={totalItems}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
            <CommonButton
              variant="primary"
              size="sm"
              icon="➕"
              onClick={() => router.push(`${EMPLOYEES_VIEW_PAGE_URL}/add`)}
            >
              Add Employee
            </CommonButton>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <CommonLoading
            message="Loading employees..."
            subMessage="Fetching employee data"
            size="lg"
          />
        )}

        {/* Employees Grid/List View */}
        {!loading && employees.length > 0 && (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {employees.map((employee) => (
                  <EmployeeCard key={employee.employeeId} employee={employee} />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4 mb-8">
                {employees.map((employee) => (
                  <EmployeeListCard
                    key={employee.employeeId}
                    employee={employee}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && employees.length === 0 && (
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
              No Employees Found
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
              {getActiveFilters().length > 0 || filters.sortBy
                ? "Try adjusting your filters or clear them to see all employees."
                : "Click the 'Add Employee' button to add your first employee."}
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
const EmployeeViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading
          message="Loading employees..."
          size="lg"
          fullScreen={false}
        />
      }
    >
      <EmployeeViewContent />
    </Suspense>
  );
};

export default EmployeeViewPage;