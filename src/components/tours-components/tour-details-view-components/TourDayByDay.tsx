// components/tours-components/tour-details-view-components/TourDayByDay.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Activity,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { DayToDayResponse, DayToDayDestinationActivity } from "@/types/tour-types";

interface TourDayByDayProps {
  dayToDayResponses: DayToDayResponse[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourDayByDay: React.FC<TourDayByDayProps> = ({
  dayToDayResponses,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [expandedDestinations, setExpandedDestinations] = useState<Set<number>>(new Set());

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const toggleDestination = (destinationId: number) => {
    setExpandedDestinations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const handleDestinationClick = (destinationId: number) => {
    router.push(`/web-management/destinations/view/${destinationId}`);
  };

  const handleActivityClick = (activityId: number) => {
    router.push(`/web-management/activities/view/${activityId}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Year round";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!dayToDayResponses || dayToDayResponses.length === 0) {
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
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            Day by Day Itinerary
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No itinerary details available for this tour.
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
        <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
          Day by Day Itinerary
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Detailed tour breakdown by day
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {dayToDayResponses.map((day, idx) => {
          const isDayExpanded = expandedDays.has(day.dayNumber);
          const dayColor = theme.primary;
          const destinations = day.destinations || [];

          return (
            <div
              key={day.dayNumber || idx}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: `1px solid ${hexToRgba(dayColor, 0.2)}`,
              }}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: hexToRgba(dayColor, 0.05),
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: dayColor }}
                  >
                    {day.dayNumber}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: theme.text }}>
                      Day {day.dayNumber}
                    </h3>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      {destinations.length} {destinations.length === 1 ? "destination" : "destinations"}
                    </p>
                  </div>
                </div>
                {isDayExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.textSecondary }} />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.textSecondary }} />
                )}
              </button>

              {/* Day Content */}
              {isDayExpanded && (
                <div className="p-3 sm:p-4 space-y-4">
                  {destinations.map((dest, destIdx) => {
                    const destination = dest.destination;
                    const activities = dest.activities || [];
                    const isDestinationExpanded = expandedDestinations.has(destination.destinationId);
                    const isLast = destIdx === destinations.length - 1;

                    return (
                      <div key={destination.destinationId}>
                        {/* Destination Card */}
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{
                            backgroundColor: hexToRgba(theme.accent || theme.primary, 0.03),
                            border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
                          }}
                        >
                          {/* Destination Header */}
                          <button
                            onClick={() => toggleDestination(destination.destinationId)}
                            className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" style={{ color: theme.accent || theme.primary }} />
                              <div>
                                <h4
                                  className="font-semibold text-sm cursor-pointer hover:underline"
                                  style={{ color: theme.accent || theme.primary }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDestinationClick(destination.destinationId);
                                  }}
                                >
                                  {destination.destinationName}
                                </h4>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>
                                  {destination.location}
                                </p>
                              </div>
                            </div>
                            {isDestinationExpanded ? (
                              <ChevronUp className="w-4 h-4" style={{ color: theme.textSecondary }} />
                            ) : (
                              <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
                            )}
                          </button>

                          {/* Destination Details */}
                          {isDestinationExpanded && (
                            <div className="px-3 pb-3 space-y-3">
                              {/* Destination Description */}
                              {destination.destinationDescription && (
                                <p className="text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                                  {destination.destinationDescription}
                                </p>
                              )}

                              {/* Destination Categories */}
                              {destination.category && destination.category.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {destination.category.map((cat) => (
                                    <span
                                      key={cat.id}
                                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: hexToRgba(theme.primary, 0.1),
                                        color: theme.primary,
                                      }}
                                    >
                                      {cat.name}
                                      {cat.isPrimary && " ★"}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Destination Images Preview */}
                              {destination.images && destination.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {destination.images.slice(0, 3).map((img) => (
                                    <img
                                      key={img.imageId}
                                      src={img.imageUrl}
                                      alt={img.imageName}
                                      className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => handleDestinationClick(destination.destinationId)}
                                    />
                                  ))}
                                  {destination.images.length > 3 && (
                                    <div
                                      className="w-16 h-16 rounded-lg flex items-center justify-center text-xs"
                                      style={{ backgroundColor: hexToRgba(theme.primary, 0.1), color: theme.primary }}
                                    >
                                      +{destination.images.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Activities */}
                              {activities.length > 0 && (
                                <div className="space-y-2 mt-3">
                                  <p className="text-xs font-semibold flex items-center gap-1" style={{ color: theme.text }}>
                                    <Activity className="w-3 h-3" />
                                    Activities ({activities.length})
                                  </p>
                                  <div className="space-y-2">
                                    {activities.map((activity: DayToDayDestinationActivity) => (
                                      <div
                                        key={activity.activityId}
                                        className="rounded-lg p-2 cursor-pointer transition-all duration-200 hover:translate-x-1"
                                        style={{
                                          backgroundColor: hexToRgba(theme.primary, 0.05),
                                          border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                                        }}
                                        onClick={() => handleActivityClick(activity.activityId)}
                                      >
                                        <div className="flex items-start justify-between flex-wrap gap-2">
                                          <div className="flex-1">
                                            <h5 className="text-sm font-medium hover:underline" style={{ color: theme.primary }}>
                                              {activity.activityName}
                                            </h5>
                                            {activity.activityDescription && (
                                              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                                                {activity.activityDescription.length > 100
                                                  ? activity.activityDescription.slice(0, 100) + "..."
                                                  : activity.activityDescription}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex flex-col items-end gap-1">
                                            {activity.durationHours > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" style={{ color: theme.textSecondary }} />
                                                <span className="text-xs" style={{ color: theme.textSecondary }}>
                                                  {activity.durationHours}h
                                                </span>
                                              </div>
                                            )}
                                            {activity.minParticipate > 0 && activity.maxParticipate > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" style={{ color: theme.textSecondary }} />
                                                <span className="text-xs" style={{ color: theme.textSecondary }}>
                                                  {activity.minParticipate}-{activity.maxParticipate}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {activity.season && (
                                            <span
                                              className="text-[10px] px-1.5 py-0.5 rounded-full"
                                              style={{
                                                backgroundColor: hexToRgba(theme.warning, 0.1),
                                                color: theme.warning,
                                              }}
                                            >
                                              {activity.season}
                                            </span>
                                          )}
                                          {activity.activitiesCategory && activity.activitiesCategory.length > 0 && (
                                            <>
                                              {activity.activitiesCategory.map((cat) => (
                                                <span
                                                  key={cat.id}
                                                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                                                  style={{
                                                    backgroundColor: hexToRgba(theme.primary, 0.1),
                                                    color: theme.primary,
                                                  }}
                                                >
                                                  {cat.name}
                                                  {cat.is_primary && " ★"}
                                                </span>
                                              ))}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Connector line between destinations */}
                        {!isLast && (
                          <div className="flex justify-center py-1">
                            <div
                              className="w-px h-4"
                              style={{ backgroundColor: hexToRgba(theme.border, 0.5) }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};