// services/activityCategoryService.ts

import {
  ActivityCategoryListApiResponse,
  ActivityCategoryDetailsApiResponse,
  AddActivityCategoryRequest,
  AddActivityCategoryApiResponse,
  UpdateActivityCategoryRequest,
  UpdateActivityCategoryApiResponse,
  TerminateActivityCategoryApiResponse,
  GetActivityCategoryDetailsRequest,
  TerminateActivityCategoryRequest,
} from "@/types/activity-category-types";
import {
  ADD_ACTIVITY_CATEGORY_DATA_FE,
  GET_ACTIVITY_CATEGORY_DETAILS_BY_ID_DATA_FE,
  GET_ALL_ACTIVITY_CATEGORIES_DATA_FE,
  TERMINATE_ACTIVITY_CATEGORY_DATA_FE,
  UPDATE_ACTIVITY_CATEGORY_DATA_FE,
} from "@/utils/frontEndConstant";

export class ActivityCategoryService {
  /**
   * Get all activity categories
   */
  static async getActivityCategories(): Promise<ActivityCategoryListApiResponse> {
    try {
      const response = await fetch(GET_ALL_ACTIVITY_CATEGORIES_DATA_FE, {
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

      const data: ActivityCategoryListApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch activity categories");
      }

      return data;
    } catch (error) {
      console.error("Error fetching activity categories:", error);
      throw error;
    }
  }

  /**
   * Get activity category details by ID
   * @param id - The ID of the category to fetch
   */
  static async getActivityCategoryDetails(
    id: number,
  ): Promise<ActivityCategoryDetailsApiResponse> {
    try {
      const requestBody: GetActivityCategoryDetailsRequest = { id };

      const response = await fetch(
        GET_ACTIVITY_CATEGORY_DETAILS_BY_ID_DATA_FE,
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

      const data: ActivityCategoryDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch activity category details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching activity category details:", error);
      throw error;
    }
  }

  /**
   * Add a new activity category
   * @param categoryData - The category data to add
   */
  static async addActivityCategory(
    categoryData: AddActivityCategoryRequest,
  ): Promise<AddActivityCategoryApiResponse> {
    try {
      const response = await fetch(ADD_ACTIVITY_CATEGORY_DATA_FE, {
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

      const data: AddActivityCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add activity category");
      }

      return data;
    } catch (error) {
      console.error("Error adding activity category:", error);
      throw error;
    }
  }

  /**
   * Update an existing activity category
   * @param categoryData - The category data to update
   */
  static async updateActivityCategory(
    categoryData: UpdateActivityCategoryRequest,
  ): Promise<UpdateActivityCategoryApiResponse> {
    try {
      const response = await fetch(UPDATE_ACTIVITY_CATEGORY_DATA_FE, {
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

      const data: UpdateActivityCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update activity category");
      }

      return data;
    } catch (error) {
      console.error("Error updating activity category:", error);
      throw error;
    }
  }

  /**
   * Terminate an activity category
   * @param id - The ID of the category to terminate
   */
  static async terminateActivityCategory(
    id: number,
  ): Promise<TerminateActivityCategoryApiResponse> {
    try {
      const requestBody: TerminateActivityCategoryRequest = { id };

      const response = await fetch(TERMINATE_ACTIVITY_CATEGORY_DATA_FE, {
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

      const data: TerminateActivityCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to terminate activity category",
        );
      }

      return data;
    } catch (error) {
      console.error("Error terminating activity category:", error);
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
   * Helper method to get default form data for adding a category
   */
  static getDefaultAddFormData(): AddActivityCategoryRequest {
    return {
      categoryName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      activityIds: [],
      images: [],
    };
  }

  /**
   * Helper method to get default update form data
   */
  static getDefaultUpdateFormData(
    categoryId: number,
  ): UpdateActivityCategoryRequest {
    return {
      categoryId: categoryId,
      categoryName: "",
      description: "",
      color: "#000000",
      hoverColor: "#333333",
      status: "ACTIVE",
      removeActivityIds: [],
      addActivityIds: [],
      addImages: [],
      removeImageIds: [],
      updateImages: [],
    };
  }

  /**
   * Helper method to validate category form data
   */
  static validateCategoryForm(
    formData: Partial<AddActivityCategoryRequest>,
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
   * Helper method to format category color style
   */
  static getCategoryStyle(
    color: string,
    hoverColor: string,
  ): React.CSSProperties {
    return {
      backgroundColor: color,
      transition: "all 0.3s ease",
    };
  }

  /**
   * Helper method to get category hover style
   */
  static getCategoryHoverStyle(hoverColor: string): React.CSSProperties {
    return {
      backgroundColor: hoverColor,
    };
  }
}
