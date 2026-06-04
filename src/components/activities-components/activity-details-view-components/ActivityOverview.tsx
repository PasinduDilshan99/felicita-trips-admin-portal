"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityOverviewProps } from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({
  name,
  description,
  destinationName,
  destinationId,
  availableFrom,
  availableTo,
  durationHours,
  seasonName,
  onViewDestination,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const truncatedDescription =
    description?.length > 400 && !isExpanded
      ? description.slice(0, 400) + "..."
      : description;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
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
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Activity Overview
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Activity Name */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Activity Name
          </p>
          <h3
            className="text-lg sm:text-xl font-bold"
            style={{ color: theme.text }}
          >
            {name}
          </h3>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Clock
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium"
                style={{ color: theme.textSecondary }}
              >
                Duration
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {durationHours} hours
              </p>
            </div>
          </div>

          {seasonName && (
            <div className="flex items-start gap-2">
              <Calendar
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: theme.primary }}
              />
              <div>
                <p
                  className="text-[10px] sm:text-xs font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Season
                </p>
                <p
                  className="text-sm sm:text-base font-medium"
                  style={{ color: theme.text }}
                >
                  {seasonName}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <Calendar
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.success }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium"
                style={{ color: theme.textSecondary }}
              >
                Available From
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {formatDate(availableFrom)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.error }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium"
                style={{ color: theme.textSecondary }}
              >
                Available To
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {formatDate(availableTo)}
              </p>
            </div>
          </div>
        </div>

        {/* Destination Info - Clickable */}
        <div
          className="rounded-xl p-3 cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.05),
            border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
          }}
          onClick={onViewDestination}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.success }} />
              <div>
                <p
                  className="text-[10px] sm:text-xs font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Destination
                </p>
                <p
                  className="text-sm sm:text-base font-medium hover:underline"
                  style={{ color: theme.success }}
                >
                  {destinationName}
                </p>
              </div>
            </div>
            <ExternalLink
              className="w-4 h-4 opacity-60"
              style={{ color: theme.success }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Click to view destination details
          </p>
        </div>

        {/* Description */}
        {description && (
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2"
              style={{ color: theme.textSecondary }}
            >
              Description
            </p>
            <div
              className="text-xs sm:text-sm leading-relaxed rounded-xl p-3 sm:p-4"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.08)}`,
              }}
            >
              <p style={{ color: theme.textSecondary }}>
                {truncatedDescription}
              </p>
              {description.length > 400 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
                  style={{ color: theme.primary }}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Read More
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
