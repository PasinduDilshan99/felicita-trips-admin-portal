// commonService.ts

import { AllCategoriesData, ApiResponse } from "@/types/common-types";
import { GET_ALL_CATEGORIES_DATA_FE } from "@/utils/frontEndConstant";

export class CommonService {
  static async getAllCategories(): Promise<AllCategoriesData> {
    const res = await fetch(GET_ALL_CATEGORIES_DATA_FE, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch categories");
    }

    const data: ApiResponse<AllCategoriesData> = await res.json();
    return data.data;
  }
}
