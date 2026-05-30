"use client";

import React, { useState } from "react";
import { Tag, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityCategoriesProps } from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityCategories: React.FC<ActivityCategoriesProps> = ({
  categories,
}) => {
  const { theme } = useTheme();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);
  const hasMoreCategories = categories.length > 4;

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
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Categories
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No categories assigned to this activity.
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
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Tag
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Activity Categories
          </h2>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {categories.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
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

        {hasMoreCategories && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center gap-1 text-xs font-medium mt-3 transition-colors hover:opacity-80"
            style={{ color: theme.primary }}
          >
            {showAllCategories ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {categories.length} Categories
              </>
            )}
          </button>
        )}

        {/* Primary category note */}
        {categories.some((c) => c.is_primary) && (
          <p
            className="text-xs mt-3 flex items-center gap-1 pt-2 border-t"
            style={{
              color: theme.textSecondary,
              borderColor: hexToRgba(theme.border, 0.5),
            }}
          >
            <Star className="w-3 h-3" style={{ color: theme.warning }} />
            Primary category is highlighted
          </p>
        )}
      </div>
    </div>
  );
};
