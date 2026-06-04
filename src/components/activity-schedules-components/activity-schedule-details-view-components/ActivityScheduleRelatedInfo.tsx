"use client";

import React, { useState } from "react";
import {
  Activity,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Users,
  DollarSign,
  Package,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityScheduleRelatedInfoProps } from "@/types/activity-schedule-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityScheduleRelatedInfo: React.FC<
  ActivityScheduleRelatedInfoProps
> = ({
  activityId,
  activityName,
  activityDescription,
  activityStatus,
  durationHours,
  availableFrom,
  availableTo,
  priceLocal,
  priceForeigners,
  minParticipate,
  maxParticipate,
  season,
  destinationId,
  destinationName,
  tourId,
  tourName,
  tourDescription,
  tourDuration,
  startLocation,
  endLocation,
  tourStatus,
  tourScheduleId,
  tourScheduleName,
  tourScheduleStartDate,
  tourScheduleEndDate,
  tourScheduleDurationStart,
  tourScheduleDurationEnd,
  tourScheduleStatus,
  packageId,
  packageName,
  packageDescription,
  totalPrice,
  discountPercentage,
  pricePerPerson,
  minPersonCount,
  maxPersonCount,
  packageStatus,
  packageScheduleId,
  packageScheduleName,
  packageScheduleStartDate,
  packageScheduleEndDate,
  packageScheduleDurationStart,
  packageScheduleDurationEnd,
  packageScheduleStatus,
  onViewActivity,
  onViewDestination,
  onViewTour,
  onViewTourSchedule,
  onViewPackage,
  onViewPackageSchedule,
}) => {
  const { theme } = useTheme();
  const [isActivityExpanded, setIsActivityExpanded] = useState(false);
  const [isTourExpanded, setIsTourExpanded] = useState(false);
  const [isPackageExpanded, setIsPackageExpanded] = useState(false);

  const isActivityActive = activityStatus === "ACTIVE";
  const isTourActive = tourStatus === "ACTIVE";
  const isPackageActive = packageStatus === "ACTIVE";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return `$${price.toLocaleString()}`;
  };

  const truncatedActivityDesc =
    activityDescription &&
    activityDescription?.length > 150 &&
    !isActivityExpanded
      ? activityDescription.slice(0, 150) + "..."
      : activityDescription;

  const truncatedTourDesc =
    tourDescription && tourDescription?.length > 150 && !isTourExpanded
      ? tourDescription.slice(0, 150) + "..."
      : tourDescription;

  const truncatedPackageDesc =
    packageDescription && packageDescription?.length > 150 && !isPackageExpanded
      ? packageDescription.slice(0, 150) + "..."
      : packageDescription;

  const discountedPrice =
    totalPrice && discountPercentage
      ? totalPrice - (totalPrice * discountPercentage) / 100
      : totalPrice;

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
        {/* Activity Info */}
        <div
          className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.03),
            border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
          }}
          onClick={onViewActivity}
        >
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity
                  className="w-4 h-4"
                  style={{ color: theme.primary }}
                />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: theme.primary }}
                >
                  Base Activity
                </h3>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white ${
                  isActivityActive ? "bg-emerald-500" : "bg-gray-500"
                }`}
              >
                {activityStatus}
              </span>
            </div>
            <p
              className="font-medium text-sm mt-1 hover:underline"
              style={{ color: theme.text }}
            >
              {activityName}
            </p>
            <div
              className="flex flex-wrap gap-3 mt-1 text-xs"
              style={{ color: theme.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {durationHours} hours
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {season}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {minParticipate}-{maxParticipate} persons
              </span>
            </div>
            <div
              className="flex flex-wrap gap-3 mt-1 text-xs"
              style={{ color: theme.textSecondary }}
            >
              <span className="flex items-center gap-1">
                <DollarSign
                  className="w-3 h-3"
                  style={{ color: theme.success }}
                />
                Local: {formatPrice(priceLocal)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign
                  className="w-3 h-3"
                  style={{ color: theme.primary }}
                />
                Foreign: {formatPrice(priceForeigners)}
              </span>
            </div>
            {activityDescription && (
              <>
                <p
                  className="text-xs mt-2"
                  style={{ color: theme.textSecondary }}
                >
                  {truncatedActivityDesc}
                </p>
                {activityDescription.length > 150 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsActivityExpanded(!isActivityExpanded);
                    }}
                    className="text-xs mt-1 transition-colors hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    {isActivityExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Destination Info */}
        <div
          className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.03),
            border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
          }}
          onClick={onViewDestination}
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.success }} />
              <h3
                className="font-semibold text-sm"
                style={{ color: theme.success }}
              >
                Destination
              </h3>
              <ExternalLink
                className="w-3 h-3 ml-auto opacity-60"
                style={{ color: theme.success }}
              />
            </div>
            <p
              className="font-medium text-sm mt-1 hover:underline"
              style={{ color: theme.text }}
            >
              {destinationName}
            </p>
            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              This activity takes place at this destination
            </p>
          </div>
        </div>

        {/* Tour Info */}
        {tourId && tourName && (
          <div
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.03),
              border: `1px solid ${hexToRgba(theme.warning, 0.1)}`,
            }}
            onClick={onViewTour}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-4 h-4"
                    style={{ color: theme.warning }}
                  />
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: theme.warning }}
                  >
                    Associated Tour
                  </h3>
                </div>
                {tourStatus && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white ${
                      isTourActive ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  >
                    {tourStatus}
                  </span>
                )}
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
                {startLocation && endLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {startLocation} → {endLocation}
                  </span>
                )}
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
                      style={{ color: theme.warning }}
                    >
                      {isTourExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

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
              <div
                className="flex flex-wrap gap-3 mt-1 text-xs"
                style={{ color: theme.textSecondary }}
              >
                <span>
                  {formatDate(tourScheduleStartDate)} -{" "}
                  {formatDate(tourScheduleEndDate)}
                </span>
                <span>
                  {tourScheduleDurationStart}-{tourScheduleDurationEnd} days
                </span>
                {tourScheduleStatus && (
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded-full ${
                      tourScheduleStatus === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {tourScheduleStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Package Info */}
        {packageId && packageName && (
          <div
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: hexToRgba(theme.accent || theme.primary, 0.03),
              border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.1)}`,
            }}
            onClick={onViewPackage}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package
                    className="w-4 h-4"
                    style={{ color: theme.accent || theme.primary }}
                  />
                  <h3
                    className="font-semibold text-sm"
                    style={{ color: theme.accent || theme.primary }}
                  >
                    Associated Package
                  </h3>
                </div>
                {packageStatus && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white ${
                      isPackageActive ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  >
                    {packageStatus}
                  </span>
                )}
              </div>
              <p
                className="font-medium text-sm mt-1 hover:underline"
                style={{ color: theme.text }}
              >
                {packageName}
              </p>
              <div
                className="flex flex-wrap gap-3 mt-1 text-xs"
                style={{ color: theme.textSecondary }}
              >
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {minPersonCount}-{maxPersonCount} persons
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatPrice(pricePerPerson)}/person
                </span>
                {totalPrice && (
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Total: {formatPrice(totalPrice)}
                    {discountPercentage && discountPercentage > 0 && (
                      <span className="text-emerald-500">
                        {" "}
                        (-{discountPercentage}%)
                      </span>
                    )}
                  </span>
                )}
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
                      style={{ color: theme.accent || theme.primary }}
                    >
                      {isPackageExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Package Schedule Info */}
        {packageScheduleId && (
          <div
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.03),
              border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
            }}
            onClick={onViewPackageSchedule}
          >
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: theme.success }}
                />
                <h3
                  className="font-semibold text-sm"
                  style={{ color: theme.success }}
                >
                  Package Schedule Reference
                </h3>
                <ExternalLink
                  className="w-3 h-3 ml-auto opacity-60"
                  style={{ color: theme.success }}
                />
              </div>
              <p
                className="font-medium text-sm mt-1"
                style={{ color: theme.text }}
              >
                {packageScheduleName || `Schedule ID: ${packageScheduleId}`}
              </p>
              <div
                className="flex flex-wrap gap-3 mt-1 text-xs"
                style={{ color: theme.textSecondary }}
              >
                <span>
                  {formatDate(packageScheduleStartDate)} -{" "}
                  {formatDate(packageScheduleEndDate)}
                </span>
                <span>
                  {packageScheduleDurationStart}-{packageScheduleDurationEnd}{" "}
                  days
                </span>
                {packageScheduleStatus && (
                  <span
                    className={`text-[9px] px-1 py-0.5 rounded-full ${
                      packageScheduleStatus === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-gray-500/20 text-gray-500"
                    }`}
                  >
                    {packageScheduleStatus}
                  </span>
                )}
              </div>
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
