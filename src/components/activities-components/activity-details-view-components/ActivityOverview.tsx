// components/activities-components/view-activity-details-components/ActivityOverview.tsx
"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ActivityOverviewProps {
  name: string;
  description: string;
  destinationName: string;
  availableFrom: string;
  availableTo: string;
  durationHours: number;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({
  name,
  description,
  destinationName,
  availableFrom,
  availableTo,
  durationHours,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not specified";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncatedDescription =
    description.length > 300 && !isExpanded
      ? description.slice(0, 300) + "..."
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
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Overview
        </h2>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Destination
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>
                {destinationName || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Duration
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>
                {durationHours ? `${durationHours} hours` : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Available From
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>
                {formatDate(availableFrom)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primary }} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Available To
              </p>
              <p className="text-sm font-medium mt-0.5" style={{ color: theme.text }}>
                {formatDate(availableTo)}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="pt-2">
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: theme.textSecondary }}>
              Description
            </p>
            <div
              className="text-sm leading-relaxed"
              style={{ color: theme.textSecondary }}
            >
              <p>{truncatedDescription}</p>
              {description.length > 300 && (
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
        )}
      </div>
    </div>
  );
};