// components/packages-components/PackageFilter.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { PackageFilterParams } from '@/types/package-types';
import { Search, Filter, X, Package, MapPin, Users, Calendar, DollarSign, Percent } from 'lucide-react';

interface PackageFilterProps {
  filters: PackageFilterParams;
  onFilterChange: (filters: PackageFilterParams) => void;
  onSearch: () => void;
  availablePackageTypes: string[];
  availableLocations: string[];
  availableTourNames: string[];
}

const PackageFilter: React.FC<PackageFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  availablePackageTypes,
  availableLocations,
  availableTourNames,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [packageTypes, setPackageTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [tourNames, setTourNames] = useState<string[]>([]);

  // Load static data initially, merge with API ones
  useEffect(() => {
    const loadStaticData = async () => {
      const staticPackageTypes = ["All-Inclusive", "Budget", "Luxury", "Family", "Honeymoon"];
      
      setPackageTypes([...new Set([...staticPackageTypes, ...availablePackageTypes])]);
      setLocations(availableLocations);
      setTourNames(availableTourNames);
    };
    
    loadStaticData();
  }, [availablePackageTypes, availableLocations, availableTourNames]);

  const handleInputChange = (field: keyof PackageFilterParams, value: any) => {
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
      packageType: null,
      location: null,
      minGroupSize: null,
      maxGroupSize: null,
      fromDate: null,
      toDate: null,
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

  // Format date for input
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
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
            placeholder="Search packages by name, description, or tour..."
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
            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                  Price Range (LKR)
                </div>
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

            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-gray-500" />
                  Package Type
                </div>
              </label>
              <select
                value={filters.packageType || ''}
                onChange={(e) => handleInputChange('packageType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All Types</option>
                {packageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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

            {/* Group Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  Group Size
                </div>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.minGroupSize || ''}
                  onChange={(e) => handleInputChange('minGroupSize', parseInt(e.target.value) || null)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Min"
                  min="1"
                />
                <input
                  type="number"
                  value={filters.maxGroupSize || ''}
                  onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value) || null)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Max"
                  min="1"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Date Range
                </div>
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={formatDateForInput(filters.fromDate)}
                  onChange={(e) => handleInputChange('fromDate', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={formatDateForInput(filters.toDate)}
                  onChange={(e) => handleInputChange('toDate', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
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
                <option value="6">6 packages</option>
                <option value="9">9 packages</option>
                <option value="12">12 packages</option>
                <option value="24">24 packages</option>
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
          {(filters.minPrice || filters.maxPrice || filters.duration || filters.packageType || 
            filters.location || filters.minGroupSize || filters.maxGroupSize || filters.fromDate || filters.toDate) && (
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
                    {filters.duration} days
                  </span>
                )}
                {filters.packageType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.packageType}
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                    {filters.location}
                  </span>
                )}
                {filters.minGroupSize && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Min {filters.minGroupSize} people
                  </span>
                )}
                {filters.maxGroupSize && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Max {filters.maxGroupSize} people
                  </span>
                )}
                {filters.fromDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    From: {new Date(filters.fromDate).toLocaleDateString()}
                  </span>
                )}
                {filters.toDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    To: {new Date(filters.toDate).toLocaleDateString()}
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

export default PackageFilter;