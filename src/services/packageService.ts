// services/packageService.ts
import {
  PackageFilterParams,
  SinglePackageApiResponse,
  TourPackage,
  PackageSchedule,
  PackagesForTerminateResponse,
  TerminatePackageApiResponse,
  AddPackageApiResponse,
  AddPackageRequest,
  UpdatePackageRequest,
  UpdatePackageApiResponse,
  PackageNameIdResponse,
  PackageAllDetailsResponse,
  PackageFilterApiResponse,
  PackageStatisticsApiResponse,
  PackageScheduleStatisticsApiResponse,
  PackageTypeStatisticsApiResponse,
  GetPackageParametersRequest,
  PackageParametersApiResponse,
} from "@/types/package-types";
import {
  CREATE_PACKAGE_DATA_FE,
  GET_PACKAGE_ALL_DETAILS_BY_ID_DATA_FE,
  GET_PACKAGE_DETAILS_BY_ID_DATA_FE,
  GET_PACKAGE_NAMES_AND_IDS_DATA_FE,
  GET_PACKAGE_PARAMETERS_DATA_FE,
  GET_PACKAGE_SCHEDULE_STATISTICS_DATA_FE,
  GET_PACKAGE_STATISTICS_DATA_FE,
  GET_PACKAGE_TYPE_STATISTICS_DATA_FE,
  GET_PACKAGES_DETAILS_FOR_REQUEST_DATA_FE,
  GET_PACKAGES_FOR_TERMINATE_DATA_FE,
  GET_TOUR_DETAILS_FOR_PACKAGE_DATA_FE,
  TERMINATE_PACKAGE_DATA_FE,
  UPDATE_PACKAGE_DATA_FE,
} from "@/utils/frontEndConstant";

