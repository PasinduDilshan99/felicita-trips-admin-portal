// types/role-types.ts

import { ApiResponse } from "./common-types";

// Basic Role Interfaces
export interface Role {
  roleId: number;
  roleName: string;
  roleDescription: string | null;
  roleStatus: string;
}

export interface RoleNameAndId {
  id: number;
  name: string;
}

export interface PrivilegeInRole {
  privilegeId: number;
  privilegeName: string;
  privilegeDescription: string | null;
  privilegeStatus: string;
}

export interface RoleDetails extends Role {
  privileges: PrivilegeInRole[];
}

export interface RoleBasicDetails extends Role {}

// Filter Parameters for Roles
export interface RoleFilterParams {
  name: string | null;
  status: string | null;
  pageSize: number;
  pageNumber: number;
  sortBy?: "name" | "roleId" | "roleStatus" | "createdAt" | "updatedAt";
  sortDirection?: "ASC" | "DESC";
}

// Response Types
export interface RoleListResponse {
  roleResponses: Role[];
  totalResponse: number;
  pageNumber: number;
}

export type RoleListApiResponse = ApiResponse<RoleListResponse>;

export type RoleNamesAndIdsApiResponse = ApiResponse<RoleNameAndId[]>;

export type RoleDetailsApiResponse = ApiResponse<RoleDetails>;

export type RoleBasicDetailsApiResponse = ApiResponse<RoleBasicDetails>;

// Create Role
export interface CreateRoleRequest {
  name: string;
  status: string;
  description: string;
  privilegesIds: number[];
}

export interface CreateRoleResponse {
  message: string;
}

export type CreateRoleApiResponse = ApiResponse<CreateRoleResponse>;

// Update Role
export interface UpdatePrivilegeInRole {
  roleId: number;
  privilegeId: number;
  status: string;
}

export interface UpdateRoleRequest {
  id: number;
  name: string;
  status:string;
  description: string;
  addPrivilegesIds: number[];
  removePrivilegesIds: number[];
  updatePrivileges: UpdatePrivilegeInRole[];
}

export interface UpdateRoleResponse {
  message: string;
  id: number;
}

export type UpdateRoleApiResponse = ApiResponse<UpdateRoleResponse>;

// Terminate Role
export interface TerminateRoleRequest {
  roleId: number;
}

export interface TerminateRoleResponse {
  message: string;
}

export type TerminateRoleApiResponse = ApiResponse<TerminateRoleResponse>;

// Statistics Types
export interface RoleDetailsStats {
  totalCount: number;
  activeCount: number;
  inActiveCount: number;
  hiddenCount: number;
  recentlyUpdateCount: number;
  recentlyAddedCount: number;
}

export interface UserActivityStats {
  username: string | null;
  userId: number;
  count: number;
}

export interface RoleUsage {
  roleId: number;
  roleName: string;
  userCount: number;
}

export interface RoleStatisticsData {
  roleDetails: RoleDetailsStats;
  recentlyUpdates: UserActivityStats[];
  recentlyCreate: UserActivityStats[];
  recentlyTerminate: UserActivityStats[];
  roleUsages: RoleUsage[];
}

export type RoleStatisticsApiResponse = ApiResponse<RoleStatisticsData>;

export interface RoleCardProps {
  role: Role;
}

export interface RoleListCardProps {
  role: Role;
}

export interface RoleSearchItem {
  id: number;
  name: string;
}