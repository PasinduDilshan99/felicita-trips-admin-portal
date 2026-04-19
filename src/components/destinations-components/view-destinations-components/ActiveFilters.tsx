"use client";

import React from "react";
import { X, Filter } from "lucide-react";
import { DestinationFilterParams } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

interface ActiveFiltersProps {
  filters: DestinationFilterParams;
  onRemoveFilter: (key: keyof DestinationFilterParams) => void;
  onClearAll: () => void;
  availableCategories: string[];
  availableSeasons: string[];
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const { theme } = useTheme();

  interface ActiveFilterItem {
    key: keyof DestinationFilterParams;
    label: string;
    value: string;
  }

  const activeFilters: ActiveFilterItem[] = [];

  if (filters.name) {
    activeFilters.push({ key: 'name', label: 'Name', value: filters.name });
  }
  if (filters.destinationCategory) {
    activeFilters.push({ key: 'destinationCategory', label: 'Category', value: filters.destinationCategory });
  }
  if (filters.season) {
    activeFilters.push({ key: 'season', label: 'Season', value: filters.season });
  }
  if (filters.status) {
    activeFilters.push({ key: 'status', label: 'Status', value: filters.status });
  }
  if (filters.duration) {
    activeFilters.push({ key: 'duration', label: 'Duration', value: `${filters.duration} hours` });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div 
      className="rounded-xl shadow-sm border p-4 mb-6 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: theme.primary }} />
          <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
            Active Filters:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-300"
              style={{ 
                backgroundColor: `${theme.primary}10`,
                border: `1px solid ${theme.primary}30`,
              }}
            >
              <span className="font-medium" style={{ color: theme.primary }}>
                {filter.label}:
              </span>
              <span style={{ color: theme.text }}>{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-1 transition-colors hover:opacity-70"
                style={{ color: theme.primary }}
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClearAll}
          className="text-sm transition-colors flex items-center gap-1 hover:opacity-70"
          style={{ color: theme.error }}
        >
          <X className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>
    </div>
  );
};