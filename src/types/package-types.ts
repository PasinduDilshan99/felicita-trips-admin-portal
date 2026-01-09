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

// Activity Interface
export interface Activity {
  activityId: number;
  name: string;
  description: string;
}

// Destination Interface
export interface Destination {
  destinationId: number;
  name: string;
  description: string;
  activities: Activity[];
}

// Day Interface
export interface TourDay {
  day: number;
  destinations: Destination[];
}

// Travel Tip Interface
export interface TravelTip {
  tipTitle: string;
  tipDescription: string;
}

// Assigned User Interface
export interface AssignedUser {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
}

// Tour Details for Add Package
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

// Add Package Request Types
export interface PackageImageRequest {
  name: string;
  description: string;
  status: string;
  imageUrl: string;
  color: string;
  createdBy: number;
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