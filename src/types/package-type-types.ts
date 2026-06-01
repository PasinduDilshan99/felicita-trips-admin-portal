// types/package-type-types.ts

import { ApiResponse } from "./common-types";

// Image Types
export interface PackageTypeImage {
  imageId: number;
  name: string;
  description: string | null;
  imageUrl: string;
  status: string;
}

export interface PackageTypeImageRequest {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdatePackageTypeImageRequest {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

// Package Basic Details Reference
export interface PackageBasicDetail {
  packageId: number;
  packageName: string;
  description: string | null;
  color: string | null;
  status: string;
  hoverColor: string | null;
  startDate: string | null;
  endDate: string | null;
  primaryType: boolean;
}

// Package Type List Item
export interface PackageTypeListItem {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  images: PackageTypeImage[];
}

export type PackageTypeListApiResponse = ApiResponse<PackageTypeListItem[]>;

// Package Type Details Response
export interface PackageTypeDetails {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  createdAt: string;
  createdBy: number;
  createdByName: string;
  updatedAt: string;
  updatedBy: number;
  updatedByName: string | null;
  terminatedAt: string | null;
  terminatedBy: number;
  totalPackages: number;
  images: PackageTypeImage[];
  packageBasicDetails: PackageBasicDetail[];
}

export type PackageTypeDetailsApiResponse = ApiResponse<PackageTypeDetails>;

// Package Type Basic Details Response
export interface PackageTypeBasicDetails {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  images: PackageTypeImage[];
}

export type PackageTypeBasicDetailsApiResponse =
  ApiResponse<PackageTypeBasicDetails>;

// Add Package Type Request
export interface AddPackageTypeRequest {
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  images: PackageTypeImageRequest[];
}

export interface AddPackageTypeResponse {
  message: string;
}

export type AddPackageTypeApiResponse = ApiResponse<AddPackageTypeResponse>;

// Update Package Type Request
export interface UpdatePackageTypeRequest {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  hoverColor: string;
  status: "ACTIVE" | "INACTIVE";
  addImages: PackageTypeImageRequest[];
  updateImages: UpdatePackageTypeImageRequest[];
  removeImageIds: number[];
}

export interface UpdatePackageTypeResponse {
  message: string | null;
  id: number | null;
}

export type UpdatePackageTypeApiResponse =
  ApiResponse<UpdatePackageTypeResponse>;

// Terminate Package Type Request
export interface TerminatePackageTypeRequest {
  id: number;
}

export interface TerminatePackageTypeResponse {
  message: string;
}

export type TerminatePackageTypeApiResponse =
  ApiResponse<TerminatePackageTypeResponse>;

// Get Package Type Details Request
export interface GetPackageTypeDetailsRequest {
  id: number;
}

// Get Package Type Basic Details Request
export interface GetPackageTypeBasicDetailsRequest {
  id: number;
}

export interface PackageTypeFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export interface PackageTypeCardProps {
  packageType: PackageTypeListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface PackageTypeListCardProps {
  packageType: PackageTypeListItem;
  onImageClick?: (imageIndex: number) => void;
}

export interface PackageTypeOverviewProps {
  name: string;
  description: string;
  color: string | null | undefined;
  hoverColor: string | null | undefined;
}

export interface PackageTypePackagesListProps {
  packages: PackageBasicDetail[];
  packageTypeColor: string;
  onViewPackage: (packageId: number, packageName: string) => void;
}

export interface PackageTypeReadOnlyDetailsProps {
  type: PackageTypeDetails;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
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

export interface PackageTypeSearchItem {
  id: number;
  name: string;
}

export interface BasicInfoPanelProps {
  packageTypeDetails: PackageTypeDetails;
}

export interface PackagesListProps {
  packages: PackageBasicDetail[];
}

export interface PackageTypeStatsProps {
  packageTypeDetails: PackageTypeDetails;
}

export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}
