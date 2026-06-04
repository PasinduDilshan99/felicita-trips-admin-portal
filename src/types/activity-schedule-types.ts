// types/activity-schedule-types.ts

import { Activity } from "./activity-types";
import { ApiResponse } from "./common-types";

// Activity Category Type
export interface ActivityCategoryDto {
  id: number;
  name: string;
  description: string;
  is_primary: boolean;
}

// Activity Image Type
export interface ActivityScheduleImage {
  id: number;
  name: string;
  description: string | null;
  status: number;
  image_url: string;
}

// Activity Schedule List Item
export interface ActivityScheduleListItem {
  activityId: number;
  scheduleId: number;
  destinationId: number;
  destinationName: string;
  activityName: string;
  activityScheduleName: string;
  description: string;
  activityCategoryDtos: ActivityCategoryDto[];
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasonId: number;
  season: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduleAssumeStartDate: string;
  scheduleAssumeEndDate: string;
  scheduleDurationHoursStart: number;
  scheduleDurationHoursEnd: number;
  scheduleSpecialNote: string;
  scheduleDescription: string;
  scheduleStatus: string;
  images: ActivityScheduleImage[];
}

// Activity Schedule Response
export interface ActivityScheduleResponse {
  activityCount: number;
  activityScheduleResponseDtos: ActivityScheduleListItem[];
}

export type ActivityScheduleListApiResponse =
  ApiResponse<ActivityScheduleResponse>;

// Filter Parameters
export interface ActivityScheduleFilterParams {
  name: string | null;
  duration: number | null;
  activityId: number | null;
  destinationId: number | null;
  packageScheduleId: number | null;
  tourScheduleId: number | null;
  activityCategory: string | null;
  fromDate: string | null;
  toDate: string | null;
  season: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string | null;
  sortDirection: "ASC" | "DESC" | null;
}

// Activity Schedule Params Response
export interface DurationOption {
  duration: string;
}

export interface ActivityIdAndName {
  activityId: number;
  activityName: string;
}

export interface DestinationIdAndName {
  destinationId: number;
  destinationName: string;
}

export interface TourScheduleIdAndName {
  tourScheduleId: number;
  tourScheduleName: string;
}

export interface PackageScheduleIdAndName {
  packageScheduleId: number;
  packageScheduleName: string;
}

export interface SeasonIdAndName {
  seasonId: number;
  seasonName: string;
}

export interface SortByOption {
  sortByDisplayName: string;
  sortBy: string;
}

export interface ActivityScheduleParamsData {
  durations: string[];
  activityIdAndNameResponses: ActivityIdAndName[];
  destinationIdAndNameResponses: DestinationIdAndName[];
  tourScheduleIdAndNameResponses: TourScheduleIdAndName[];
  packageScheduleIdAndNameResponses: PackageScheduleIdAndName[];
  seasonIdAndNameResponses: SeasonIdAndName[];
  sortByResponses: SortByOption[];
}

export type ActivityScheduleParamsApiResponse =
  ApiResponse<ActivityScheduleParamsData>;

// Activity Schedule Details
export interface ActivityScheduleDetails {
  activityScheduleId: number;
  activityScheduleName: string;
  scheduleAssumeStartDate: string;
  scheduleAssumeEndDate: string;
  scheduleDurationHoursStart: number;
  scheduleDurationHoursEnd: number;
  scheduleSpecialNote: string;
  scheduleDescription: string;
  scheduleStatus: string;
  scheduleCreatedAt: string;
  scheduleUpdatedAt: string;
  activityId: number;
  activityName: string;
  activityDescription: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasonId: number;
  season: string;
  activityStatus: string;
  activityCreatedAt: string;
  activityUpdatedAt: string;
  destinationId: number;
  destinationName: string;
  tourId: number;
  tourName: string | null;
  tourDescription: string | null;
  tourDuration: number;
  startLocation: string | null;
  endLocation: string | null;
  tourStatus: string | null;
  tourScheduleId: number;
  tourScheduleName: string | null;
  tourScheduleStartDate: string | null;
  tourScheduleEndDate: string | null;
  tourScheduleDurationStart: number;
  tourScheduleDurationEnd: number;
  tourScheduleStatus: string | null;
  packageId: number;
  packageName: string | null;
  packageDescription: string | null;
  totalPrice: number | null;
  discountPercentage: number | null;
  pricePerPerson: number | null;
  minPersonCount: number;
  maxPersonCount: number;
  packageStatus: string | null;
  packageScheduleId: number;
  packageScheduleName: string | null;
  packageScheduleStartDate: string | null;
  packageScheduleEndDate: string | null;
  packageScheduleDurationStart: number;
  packageScheduleDurationEnd: number;
  packageScheduleStatus: string | null;
  activityCategoryDtos: ActivityCategoryDto[];
  images: ActivityScheduleImage[];
}

