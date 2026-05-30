"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  X,
  AlertCircle,
  ChevronDown,
  Calendar,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DestinationSelector } from "@/components/common-components/DestinationSelector";
import { TourDestinationsFormProps } from "@/types/tour-types";
import { ActivityMultiSelector } from "./ActivityMultiSelector";

export const TourDestinationsForm: React.FC<TourDestinationsFormProps> = ({
  days,
  onDaysChange,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    new Set(days.map((d) => d.dayNumber)),
  );

  const toggleDay = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };

  const addDay = () => {
    const newDayNumber = days.length + 1;
    onDaysChange([
      ...days,
      {
        dayNumber: newDayNumber,
        destinations: [],
      },
    ]);
    setExpandedDays(new Set([...expandedDays, newDayNumber]));
  };

  const removeDay = (dayIndex: number) => {
    const newDays = days.filter((_, i) => i !== dayIndex);
    const reorderedDays = newDays.map((day, idx) => ({
      ...day,
      dayNumber: idx + 1,
    }));
    onDaysChange(reorderedDays);

    const newExpanded = new Set(reorderedDays.map((d) => d.dayNumber));
    setExpandedDays(newExpanded);
  };

  const addDestinationToDay = (dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].destinations.push({
      destinationId: 0,
      activities: [],
    });
    onDaysChange(updatedDays);
  };

  const removeDestinationFromDay = (dayIndex: number, destIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].destinations.splice(destIndex, 1);
    onDaysChange(updatedDays);
  };

  const updateDestinationInDay = (
    dayIndex: number,
    destIndex: number,
    destinationId: number,
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].destinations[destIndex].destinationId = destinationId;
    updatedDays[dayIndex].destinations[destIndex].activities = [];
    onDaysChange(updatedDays);
  };

  const updateActivitiesInDestination = (
    dayIndex: number,
    destIndex: number,
    activities: number[],
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].destinations[destIndex].activities = activities;
    onDaysChange(updatedDays);
  };

  const totalDestinations = days.reduce(
    (sum, day) => sum + day.destinations.length,
    0,
  );
  const totalActivities = days.reduce(
    (sum, day) =>
      sum + day.destinations.reduce((s, d) => s + d.activities.length, 0),
    0,
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.accent}18`,
              color: theme.accent,
            }}
          >
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Tour Itinerary
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {days.length} day(s), {totalDestinations} destination(s),{" "}
              {totalActivities} activity(ies)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {days.length > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${theme.accent}15`,
                color: theme.accent,
              }}
            >
              {days.length}
            </span>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-300"
            style={{
              color: theme.textSecondary,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {/* Days List */}
          {days.length > 0 ? (
            <div className="space-y-4">
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${theme.border}`,
                    backgroundColor: `${theme.primary}02`,
                  }}
                >
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    style={{
                      backgroundColor: `${theme.primary}08`,
                      borderBottom: expandedDays.has(day.dayNumber)
                        ? `1px solid ${theme.border}`
                        : "none",
                    }}
                    onClick={() => toggleDay(day.dayNumber)}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: theme.primary,
                          color: "white",
                        }}
                      >
                        {day.dayNumber}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        Day {day.dayNumber}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {day.destinations.length} destination(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDay(dayIndex);
                        }}
                        className="p-1.5 rounded-lg hover:bg-opacity-20 transition-colors"
                        style={{ color: theme.error }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-200"
                        style={{
                          color: theme.textSecondary,
                          transform: expandedDays.has(day.dayNumber)
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Day Content */}
                  {expandedDays.has(day.dayNumber) && (
                    <div className="p-4 space-y-4">
                      {/* Destinations for this day */}
                      {day.destinations.map((destination, destIndex) => (
                        <div
                          key={destIndex}
                          className="rounded-lg p-4"
                          style={{
                            backgroundColor: theme.surface,
                            border: `1px solid ${theme.border}`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin
                                className="w-4 h-4"
                                style={{ color: theme.accent }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: theme.text }}
                              >
                                Destination {destIndex + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeDestinationFromDay(dayIndex, destIndex)
                              }
                              className="p-1 rounded-lg hover:bg-opacity-20 transition-colors"
                              style={{ color: theme.error }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <DestinationSelector
                              value={destination.destinationId}
                              onChange={(id) =>
                                updateDestinationInDay(dayIndex, destIndex, id)
                              }
                              placeholder="Select destination"
                              required
                            />

                            {/* Multi-select Activities */}
                            <ActivityMultiSelector
                              destinationId={destination.destinationId}
                              selectedActivities={destination.activities}
                              onActivitiesChange={(activities) =>
                                updateActivitiesInDestination(
                                  dayIndex,
                                  destIndex,
                                  activities,
                                )
                              }
                              disabled={!destination.destinationId}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Add Destination Button */}
                      <button
                        type="button"
                        onClick={() => addDestinationToDay(dayIndex)}
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          border: `1px dashed ${theme.primary}30`,
                          color: theme.primary,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Destination to Day {day.dayNumber}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 rounded-xl"
              style={{
                backgroundColor: `${theme.primary}04`,
                border: `1px dashed ${theme.border}`,
              }}
            >
              <Calendar
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                style={{ color: theme.textSecondary }}
              />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                No days added yet. Click below to create your tour itinerary.
              </p>
            </div>
          )}

          {/* Add Day Button */}
          <button
            type="button"
            onClick={addDay}
            className="cursor-pointer w-full px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0"
            style={{
              backgroundColor: `${theme.success}10`,
              border: `2px dashed ${theme.success}30`,
              color: theme.success,
            }}
          >
            <Plus className="w-4 h-4" />
            Add New Day
          </button>

          {error && (
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: theme.error }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
