// app/tour-types/view/page.tsx
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
import { TourTypeService } from "@/services/tourTypeService";
import {
  TourTypeListItem,
  TourTypeImage,
} from "@/types/tour-type-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import { TOUR_TYPES_PAGE_URL, WEB_MANAGEMENT_URL } from "@/utils/urls";
import TourTypeCard from "@/components/tour-types-components/view-tour-type-components/TourTypeCard";
import TourTypeListCard from "@/components/tour-types-components/view-tour-type-components/TourTypeListCard";

// Sort options for tour types
const SORT_OPTIONS = [
  { value: "typeName", label: "Type Name" },
  { value: "typeId", label: "Type ID" },
  { value: "status", label: "Status" },
];

// Filter params interface
interface TourTypeFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

// Utility functions for URL params management
const filtersToUrlParams = (
  filters: TourTypeFilterParams,
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
): TourTypeFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "typeName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as "ASC" | "DESC",
  };
};

// Main component wrapped with Suspense for useSearchParams
const TourTypesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Tour Types", href: TOUR_TYPES_PAGE_URL },
    { label: "View", href: TOUR_TYPES_PAGE_URL },
  ];

  const [filters, setFilters] = useState<TourTypeFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [allTypes, setAllTypes] = useState<TourTypeListItem[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<
    TourTypeListItem[]
  >([]);
  const [displayedTypes, setDisplayedTypes] = useState<
    TourTypeListItem[]
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

  // Fetch all types
  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TourTypeService.getTourTypes();

      if (response.code === 200 && response.data) {
        setAllTypes(response.data);

        // Extract unique statuses for filter options
        const statuses = [
          ...new Set(response.data.map((type) => type.status)),
        ];
        setAvailableStatuses(statuses);

        return response.data;
      } else {
        setAllTypes([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching tour types:", error);
      setAllTypes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort types based on filters
  const filterAndSortTypes = useCallback(
    (
      types: TourTypeListItem[],
      currentFilters: TourTypeFilterParams,
    ) => {
      let result = [...types];

      // Apply name filter
      if (currentFilters.name) {
        const searchTerm = currentFilters.name.toLowerCase();
        result = result.filter((type) =>
          type.typeName.toLowerCase().includes(searchTerm),
        );
      }

      // Apply status filter
      if (currentFilters.status) {
        result = result.filter(
          (type) => type.status === currentFilters.status,
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (currentFilters.sortBy) {
          case "typeName":
            aVal = a.typeName;
            bVal = b.typeName;
            break;
          case "typeId":
            aVal = a.typeId;
            bVal = b.typeId;
            break;
          case "status":
            aVal = a.status;
            bVal = b.status;
            break;
          default:
            aVal = a.typeName;
            bVal = b.typeName;
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

  // Update filtered and displayed types when data or filters change
  useEffect(() => {
    if (allTypes.length > 0) {
      const filtered = filterAndSortTypes(allTypes, filters);
      setFilteredTypes(filtered);
      setTotalItems(filtered.length);

      // Apply pagination
      const start = (filters.pageNumber - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      setDisplayedTypes(filtered.slice(start, end));
    }
  }, [allTypes, filters, filterAndSortTypes]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchTypes();
      setIsInitialLoad(false);
    };

    loadData();
  }, [fetchTypes]);

  // Apply URL filters after data is loaded and when searchParams change
  useEffect(() => {
    if (!isInitialLoad && allTypes.length > 0) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
    }
  }, [searchParams, isInitialLoad, allTypes.length]);

  const updateURL = useCallback(
    (newFilters: TourTypeFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${TOUR_TYPES_PAGE_URL}/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${TOUR_TYPES_PAGE_URL}/view`;

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
    const updatedFilters: TourTypeFilterParams = { 
      ...filters, 
      pageSize: newPageSize, 
      pageNumber: 1 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters: TourTypeFilterParams = { 
      ...filters, 
      pageNumber: page 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: TourTypeFilterParams = {
      name: null,
      status: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "typeName",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters: TourTypeFilterParams = { 
      ...filters, 
      [key]: null, 
      pageNumber: 1 
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: TourTypeFilterParams = {
      ...filters,
      sortBy: "typeName",
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
    const updatedFilters: TourTypeFilterParams = {
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
  const handleImageClick = (type: TourTypeListItem, imageIndex: number) => {
    const images: ImageModalImage[] = (type.images || []).map(
      (img: TourTypeImage) => ({
        url: img.imageUrl,
        name: img.name,
        description: img.description || "",
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
      label: status === "ACTIVE" ? "Active" : status === "INACTIVE" ? "Inactive" : status,
    }));
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Type Name",
      type: "search",
      placeholder: "Search by type name...",
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
        value: filters.status === "ACTIVE" ? "Active" : "Inactive",
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (
      !filters.sortBy ||
      (filters.sortBy === "typeName" && filters.sortDirection === "ASC")
    )
      return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: filters.sortDirection || "ASC",
    };
  };

  const currentStart =
    displayedTypes.length > 0
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
        message="Loading tour types..."
        subMessage="Please wait while we fetch tour types"
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
            title="Tour Types View"
            description="Explore and manage tour types for different travel experiences"
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
            title="Filter Tour Types"
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
            title="Tour Types"
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
            message="Updating types..."
            subMessage="Please wait"
            size="lg"
          />
        )}

        {/* Types Grid/List */}
        {!loading && (
          <>
            {displayedTypes.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedTypes.map((type) => (
                      <TourTypeCard
                        key={type.typeId}
                        tourType={type}
                        onImageClick={(imageIndex) =>
                          handleImageClick(type, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {displayedTypes.map((type) => (
                      <TourTypeListCard
                        key={type.typeId}
                        tourType={type}
                        onImageClick={(imageIndex) =>
                          handleImageClick(type, imageIndex)
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
const ViewTourTypePage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <TourTypesViewContent />
    </Suspense>
  );
};

export default ViewTourTypePage;