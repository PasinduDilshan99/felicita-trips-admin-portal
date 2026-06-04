"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Palette,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageScheduleOverviewProps } from "@/types/package-schedule-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate } from "@/utils/commonFunctions";

export const PackageScheduleOverview: React.FC<
  PackageScheduleOverviewProps
> = ({
  name,
  description,
  assumeStartDate,
  assumeEndDate,
  durationStart,
  durationEnd,
  specialNote,
  color,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayColor = color || theme.primary;

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
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Schedule Overview
        </h2>
        {color && (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full"
            style={{
              backgroundColor: hexToRgba(displayColor, 0.1),
              border: `1px solid ${hexToRgba(displayColor, 0.2)}`,
            }}
          >
            <Palette className="w-3 h-3" style={{ color: displayColor }} />
            <span
              className="text-[10px] font-medium"
              style={{ color: displayColor }}
            >
              {displayColor}
            </span>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Schedule Name */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Schedule Name
          </p>
          <h3
            className="text-lg sm:text-xl font-bold"
            style={{ color: theme.text }}
          >
            {name}
          </h3>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Start Date
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {formatDate(assumeStartDate)}
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
                End Date
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {formatDate(assumeEndDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Duration Range */}
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
              Duration Range
            </p>
            <p
              className="text-sm sm:text-base font-medium"
              style={{ color: theme.text }}
            >
              {durationStart} - {durationEnd} days
            </p>
          </div>
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
                backgroundColor: hexToRgba(displayColor, 0.04),
                border: `1px solid ${hexToRgba(displayColor, 0.1)}`,
              }}
            >
              <div className="flex gap-2">
                <FileText
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
                  style={{ color: displayColor }}
                />
                <div className="flex-1">
                  <p style={{ color: theme.textSecondary }}>
                    {truncatedDescription}
                  </p>
                  {description.length > 400 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
                      style={{ color: displayColor }}
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
            </div>
          </div>
        )}

        {/* Special Note */}
        {specialNote && (
          <div
            className="rounded-xl p-3 flex items-start gap-2"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.08),
              border: `1px solid ${hexToRgba(theme.warning, 0.15)}`,
            }}
          >
            <AlertCircle
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: theme.warning }}
            />
            <div>
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: theme.warning }}
              >
                Special Note
              </p>
              <p
                className="text-xs sm:text-sm"
                style={{ color: theme.textSecondary }}
              >
                {specialNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
