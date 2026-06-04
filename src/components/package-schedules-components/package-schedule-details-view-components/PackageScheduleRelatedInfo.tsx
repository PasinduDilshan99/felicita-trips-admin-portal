"use client";

import React, { useState } from "react";
import {
  Package,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Users,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageScheduleRelatedInfoProps } from "@/types/package-schedule-types";
import { hexToRgba } from "@/utils/functions";

export const PackageScheduleRelatedInfo: React.FC<
  PackageScheduleRelatedInfoProps
> = ({
  packageId,
  packageName,
  packageDescription,
  packageStatus,
  packageTypeName,
  packageTypeDescription,
  minPersonCount,
  maxPersonCount,
  tourId,
  tourName,
  tourDescription,
  tourDuration,
  startLocation,
  endLocation,
  season,
  tourStatus,
  tourScheduleId,
  tourScheduleName,
  onViewPackage,
  onViewTour,
  onViewTourSchedule,
}) => {
  const { theme } = useTheme();
  const [isPackageExpanded, setIsPackageExpanded] = useState(false);
  const [isTourExpanded, setIsTourExpanded] = useState(false);

  const isPackageActive = packageStatus === "ACTIVE";
  const isTourActive = tourStatus === "ACTIVE";

  // Fix: Add null checks before accessing .length
  const truncatedPackageDesc =
    packageDescription && packageDescription?.length > 150 && !isPackageExpanded
      ? packageDescription.slice(0, 150) + "..."
      : packageDescription;

  const truncatedTourDesc =
    tourDescription && tourDescription?.length > 150 && !isTourExpanded
      ? tourDescription.slice(0, 150) + "..."
      : tourDescription;

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
          Related Information
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Package Info */}
        <div
          className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.03),
            border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
          }}
          onClick={onViewPackage}
        >
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: theme.primary }} />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: theme.primary }}
                >
                  Associated Package
                </h3>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white ${
                  isPackageActive ? "bg-emerald-500" : "bg-gray-500"
                }`}
              >
                {packageStatus}
              </span>
            </div>
            <p
              className="font-medium text-sm mt-1 hover:underline"
              style={{ color: theme.text }}
            >
              {packageName}
            </p>
            <div
              className="flex flex-wrap gap-2 mt-1 text-xs"
              style={{ color: theme.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {minPersonCount}-{maxPersonCount} persons
              </span>
              <span>{packageTypeName}</span>
            </div>
            {packageDescription && (
              <>
                <p
                  className="text-xs mt-2"
                  style={{ color: theme.textSecondary }}
                >
                  {truncatedPackageDesc}
                </p>
                {packageDescription.length > 150 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPackageExpanded(!isPackageExpanded);
                    }}
                    className="text-xs mt-1 transition-colors hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    {isPackageExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tour Info */}
        <div
          className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.03),
            border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
          }}
          onClick={onViewTour}
        >
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: theme.success }} />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: theme.success }}
                >
                  Associated Tour
                </h3>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white ${
                  isTourActive ? "bg-emerald-500" : "bg-gray-500"
                }`}
              >
                {tourStatus}
              </span>
            </div>
            <p
              className="font-medium text-sm mt-1 hover:underline"
              style={{ color: theme.text }}
            >
              {tourName}
            </p>
            <div
              className="flex flex-wrap gap-3 mt-1 text-xs"
              style={{ color: theme.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tourDuration} days
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {season}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {startLocation} → {endLocation}
              </span>
            </div>
            {tourDescription && (
              <>
                <p
                  className="text-xs mt-2"
                  style={{ color: theme.textSecondary }}
                >
                  {truncatedTourDesc}
                </p>
                {tourDescription.length > 150 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTourExpanded(!isTourExpanded);
                    }}
                    className="text-xs mt-1 transition-colors hover:opacity-80"
                    style={{ color: theme.success }}
                  >
                    {isTourExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tour Schedule Info */}
        {tourScheduleId && (
          <div
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.03),
              border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
            onClick={onViewTourSchedule}
          >
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: theme.primary }}
                />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: theme.primary }}
                >
                  Tour Schedule Reference
                </h3>
                <ExternalLink
                  className="w-3 h-3 ml-auto opacity-60"
                  style={{ color: theme.primary }}
                />
              </div>
              <p
                className="font-medium text-sm mt-1"
                style={{ color: theme.text }}
              >
                {tourScheduleName || `Schedule ID: ${tourScheduleId}`}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                This package schedule is based on this tour schedule
              </p>
            </div>
          </div>
        )}

        {/* Click hints */}
        <div
          className="text-center pt-2 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <p className="text-[10px]" style={{ color: theme.textSecondary }}>
            Click on any card to view full details
          </p>
        </div>
      </div>
    </div>
  );
};
