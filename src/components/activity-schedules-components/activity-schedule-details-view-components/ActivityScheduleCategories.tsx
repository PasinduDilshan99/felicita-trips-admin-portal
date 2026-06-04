"use client";

import React from "react";
import { Tag, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityScheduleCategoriesProps } from "@/types/activity-schedule-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityScheduleCategories: React.FC<
  ActivityScheduleCategoriesProps
> = ({ categories }) => {
  const { theme } = useTheme();

  if (!categories.length) {
    return null;
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
          <p
            className="text-xs mt-3 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Star className="w-3 h-3" style={{ color: theme.warning }} />
            Primary category is highlighted
          </p>
        )}
      </div>
    </div>
  );
};
