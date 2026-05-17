// components/activities-components/view-activity-details-components/ActivityScheduleList.tsx
"use client";

import React, { useState } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Schedule } from "@/types/activity-types";

interface ActivityScheduleListProps {
  schedules: Schedule[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivityScheduleList: React.FC<ActivityScheduleListProps> = ({
  schedules,
}) => {
  const { theme } = useTheme();
  const [expandedSchedules, setExpandedSchedules] = useState<Set<number>>(new Set());

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          className="px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Schedules
          </h2>
        </div>
        <div className="px-6 py-8 text-center">
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
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Schedules ({schedules.length})
        </h2>
      </div>

      <div className="px-6 py-4 space-y-3">
        {schedules.map((schedule, idx) => {
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
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer transition-colors duration-200 hover:bg-opacity-50"
                style={{
                  backgroundColor: isExpanded ? hexToRgba(theme.primary, 0.05) : "transparent",
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                    <h3 className="font-semibold" style={{ color: theme.text }}>
                      {schedule.name}
                    </h3>
                  </div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    {formatDate(schedule.assume_start_date)} - {formatDate(schedule.assume_end_date)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} />
                ) : (
                  <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
                )}
              </button>

              {/* Schedule Details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {schedule.description && (
                    <div className="flex gap-2">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
                      <p className="text-sm" style={{ color: theme.textSecondary }}>
                        {schedule.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
                      <span className="text-xs" style={{ color: theme.textSecondary }}>
                        Duration: {schedule.duration_hours_start} - {schedule.duration_hours_end} hrs
                      </span>
                    </div>
                  </div>

                  {schedule.special_note && (
                    <div
                      className="rounded-lg p-2 text-xs"
                      style={{
                        backgroundColor: hexToRgba(theme.warning, 0.1),
                        color: theme.warning,
                      }}
                    >
                      📝 {schedule.special_note}
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