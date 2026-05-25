// services/roleService.ts

import {
  RoleFilterParams,
  RoleListApiResponse,
  RoleNamesAndIdsApiResponse,
  RoleDetailsApiResponse,
  RoleBasicDetailsApiResponse,
  CreateRoleRequest,
  CreateRoleApiResponse,
  UpdateRoleRequest,
  UpdateRoleApiResponse,
  TerminateRoleApiResponse,
  RoleStatisticsApiResponse,
} from "@/types/role-types";
import {
  GET_ALL_ROLES_DATA_FE,
  GET_ROLES_NAMES_AND_IDS_DATA_FE,
  GET_ROLE_DETAILS_BY_ID_DATA_FE,
  GET_ROLE_BASIC_DETAILS_BY_ID_DATA_FE,
  CREATE_ROLE_DATA_FE,
  UPDATE_ROLE_DATA_FE,
  TERMINATE_ROLE_DATA_FE,
  GET_ROLES_STATISTICS_DATA_FE,
} from "@/utils/frontEndConstant";

export class RoleService {
  /**
   * Get all roles with pagination and filtering
   */
  static async getAllRoles(
    params: RoleFilterParams,
  ): Promise<RoleListApiResponse> {
    try {
      const requestBody: any = {
        name: params.name || null,
        status: params.status || null,
        pageSize: params.pageSize,
        pageNumber: params.pageNumber,
      };

      if (params.sortBy) {
        requestBody.sortBy = params.sortBy;
      }
      if (params.sortDirection) {
        requestBody.sortDirection = params.sortDirection;
      }

      const response = await fetch(GET_ALL_ROLES_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoleListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch roles");
      }

      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }

  /**
   * Get role names and IDs for dropdowns
   */
  static async getRoleNamesAndIds(): Promise<RoleNamesAndIdsApiResponse> {
    try {
      const response = await fetch(GET_ROLES_NAMES_AND_IDS_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoleNamesAndIdsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch role names and IDs");
      }

      return data;
    } catch (error) {
      console.error("Error fetching role names and IDs:", error);
      throw error;
    }
  }

  /**
   * Get role details by ID (includes associated privileges)
   */
  static async getRoleDetailsById(
    roleId: number,
  ): Promise<RoleDetailsApiResponse> {
    try {
      const response = await fetch(GET_ROLE_DETAILS_BY_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoleDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch role details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching role details:", error);
      throw error;
    }
  }

  /**
   * Get role basic details by ID (without privileges)
   */
  static async getRoleBasicDetailsById(
    roleId: number,
  ): Promise<RoleBasicDetailsApiResponse> {
    try {
      const response = await fetch(GET_ROLE_BASIC_DETAILS_BY_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoleBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch role basic details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching role basic details:", error);
      throw error;
    }
  }

  /**
   * Create a new role
   */
  static async createRole(
    roleData: CreateRoleRequest,
  ): Promise<CreateRoleApiResponse> {
    try {
      const response = await fetch(CREATE_ROLE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateRoleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create role");
      }

      return data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  }

  /**
   * Update an existing role
   */
  static async updateRole(
    roleData: UpdateRoleRequest,
  ): Promise<UpdateRoleApiResponse> {
    try {
      const response = await fetch(UPDATE_ROLE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateRoleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update role");
      }

      return data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  }

  /**
   * Terminate a role
   */
  static async terminateRole(
    roleId: number,
  ): Promise<TerminateRoleApiResponse> {
    try {
      const response = await fetch(TERMINATE_ROLE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TerminateRoleApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate role");
      }

      return data;
    } catch (error) {
      console.error("Error terminating role:", error);
      throw error;
    }
  }

  /**
   * Get role statistics
   */
  static async getRolesStatistics(): Promise<RoleStatisticsApiResponse> {
    try {
      const response = await fetch(GET_ROLES_STATISTICS_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoleStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch role statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching role statistics:", error);
      throw error;
    }
  }

  /**
   * Helper method to validate role form data
   */
  static validateRoleForm(
    formData: Partial<CreateRoleRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Role name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Role name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      errors.name = "Role name must be less than 50 characters";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.privilegesIds || formData.privilegesIds.length === 0) {
      errors.privilegesIds = "At least one privilege must be selected";
    }

    return errors;
  }

  /**
   * Helper method to get default form data for create/update
   */
  static getDefaultFormData(): CreateRoleRequest {
    return {
      name: "",
      description: "",
      status: "ACTIVE",
      privilegesIds: [],
    };
  }

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to format privilege IDs for display
   */
  static formatPrivilegeIds(privilegeIds: number[]): string {
    if (!privilegeIds || privilegeIds.length === 0) return "None";
    if (privilegeIds.length <= 3) return privilegeIds.join(", ");
    return `${privilegeIds.slice(0, 3).join(", ")} +${privilegeIds.length - 3} more`;
  }
}
