// components/activities-components/ActivityFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ActivityFilterParams } from '@/types/activity-types';
import { Search, Filter, X } from 'lucide-react';

interface ActivityFilterProps {
  filters: ActivityFilterParams;
  onFilterChange: (filters: ActivityFilterParams) => void;
  onSearch: () => void;
  availableCategories: string[];
  availableSeasons: string[];
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  availableCategories,
  availableSeasons,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);

  // Load static categories and seasons initially, merge with API ones
  useEffect(() => {
    const loadStaticData = async () => {
      const staticCategories = ["Adventure", "Cultural", "Wildlife", "Water Sports"];
      const staticSeasons = ["Summer", "Winter", "Spring", "Monsoon"];
      
      setCategories([...new Set([...staticCategories, ...availableCategories])]);
      setSeasons([...new Set([...staticSeasons, ...availableSeasons])]);
    };
    
    loadStaticData();
  }, [availableCategories, availableSeasons]);

  const handleInputChange = (field: keyof ActivityFilterParams, value: any) => {
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
      activityCategory: null,
      season: null,
      status: null,
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
            placeholder="Search activities by name, description, or category..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price Range (LKR)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || null)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Min"
                  min="0"
                />
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || null)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Duration (hours)
              </label>
              <input
                type="number"
                value={filters.duration || ''}
                onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 6"
                min="0"
                step="0.5"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.activityCategory || ''}
                onChange={(e) => handleInputChange('activityCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
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
                <option value="6">6 activities</option>
                <option value="9">9 activities</option>
                <option value="12">12 activities</option>
                <option value="24">24 activities</option>
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
          {(filters.minPrice || filters.maxPrice || filters.duration || filters.activityCategory || filters.season || filters.status) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.minPrice && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Min: LKR {filters.minPrice.toLocaleString()}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Max: LKR {filters.maxPrice.toLocaleString()}
                  </span>
                )}
                {filters.duration && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Max {filters.duration} hours
                  </span>
                )}
                {filters.activityCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.activityCategory}
                  </span>
                )}
                {filters.season && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {filters.season}
                  </span>
                )}
                {filters.status && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    filters.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {filters.status}
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

export default ActivityFilter;