// components/tours-components/TourFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { TourFilterParams } from '@/types/tour-types';
import { Search, Filter, X, MapPin, Calendar, Tag, Users } from 'lucide-react';

interface TourFilterProps {
  filters: TourFilterParams;
  onFilterChange: (filters: TourFilterParams) => void;
  onSearch: () => void;
  availableTourTypes: string[];
  availableTourCategories: string[];
  availableSeasons: string[];
  availableLocations: string[];
}

const TourFilter: React.FC<TourFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  availableTourTypes,
  availableTourCategories,
  availableSeasons,
  availableLocations,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [tourTypes, setTourTypes] = useState<string[]>([]);
  const [tourCategories, setTourCategories] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Load static data initially, merge with API ones
  useEffect(() => {
    const loadStaticData = async () => {
      const staticTourTypes = ["Adventure", "Cultural", "Wildlife", "Beach", "Historical"];
      const staticTourCategories = ["Solo", "Family", "Group", "Budget", "Luxury"];
      const staticSeasons = ["Spring", "Summer", "Winter", "Monsoon"];
      
      setTourTypes([...new Set([...staticTourTypes, ...availableTourTypes])]);
      setTourCategories([...new Set([...staticTourCategories, ...availableTourCategories])]);
      setSeasons([...new Set([...staticSeasons, ...availableSeasons])]);
      setLocations(availableLocations);
    };
    
    loadStaticData();
  }, [availableTourTypes, availableTourCategories, availableSeasons, availableLocations]);

  const handleInputChange = (field: keyof TourFilterParams, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? null : value,
    });
  };

  const handlePageSizeChange = (value: string) => {
    const pageSize = parseInt(value, 10);
    onFilterChange({
      ...filters,
      pageSize,
      pageNumber: 1,
    });
  };

  const handleReset = () => {
    onFilterChange({
      name: null,
      minPrice: null,
      maxPrice: null,
      duration: null,
      tourType: null,
      tourCategory: null,
      season: null,
      location: null,
      pageSize: 6,
      pageNumber: 1,
    });
    setIsAdvancedOpen(false);
  };

  const handleQuickSearch = (value: string) => {
    onFilterChange({
      ...filters,
      name: value || null,
      pageNumber: 1,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* Quick Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filters.name || ''}
            onChange={(e) => handleQuickSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            placeholder="Search tours by name, description, or type..."
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">
            {isAdvancedOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <X className="w-4 h-4 mr-2" />
            Reset All
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-gray-200 pt-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Duration (days)
                </div>
              </label>
              <input
                type="number"
                value={filters.duration || ''}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 5"
                min="1"
              />
            </div>

            {/* Tour Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-gray-500" />
                  Tour Type
                </div>
              </label>
              <select
                value={filters.tourType || ''}
                onChange={(e) => handleInputChange('tourType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Types</option>
                {tourTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Tour Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  Tour Category
                </div>
              </label>
              <select
                value={filters.tourCategory || ''}
                onChange={(e) => handleInputChange('tourCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {tourCategories.map((category) => (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Seasons</option>
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Location
                </div>
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Results per page
              </label>
              <select
                value={filters.pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="6">6 tours</option>
                <option value="9">9 tours</option>
                <option value="12">12 tours</option>
                <option value="24">24 tours</option>
              </select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                onClick={onSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.duration || filters.tourType || filters.tourCategory || filters.season || filters.location) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.duration && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.duration} days
                  </span>
                )}
                {filters.tourType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.tourType}
                  </span>
                )}
                {filters.tourCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {filters.tourCategory}
                  </span>
                )}
                {filters.season && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {filters.season}
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                    {filters.location}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TourFilter;