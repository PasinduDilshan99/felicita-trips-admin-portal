// components/tours-components/tour-details-view-components/TourOverview.tsx
"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Tag,
  Calendar,
  User,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourType, TourCategory } from "@/types/tour-types";

interface TourOverviewProps {
  description: string;
  tourTypeDtos: TourType[];
  tourCategoryDto: TourCategory[];
  seasonName: string;
  seasonDescription: string;
  startLocation: string;
  endLocation: string;
  duration: number;
  assignToName: string;
  assignMessage: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourOverview: React.FC<TourOverviewProps> = ({
  description,
  tourTypeDtos,
  tourCategoryDto,
  seasonName,
  seasonDescription,
  startLocation,
  endLocation,
  duration,
  assignToName,
  assignMessage,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    description?.length > 400 && !isExpanded
      ? description.slice(0, 400) + "..."
      : description;

  const primaryTourType = tourTypeDtos?.[0];
  const primaryTourCategory = tourCategoryDto?.[0];

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
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
          Tour Overview
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Duration
              </p>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          {primaryTourType && (
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
              <div>
                <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                  Tour Type
                </p>
                <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                  {primaryTourType.tourTypeName}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Start Location
              </p>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                {startLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                End Location
              </p>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                {endLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Season
              </p>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                {seasonName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Assigned To
              </p>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: theme.text }}>
                {assignToName}
              </p>
            </div>
          </div>
        </div>

        {/* Tour Type Description */}
        {primaryTourType?.tourTypeDescription && (
          <div
            className="rounded-xl p-3 sm:p-4"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
              border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.primary }} />
              <p className="text-xs font-semibold" style={{ color: theme.primary }}>
                About {primaryTourType.tourTypeName}
              </p>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
              {primaryTourType.tourTypeDescription}
            </p>
          </div>
        )}

        {/* Tour Category Description */}
        {primaryTourCategory?.tourCategoryDescription && (
          <div
            className="rounded-xl p-3 sm:p-4"
            style={{
              backgroundColor: hexToRgba(theme.accent || theme.primary, 0.04),
              border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.accent || theme.primary }} />
              <p className="text-xs font-semibold" style={{ color: theme.accent || theme.primary }}>
                Category: {primaryTourCategory.tourCategoryName}
              </p>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
              {primaryTourCategory.tourCategoryDescription}
            </p>
          </div>
        )}

        {/* Season Description */}
        {seasonDescription && (
          <div
            className="rounded-xl p-3 sm:p-4"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.04),
              border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: theme.success }} />
              <p className="text-xs font-semibold" style={{ color: theme.success }}>
                Best Time to Visit
              </p>
            </div>
            <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
              {seasonDescription}
            </p>
          </div>
        )}

        {/* Tour Description */}
        {description && (
          <div>
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2" style={{ color: theme.textSecondary }}>
              Description
            </p>
            <div
              className="text-xs sm:text-sm leading-relaxed rounded-xl p-3 sm:p-4"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.08)}`,
              }}
            >
              <p style={{ color: theme.textSecondary }}>{truncatedDescription}</p>
              {description.length > 400 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
                  style={{ color: theme.primary }}
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
        )}

        {/* Assign Message */}
        {assignMessage && (
          <div
            className="rounded-xl p-3 sm:p-4 flex items-start gap-2"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.08),
              border: `1px solid ${hexToRgba(theme.warning, 0.15)}`,
            }}
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" style={{ color: theme.warning }} />
            <p className="text-xs sm:text-sm" style={{ color: theme.warning }}>
              {assignMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};