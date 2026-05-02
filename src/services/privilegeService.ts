// services/privilegeService.ts

import {
  PrivilegeFilterParams,
  PrivilegeListApiResponse,
  PrivilegeNamesAndIdsApiResponse,
  PrivilegeDetailsApiResponse,
  PrivilegeBasicDetailsApiResponse,
  CreatePrivilegeRequest,
  CreatePrivilegeApiResponse,
  UpdatePrivilegeRequest,
  UpdatePrivilegeApiResponse,
  TerminatePrivilegeRequest,
  TerminatePrivilegeApiResponse,
  PrivilegeStatisticsApiResponse,
} from "@/types/privilege-types";
import {
  GET_ALL_PRIVILEGES_DATA_FE,
  GET_PRIVILEGES_NAMES_AND_IDS_DATA_FE,
  GET_PRIVILEGE_DETAILS_BY_ID_DATA_FE,
  GET_PRIVILEGE_BASIC_DETAILS_BY_ID_DATA_FE,
  CREATE_PRIVILEGE_DATA_FE,
  UPDATE_PRIVILEGE_DATA_FE,
  TERMINATE_PRIVILEGE_DATA_FE,
  GET_PRIVILEGES_STATISTICS_DATA_FE,
} from "@/utils/frontEndConstant";

export class PrivilegeService {
  /**
   * Get all privileges with pagination and filtering
   */
  static async getAllPrivileges(
    params: PrivilegeFilterParams,
  ): Promise<PrivilegeListApiResponse> {
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

      const response = await fetch(GET_ALL_PRIVILEGES_DATA_FE, {
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

      const data: PrivilegeListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch privileges");
      }

      return data;
    } catch (error) {
      console.error("Error fetching privileges:", error);
      throw error;
    }
  }

  /**
   * Get privilege names and IDs for dropdowns
   */
  static async getPrivilegesNamesAndIds(): Promise<PrivilegeNamesAndIdsApiResponse> {
    try {
      const response = await fetch(GET_PRIVILEGES_NAMES_AND_IDS_DATA_FE, {
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

      const data: PrivilegeNamesAndIdsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch privilege names and IDs");
      }

      return data;
    } catch (error) {
      console.error("Error fetching privilege names and IDs:", error);
      throw error;
    }
  }

  /**
   * Get privilege details by ID (includes associated roles)
   */
  static async getPrivilegeDetailsById(
    privilegeId: number,
  ): Promise<PrivilegeDetailsApiResponse> {
    try {
      const response = await fetch(GET_PRIVILEGE_DETAILS_BY_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ privilegeId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PrivilegeDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch privilege details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching privilege details:", error);
      throw error;
    }
  }

  /**
   * Get privilege basic details by ID (without roles)
   */
  static async getPrivilegeBasicDetailsById(
    privilegeId: number,
  ): Promise<PrivilegeBasicDetailsApiResponse> {
    try {
      const response = await fetch(GET_PRIVILEGE_BASIC_DETAILS_BY_ID_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ privilegeId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PrivilegeBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch privilege basic details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching privilege basic details:", error);
      throw error;
    }
  }

  /**
   * Create a new privilege
   */
  static async createPrivilege(
    privilegeData: CreatePrivilegeRequest,
  ): Promise<CreatePrivilegeApiResponse> {
    try {
      const response = await fetch(CREATE_PRIVILEGE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(privilegeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreatePrivilegeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create privilege");
      }

      return data;
    } catch (error) {
      console.error("Error creating privilege:", error);
      throw error;
    }
  }

  /**
   * Update an existing privilege
   */
  static async updatePrivilege(
    privilegeData: UpdatePrivilegeRequest,
  ): Promise<UpdatePrivilegeApiResponse> {
    try {
      const response = await fetch(UPDATE_PRIVILEGE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(privilegeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdatePrivilegeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update privilege");
      }

      return data;
    } catch (error) {
      console.error("Error updating privilege:", error);
      throw error;
    }
  }

  /**
   * Terminate a privilege
   */
  static async terminatePrivilege(
    privilegeId: number,
  ): Promise<TerminatePrivilegeApiResponse> {
    try {
      const requestBody: TerminatePrivilegeRequest = { id: privilegeId };
      
      const response = await fetch(TERMINATE_PRIVILEGE_DATA_FE, {
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

      const data: TerminatePrivilegeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate privilege");
      }

      return data;
    } catch (error) {
      console.error("Error terminating privilege:", error);
      throw error;
    }
  }

  /**
   * Get privilege statistics
   */
  static async getPrivilegesStatistics(): Promise<PrivilegeStatisticsApiResponse> {
    try {
      const response = await fetch(GET_PRIVILEGES_STATISTICS_DATA_FE, {
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

      const data: PrivilegeStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch privilege statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching privilege statistics:", error);
      throw error;
    }
  }

  /**
   * Helper method to validate privilege form data
   */
  static validatePrivilegeForm(formData: Partial<CreatePrivilegeRequest>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Privilege name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Privilege name must be at least 3 characters";
    } else if (formData.name.length > 100) {
      errors.name = "Privilege name must be less than 100 characters";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    return errors;
  }

  /**
   * Helper method to get default form data for create/update
   */
  static getDefaultFormData(): CreatePrivilegeRequest {
    return {
      name: "",
      description: "",
      status: "ACTIVE",
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
}