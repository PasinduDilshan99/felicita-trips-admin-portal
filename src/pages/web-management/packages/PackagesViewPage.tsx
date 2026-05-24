// app/packages/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel, {
  FilterField,
} from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { PackageService } from "@/services/packageService";
import {
  PackageFilterParams,
  TourPackage,
  PackageRequestParams,
} from "@/types/package-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/destinations-components/view-destinations-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  PACKAGES_PAGE_URL,
  PACKAGES_VIEW_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";
import PackageCard from "@/components/packages-components/view-package-components/PackageCard";
import PackageListCard from "@/components/packages-components/view-package-components/PackageListCard";

// Sort options for packages
const SORT_OPTIONS = [
  { value: "packageName", label: "Package Name" },
  { value: "packageId", label: "Package ID" },
  { value: "totalPrice", label: "Total Price" },
  { value: "pricePerPerson", label: "Price Per Person" },
  { value: "duration", label: "Duration" },
  { value: "startDate", label: "Start Date" },
  { value: "endDate", label: "End Date" },
  { value: "createdAt", label: "Created Date" },
];

// Utility functions for URL params management
const filtersToUrlParams = (filters: PackageFilterParams): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.packageType) params.set("packageType", filters.packageType);
  if (filters.location) params.set("location", filters.location);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.minGroupSize)
    params.set("minGroupSize", filters.minGroupSize.toString());
  if (filters.maxGroupSize)
    params.set("maxGroupSize", filters.maxGroupSize.toString());
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());

  return params;
};

const urlParamsToFilters = (params: URLSearchParams): PackageFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: params.get("minPrice")
      ? parseFloat(params.get("minPrice")!)
      : null,
    maxPrice: params.get("maxPrice")
      ? parseFloat(params.get("maxPrice")!)
      : null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    packageType: params.get("packageType") || null,
    location: params.get("location") || null,
    minGroupSize: params.get("minGroupSize")
      ? parseInt(params.get("minGroupSize")!)
      : null,
    maxGroupSize: params.get("maxGroupSize")
      ? parseInt(params.get("maxGroupSize")!)
      : null,
    fromDate: params.get("fromDate") || null,
    toDate: params.get("toDate") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
  };
};

