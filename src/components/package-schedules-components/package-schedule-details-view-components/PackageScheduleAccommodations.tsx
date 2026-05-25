// components/package-schedules-components/package-schedule-details-view-components/PackageScheduleAccommodations.tsx
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
  DollarSign,
  Percent,
  Receipt,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageScheduleAccommodation } from "@/types/package-schedule-types";

interface PackageScheduleAccommodationsProps {
  accommodations: PackageScheduleAccommodation[];
  packageColor: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const PackageScheduleAccommodations: React.FC<
  PackageScheduleAccommodationsProps
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

  const formatPrice = (price: number) => {
    if (!price) return "N/A";
    return `$${price.toLocaleString()}`;
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
          Daily Accommodations
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          Hotel, transport, meals, and cost details by day
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {accommodations.map((acc) => {
          const isExpanded = expandedDay === acc.dayNumber;
          const totalDayCost =
            (acc.price || 0) +
            (acc.transportCost || 0) +
            (acc.extraCharge || 0);

          return (
            <div
              key={acc.accommodationId}
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
                <div className="text-right">
                  <p
                    className="text-xs font-medium"
                    style={{ color: theme.success }}
                  >
                    {formatPrice(acc.price)}
                  </p>
                  {isExpanded ? (
                    <ChevronUp
                      className="w-4 h-4 sm:w-5 sm:h-5 mt-1"
                      style={{ color: theme.textSecondary }}
                    />
                  ) : (
                    <ChevronDown
                      className="w-4 h-4 sm:w-5 sm:h-5 mt-1"
                      style={{ color: theme.textSecondary }}
                    />
                  )}
                </div>
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
                    </div>
                  )}

                  {/* Transport Details */}
                  {acc.transportName && (
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
                        {acc.transportName}
                      </p>
                      {acc.transportCost > 0 && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Transport Cost: {formatPrice(acc.transportCost)}
                        </p>
                      )}
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

                  {/* Cost Breakdown */}
                  {(acc.localPrice > 0 ||
                    acc.price > 0 ||
                    acc.discount > 0 ||
                    acc.serviceCharge > 0 ||
                    acc.tax > 0 ||
                    acc.extraCharge > 0) && (
                    <div
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.04),
                        border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign
                          className="w-4 h-4"
                          style={{ color: theme.primary }}
                        />
                        <h4
                          className="font-semibold text-sm"
                          style={{ color: theme.primary }}
                        >
                          Cost Breakdown
                        </h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        {acc.localPrice > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Local Price:
                            </span>
                            <span style={{ color: theme.text }}>
                              {formatPrice(acc.localPrice)}
                            </span>
                          </div>
                        )}
                        {acc.price > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Base Price:
                            </span>
                            <span style={{ color: theme.text }}>
                              {formatPrice(acc.price)}
                            </span>
                          </div>
                        )}
                        {acc.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                              <Percent
                                className="w-3 h-3"
                                style={{ color: theme.success }}
                              />
                              <span style={{ color: theme.textSecondary }}>
                                Discount:
                              </span>
                            </span>
                            <span style={{ color: theme.success }}>
                              {acc.discount}%
                            </span>
                          </div>
                        )}
                        {acc.serviceCharge > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Service Charge:
                            </span>
                            <span style={{ color: theme.text }}>
                              {formatPrice(acc.serviceCharge)}
                            </span>
                          </div>
                        )}
                        {acc.tax > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Tax:
                            </span>
                            <span style={{ color: theme.text }}>
                              {formatPrice(acc.tax)}
                            </span>
                          </div>
                        )}
                        {acc.extraCharge > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Extra Charge:
                            </span>
                            <span style={{ color: theme.warning }}>
                              {formatPrice(acc.extraCharge)}
                            </span>
                          </div>
                        )}
                        {acc.transportCost > 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.textSecondary }}>
                              Transport Cost:
                            </span>
                            <span style={{ color: theme.text }}>
                              {formatPrice(acc.transportCost)}
                            </span>
                          </div>
                        )}
                        <div
                          className="flex justify-between pt-1 mt-1 border-t"
                          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: theme.text }}
                          >
                            Total Day Cost:
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: theme.success }}
                          >
                            {formatPrice(totalDayCost)}
                          </span>
                        </div>
                      </div>
                      {acc.extraChargeNote && (
                        <p
                          className="text-xs mt-2 flex items-start gap-1"
                          style={{ color: theme.warning }}
                        >
                          <Receipt className="w-3 h-3 mt-0.5" />
                          <span>Note: {acc.extraChargeNote}</span>
                        </p>
                      )}
                    </div>
                  )}

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
