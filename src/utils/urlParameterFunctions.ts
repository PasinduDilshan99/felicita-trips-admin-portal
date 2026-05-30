import { ActivityCategoryFilterParams } from "@/types/activity-category-types";
import { ActivityFilterParams } from "@/types/activity-types";
import { CategoryFilterParams } from "@/types/destination-category-types";
import { DestinationFilterParams } from "@/types/destination-types";
import { TourCategoryFilterParams } from "@/types/tour-category-types";
import { TourTypeFilterParams } from "@/types/tour-type-types";
import { TourFilterParams } from "@/types/tour-types";

export const destinationViewFiltersToUrlParams = (
  filters: DestinationFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.destinationCategory)
    params.set("destinationCategory", filters.destinationCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const destinationViewUrlParamsToFilters = (
  params: URLSearchParams,
): DestinationFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    destinationCategory: params.get("destinationCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const destinationCategoryFiltersToUrlParams = (
  filters: CategoryFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name); // Changed from searchTerm to name
  if (filters.categoryStatus)
    params.set("categoryStatus", filters.categoryStatus);
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const destinationCategoryUrlParamsToFilters = (
  params: URLSearchParams,
): CategoryFilterParams => {
  return {
    name: params.get("name") || null, // Changed from searchTerm to name
    categoryStatus:
      (params.get("categoryStatus") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const ActivityViewFiltersToUrlParams = (
  filters: ActivityFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.activityCategory)
    params.set("activityCategory", filters.activityCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.status) params.set("status", filters.status);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return params;
};

export const ActivityViewUrlParamsToFilters = (
  params: URLSearchParams,
): ActivityFilterParams => {
  return {
    name: params.get("name") || null,
    minPrice: null,
    maxPrice: null,
    duration: params.get("duration")
      ? parseFloat(params.get("duration")!)
      : null,
    activityCategory: params.get("activityCategory") || null,
    season: params.get("season") || null,
    status: (params.get("status") as "ACTIVE" | "INACTIVE" | null) || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || undefined,
    sortDirection: (params.get("sortDirection") as "ASC" | "DESC") || "ASC",
  };
};

export const activityCategoryViewFiltersToUrlParams = (
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

export const activityCategoryViewUrlParamsToFilters = (
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
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const tourViewFiltersToUrlParams = (
  filters: TourFilterParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.tourType) params.set("tourType", filters.tourType);
  if (filters.tourCategory) params.set("tourCategory", filters.tourCategory);
  if (filters.season) params.set("season", filters.season);
  if (filters.location) params.set("location", filters.location);
  if (filters.duration) params.set("duration", filters.duration.toString());
  if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
  if (filters.pageSize) params.set("pageSize", filters.pageSize.toString());
  if (filters.pageNumber && filters.pageNumber !== 1)
    params.set("pageNumber", filters.pageNumber.toString());

  return params;
};

export const tourViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourFilterParams => {
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
    tourType: params.get("tourType") || null,
    tourCategory: params.get("tourCategory") || null,
    season: params.get("season") || null,
    location: params.get("location") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
  };
};

export const tourCategoryViewFiltersToUrlParams = (
  filters: TourCategoryFilterParams,
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

export const tourCategoryViewUrlParamsToFilters = (
  params: URLSearchParams,
): TourCategoryFilterParams => {
  const sortDirection = params.get("sortDirection");
  return {
    name: params.get("name") || null,
    status: params.get("status") || null,
    pageSize: params.get("pageSize") ? parseInt(params.get("pageSize")!) : 6,
    pageNumber: params.get("pageNumber")
      ? parseInt(params.get("pageNumber")!)
      : 1,
    sortBy: params.get("sortBy") || "categoryName",
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};

export const tourTypeViewFiltersToUrlParams = (
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

export const tourTypeViewUrlParamsToFilters = (
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
    sortDirection: (sortDirection === "DESC" ? "DESC" : "ASC") as
      | "ASC"
      | "DESC",
  };
};
