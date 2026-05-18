// components/common-components/CommonMetadata.tsx
"use client";

import React from "react";
import { User, Calendar, Clock, UserX, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface MetadataItem {
  label: string;
  value: string;
  icon: React.ElementType;
  date?: string;
  color?: string;
}

export interface CommonMetadataProps {
  items: MetadataItem[];
  title?: string;
  description?: string;
  createdAt?: {
    date: string;
    label?: string;
  };
  className?: string;
  showCreatedAt?: boolean;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CommonMetadata: React.FC<CommonMetadataProps> = ({
  items,
  title = "Metadata",
  description = "Creation and modification information",
  createdAt,
  className = "",
  showCreatedAt = true,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not available";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
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
        <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
          {title}
        </h2>
        {description && (
          <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            {description}
          </p>
        )}
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {items.map((item, idx) => {
          const itemColor = item.color || theme.primary;

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-2 rounded-lg transition-all duration-200 hover:scale-[1.01]"
              style={{
                backgroundColor: hexToRgba(itemColor, 0.04),
              }}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: hexToRgba(itemColor, 0.1) }}
              >
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: itemColor }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                    {item.label}
                  </span>
                  {item.date && (
                    <span className="text-[10px] sm:text-xs" style={{ color: theme.textSecondary }}>
                      {formatDate(item.date)}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium mt-1 break-words" style={{ color: theme.text }}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}

        {showCreatedAt && createdAt && (
          <div
            className="flex items-start gap-3 p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
            }}
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                  {createdAt.label || "Created At"}
                </span>
                <span className="text-[10px] sm:text-xs" style={{ color: theme.textSecondary }}>
                  {formatDate(createdAt.date)}
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textSecondary }}>
                Initial creation timestamp
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};