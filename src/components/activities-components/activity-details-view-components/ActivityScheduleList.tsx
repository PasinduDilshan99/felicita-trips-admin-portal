"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityScheduleListProps } from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";
import { formatDate } from "@/utils/commonFunctions";

export const ActivityScheduleList: React.FC<ActivityScheduleListProps> = ({
  schedules,
}) => {
  const { theme } = useTheme();
  const [expandedSchedules, setExpandedSchedules] = useState<Set<number>>(
    new Set(),
  );

  const toggleSchedule = (id: number) => {
    setExpandedSchedules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!schedules.length) {
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
            Schedules
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No schedules available for this activity.
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
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Schedules ({schedules.length})
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Available dates and durations
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {schedules.map((schedule) => {
          const isExpanded = expandedSchedules.has(schedule.id);
          const statusColor =
            schedule.status === 1 ? theme.success : theme.error;

          return (
            <div
              key={schedule.id}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              {/* Schedule Header */}
              <button
                onClick={() => toggleSchedule(schedule.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left cursor-pointer transition-colors duration-200 hover:bg-opacity-50"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                    <h3
                      className="font-semibold text-sm sm:text-base"
                      style={{ color: theme.text }}
                    >
                      {schedule.name}
                    </h3>
                  </div>
                  <div
                    className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(schedule.assume_start_date)} -{" "}
                      {formatDate(schedule.assume_end_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {schedule.duration_hours_start} -{" "}
                      {schedule.duration_hours_end} hrs
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.textSecondary }}
                  />
                ) : (
                  <ChevronDown
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.textSecondary }}
                  />
                )}
              </button>

              {/* Schedule Details */}
              {isExpanded && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
                  {schedule.description && (
                    <div className="flex gap-2">
                      <FileText
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: theme.textSecondary }}
                      />
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {schedule.description}
                      </p>
                    </div>
                  )}

                  {schedule.special_note && (
                    <div
                      className="rounded-lg p-2 text-xs flex items-start gap-1"
                      style={{
                        backgroundColor: hexToRgba(theme.warning, 0.1),
                        color: theme.warning,
                      }}
                    >
                      <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>{schedule.special_note}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
