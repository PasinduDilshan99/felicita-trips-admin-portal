"use client";

import React, { useState } from "react";
import {
  Hotel,
  Utensils,
  Coffee,
  Moon,
  Apple,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DayAccommodation,
  DayAccommodationsFormProps,
} from "@/types/package-types";
import { HotelSelector } from "./HotelSelector";
import { VehicleSelector } from "./VehicleSelector";

export const DayAccommodationsForm: React.FC<DayAccommodationsFormProps> = ({
  accommodations,
  onAccommodationsChange,
  hotels,
  vehicles,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    new Set(accommodations.map((a) => a.dayNumber)),
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

  const updateAccommodation = <K extends keyof DayAccommodation>(
    index: number,
    field: K,
    value: DayAccommodation[K],
  ) => {
    const updated = [...accommodations];
    updated[index] = { ...updated[index], [field]: value };
    onAccommodationsChange(updated);
  };

  const toggleMeal = (
    index: number,
    meal: keyof DayAccommodation,
    descriptionKey: keyof DayAccommodation,
  ) => {
    const updated = [...accommodations];
    const currentValue = updated[index][meal];
    const newValue = !currentValue;
    updated[index] = { ...updated[index], [meal]: newValue };

    if (!newValue) {
      updated[index] = { ...updated[index], [descriptionKey]: null };
    }
    onAccommodationsChange(updated);
  };

  const getMealValue = (
    acc: DayAccommodation,
    key: keyof DayAccommodation,
  ): boolean => {
    return Boolean(acc[key]);
  };

  const getDescriptionValue = (
    acc: DayAccommodation,
    key: keyof DayAccommodation,
  ): string => {
    const value = acc[key];
    return value ? String(value) : "";
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
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
            <Hotel className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: theme.text }}
            >
              Day Accommodations
            </h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Set meals, hotels, and transport for each day
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300"
          style={{
            color: theme.textSecondary,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-4">
          {accommodations.map((acc, index) => (
            <div
              key={acc.dayNumber}
              className="rounded-xl overflow-hidden"
              style={{
                border: `1px solid ${theme.border}`,
                backgroundColor: `${theme.primary}02`,
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                style={{ backgroundColor: `${theme.primary}08` }}
                onClick={() => toggleDay(acc.dayNumber)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: theme.primary, color: "white" }}
                  >
                    {acc.dayNumber}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    Day {acc.dayNumber}
                  </span>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedDays.has(acc.dayNumber)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {expandedDays.has(acc.dayNumber) && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <HotelSelector
                      value={acc.hotelId}
                      onChange={(hotelId) =>
                        updateAccommodation(index, "hotelId", hotelId)
                      }
                      hotels={hotels}
                      placeholder="Select a hotel"
                    />
                    <VehicleSelector
                      value={acc.transportId}
                      onChange={(vehicleId) =>
                        updateAccommodation(index, "transportId", vehicleId)
                      }
                      vehicles={vehicles}
                      placeholder="Select a vehicle"
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: theme.textSecondary }}
                    >
                      Other Notes
                    </label>
                    <textarea
                      value={acc.otherNotes || ""}
                      onChange={(e) =>
                        updateAccommodation(index, "otherNotes", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: theme.background,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      placeholder="Any additional notes for this day..."
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        key: "breakfast",
                        descKey: "breakfastDescription",
                        icon: Coffee,
                        label: "Breakfast",
                      },
                      {
                        key: "morningTea",
                        descKey: "morningTeaDescription",
                        icon: Coffee,
                        label: "Morning Tea",
                      },
                      {
                        key: "lunch",
                        descKey: "lunchDescription",
                        icon: Utensils,
                        label: "Lunch",
                      },
                      {
                        key: "eveningTea",
                        descKey: "eveningTeaDescription",
                        icon: Coffee,
                        label: "Evening Tea",
                      },
                      {
                        key: "dinner",
                        descKey: "dinnerDescription",
                        icon: Moon,
                        label: "Dinner",
                      },
                      {
                        key: "snacks",
                        descKey: "snackNote",
                        icon: Apple,
                        label: "Snacks",
                      },
                    ].map((meal) => (
                      <div
                        key={meal.key}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${theme.background}` }}
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getMealValue(
                              acc,
                              meal.key as keyof DayAccommodation,
                            )}
                            onChange={() =>
                              toggleMeal(
                                index,
                                meal.key as keyof DayAccommodation,
                                meal.descKey as keyof DayAccommodation,
                              )
                            }
                            className="rounded"
                          />
                          <meal.icon
                            className="w-3.5 h-3.5"
                            style={{ color: theme.primary }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: theme.text }}
                          >
                            {meal.label}
                          </span>
                        </label>
                        {getMealValue(
                          acc,
                          meal.key as keyof DayAccommodation,
                        ) && (
                          <input
                            type="text"
                            value={getDescriptionValue(
                              acc,
                              meal.descKey as keyof DayAccommodation,
                            )}
                            onChange={(e) =>
                              updateAccommodation(
                                index,
                                meal.descKey as keyof DayAccommodation,
                                e.target.value || null,
                              )
                            }
                            placeholder={`${meal.label} description`}
                            className="w-full mt-1 px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: theme.background,
                              border: `1px solid ${theme.border}`,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
