// types/tour-category-types.ts

import { ApiResponse } from "./common-types";

// Image Types
export interface TourCategoryImage {
  imageId: number;
  name: string;
  description: string | null;
  imageUrl: string;
  status: string;
}

export interface TourCategoryImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateTourCategoryImageRequest {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Tour Reference
export interface TourCategoryTourReference {
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
  primaryCategory: boolean;
}

// Tour Category Basic Types
export interface TourCategoryBasic {
  categoryId: number;
  categoryName: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  images: TourCategoryImage[];
}

export type TourCategoryBasicApiResponse = ApiResponse<TourCategoryBasic>;

// Tour Category List Item
export interface TourCategoryListItem {
  categoryId: number;
  categoryName: string;
  description: string;
  color: string | null;
  hoverColor: string | null;
  status: string;
  images: TourCategoryImage[] | null;
}

export type TourCategoryListApiResponse = ApiResponse<TourCategoryListItem[]>;

// Tour Category Details Response
export interface TourCategoryDetails {
  categoryId: number;
  categoryName: string;
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
  images: TourCategoryImage[];
  tours: TourCategoryTourReference[];
}

export type TourCategoryDetailsApiResponse = ApiResponse<TourCategoryDetails>;

// Add Tour Category Request
export interface AddTourCategoryRequest {
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  tourIds: number[];
  images: TourCategoryImageRequest[];
}

export interface AddTourCategoryResponse {
  message: string;
}

export type AddTourCategoryApiResponse = ApiResponse<AddTourCategoryResponse>;

// Update Tour Category Request
export interface UpdateTourCategoryRequest {
  categoryId: number;
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  addTourIds: number[];
  removeTourIds: number[];
  addImages: TourCategoryImageRequest[];
  updateImages: UpdateTourCategoryImageRequest[];
  removeImageIds: number[];
}

export interface UpdateTourCategoryResponse {
  message: string | null;
  id: number | null;
}

export type UpdateTourCategoryApiResponse = ApiResponse<UpdateTourCategoryResponse>;

// Terminate Tour Category Request
export interface TerminateTourCategoryRequest {
  id: number;
}

export interface TerminateTourCategoryResponse {
  message: string;
}

export type TerminateTourCategoryApiResponse = ApiResponse<TerminateTourCategoryResponse>;

// Get Tour Category Details Request
export interface GetTourCategoryDetailsRequest {
  id: number;
}

// Get Tour Category Basic Details Request
export interface GetTourCategoryBasicDetailsRequest {
  id: number;
}