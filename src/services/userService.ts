// services/userService.ts

import {
  UserNamesAndIdsApiResponse,
  UserBasicDetailsApiResponse,
  GetUserBasicDetailsRequest,
} from "@/types/user-types";
import {
  GET_USER_BASIC_DETAILS_BY_USER_ID_DATA_FE,
  GET_USER_NAMES_AND_IDS_WITHOUT_EMPLOYEES_DATA_FE,
} from "@/utils/frontEndConstant";

export class UserService {
  /**
   * Get user names and IDs (users without employee records)
   * Useful for dropdown selection when creating employees
   */
  static async getUserNamesAndIdsWithoutEmployees(): Promise<UserNamesAndIdsApiResponse> {
    try {
      const response = await fetch(
        GET_USER_NAMES_AND_IDS_WITHOUT_EMPLOYEES_DATA_FE,
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

      const data: UserNamesAndIdsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch user names and IDs");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user names and IDs:", error);
      throw error;
    }
  }

  /**
   * Get user basic details by user ID
   * @param userId - The ID of the user to fetch
   */
  static async getUserBasicDetailsByUserId(
    userId: number,
  ): Promise<UserBasicDetailsApiResponse> {
    try {
      const requestBody: GetUserBasicDetailsRequest = { userId };

      const response = await fetch(GET_USER_BASIC_DETAILS_BY_USER_ID_DATA_FE, {
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

      const data: UserBasicDetailsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch user basic details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user basic details:", error);
      throw error;
    }
  }
}
