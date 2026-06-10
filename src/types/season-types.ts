// types/season-types.ts

import { ApiResponse } from "./common-types";

// Season Image Types
export interface SeasonImage {
  id: number;
  name: string;
  description?: string | null;
  imageUrl: string;
  status?: number;
  createdAt?: string;
  createdBy?: number | null;
  updatedAt?: string;
  updatedBy?: number | null;
}

export interface SeasonImageInsertRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface SeasonImageUpdateRequest {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Season Basic Details (List Item)
export interface SeasonBasicDetail {
  id: number;
  name: string;
  standardName: string;
  localName: string;
  startMonth: number;
  endMonth: number;
  isPeak: boolean;
  displayOrder: number;
  seasonImages: SeasonImage[];
}

export type SeasonBasicDetailsApiResponse = ApiResponse<SeasonBasicDetail[]>;

// Season Statistics Types
export interface SeasonActivityCount {
  seasonId: number;
  seasonName: string;
  totalActivities: number;
}

export interface SeasonTourCount {
  seasonId: number;
  seasonName: string;
  totalTours: number;
}

export interface SeasonPopularity {
  seasonId: number;
  seasonName: string;
  totalActivities: number;
  totalTours: number;
  totalUsage: number;
}

export interface PeakSeasonDistribution {
  seasonName: string;
  isPeak: boolean;
  activityCount: number;
  tourCount: number;
}

export interface SeasonWeatherOverview {
  seasonId: number;
  seasonName: string;
  temperatureMin: number;
  temperatureMax: number;
  rainfallPattern: string;
  weatherSummary: string;
}

export interface SeasonStatisticsSummary {
  totalSeasons: number;
  totalActivities: number;
  totalTours: number;
  mostUsedSeason: string;
  peakSeason: string;
}

export interface SeasonStatisticsData {
  seasonActivityCounts: SeasonActivityCount[];
  seasonTourCounts: SeasonTourCount[];
  seasonPopularities: SeasonPopularity[];
  peakSeasonDistributions: PeakSeasonDistribution[];
  seasonWeatherOverviews: SeasonWeatherOverview[];
  summary: SeasonStatisticsSummary;
}

export type SeasonStatisticsApiResponse = ApiResponse<SeasonStatisticsData>;

// Season Details Response
export interface SeasonActivity {
  activityId: number;
  activityName: string;
  activityDescription: string;
  activityStatus: string;
}

export interface SeasonTour {
  tourId: number;
  tourName: string;
  tourDescription: string;
  tourStatus: string;
}

export interface SeasonDetails {
  id: number;
  name: string;
  standardName: string;
  localName: string;
  startMonth: number;
  endMonth: number;
  monsoonType: string;
  weatherSummary: string;
  temperatureMin: number;
  temperatureMax: number;
  rainfallPattern: string;
  isPeak: boolean;
  displayOrder: number;
  description: string;
  status: number;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string;
  updatedBy: number | null;
  seasonImages: SeasonImage[];
  activities: SeasonActivity[];
  tours: SeasonTour[];
}

export type SeasonDetailsApiResponse = ApiResponse<SeasonDetails>;

// Season ID and Name Response
export interface SeasonIdAndName {
  seasonId: number;
  seasonName: string;
}

export type SeasonIdAndNameApiResponse = ApiResponse<SeasonIdAndName[]>;

// Add Season Request
export interface AddSeasonRequest {
  name: string;
  standardName: string;
  localName: string;
  startMonth: number;
  endMonth: number;
  monsoonType: string;
  weatherSummary: string;
  temperatureMin: number;
  temperatureMax: number;
  rainfallPattern: string;
  isPeak: boolean;
  displayOrder: number;
  description: string;
  status: string;
  imageInsertRequests: SeasonImageInsertRequest[];
  insertActivitiesIds: number[];
  insertTourIds: number[];
}

export interface AddSeasonResponse {
  message: string;
}

export type AddSeasonApiResponse = ApiResponse<AddSeasonResponse>;

// Update Season Request
export interface UpdateSeasonRequest {
  id: number;
  name: string;
  standardName: string;
  localName: string;
  startMonth: number;
  endMonth: number;
  monsoonType: string;
  weatherSummary: string;
  temperatureMin: number;
  temperatureMax: number;
  rainfallPattern: string;
  isPeak: boolean;
  displayOrder: number;
  description: string;
  status: string;
  imageInsertRequests: SeasonImageInsertRequest[];
  imageUpdateRequests: SeasonImageUpdateRequest[];
  imageRemoveRequests: number[];
  insertActivitiesIds: number[];
  removeActivitiesIds: number[];
  insertTourIds: number[];
  removeTourIds: number[];
}

export interface UpdateSeasonResponse {
  message: string ;
  id: number;
}

export type UpdateSeasonApiResponse = ApiResponse<UpdateSeasonResponse>;

// Terminate Season Request
export interface TerminateSeasonRequest {
  id: number;
}

export interface TerminateSeasonResponse {
  message: string;
}

export type TerminateSeasonApiResponse = ApiResponse<TerminateSeasonResponse>;

// Get Season Details Request
export interface GetSeasonDetailsRequest {
  id: number;
}

export interface SeasonFilterParams {
  name: string | null;
  isPeak: boolean | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export interface SeasonCardProps {
  season: SeasonBasicDetail;
  onImageClick?: (imageIndex: number) => void;
}

export interface SeasonListCardProps {
  season: SeasonBasicDetail;
  onImageClick?: (imageIndex: number) => void;
}

export interface SeasonActivitiesListProps {
  activities: SeasonActivity[];
  onViewActivity: (activityId: number) => void;
}

export interface SeasonOverviewProps {
  name: string;
  standardName: string;
  localName: string;
  description: string;
  startMonth: number;
  endMonth: number;
  isPeak: boolean;
  displayOrder: number;
}

export interface SeasonToursListProps {
  tours: SeasonTour[];
  onViewTour: (tourId: number) => void;
}

export interface SeasonWeatherInfoProps {
  temperatureMin: number;
  temperatureMax: number;
  weatherSummary: string;
  rainfallPattern: string;
  monsoonType: string;
}
