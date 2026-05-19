// components/packages-components/package-details-view-components/PackageInclusionsExclusions.tsx
"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface InclusionExclusionItem {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

interface PackageInclusionsExclusionsProps {
  inclusions: InclusionExclusionItem[];
  exclusions: InclusionExclusionItem[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const PackageInclusionsExclusions: React.FC<
  PackageInclusionsExclusionsProps
> = ({ inclusions, exclusions }) => {
  const { theme } = useTheme();
  const [isInclusionsExpanded, setIsInclusionsExpanded] = useState(true);
  const [isExclusionsExpanded, setIsExclusionsExpanded] = useState(true);

  const activeInclusions = inclusions
    .filter((i) => i.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const activeExclusions = exclusions
    .filter((e) => e.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeInclusions.length === 0 && activeExclusions.length === 0) {
    return null;
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
          Inclusions & Exclusions
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Inclusions */}
        {activeInclusions.length > 0 && (
          <div>
            <button
              onClick={() => setIsInclusionsExpanded(!isInclusionsExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: hexToRgba(theme.success, 0.05),
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: theme.success }}
                />
                <h3
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: theme.success }}
                >
                  Inclusions ({activeInclusions.length})
                </h3>
              </div>
              {isInclusionsExpanded ? (
                <ChevronUp
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
              ) : (
                <ChevronDown
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
              )}
            </button>

            {isInclusionsExpanded && (
              <div className="mt-2 space-y-1.5">
                {activeInclusions.map((inclusion) => (
                  <div
                    key={inclusion.id}
                    className="flex items-start gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.success, 0.03),
                    }}
                  >
                    <CheckCircle
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: theme.success }}
                    />
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {inclusion.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exclusions */}
        {activeExclusions.length > 0 && (
          <div>
            <button
              onClick={() => setIsExclusionsExpanded(!isExclusionsExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: hexToRgba(theme.error, 0.05),
              }}
            >
              <div className="flex items-center gap-2">
                <XCircle
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: theme.error }}
                />
                <h3
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: theme.error }}
                >
                  Exclusions ({activeExclusions.length})
                </h3>
              </div>
              {isExclusionsExpanded ? (
                <ChevronUp
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
              ) : (
                <ChevronDown
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
              )}
            </button>

            {isExclusionsExpanded && (
              <div className="mt-2 space-y-1.5">
                {activeExclusions.map((exclusion) => (
                  <div
                    key={exclusion.id}
                    className="flex items-start gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.error, 0.03),
                    }}
                  >
                    <XCircle
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: theme.error }}
                    />
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {exclusion.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
