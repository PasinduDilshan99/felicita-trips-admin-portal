// utils/category-adapters.ts
import {
  DestinationCategory,
  ActivityCategory as ActivityCategoryType,
  TourCategory,
  PackageCategory,
  TourType,
} from "@/types/common-types";

export interface NormalizedCategory {
  id: number;
  name: string;
  color: string | null;
  hoverColor: string | null;
  description: string | null;
}

// Destination Category Adapter
export const adaptDestinationCategories = (
  categories: DestinationCategory[]
): NormalizedCategory[] => {
  return categories.map((cat) => ({
    id: cat.destinationCategoryId,
    name: cat.destinationCategoryName,
    color: cat.destinationCategoryColor,
    hoverColor: cat.destinationCategoryHoverColor,
    description: cat.destinationCategoryDescription,
  }));
};

// Activity Category Adapter
export const adaptActivityCategories = (
  categories: ActivityCategoryType[]
): NormalizedCategory[] => {
  return categories.map((cat) => ({
    id: cat.activityCategoryId,
    name: cat.activityCategoryName,
    color: cat.activityCategoryColor,
    hoverColor: cat.activityCategoryHoverColor,
    description: cat.activityCategoryDescription,
  }));
};

// Tour Category Adapter
export const adaptTourCategories = (
  categories: TourCategory[]
): NormalizedCategory[] => {
  return categories.map((cat) => ({
    id: cat.tourCategoryId,
    name: cat.tourCategoryName,
    color: cat.tourCategoryColor,
    hoverColor: cat.tourCategoryHoverColor,
    description: cat.tourCategoryDescription,
  }));
};

// Package Category Adapter
export const adaptPackageCategories = (
  categories: PackageCategory[]
): NormalizedCategory[] => {
  return categories.map((cat) => ({
    id: cat.packageCategoryId,
    name: cat.packageCategoryName,
    color: cat.packageCategoryColor,
    hoverColor: cat.packageCategoryHoverColor,
    description: cat.packageCategoryDescription,
  }));
};

// Tour Type Adapter
export const adaptTourTypes = (
  types: TourType[]
): NormalizedCategory[] => {
  return types.map((type) => ({
    id: type.tourTypeId,
    name: type.tourTypeName,
    color: type.tourTypeColor,
    hoverColor: type.tourTypeHoverColor,
    description: type.tourTypeDescription,
  }));
};