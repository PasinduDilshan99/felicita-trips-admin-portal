"use client";

import React from "react";
import { Shield, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const impactMessages = [
  "All activities associated with this destination will be permanently deleted",
  "All destination images will be permanently deleted from storage",
  "This action cannot be undone — recovery is not possible",
  "This termination will be logged for audit trail purposes",
];

export const ImpactWarning: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hexToRgba(theme.error, 0.05),
        border: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.error, 0.3)}` }}
      >
        <Shield className="w-4 h-4" style={{ color: theme.error }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>Termination Impact</h3>
      </div>
      <div className="px-4 py-4">
        <div className="space-y-3">
          {impactMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                style={{ background: hexToRgba(theme.error, 0.1), color: theme.error }}
              >
                <AlertCircle size={11} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.error }}>{msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};