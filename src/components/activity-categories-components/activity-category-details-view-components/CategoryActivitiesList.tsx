// components/activity-categories-components/view-category-details-components/CategoryActivitiesList.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, List, ChevronRight, Package } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  PrimaryActivity,
  OtherActivity,
} from "@/types/activity-category-types";
import { ACTIVITIES_VIEW_PAGE_URL } from "@/utils/urls";

interface CategoryActivitiesListProps {
  primaryActivities: PrimaryActivity[];
  otherActivities: OtherActivity[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CategoryActivitiesList: React.FC<CategoryActivitiesListProps> = ({
  primaryActivities,
  otherActivities,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const totalActivities = primaryActivities.length + otherActivities.length;

  const handleActivityClick = (activityId: number) => {
    router.push(`${ACTIVITIES_VIEW_PAGE_URL}/${activityId}`);
  };

  if (totalActivities === 0) {
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
            <Package className="w-4 h-4" style={{ color: theme.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
              Associated Activities
            </h2>
          </div>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No activities associated with this category.
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" style={{ color: theme.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
              Associated Activities
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              {totalActivities}
            </span>
          </div>
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          Activities that belong to this category
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Primary Activities Section */}
        {primaryActivities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4" style={{ color: theme.warning }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Primary Activities
              </h3>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.1),
                  color: theme.warning,
                }}
              >
                Featured
              </span>
            </div>
            <div className="space-y-2">
              {primaryActivities.map((activity) => (
                <button
                  key={activity.activityId}
                  onClick={() => handleActivityClick(activity.activityId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group"
                  style={{
                    backgroundColor: hexToRgba(theme.warning, 0.05),
                    border: `1px solid ${hexToRgba(theme.warning, 0.15)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.warning,
                      0.1,
                    );
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.warning,
                      0.05,
                    );
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Star
                      className="w-4 h-4"
                      style={{ color: theme.warning }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {activity.activityName}
                    </span>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: theme.warning }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other Activities Section */}
        {otherActivities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <List className="w-4 h-4" style={{ color: theme.primary }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Other Activities
              </h3>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  color: theme.primary,
                }}
              >
                {otherActivities.length}
              </span>
            </div>
            <div className="space-y-2">
              {otherActivities.map((activity) => (
                <button
                  key={activity.activityId}
                  onClick={() => handleActivityClick(activity.activityId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.03),
                    border: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.primary,
                      0.08,
                    );
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      theme.primary,
                      0.03,
                    );
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span className="text-sm" style={{ color: theme.text }}>
                    {activity.activityName}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: theme.primary }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
