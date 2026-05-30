"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ImageModal from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { TourService } from "@/services/tourService";
import { TourFilterParams, Tour, TourRequestParams } from "@/types/tour-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import { EmptyState } from "@/components/common-components/EmptyState";
import CommonLoading from "@/components/common-components/CommonLoading";
import TourCard from "@/components/tours-components/tour-view-components/TourCard";
import TourListCard from "@/components/tours-components/tour-view-components/TourListCard";
import {
  tourViewFiltersToUrlParams,
  tourViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { ImageModalImage } from "@/types/common-components-types";
import { TOUR_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { FilterField } from "@/types/filter-types";
import { TOURS_VIEW_PAGE_URL } from "@/utils/urls";

const ToursViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCommon();
  const { theme } = useTheme();

  const [requestParams, setRequestParams] = useState<TourRequestParams | null>(
    null,
  );
  const [requestParamsLoading, setRequestParamsLoading] = useState(true);

  const [filters, setFilters] = useState<TourFilterParams>(() =>
    tourViewUrlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [tours, setTours] = useState<Tour[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableDurations, setAvailableDurations] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<ImageModalImage[]>([]);

  useEffect(() => {
    const fetchRequestParams = async () => {
      try {
        setRequestParamsLoading(true);
        const response = await TourService.getTourRequestParams();
        if (response.code === 200 && response.data) {
          setRequestParams(response.data);
          setAvailableDurations(response.data.durations || []);
          setAvailableLocations(response.data.locations || []);
          setPriceRange({
            min: response.data.minPrice || 0,
            max: response.data.maxPrice || 10000,
          });
        }
      } catch (error) {
        console.error("Error fetching tour request params:", error);
      } finally {
        setRequestParamsLoading(false);
      }
    };

    fetchRequestParams();
  }, []);

  // Get tour categories from CommonContext
  const getTourCategories = useCallback((): {
    value: string;
    label: string;
  }[] => {
    if (categories && categories.tourCategoryList) {
      return categories.tourCategoryList.map((cat) => ({
        value: cat.tourCategoryName,
        label: cat.tourCategoryName,
      }));
    }
    return [];
  }, [categories]);

  // Get tour types from CommonContext
  const getTourTypes = useCallback((): { value: string; label: string }[] => {
    if (categories && categories.tourTypeList) {
      return categories.tourTypeList.map((type) => ({
        value: type.tourTypeName,
        label: type.tourTypeName,
      }));
    }
    return [];
  }, [categories]);

  // Get seasons from CommonContext
  const getSeasons = useCallback((): { value: string; label: string }[] => {
    if (categories && categories.seasonsList) {
      return categories.seasonsList.map((season) => ({
        value: season.seasonName,
        label: season.seasonName,
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
      label: "Tour Name",
      type: "search",
      placeholder: "Search by tour name...",
      width: "full",
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
      key: "tourType",
      label: "Tour Type",
      type: "select",
      options: getTourTypes(),
      width: "quarter",
    },
    {
      key: "tourCategory",
      label: "Category",
      type: "select",
      options: getTourCategories(),
      width: "quarter",
    },
    {
      key: "season",
      label: "Season",
      type: "select",
      options: getSeasons(),
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
  ];

  const updateURL = useCallback(
    (newFilters: TourFilterParams) => {
      const params = tourViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${TOURS_VIEW_PAGE_URL}?${queryString}`
        : TOURS_VIEW_PAGE_URL;

      router.replace(newURL, { scroll: false });
    },
    [router],
  );

  const fetchTours = useCallback(async (currentFilters: TourFilterParams) => {
    setLoading(true);
    try {
      const response = await TourService.getTours(currentFilters);

      if (response.code === 200 && response.data) {
        setTours(response.data.tourResponseDtoList || []);
        setTotalItems(response.data.totalTours || 0);
      } else {
        setTours([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      setTours([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    const initialFilters = tourViewUrlParamsToFilters(
      searchParams || new URLSearchParams(),
    );
    setFilters(initialFilters);
    fetchTours(initialFilters);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const urlFilters = tourViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
      fetchTours(urlFilters);
    }
  }, [searchParams, isInitialLoad, fetchTours]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchTours(updatedFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const updatedFilters = { ...filters, pageSize: newPageSize, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchTours(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, pageNumber: page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchTours(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: TourFilterParams = {
      name: null,
      minPrice: null,
      maxPrice: null,
      duration: null,
      tourType: null,
      tourCategory: null,
      season: null,
      location: null,
      pageSize: 6,
      pageNumber: 1,
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
    fetchTours(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters = { ...filters, [key]: null, pageNumber: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
    fetchTours(updatedFilters);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handleImageClick = (tour: Tour, imageIndex: number) => {
    const images: ImageModalImage[] = (tour.images || []).map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
    setModalImages(images);
    setSelectedImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.tourType) {
      activeFilters.push({
        key: "tourType",
        label: "Tour Type",
        value: filters.tourType,
      });
    }
    if (filters.tourCategory) {
      activeFilters.push({
        key: "tourCategory",
        label: "Category",
        value: filters.tourCategory,
      });
    }
    if (filters.season) {
      activeFilters.push({
        key: "season",
        label: "Season",
        value: filters.season,
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

    return activeFilters;
  };

  const currentStart =
    tours.length > 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    duration: filters.duration,
    tourType: filters.tourType,
    tourCategory: filters.tourCategory,
    season: filters.season,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };

  if (categoriesLoading || requestParamsLoading) {
    return (
      <CommonLoading
        message="Loading tour data..."
        subMessage="Please wait while we fetch available tours and filters"
        size="md"
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Tours View"
            description="Explore and manage tour packages and experiences"
            breadcrumbItems={TOUR_VIEW_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            title="Filter Tours"
            searchButtonText="Search"
            resetButtonText="Reset"
            showActiveFilters={false}
            collapsible={true}
            isLoading={loading}
          />
        </div>

        <ActiveFilters
          filters={getActiveFilters()}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleReset}
          title="Active Filters"
          showClearAll={true}
          variant="default"
        />

        <div className="mb-6">
          <ResultsHeader
            title="Tours"
            currentStart={currentStart}
            currentEnd={currentEnd}
            totalItems={totalItems}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
          />
        </div>

        {loading && (
          <CommonLoading
            message="Loading tours..."
            subMessage="Fetching amazing tour packages"
            size="lg"
          />
        )}

        {!loading && (
          <>
            {tours.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {tours.map((tour) => (
                      <TourCard
                        key={tour.tourId}
                        tour={tour}
                        onImageClick={(imageIndex) =>
                          handleImageClick(tour, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {tours.map((tour) => (
                      <TourListCard
                        key={tour.tourId}
                        tour={tour}
                        onImageClick={(imageIndex) =>
                          handleImageClick(tour, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

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

const ToursViewPage = () => {
  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <ToursViewContent />
    </Suspense>
  );
};

export default ToursViewPage;
