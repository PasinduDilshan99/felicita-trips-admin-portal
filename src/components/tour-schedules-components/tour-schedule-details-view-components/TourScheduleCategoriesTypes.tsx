// components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleCategoriesTypes.tsx
"use client";

import React, { useState } from "react";
import { Tag, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourScheduleCategory, TourScheduleType } from "@/types/tour-schedule-types";

interface TourScheduleCategoriesTypesProps {
  categories: TourScheduleCategory[];
  types: TourScheduleType[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourScheduleCategoriesTypes: React.FC<TourScheduleCategoriesTypesProps> = ({
  categories,
  types,
}) => {
  const { theme } = useTheme();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 3);
  const visibleTypes = showAllTypes ? types : types.slice(0, 3);

  if (!categories.length && !types.length) {
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
          <Tag className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.primary }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            Categories & Types
          </h2>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Categories Section */}
        {categories.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.text }}>
              Categories ({categories.length})
            </p>
            <div className="space-y-2">
              {visibleCategories.map((cat) => (
                <div
                  key={cat.categoryId}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.04),
                    border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {cat.primaryCategory && (
                      <Star className="w-3 h-3" style={{ color: theme.warning }} />
                    )}
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      {cat.categoryName}
                    </span>
                  </div>
                  {cat.primaryCategory && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: hexToRgba(theme.warning, 0.1), color: theme.warning }}>
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
            {categories.length > 3 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
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
          </div>
        )}

        {/* Types Section */}
        {types.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.text }}>
              Types ({types.length})
            </p>
            <div className="space-y-2">
              {visibleTypes.map((type) => (
                <div
                  key={type.typeId}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.accent || theme.primary, 0.04),
                    border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {type.primaryType && (
                      <Star className="w-3 h-3" style={{ color: theme.warning }} />
                    )}
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      {type.typeName}
                    </span>
                  </div>
                  {type.primaryType && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: hexToRgba(theme.warning, 0.1), color: theme.warning }}>
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
            {types.length > 3 && (
              <button
                onClick={() => setShowAllTypes(!showAllTypes)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: theme.accent || theme.primary }}
              >
                {showAllTypes ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show All {types.length} Types
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};