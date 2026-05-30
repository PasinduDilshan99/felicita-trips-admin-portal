// types/tour-type-types.ts

import { ApiResponse } from "./common-types";
import { TourNameId } from "./tour-types";

// Image Types
export interface TourTypeImage {
  imageId: number;
  name: string;
  description: string | null;
  imageUrl: string;
  status: string;
}

export interface TourTypeImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTourTypeImageRequest {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Tour Reference
export interface TourReference {
  tourId: number;
  tourName: string;
  description: string;
  duration: number;
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
  season: string;
  status: string;
  primaryType: boolean;
}

// Tour Type Basic Types
export interface TourTypeBasic {
  typeId: number;
  typeName: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  images: TourTypeImage[];
}

export type TourTypeBasicApiResponse = ApiResponse<TourTypeBasic>;

// Tour Type List Item
export interface TourTypeListItem {
  typeId: number;
  typeName: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
  status: string;
  images: TourTypeImage[];
}

export type TourTypeListApiResponse = ApiResponse<TourTypeListItem[]>;

// Tour Type Details Response
export interface TourTypeDetails {
  typeId: number;
  typeName: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  createdAt: string;
  createdBy: number;
  createdByName: string;
  updatedAt: string;
  updatedBy: number | null;
  updatedByName: string | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
  totalTours: number;
  images: TourTypeImage[];
  tours: TourReference[];
}

export type TourTypeDetailsApiResponse = ApiResponse<TourTypeDetails>;

// Add Tour Type Request
export interface AddTourTypeRequest {
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  tourIds: number[];
  images: TourTypeImageRequest[];
}

export interface AddTourTypeResponse {
  message: string;
}

export type AddTourTypeApiResponse = ApiResponse<AddTourTypeResponse>;

// Update Tour Type Request
export interface UpdateTourTypeRequest {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  addTourIds: number[];
  removeTourIds: number[];
  addImages: TourTypeImageRequest[];
  updateImages: UpdateTourTypeImageRequest[];
  removeImageIds: number[];
}

export interface UpdateTourTypeResponse {
  message: string | null;
  id: number | null;
}

export type UpdateTourTypeApiResponse = ApiResponse<UpdateTourTypeResponse>;

// Terminate Tour Type Request
export interface TerminateTourTypeRequest {
  id: number;
}

export interface TerminateTourTypeResponse {
  message: string;
}

export type TerminateTourTypeApiResponse =
  ApiResponse<TerminateTourTypeResponse>;

// Get Tour Type Details Request
export interface GetTourTypeDetailsRequest {
  id: number;
}

// Get Tour Type Basic Details Request
export interface GetTourTypeBasicDetailsRequest {
  id: number;
}

export interface TourTypeFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export interface TourTypeCardProps {
  tourType: TourTypeListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface TourTypeListCardProps {
  tourType: TourTypeListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface TourTypeOverviewProps {
  name: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
}

export interface TourTypeToursListProps {
  tours: TourReference[];
  tourTypeColor: string;
}

export interface TourTypeReadOnlyDetailsProps {
  tourType: TourTypeDetails;
  allTours: TourNameId[];
  loadingTours: boolean;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onAddTour: (tourId: number) => void;
  onRemoveTour: (tourId: number) => void;
  onSetPrimaryTour: (tourId: number) => void;
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

export interface TourTypeSearchItem {
  id: number;
  name: string;
}

export interface BasicInfoPanelProps {
  tourTypeDetails: TourTypeBasic;
}

export interface TourTypeStatsProps {
  tourTypeDetails: TourTypeBasic;
}
 
export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}