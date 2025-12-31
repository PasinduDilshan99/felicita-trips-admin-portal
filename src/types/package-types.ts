// types/package-types.ts

// Schedule Interface
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
  packageStatus: 'ACTIVE' | 'INACTIVE' | string;
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

export interface ApiResponse {
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

// For adding/updating packages
export interface PackageImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  color: string;
}

export interface FeatureRequest {
  featureName: string;
  featureValue: string;
  featureDescription: string;
  color: string;
  specialNote: string;
}

export interface ScheduleRequest {
  scheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  scheduleDescription: string;
}

export interface AddPackageRequest {
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
  packageStatus: 'ACTIVE' | 'INACTIVE';
  packageTypeName: string;
  tourId: number;
  schedules: ScheduleRequest[];
  features: FeatureRequest[];
  images: PackageImageRequest[];
}

export interface UpdatePackageRequest {
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
  packageStatus: 'ACTIVE' | 'INACTIVE';
  packageTypeName: string;
  tourId: number;
  removeImages: number[];
  newImages: PackageImageRequest[];
  removeSchedules: number[];
  newSchedules: ScheduleRequest[];
  removeFeatures: number[];
  newFeatures: FeatureRequest[];
}

// Add these interfaces to your existing package-types.ts file

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