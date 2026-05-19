// components/packages-components/package-details-view-components/PackageOverview.tsx
"use client";

import React, { useState } from "react";
import {
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText,
  Palette,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PackageOverviewProps {
  name: string;
  description: string;
  color: string;
  hoverColor: string;
  startDate: string;
  endDate: string;
  packageTypeName: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const PackageOverview: React.FC<PackageOverviewProps> = ({
  name,
  description,
  color,
  hoverColor,
  startDate,
  endDate,
  packageTypeName,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayColor = color || theme.primary;
  const displayHoverColor = hoverColor || color || theme.primary;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

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
          Package Overview
        </h2>
        <div
          className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full"
          style={{
            backgroundColor: hexToRgba(displayColor, 0.1),
            border: `1px solid ${hexToRgba(displayColor, 0.2)}`,
          }}
        >
          <Palette
            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            style={{ color: displayColor }}
          />
          <span
            className="text-[10px] sm:text-xs font-medium"
            style={{ color: displayColor }}
          >
            {displayColor}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Package Name */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Package Name
          </p>
          <h3
            className="text-xl sm:text-2xl font-bold"
            style={{ color: theme.text }}
          >
            {name}
          </h3>
        </div>

        {/* Package Type */}
        <div className="flex items-start gap-2">
          <Tag
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: theme.primary }}
          />
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium"
              style={{ color: theme.textSecondary }}
            >
              Package Type
            </p>
            <p
              className="text-sm sm:text-base font-medium"
              style={{ color: theme.text }}
            >
              {packageTypeName}
            </p>
          </div>
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
                {formatDate(startDate)}
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
                {formatDate(endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Color Scheme Preview */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: theme.textSecondary }}
          >
            Color Scheme
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: displayColor }}
              />
              <div>
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  Primary
                </p>
                <p
                  className="text-[10px] sm:text-xs font-mono"
                  style={{ color: displayColor }}
                >
                  {displayColor}
                </p>
              </div>
            </div>
            {hoverColor && hoverColor !== color && (
              <>
                <div className="text-xl sm:text-2xl text-gray-400">→</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md transition-transform hover:scale-105"
                    style={{ backgroundColor: displayHoverColor }}
                  />
                  <div>
                    <p
                      className="text-[10px] sm:text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Hover
                    </p>
                    <p
                      className="text-[10px] sm:text-xs font-mono"
                      style={{ color: displayHoverColor }}
                    >
                      {displayHoverColor}
                    </p>
                  </div>
                </div>
              </>
            )}
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
      </div>
    </div>
  );
};
