// components/activity-categories-components/view-category-details-components/CategoryQuickStats.tsx
"use client";

import React from "react";
import {
  Image,
  Star,
  List,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryQuickStatsProps {
  totalImages: number;
  totalPrimaryActivities: number;
  totalOtherActivities: number;
  totalActivities: number;
  status: string;
  color: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CategoryQuickStats: React.FC<CategoryQuickStatsProps> = ({
  totalImages,
  totalPrimaryActivities,
  totalOtherActivities,
  totalActivities,
  status,
  color,
}) => {
  const { theme } = useTheme();

  const getStatusIcon = () => {
    switch (status) {
      case "ACTIVE":
        return { icon: CheckCircle, color: "#10b981", label: "Active" };
      case "INACTIVE":
        return { icon: AlertCircle, color: "#f59e0b", label: "Inactive" };
      case "TERMINATED":
        return { icon: XCircle, color: "#ef4444", label: "Terminated" };
      default:
        return { icon: AlertCircle, color: theme.textSecondary, label: status };
    }
  };

  const StatusIcon = getStatusIcon().icon;

  const stats = [
    {
      label: "Images",
      value: totalImages,
      icon: Image,
      color: theme.warning,
    },
    {
      label: "Primary Activities",
      value: totalPrimaryActivities,
      icon: Star,
      color: theme.warning,
    },
    {
      label: "Other Activities",
      value: totalOtherActivities,
      icon: List,
      color: theme.primary,
    },
    {
      label: "Total Activities",
      value: totalActivities,
      icon: List,
      color: theme.success,
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
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Quick Stats
          </h2>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              backgroundColor: hexToRgba(getStatusIcon().color, 0.1),
            }}
          >
            <StatusIcon
              className="w-3.5 h-3.5"
              style={{ color: getStatusIcon().color }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: getStatusIcon().color }}
            >
              {getStatusIcon().label}
            </span>
          </div>
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

        {/* Color Indicator */}
        <div
          className="mt-4 pt-3 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              Category Color
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: theme.textSecondary }}
              >
                {color}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