// Main component wrapped with Suspense for useSearchParams
const PackagesViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  // State for filter request params
  const [requestParams, setRequestParams] =
    useState<PackageRequestParams | null>(null);
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Packages", href: PACKAGES_PAGE_URL },
    { label: "View", href: PACKAGES_VIEW_PAGE_URL },
  ];

  const [filters, setFilters] = useState<PackageFilterParams>(() =>
    urlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableDurations, setAvailableDurations] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [groupSizeRange, setGroupSizeRange] = useState<{
    min: number;
    max: number;
  }>({ min: 1, max: 50 });
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
        const response = await PackageService.getPackageRequestParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
          setAvailableDurations(response.data.durations || []);
          setAvailableLocations(response.data.locations || []);
          setPriceRange({
            min: response.data.minPrice || 0,
            max: response.data.maxPrice || 10000,
          });
          setGroupSizeRange({
            min: response.data.minGroupSize || 1,
            max: response.data.maxGroupSize || 50,
          });
        }
      } catch (error) {
        console.error("Error fetching package request params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get package types from CommonContext
  const getPackageTypes = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (categories && categories.packageCategoryList) {
      return categories.packageCategoryList.map((pkg) => ({
        value: pkg.packageCategoryName,
        label: pkg.packageCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // Get locations from API response
  const getLocations = useCallback((): { value: string; label: string }[] => {
    return availableLocations.map((location) => ({
      value: location,
      label: location,
    }));
  }, [availableLocations]);

  // Get duration options
  const getDurationOptions = useCallback((): {
    value: string;
    label: string;
  }[] => {
    return availableDurations.map((duration) => ({
      value: duration.toString(),
      label: `${duration} days`,
    }));
  }, [availableDurations]);

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Package Name",
      type: "search",
      placeholder: "Search by package name...",
      width: "full",
    },
    {
      key: "packageType",
      label: "Package Type",
      type: "select",
      options: getPackageTypes(),
      width: "quarter",
    },
    {
      key: "duration",
      label: "Duration (days)",
      type: "select",
      options: getDurationOptions(),
      placeholder: "Select duration",
      width: "quarter",
    },
    {
      key: "location",
      label: "Location",
      type: "select",
      options: getLocations(),
      width: "quarter",
    },
    {
      key: "minPrice",
      label: "Min Price",
      type: "number",
      placeholder: "Minimum price",
      min: priceRange.min,
      max: priceRange.max,
      step: 100,
      width: "quarter",
    },
    {
      key: "maxPrice",
      label: "Max Price",
      type: "number",
      placeholder: "Maximum price",
      min: priceRange.min,
      max: priceRange.max,
      step: 100,
      width: "quarter",
    },
    {
      key: "minGroupSize",
      label: "Min Group Size",
      type: "number",
      placeholder: "Minimum group size",
      min: groupSizeRange.min,
      max: groupSizeRange.max,
      step: 1,
      width: "quarter",
    },
    {
      key: "maxGroupSize",
      label: "Max Group Size",
      type: "number",
      placeholder: "Maximum group size",
      min: groupSizeRange.min,
      max: groupSizeRange.max,
      step: 1,
      width: "quarter",
    },
    {
      key: "fromDate",
      label: "From Date",
      type: "date",
      placeholder: "Start date",
      width: "quarter",
    },
    {
      key: "toDate",
      label: "To Date",
      type: "date",
      placeholder: "End date",
      width: "quarter",
    },
  ];

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: PackageFilterParams) => {
      const params = filtersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view?${queryString}`
        : `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchPackages = useCallback(
    async (currentFilters: PackageFilterParams) => {
      setLoading(true);
      try {
        const response = await PackageService.getPackages(currentFilters);

        if (response.code === 200 && response.data) {
          setPackages(response.data.packageResponseDtos || []);
          setTotalItems(response.data.packageCount || 0);
        } else {
          setPackages([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setPackages([]);
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
    fetchPackages(initialFilters);
  }, []);

  // Watch for URL params changes and fetch data (for browser back/forward)
  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = urlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchPackages(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchPackages]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPackages(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPackages(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPackages(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: PackageFilterParams = {
      name: null,
      minPrice: null,
      maxPrice: null,
      duration: null,
      packageType: null,
      location: null,
      minGroupSize: null,
      maxGroupSize: null,
      fromDate: null,
      toDate: null,
      pageSize: 6,
      pageNumber: 1,
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchPackages(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchPackages(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Handle image click for modal
  const handleImageClick = (pkg: TourPackage, imageIndex: number) => {
    const images: ImageModalImage[] = (pkg.images || []).map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
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
    if (filters.packageType) {
      activeFilters.push({
        key: "packageType",
        label: "Package Type",
        value: filters.packageType,
      });
    }
    if (filters.location) {
      activeFilters.push({
        key: "location",
        label: "Location",
        value: filters.location,
      });
    }
    if (filters.duration) {
      activeFilters.push({
        key: "duration",
        label: "Duration",
        value: `${filters.duration} days`,
      });
    }
    if (filters.minPrice && filters.maxPrice) {
      activeFilters.push({
        key: "price",
        label: "Price Range",
        value: `$${filters.minPrice} - $${filters.maxPrice}`,
      });
    } else if (filters.minPrice) {
      activeFilters.push({
        key: "minPrice",
        label: "Min Price",
        value: `$${filters.minPrice}`,
      });
    } else if (filters.maxPrice) {
      activeFilters.push({
        key: "maxPrice",
        label: "Max Price",
        value: `$${filters.maxPrice}`,
      });
    }
    if (filters.minGroupSize && filters.maxGroupSize) {
      activeFilters.push({
        key: "groupSize",
        label: "Group Size",
        value: `${filters.minGroupSize} - ${filters.maxGroupSize} people`,
      });
    } else if (filters.minGroupSize) {
      activeFilters.push({
        key: "minGroupSize",
        label: "Min Group Size",
        value: `${filters.minGroupSize} people`,
      });
    } else if (filters.maxGroupSize) {
      activeFilters.push({
        key: "maxGroupSize",
        label: "Max Group Size",
        value: `${filters.maxGroupSize} people`,
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

  const currentStart =
    packages.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    packageType: filters.packageType,
    duration: filters.duration,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minGroupSize: filters.minGroupSize,
    maxGroupSize: filters.maxGroupSize,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  };

  if (categoriesLoading || requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading package data..."
        subMessage="Please wait while we fetch available packages and filters"
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
            title="Packages View"
            description="Explore and manage tour packages and special offers"
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
            pageSize={filters.pageSize}
            pageSizeOptions={[6, 9, 12, 24, 48]}
            showPageSize={true}
            showSorting={false}
            title="Filter Packages"
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
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleReset}
          title="Active Filters"
          showClearAll={true}
          variant="default"
        />

        {/* Results Header with View Toggle */}
        <div className="mb-6">
          <ResultsHeader
            title="Packages"
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
            message="Loading packages..."
            subMessage="Fetching amazing package deals"
            size="lg"
          />
        )}

        {/* Packages Grid/List */}
        {!loading && (
          <>
            {packages.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {packages.map((pkg) => (
                      <PackageCard
                        key={pkg.packageId}
                        packageData={pkg}
                        onImageClick={(imageIndex) =>
                          handleImageClick(pkg, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {packages.map((pkg) => (
                      <PackageListCard
                        key={pkg.packageId}
                        packageData={pkg}
                        onImageClick={(imageIndex) =>
                          handleImageClick(pkg, imageIndex)
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
const PackagesViewPage = () => {
  const { theme } = useTheme();

  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <PackagesViewContent />
    </Suspense>
  );
};

export default PackagesViewPage;
