// components/tour-categories-components/tour-category-details-view-components/TourCategoryToursList.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourCategoryTourReference } from "@/types/tour-category-types";
import { TOURS_VIEW_PAGE_URL } from "@/utils/urls";

interface TourCategoryToursListProps {
  tours: TourCategoryTourReference[];
  tourCategoryColor: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourCategoryToursList: React.FC<TourCategoryToursListProps> = ({
  tours,
  tourCategoryColor,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [showAllTours, setShowAllTours] = useState(false);
  const [expandedTourId, setExpandedTourId] = useState<number | null>(null);

  const visibleTours = showAllTours ? tours : tours.slice(0, 5);
  const hasMoreTours = tours.length > 5;

  const handleTourClick = (tourId: number) => {
    router.push(`${TOURS_VIEW_PAGE_URL}/${tourId}`);
  };

  const toggleExpandTour = (tourId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTourId(expandedTourId === tourId ? null : tourId);
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
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: tourCategoryColor }} />
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
              Associated Tours
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No tours associated with this category.
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
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: tourCategoryColor }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            Associated Tours
          </h2>
          <span
            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(tourCategoryColor, 0.1),
              color: tourCategoryColor,
            }}
          >
            {tours.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {visibleTours.map((tour) => {
          const isExpanded = expandedTourId === tour.tourId;
          const statusColor = getStatusColor(tour.status);

          return (
            <div
              key={tour.tourId}
              className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: hexToRgba(tourCategoryColor, 0.03),
                border: `1px solid ${hexToRgba(tourCategoryColor, 0.15)}`,
              }}
              onClick={() => handleTourClick(tour.tourId)}
            >
              {/* Tour Header */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {tour.primaryCategory && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hexToRgba(tourCategoryColor, 0.15),
                            color: tourCategoryColor,
                          }}
                        >
                          <Star className="w-2.5 h-2.5" />
                          Primary Category
                        </span>
                      )}
                      <span
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusColor }}
                      >
                        {tour.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mt-1 hover:underline" style={{ color: theme.text }}>
                      {tour.tourName}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tourCategoryColor }} />
                </div>

                {/* Basic Info */}
                <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: theme.textSecondary }}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{tour.duration} {tour.duration === 1 ? "day" : "days"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{tour.startLocation} → {tour.endLocation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{tour.season}</span>
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                {tour.description && (
                  <button
                    onClick={(e) => toggleExpandTour(tour.tourId, e)}
                    className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-80"
                    style={{ color: tourCategoryColor }}
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
                {isExpanded && tour.description && (
                  <div
                    className="mt-3 p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: hexToRgba(tourCategoryColor, 0.05),
                      borderLeft: `2px solid ${tourCategoryColor}`,
                    }}
                  >
                    <p style={{ color: theme.textSecondary }}>{tour.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Show More / Show Less Button */}
        {hasMoreTours && (
          <button
            onClick={() => setShowAllTours(!showAllTours)}
            className="w-full flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: hexToRgba(tourCategoryColor, 0.08),
              color: tourCategoryColor,
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