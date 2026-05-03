// types/activity-types.ts - Updated types

import { ApiResponse } from "./common-types";

// Category Interface for Add/Update
export interface ActivityCategory {
  categoryId: number;
  isPrimary: boolean;
  status: "ACTIVE" | "INACTIVE";
}

// Update Category Interfaces
export interface AddCategoryRequest extends ActivityCategory {}
export interface UpdateCategoryRequest extends ActivityCategory {}

// Requirement Interface
export interface Requirement {
  id: number;
  name: string;
  value: string;
  description: string;
  color: string;
  status: number;
}

// Image Interface
export interface ActivityImage {
  id: number;
  name: string;
  description: string;
  status: number;
  image_url: string;
}

// Activity Interface (updated)
export interface Activity {
  id: number;
  name: string;
  destinationName: string;
  description: string;
  seasonId: number;
  seasonName?: string;
  status: "ACTIVE" | "INACTIVE" | string;
  schedules: Schedule[];
  requirements: Requirement[];
  images: ActivityImage[];
  destination_id: number;
  categories: ActivityCategoryDetail[];
  duration_hours: number;
  available_from: string;
  available_to: string;
  price_local: number;
  price_foreigners: number;
  min_participate: number;
  max_participate: number;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  name: string;
  description: string;
  status: number;
  assume_start_date: string;
  assume_end_date: string;
  duration_hours_start: number;
  duration_hours_end: number;
  special_note: string;
}

export interface ActivityCategoryDetail {
  id: number;
  name: string;
  description: string;
  is_primary: boolean;
}

export interface ActivitiesCategory {
  id: number;
  name: string;
  description: string;
  is_primary: boolean;
}

// Filter Parameters
export interface ActivityFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  duration: number | null;
  activityCategory: string | null;
  season: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface ActivityForTerminate {
  activityId: number;
  activityName: string;
}

export interface ActivitiesForTerminateResponse {
  code: number;
  status: string;
  message: string;
  data: ActivityForTerminate[];
  timestamp: string;
}

export interface TerminateActivityRequest {
  activityId: number;
}

export interface TerminateActivityResponse {
  message: string;
}

export interface TerminateActivityApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminateActivityResponse;
  timestamp: string;
}

// API Response Types
export interface ActivityResponse {
  activityCount: number;
  activityResponseDtos: Activity[];
}

export interface ActivityFilterApiResponse {
  code: number;
  status: string;
  message: string;
  data: ActivityResponse;
  timestamp: string;
}

// Single Activity Response
export interface SingleActivityResponse {
  activity: Activity;
}

export interface SingleActivityApiResponse {
  code: number;
  status: string;
  message: string;
  data: Activity;
  timestamp: string;
}

// Image Request (updated)
export interface ActivityImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Update Image Request
export interface UpdateImageRequest extends ActivityImageRequest {
  imageId?: number;
}

// Requirement Request (updated)
export interface ActivityRequirementRequest {
  name: string;
  value: string;
  description: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
}

// Update Requirement Request
export interface UpdateRequirementRequest extends ActivityRequirementRequest {
  requirementId?: number;
}

// Add Activity Request (updated with categories array)
export interface AddActivityRequest {
  destinationId: number;
  name: string;
  description: string;
  categories: ActivityCategory[];
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasonId: number;
  status: "ACTIVE" | "INACTIVE";
  images: ActivityImageRequest[];
  requirements: ActivityRequirementRequest[];
}

// Update Activity Request (updated with category operations)
export interface UpdateActivityRequest {
  activityId: number;
  destinationId: number;
  name: string;
  description: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasonId: number;
  status: "ACTIVE" | "INACTIVE";
  
  // Category operations
  removeCategoryIds: number[];
  addCategories: AddCategoryRequest[];
  updatedCategories: UpdateCategoryRequest[];
  
  // Image operations
  removeImagesIds: number[];
  addImages: UpdateImageRequest[];
  updatedImages: UpdateImageRequest[];
  
  // Requirement operations
  removeRequirementsIds: number[];
  addRequirements: UpdateRequirementRequest[];
  updatedRequirements: UpdateRequirementRequest[];
}

export interface AddActivityResponse {
  message: string;
}

export interface AddActivityApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddActivityResponse;
  timestamp: string;
}

export interface AddActivityFormData {
  destinationId: number | null;
  name: string;
  description: string;
  categories: ActivityCategory[];
  durationHours: number | null;
  availableFrom: string;
  availableTo: string;
  priceLocal: number | null;
  priceForeigners: number | null;
  minParticipate: number | null;
  maxParticipate: number | null;
  seasonId: number | null;
  status: "ACTIVE" | "INACTIVE";
  images: ActivityImageRequest[];
  requirements: ActivityRequirementRequest[];
}

