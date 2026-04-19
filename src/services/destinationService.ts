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
} from "@/types/destination-types";
import {
  ADD_DESTINATION_DETAILS_DATA_FE,
  GET_DESTINATION_DETAILS_FOR_TERMINATE_DATA_FE,
  GET_DESTINATION_STATISTICS_DATA_FE,
  GET_DESTINATIONS_DETAILS_BY_ID_DATA_FE,
  GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA_FE,
  TERMINATE_DESTINATION_DATA_FE,
  UPDATE_DESTINATION_DETAILS_DATA_FE,
} from "@/utils/frontEndConstant";

export class DestinationService {
  static async getDestinations(
    params: DestinationFilterParams,
  ): Promise<DestinationApiResponse> {
    try {
      const response = await fetch(
        GET_DESTINATIONS_DETAILS_BY_REQUEST_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: params.name || null,
            minPrice: params.minPrice || null,
            maxPrice: params.maxPrice || null,
            duration: params.duration || null,
            destinationCategory: params.destinationCategory || null,
            season: params.season || null,
            status: params.status || null,
            pageSize: params.pageSize,
            pageNumber: params.pageNumber,
          }),
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
}
