// types/activity-category-types.ts

import { ApiResponse } from "./common-types";

// Image Types
export interface ActivityCategoryImage {
  imageId: number;
  imageName: string;
  imageDescription: string | null;
  imageUrl: string;
  imageStatus: string;
  createdAt: string;
  createdBy: number | null;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

export interface ActivityCategoryImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Activity Reference
export interface PrimaryActivity {
  activityId: number;
  activityName: string;
}

export interface OtherActivity {
  activityId: number;
  activityName: string;
}

// Activity Category Types
export interface ActivityCategory {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryStatus: "ACTIVE" | "INACTIVE" | "TERMINATED";
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
  numberOfActivities: number;
  color: string;
  hoverColor: string;
  images: ActivityCategoryImage[];
}

export type ActivityCategoryListApiResponse = ApiResponse<ActivityCategory[]>;

// Activity Category Details Response
export interface ActivityCategoryDetails {
  categoryId: number;
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  createdAt: string;
  createdBy: number;
  createdByName: string;
  updatedAt: string;
  updatedBy: number | null;
  updatedByName: string | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
  images: ActivityCategoryImage[];
  primaryActivities: PrimaryActivity[];
  otherActivities: OtherActivity[];
}

export type ActivityCategoryDetailsApiResponse =
  ApiResponse<ActivityCategoryDetails>;

// Add Activity Category Request
export interface AddActivityCategoryRequest {
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  activityIds: number[];
  images: ActivityCategoryImageRequest[];
}

export interface AddActivityCategoryResponse {
  message: string;
}

export type AddActivityCategoryApiResponse =
  ApiResponse<AddActivityCategoryResponse>;

// Update Activity Category Request
export interface UpdateActivityCategoryRequest {
  categoryId: number;
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  removeActivityIds: number[];
  addActivityIds: number[];
  addImages: ActivityCategoryImageRequest[];
  removeImageIds: number[];
  updateImages: UpdateActivityCategoryImageRequest[];
}

export interface UpdateActivityCategoryImageRequest {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateActivityCategoryResponse {
  message: string;
  id: number;
}

export type UpdateActivityCategoryApiResponse =
  ApiResponse<UpdateActivityCategoryResponse>;

// Terminate Activity Category Request
export interface TerminateActivityCategoryRequest {
  id: number;
}

export interface TerminateActivityCategoryResponse {
  message: string;
}

export type TerminateActivityCategoryApiResponse =
  ApiResponse<TerminateActivityCategoryResponse>;

// Get Activity Category Details Request
export interface GetActivityCategoryDetailsRequest {
  id: number;
}
