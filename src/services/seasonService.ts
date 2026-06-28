// services/seasonService.ts

import {
  SeasonBasicDetailsApiResponse,
  SeasonStatisticsApiResponse,
  SeasonDetailsApiResponse,
  SeasonIdAndNameApiResponse,
  AddSeasonRequest,
  AddSeasonApiResponse,
  UpdateSeasonRequest,
  UpdateSeasonApiResponse,
  TerminateSeasonApiResponse,
  GetSeasonDetailsRequest,
  TerminateSeasonRequest,
} from "@/types/season-types";
import {
  CREATE_SEASON_DATA_FE,
  GET_ACTIVE_SEASONS_BASIC_DETAILS_DATA_FE,
  GET_SEASONS_DETAILS_BY_SEASON_ID_DATA_FE,
  GET_SEASONS_IDS_AND_NAMES_DATA_FE,
  GET_SEASONS_STATISTICS_DATA_FE,
  TERMINATE_SEASON_DATA_FE,
  UPDATE_SEASON_DATA_FE,
} from "@/utils/frontEndConstant";

export class SeasonService {
  /**
   * Get all seasons basic details
   */
  static async getSeasonsBasicDetails(): Promise<SeasonBasicDetailsApiResponse> {
    try {
      const response = await fetch(GET_ACTIVE_SEASONS_BASIC_DETAILS_DATA_FE, {
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

      const data: SeasonBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch seasons basic details",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching seasons basic details:", error);
      throw error;
    }
  }

  /**
   * Get season statistics
   */
  static async getSeasonStatistics(): Promise<SeasonStatisticsApiResponse> {
    try {
      const response = await fetch(GET_SEASONS_STATISTICS_DATA_FE, {
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

      const data: SeasonStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch season statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching season statistics:", error);
      throw error;
    }
  }

  /**
   * Get season details by ID
   * @param id - The ID of the season to fetch
   */
  static async getSeasonDetails(id: number): Promise<SeasonDetailsApiResponse> {
    try {
      const requestBody: GetSeasonDetailsRequest = { id };

      const response = await fetch(GET_SEASONS_DETAILS_BY_SEASON_ID_DATA_FE, {
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

      const data: SeasonDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch season details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching season details:", error);
      throw error;
    }
  }

  /**
   * Get all season IDs and names for dropdown/selection
   */
  static async getSeasonIdAndName(): Promise<SeasonIdAndNameApiResponse> {
    try {
      const response = await fetch(GET_SEASONS_IDS_AND_NAMES_DATA_FE, {
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

      const data: SeasonIdAndNameApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch season IDs and names");
      }

      return data;
    } catch (error) {
      console.error("Error fetching season IDs and names:", error);
      throw error;
    }
  }

  /**
   * Add a new season
   * @param seasonData - The season data to add
   */
  static async addSeason(
    seasonData: AddSeasonRequest,
  ): Promise<AddSeasonApiResponse> {
    try {
      const response = await fetch(CREATE_SEASON_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(seasonData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AddSeasonApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add season");
      }

      return data;
    } catch (error) {
      console.error("Error adding season:", error);
      throw error;
    }
  }

  /**
   * Update an existing season
   * @param seasonData - The season data to update
   */
  static async updateSeason(
    seasonData: UpdateSeasonRequest,
  ): Promise<UpdateSeasonApiResponse> {
    try {
      const response = await fetch(UPDATE_SEASON_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(seasonData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateSeasonApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update season");
      }

      return data;
    } catch (error) {
      console.error("Error updating season:", error);
      throw error;
    }
  }

  /**
   * Terminate a season
   * @param id - The ID of the season to terminate
   */
  static async terminateSeason(
    id: number,
  ): Promise<TerminateSeasonApiResponse> {
    try {
      const requestBody: TerminateSeasonRequest = { id };

      const response = await fetch(TERMINATE_SEASON_DATA_FE, {
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

      const data: TerminateSeasonApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate season");
      }

      return data;
    } catch (error) {
      console.error("Error terminating season:", error);
      throw error;
    }
  }

  /**
   * Helper method to get month name from month number
   */
  static getMonthName(month: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1] || "Unknown";
  }

  /**
   * Helper method to get date range string
   */
  static getDateRange(startMonth: number, endMonth: number): string {
    const start = this.getMonthName(startMonth);
    const end = this.getMonthName(endMonth);
    if (startMonth === endMonth) {
      return start;
    }
    return `${start} - ${end}`;
  }

  /**
   * Helper method to get status badge color
   */
  static getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  /**
   * Helper method to get status text
   */
  static getStatusText(status: number): string {
    return status === 1 ? "Active" : "Inactive";
  }

  /**
   * Helper method to get peak season badge color
   */
  static getPeakBadgeColor(isPeak: boolean): string {
    return isPeak
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-600";
  }

  /**
   * Helper method to get peak season text
   */
  static getPeakText(isPeak: boolean): string {
    return isPeak ? "Peak Season" : "Off Season";
  }

  /**
   * Helper method to get default form data for adding a season
   */
  static getDefaultAddFormData(): AddSeasonRequest {
    return {
      name: "",
      standardName: "",
      localName: "",
      startMonth: 1,
      endMonth: 12,
      monsoonType: "",
      weatherSummary: "",
      temperatureMin: 0,
      temperatureMax: 0,
      rainfallPattern: "",
      isPeak: false,
      displayOrder: 0,
      description: "",
      status: "ACTIVE",
      imageInsertRequests: [],
      insertActivitiesIds: [],
      insertTourIds: [],
    };
  }

  /**
   * Helper method to validate season form data
   */
  static validateSeasonForm(
    formData: Partial<AddSeasonRequest>,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Season name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Season name must be at least 3 characters";
    }

    if (!formData.standardName?.trim()) {
      errors.standardName = "Standard name is required";
    }

    if (!formData.localName?.trim()) {
      errors.localName = "Local name is required";
    }

    if (
      !formData.startMonth ||
      formData.startMonth < 1 ||
      formData.startMonth > 12
    ) {
      errors.startMonth = "Valid start month is required";
    }

    if (!formData.endMonth || formData.endMonth < 1 || formData.endMonth > 12) {
      errors.endMonth = "Valid end month is required";
    }

    if (
      formData.startMonth &&
      formData.endMonth &&
      formData.startMonth > formData.endMonth
    ) {
      errors.endMonth = "End month must be after start month";
    }

    if (!formData.monsoonType?.trim()) {
      errors.monsoonType = "Monsoon type is required";
    }

    if (!formData.weatherSummary?.trim()) {
      errors.weatherSummary = "Weather summary is required";
    }

    if (
      formData.temperatureMin === undefined ||
      formData.temperatureMin === 0
    ) {
      errors.temperatureMin = "Minimum temperature is required";
    }

    if (
      formData.temperatureMax === undefined ||
      formData.temperatureMax === 0
    ) {
      errors.temperatureMax = "Maximum temperature is required";
    }

    if (
      formData.temperatureMin &&
      formData.temperatureMax &&
      formData.temperatureMin > formData.temperatureMax
    ) {
      errors.temperatureMax =
        "Maximum temperature must be greater than minimum";
    }

    if (!formData.rainfallPattern?.trim()) {
      errors.rainfallPattern = "Rainfall pattern is required";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    if (
      !formData.imageInsertRequests ||
      formData.imageInsertRequests.length === 0
    ) {
      errors.images = "At least one image is required";
    }

    return errors;
  }
}
