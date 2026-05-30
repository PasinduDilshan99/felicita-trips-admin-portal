"use client";

import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityRequirementsProps, Requirement } from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityRequirements: React.FC<ActivityRequirementsProps> = ({
  requirements,
}) => {
  const { theme } = useTheme();

  if (!requirements.length) {
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
            Requirements
          </h2>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No specific requirements for this activity.
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
          Requirements ({requirements.length})
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          What you need to know before booking
        </p>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {requirements.map((req) => {
          const reqColor = req.color || theme.primary;
          const isActive = req.status === 1;

          return (
            <div
              key={req.id}
              className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:translate-x-1"
              style={{
                backgroundColor: hexToRgba(reqColor, 0.06),
                borderLeft: `3px solid ${reqColor}`,
              }}
            >
              {isActive ? (
                <CheckCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: reqColor }}
                />
              ) : (
                <AlertCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: reqColor }}
                />
              )}
              <div className="flex-1">
                <h4
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: theme.text }}
                >
                  {req.name}
                </h4>
                {req.value && (
                  <p
                    className="text-xs font-mono mb-1"
                    style={{ color: reqColor }}
                  >
                    {req.value}
                  </p>
                )}
                {req.description && (
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    {req.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
