"use client";

import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageTourInfoProps } from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";

export const PackageTourInfo: React.FC<PackageTourInfoProps> = ({
  tourId,
  tourName,
  onViewTour,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
      onClick={onViewTour}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <MapPin
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Associated Tour
          </h2>
        </div>
        <ExternalLink
          className="w-4 h-4 sm:w-5 sm:h-5 opacity-60"
          style={{ color: theme.primary }}
        />
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <p
          className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
          style={{ color: theme.textSecondary }}
        >
          Tour Name
        </p>
        <p
          className="font-semibold text-sm sm:text-base hover:underline"
          style={{ color: theme.primary }}
        >
          {tourName}
        </p>
        <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
          Tour ID: {tourId}
        </p>

        {/* Click hint */}
        <div
          className="text-center pt-3 mt-2 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <span className="text-[10px]" style={{ color: theme.textSecondary }}>
            Click to view full tour details
          </span>
        </div>
      </div>
    </div>
  );
};
