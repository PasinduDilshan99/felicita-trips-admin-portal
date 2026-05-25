// components/activities-components/view-activity-details-components/ActivityRequirements.tsx
"use client";

import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Requirement } from "@/types/activity-types";

interface ActivityRequirementsProps {
  requirements: Requirement[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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
          className="px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Requirements
          </h2>
        </div>
        <div className="px-6 py-8 text-center">
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
        className="px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Requirements ({requirements.length})
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          What you need to know before booking
        </p>
      </div>

      <div className="px-6 py-5 space-y-3">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(req.color || theme.primary, 0.06),
              borderLeft: `3px solid ${req.color || theme.primary}`,
            }}
          >
            {req.status === 1 ? (
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: req.color || theme.success }} />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: req.color || theme.warning }} />
            )}
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-0.5" style={{ color: theme.text }}>
                {req.name}
              </h4>
              {req.value && (
                <p className="text-xs font-mono mb-1" style={{ color: req.color || theme.primary }}>
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
        ))}
      </div>
    </div>
  );
};