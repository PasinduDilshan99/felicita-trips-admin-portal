// types/tour-schedule-types.ts

import { ApiResponse } from "./common-types";
import { Tour } from "./tour-types";

// Basic Types
export interface TourScheduleCategory {
  categoryId: number;
  categoryName: string;
  description?: string;
  primaryCategory?: boolean;
  status?: string;
}

export interface TourScheduleType {
  typeId: number;
  typeName: string;
  description?: string;
  primaryType?: boolean;
  status?: string;
}

export interface TourScheduleImage {
  imageId: number;
  name: string;
  description: string | null;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export interface TourScheduleAccommodation {
  accommodationId: number;
  day: number;
  breakfast: boolean;
  breakfastDescription: string | null;
  lunch: boolean;
  lunchDescription: string | null;
  dinner: boolean;
  dinnerDescription: string | null;
  morningTea: boolean;
  morningTeaDescription: string | null;
  eveningTea: boolean;
  eveningTeaDescription: string | null;
  snacks: boolean;
  snackNote: string | null;
  hotelId: number;
  hotelName: string | null;
  transportId: number;
  transportName: string | null;
  otherNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Tour Schedule List Item
export interface TourScheduleListItem {
  tourScheduleId: number;
  tourScheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  description: string;
  scheduleStatus: string;
  createdAt: string;
  updatedAt: string;
  tourId: number;
  tourName: string;
  tourDuration: number;
  startLocation: string;
  endLocation: string;
  season: string;
  tourStatus: string;
  categories: TourScheduleCategory[];
  types: TourScheduleType[];
}

// Tour Schedule Response
export interface TourScheduleResponse {
  tourScheduleCount: number;
  tourScheduleResponses: TourScheduleListItem[];
}

export type TourScheduleListApiResponse = ApiResponse<TourScheduleResponse>;

// Filter Parameters
export interface TourScheduleFilterParams {
  name: string | null;
  duration: number | null;
  tourId: number | null;
  tourTypeId: number | null;
  tourCategoryId: number | null;
  fromDate: string | null;
  toDate: string | null;
  seasonId: number | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

// Tour Schedule Params Response
export interface DurationOption {
  duration: string;
}

export interface TourIdAndName {
  tourId: number;
  tourName: string;
}

export interface SeasonIdAndName {
  seasonId: number;
  seasonName: string;
}

export interface SortByOption {
  sortByDisplayName: string;
  sortBy: string;
}

export interface TourScheduleParamsData {
  durations: string[];
  tourIdAndNameResponses: TourIdAndName[];
  seasonIdAndNameResponses: SeasonIdAndName[];
  sortByResponses: SortByOption[];
}

export type TourScheduleParamsApiResponse = ApiResponse<TourScheduleParamsData>;

// Tour Schedule Details
export interface TourScheduleDetails {
  tourScheduleId: number;
  tourScheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  description: string;
  scheduleStatus: string;
  createdAt: string;
  updatedAt: string;
  tourId: number;
  tourName: string;
  tourDescription: string;
  tourDuration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  seasonId: number;
  season: string | null;
  tourStatus: string;
  assignMessage: string;
  tourCreatedAt: string;
  tourUpdatedAt: string;
  categories: TourScheduleCategory[];
  types: TourScheduleType[];
  images: TourScheduleImage[];
  accommodations: TourScheduleAccommodation[];
}

export type TourScheduleDetailsApiResponse = ApiResponse<TourScheduleDetails>;

// Create Tour Schedule Request
export interface CreateTourScheduleRequest {
  tourScheduleName: string;
  tourId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationHoursStart: number;
  durationHoursEnd: number;
  specialNotes: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateTourScheduleResponse {
  message: string;
}

export type CreateTourScheduleApiResponse =
  ApiResponse<CreateTourScheduleResponse>;

// Update Tour Schedule Request
export interface UpdateTourScheduleRequest {
  tourScheduleId: number;
  tourScheduleName: string;
  tourId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationHoursStart: number;
  durationHoursEnd: number;
  specialNotes: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTourScheduleResponse {
  message: string | null;
  id: number | null;
}

export type UpdateTourScheduleApiResponse =
  ApiResponse<UpdateTourScheduleResponse>;

// Terminate Tour Schedule Request
export interface TerminateTourScheduleRequest {
  id: number;
}

export interface TerminateTourScheduleResponse {
  message: string;
}

export type TerminateTourScheduleApiResponse =
  ApiResponse<TerminateTourScheduleResponse>;

// Get Tour Schedule Details Request
export interface GetTourScheduleDetailsRequest {
  id: number;
}

// Add these to your existing types/tour-schedule-types.ts file

// Tour Schedule ID and Name Response
export interface TourScheduleIdAndName {
  tourScheduleId: number;
  tourScheduleName: string;
}

export type TourScheduleIdAndNamesApiResponse = ApiResponse<
  TourScheduleIdAndName[]
>;

export interface TourScheduleCardProps {
  schedule: TourScheduleListItem;
}

export interface TourScheduleListCardProps {
  schedule: TourScheduleListItem;
}

export interface TourScheduleAccommodationsProps {
  accommodations: TourScheduleAccommodation[];
}

export interface TourScheduleCategoriesTypesProps {
  categories: TourScheduleCategory[];
  types: TourScheduleType[];
}

export interface TourScheduleOverviewProps {
  name: string;
  description: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
}

export interface TourScheduleTourInfoProps {
  tourId: number;
  tourName: string;
  tourDescription: string;
  tourDuration: number;
  startLocation: string;
  endLocation: string;
  latitude: number;
  longitude: number;
  season: string | null;
  tourStatus: string;
  assignMessage: string;
  onViewTour: () => void;
}

export interface TourSelectorProps {
  selectedTourId?: number;
  onTourSelect: (tourId: number, tourDetails?: Tour) => void;
  onTourClear?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  showDetails?: boolean;
  fetchDetails?: boolean;
}

export interface TourListItem {
  tourId: number;
  tourName: string;
}

export interface DayByDayAccommodationsProps {
  accommodations: TourScheduleAccommodation[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface TourCategoriesProps {
  categories: TourScheduleCategory[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface TourImagesProps {
  images: TourScheduleImage[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface TourInformationProps {
  schedule: TourScheduleDetails;
}

export interface TourTypesProps {
  types: TourScheduleType[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface TourScheduleSearchItem {
  id: number;
  name: string;
}

export interface AccommodationsListProps {
  accommodations: TourScheduleAccommodation[];
}

export interface BasicInfoPanelProps {
  scheduleDetails: TourScheduleDetails;
}

export interface CategoriesListProps {
  categories: TourScheduleCategory[];
}

export interface TourInfoPanelProps {
  scheduleDetails: TourScheduleDetails;
}

export interface TourScheduleStatsProps {
  scheduleDetails: TourScheduleDetails;
}

export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export interface TypesListProps {
  types: TourScheduleType[];
}
