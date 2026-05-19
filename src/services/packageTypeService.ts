// services/packageTypeService.ts

import {
  PackageTypeListApiResponse,
  PackageTypeDetailsApiResponse,
  PackageTypeBasicDetailsApiResponse,
  AddPackageTypeRequest,
  AddPackageTypeApiResponse,
  UpdatePackageTypeRequest,
  UpdatePackageTypeApiResponse,
  TerminatePackageTypeApiResponse,
  GetPackageTypeDetailsRequest,
  GetPackageTypeBasicDetailsRequest,
  TerminatePackageTypeRequest,
} from "@/types/package-type-types";
import {
  ADD_PACKAGE_TYPE_DATA_FE,
  GET_PACKAGE_TYPE_BASIC_DETAILS_BY_ID_DATA_FE,
  GET_PACKAGE_TYPE_DETAILS_BY_ID_DATA_FE,
  GET_PACKAGE_TYPES_DATA_FE,
  TERMINATE_PACKAGE_TYPE_DATA_FE,
  UPDATE_PACKAGE_TYPE_DATA_FE,
} from "@/utils/frontEndConstant";

export class PackageTypeService {
  /**
   * Get all package types
   */
  static async getPackageTypes(): Promise<PackageTypeListApiResponse> {
    try {
      const response = await fetch(GET_PACKAGE_TYPES_DATA_FE, {
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

      const data: PackageTypeListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch package types");
      }

      return data;
    } catch (error) {
      console.error("Error fetching package types:", error);
      throw error;
    }
  }

  /**
   * Get package type details by ID (includes associated packages)
   * @param id - The ID of the package type to fetch
   */
  static async getPackageTypeDetails(
    id: number,
  ): Promise<PackageTypeDetailsApiResponse> {
    try {
      const requestBody: GetPackageTypeDetailsRequest = { id };

      const response = await fetch(GET_PACKAGE_TYPE_DETAILS_BY_ID_DATA_FE, {
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

      const data: PackageTypeDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch package type details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching package type details:", error);
      throw error;
    }
  }

  /**
   * Get package type basic details by ID (without associated packages)
   * @param id - The ID of the package type to fetch
   */
  static async getPackageTypeBasicDetails(
    id: number,
  ): Promise<PackageTypeBasicDetailsApiResponse> {
    try {
      const requestBody: GetPackageTypeBasicDetailsRequest = { id };

      const response = await fetch(
        GET_PACKAGE_TYPE_BASIC_DETAILS_BY_ID_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PackageTypeBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch package type basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching package type basic details:", error);
      throw error;
    }
  }

  /**
   * Add a new package type
   * @param packageTypeData - The package type data to add
   */
  static async addPackageType(
    packageTypeData: AddPackageTypeRequest,
  ): Promise<AddPackageTypeApiResponse> {
    try {
      const response = await fetch(ADD_PACKAGE_TYPE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(packageTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AddPackageTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add package type");
      }

      return data;
    } catch (error) {
      console.error("Error adding package type:", error);
      throw error;
    }
  }

  /**
   * Update an existing package type
   * @param packageTypeData - The package type data to update
   */
  static async updatePackageType(
    packageTypeData: UpdatePackageTypeRequest,
  ): Promise<UpdatePackageTypeApiResponse> {
    try {
      const response = await fetch(UPDATE_PACKAGE_TYPE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(packageTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdatePackageTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update package type");
      }

      return data;
    } catch (error) {
      console.error("Error updating package type:", error);
      throw error;
    }
  }

  /**
   * Terminate a package type
   * @param id - The ID of the package type to terminate
   */
  static async terminatePackageType(
    id: number,
  ): Promise<TerminatePackageTypeApiResponse> {
    try {
      const requestBody: TerminatePackageTypeRequest = { id };

      const response = await fetch(TERMINATE_PACKAGE_TYPE_DATA_FE, {
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

      const data: TerminatePackageTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate package type");
      }

      return data;
    } catch (error) {
      console.error("Error terminating package type:", error);
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
   * Helper method to get default form data for adding a package type
   */
  static getDefaultAddFormData(): AddPackageTypeRequest {
    return {
      typeName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      images: [],
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(typeId: number): UpdatePackageTypeRequest {
    return {
      typeId: typeId,
      typeName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      addImages: [],
      updateImages: [],
      removeImageIds: [],
    };
  }

  /**
   * Helper method to validate package type form data
   */
  static validatePackageTypeForm(
    formData: Partial<AddPackageTypeRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.typeName?.trim()) {
      errors.typeName = "Package type name is required";
    } else if (formData.typeName.length < 3) {
      errors.typeName = "Package type name must be at least 3 characters";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.color) {
      errors.color = "Color is required";
    }

    if (!formData.hoverColor) {
      errors.hoverColor = "Hover color is required";
    }

    if (!formData.images || formData.images.length === 0) {
      errors.images = "At least one image is required";
    }

    return errors;
  }

  /**
   * Helper method to get package type color style
   */
  static getPackageTypeStyle(
    color: string,
    hoverColor: string,
  ): React.CSSProperties {
    return {
      backgroundColor: color,
      transition: "all 0.3s ease",
    };
  }

  /**
   * Helper method to get package type hover style
   */
  static getPackageTypeHoverStyle(hoverColor: string): React.CSSProperties {
    return {
      backgroundColor: hoverColor,
    };
  }

  /**
   * Helper method to format date
   */
  static formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Helper method to get primary type indicator
   */
  static getPrimaryTypeIndicator(primaryType: boolean): string {
    return primaryType ? "Primary" : "Secondary";
  }

  /**
   * Helper method to get primary type badge color
   */
  static getPrimaryTypeColor(primaryType: boolean): string {
    return primaryType
      ? "bg-purple-100 text-purple-800"
      : "bg-gray-100 text-gray-600";
  }
}
