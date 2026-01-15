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

// types/tour-types.ts - Add these interfaces to your existing file

// Employee for tour assignment
export interface TourAssignmentEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  mobileNumber1: string;
  designationName: string;
  tours: {
    name: string | null;
    tour_id: number | null;
  }[];
}

export interface EmployeeAssignResponse {
  code: number;
  status: string;
  message: string;
  data: TourAssignmentEmployee[];
  timestamp: string;
}

// Destination for tour selection
export interface DestinationForTour {
  destinationId: number;
  destinationName: string;
}

export interface DestinationsForTourResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationForTour[];
  timestamp: string;
}

// Destination details with activities
export interface DestinationActivity {
  activityId: number;
  activityName: string;
  activityDescription: string;
  activitiesCategory: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;
}

export interface DestinationDetailsForTour {
  destinationId: number;
  destinationName: string;
  destinationDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  categoryName: string;
  categoryDescription: string;
  statusName: string;
  activities: DestinationActivity[];
  images: {
    imageId: number;
    imageName: string;
    imageDescription: string;
    imageUrl: string;
  }[];
}

export interface DestinationDetailsResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationDetailsForTour;
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
  status: 'ACTIVE' | 'INACTIVE';
}

export interface InclusionInput {
  inclusionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ExclusionInput {
  exclusionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ConditionInput {
  conditionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TravelTipInput {
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AddTourRequest {
  name: string;
  description: string;
  tourType: number;
  tourCategory: number;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  season: number;
  status: 'ACTIVE' | 'INACTIVE';
  assignTo: number;
  assignMessage: string;
  destinations: TourDestinationInput[];
  images: TourImageInput[];
  inclusions: InclusionInput[];
  exclusions: ExclusionInput[];
  conditions: ConditionInput[];
  travelTips: TravelTipInput[];
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
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Exclusion {
  id: number;
  description: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Condition {
  id: number;
  description: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TravelTip {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
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
  statusName: 'ACTIVE' | 'INACTIVE';
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
export interface TourBasicDetails {
  tourName: string;
  tourDescription: string;
  tourType: number;
  tourCategory: number;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  season: number;
  status: 'ACTIVE' | 'INACTIVE';
  assignTo: number;
  assignMessage: string;
}

export interface UpdateDestinationInput {
  tourDestinationId: number;
  destinationId: number;
  activityId: number;
  dayNumber: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateImageInput {
  imageId: number;
  name: string;
  imageDescription: string;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateInclusionInput {
  inclusionId: number;
  inclusionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateExclusionInput {
  exclusionId: number;
  exclusionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateConditionInput {
  conditionId: number;
  conditionText: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateTravelTipInput {
  travelTipId: number;
  tipTitle: string;
  tipDescription: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateTourRequest {
  tourId: number;
  tourBasicDetails: TourBasicDetails;
  addDestinations: TourDestinationInput[];
  removeDestinations: number[];
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