// components/packages-components/package-details-view-components/PackageConditionsTips.tsx
"use client";

import React, { useState } from "react";
import { AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ConditionTipItem {
  id: number;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

interface TravelTipItem {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

interface PackageConditionsTipsProps {
  conditions: ConditionTipItem[];
  travelTips: TravelTipItem[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const PackageConditionsTips: React.FC<PackageConditionsTipsProps> = ({
  conditions,
  travelTips,
}) => {
  const { theme } = useTheme();
  const [isConditionsExpanded, setIsConditionsExpanded] = useState(true);
  const [isTipsExpanded, setIsTipsExpanded] = useState(true);

  const activeConditions = conditions
    .filter((c) => c.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const activeTips = travelTips
    .filter((t) => t.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeConditions.length === 0 && activeTips.length === 0) {
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
          Conditions & Travel Tips
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Conditions */}
        {activeConditions.length > 0 && (
          <div>
            <button
              onClick={() => setIsConditionsExpanded(!isConditionsExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: hexToRgba(theme.warning, 0.05),
              }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: theme.warning }}
                />
                <h3
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: theme.warning }}
                >
                  Terms & Conditions ({activeConditions.length})
                </h3>
              </div>
              {isConditionsExpanded ? (
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

            {isConditionsExpanded && (
              <div className="mt-2 space-y-1.5">
                {activeConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-start gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.warning, 0.03),
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: theme.warning }}
                    />
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {condition.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Travel Tips */}
        {activeTips.length > 0 && (
          <div>
            <button
              onClick={() => setIsTipsExpanded(!isTipsExpanded)}
              className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.05),
              }}
            >
              <div className="flex items-center gap-2">
                <Lightbulb
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: theme.primary }}
                />
                <h3
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: theme.primary }}
                >
                  Travel Tips ({activeTips.length})
                </h3>
              </div>
              {isTipsExpanded ? (
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

            {isTipsExpanded && (
              <div className="mt-2 space-y-3">
                {activeTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="rounded-lg p-3"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.03),
                      border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                    }}
                  >
                    <h4
                      className="font-medium text-sm mb-1"
                      style={{ color: theme.primary }}
                    >
                      💡 {tip.title}
                    </h4>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {tip.description}
                    </p>
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
