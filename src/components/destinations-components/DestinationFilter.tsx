// components/destinations/DestinationFilter.tsx
"use client";

import React from 'react';
import { DestinationFilterParams } from '@/types/destination-types';
import { useTheme } from '@/contexts/ThemeContext';

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
  const { theme } = useTheme();

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
    <div 
      className="rounded-lg shadow-md p-6 mb-6 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        boxShadow: `0 4px 6px -1px ${hexToRgba(theme.text, 0.1)}, 0 2px 4px -1px ${hexToRgba(theme.text, 0.06)}`
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-semibold transition-colors duration-300"
          style={{ color: theme.text }}
        >
          Filter Destinations
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
            style={{ 
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Reset
          </button>
          <button
            onClick={onSearch}
            className="cursor-pointer px-4 py-2 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              color: '#fff'
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Destination Name
          </label>
          <input
            type="text"
            value={filters.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="Search by name..."
          />
        </div>

        {/* Duration */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Duration (hours)
          </label>
          <input
            type="number"
            value={filters.duration || ''}
            onChange={(e) => handleInputChange('duration', e.target.value ? parseFloat(e.target.value) : null)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder="Duration in hours"
            min="0"
          />
        </div>

        {/* Category - Now using categories from CommonContext */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Category
          </label>
          <select
            value={filters.destinationCategory || ''}
            onChange={(e) => handleInputChange('destinationCategory', e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
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
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Season
          </label>
          <select
            value={filters.season || ''}
            onChange={(e) => handleInputChange('season', e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
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
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Page Size
          </label>
          <select
            value={filters.pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
            style={{ 
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.background,
              color: theme.text,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <option value="6">6 per page</option>
            <option value="9">9 per page</option>
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
          </select>
        </div>
      </div>
      
      {/* Note about price filters being removed */}
      <div className="mt-4 text-xs italic transition-colors duration-300" style={{ color: theme.textSecondary }}>
        Note: Price filters are currently disabled
      </div>
    </div>
  );
};

export default DestinationFilter;