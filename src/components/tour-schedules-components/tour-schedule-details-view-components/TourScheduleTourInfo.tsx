"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourScheduleTourInfoProps } from "@/types/tour-schedule-types";
import { hexToRgba } from "@/utils/functions";

export const TourScheduleTourInfo: React.FC<TourScheduleTourInfoProps> = ({
  tourId,
  tourName,
  tourDescription,
  tourDuration,
  startLocation,
  endLocation,
  latitude,
  longitude,
  season,
  tourStatus,
  assignMessage,
  onViewTour,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    tourDescription?.length > 200 && !isExpanded
      ? tourDescription.slice(0, 200) + "..."
      : tourDescription;

  const isActive = tourStatus === "ACTIVE";

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onClick={onViewTour}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <MapPin
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Associated Tour
          </h2>
        </div>
        <ExternalLink
          className="w-4 h-4 sm:w-5 sm:h-5 opacity-60"
          style={{ color: theme.primary }}
        />
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {/* Tour Name and Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: theme.textSecondary }}
            >
              Tour Name
            </p>
            <h3
              className="font-semibold text-sm sm:text-base hover:underline"
              style={{ color: theme.primary }}
            >
              {tourName}
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${
              isActive ? "bg-emerald-500" : "bg-gray-500"
            }`}
          >
            {tourStatus}
          </span>
        </div>

        {/* Basic Info */}
        <div
          className="grid grid-cols-2 gap-2 text-xs"
          style={{ color: theme.textSecondary }}
        >
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {tourDuration} {tourDuration === 1 ? "day" : "days"}
            </span>
          </div>
          {season && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{season}</span>
            </div>
          )}
          <div className="flex items-center gap-1 col-span-2">
            <MapPin className="w-3 h-3" />
            <span>
              {startLocation} → {endLocation}
            </span>
          </div>
        </div>

        {/* Description */}
        {tourDescription && (
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Tour Description
            </p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              {truncatedDescription}
            </p>
            {tourDescription.length > 200 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-xs mt-1 transition-colors hover:opacity-80"
                style={{ color: theme.primary }}
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        )}

        {/* Assign Message */}
        {assignMessage && (
          <div
            className="rounded-lg p-2 flex items-start gap-1 text-xs"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.08),
              color: theme.warning,
            }}
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>{assignMessage}</span>
          </div>
        )}

        {/* Coordinates */}
        {latitude && longitude && (
          <div
            className="text-[10px] font-mono"
            style={{ color: theme.textSecondary }}
          >
            📍 {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
          </div>
        )}

        {/* Click hint */}
        <div className="text-center pt-2">
          <span className="text-[10px]" style={{ color: theme.textSecondary }}>
            Click to view full tour details
          </span>
        </div>
      </div>
    </div>
  );
};
