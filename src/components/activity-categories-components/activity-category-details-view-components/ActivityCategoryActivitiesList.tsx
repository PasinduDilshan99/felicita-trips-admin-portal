"use client";

import React, { useState } from "react";
import {
  Activity,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityCategoryActivitiesListProps } from "@/types/activity-category-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityCategoryActivitiesList: React.FC<
  ActivityCategoryActivitiesListProps
> = ({ primaryActivities, otherActivities, categoryColor, onViewActivity }) => {
  const { theme } = useTheme();
  const [showAllPrimary, setShowAllPrimary] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);

  const visiblePrimary = showAllPrimary
    ? primaryActivities
    : primaryActivities.slice(0, 5);
  const visibleOther = showAllOther
    ? otherActivities
    : otherActivities.slice(0, 5);

  const hasMorePrimary = primaryActivities.length > 5;
  const hasMoreOther = otherActivities.length > 5;

  const totalActivities = primaryActivities.length + otherActivities.length;

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
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Activity
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: categoryColor }}
            />
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Associated Activities
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Activity
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
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
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: categoryColor }}
            />
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Associated Activities
            </h2>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: hexToRgba(categoryColor, 0.1),
                color: categoryColor,
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

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
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
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.1),
                  color: theme.warning,
                }}
              >
                Featured
              </span>
            </div>
            <div className="space-y-2">
              {visiblePrimary.map((activity) => (
                <button
                  key={activity.activityId}
                  onClick={() =>
                    onViewActivity(activity.activityId, activity.activityName)
                  }
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
            {hasMorePrimary && (
              <button
                onClick={() => setShowAllPrimary(!showAllPrimary)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: theme.warning }}
              >
                {showAllPrimary ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show All {primaryActivities.length} Primary Activities
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Other Activities Section */}
        {otherActivities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" style={{ color: categoryColor }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Other Activities
              </h3>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(categoryColor, 0.1),
                  color: categoryColor,
                }}
              >
                {otherActivities.length}
              </span>
            </div>
            <div className="space-y-2">
              {visibleOther.map((activity) => (
                <button
                  key={activity.activityId}
                  onClick={() =>
                    onViewActivity(activity.activityId, activity.activityName)
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group"
                  style={{
                    backgroundColor: hexToRgba(categoryColor, 0.03),
                    border: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      categoryColor,
                      0.08,
                    );
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = hexToRgba(
                      categoryColor,
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
                    style={{ color: categoryColor }}
                  />
                </button>
              ))}
            </div>
            {hasMoreOther && (
              <button
                onClick={() => setShowAllOther(!showAllOther)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: categoryColor }}
              >
                {showAllOther ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show All {otherActivities.length} Other Activities
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