export type ActivityScheduleDetailsApiResponse =
  ApiResponse<ActivityScheduleDetails>;

// Create Activity Schedule Request
export interface CreateActivityScheduleRequest {
  activityScheduleName: string;
  activityId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationHoursStart: number;
  durationHoursEnd: number;
  specialNotes: string;
  description: string;
  packageScheduleId: number;
  tourScheduleId: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateActivityScheduleResponse {
  message: string;
}

export type CreateActivityScheduleApiResponse =
  ApiResponse<CreateActivityScheduleResponse>;

// Update Activity Schedule Request
export interface UpdateActivityScheduleRequest {
  activityScheduleId: number;
  activityScheduleName: string;
  activityId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationHoursStart: number;
  durationHoursEnd: number;
  specialNotes: string;
  description: string;
  packageScheduleId: number;
  tourScheduleId: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateActivityScheduleResponse {
  message: string;
  id: number;
}

export type UpdateActivityScheduleApiResponse =
  ApiResponse<UpdateActivityScheduleResponse>;

// Terminate Activity Schedule Request
export interface TerminateActivityScheduleRequest {
  id: number;
}

export interface TerminateActivityScheduleResponse {
  message: string;
}

export type TerminateActivityScheduleApiResponse =
  ApiResponse<TerminateActivityScheduleResponse>;

// Get Activity Schedule Details Request
export interface GetActivityScheduleDetailsRequest {
  id: number;
}

// Add these to your existing types/activity-schedule-types.ts file

// Activity Schedule ID and Name Response
export interface ActivityScheduleIdAndName {
  activityScheduleId: number;
  activityScheduleName: string;
}

export type ActivityScheduleIdAndNamesApiResponse = ApiResponse<
  ActivityScheduleIdAndName[]
>;

export interface ActivityScheduleCardProps {
  schedule: ActivityScheduleListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface ActivityScheduleListCardProps {
  schedule: ActivityScheduleListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface ActivityScheduleCategoriesProps {
  categories: ActivityCategoryDto[];
}

export interface ActivityScheduleOverviewProps {
  name: string;
  description: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
}

export interface ActivityScheduleRelatedInfoProps {
  // Activity
  activityId: number;
  activityName: string;
  activityDescription: string;
  activityStatus: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;

  // Destination
  destinationId: number;
  destinationName: string;

  // Tour
  tourId: number;
  tourName: string | null;
  tourDescription: string | null;
  tourDuration: number;
  startLocation: string | null;
  endLocation: string | null;
  tourStatus: string | null;

  // Tour Schedule
  tourScheduleId: number;
  tourScheduleName: string | null;
  tourScheduleStartDate: string | null;
  tourScheduleEndDate: string | null;
  tourScheduleDurationStart: number;
  tourScheduleDurationEnd: number;
  tourScheduleStatus: string | null;

  // Package
  packageId: number;
  packageName: string | null;
  packageDescription: string | null;
  totalPrice: number | null;
  discountPercentage: number | null;
  pricePerPerson: number | null;
  minPersonCount: number;
  maxPersonCount: number;
  packageStatus: string | null;

  // Package Schedule
  packageScheduleId: number;
  packageScheduleName: string | null;
  packageScheduleStartDate: string | null;
  packageScheduleEndDate: string | null;
  packageScheduleDurationStart: number;
  packageScheduleDurationEnd: number;
  packageScheduleStatus: string | null;

  // Callbacks
  onViewActivity: () => void;
  onViewDestination: () => void;
  onViewTour: () => void;
  onViewTourSchedule: () => void;
  onViewPackage: () => void;
  onViewPackageSchedule: () => void;
}

export interface ActivitySelectorProps {
  selectedActivityId?: number;
  onActivitySelect: (activityId: number, activityDetails?: Activity) => void;
  onActivityClear?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  showDetails?: boolean;
  fetchDetails?: boolean;
}

export interface ActivityListItem {
  activityId: number;
  activityName: string;
}

export interface ActivityCategoriesProps {
  categories: ActivityCategoryDto[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface ActivityImagesProps {
  images: ActivityScheduleImage[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export interface ActivityInformationProps {
  schedule: ActivityScheduleDetails;
  formatPrice: (price: number) => string;
}

export interface ActivityScheduleSearchItem {
  id: number;
  name: string;
}

export interface ActivityInfoPanelProps {
  scheduleDetails: ActivityScheduleDetails;
}

export interface ActivityScheduleStatsProps {
  scheduleDetails: ActivityScheduleDetails;
}

export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export interface BasicInfoPanelProps {
  scheduleDetails: ActivityScheduleDetails;
}

export interface CategoriesListProps {
  categories: ActivityCategoryDto[];
}

export interface PackageInfoPanelProps {
  scheduleDetails: ActivityScheduleDetails;
}
