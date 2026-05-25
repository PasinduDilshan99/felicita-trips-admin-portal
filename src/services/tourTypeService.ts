// services/tourTypeService.ts

import {
  TourTypeListApiResponse,
  TourTypeDetailsApiResponse,
  TourTypeBasicApiResponse,
  AddTourTypeRequest,
  AddTourTypeApiResponse,
  UpdateTourTypeRequest,
  UpdateTourTypeApiResponse,
  TerminateTourTypeApiResponse,
  GetTourTypeDetailsRequest,
  GetTourTypeBasicDetailsRequest,
  TerminateTourTypeRequest,
} from "@/types/tour-type-types";
import {
  ADD_TOUR_TYPE_DATA_FE,
  GET_TOUR_TYPE_BASIC_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_TYPE_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_TYPES_DATA_FE,
  TERMINATE_TOUR_TYPE_DATA_FE,
  UPDATE_TOUR_TYPE_DATA_FE,
} from "@/utils/frontEndConstant";

export class TourTypeService {
  /**
   * Get all tour types
   */
  static async getTourTypes(): Promise<TourTypeListApiResponse> {
    try {
      const response = await fetch(GET_TOUR_TYPES_DATA_FE, {
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

      const data: TourTypeListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour types");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour types:", error);
      throw error;
    }
  }

  /**
   * Get tour type details by ID (includes associated tours)
   * @param id - The ID of the tour type to fetch
   */
  static async getTourTypeDetails(
    id: number,
  ): Promise<TourTypeDetailsApiResponse> {
    try {
      const requestBody: GetTourTypeDetailsRequest = { id };

      const response = await fetch(GET_TOUR_TYPE_DETAILS_BY_ID_DATA_FE, {
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

      const data: TourTypeDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour type details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour type details:", error);
      throw error;
    }
  }

  /**
   * Get tour type basic details by ID (without associated tours)
   * @param id - The ID of the tour type to fetch
   */
  static async getTourTypeBasicDetails(
    id: number,
  ): Promise<TourTypeBasicApiResponse> {
    try {
      const requestBody: GetTourTypeBasicDetailsRequest = { id };

      const response = await fetch(GET_TOUR_TYPE_BASIC_DETAILS_BY_ID_DATA_FE, {
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

      const data: TourTypeBasicApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour type basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour type basic details:", error);
      throw error;
    }
  }

  /**
   * Add a new tour type
   * @param tourTypeData - The tour type data to add
   */
  static async addTourType(
    tourTypeData: AddTourTypeRequest,
  ): Promise<AddTourTypeApiResponse> {
    try {
      const response = await fetch(ADD_TOUR_TYPE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tourTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AddTourTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add tour type");
      }

      return data;
    } catch (error) {
      console.error("Error adding tour type:", error);
      throw error;
    }
  }

  /**
   * Update an existing tour type
   * @param tourTypeData - The tour type data to update
   */
  static async updateTourType(
    tourTypeData: UpdateTourTypeRequest,
  ): Promise<UpdateTourTypeApiResponse> {
    try {
      const response = await fetch(UPDATE_TOUR_TYPE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(tourTypeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateTourTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update tour type");
      }

      return data;
    } catch (error) {
      console.error("Error updating tour type:", error);
      throw error;
    }
  }

  /**
   * Terminate a tour type
   * @param id - The ID of the tour type to terminate
   */
  static async terminateTourType(
    id: number,
  ): Promise<TerminateTourTypeApiResponse> {
    try {
      const requestBody: TerminateTourTypeRequest = { id };

      const response = await fetch(TERMINATE_TOUR_TYPE_DATA_FE, {
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

      const data: TerminateTourTypeApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate tour type");
      }

      return data;
    } catch (error) {
      console.error("Error terminating tour type:", error);
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
   * Helper method to get default form data for adding a tour type
   */
  static getDefaultAddFormData(): AddTourTypeRequest {
    return {
      typeName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      tourIds: [],
      images: [],
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(typeId: number): UpdateTourTypeRequest {
    return {
      typeId: typeId,
      typeName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      addTourIds: [],
      removeTourIds: [],
      addImages: [],
      updateImages: [],
      removeImageIds: [],
    };
  }

  /**
   * Helper method to validate tour type form data
   */
  static validateTourTypeForm(
    formData: Partial<AddTourTypeRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.typeName?.trim()) {
      errors.typeName = "Tour type name is required";
    } else if (formData.typeName.length < 3) {
      errors.typeName = "Tour type name must be at least 3 characters";
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
   * Helper method to format tour type color style
   */
  static getTourTypeStyle(
    color: string | null,
    hoverColor: string | null,
  ): React.CSSProperties {
    return {
      backgroundColor: color || undefined,
      transition: "all 0.3s ease",
    };
  }

  /**
   * Helper method to format tour IDs input string
   */
  static formatTourIdsToString(tourIds: number[]): string {
    return tourIds.join(", ");
  }

  /**
   * Helper method to parse tour IDs from string
   */
  static parseTourIdsFromString(tourIdsString: string): number[] {
    return tourIdsString
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
  }
}