export class PackageService {
  private static getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Fetch packages with filters
  static async getPackages(
    params: PackageFilterParams,
  ): Promise<PackageFilterApiResponse> {
    try {
      const response = await fetch(GET_PACKAGES_DETAILS_FOR_REQUEST_DATA_FE, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          name: params.name || null,
          minPrice: params.minPrice || null,
          maxPrice: params.maxPrice || null,
          duration: params.duration || null,
          packageType: params.packageType || null,
          location: params.location || null,
          minGroupSize: params.minGroupSize || null,
          maxGroupSize: params.maxGroupSize || null,
          fromDate: params.fromDate || null,
          toDate: params.toDate || null,
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PackageFilterApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  }

  // Get single package by ID
  static async getPackageById(id: number): Promise<SinglePackageApiResponse> {
    try {
      const response = await fetch(
        `${GET_PACKAGE_DETAILS_BY_ID_DATA_FE}/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SinglePackageApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
  }

  // Helper methods to extract unique values for filters
  static extractPackageTypes(packages: TourPackage[]): string[] {
    const types = packages.map((pkg) => pkg.packageTypeName);
    return Array.from(new Set(types)).filter(Boolean);
  }

  static extractLocations(packages: TourPackage[]): string[] {
    const locations: string[] = [];
    packages.forEach((pkg) => {
      locations.push(pkg.startLocation);
      locations.push(pkg.endLocation);
    });
    return Array.from(new Set(locations)).filter(Boolean);
  }

  static extractTourNames(packages: TourPackage[]): string[] {
    const tourNames = packages.map((pkg) => pkg.tourName);
    return Array.from(new Set(tourNames)).filter(Boolean);
  }

  // Calculate discounted price
  static calculateDiscountedPrice(
    totalPrice: number,
    discountPercentage: number,
  ): number {
    return totalPrice - (totalPrice * discountPercentage) / 100;
  }

  // Calculate per person price after discount
  static calculatePerPersonPrice(
    totalPrice: number,
    discountPercentage: number,
    groupSize: number,
  ): number {
    const discountedPrice = this.calculateDiscountedPrice(
      totalPrice,
      discountPercentage,
    );
    return discountedPrice / groupSize;
  }

  // Get upcoming schedules
  static getUpcomingSchedules(pkg: TourPackage): PackageSchedule[] {
    const today = new Date();
    return pkg.schedules.filter((schedule) => {
      const endDate = new Date(schedule.assumeEndDate);
      return endDate >= today;
    });
  }

  // Get active dates range
  static getActiveDates(pkg: TourPackage): { from: Date; to: Date } {
    return {
      from: new Date(pkg.startDate),
      to: new Date(pkg.endDate),
    };
  }

  // Check if package is currently available
  static isPackageAvailable(pkg: TourPackage): boolean {
    const today = new Date();
    const startDate = new Date(pkg.startDate);
    const endDate = new Date(pkg.endDate);
    return (
      pkg.packageStatus === "ACTIVE" && today >= startDate && today <= endDate
    );
  }

  // Get available package types (static list or from API)
  static async getPackageTypes(): Promise<string[]> {
    return [
      "All-Inclusive",
      "Budget",
      "Luxury",
      "Family",
      "Honeymoon",
      "Adventure",
      "Custom",
      "Group",
      "Solo",
      "Corporate",
    ];
  }

  // Get packages for termination
  static async getPackagesForTerminate(): Promise<PackagesForTerminateResponse> {
    try {
      const response = await fetch(GET_PACKAGES_FOR_TERMINATE_DATA_FE, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PackagesForTerminateResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching packages for terminate:", error);
      throw error;
    }
  }

  // Terminate package
  static async terminatePackage(
    packageId: number,
  ): Promise<TerminatePackageApiResponse> {
    try {
      const response = await fetch(TERMINATE_PACKAGE_DATA_FE, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ packageId }),
      });

      const data: TerminatePackageApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to terminate package");
      }

      return data;
    } catch (error) {
      console.error("Error terminating package:", error);
      throw error;
    }
  }

  // Calculate savings amount
  static calculateSavings(
    totalPrice: number,
    discountPercentage: number,
  ): number {
    return (totalPrice * discountPercentage) / 100;
  }

  // Format price with currency
  static formatPrice(amount: number): string {
    return `LKR ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Get package rating (placeholder - could be from reviews)
  static getPackageRating(pkg: TourPackage): number {
    // This is a placeholder - you'd normally get this from reviews
    return 4.5 + pkg.discountPercentage / 50; // Higher discount = better rating
  }

  // Add new package
  static async addPackage(
    request: AddPackageRequest,
  ): Promise<AddPackageApiResponse> {
    try {
      const response = await fetch(CREATE_PACKAGE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      });

      const data: AddPackageApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to add package");
      }

      return data;
    } catch (error) {
      console.error("Error adding package:", error);
      throw error;
    }
  }

  // Add these methods to your existing PackageService class

  // Get all package names and IDs for search
  static async getAllPackageNames(): Promise<PackageNameIdResponse> {
    try {
      const response = await fetch(GET_PACKAGE_NAMES_AND_IDS_DATA_FE, {
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

      const data: PackageNameIdResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching package names:", error);
      throw error;
    }
  }

  // Get all package details by ID
  static async getPackageAllDetails(
    id: number,
  ): Promise<PackageAllDetailsResponse> {
    try {
      const response = await fetch(
        `${GET_PACKAGE_ALL_DETAILS_BY_ID_DATA_FE}/${id}`,
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

      const data: PackageAllDetailsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching package all details:", error);
      throw error;
    }
  }

  // Update package
  static async updatePackage(
    packageData: UpdatePackageRequest,
  ): Promise<UpdatePackageApiResponse> {
    try {
      const response = await fetch(UPDATE_PACKAGE_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(packageData),
      });

      const data: UpdatePackageApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to update package");
      }

      return data;
    } catch (error) {
      console.error("Error updating package:", error);
      throw error;
    }
  }

  // Add these methods to the PackageService class

  /**
   * Get package statistics including summary, popularity, ratings,
   * price distributions, capacity utilization, and type distributions
   */
  static async getPackageStatistics(): Promise<PackageStatisticsApiResponse> {
    try {
      const response = await fetch(GET_PACKAGE_STATISTICS_DATA_FE, {
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

      const data: PackageStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch package statistics");
      }

      return data;
    } catch (error) {
      console.error("Error fetching package statistics:", error);
      throw error;
    }
  }

  /**
   * Get package schedule statistics including timeline, status distribution,
   * duration distribution, participation performance, and rating overviews
   */
  static async getPackageScheduleStatistics(): Promise<PackageScheduleStatisticsApiResponse> {
    try {
      const response = await fetch(GET_PACKAGE_SCHEDULE_STATISTICS_DATA_FE, {
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

      const data: PackageScheduleStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch package schedule statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching package schedule statistics:", error);
      throw error;
    }
  }

  /**
   * Get package type statistics including distribution, revenue performance,
   * participation impact, primary/secondary usage, booking performance, and ratings
   */
  static async getPackageTypeStatistics(): Promise<PackageTypeStatisticsApiResponse> {
    try {
      const response = await fetch(GET_PACKAGE_TYPE_STATISTICS_DATA_FE, {
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

      const data: PackageTypeStatisticsApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch package type statistics",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching package type statistics:", error);
      throw error;
    }
  }

  static async getPackageParameters(
    tourId: number,
  ): Promise<PackageParametersApiResponse> {
    try {
      const requestBody: GetPackageParametersRequest = { tourId };

      const response = await fetch(GET_PACKAGE_PARAMETERS_DATA_FE, {
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

      const data: PackageParametersApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch package parameters");
      }

      return data;
    } catch (error) {
      console.error("Error fetching package parameters:", error);
      throw error;
    }
  }
}
