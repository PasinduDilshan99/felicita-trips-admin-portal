// common-types.ts

export interface Image {
  imageId: number;
  imageUrl: string | null;
  imageName: string;
  imageDescription: string | null;
}

/* ================= ACTIVITY ================= */

export interface ActivityCategory {
  activityCategoryId: number;
  activityCategoryName: string;
  activityCategoryDescription: string;
  activityCategoryColor: string | null;
  activityCategoryHoverColor: string | null;
  activityCategoryImages: Image[];
}

/* ================= DESTINATION ================= */

export interface DestinationCategory {
  destinationCategoryId: number;
  destinationCategoryName: string;
  destinationCategoryDescription: string;
  destinationCategoryColor: string | null;
  destinationCategoryHoverColor: string | null;
  destinationCategoryImages: Image[];
}

/* ================= TOUR CATEGORY ================= */

export interface TourCategory {
  tourCategoryId: number;
  tourCategoryName: string;
  tourCategoryDescription: string;
  tourCategoryColor: string | null;
  tourCategoryHoverColor: string | null;
}

/* ================= PACKAGE CATEGORY ================= */

export interface PackageCategory {
  packageCategoryId: number;
  packageCategoryName: string;
  packageCategoryDescription: string;
  packageCategoryColor: string | null;
  packageCategoryHoverColor: string | null;
  packageCategoryImages: Image[];
}

/* ================= TOUR TYPE ================= */

export interface TourType {
  tourTypeId: number;
  tourTypeName: string;
  tourTypeDescription: string;
  tourTypeColor: string | null;
  tourTypeHoverColor: string | null;
}

/* ================= FULL RESPONSE DATA ================= */

export interface AllCategoriesData {
  activityCategoryList: ActivityCategory[];
  destinationCategoryList: DestinationCategory[];
  tourCategoryList: TourCategory[];
  packageCategoryList: PackageCategory[];
  tourTypeList: TourType[];
}

/* ================= API WRAPPER RESPONSE ================= */

export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}