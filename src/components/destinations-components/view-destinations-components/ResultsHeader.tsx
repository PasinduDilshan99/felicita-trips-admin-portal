"use client";

import React from "react";
import { Grid, List } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ResultsHeaderProps {
  currentStart: number;
  currentEnd: number;
  totalItems: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  currentStart,
  currentEnd,
  totalItems,
  viewMode,
  onViewModeChange,
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-xl shadow-sm border p-6 mb-6 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Destination Results
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            Showing <span className="font-semibold" style={{ color: theme.primary }}>
              {currentStart}
            </span> to{' '}
            <span className="font-semibold" style={{ color: theme.primary }}>
              {currentEnd}
            </span> of{' '}
            <span className="font-semibold" style={{ color: theme.primary }}>
              {totalItems}
            </span> destinations
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm font-medium" style={{ color: theme.textSecondary }}>
            View as:
          </div>
          <div 
            className="flex rounded-xl border p-1 transition-colors duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}08)`,
              borderColor: theme.border 
            }}
          >
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'text-white shadow-md'
                  : 'hover:text-white'
              }`}
              style={
                viewMode === 'grid'
                  ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }
                  : { color: theme.textSecondary }
              }
              title="Grid View"
            >
              <Grid className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'text-white shadow-md'
                  : 'hover:text-white'
              }`}
              style={
                viewMode === 'list'
                  ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }
                  : { color: theme.textSecondary }
              }
              title="List View"
            >
              <List className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};