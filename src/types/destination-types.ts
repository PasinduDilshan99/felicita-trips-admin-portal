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
  sortBy?: string; // Optional: "name", "ratings", "location", "destination_id", "created_at", "updated_at"
  sortDirection?: "ASC" | "DESC"; // Optional: "ASC" or "DESC"
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
  wish: boolean;
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
  status: string;
  destinationCategoriesIdList: number[];
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
  addActivityCategoriesId: number[];
  removeActivityCategoriesId: number[];
  durationHover: number;
  availableFrom: string;
  availableTo: string;
  priceLocal: number;
  priceForeigners: number;
  minParticipate: number;
  maxParticipate: number;
  seasonId: number;
  status: string;
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
  status: string;
  removedestinationCategoriesIdList: number[];
  adddestinationCategoriesIdList: number[];
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

export interface DestinationCategoriesDetails {
  totalDestinationCategoriesCount: number;
  activeDestinationsCategories: number;
  inActiveDestinationsCategories: number;
  terminateDestinationsCategories: number;
  recentlyUpdateDestinationsCategories: number;
  recentlyAddedDestinationsCategories: number;
}

export interface CategoryUsedDetail {
  categoryId: number;
  categoryName: string;
  count: number;
  color: string;
  hoverColor: string;
}

export interface CategoryImagesCount {
  categoryId: number;
  categoryName: string;
  imagesCount: number;
  color: string;
  hoverColor: string;
}

export interface DestinationCategoriesStatisticsData {
  destinationCategoriesDetails: DestinationCategoriesDetails;
  categoryUsedDetails: CategoryUsedDetail[];
  categoriesImagesCounts: CategoryImagesCount[];
}

export interface DestinationCategoriesStatisticsApiResponse {
  code: number;
  status: string;
  message: string;
  data: DestinationCategoriesStatisticsData;
  timestamp: string;
}

export interface CategoryImage {
  imageId: number;
  imageName: string;
  imageDescription: string | null;
  imageUrl: string;
  imageStatus: string;
  imageCreatedAt: string;
}

export interface ActiveCategory {
  categoryId: number;
  category: string;
  categoryDescription: string;
  categoryStatus: string;
  color: string;
  hoverColor: string;
  createdAt: string;
  updatedAt: string;
  images: CategoryImage[];
}

export interface ActiveCategoriesApiResponse {
  code: number;
  status: string;
  message: string;
  data: ActiveCategory[];
  timestamp: string;
}

export interface CategoryDestination {
  destinationId: number;
  destinationName: string;
  destinationDescription: string;
  location: string;
  ratings: number;
  destinationStatus: string;
  primary: boolean;
}

export interface CategoryDetailsByIdResponse {
  categoryId: number;
  category: string;
  categoryDescription: string;
  categoryStatus: string;
  color: string;
  hoverColor: string;
  createdAt: string;
  updatedAt: string;
  images: CategoryImage[];
  destinations: CategoryDestination[];
}

export interface CategoryDetailsByIdApiResponse {
  code: number;
  status: string;
  message: string;
  data: CategoryDetailsByIdResponse;
  timestamp: string;
}

// Add these to your existing types/destination-types.ts file

// Add Destination Category Types
export interface AddDestinationCategoryImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface AddDestinationCategoryRequest {
  category: string;
  description: string;
  status: string;
  color: string;
  hoverColor: string;
  images: AddDestinationCategoryImageRequest[];
}

export interface AddDestinationCategoryResponse {
  message: string;
}

export interface AddDestinationCategoryApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddDestinationCategoryResponse;
  timestamp: string;
}

// Update Destination Category Types
export interface UpdateDestinationCategoryImageRequest {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateDestinationCategoryRequest {
  categoryId: number;
  category: string;
  description: string;
  status: string;
  color: string;
  hoverColor: string;
  removeImageIds: number[];
  updateImages: UpdateDestinationCategoryImageRequest[];
  newImages: AddDestinationCategoryImageRequest[];
}

export interface UpdateDestinationCategoryResponse {
  message: string;
  id: number;
}

export interface UpdateDestinationCategoryApiResponse {
  code: number;
  status: string;
  message: string;
  data: UpdateDestinationCategoryResponse;
  timestamp: string;
}

// Terminate Destination Category Types
export interface TerminateDestinationCategoryRequest {
  destinationCategoryId: number;
}

export interface TerminateDestinationCategoryResponse {
  message: string;
}

export interface TerminateDestinationCategoryApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminateDestinationCategoryResponse;
  timestamp: string;
}

// Add these to your existing types/destination-types.ts file

// Trending Destination Types
export interface TrendingDestinationCategoryDetail {
  id: number;
  name: string;
  description: string;
  isPrimary: boolean;
}

export interface TrendingDestinationImage {
  imageId: number;
  imageName: string;
  imageDescription: string | null;
  imageUrl: string;
  imageStatus: string | null;
  imageCreatedAt: string | null;
}

export interface TrendingDestinationActivity {
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
  maxParticipate: number | null;
  season: string;
}

export interface TrendingDestination {
  popularId: number;
  rating: number;
  popularity: number;
  popularCreatedAt: string;
  destinationId: number;
  destinationName: string;
  destinationDescription: string;
  location: string;
  latitude: number;
  longitude: number;
  destinationStatus: string;
  destinationCategoryDetailsDtos: TrendingDestinationCategoryDetail[];
  images: TrendingDestinationImage[];
  activities: TrendingDestinationActivity[];
}

export interface TrendingDestinationsApiResponse {
  code: number;
  status: string;
  message: string;
  data: TrendingDestination[];
  timestamp: string;
}

// Add Trending Destination Request
export interface AddTrendingDestinationRequest {
  destinationId: number;
  destinationName: string;
  status: string;
}

export interface AddTrendingDestinationResponse {
  message: string;
}

export interface AddTrendingDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: AddTrendingDestinationResponse;
  timestamp: string;
}

// Terminate Trending Destination Request
export interface TerminateTrendingDestinationRequest {
  destinationId: number;
  destinationName: string;
  status: string;
}

export interface TerminateTrendingDestinationResponse {
  message: string;
}

export interface TerminateTrendingDestinationApiResponse {
  code: number;
  status: string;
  message: string;
  data: TerminateTrendingDestinationResponse;
  timestamp: string;
}

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

export interface DestinationCardProps {
  destination: Destination;
  onImageClick?: (imageIndex: number) => void;
}

export interface DestinationListCardProps {
  destination: Destination;
  onImageClick?: (imageIndex: number) => void;
}

export interface IconBadgeProps {
  icon: React.ElementType;
  color?: string;
}

export interface LocationMapProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DestinationInfoFormProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export interface LocationFormProps {
  formData: any;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGetCurrentLocation: () => void;
}

