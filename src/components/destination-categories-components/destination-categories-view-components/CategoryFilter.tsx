// components/destination-categories-components/destination-categories-view-components/CategoryFilter.tsx
// This component already works fine as is, but add a useEffect to sync with external filter changes if needed

"use client";

import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface CategoryFilterParams {
  searchTerm: string | null;
  categoryStatus: "ACTIVE" | "INACTIVE" | null;
  pageSize: number;
  pageNumber: number;
}

interface CategoryFilterProps {
  filters: CategoryFilterParams;
  onFilterChange: (filters: CategoryFilterParams) => void;
  onSearch: () => void;
  onReset: () => void;
  onPageSizeChange: (pageSize: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  onPageSizeChange,
}) => {
  const { theme } = useTheme();

  // Local state for input values to handle controlled inputs
  const [localSearchTerm, setLocalSearchTerm] = React.useState(filters.searchTerm || '');
  const [localStatus, setLocalStatus] = React.useState(filters.categoryStatus || '');
  const [localPageSize, setLocalPageSize] = React.useState(filters.pageSize.toString());

  // Sync local state with filters prop (for URL changes)
  useEffect(() => {
    setLocalSearchTerm(filters.searchTerm || '');
    setLocalStatus(filters.categoryStatus || '');
    setLocalPageSize(filters.pageSize.toString());
  }, [filters.searchTerm, filters.categoryStatus, filters.pageSize]);

  const handleInputChange = (field: keyof CategoryFilterParams, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? null : value,
    });
  };

  const handlePageSizeChange = (value: string) => {
    const pageSize = parseInt(value, 10);
    setLocalPageSize(value);
    onPageSizeChange(pageSize);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleLocalSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    handleInputChange('searchTerm', value);
  };

  const handleLocalStatusChange = (value: string) => {
    setLocalStatus(value);
    handleInputChange('categoryStatus', value);
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
          Filter Categories
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
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
            className="px-4 py-2 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-105"
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
        {/* Search Term Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Search Categories
          </label>
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => handleLocalSearchChange(e.target.value)}
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
            placeholder="Search by name or description..."
          />
        </div>

        {/* Status Filter */}
        <div>
          <label 
            className="block text-sm font-medium mb-1 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
          >
            Status
          </label>
          <select
            value={localStatus}
            onChange={(e) => handleLocalStatusChange(e.target.value)}
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
            value={localPageSize}
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
    </div>
  );
};

export default CategoryFilter;