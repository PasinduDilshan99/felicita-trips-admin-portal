"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  const { theme } = useTheme();

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
          background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}10)`
        }}
      >
        <LayoutDashboard className="w-12 h-12" style={{ color: theme.textSecondary }} />
      </div>
      <div className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>
        No destinations found
      </div>
      <p className="mb-6" style={{ color: theme.textSecondary }}>
        Try adjusting your search filters or explore different categories
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          color: '#fff'
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};