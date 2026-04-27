"use client";

import React, { useState } from "react";
import { Activity, ChevronDown, Clock, DollarSign, Users, Calendar } from "lucide-react";
import { Activity as ActivityType } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ActivitiesListProps {
  activities: ActivityType[];
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ activities }) => {
  const { theme } = useTheme();
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);

  const toggleActivity = (activityId: number) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xs" style={{ color: theme.textSecondary }}>No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity.activityId}
          className="rounded-xl overflow-hidden transition-all duration-200"
          style={{
            border: expandedActivities.includes(activity.activityId)
              ? `1.5px solid ${hexToRgba(theme.warning, 0.5)}`
              : `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
            background: theme.surface,
          }}
        >
          <button
            onClick={() => toggleActivity(activity.activityId)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:opacity-80"
          >
            <div
              className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-200"
              style={{
                background: expandedActivities.includes(activity.activityId)
                  ? `linear-gradient(135deg, ${theme.warning}, ${theme.warning})`
                  : hexToRgba(theme.warning, 0.1),
                color: expandedActivities.includes(activity.activityId) ? "#fff" : theme.warning,
              }}
            >
              <Activity size={13} />
            </div>
            <span className="flex-1 text-sm font-medium truncate" style={{ color: theme.text }}>
              {activity.activityName}
            </span>
            <span
              className="text-xs flex-shrink-0 transition-transform duration-300"
              style={{
                color: theme.warning,
                transform: expandedActivities.includes(activity.activityId) ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown size={15} />
            </span>
          </button>
          {expandedActivities.includes(activity.activityId) && (
            <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid ${hexToRgba(theme.warning, 0.3)}` }}>
              <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}>
                {[
                  { label: "Duration", value: `${activity.durationHours}h`, icon: <Clock size={11} /> },
                  { label: "Local Price", value: `LKR ${activity.priceLocal.toLocaleString()}`, icon: <DollarSign size={11} /> },
                  { label: "Foreign Price", value: `LKR ${activity.priceForeigners.toLocaleString()}`, icon: <DollarSign size={11} /> },
                  { label: "Group Size", value: `${activity.minParticipate}–${activity.maxParticipate}`, icon: <Users size={11} /> },
                  { label: "Available", value: `${activity.availableFrom}–${activity.availableTo}`, icon: <Clock size={11} /> },
                  { label: "Season", value: activity.season, icon: <Calendar size={11} /> },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>{f.label}</p>
                    <p className="text-xs font-semibold flex items-center gap-1" style={{ color: theme.text }}>
                      <span style={{ color: theme.warning }}>{f.icon}</span>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
              {activity.activityCategories?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs mb-1.5" style={{ color: theme.textSecondary }}>Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {activity.activityCategories.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: hexToRgba(theme.warning, 0.1),
                          color: theme.warning,
                          border: `1px solid ${hexToRgba(theme.warning, 0.2)}`,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activity.activityDescription && (
                <p className="text-xs mt-3 leading-relaxed" style={{ color: theme.textSecondary }}>
                  {activity.activityDescription}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};