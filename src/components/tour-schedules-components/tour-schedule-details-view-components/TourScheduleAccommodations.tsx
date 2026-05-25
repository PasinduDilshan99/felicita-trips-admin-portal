// components/tour-schedules-components/tour-schedule-details-view-components/TourScheduleAccommodations.tsx
"use client";

import React, { useState } from "react";
import {
  Building,
  Hotel,
  Bus,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Apple,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourScheduleAccommodation } from "@/types/tour-schedule-types";

interface TourScheduleAccommodationsProps {
  accommodations: TourScheduleAccommodation[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourScheduleAccommodations: React.FC<
  TourScheduleAccommodationsProps
> = ({ accommodations }) => {
  const { theme } = useTheme();
  const [expandedAccommodation, setExpandedAccommodation] = useState<
    number | null
  >(null);

  const toggleAccommodation = (id: number) => {
    setExpandedAccommodation(expandedAccommodation === id ? null : id);
  };

  const getMealIcon = (type: string, isIncluded: boolean) => {
    if (!isIncluded) return null;
    switch (type) {
      case "breakfast":
        return <Sun className="w-3 h-3" style={{ color: theme.warning }} />;
      case "lunch":
        return (
          <Utensils className="w-3 h-3" style={{ color: theme.primary }} />
        );
      case "dinner":
        return <Moon className="w-3 h-3" style={{ color: theme.primary }} />;
      case "morningTea":
        return <Coffee className="w-3 h-3" style={{ color: theme.success }} />;
      case "eveningTea":
        return (
          <Coffee
            className="w-3 h-3"
            style={{ color: theme.accent || theme.primary }}
          />
        );
      case "snacks":
        return <Apple className="w-3 h-3" style={{ color: theme.warning }} />;
      default:
        return (
          <Utensils className="w-3 h-3" style={{ color: theme.primary }} />
        );
    }
  };

  if (!accommodations.length) {
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
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Accommodations & Meals
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Building
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No accommodation details available for this schedule.
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
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Accommodations & Meals
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Daily accommodation and meal details
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {accommodations.map((acc) => {
          const isExpanded = expandedAccommodation === acc.accommodationId;

          return (
            <div
              key={acc.accommodationId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
              }}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleAccommodation(acc.accommodationId)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(theme.primary, 0.05)
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {acc.day}
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm sm:text-base"
                      style={{ color: theme.text }}
                    >
                      Day {acc.day}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {acc.hotelName && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hexToRgba(theme.success, 0.1),
                            color: theme.success,
                          }}
                        >
                          <Hotel className="w-2.5 h-2.5" />
                          {acc.hotelName}
                        </span>
                      )}
                      {acc.transportName && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hexToRgba(theme.primary, 0.1),
                            color: theme.primary,
                          }}
                        >
                          <Bus className="w-2.5 h-2.5" />
                          {acc.transportName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.textSecondary }}
                  />
                ) : (
                  <ChevronDown
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: theme.textSecondary }}
                  />
                )}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-3 sm:p-4 pt-0 space-y-3">
                  {/* Meals Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {acc.breakfast && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.warning, 0.08),
                        }}
                      >
                        {getMealIcon("breakfast", true)}
                        <span className="text-xs">Breakfast</span>
                      </div>
                    )}
                    {acc.lunch && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.08),
                        }}
                      >
                        {getMealIcon("lunch", true)}
                        <span className="text-xs">Lunch</span>
                      </div>
                    )}
                    {acc.dinner && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.08),
                        }}
                      >
                        {getMealIcon("dinner", true)}
                        <span className="text-xs">Dinner</span>
                      </div>
                    )}
                    {acc.morningTea && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.success, 0.08),
                        }}
                      >
                        {getMealIcon("morningTea", true)}
                        <span className="text-xs">Morning Tea</span>
                      </div>
                    )}
                    {acc.eveningTea && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(
                            theme.accent || theme.primary,
                            0.08,
                          ),
                        }}
                      >
                        {getMealIcon("eveningTea", true)}
                        <span className="text-xs">Evening Tea</span>
                      </div>
                    )}
                    {acc.snacks && (
                      <div
                        className="flex items-center gap-1.5 p-1.5 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.warning, 0.08),
                        }}
                      >
                        {getMealIcon("snacks", true)}
                        <span className="text-xs">Snacks</span>
                      </div>
                    )}
                  </div>

                  {/* Meal Descriptions */}
                  <div className="space-y-2 text-xs">
                    {acc.breakfastDescription && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Sun
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.warning }}
                        />
                        <span>Breakfast: {acc.breakfastDescription}</span>
                      </p>
                    )}
                    {acc.lunchDescription && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Utensils
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.primary }}
                        />
                        <span>Lunch: {acc.lunchDescription}</span>
                      </p>
                    )}
                    {acc.dinnerDescription && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Moon
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.primary }}
                        />
                        <span>Dinner: {acc.dinnerDescription}</span>
                      </p>
                    )}
                    {acc.morningTeaDescription && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Coffee
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.success }}
                        />
                        <span>Morning Tea: {acc.morningTeaDescription}</span>
                      </p>
                    )}
                    {acc.eveningTeaDescription && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Coffee
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.accent || theme.primary }}
                        />
                        <span>Evening Tea: {acc.eveningTeaDescription}</span>
                      </p>
                    )}
                    {acc.snackNote && (
                      <p
                        className="flex items-start gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Apple
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: theme.warning }}
                        />
                        <span>Snacks: {acc.snackNote}</span>
                      </p>
                    )}
                  </div>

                  {/* Other Notes */}
                  {acc.otherNotes && (
                    <div
                      className="rounded-lg p-2 text-xs"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.08),
                        color: theme.textSecondary,
                      }}
                    >
                      📝 {acc.otherNotes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
