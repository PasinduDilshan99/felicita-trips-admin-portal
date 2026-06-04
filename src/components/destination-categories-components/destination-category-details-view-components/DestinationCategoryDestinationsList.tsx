"use client";

import React, { useState } from "react";
import {
  MapPin,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star as StarIcon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DestinationCategoryDestinationsListProps } from "@/types/destination-category-types";
import { hexToRgba } from "@/utils/functions";

export const DestinationCategoryDestinationsList: React.FC<
  DestinationCategoryDestinationsListProps
> = ({ destinations, categoryColor, onViewDestination }) => {
  const { theme } = useTheme();
  const [showAllPrimary, setShowAllPrimary] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);
  const [expandedDestination, setExpandedDestination] = useState<number | null>(
    null,
  );

  const primaryDestinations = destinations.filter((d) => d.primary);
  const otherDestinations = destinations.filter((d) => !d.primary);

  const visiblePrimary = showAllPrimary
    ? primaryDestinations
    : primaryDestinations.slice(0, 5);
  const visibleOther = showAllOther
    ? otherDestinations
    : otherDestinations.slice(0, 5);

  const hasMorePrimary = primaryDestinations.length > 5;
  const hasMoreOther = otherDestinations.length > 5;

  const toggleExpandDestination = (
    destinationId: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setExpandedDestination(
      expandedDestination === destinationId ? null : destinationId,
    );
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

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon
            key={`full-${i}`}
            className="w-3 h-3 fill-current"
            style={{ color: theme.warning }}
          />
        ))}
        {hasHalfStar && (
          <StarIcon
            className="w-3 h-3 fill-current opacity-50"
            style={{ color: theme.warning }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className="w-3 h-3"
            style={{ color: theme.border }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
          ({rating})
        </span>
      </div>
    );
  };

  if (!destinations.length) {
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
            <MapPin
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: categoryColor }}
            />
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Associated Destinations
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <MapPin
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No destinations associated with this category.
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
            <MapPin
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: categoryColor }}
            />
            <h2
              className="text-base sm:text-lg font-semibold"
              style={{ color: theme.text }}
            >
              Associated Destinations
            </h2>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: hexToRgba(categoryColor, 0.1),
                color: categoryColor,
              }}
            >
              {destinations.length}
            </span>
          </div>
        </div>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
          Destinations that belong to this category
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Primary Destinations Section */}
        {primaryDestinations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4" style={{ color: theme.warning }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Featured Destinations
              </h3>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.1),
                  color: theme.warning,
                }}
              >
                Primary
              </span>
            </div>
            <div className="space-y-2">
              {visiblePrimary.map((destination) => {
                const isExpanded =
                  expandedDestination === destination.destinationId;
                const statusColor = getStatusColor(
                  destination.destinationStatus,
                );

                return (
                  <div
                    key={destination.destinationId}
                    className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: hexToRgba(theme.warning, 0.03),
                      border: `1px solid ${hexToRgba(theme.warning, 0.15)}`,
                    }}
                    onClick={() => onViewDestination(destination.destinationId, destination.destinationName)}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: statusColor }}
                            >
                              {destination.destinationStatus}
                            </span>
                          </div>
                          <h3
                            className="font-semibold text-sm sm:text-base mt-1 hover:underline"
                            style={{ color: theme.text }}
                          >
                            {destination.destinationName}
                          </h3>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {destination.location}
                          </p>
                          {renderRatingStars(destination.ratings)}
                        </div>
                        <ChevronRight
                          className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: theme.warning }}
                        />
                      </div>

                      {/* Expand/Collapse Button for Description */}
                      {destination.destinationDescription && (
                        <button
                          onClick={(e) =>
                            toggleExpandDestination(
                              destination.destinationId,
                              e,
                            )
                          }
                          className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-80"
                          style={{ color: theme.warning }}
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
                      {isExpanded && destination.destinationDescription && (
                        <div
                          className="mt-2 p-2 rounded-lg text-xs sm:text-sm"
                          style={{
                            backgroundColor: hexToRgba(theme.warning, 0.05),
                            borderLeft: `2px solid ${theme.warning}`,
                          }}
                        >
                          <p style={{ color: theme.textSecondary }}>
                            {destination.destinationDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMorePrimary && (
              <button
                onClick={() => setShowAllPrimary(!showAllPrimary)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: theme.warning }}
              >
                {showAllPrimary ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show All {primaryDestinations.length} Featured Destinations
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Other Destinations Section */}
        {otherDestinations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: categoryColor }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Other Destinations
              </h3>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(categoryColor, 0.1),
                  color: categoryColor,
                }}
              >
                {otherDestinations.length}
              </span>
            </div>
            <div className="space-y-2">
              {visibleOther.map((destination) => {
                const isExpanded =
                  expandedDestination === destination.destinationId;
                const statusColor = getStatusColor(
                  destination.destinationStatus,
                );

                return (
                  <div
                    key={destination.destinationId}
                    className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: hexToRgba(categoryColor, 0.03),
                      border: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                    }}
                    onClick={() => onViewDestination(destination.destinationId, destination.destinationName)}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: statusColor }}
                            >
                              {destination.destinationStatus}
                            </span>
                          </div>
                          <h3
                            className="font-semibold text-sm sm:text-base mt-1 hover:underline"
                            style={{ color: theme.text }}
                          >
                            {destination.destinationName}
                          </h3>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {destination.location}
                          </p>
                          {renderRatingStars(destination.ratings)}
                        </div>
                        <ChevronRight
                          className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: categoryColor }}
                        />
                      </div>

                      {/* Expand/Collapse Button for Description */}
                      {destination.destinationDescription && (
                        <button
                          onClick={(e) =>
                            toggleExpandDestination(
                              destination.destinationId,
                              e,
                            )
                          }
                          className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-80"
                          style={{ color: categoryColor }}
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
                      {isExpanded && destination.destinationDescription && (
                        <div
                          className="mt-2 p-2 rounded-lg text-xs sm:text-sm"
                          style={{
                            backgroundColor: hexToRgba(categoryColor, 0.05),
                            borderLeft: `2px solid ${categoryColor}`,
                          }}
                        >
                          <p style={{ color: theme.textSecondary }}>
                            {destination.destinationDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMoreOther && (
              <button
                onClick={() => setShowAllOther(!showAllOther)}
                className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors hover:opacity-80"
                style={{ color: categoryColor }}
              >
                {showAllOther ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show All {otherDestinations.length} Other Destinations
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
