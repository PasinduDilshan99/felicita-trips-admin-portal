// services/destinationService.ts
import {
  DestinationFilterParams,
  DestinationApiResponse,
  Destination,
  SingleDestinationApiResponse,
  AddDestinationRequest,
  AddDestinationApiResponse,
  TerminateDestinationApiResponse,
  DestinationsForTerminateResponse,
  UpdateDestinationRequest,
  UpdateDestinationApiResponse,
  DestinationStatisticsApiResponse,
  DestinationCategoriesStatisticsApiResponse,
  ActiveCategoriesApiResponse,
  CategoryDetailsByIdApiResponse,
  AddDestinationCategoryRequest,
  AddDestinationCategoryApiResponse,
  UpdateDestinationCategoryRequest,
  UpdateDestinationCategoryApiResponse,
  TerminateDestinationCategoryApiResponse,
} from "@/types/destination-types";
import {
  ADD_DESTINATION_CATEGORY_FE,
  ADD_DESTINATION_DETAILS_DATA_FE,
  GET_ACTIVE_DESTINATIONS_CATEGORIES_FE,
  GET_DESTINATION_CATEGORIES_STATISTICS_DATA_FE,
  GET_DESTINATION_CATEGORY_DETAILS_BY_ID_FE,
  GET_DESTINATION_DETAILS_FOR_TERMINATE_DATA_FE,
  GET_DESTINATION_STATISTICS_DATA_FE,
  GET_DESTINATIONS_DETAILS_BY_ID_DATA_FE,
  GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA_FE,
  TERMINATE_DESTINATION_CATEGORY_FE,
  TERMINATE_DESTINATION_DATA_FE,
  UPDATE_DESTINATION_CATEGORY_FE,
  UPDATE_DESTINATION_DETAILS_DATA_FE,
} from "@/utils/frontEndConstant";

export class DestinationService {
  static async getDestinations(
    params: DestinationFilterParams,
  ): Promise<DestinationApiResponse> {
    try {
      // Prepare the request body
      const requestBody: any = {
        name: params.name || null,
        minPrice: params.minPrice || null,
        maxPrice: params.maxPrice || null,
        duration: params.duration || null,
        destinationCategory: params.destinationCategory || null,
        season: params.season || null,
        status: params.status || null,
        pageSize: params.pageSize,
        pageNumber: params.pageNumber,
      };

      // Add sorting parameters if provided
      if (params.sortBy) {
        requestBody.sortBy = params.sortBy;
      }
      if (params.sortDirection) {
        requestBody.sortDirection = params.sortDirection;
      }

      const response = await fetch(
        GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA_FE,
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

      const data: DestinationApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  }

  // static extractCategories(destinations: Destination[]): string[] {
  //   const categories = destinations.map((dest) => dest.categoryName);
  //   return Array.from(new Set(categories));
  // }

  // Helper method to get unique seasons from activities
  static extractSeasons(destinations: Destination[]): string[] {
    const allSeasons: string[] = [];
    destinations.forEach((dest) => {
      dest.activities.forEach((activity) => {
        const seasons = activity.season.split(",").map((s) => s.trim());
        allSeasons.push(...seasons);
      });
    });
    return Array.from(new Set(allSeasons));
  }

  static async getDestinationById(
    id: number,
  ): Promise<SingleDestinationApiResponse> {
    try {
      const response = await fetch(
        `${GET_DESTINATIONS_DETAILS_BY_ID_DATA_FE}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleDestinationApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destination:", error);
      throw error;
    }
  }

  static async addDestination(
    destinationData: AddDestinationRequest,
  ): Promise<AddDestinationApiResponse> {
    try {
      const response = await fetch(ADD_DESTINATION_DETAILS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(destinationData),
      });

      const data: AddDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add destination");
      }

      return data;
    } catch (error) {
      console.error("Error adding destination:", error);
      throw error;
    }
  }

  static async getDestinationsForTerminate(): Promise<DestinationsForTerminateResponse> {
    try {
      const response = await fetch(
        GET_DESTINATION_DETAILS_FOR_TERMINATE_DATA_FE,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationsForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching destinations for terminate:", error);
      throw error;
    }
  }

  static async terminateDestination(
    destinationId: number,
  ): Promise<TerminateDestinationApiResponse> {
    try {
      const response = await fetch(TERMINATE_DESTINATION_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ destinationId }),
      });
      const data: TerminateDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate destination");
      }

      return data;
    } catch (error) {
      console.error("Error terminating destination:", error);
      throw error;
    }
  }

  static async updateDestination(
    destinationData: UpdateDestinationRequest,
  ): Promise<UpdateDestinationApiResponse> {
    try {
      const response = await fetch(UPDATE_DESTINATION_DETAILS_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(destinationData),
      });

      const data: UpdateDestinationApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update destination");
      }

      return data;
    } catch (error) {
      console.error("Error updating destination:", error);
      throw error;
    }
  }

  static async getDestinationStatistics(): Promise<DestinationStatisticsApiResponse> {
    try {
      const response = await fetch(GET_DESTINATION_STATISTICS_DATA_FE, {
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

      const data: DestinationStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch destination statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching destination statistics:", error);
      throw error;
    }
  }

  static async getDestinationCategoriesStatistics(): Promise<DestinationCategoriesStatisticsApiResponse> {
    try {
      const response = await fetch(
        GET_DESTINATION_CATEGORIES_STATISTICS_DATA_FE,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DestinationCategoriesStatisticsApiResponse =
        await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch destination categories statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching destination categories statistics:", error);
      throw error;
    }
  }

  static async getActiveCategories(): Promise<ActiveCategoriesApiResponse> {
    try {
      const response = await fetch(GET_ACTIVE_DESTINATIONS_CATEGORIES_FE, {
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

      const data: ActiveCategoriesApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch active categories");
      }

      return data;
    } catch (error) {
      console.error("Error fetching active categories:", error);
      throw error;
    }
  }

  static async getCategoryDetailsById(
    categoryId: number,
  ): Promise<CategoryDetailsByIdApiResponse> {
    try {
      const response = await fetch(GET_DESTINATION_CATEGORY_DETAILS_BY_ID_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ destinationCategoryId: categoryId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryDetailsByIdApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch category details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching category details by ID:", error);
      throw error;
    }
  }

  static async addDestinationCategory(
    categoryData: AddDestinationCategoryRequest,
  ): Promise<AddDestinationCategoryApiResponse> {
    try {
      const response = await fetch(ADD_DESTINATION_CATEGORY_FE, {
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

      const data: AddDestinationCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add destination category");
      }

      return data;
    } catch (error) {
      console.error("Error adding destination category:", error);
      throw error;
    }
  }

  static async updateDestinationCategory(
    categoryData: UpdateDestinationCategoryRequest,
  ): Promise<UpdateDestinationCategoryApiResponse> {
    try {
      const response = await fetch(UPDATE_DESTINATION_CATEGORY_FE, {
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

      const data: UpdateDestinationCategoryApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to update destination category",
        );
      }

      return data;
    } catch (error) {
      console.error("Error updating destination category:", error);
      throw error;
    }
  }

  static async terminateDestinationCategory(
    destinationCategoryId: number,
  ): Promise<TerminateDestinationCategoryApiResponse> {
    try {
      const response = await fetch(TERMINATE_DESTINATION_CATEGORY_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ destinationCategoryId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TerminateDestinationCategoryApiResponse =
        await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to terminate destination category",
        );
      }

      return data;
    } catch (error) {
      console.error("Error terminating destination category:", error);
      throw error;
    }
  }
}
