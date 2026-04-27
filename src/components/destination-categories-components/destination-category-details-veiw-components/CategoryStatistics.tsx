// components/destination-categories-components/destination-category-details-view-components/CategoryStatistics.tsx
"use client";

import React from "react";
import { Image as ImageIcon, Calendar, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryStatisticsProps {
  totalImages: number;
  totalDestinations: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  color: string;
}

const CategoryStatistics = ({ totalImages, totalDestinations, createdAt, updatedAt, status, color }: CategoryStatisticsProps) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const stats = [
    {
      icon: ImageIcon,
      label: "Total Images",
      value: totalImages,
      color: color || theme.primary,
    },
    {
      icon: MapPin,
      label: "Total Destinations",
      value: totalDestinations,
      color: color || theme.primary,
    },
    {
      icon: Calendar,
      label: "Created At",
      value: formatDate(createdAt),
      color: theme.warning,
    },
    {
      icon: Clock,
      label: "Last Updated",
      value: formatDate(updatedAt),
      color: theme.primary,
    },
    {
      icon: status === "ACTIVE" ? CheckCircle : XCircle,
      label: "Status",
      value: status,
      color: status === "ACTIVE" ? theme.success : theme.error,
    },
  ];

  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: theme.text }}
      >
        Statistics & Metadata
      </h2>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: hexToRgba(theme.textSecondary, 0.05) }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: hexToRgba(stat.color, 0.1) }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="flex-1">
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                {stat.label}
              </div>
              {typeof stat.value === "number" ? (
                <div className="text-xl font-bold" style={{ color: theme.text }}>
                  {stat.value}
                </div>
              ) : (
                <div
                  className={`text-sm font-semibold ${stat.label === "Status" ? "mt-1" : ""}`}
                  style={{ color: stat.label === "Status" ? stat.color : theme.text }}
                >
                  {stat.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CategoryStatistics };