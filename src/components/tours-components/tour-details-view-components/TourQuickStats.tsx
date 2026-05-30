"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Activity,
  Image,
  Clock,
  CheckCircle,
  XCircle,
  List,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourQuickStatsProps } from "@/types/tour-types";
import { hexToRgba } from "@/utils/functions";

export const TourQuickStats: React.FC<TourQuickStatsProps> = ({
  duration,
  totalDays,
  totalDestinations,
  totalActivities,
  totalSchedules,
  totalInclusions,
  totalExclusions,
  totalImages,
  status,
  tourTypeDtos,
  tourCategoryDto,
  seasonName,
}) => {
  const { theme } = useTheme();
  const isActive = status === "ACTIVE";

  const primaryTourType = tourTypeDtos?.[0];
  const primaryTourCategory = tourCategoryDto?.[0];

  const stats = [
    {
      label: "Duration",
      value: `${duration} ${duration === 1 ? "day" : "days"}`,
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Tour Days",
      value: totalDays,
      icon: Calendar,
      color: theme.accent || theme.primary,
    },
    {
      label: "Destinations",
      value: totalDestinations,
      icon: MapPin,
      color: theme.success,
    },
    {
      label: "Activities",
      value: totalActivities,
      icon: Activity,
      color: theme.warning,
    },
    {
      label: "Schedules",
      value: totalSchedules,
      icon: List,
      color: theme.primary,
    },
    {
      label: "Inclusions",
      value: totalInclusions,
      icon: CheckCircle,
      color: theme.success,
    },
    {
      label: "Exclusions",
      value: totalExclusions,
      icon: XCircle,
      color: theme.error,
    },
    {
      label: "Images",
      value: totalImages,
      icon: Image,
      color: theme.warning,
    },
  ];

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
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Quick Stats
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white ${
              isActive ? "bg-emerald-500" : "bg-gray-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {/* Tags Section */}
        <div
          className="flex flex-wrap gap-2 mb-4 pb-4 border-b"
          style={{ borderColor: theme.border }}
        >
          {primaryTourType && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              {primaryTourType.tourTypeName}
            </span>
          )}
          {primaryTourCategory && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: hexToRgba(theme.accent || theme.primary, 0.1),
                color: theme.accent || theme.primary,
              }}
            >
              {primaryTourCategory.tourCategoryName}
            </span>
          )}
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.1),
              color: theme.success,
            }}
          >
            {seasonName}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{
                backgroundColor: hexToRgba(stat.color, 0.04),
              }}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: hexToRgba(stat.color, 0.1) }}
              >
                <stat.icon
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  style={{ color: stat.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-sm sm:text-base font-semibold truncate"
                  style={{ color: theme.text }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
