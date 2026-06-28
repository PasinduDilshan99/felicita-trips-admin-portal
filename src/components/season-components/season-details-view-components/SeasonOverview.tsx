"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, FileText, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SeasonOverviewProps } from "@/types/season-types";
import { getMonthName } from "@/utils/commonFunctions";
import { hexToRgba } from "@/utils/functions";

export const SeasonOverview: React.FC<SeasonOverviewProps> = ({
  name,
  standardName,
  localName,
  description,
  startMonth,
  endMonth,
  isPeak,
  displayOrder,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    description?.length > 500 && !isExpanded
      ? description.slice(0, 500) + "..."
      : description;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
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
          Season Overview
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Season Name */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Season Name
          </p>
          <h3
            className="text-lg sm:text-xl font-bold"
            style={{ color: theme.text }}
          >
            {name}
          </h3>
        </div>

        {/* Standard & Local Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium"
              style={{ color: theme.textSecondary }}
            >
              Standard Name
            </p>
            <p
              className="text-sm sm:text-base font-medium mt-0.5"
              style={{ color: theme.text }}
            >
              {standardName}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium"
              style={{ color: theme.textSecondary }}
            >
              Local Name
            </p>
            <p
              className="text-sm sm:text-base font-medium mt-0.5"
              style={{ color: theme.text }}
            >
              {localName || "N/A"}
            </p>
          </div>
        </div>

        {/* Season Period */}
        <div className="flex items-start gap-2">
          <Calendar
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: theme.primary }}
          />
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium"
              style={{ color: theme.textSecondary }}
            >
              Season Period
            </p>
            <p
              className="text-sm sm:text-base font-medium"
              style={{ color: theme.text }}
            >
              {getMonthName(startMonth)} - {getMonthName(endMonth)}
            </p>
          </div>
        </div>

        {/* Peak Season Badge */}
        {isPeak && (
          <div
            className="rounded-xl p-2 flex items-center gap-2"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.1),
              border: `1px solid ${hexToRgba(theme.warning, 0.2)}`,
            }}
          >
            <Star className="w-4 h-4" style={{ color: theme.warning }} />
            <span
              className="text-sm font-medium"
              style={{ color: theme.warning }}
            >
              Peak Season
            </span>
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              High demand period
            </span>
          </div>
        )}

        {/* Display Order */}
        <div>
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Display Order
          </p>
          <p
            className="text-sm sm:text-base font-medium"
            style={{ color: theme.text }}
          >
            {displayOrder}
          </p>
        </div>

        {/* Description */}
        {description && (
          <div>
            <p
              className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-2"
              style={{ color: theme.textSecondary }}
            >
              Description
            </p>
            <div
              className="text-xs sm:text-sm leading-relaxed rounded-xl p-3 sm:p-4"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.03),
                border: `1px solid ${hexToRgba(theme.primary, 0.08)}`,
              }}
            >
              <div className="flex gap-2">
                <FileText
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
                  style={{ color: theme.primary }}
                />
                <div className="flex-1">
                  <p style={{ color: theme.textSecondary }}>
                    {truncatedDescription}
                  </p>
                  {description.length > 500 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
                      style={{ color: theme.primary }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
