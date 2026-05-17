// components/activities-components/view-activity-details-components/ActivityCategories.tsx
"use client";

import React from "react";
import { Tag, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityCategoryDetail } from "@/types/activity-types";

interface ActivityCategoriesProps {
  categories: ActivityCategoryDetail[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivityCategories: React.FC<ActivityCategoriesProps> = ({
  categories,
}) => {
  const { theme } = useTheme();

  if (!categories.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Categories
          </h2>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No categories assigned.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" style={{ color: theme.primary }} />
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Categories
          </h2>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
                border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
              }}
            >
              {cat.is_primary && (
                <Star className="w-3 h-3" style={{ color: theme.warning }} />
              )}
              {cat.name}
            </span>
          ))}
        </div>

        {/* Primary category note */}
        {categories.some((c) => c.is_primary) && (
          <p className="text-xs mt-3 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Star className="w-3 h-3" style={{ color: theme.warning }} />
            Primary category is highlighted
          </p>
        )}
      </div>
    </div>
  );
};