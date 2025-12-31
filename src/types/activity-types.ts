// types/activity-types.ts

// Schedule Interface
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
  status: 'ACTIVE' | 'INACTIVE' | string;
  schedules: Schedule[];
  requirements: Requirement[];
  images: ActivityImage[];
  destination_id: number;
  activities_category: string;
  duration_hours: number;
  available_from: string;
  available_to: string;
  price_local: number;
  price_foreigners: number;
  min_participate: number;
  max_participate: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_description: string;
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

// For adding/updating activities
export interface ActivityImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ScheduleRequest {
  name: string;
  description: string;
  assume_start_date: string;
  assume_end_date: string;
  duration_hours_start: number;
  duration_hours_end: number;
  special_note: string;
  status: number;
}

export interface RequirementRequest {
  name: string;
  value: string;
  description: string;
  color: string;
  status: number;
}

export interface AddActivityRequest {
  name: string;
  description: string;
  season: string;
  status: 'ACTIVE' | 'INACTIVE';
  destination_id: number;
  activities_category: string;
  duration_hours: number;
  available_from: string;
  available_to: string;
  price_local: number;
  price_foreigners: number;
  min_participate: number;
  max_participate: number;
  images: ActivityImageRequest[];
  schedules: ScheduleRequest[];
  requirements: RequirementRequest[];
}

export interface UpdateActivityRequest {
  id: number;
  name: string;
  description: string;
  season: string;
  status: 'ACTIVE' | 'INACTIVE';
  destination_id: number;
  activities_category: string;
  duration_hours: number;
  available_from: string;
  available_to: string;
  price_local: number;
  price_foreigners: number;
  min_participate: number;
  max_participate: number;
  removeImages: number[];
  newImages: ActivityImageRequest[];
  removeSchedules: number[];
  newSchedules: ScheduleRequest[];
  removeRequirements: number[];
  newRequirements: RequirementRequest[];
}