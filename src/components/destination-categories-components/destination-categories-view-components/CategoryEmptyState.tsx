// components/destinations-components/category-components/CategoryEmptyState.tsx
"use client";

import React from "react";
import { Tag, Filter, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface CategoryEmptyStateProps {
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
  searchTerm?: string | null;
}

export const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({ 
  onClearFilters,
  hasActiveFilters = false,
  searchTerm = null
}) => {
  const { theme } = useTheme();

  const getMessage = () => {
    if (hasActiveFilters && searchTerm) {
      return `No categories found matching "${searchTerm}"`;
    }
    if (hasActiveFilters) {
      return "No categories match your current filters";
    }
    return "No categories available";
  };

  const getDescription = () => {
    if (hasActiveFilters) {
      return "Try adjusting your search filters or clearing them to see all categories";
    }
    return "There are no destination categories available at the moment. Please check back later.";
  };

  const getIcon = () => {
    if (hasActiveFilters && searchTerm) {
      return <Search className="w-12 h-12" style={{ color: theme.textSecondary }} />;
    }
    if (hasActiveFilters) {
      return <Filter className="w-12 h-12" style={{ color: theme.textSecondary }} />;
    }
    return <Tag className="w-12 h-12" style={{ color: theme.textSecondary }} />;
  };

  return (
    <div 
      className="rounded-xl shadow-sm border p-16 text-center transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <div 
        className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`
        }}
      >
        {getIcon()}
      </div>
      <div className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>
        {getMessage()}
      </div>
      <p className="mb-6 max-w-md mx-auto" style={{ color: theme.textSecondary }}>
        {getDescription()}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: '#fff'
          }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};