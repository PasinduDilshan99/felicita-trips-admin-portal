"use client";

import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageFeaturesProps } from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";

export const PackageFeatures: React.FC<PackageFeaturesProps> = ({
  features,
}) => {
  const { theme } = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  if (!features.length) {
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
        <div className="flex items-center gap-2">
          <Star
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.warning }}
          />
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Package Features
          </h2>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.warning, 0.1),
              color: theme.warning,
            }}
          >
            {features.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {features.map((feature) => {
          const isExpanded = expandedFeature === feature.featureId;
          const featureColor = feature.color || theme.primary;

          return (
            <div
              key={feature.featureId}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(featureColor, 0.04),
                border: `1px solid ${hexToRgba(featureColor, 0.15)}`,
              }}
            >
              <button
                onClick={() =>
                  setExpandedFeature(isExpanded ? null : feature.featureId)
                }
                className="w-full flex items-center justify-between p-3 text-left cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: featureColor }}
                  />
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: theme.text }}
                    >
                      {feature.featureName}
                    </h3>
                    {feature.featureValue && (
                      <p
                        className="text-xs font-medium"
                        style={{ color: featureColor }}
                      >
                        {feature.featureValue}
                      </p>
                    )}
                  </div>
                </div>
                {isExpanded ? (
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

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {feature.featureDescription && (
                    <div className="flex gap-2">
                      <Info
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: featureColor }}
                      />
                      <p
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {feature.featureDescription}
                      </p>
                    </div>
                  )}
                  {feature.specialNote && (
                    <div
                      className="rounded-lg p-2 text-xs"
                      style={{
                        backgroundColor: hexToRgba(theme.warning, 0.08),
                        color: theme.warning,
                      }}
                    >
                      📝 {feature.specialNote}
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
