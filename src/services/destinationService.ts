// services/destinationService.ts
import { DestinationFilterParams, ApiResponse, Destination } from '@/types/destination-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class DestinationService {
  private static getAuthHeaders(): HeadersInit {
    // Get token from localStorage or cookies
    // This is a simplified version - you should implement your auth logic here
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  static async getDestinations(params: DestinationFilterParams): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/felicita/v0/api/destination/destinations`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  }

  // Helper method to get unique categories from destinations
  static extractCategories(destinations: Destination[]): string[] {
    const categories = destinations.map(dest => dest.categoryName);
    return Array.from(new Set(categories));
  }

  // Helper method to get unique seasons from activities
  static extractSeasons(destinations: Destination[]): string[] {
    const allSeasons: string[] = [];
    destinations.forEach(dest => {
      dest.activities.forEach(activity => {
        const seasons = activity.season.split(',').map(s => s.trim());
        allSeasons.push(...seasons);
      });
    });
    return Array.from(new Set(allSeasons));
  }
}