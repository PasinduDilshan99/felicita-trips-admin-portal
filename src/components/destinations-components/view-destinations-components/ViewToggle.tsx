"use client";

import React from "react";
import { Grid, List } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  const { theme } = useTheme();

  return (
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
  );
};