"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterPanel from "@/components/common-components/FilterPanel";
import Pagination from "@/components/common-components/Pagination";
import ImageModal from "@/components/common-components/ImageModal";
import ActiveFilters from "@/components/common-components/ActiveFilters";
import { SeasonService } from "@/services/seasonService";
import {
  SeasonBasicDetail,
  SeasonFilterParams,
  SeasonImage,
} from "@/types/season-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ResultsHeader } from "@/components/common-components/ResultsHeader";
import CommonLoading from "@/components/common-components/CommonLoading";
import { SEASONS_VIEW_PAGE_URL } from "@/utils/urls";
import {
  seasonsViewFiltersToUrlParams,
  seasonsViewUrlParamsToFilters,
} from "@/utils/urlParameterFunctions";
import { ImageModalImage } from "@/types/common-components-types";
import { FilterField } from "@/types/filter-types";
import { SEASONS_VIEW_SORTING_OPTIONS } from "@/data/sorting-options";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { SEASON_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { EmptyState } from "@/components/common-components/EmptyState";
import SeasonCard from "@/components/season-components/view-season-components/SeasonCard";
import SeasonListCard from "@/components/season-components/view-season-components/SeasonListCard";

const SeasonsViewContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [filters, setFilters] = useState<SeasonFilterParams>(() =>
    seasonsViewUrlParamsToFilters(searchParams || new URLSearchParams()),
  );

  const [allSeasons, setAllSeasons] = useState<SeasonBasicDetail[]>([]);
  const [filteredSeasons, setFilteredSeasons] = useState<SeasonBasicDetail[]>(
    [],
  );
  const [displayedSeasons, setDisplayedSeasons] = useState<SeasonBasicDetail[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState<ImageModalImage[]>([]);

  // Fetch all seasons
  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SeasonService.getSeasonsBasicDetails();

      if (response.code === 200 && response.data) {
        setAllSeasons(response.data);
        return response.data;
      } else {
        setAllSeasons([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setAllSeasons([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort seasons based on filters
  const filterAndSortSeasons = useCallback(
    (seasons: SeasonBasicDetail[], currentFilters: SeasonFilterParams) => {
      let result = [...seasons];

      // Apply name filter
      if (currentFilters.name) {
        const searchTerm = currentFilters.name.toLowerCase();
        result = result.filter(
          (season) =>
            season.name.toLowerCase().includes(searchTerm) ||
            season.standardName.toLowerCase().includes(searchTerm) ||
            season.localName.toLowerCase().includes(searchTerm),
        );
      }

      // Apply isPeak filter
      if (currentFilters.isPeak !== null) {
        result = result.filter(
          (season) => season.isPeak === currentFilters.isPeak,
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (currentFilters.sortBy) {
          case "name":
            aVal = a.name;
            bVal = b.name;
            break;
          case "standardName":
            aVal = a.standardName;
            bVal = b.standardName;
            break;
          case "localName":
            aVal = a.localName;
            bVal = b.localName;
            break;
          case "startMonth":
            aVal = a.startMonth;
            bVal = b.startMonth;
            break;
          case "endMonth":
            aVal = a.endMonth;
            bVal = b.endMonth;
            break;
          case "displayOrder":
            aVal = a.displayOrder;
            bVal = b.displayOrder;
            break;
          case "isPeak":
            aVal = a.isPeak ? 1 : 0;
            bVal = b.isPeak ? 1 : 0;
            break;
          default:
            aVal = a.displayOrder;
            bVal = b.displayOrder;
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

  // Update filtered and displayed seasons when data or filters change
  useEffect(() => {
    if (allSeasons.length > 0) {
      const filtered = filterAndSortSeasons(allSeasons, filters);
      setFilteredSeasons(filtered);
      setTotalItems(filtered.length);

      // Apply pagination
      const start = (filters.pageNumber - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      setDisplayedSeasons(filtered.slice(start, end));
    }
  }, [allSeasons, filters, filterAndSortSeasons]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchSeasons();
      setIsInitialLoad(false);
    };

    loadData();
  }, [fetchSeasons]);

  // Apply URL filters after data is loaded and when searchParams change
  useEffect(() => {
    if (!isInitialLoad && allSeasons.length > 0) {
      const urlFilters = seasonsViewUrlParamsToFilters(
        searchParams || new URLSearchParams(),
      );
      setFilters(urlFilters);
    }
  }, [searchParams, isInitialLoad, allSeasons.length]);

  const updateURL = useCallback(
    (newFilters: SeasonFilterParams) => {
      const params = seasonsViewFiltersToUrlParams(newFilters);
      const queryString = params.toString();
      const newURL = queryString
        ? `${SEASONS_VIEW_PAGE_URL}?${queryString}`
        : SEASONS_VIEW_PAGE_URL;

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
    const updatedFilters: SeasonFilterParams = {
      ...filters,
      pageSize: newPageSize,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters: SeasonFilterParams = {
      ...filters,
      pageNumber: page,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: SeasonFilterParams = {
      name: null,
      isPeak: null,
      pageSize: 6,
      pageNumber: 1,
      sortBy: "displayOrder",
      sortDirection: "ASC",
    };
    setFilters(resetFilters);
    updateURL(resetFilters);
  };

  const handleRemoveFilter = (key: string) => {
    const updatedFilters: SeasonFilterParams = {
      ...filters,
      [key]: null,
      pageNumber: 1,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleRemoveSort = () => {
    const updatedFilters: SeasonFilterParams = {
      ...filters,
      sortBy: "displayOrder",
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
    const updatedFilters: SeasonFilterParams = {
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
  const handleImageClick = (season: SeasonBasicDetail, imageIndex: number) => {
    const images: ImageModalImage[] = (season.seasonImages || []).map(
      (img: SeasonImage) => ({
        url: img.imageUrl,
        name: img.name,
        description: img.description || "",
        id: img.id,
      }),
    );
    setModalImages(images);
    setSelectedImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Season Name",
      type: "search",
      placeholder: "Search by season name, standard name, or local name...",
      width: "full",
    },
    {
      key: "isPeak",
      label: "Peak Season",
      type: "boolean",
      width: "third",
    },
  ];

  // Get sort label
  const getSortLabel = (sortBy: string): string => {
    const option = SEASONS_VIEW_SORTING_OPTIONS.find(
      (opt) => opt.value === sortBy,
    );
    return option ? option.label : sortBy;
  };

  // Prepare active filters for display
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> =
      [];

    if (filters.name) {
      activeFilters.push({ key: "name", label: "Name", value: filters.name });
    }
    if (filters.isPeak !== null) {
      activeFilters.push({
        key: "isPeak",
        label: "Peak Season",
        value: filters.isPeak ? "Yes" : "No",
      });
    }

    return activeFilters;
  };

  // Prepare sort filter for display
  const getSortFilter = () => {
    if (
      !filters.sortBy ||
      (filters.sortBy === "displayOrder" && filters.sortDirection === "ASC")
    )
      return null;
    return {
      sortBy: filters.sortBy,
      sortLabel: getSortLabel(filters.sortBy),
      sortDirection: filters.sortDirection || "ASC",
    };
  };

  const currentStart =
    displayedSeasons.length > 0
      ? (filters.pageNumber - 1) * filters.pageSize + 1
      : 0;
  const currentEnd = Math.min(
    filters.pageNumber * filters.pageSize,
    totalItems,
  );

  // Convert filters object for FilterPanel
  const filterPanelFilters: Record<string, any> = {
    name: filters.name,
    isPeak: filters.isPeak,
  };

  if (loading && isInitialLoad) {
    return (
      <CommonLoading
        message="Loading seasons..."
        subMessage="Please wait while we fetch seasons data"
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
            title="Seasons View"
            description="Explore and manage travel seasons for activities, tours, and packages"
            breadcrumbItems={SEASON_VIEW_PAGE_BREADCRUMB_DATA}
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
            sortOptions={SEASONS_VIEW_SORTING_OPTIONS}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            title="Filter Seasons"
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
            title="Seasons"
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
            message="Updating seasons..."
            subMessage="Please wait"
            size="lg"
          />
        )}

        {/* Seasons Grid/List */}
        {!loading && (
          <>
            {displayedSeasons.length === 0 ? (
              <EmptyState onClearFilters={handleReset} />
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedSeasons.map((season) => (
                      <SeasonCard
                        key={season.id}
                        season={season}
                        onImageClick={(imageIndex) =>
                          handleImageClick(season, imageIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-6 mb-8">
                    {displayedSeasons.map((season) => (
                      <SeasonListCard
                        key={season.id}
                        season={season}
                        onImageClick={(imageIndex) =>
                          handleImageClick(season, imageIndex)
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

const SeasonViewPage = () => {
  return (
    <Suspense
      fallback={
        <CommonLoading message="Loading..." size="lg" fullScreen={false} />
      }
    >
      <SeasonsViewContent />
    </Suspense>
  );
};

export default SeasonViewPage;
