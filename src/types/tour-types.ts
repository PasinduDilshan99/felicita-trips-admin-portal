// types/tour-types.ts

// Schedule Interface
export interface Schedule {
  scheduleId: number;
  scheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  scheduleDescription: string;
}

// Image Interface
export interface TourImage {
  imageId: number;
  imageName: string;
  imageDescription: string;
  imageUrl: string;
}

// Tour Interface
export interface Tour {
  tourId: number;
  tourName: string;
  tourDescription: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  tourTypeName: string;
  tourTypeDescription: string;
  tourCategoryName: string;
  tourCategoryDescription: string;
  seasonName: string;
  seasonDescription: string;
  statusName: 'ACTIVE' | 'INACTIVE' | string;
  schedules: Schedule[];
  images: TourImage[];
}

// Filter Parameters
export interface TourFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  duration: number | null;
  tourType: string | null;
  tourCategory: string | null;
  season: string | null;
  location: string | null;
  pageNumber: number;
  pageSize: number;
}

// API Response Types
export interface TourResponse {
  totalTours: number;
  tourResponseDtoList: Tour[];
}

export interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: TourResponse;
  timestamp: string;
}

// Single Tour Response
export interface SingleTourResponse {
  tour: Tour;
  // Add other fields if needed
}

export interface SingleTourApiResponse {
  code: number;
  status: string;
  message: string;
  data: Tour;
  timestamp: string;
}

// For adding/updating tours
export interface TourImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ScheduleRequest {
  scheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  scheduleDescription: string;
  status: number;
}

export interface AddTourRequest {
  tourName: string;
  tourDescription: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  tourTypeName: string;
  tourCategoryName: string;
  seasonName: string;
  statusName: 'ACTIVE' | 'INACTIVE';
  images: TourImageRequest[];
  schedules: ScheduleRequest[];
}

export interface UpdateTourRequest {
  tourId: number;
  tourName: string;
  tourDescription: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  tourTypeName: string;
  tourCategoryName: string;
  seasonName: string;
  statusName: 'ACTIVE' | 'INACTIVE';
  removeImages: number[];
  newImages: TourImageRequest[];
  removeSchedules: number[];
  newSchedules: ScheduleRequest[];
}