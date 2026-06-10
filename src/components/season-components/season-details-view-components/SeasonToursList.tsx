// components/seasons-components/season-details-view-components/SeasonToursList.tsx
"use client";

import React, { useState } from "react";
import { MapPin, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SeasonTour } from "@/types/season-types";

interface SeasonToursListProps {
  tours: SeasonTour[];
  onViewTour: (tourId: number) => void;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const SeasonToursList: React.FC<SeasonToursListProps> = ({
  tours,
  onViewTour,
}) => {
  const { theme } = useTheme();
  const [showAllTours, setShowAllTours] = useState(false);
  const [expandedTour, setExpandedTour] = useState<number | null>(null);

  const visibleTours = showAllTours ? tours : tours.slice(0, 5);
  const hasMoreTours = tours.length > 5;

  const toggleExpandTour = (tourId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#10b981";
      case "INACTIVE":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  if (!tours.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.primary }} />
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
              Seasonal Tours
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No tours available during this season.
          </p>
        </div>
      </div>
    );
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
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.primary }} />
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
              Seasonal Tours
            </h2>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              {tours.length}
            </span>
          </div>
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          Tours available during this season
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-2">
        {visibleTours.map((tour) => {
          const isExpanded = expandedTour === tour.tourId;
          const statusColor = getStatusColor(tour.tourStatus);

          return (
            <div
              key={tour.tourId}
              className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: hexToRgba(theme.success, 0.03),
                border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
              }}
              onClick={() => onViewTour(tour.tourId)}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusColor }}
                      >
                        {tour.tourStatus}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mt-1 hover:underline" style={{ color: theme.text }}>
                      {tour.tourName}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: theme.success }} />
                </div>

                {/* Expand/Collapse Button for Description */}
                {tour.tourDescription && (
                  <button
                    onClick={(e) => toggleExpandTour(tour.tourId, e)}
                    className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-80"
                    style={{ color: theme.success }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show Description
                      </>
                    )}
                  </button>
                )}

                {/* Expanded Description */}
                {isExpanded && tour.tourDescription && (
                  <div
                    className="mt-2 p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: hexToRgba(theme.success, 0.05),
                      borderLeft: `2px solid ${theme.success}`,
                    }}
                  >
                    <p style={{ color: theme.textSecondary }}>{tour.tourDescription}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {hasMoreTours && (
          <button
            onClick={() => setShowAllTours(!showAllTours)}
            className="w-full flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.08),
              color: theme.success,
            }}
          >
            {showAllTours ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {tours.length} Tours
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};