// Destination option for dropdown
export interface DestinationOption {
  destinationId: number;
  destinationName: string;
}

// Season option
export interface SeasonOption {
  id: number;
  name: string;
}

// Activity ID and Name for dropdown
export interface ActivityIdName {
  activityId: number;
  activityName: string;
}

export interface ActivityIdNameResponse {
  code: number;
  status: string;
  message: string;
  data: ActivityIdName[];
  timestamp: string;
}

// Update Activity Response
export interface UpdateActivityResponse {
  message: string;
  id: number;
}

export interface UpdateActivityApiResponse {
  code: number;
  status: string;
  message: string;
  data: UpdateActivityResponse;
  timestamp: string;
}

// Statistics Types (unchanged)
export interface ActivityDetails {
  totalActivitiesCount: number;
  activeActivities: number;
  inActiveActivities: number;
  hiddenActivities: number;
  recentlyUpdateActivities: number;
  recentlyAddedActivities: number;
}

export interface ActivityWishDetails {
  wishListCount: number;
  notWishListCount: number;
}

export interface ActivityCategoryDetail {
  categoryId: number;
  categoryName: string;
  count: number;
}

export interface ActivityStatisticsData {
  activityDetails: ActivityDetails;
  wishDetails: ActivityWishDetails;
  categoryDetails: ActivityCategoryDetail[];
}

export interface ActivityStatisticsApiResponse {
  code: number;
  status: string;
  message: string;
  data: ActivityStatisticsData;
  timestamp: string;
}

// Activity Schedule Statistics Types (unchanged)
export interface ParticipationTrend {
  activityDate: string;
  totalParticipants: number;
}

export interface PopularActivity {
  activityId: number;
  activityName: string;
  totalParticipants: number;
}

export interface ActivityRating {
  activityId: number;
  activityName: string;
  averageRating: number;
  totalReviews: number;
}

export interface ScheduleTimeline {
  scheduleId: number;
  scheduleName: string;
  activityName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationHoursStart: number;
  durationHoursEnd: number;
  specialNote: string;
  status: number;
}

export interface StatusDistribution {
  statusName: string;
  totalCount: number;
}

export interface ActivityScheduleSummary {
  totalActivities: number;
  totalActiveSchedules: number;
  totalParticipants: number;
  overallAverageRating: number;
}

export interface ActivityScheduleStatisticsData {
  participationTrends: ParticipationTrend[];
  popularActivities: PopularActivity[];
  activityRatings: ActivityRating[];
  scheduleTimelines: ScheduleTimeline[];
  statusDistributions: StatusDistribution[];
  summary: ActivityScheduleSummary;
}

export type ActivityScheduleStatisticsApiResponse = ApiResponse<ActivityScheduleStatisticsData>;

export interface CategoryActivityCount {
  categoryId: number;
  categoryName: string;
  totalActivities: number;
}

export interface CategoryParticipationPerformance {
  categoryId: number;
  categoryName: string;
  totalParticipants: number;
}

export interface CategoryRatingOverview {
  categoryId: number;
  categoryName: string;
  averageRating: number;
  totalReviews: number;
}

export interface CategoryDistribution {
  categoryName: string;
  activityCount: number;
}

export interface CategoryPrimarySecondaryUsage {
  categoryName: string;
  primaryCount: number;
  secondaryCount: number;
}

export interface ActivityCategoriesSummary {
  totalCategories: number;
  totalActivities: number;
  mostUsedCategory: string;
  overallAverageRating: number;
}

export interface ActivityCategoriesStatisticsData {
  categoryActivityCounts: CategoryActivityCount[];
  categoryParticipationPerformances: CategoryParticipationPerformance[];
  categoryRatingOverviews: CategoryRatingOverview[];
  categoryDistributions: CategoryDistribution[];
  categoryPrimarySecondaryUsages: CategoryPrimarySecondaryUsage[];
  summary: ActivityCategoriesSummary;
}

export type ActivityCategoriesStatisticsApiResponse = ApiResponse<ActivityCategoriesStatisticsData>;

// Add these to your existing types/activity-types.ts file

// Activity by Destination Response Types
export interface ActivityCategoryDetail {
  categoryId: number;
  categoryName: string;
  isPrimary: boolean;
}

export interface ActivityImageDetail {
  imageId: number;
  name: string;
  description: string | null;
  imageUrl: string;
}

export interface ActivityByDestination {
  activityId: number;
  destinationId: number;
  name: string;
  description: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;
  seasonId: number;
  statusId: number;
  categories: ActivityCategoryDetail[];
  images: ActivityImageDetail[];
}

export type ActivitiesByDestinationResponse = ApiResponse<ActivityByDestination[]>;

// Request type
export interface GetActivitiesByDestinationRequest {
  destinationId: number;
}