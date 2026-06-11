// types/season-types.ts

import { ActivityIdName } from "./activity-types";
import { ApiResponse } from "./common-types";
import { TourNameId } from "./tour-types";

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
  message: string;
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

export interface SeasonSearchItem {
  id: number;
  name: string;
}

export interface ActivitiesListProps {
  activities: SeasonActivity[];
}

export interface BasicInfoPanelProps {
  seasonDetails: SeasonDetails;
}

export interface ClimateInfoPanelProps {
  seasonDetails: SeasonDetails;
}

export interface SeasonStatsProps {
  seasonDetails: SeasonDetails;
}

export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export interface ToursListProps {
  tours: SeasonTour[];
}

export interface SeasonReadOnlyDetailsProps {
  season: SeasonDetails;
  allActivities: ActivityIdName[];
  allTours: TourNameId[];
  loadingActivities: boolean;
  loadingTours: boolean;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onAddActivity: (activityId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onAddTour: (tourId: number) => void;
  onRemoveTour: (tourId: number) => void;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (
    file: File,
    name: string,
    description: string,
  ) => Promise<void>;
  onUpdateImage: (imageId: number, name: string, description: string) => void;
  uploadingImages: boolean;
  theme: any;
}

export interface ActivityTourSelectorProps {
  selectedActivityIds: number[];
  selectedTourIds: number[];
  onActivityChange: (activityIds: number[]) => void;
  onTourChange: (tourIds: number[]) => void;
  errors?: {
    activities?: string;
    tours?: string;
  };
}
export interface SeasonBasicInfoProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export interface SeasonSettingsProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onStatusChange: (value: "ACTIVE" | "INACTIVE") => void;
  onPeakChange: (checked: boolean) => void;
}
