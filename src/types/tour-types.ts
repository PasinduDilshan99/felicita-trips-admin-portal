import { ApiResponse } from "./common-types";

// types/tour-types.ts
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
  statusName: "ACTIVE" | "INACTIVE" | string;
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

export interface TourFilterApiResponse {
  code: number;
  status: string;
  message: string;
  data: TourResponse;
  timestamp: string;
}

export interface SingleTourResponse {
  tour: Tour;
}

export interface SingleTourApiResponse {
  code: number;
  status: string;
  message: string;
  data: Tour;
  timestamp: string;
}
export interface TourForTerminate {
  tourId: number;
  tourName: string;
}

export interface ToursForTerminateResponse {
  code: number;
  status: string;
  message: string;
  data: TourForTerminate[];
  timestamp: string;
}

export interface TerminateTourRequest {
  tourId: number;
}

export interface TerminateTourResponse {
  message: string;
}

export interface TerminateTourApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminateTourResponse;
  timestamp: string;
}

// Tour creation interfaces
export interface TourDestinationInput {
  destinationId: number;
  activityId: number;
  dayNumber: number;
}

export interface TourImageInput {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface InclusionInput {
  inclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ExclusionInput {
  exclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ConditionInput {
  conditionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TravelTipInput {
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface AddTourRequest {
  name: string;
  description: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  season: number;
  status: "ACTIVE" | "INACTIVE";
  assignTo: number;
  assignMessage: string;
  tourTypes: number[];
  tourCategories: number[];
  itinerary: TourDays[];
  images: TourImageInput[];
  inclusions: InclusionInput[];
  exclusions: ExclusionInput[];
  conditions: ConditionInput[];
  travelTips: TravelTipInput[];
}

export interface TourDayDestination {
  destinationId: number;
  activities: number[];
}

export interface TourDays {
  dayNumber: number;
  destinations: TourDayDestination[];
}

export interface AddTourResponse {
  message: string;
}

export interface AddTourApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddTourResponse;
  timestamp: string;
}

// Add to your existing tour-types.ts

// Tour Name and ID for search
export interface TourNameId {
  tourId: number;
  tourName: string;
}

export interface TourNameIdResponse {
  code: number;
  status: string;
  message: string;
  data: TourNameId[];
  timestamp: string;
}

// Tour details response
export interface DayToDayDestinationActivity {
  activityId: number;
  destinationId: number;
  activityName: string;
  activityDescription: string;
  activitiesCategory: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  minParticipate: number;
  maxParticipate: number;
  season: string;
  categoryName: string;
  images: {
    imageId: number;
    imageName: string;
    imageDescription: string;
    image_url: string;
  }[];
}

export interface DayToDayDestination {
  destination: {
    destinationId: number;
    destinationName: string;
    destinationDescription: string;
    category: string;
    location: string;
    latitude: number;
    longitude: number;
    images: {
      imageId: number;
      imageName: string;
      imageDescription: string;
      imageUrl: string;
      imageStatus: string | null;
    }[];
  };
  activities: DayToDayDestinationActivity[];
}

export interface DayToDayResponse {
  dayNumber: number;
  destinations: DayToDayDestination[];
}

export interface Inclusion {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Exclusion {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface Condition {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TravelTip {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TourAllDetails {
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
  statusName: "ACTIVE" | "INACTIVE";
  assignTo: number;
  assignToName: string;
  assignMessage: string;
  schedules: Schedule[];
  images: TourImage[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  conditions: Condition[];
  travelTips: TravelTip[];
  dayToDayResponses: DayToDayResponse[];
}

export interface TourAllDetailsResponse {
  code: number;
  status: string;
  message: string;
  data: TourAllDetails;
  timestamp: string;
}

// Update tour interfaces
export interface UpdateTourBasicDetails {
  tourName: string;
  tourDescription: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  season: number;
  status: "ACTIVE" | "INACTIVE";
  assignTo: number;
  assignMessage: string;
}

export interface UpdateTourType {
  tourTypeId: number;
  isPrimary: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTourCategory {
  tourCategoryId: number;
  isPrimary: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateDestinationInput {
  tourDestinationId: number;
  destinationId: number;
  activityId: number;
  dayNumber: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateImageInput {
  imageId: number;
  name: string;
  imageDescription: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateInclusionInput {
  inclusionId: number;
  inclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateExclusionInput {
  exclusionId: number;
  exclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateConditionInput {
  conditionId: number;
  conditionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTravelTipInput {
  travelTipId: number;
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTourRequest {
  tourId: number;
  tourBasicDetails: UpdateTourBasicDetails;
  addTourTypes: number[];
  removeTourTypes: number[];
  updateTourTypes: UpdateTourType[];
  addTourCategories: number[];
  removeTourCategories: number[];
  updateTourCategories: UpdateTourCategory[];
  addDestinations: TourDestinationInput[];
  removeDestinations: number[];
  removeActivities: number[];
  updateDestinations: UpdateDestinationInput[];
  addImages: TourImageInput[];
  removeImages: number[];
  updateImages: UpdateImageInput[];
  addInclusions: InclusionInput[];
  removeInclusions: number[];
  updateInclusions: UpdateInclusionInput[];
  addExclusions: ExclusionInput[];
  removeExclusions: number[];
  updateExclusions: UpdateExclusionInput[];
  addConditions: ConditionInput[];
  removeConditions: number[];
  updateConditions: UpdateConditionInput[];
  addTravelTips: TravelTipInput[];
  removeTravelTips: number[];
  updateTravelTips: UpdateTravelTipInput[];
}

export interface UpdateTourResponse {
  message: string;
  id: number;
}

export interface UpdateTourApiResponse {
  code: number;
  status: string;
  message: string;
  data: UpdateTourResponse;
  timestamp: string;
}

// Add these to your existing types/tour-types.ts file

// Tour Statistics Types
export interface TourPopularity {
  tourId: number;
  tourName: string;
  totalBookings: number;
}

export interface BookingStatusDistribution {
  statusName: string;
  totalCount: number;
}

export interface CategoryPerformance {
  categoryId: number;
  categoryName: string;
  totalTours: number;
}

export interface TypeDistribution {
  typeId: number;
  typeName: string;
  totalTours: number;
}

export interface LocationDistribution {
  startLocation: string;
  totalTours: number;
}

export interface TourStatisticsSummary {
  totalTours: number;
  totalBookings: number;
  pendingBookings: number;
  averageRating: number;
}

export interface TourStatisticsData {
  tourPopularity: TourPopularity[];
  bookingStatusDistribution: BookingStatusDistribution[];
  categoryPerformance: CategoryPerformance[];
  typeDistribution: TypeDistribution[];
  locationDistribution: LocationDistribution[];
  summary: TourStatisticsSummary;
}

export type TourStatisticsApiResponse = ApiResponse<TourStatisticsData>;

// Tour Schedule Statistics Types
export interface TourScheduleSummary {
  totalSchedules: number;
  completedSchedules: number;
  averageRating: number;
  utilizationRate: number;
}

export interface ScheduleTimeline {
  scheduleDate: string;
  totalSchedules: number;
}

export interface DurationDistribution {
  durationStart: number;
  durationEnd: number;
  totalSchedules: number;
}

export interface ExecutionPerformance {
  scheduleId: number;
  scheduleName: string;
  completedInstances: number;
}

export interface RatingOverview {
  scheduleId: number;
  scheduleName: string;
  averageRating: number;
  totalReviews: number;
}

export interface ParticipationTrend {
  scheduleId: number;
  scheduleName: string;
  totalParticipants: number;
}

export interface TourScheduleStatisticsData {
  summary: TourScheduleSummary;
  scheduleTimeline: ScheduleTimeline[];
  durationDistribution: DurationDistribution[];
  executionPerformance: ExecutionPerformance[];
  ratingOverview: RatingOverview[];
  participationTrend: ParticipationTrend[];
}

export type TourScheduleStatisticsApiResponse =
  ApiResponse<TourScheduleStatisticsData>;

// Tour Category Statistics Types
export interface TourCategorySummary {
  totalCategories: number;
  activeCategories: number;
  averageRating: number;
  totalBookings: number;
}

export interface CategoryDistribution {
  categoryName: string;
  totalTours: number;
}

export interface CategoryBookingPerformance {
  categoryId: number;
  categoryName: string;
  totalBookings: number;
}

export interface CategoryRatingOverview {
  categoryId: number;
  categoryName: string;
  averageRating: number;
  totalReviews: number;
}

export interface CategoryPrimarySecondaryUsage {
  categoryName: string;
  primaryUsage: number;
  secondaryUsage: number;
}

export interface CategoryParticipationImpact {
  categoryId: number;
  categoryName: string;
  totalParticipants: number;
}

export interface TourCategoryStatisticsData {
  summary: TourCategorySummary;
  categoryDistribution: CategoryDistribution[];
  categoryBookingPerformance: CategoryBookingPerformance[];
  categoryRatingOverview: CategoryRatingOverview[];
  categoryPrimarySecondaryUsage: CategoryPrimarySecondaryUsage[];
  categoryParticipationImpact: CategoryParticipationImpact[];
}

export type TourCategoryStatisticsApiResponse =
  ApiResponse<TourCategoryStatisticsData>;

// Tour Type Statistics Types
export interface TourTypeSummary {
  totalTypes: number;
  activeTypes: number;
  averageRating: number;
  totalBookings: number;
}

export interface TypeDistributionStats {
  typeName: string;
  totalTours: number;
}

export interface TypeBookingPerformance {
  typeId: number;
  typeName: string;
  totalBookings: number;
}

export interface TypeRatingOverview {
  typeId: number;
  typeName: string;
  averageRating: number;
  totalReviews: number;
}

export interface TypeParticipationImpact {
  typeId: number;
  typeName: string;
  totalParticipants: number;
}

export interface TypePrimarySecondaryUsage {
  typeName: string;
  primaryUsage: number;
  secondaryUsage: number;
}

export interface TourTypeStatisticsData {
  summary: TourTypeSummary;
  typeDistribution: TypeDistributionStats[];
  typeBookingPerformance: TypeBookingPerformance[];
  typeRatingOverview: TypeRatingOverview[];
  typeParticipationImpact: TypeParticipationImpact[];
  typePrimarySecondaryUsage: TypePrimarySecondaryUsage[];
}

export type TourTypeStatisticsApiResponse = ApiResponse<TourTypeStatisticsData>;

export interface TourDetailsForPackage {
  tourId: number;
  name: string;
  description: string;
  tourType: string;
  tourCategory: string;
  startLocation: string;
  endLocation: string;
  status: string;
  season: string;
  assignedUser: AssignedUser;
  assignMessage: string;
  days: TourDay[];
  inclusions: string[];
  exclusions: string[];
  conditions: string[];
  travelTips: TravelTip[];
}

export interface TourDetailsResponse {
  code: number;
  status: string;
  message: string;
  data: TourDetailsForPackage;
  timestamp: string;
}

export interface AssignedUser {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
}

export interface TourDay {
  day: number;
  destinations: Destination[];
}

export interface Destination {
  destinationId: number;
  name: string;
  description: string;
  activities: Activity[];
}

export interface Activity {
  activityId: number;
  name: string;
  description: string;
}
