// components/activities-components/view-activity-details-components/ActivityQuickStats.tsx
"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Image,
  Users,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ActivityQuickStatsProps {
  totalSchedules: number;
  totalRequirements: number;
  totalImages: number;
  durationHours: number;
  priceRange: string;
  seasonName?: string;
  status: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivityQuickStats: React.FC<ActivityQuickStatsProps> = ({
  totalSchedules,
  totalRequirements,
  totalImages,
  durationHours,
  priceRange,
  seasonName,
  status,
}) => {
  const { theme } = useTheme();
  const isActive = status === "ACTIVE";

  const stats = [
    {
      label: "Duration",
      value: durationHours ? `${durationHours} hours` : "Not set",
      icon: Clock,
      color: theme.primary,
    },
    {
      label: "Schedules",
      value: totalSchedules,
      icon: Calendar,
      color: theme.accent || theme.primary,
    },
    {
      label: "Requirements",
      value: totalRequirements,
      icon: Users,
      color: theme.success,
    },
    {
      label: "Images",
      value: totalImages,
      icon: Image,
      color: theme.warning,
    },
    {
      label: "Price Range",
      value: priceRange,
      icon: DollarSign,
      color: theme.primary,
    },
  ];

  if (seasonName) {
    stats.push({
      label: "Season",
      value: seasonName,
      icon: Tag,
      color: theme.secondary || theme.primary,
    });
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
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Quick Stats
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-gray-500/15 text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="space-y-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b last:border-0"
              style={{ borderColor: hexToRgba(theme.border, 0.5) }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(stat.color, 0.1) }}
                >
                  <stat.icon
                    className="w-4 h-4"
                    style={{ color: stat.color }}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {stat.label}
                </span>
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
