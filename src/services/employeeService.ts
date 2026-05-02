// services/employeeService.ts

import {
  CeoDetailsApiResponse,
  CreateEmployeeApiResponse,
  CreateEmployeeRequest,
  EmployeeBasicListApiResponse,
  EmployeeCreateDataApiResponse,
  EmployeeFilterOptionsApiResponse,
  EmployeeFilterParams,
  EmployeeFullDetailsApiResponse,
  EmployeeStatisticsApiResponse,
} from "@/types/employee-types";
import {
  CREATE_EMPLOYEE_DATA_FE,
  GET_CEO_DETAILS_DATA_FE,
  GET_EMPLOYEE_BASIC_DETAILS_DATA_FE,
  GET_EMPLOYEE_BASIC_DETAILS_PARAMS_DATA_FE,
  GET_EMPLOYEE_CREATE_DATA_FE,
  GET_EMPLOYEE_FULL_DETAILS_DATA_FE,
  GET_EMPLOYEE_STATISTICS_DATA_FE,
} from "@/utils/frontEndConstant";

export class EmployeeService {
  /**
   * Get CEO details
   */
  static async getCeoDetails(): Promise<CeoDetailsApiResponse> {
    try {
      const response = await fetch(GET_CEO_DETAILS_DATA_FE, {
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

      const data: CeoDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch CEO details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching CEO details:", error);
      throw error;
    }
  }

  /**
   * Get employee basic details with pagination and filtering
   */
  static async getEmployeeBasicDetails(
    params: EmployeeFilterParams,
  ): Promise<EmployeeBasicListApiResponse> {
    try {
      const requestBody: any = {
        name: params.name || null,
        employeeTypeId: params.employeeTypeId || null,
        status: params.status || null,
        departmentId: params.departmentId || null,
        employmentType: params.employmentType || null,
        workLocation: params.workLocation || null,
        employeeGrade: params.employeeGrade || null,
        supervisorId: params.supervisorId || null,
        reportingManagerId: params.reportingManagerId || null,
        pageSize: params.pageSize,
        pageNumber: params.pageNumber,
      };

      if (params.sortBy) {
        requestBody.sortBy = params.sortBy;
      }
      if (params.sortDirection) {
        requestBody.sortDirection = params.sortDirection;
      }

      const response = await fetch(GET_EMPLOYEE_BASIC_DETAILS_DATA_FE, {
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

      const data: EmployeeBasicListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch employee basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching employee basic details:", error);
      throw error;
    }
  }

  /**
   * Get employee full details by ID
   */
  static async getEmployeeFullDetails(
    employeeId: number,
  ): Promise<EmployeeFullDetailsApiResponse> {
    try {
      const response = await fetch(GET_EMPLOYEE_FULL_DETAILS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ employeeId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EmployeeFullDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch employee full details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching employee full details:", error);
      throw error;
    }
  }

  /**
   * Get employee statistics
   */
  static async getEmployeeStatistics(): Promise<EmployeeStatisticsApiResponse> {
    try {
      const response = await fetch(GET_EMPLOYEE_STATISTICS_DATA_FE, {
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

      const data: EmployeeStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch employee statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching employee statistics:", error);
      throw error;
    }
  }

  static async createEmployee(
    employeeData: CreateEmployeeRequest,
  ): Promise<CreateEmployeeApiResponse> {
    try {
      const response = await fetch(CREATE_EMPLOYEE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateEmployeeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to create employee");
      }

      return data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  // Add this method to the EmployeeService class

  /**
   * Get employee filter options (employee types, departments, employment types, etc.)
   */
  static async getEmployeeFilterOptions(): Promise<EmployeeFilterOptionsApiResponse> {
    try {
      const response = await fetch(GET_EMPLOYEE_BASIC_DETAILS_PARAMS_DATA_FE, {
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

      const data: EmployeeFilterOptionsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch employee filter options",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching employee filter options:", error);
      throw error;
    }
  }

  // Add this method to the EmployeeService class

  /**
   * Get employee create data (all filter options for creating an employee)
   * This includes employee types, departments, designations, employment types,
   * bank names, work locations, grades, supervisors, managers, statuses,
   * salary components, shift types, and social media platforms
   */
  static async getEmployeeCreateData(): Promise<EmployeeCreateDataApiResponse> {
    try {
      const response = await fetch(GET_EMPLOYEE_CREATE_DATA_FE, {
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

      const data: EmployeeCreateDataApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch employee create data");
      }

      return data;
    } catch (error) {
      console.error("Error fetching employee create data:", error);
      throw error;
    }
  }

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get proficiency level badge color
   */
  static getProficiencyColor(level: string): string {
    switch (level) {
      case "expert":
        return "bg-purple-100 text-purple-800";
      case "advanced":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "beginner":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to format salary
   */
  static formatSalary(salary: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(salary);
  }
}
