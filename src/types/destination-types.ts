// types/destination.ts

export interface Activity {
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
  categoryName: string;
  categoryDescription: string;
  statusName: string;
  activities: Activity[];
  images: Image[];
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

export interface ApiResponse {
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
  categoryName: string;
  categoryDescription: string;
  statusName: string;
  activities: Activity[];
  images: Image[];
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
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AddDestinationRequest {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
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