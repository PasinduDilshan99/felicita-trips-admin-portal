// types/destination.ts
export interface Activity {
  activityId: number;
  activityName: string;
  activityDescription: string;
  activityCategories: string[];
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  season: string;
}

export interface Image {
  imageId: number;
  imageName: string;
  imageDescription: string;
  imageUrl: string;
}

export interface Destination {
  destinationId: number;
  destinationName: string;
  destinationDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  wish: boolean;
  rating: number;
  destinationCategoryDetailsDtos: DestinationCategoryDetailsDtos[];
  statusName: string;
  activities: Activity[];
  images: Image[];
}

export interface DestinationCategoryDetailsDtos {
  id: number;
  name: string;
  description: string;
  isPrimary: boolean;
}

export interface DestinationFilterParams {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  duration: number | null;
  destinationCategory: string | null;
  season: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
}

export interface DestinationResponse {
  destinationCount: number;
  destinationResponseDtos: Destination[];
}

export interface DestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationResponse;
  timestamp: string;
}

export interface SingleDestinationResponse {
  destinationId: number;
  destinationName: string;
  destinationDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  wish:boolean;
  destinationCategoryDetailsDtos: DestinationCategoryDetailsDtos[];
  statusName: string;
  activities: Activity[];
  images: Image[];
  extraPrice?: number;
  extraPriceNote?: string;
}

export interface SingleDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: SingleDestinationResponse;
  timestamp: string;
}

export interface DestinationImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface AddDestinationRequest {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  destinationCategory: string;
  location: string;
  latitude: number;
  longitude: number;
  extraPrice?: number;
  extraPriceNote?: string;
  images: DestinationImageRequest[];
}

export interface AddDestinationResponse {
  message: string;
}

export interface AddDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddDestinationResponse;
  timestamp: string;
}

export interface DestinationForTerminate {
  destinationId: number;
  destinationName: string;
}

export interface DestinationsForTerminateResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationForTerminate[];
  timestamp: string;
}

export interface TerminateDestinationRequest {
  destinationId: number;
}

export interface TerminateDestinationResponse {
  message: string;
}

export interface TerminateDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminateDestinationResponse;
  timestamp: string;
}

export interface NewActivityRequest {
  name: string;
  description: string;
  activityCategory: string;
  durationHover: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasons: string[];
  status: "ACTIVE" | "INACTIVE";
  activityImages: NewImageRequest[];
}

// For new images to be added
export interface NewImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Update destination request
export interface UpdateDestinationRequest {
  destinationId: number;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  destinationCategory: string;
  location: string;
  latitude: number;
  longitude: number;
  extraPrice?: number;
  extraPriceNote?: string;
  removeImages: number[];
  newImages: NewImageRequest[];
  removeActivities: number[];
  newActivities: NewActivityRequest[];
}

export interface UpdateDestinationResponse {
  message: string;
  id: number;
}

export interface UpdateDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: UpdateDestinationResponse;
  timestamp: string;
}

export interface DestinationDetails {
  totalDestinationCount: number;
  activeDestinations: number;
  inActiveDestinations: number;
  hiddenDestinations: number;
  recentlyUpdateDestinations: number;
  recentlyAddedDestinations: number;
}

export interface WishDetails {
  wishListCount: number;
  notWishListCount: number;
}

export interface CategoryDetail {
  categoryId: number;
  categoryName: string;
  count: number;
}

export interface DestinationStatisticsData {
  destinationDetails: DestinationDetails;
  wishDetails: WishDetails;
  categoryDetails: CategoryDetail[];
}

export interface DestinationStatisticsApiResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationStatisticsData;
  timestamp: string;
}
