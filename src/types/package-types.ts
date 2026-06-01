import { ApiResponse, PackageCategory } from "./common-types";
import { TourNameId } from "./tour-types";

// types/package-types.ts
export interface PackageSchedule {
  scheduleId: number;
  scheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  scheduleDescription: string;
}

// Feature Interface
export interface Feature {
  featureId: number;
  featureName: string;
  featureValue: string;
  featureDescription: string;
  color: string;
  specialNote: string;
}

// Image Interface
export interface PackageImage {
  imageId: number;
  imageName: string;
  imageDescription: string;
  imageUrl: string;
  color: string;
}

// Package Interface
export interface TourPackage {
  packageId: number;
  packageName: string;
  packageDescription: string;
  totalPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  color: string;
  hoverColor: string;
  minPersonCount: number;
  maxPersonCount: number;
  pricePerPerson: number;
  packageStatus: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  createdBy: number;
  packageTypeName: string;
  packageTypeDescription: string;
  packageTypeStatus: string;
  tourId: number;
  tourName: string;
  tourDescription: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  tourStatus: string;
  schedules: PackageSchedule[];
  features: Feature[];
  images: PackageImage[];
}

// Filter Parameters
export interface PackageFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  duration: number | null;
  packageType: string | null;
  location: string | null;
  minGroupSize: number | null;
  maxGroupSize: number | null;
  fromDate: string | null;
  toDate: string | null;
  pageNumber: number;
  pageSize: number;
}

// API Response Types
export interface PackageResponse {
  packageCount: number;
  packageResponseDtos: TourPackage[];
}

export interface PackageFilterApiResponse {
  code: number;
  status: string;
  message: string;
  data: PackageResponse;
  timestamp: string;
}

// Single Package Response
export interface SinglePackageResponse {
  package: TourPackage;
  // Add other fields if needed
}

export interface SinglePackageApiResponse {
  code: number;
  status: string;
  message: string;
  data: TourPackage;
  timestamp: string;
}

export interface PackageForTerminate {
  packageId: number;
  packageName: string;
}

export interface PackagesForTerminateResponse {
  code: number;
  status: string;
  message: string;
  data: PackageForTerminate[];
  timestamp: string;
}

export interface TerminatePackageRequest {
  packageId: number;
}

export interface TerminatePackageResponse {
  message: string;
}

export interface TerminatePackageApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminatePackageResponse;
  timestamp: string;
}

// Add these new interfaces to your existing types/package-types.ts

// Tour Types for Add Package
export interface TourIdName {
  tourId: number;
  tourName: string;
}

export interface TourIdNameResponse {
  code: number;
  status: string;
  message: string;
  data: TourIdName[];
  timestamp: string;
}
export interface TravelTip {
  tipTitle: string;
  tipDescription: string;
}

// Add Package Request Types
export interface PackageImageRequest {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string;
  color: string;
}

export interface DayAccommodation {
  dayNumber: number;
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
  transportId: number;
  otherNotes: string | null;
}

export interface Inclusion {
  inclusionText: string;
  displayOrder: number;
  status: string;
}

export interface Exclusion {
  exclusionText: string;
  displayOrder: number;
  status: string;
}

export interface Condition {
  conditionText: string;
  displayOrder: number;
  status: string;
}

export interface TravelTipRequest {
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: string;
}

export interface AddPackageRequest {
  packageType: number;
  tourId: number;
  name: string;
  description: string;
  totalPrice: number;
  discountPercentage: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  color: string;
  status: string;
  hoverColor: string;
  minPersonCount: number;
  maxPersonCount: number;
  pricePerPerson: number;
  images: PackageImageRequest[];
  addFeatures: AddFeatureRequest[];
  dayAccommodations: DayAccommodation[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  conditions: Condition[];
  travelTips: TravelTipRequest[];
}

export interface AddPackageResponse {
  message: string;
}

export interface AddPackageApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddPackageResponse;
  timestamp: string;
}

// Add these interfaces to your existing package-types.ts

// Package Name and ID for search
export interface PackageNameId {
  packageId: number;
  packageName: string;
}

export interface PackageNameIdResponse {
  code: number;
  status: string;
  message: string;
  data: PackageNameId[];
  timestamp: string;
}

// Package details response interfaces
export interface PackageFeatureResponse {
  featureId: number;
  featureName: string;
  featureValue: string;
  featureDescription: string;
  color: string;
  specialNote: string;
}

