"use client";

import React from "react";
import { Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryBasicInfoProps {
  name: string;
  description: string;
  color: string;
  hoverColor: string;
}

const CategoryBasicInfo = ({
  name,
  description,
  color,
}: CategoryBasicInfoProps) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: theme.text }}
      >
        <Info className="w-5 h-5" style={{ color: color || theme.primary }} />
        Basic Information
      </h2>

      <div className="space-y-4">
        <div>
          <label
            className="text-sm font-medium block mb-1"
            style={{ color: theme.textSecondary }}
          >
            Category Name
          </label>
          <div
            className="text-lg font-semibold px-3 py-2 rounded-lg"
            style={{
              color: color || theme.primary,
              backgroundColor: hexToRgba(color || theme.primary, 0.1),
            }}
          >
            {name}
          </div>
        </div>

        <div>
          <label
            className="text-sm font-medium block mb-1"
            style={{ color: theme.textSecondary }}
          >
            Description
          </label>
          <p
            className="leading-relaxed px-3 py-2 rounded-lg"
            style={{
              color: theme.text,
              backgroundColor: hexToRgba(theme.textSecondary, 0.05),
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export { CategoryBasicInfo };
