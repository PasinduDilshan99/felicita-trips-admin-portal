// types/activity-types.ts

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

// Activity Interface
export interface Activity {
  id: number;
  name: string;
  description: string;
  season: string;
  status: "ACTIVE" | "INACTIVE" | string;
  schedules: Schedule[];
  requirements: Requirement[];
  images: ActivityImage[];
  destination_id: number;
  activities_category: ActivitiesCategory[];
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
  sortBy?: string; // Optional: "name", "ratings", "location", "destination_id", "created_at", "updated_at"
  sortDirection?: "ASC" | "DESC"; // Optional: "ASC" or "DESC"
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

export interface ApiResponse {
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

export interface ActivityImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ActivityRequirementRequest {
  name: string;
  value: string;
  description: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface AddActivityRequest {
  destinationId: number;
  name: string;
  description: string;
  activitiesCategory: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;
  status: "ACTIVE" | "INACTIVE";
  images: ActivityImageRequest[];
  requirements: ActivityRequirementRequest[];
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
  activitiesCategory: string;
  durationHours: number | null;
  availableFrom: string;
  availableTo: string;
  priceLocal: number | null;
  priceForeigners: number | null;
  minParticipate: number | null;
  maxParticipate: number | null;
  season: string;
  status: "ACTIVE" | "INACTIVE";
  images: ActivityImageRequest[];
  requirements: ActivityRequirementRequest[];
}

// Destination option for dropdown
export interface DestinationOption {
  destinationId: number;
  destinationName: string;
}

// Add these new types for update functionality

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

// Update Activity Types
export interface UpdateImageRequest {
  imageId?: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateRequirementRequest {
  requirementId?: number;
  name: string;
  value: string;
  description: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateActivityRequest {
  activityId: number;
  destinationId: number;
  name: string;
  description: string;
  activitiesCategory: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;
  status: "ACTIVE" | "INACTIVE";

  removeImagesIds: number[];
  addImages: UpdateImageRequest[];
  updatedImages: UpdateImageRequest[];

  removeRequirementsIds: number[];
  addRequirements: UpdateRequirementRequest[];
  updatedRequirements: UpdateRequirementRequest[];
}

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
