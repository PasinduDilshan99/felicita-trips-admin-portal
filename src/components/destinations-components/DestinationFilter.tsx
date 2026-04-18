// components/destinations/DestinationFilter.tsx
import React from 'react';
import { DestinationFilterParams } from '@/types/destination-types';

interface DestinationFilterProps {
  filters: DestinationFilterParams;
  onFilterChange: (filters: DestinationFilterParams) => void;
  onSearch: () => void;
  onReset: () => void;
  onPageSizeChange: (pageSize: number) => void;
  availableCategories: string[];
  availableSeasons: string[];
}

const DestinationFilter: React.FC<DestinationFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onPageSizeChange,
  availableCategories,
  availableSeasons,
}) => {
  const handleInputChange = (field: keyof DestinationFilterParams, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? null : value,
    });
  };

  const handlePageSizeChange = (value: string) => {
    const pageSize = parseInt(value, 10);
    onPageSizeChange(pageSize);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filter Destinations</h2>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600">
        {/* Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Name
          </label>
          <input
            type="text"
            value={filters.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name..."
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            value={filters.duration || ''}
            onChange={(e) => handleInputChange('duration', e.target.value ? parseFloat(e.target.value) : null)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Duration in hours"
            min="0"
          />
        </div>

        {/* Category - Now using categories from CommonContext */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.destinationCategory || ''}
            onChange={(e) => handleInputChange('destinationCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Season */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Season
          </label>
          <select
            value={filters.season || ''}
            onChange={(e) => handleInputChange('season', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Seasons</option>
            {availableSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Size
          </label>
          <select
            value={filters.pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6">6 per page</option>
            <option value="9">9 per page</option>
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
          </select>
        </div>
      </div>
      
      {/* Note about price filters being removed */}
      <div className="mt-4 text-xs text-gray-500 italic">
        Note: Price filters are currently disabled
      </div>
    </div>
  );
};

export default DestinationFilter;