export interface PackageImageResponse {
  imageId: number;
  imageName: string;
  imageDescription: string;
  imageUrl: string;
  color: string;
}

export interface PackageInclusionResponse {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PackageExclusionResponse {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PackageConditionResponse {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PackageTravelTipResponse {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface DayAccommodationResponse {
  packageDayAccommodationId: number;
  dayNumber: number;
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
  otherNotes: string | null;
  hotelId: number;
  hotelName: string;
  hotelDescription: string;
  hotelWebsite: string;
  hotelCategory: number;
  hotelType: string;
  hotelLocation: string;
  hotelLatitude: number;
  hotelLongitude: number;
  transportId: number;
  vehicleRegistrationNumber: string;
  vehicleTypeName: string;
  vehicleModel: string;
  seatCapacity: number;
  airCondition: boolean;
}

export interface DayAccommodationListResponse {
  packageId: number;
  packageName: string;
  packageDescription: string;
  totalPrice: number;
  pricePerPerson: number;
  discount: number;
  color: string;
  hoverColor: string;
  packageDayByDayDtoList: DayAccommodationResponse[];
}

export interface PackageAllDetails {
  packageId: number;
  packageName: string;
  packageDescription: string;
  totalPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  color: string;
  hoverColor: string;
  minPersonCount: number;
  maxPersonCount: number;
  pricePerPerson: number;
  packageStatus: "ACTIVE" | "INACTIVE";
  packageTypeName: string;
  tourId: number;
  tourName: string;
  packageFeatures: PackageFeatureResponse[];
  packageImages: PackageImageResponse[];
  inclusions: PackageInclusionResponse[];
  exclusions: PackageExclusionResponse[];
  conditions: PackageConditionResponse[];
  travelTips: PackageTravelTipResponse[];
  dayAccommodationResponses: DayAccommodationListResponse;
}

export interface PackageAllDetailsResponse {
  code: number;
  status: string;
  message: string;
  data: PackageAllDetails;
  timestamp: string;
}

// Update package request interfaces
export interface PackageBasicDetails {
  packageType: number;
  tourId: number;
  name: string;
  description: string;
  totalPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  minPersonCount: number;
  maxPersonCount: number;
  pricePerPerson: number;
}

export interface UpdateImageRequest {
  imageId: number;
  imageName: string;
  imageDescription: string;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string;
  color: string;
}

export interface AddFeatureRequest {
  featureName: string;
  featureValue: string;
  featureDescription: string;
  status: "ACTIVE" | "INACTIVE";
  color: string;
  hoverColor: string;
  specialNote: string;
}

export interface UpdateFeatureRequest {
  featureId: number;
  featureName: string;
  featureValue: string;
  featureDescription: string;
  status: "ACTIVE" | "INACTIVE";
  color: string;
  hoverColor: string;
  specialNote: string;
}

export interface UpdateDayAccommodationRequest {
  packageDayAccommodationId: number;
  dayNumber: number;
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
  transportId: number;
  otherNotes: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface AddDayAccommodationRequest {
  dayNumber: number;
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
  transportId: number;
  otherNotes: string | null;
}

export interface UpdateInclusionRequest {
  packageInclusionId: number;
  inclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateExclusionRequest {
  packageExclusionId: number;
  exclusionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateConditionRequest {
  packageConditionId: number;
  conditionText: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTravelTipRequest {
  packageTipId: number;
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdatePackageRequest {
  packageId: number;
  packageBasicDetails: PackageBasicDetails;
  removedImageIds: number[];
  addImages: PackageImageRequest[];
  updatedImages: UpdateImageRequest[];
  addFeatures: AddFeatureRequest[];
  removeFeatureIds: number[];
  updatedFeatures: UpdateFeatureRequest[];
  addDayAccommodations: AddDayAccommodationRequest[];
  removeDayAccommodationIds: number[];
  updatedDayAccommodations: UpdateDayAccommodationRequest[];
  addInclusions: Inclusion[];
  removeInclusionIds: number[];
  updatedInclusions: UpdateInclusionRequest[];
  addExclusions: Exclusion[];
  removeExclusionIds: number[];
  updatedExclusions: UpdateExclusionRequest[];
  addConditions: Condition[];
  removeConditionIds: number[];
  updatedConditions: UpdateConditionRequest[];
  addTravelTips: TravelTipRequest[];
  removeTravelTipIds: number[];
  updatedTravelTips: UpdateTravelTipRequest[];
}

export interface UpdatePackageResponse {
  message: string;
  id: number;
}

export interface UpdatePackageApiResponse {
  code: number;
  status: string;
  message: string;
  data: UpdatePackageResponse;
  timestamp: string;
}

// Add these to your existing types/package-types.ts file

// Package Statistics Types
export interface PackageStatisticsSummary {
  totalPackages: number;
  activePackages: number;
  averagePackageRating: number;
  totalParticipants: number;
  averagePackagePrice: number;
}

export interface PackagePopularity {
  packageId: number;
  packageName: string;
  totalSchedules: number;
  totalParticipants: number;
}

export interface PackageRatingOverview {
  packageId: number;
  packageName: string;
  averageRating: number;
  totalReviews: number;
}

export interface PackagePriceDistribution {
  packageId: number;
  packageName: string;
  totalPrice: number;
  pricePerPerson: number;
  totalParticipants: number;
}

export interface PackageCapacityUtilization {
  packageId: number;
  packageName: string;
  minPersonCount: number;
  maxPersonCount: number;
  averageParticipants: number;
}

export interface PackageTypeDistribution {
  packageTypeName: string;
  totalPackages: number;
}

export interface PackageStatisticsData {
  summary: PackageStatisticsSummary;
  packagePopularities: PackagePopularity[];
  packageRatingOverviews: PackageRatingOverview[];
  packagePriceDistributions: PackagePriceDistribution[];
  packageCapacityUtilizations: PackageCapacityUtilization[];
  packageTypeDistributions: PackageTypeDistribution[];
}

export type PackageStatisticsApiResponse = ApiResponse<PackageStatisticsData>;

// Package Schedule Statistics Types
export interface PackageScheduleSummary {
  totalSchedules: number;
  activeSchedules: number;
  averageScheduleRating: number;
  totalParticipants: number;
  averageDuration: number;
}

export interface ScheduleTimeline {
  timeline: string;
  totalSchedules: number;
}

export interface ScheduleStatusDistribution {
  statusId: number;
  totalSchedules: number;
}

export interface DurationDistribution {
  scheduleId: number;
  scheduleName: string;
  durationStart: number;
  durationEnd: number;
  averageDuration: number;
}

export interface ScheduleParticipationPerformance {
  scheduleId: number;
  scheduleName: string;
  totalParticipants: number;
  averageParticipants: number;
}

export interface ScheduleRatingOverview {
  scheduleId: number;
  scheduleName: string;
  averageRating: number;
  totalReviews: number;
}

export interface PackageScheduleStatisticsData {
  summary: PackageScheduleSummary;
  scheduleTimelines: ScheduleTimeline[];
  scheduleStatusDistributions: ScheduleStatusDistribution[];
  durationDistributions: DurationDistribution[];
  scheduleParticipationPerformances: ScheduleParticipationPerformance[];
  scheduleRatingOverviews: ScheduleRatingOverview[];
}

export type PackageScheduleStatisticsApiResponse =
  ApiResponse<PackageScheduleStatisticsData>;

// Package Type Statistics Types
export interface PackageTypeStatisticsSummary {
  totalPackageTypes: number;
  mostUsedTypeCount: number;
  mostPopularTypeName: string | null;
  highestRatedTypeRating: number;
  highestRevenueTypeValue: number;
}

export interface PackageTypeDistribution {
  typeId: number;
  typeName: string;
  totalPackages: number;
}

export interface TypeRevenuePerformance {
  typeId: number;
  typeName: string;
  totalRevenue: number;
  averagePackagePrice: number;
}

export interface TypeParticipationImpact {
  typeName: string;
  month: string | null;
  totalParticipants: number;
}

export interface TypePrimarySecondaryUsage {
  typeId: number;
  typeName: string;
  primaryCount: number;
  secondaryCount: number;
}

export interface TypeBookingPerformance {
  typeId: number;
  typeName: string;
  totalParticipants: number | null;
}

export interface TypeRatingOverview {
  typeId: number;
  typeName: string;
  averageRating: number;
  totalReviews: number;
}

export interface PackageTypeStatisticsData {
  summary: PackageTypeStatisticsSummary;
  typeDistributions: PackageTypeDistribution[];
  typeRevenuePerformances: TypeRevenuePerformance[];
  typeParticipationImpacts: TypeParticipationImpact[];
  typePrimarySecondaryUsages: TypePrimarySecondaryUsage[];
  typeBookingPerformances: TypeBookingPerformance[];
  typeRatingOverviews: TypeRatingOverview[];
}

export type PackageTypeStatisticsApiResponse =
  ApiResponse<PackageTypeStatisticsData>;

// Add these to your existing types/package-types.ts file

// Package Parameters Types
export interface HotelNameId {
  hotelId: number;
  hotelName: string;
  starRating: number;
}

export interface VehicleNumberIdType {
  vehicleId: number;
  vehicleNumber: string | null;
  vehicleType: string;
  specificationId: number;
}

export interface TravelTipParam {
  title: string;
  description: string;
}

export interface PackageParametersData {
  hotelsNamesAndIdsDtos: HotelNameId[];
  vehicleNumberIdTypeDtos: VehicleNumberIdType[];
  inclusions: string[];
  exclusions: string[];
  conditions: string[];
  travelTips: TravelTipParam[];
}

export type PackageParametersApiResponse = ApiResponse<PackageParametersData>;

// Request type
export interface GetPackageParametersRequest {
  tourId: number;
}

// Add these to your existing types/package-types.ts file

// Package Request Parameters Response
export interface PackageRequestParams {
  minPrice: number;
  maxPrice: number;
  durations: number[];
  locations: string[];
  minGroupSize: number;
  maxGroupSize: number;
  fromDate: string;
  toDate: string;
}

export type PackageRequestParamsApiResponse = ApiResponse<PackageRequestParams>;

export interface PackageCardProps {
  packageData: TourPackage;
  onImageClick?: (imageIndex: number) => void;
}

export interface PackageListCardProps {
  packageData: TourPackage;
  onImageClick?: (imageIndex: number) => void;
}

export interface ConditionTipItem {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface TravelTipItem {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PackageConditionsTipsProps {
  conditions: ConditionTipItem[];
  travelTips: TravelTipItem[];
}

export interface PackageDayAccommodationsProps {
  accommodations: DayAccommodationResponse[];
  packageColor: string;
}

export interface PackageFeaturesProps {
  features: PackageFeatureResponse[];
}

export interface InclusionExclusionItem {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PackageInclusionsExclusionsProps {
  inclusions: InclusionExclusionItem[];
  exclusions: InclusionExclusionItem[];
}

export interface PackageOverviewProps {
  name: string;
  description: string;
  color: string;
  hoverColor: string;
  startDate: string;
  endDate: string;
  packageTypeName: string;
}

export interface PackagePricingProps {
  totalPrice: number;
  discountPercentage: number;
  pricePerPerson: number;
  minPersonCount: number;
  maxPersonCount: number;
  color: string;
}

export interface PackageTourInfoProps {
  tourId: number;
  tourName: string;
  onViewTour: () => void;
}

export interface PackageTypeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export interface FeaturesFormProps {
  features: AddFeatureRequest[];
  onFeaturesChange: (features: AddFeatureRequest[]) => void;
  error?: string;
}

export interface DayAccommodationsFormProps {
  accommodations: DayAccommodation[];
  onAccommodationsChange: (accommodations: DayAccommodation[]) => void;
  hotels: HotelNameId[];
  vehicles: VehicleNumberIdType[];
  error?: string;
}

export interface InclusionsExclusionsFormProps {
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  onInclusionsChange: (inclusions: Inclusion[]) => void;
  onExclusionsChange: (exclusions: Exclusion[]) => void;
}

export interface ConditionsTipsFormProps {
  conditions: Condition[];
  travelTips: TravelTipRequest[];
  onConditionsChange: (conditions: Condition[]) => void;
  onTravelTipsChange: (travelTips: TravelTipRequest[]) => void;
}

export interface HotelSelectorProps {
  value: number;
  onChange: (hotelId: number) => void;
  hotels: HotelNameId[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export interface VehicleSelectorProps {
  value: number;
  onChange: (vehicleId: number) => void;
  vehicles: VehicleNumberIdType[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export interface BasicInfoFormProps {
  packageData: PackageAllDetails;
  hasChanged: (field: string) => boolean;
  onFieldChange: (field: string, value: any) => void;
  availablePackageTypes: PackageCategory[];
  availableTours: TourNameId[];
}

export interface PackageSearchItem {
  id: number;
  name: string;
}

export interface BasicInfoPanelProps {
  packageDetails: TourPackage;
}

export interface FeaturesListProps {
  features: Feature[];
}

export interface PackageStatsProps {
  packageDetails: TourPackage;
}

export interface SchedulesListProps {
  schedules: PackageSchedule[];
}

export interface TourInfoPanelProps {
  packageDetails: TourPackage;
}
