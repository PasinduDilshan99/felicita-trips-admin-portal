"use client";

import React, { useState } from "react";
import {
  Activity,
  TrendingUp,
  Tag,
  Clock,
  Calendar,
  Users,
  ChevronDown,
  Shield,
  Share2,
} from "lucide-react";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";

interface ActivityItem {
  activityId: number;
  activityName: string;
  activityDescription?: string;
  activityCategories?: string[];
  durationHours?: number;
  season?: string;
  minParticipate?: number;
  maxParticipate?: number;
  availableFrom?: string;
  availableTo?: string;
}

interface ActivitiesListProps {
  activities: ActivityItem[];
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
}) => {
  const { theme } = useTheme();
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl border shadow-sm p-7 fade-up delay-2 transition-colors duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className="flex items-center gap-2.5 text-lg font-bold"
          style={{ color: theme.text }}
        >
          <IconBadge icon={Activity} color={theme.accent} />
          Available Activities
        </h2>
        <span
          className="px-3.5 py-1.5 rounded-full text-xs font-bold border"
          style={{
            backgroundColor: hexToRgba(theme.accent, 0.1),
            color: theme.accent,
            borderColor: hexToRgba(theme.accent, 0.3),
          }}
        >
          {activities.length} total
        </span>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const isOpen = selectedActivity === activity.activityId;
          return (
            <div
              key={activity.activityId}
              className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                isOpen ? "shadow-lg" : "hover:shadow-md"
              }`}
              style={{
                borderColor: isOpen ? theme.primary : theme.border,
                backgroundColor: theme.surface,
                boxShadow: isOpen
                  ? `0 0 0 2px ${hexToRgba(theme.primary, 0.125)}, 0 8px 24px ${hexToRgba(theme.primary, 0.125)}`
                  : undefined,
              }}
              onClick={() =>
                setSelectedActivity(isOpen ? null : activity.activityId)
              }
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                        }}
                      >
                        <TrendingUp size={16} color="#fff" />
                      </div>
                      <div>
                        <h3
                          className="font-bold mb-1"
                          style={{ color: theme.text }}
                        >
                          {activity.activityName}
                        </h3>
                        {activity.activityDescription && (
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: theme.textSecondary }}
                          >
                            {activity.activityDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {activity.activityCategories &&
                      activity.activityCategories.length > 0 ? (
                        activity.activityCategories.map((cat, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                            style={{
                              backgroundColor: hexToRgba(theme.success, 0.1),
                              color: theme.success,
                              borderColor: hexToRgba(theme.success, 0.3),
                            }}
                          >
                            <Tag size={10} /> {cat}
                          </span>
                        ))
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: theme.background,
                            color: theme.textSecondary,
                            borderColor: theme.border,
                          }}
                        >
                          No categories
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: hexToRgba(theme.warning, 0.1),
                          color: theme.warning,
                          borderColor: hexToRgba(theme.warning, 0.3),
                        }}
                      >
                        <Clock size={11} /> {activity.durationHours ?? 0}h
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.1),
                          color: theme.primary,
                          borderColor: hexToRgba(theme.primary, 0.3),
                        }}
                      >
                        <Calendar size={11} /> {activity.season ?? "N/A"}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: hexToRgba(theme.secondary, 0.1),
                          color: theme.secondary,
                          borderColor: hexToRgba(theme.secondary, 0.3),
                        }}
                      >
                        <Users size={11} /> {activity.minParticipate ?? 0}–
                        {activity.maxParticipate ?? 0} pax
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center gap-1.5 mt-3.5 text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  <span>{isOpen ? "Collapse" : "View details"}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: theme.textSecondary }}
                  />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-400 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div
                  className="p-5 border-t"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div
                      className="p-3.5 rounded-xl border"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconBadge icon={Clock} color={theme.success} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme.text }}
                        >
                          Operating Hours
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        From:{" "}
                        <strong style={{ color: theme.text }}>
                          {activity.availableFrom
                            ? activity.availableFrom.slice(0, 5)
                            : "N/A"}
                        </strong>
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.textSecondary }}
                      >
                        To:{" "}
                        <strong style={{ color: theme.text }}>
                          {activity.availableTo
                            ? activity.availableTo.slice(0, 5)
                            : "N/A"}
                        </strong>
                      </p>
                      <div
                        className="mt-2.5 h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: theme.border }}
                      >
                        <div
                          className="w-3/4 h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${theme.success}, ${hexToRgba(theme.success, 0.5)})`,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="p-3.5 rounded-xl border"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconBadge icon={Users} color={theme.secondary} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme.text }}
                        >
                          Group Size
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Min:{" "}
                        <strong style={{ color: theme.text }}>
                          {activity.minParticipate ?? 0}
                        </strong>
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Max:{" "}
                        <strong style={{ color: theme.text }}>
                          {activity.maxParticipate ?? 0}
                        </strong>
                      </p>
                    </div>
                    <div
                      className="p-3.5 rounded-xl border"
                      style={{
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconBadge icon={Clock} color={theme.warning} />
                        <span
                          className="text-xs font-bold"
                          style={{ color: theme.text }}
                        >
                          Duration
                        </span>
                      </div>
                      <p
                        className="text-2xl font-extrabold"
                        style={{ color: theme.text }}
                      >
                        {activity.durationHours ?? 0}
                        <span
                          className="text-sm font-medium ml-1"
                          style={{ color: theme.textSecondary }}
                        >
                          hrs
                        </span>
                      </p>
                      <div
                        className="flex items-center gap-1.5 mt-2 text-[11px]"
                        style={{ color: theme.success }}
                      >
                        <Shield size={12} /> Flexible timing
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
                      style={{
                        backgroundColor: hexToRgba(theme.success, 0.1),
                        color: theme.success,
                      }}
                    >
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};