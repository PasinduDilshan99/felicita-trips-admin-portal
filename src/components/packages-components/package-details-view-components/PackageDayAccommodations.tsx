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
  MapPin,
  Globe,
  Star,
  Wind,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageDayAccommodationsProps } from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";

export const PackageDayAccommodations: React.FC<
  PackageDayAccommodationsProps
> = ({ accommodations, packageColor }) => {
  const { theme } = useTheme();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (dayNumber: number) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
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
        return <Coffee className="w-3 h-3" style={{ color: packageColor }} />;
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
            Daily Accommodations
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Building
            className="w-12 h-12 mx-auto mb-3 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No accommodation details available for this package.
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
          Daily Accommodations
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Hotel, transport, and meal details by day
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {accommodations.map((acc) => {
          const isExpanded = expandedDay === acc.dayNumber;

          return (
            <div
              key={acc.packageDayAccommodationId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(packageColor, 0.03),
                border: `1px solid ${hexToRgba(packageColor, 0.15)}`,
              }}
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(acc.dayNumber)}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isExpanded
                    ? hexToRgba(packageColor, 0.08)
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: packageColor }}
                  >
                    {acc.dayNumber}
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm sm:text-base"
                      style={{ color: theme.text }}
                    >
                      Day {acc.dayNumber}
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
                      {acc.vehicleTypeName && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hexToRgba(theme.primary, 0.1),
                            color: theme.primary,
                          }}
                        >
                          <Bus className="w-2.5 h-2.5" />
                          {acc.vehicleTypeName}
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
                <div className="p-3 sm:p-4 pt-0 space-y-4">
                  {/* Hotel Details */}
                  {acc.hotelName && (
                    <div
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: hexToRgba(theme.success, 0.05),
                        border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Hotel
                          className="w-4 h-4"
                          style={{ color: theme.success }}
                        />
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: theme.success }}
                        >
                          Accommodation
                        </h4>
                      </div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: theme.text }}
                      >
                        {acc.hotelName}
                      </p>
                      {acc.hotelDescription && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          {acc.hotelDescription}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs">
                        {acc.hotelLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin
                              className="w-3 h-3"
                              style={{ color: theme.textSecondary }}
                            />
                            <span style={{ color: theme.textSecondary }}>
                              {acc.hotelLocation}
                            </span>
                          </div>
                        )}
                        {acc.hotelCategory > 0 && (
                          <div className="flex items-center gap-1">
                            <Star
                              className="w-3 h-3"
                              style={{ color: theme.warning }}
                            />
                            <span style={{ color: theme.textSecondary }}>
                              {acc.hotelCategory} Star
                            </span>
                          </div>
                        )}
                        {acc.hotelType && (
                          <span style={{ color: theme.textSecondary }}>
                            {acc.hotelType}
                          </span>
                        )}
                      </div>
                      {acc.hotelWebsite && (
                        <a
                          href={acc.hotelWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs mt-2 hover:underline"
                          style={{ color: theme.primary }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Globe className="w-3 h-3" />
                          Visit Hotel Website
                        </a>
                      )}
                    </div>
                  )}

                  {/* Transport Details */}
                  {acc.vehicleTypeName && (
                    <div
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.05),
                        border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Bus
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: theme.primary }}
                        >
                          Transport
                        </h4>
                      </div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: theme.text }}
                      >
                        {acc.vehicleTypeName} - {acc.vehicleModel}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs">
                        <span style={{ color: theme.textSecondary }}>
                          Registration: {acc.vehicleRegistrationNumber}
                        </span>
                        <span style={{ color: theme.textSecondary }}>
                          Capacity: {acc.seatCapacity} seats
                        </span>
                        {acc.airCondition && (
                          <span className="flex items-center gap-1">
                            <Wind
                              className="w-3 h-3"
                              style={{ color: theme.success }}
                            />
                            <span style={{ color: theme.success }}>AC</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meals Grid */}
                  <div>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: theme.text }}
                    >
                      Meal Plan
                    </p>
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
                            backgroundColor: hexToRgba(packageColor, 0.08),
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
                          style={{ color: packageColor }}
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
