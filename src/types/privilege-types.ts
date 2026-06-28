// types/privilege-types.ts

import { ApiResponse } from "./common-types";

// Basic Privilege Interfaces
export interface Privilege {
  privilegeId: number;
  privilegeName: string;
  privilegeDescription: string | null;
  privilegeStatus: string;
}

export interface PrivilegeNameAndId {
  id: number;
  name: string;
}

export interface RoleInPrivilege {
  roleId: number;
  roleName: string;
  roleDescription: string | null;
  roleStatus: string;
}

export interface PrivilegeDetails extends Privilege {
  roles: RoleInPrivilege[];
}

export interface PrivilegeBasicDetails extends Privilege {}

// Filter Parameters for Privileges
export interface PrivilegeFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy?:
    | "name"
    | "privilegeId"
    | "privilegeStatus"
    | "createdAt"
    | "updatedAt";
  sortDirection?: "ASC" | "DESC";
}

// Response Types
export interface PrivilegeListResponse {
  privilegeResponses: Privilege[];
  totalResponse: number;
  pageNumber: number;
}

export type PrivilegeListApiResponse = ApiResponse<PrivilegeListResponse>;

export type PrivilegeNamesAndIdsApiResponse = ApiResponse<PrivilegeNameAndId[]>;

export type PrivilegeDetailsApiResponse = ApiResponse<PrivilegeDetails>;

export type PrivilegeBasicDetailsApiResponse =
  ApiResponse<PrivilegeBasicDetails>;

// Create Privilege
export interface CreatePrivilegeRequest {
  name: string;
  status: string;
  description: string;
}

export interface CreatePrivilegeResponse {
  message: string;
}

export type CreatePrivilegeApiResponse = ApiResponse<CreatePrivilegeResponse>;

// Update Privilege
export interface UpdatePrivilegeRequest {
  id: number;
  name: string;
  status: string;
  description: string;
}

export interface UpdatePrivilegeResponse {
  message: string;
  id: number;
}

export type UpdatePrivilegeApiResponse = ApiResponse<UpdatePrivilegeResponse>;

// Terminate Privilege
export interface TerminatePrivilegeRequest {
  id: number;
}

export interface TerminatePrivilegeResponse {
  message: string;
}

export type TerminatePrivilegeApiResponse =
  ApiResponse<TerminatePrivilegeResponse>;

// Statistics Types
export interface PrivilegeDetailsStats {
  totalCount: number;
  activeCount: number;
  inActiveCount: number;
  hiddenCount: number;
  recentlyUpdateCount: number;
  recentlyAddedCount: number;
}

export interface UserActivityStats {
  username: string;
  userId: number;
  count: number;
}

export interface PrivilegeStatisticsData {
  privilegeDetails: PrivilegeDetailsStats;
  recentlyUpdates: UserActivityStats[];
  recentlyCreate: UserActivityStats[];
  recentlyTerminate: UserActivityStats[];
}

export type PrivilegeStatisticsApiResponse =
  ApiResponse<PrivilegeStatisticsData>;

export interface PrivilegeCardProps {
  privilege: Privilege;
}

export interface PrivilegeListCardProps {
  privilege: Privilege;
}

export interface PrivilegeSearchItem {
  id: number;
  name: string;
}
