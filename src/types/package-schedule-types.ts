// types/package-schedule-types.ts

import { ApiResponse } from "./common-types";

// Feature Interface
export interface PackageScheduleFeature {
  featureId: number;
  name: string;
  value: string;
  description: string;
  specialNote: string;
  color: string;
  hoverColor: string;
  status: string;
  createdAt: string;
}

// Accommodation Interface
export interface PackageScheduleAccommodation {
  accommodationId: number;
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
  hotelName: string | null;
  transportId: number;
  transportName: string | null;
  localPrice: number;
  price: number;
  discount: number;
  serviceCharge: number;
  tax: number;
  extraCharge: number;
  extraChargeNote: string | null;
  transportCost: number;
  otherNotes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Package Schedule List Item
export interface PackageScheduleListItem {
  packageScheduleId: number;
  packageScheduleName: string;
  packageId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  durationStart: number;
  durationEnd: number;
  status: string;
  specialNote: string;
  description: string;
  tourScheduleId: number;
  tourScheduleName: string | null;
}

// Package Schedule Response
export interface PackageScheduleResponse {
  packageScheduleCount: number;
  packageScheduleResponses: PackageScheduleListItem[];
}

export type PackageScheduleListApiResponse = ApiResponse<PackageScheduleResponse>;

// Filter Parameters
export interface PackageScheduleFilterParams {
  name: string | null;
  packageId: number | null;
  tourScheduleId: number | null;
  tourId: number | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

// Package Schedule Params Response
export interface TourIdAndName {
  tourId: number;
  tourName: string;
}

export interface PackageIdAndName {
  packageId: number;
  packageName: string;
}

export interface TourScheduleIdAndName {
  tourScheduleId: number;
  tourScheduleName: string;
}

export interface SortByOption {
  sortByDisplayName: string;
  sortBy: string;
}

export interface PackageScheduleParamsData {
  tourIdAndNameResponses: TourIdAndName[];
  packageIdAndNamesResponses: PackageIdAndName[];
  tourScheduleIdAndNameResponses: TourScheduleIdAndName[];
  sortByResponses: SortByOption[];
}

export type PackageScheduleParamsApiResponse = ApiResponse<PackageScheduleParamsData>;

// Package Schedule Details
export interface PackageScheduleDetails {
  packageScheduleId: number;
  packageScheduleName: string;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  description: string;
  scheduleStatus: string;
  createdAt: string;
  updatedAt: string;
  packageId: number;
  packageName: string;
  packageDescription: string | null;
  totalPrice: number;
  discountPercentage: number;
  pricePerPerson: number;
  minPersonCount: number;
  maxPersonCount: number;
  color: string | null;
  hoverColor: string | null;
  packageStatus: string;
  packageCreatedAt: string;
  packageUpdatedAt: string;
  packageTypeId: number;
  packageTypeName: string;
  packageTypeDescription: string;
  tourId: number;
  tourName: string;
  tourDescription: string;
  tourDuration: number;
  startLocation: string;
  endLocation: string;
  season: string;
  tourStatus: string;
  tourScheduleId: number;
  tourScheduleName: string | null;
  features: PackageScheduleFeature[];
  accommodations: PackageScheduleAccommodation[];
}

export type PackageScheduleDetailsApiResponse = ApiResponse<PackageScheduleDetails>;

// Create Package Schedule Request
export interface CreatePackageScheduleRequest {
  packageScheduleName: string;
  packageId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  tourScheduleId: number;
}

export interface CreatePackageScheduleResponse {
  message: string | null;
}

export type CreatePackageScheduleApiResponse = ApiResponse<CreatePackageScheduleResponse>;

// Update Package Schedule Request
export interface UpdatePackageScheduleRequest {
  packageScheduleId: number;
  packageScheduleName: string;
  packageId: number;
  assumeStartDate: string;
  assumeEndDate: string;
  durationStart: number;
  durationEnd: number;
  specialNote: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  tourScheduleId: number;
}

export interface UpdatePackageScheduleResponse {
  message: string | null;
  id: number | null;
}

export type UpdatePackageScheduleApiResponse = ApiResponse<UpdatePackageScheduleResponse>;

// Terminate Package Schedule Request
export interface TerminatePackageScheduleRequest {
  id: number;
}

export interface TerminatePackageScheduleResponse {
  message: string;
}

export type TerminatePackageScheduleApiResponse = ApiResponse<TerminatePackageScheduleResponse>;

// Get Package Schedule Details Request
export interface GetPackageScheduleDetailsRequest {
  id: number;
}

// Add these to your existing types/package-schedule-types.ts file

// Package Schedule ID and Name Response
export interface PackageScheduleIdAndName {
  packageScheduleId: number;
  packageScheduleName: string;
}

export type PackageScheduleIdAndNamesApiResponse = ApiResponse<PackageScheduleIdAndName[]>;