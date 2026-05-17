// components/activity-categories-components/view-category-details-components/CategoryMetadata.tsx
"use client";

import React from "react";
import { User, Calendar, Clock, UserX } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryMetadataProps {
  createdAt: string;
  createdBy: number;
  createdByName: string;
  updatedAt: string;
  updatedBy: number | null;
  updatedByName: string | null;
  terminatedAt: string | null;
  terminatedBy: number | null;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CategoryMetadata: React.FC<CategoryMetadataProps> = ({
  createdAt,
  createdBy,
  createdByName,
  updatedAt,
  updatedBy,
  updatedByName,
  terminatedAt,
  terminatedBy,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not available";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const metadataItems = [
    {
      label: "Created By",
      value: createdByName || `User #${createdBy}`,
      icon: User,
      date: createdAt,
      color: theme.success,
    },
    {
      label: "Last Updated",
      value: updatedByName
        ? updatedByName
        : updatedBy
          ? `User #${updatedBy}`
          : "Never",
      icon: Clock,
      date: updatedAt,
      color: theme.primary,
    },
  ];

  if (terminatedAt) {
    metadataItems.push({
      label: "Terminated By",
      value: `User #${terminatedBy}`,
      icon: UserX,
      date: terminatedAt,
      color: theme.error,
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
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Metadata
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Creation and modification information
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        {metadataItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(item.color, 0.04),
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: hexToRgba(item.color, 0.1) }}
            >
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: theme.textSecondary }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  {formatDate(item.date)}
                </span>
              </div>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: theme.text }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}

        {/* Created At */}
        <div
          className="flex items-start gap-3 p-2 rounded-lg"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.04),
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
          >
            <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Created At
              </span>
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(createdAt)}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              Initial creation timestamp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
