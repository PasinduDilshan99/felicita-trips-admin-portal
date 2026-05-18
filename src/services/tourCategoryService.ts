// services/tourCategoryService.ts

import {
  TourCategoryListApiResponse,
  TourCategoryDetailsApiResponse,
  TourCategoryBasicApiResponse,
  AddTourCategoryRequest,
  AddTourCategoryApiResponse,
  UpdateTourCategoryRequest,
  UpdateTourCategoryApiResponse,
  TerminateTourCategoryApiResponse,
  GetTourCategoryDetailsRequest,
  GetTourCategoryBasicDetailsRequest,
  TerminateTourCategoryRequest,
} from "@/types/tour-category-types";
import {
  ADD_TOUR_CATEGORY_DATA_FE,
  GET_TOUR_CATEGORY_BASIC_DETAILS_BY_ID_DATA_FE,
  GET_TOUR_CATEGORY_DATA_FE,
  GET_TOUR_CATEGORY_DETAILS_BY_ID_DATA_FE,
  TERMINATE_TOUR_CATEGORY_DATA_FE,
  UPDATE_TOUR_CATEGORY_DATA_FE,
} from "@/utils/frontEndConstant";

export class TourCategoryService {
  /**
   * Get all tour categories
   */
  static async getTourCategories(): Promise<TourCategoryListApiResponse> {
    try {
      const response = await fetch(GET_TOUR_CATEGORY_DATA_FE, {
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

      const data: TourCategoryListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch tour categories");
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour categories:", error);
      throw error;
    }
  }

  /**
   * Get tour category details by ID (includes associated tours)
   * @param id - The ID of the tour category to fetch
   */
  static async getTourCategoryDetails(
    id: number,
  ): Promise<TourCategoryDetailsApiResponse> {
    try {
      const requestBody: GetTourCategoryDetailsRequest = { id };

      const response = await fetch(GET_TOUR_CATEGORY_DETAILS_BY_ID_DATA_FE, {
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

      const data: TourCategoryDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour category details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour category details:", error);
      throw error;
    }
  }

  /**
   * Get tour category basic details by ID (without associated tours)
   * @param id - The ID of the tour category to fetch
   */
  static async getTourCategoryBasicDetails(
    id: number,
  ): Promise<TourCategoryBasicApiResponse> {
    try {
      const requestBody: GetTourCategoryBasicDetailsRequest = { id };

      const response = await fetch(
        GET_TOUR_CATEGORY_BASIC_DETAILS_BY_ID_DATA_FE,
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

      const data: TourCategoryBasicApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch tour category basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching tour category basic details:", error);
      throw error;
    }
  }

  /**
   * Add a new tour category
   * @param categoryData - The tour category data to add
   */
  static async addTourCategory(
    categoryData: AddTourCategoryRequest,
  ): Promise<AddTourCategoryApiResponse> {
    try {
      const response = await fetch(ADD_TOUR_CATEGORY_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AddTourCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add tour category");
      }

      return data;
    } catch (error) {
      console.error("Error adding tour category:", error);
      throw error;
    }
  }

  /**
   * Update an existing tour category
   * @param categoryData - The tour category data to update
   */
  static async updateTourCategory(
    categoryData: UpdateTourCategoryRequest,
  ): Promise<UpdateTourCategoryApiResponse> {
    try {
      const response = await fetch(UPDATE_TOUR_CATEGORY_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateTourCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update tour category");
      }

      return data;
    } catch (error) {
      console.error("Error updating tour category:", error);
      throw error;
    }
  }

  /**
   * Terminate a tour category
   * @param id - The ID of the tour category to terminate
   */
  static async terminateTourCategory(
    id: number,
  ): Promise<TerminateTourCategoryApiResponse> {
    try {
      const requestBody: TerminateTourCategoryRequest = { id };

      const response = await fetch(TERMINATE_TOUR_CATEGORY_DATA_FE, {
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

      const data: TerminateTourCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate tour category");
      }

      return data;
    } catch (error) {
      console.error("Error terminating tour category:", error);
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
   * Helper method to get default form data for adding a tour category
   */
  static getDefaultAddFormData(): AddTourCategoryRequest {
    return {
      categoryName: "",
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
  static getDefaultUpdateFormData(
    categoryId: number,
  ): UpdateTourCategoryRequest {
    return {
      categoryId: categoryId,
      categoryName: "",
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
   * Helper method to validate tour category form data
   */
  static validateTourCategoryForm(
    formData: Partial<AddTourCategoryRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.categoryName?.trim()) {
      errors.categoryName = "Category name is required";
    } else if (formData.categoryName.length < 3) {
      errors.categoryName = "Category name must be at least 3 characters";
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
   * Helper method to format tour category color style
   */
  static getTourCategoryStyle(
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

  /**
   * Helper method to get image status display
   */
  static getImageStatusDisplay(status: string): string {
    return status === "1" ? "ACTIVE" : "INACTIVE";
  }
}
