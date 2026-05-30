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
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourType, TourCategory } from "@/types/tour-types";
import { hexToRgba } from "@/utils/functions";

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
  const [showAllTourTypes, setShowAllTourTypes] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const truncatedDescription =
    description?.length > 400 && !isExpanded
      ? description.slice(0, 400) + "..."
      : description;

  const visibleTourTypes = showAllTourTypes
    ? tourTypeDtos
    : tourTypeDtos?.slice(0, 2);
  const visibleCategories = showAllCategories
    ? tourCategoryDto
    : tourCategoryDto?.slice(0, 2);

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
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Tour Overview
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <Clock
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Duration
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: theme.text }}
              >
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Season
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: theme.text }}
              >
                {seasonName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Start Location
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: theme.text }}
              >
                {startLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                End Location
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: theme.text }}
              >
                {endLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User
              className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Assigned To
              </p>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: theme.text }}
              >
                {assignToName}
              </p>
            </div>
          </div>
        </div>

        {/* Tour Types Section */}
        {tourTypeDtos && tourTypeDtos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: theme.primary }}
              />
              <p
                className="text-xs font-semibold"
                style={{ color: theme.primary }}
              >
                Tour Types ({tourTypeDtos.length})
              </p>
            </div>
            <div className="space-y-2">
              {visibleTourTypes?.map((tourType) => (
                <div
                  key={tourType.tourTypeId}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.04),
                    border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <h4
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {tourType.tourTypeName}
                    </h4>
                  </div>
                  {tourType.tourTypeDescription && (
                    <p
                      className="text-xs sm:text-sm pl-4"
                      style={{ color: theme.textSecondary }}
                    >
                      {tourType.tourTypeDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {tourTypeDtos.length > 2 && (
              <button
                onClick={() => setShowAllTourTypes(!showAllTourTypes)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: theme.primary }}
              >
                {showAllTourTypes
                  ? "Show Less"
                  : `Show All ${tourTypeDtos.length} Tour Types`}
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${showAllTourTypes ? "rotate-90" : ""}`}
                />
              </button>
            )}
          </div>
        )}

        {/* Tour Categories Section */}
        {tourCategoryDto && tourCategoryDto.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: theme.accent || theme.primary }}
              />
              <p
                className="text-xs font-semibold"
                style={{ color: theme.accent || theme.primary }}
              >
                Categories ({tourCategoryDto.length})
              </p>
            </div>
            <div className="space-y-2">
              {visibleCategories?.map((category) => (
                <div
                  key={category.tourCategoryId}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: hexToRgba(
                      theme.accent || theme.primary,
                      0.04,
                    ),
                    border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.accent || theme.primary }}
                    />
                    <h4
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {category.tourCategoryName}
                    </h4>
                  </div>
                  {category.tourCategoryDescription && (
                    <p
                      className="text-xs sm:text-sm pl-4"
                      style={{ color: theme.textSecondary }}
                    >
                      {category.tourCategoryDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {tourCategoryDto.length > 2 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: theme.accent || theme.primary }}
              >
                {showAllCategories
                  ? "Show Less"
                  : `Show All ${tourCategoryDto.length} Categories`}
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${showAllCategories ? "rotate-90" : ""}`}
                />
              </button>
            )}
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
              <Calendar
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                style={{ color: theme.success }}
              />
              <p
                className="text-xs font-semibold"
                style={{ color: theme.success }}
              >
                Best Time to Visit
              </p>
            </div>
            <p
              className="text-xs sm:text-sm"
              style={{ color: theme.textSecondary }}
            >
              {seasonDescription}
            </p>
          </div>
        )}

        {/* Tour Description */}
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
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.08)}`,
              }}
            >
              <p style={{ color: theme.textSecondary }}>
                {truncatedDescription}
              </p>
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
            <MessageCircle
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
              style={{ color: theme.warning }}
            />
            <p className="text-xs sm:text-sm" style={{ color: theme.warning }}>
              {assignMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
