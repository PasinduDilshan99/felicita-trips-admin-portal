// services/packageService.ts
import {
  PackageFilterParams,
  ApiResponse,
  SinglePackageApiResponse,
  AddPackageRequest,
  UpdatePackageRequest,
  TourPackage,
  PackageSchedule
} from "@/types/package-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
    params: PackageFilterParams
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/package/packages`,
        {
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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  }

  // Get single package by ID
  static async getPackageById(
    id: number
  ): Promise<SinglePackageApiResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/package/${id}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
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
  static calculateDiscountedPrice(totalPrice: number, discountPercentage: number): number {
    return totalPrice - (totalPrice * discountPercentage / 100);
  }

  // Calculate per person price after discount
  static calculatePerPersonPrice(totalPrice: number, discountPercentage: number, groupSize: number): number {
    const discountedPrice = this.calculateDiscountedPrice(totalPrice, discountPercentage);
    return discountedPrice / groupSize;
  }

  // Get upcoming schedules
  static getUpcomingSchedules(pkg: TourPackage): PackageSchedule[] {
    const today = new Date();
    return pkg.schedules.filter(schedule => {
      const endDate = new Date(schedule.assumeEndDate);
      return endDate >= today;
    });
  }

  // Get active dates range
  static getActiveDates(pkg: TourPackage): { from: Date; to: Date } {
    return {
      from: new Date(pkg.startDate),
      to: new Date(pkg.endDate)
    };
  }

  // Check if package is currently available
  static isPackageAvailable(pkg: TourPackage): boolean {
    const today = new Date();
    const startDate = new Date(pkg.startDate);
    const endDate = new Date(pkg.endDate);
    return pkg.packageStatus === 'ACTIVE' && today >= startDate && today <= endDate;
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

  // Add new package
  static async addPackage(
    packageData: AddPackageRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/package/add-package`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(packageData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding package:", error);
      throw error;
    }
  }

  // Update package
  static async updatePackage(
    packageData: UpdatePackageRequest
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/package/update-package`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(packageData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating package:", error);
      throw error;
    }
  }

  // Delete/terminate package
  static async deletePackage(
    packageId: number
  ): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/felicita/v0/api/package/delete-package/${packageId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting package:", error);
      throw error;
    }
  }

  // Calculate savings amount
  static calculateSavings(totalPrice: number, discountPercentage: number): number {
    return totalPrice * discountPercentage / 100;
  }

  // Format price with currency
  static formatPrice(amount: number): string {
    return `LKR ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Get package rating (placeholder - could be from reviews)
  static getPackageRating(pkg: TourPackage): number {
    // This is a placeholder - you'd normally get this from reviews
    return 4.5 + (pkg.discountPercentage / 50); // Higher discount = better rating
  }
}