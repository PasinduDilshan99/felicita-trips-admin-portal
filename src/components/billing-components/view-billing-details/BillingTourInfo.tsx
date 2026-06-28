"use client";

import React from "react";
import { MapPin, Calendar, Users, Package, Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingTour, BookingPackageDetails } from "@/types/billing-types";
import { hexToRgba } from "@/utils/functions";

interface BillingTourInfoProps {
  tour: BookingTour;
  packageDetails: BookingPackageDetails;
}

export const BillingTourInfo: React.FC<BillingTourInfoProps> = ({
  tour,
  packageDetails,
}) => {
  const { theme } = useTheme();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

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
          className="text-base sm:text-lg font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <MapPin
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          Tour & Package Details
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Tour Name */}
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Tour Name
          </p>
          <p className="text-base font-semibold" style={{ color: theme.text }}>
            {tour.tourName}
          </p>
        </div>

        {/* Package Info */}
        {packageDetails.packageName && (
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.accent || theme.primary, 0.04),
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package
                className="w-4 h-4"
                style={{ color: theme.accent || theme.primary }}
              />
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Package
              </p>
            </div>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {packageDetails.packageName}
            </p>
            {packageDetails.scheduleName && (
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Schedule: {packageDetails.scheduleName}
              </p>
            )}
          </div>
        )}

        {/* Tour Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(theme.primary || theme.primary, 0.04),
            }}
          >
            <Clock
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary || theme.primary }}
            />
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Duration
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {tour.duration} days
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{ backgroundColor: hexToRgba(theme.success, 0.04) }}
          >
            <Users
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.success }}
            />
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Total Persons
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {tour.totalPersons}
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
          >
            <MapPin
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Start Location
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {tour.startLocation}
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{ backgroundColor: hexToRgba(theme.warning, 0.04) }}
          >
            <MapPin
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: theme.warning }}
            />
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                End Location
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {tour.endLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Travel Dates */}
        {(tour.travelStartDate || tour.travelEndDate) && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.primary || theme.primary, 0.04),
            }}
          >
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Travel Start Date
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {formatDate(tour.travelStartDate)}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Travel End Date
              </p>
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {formatDate(tour.travelEndDate)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
