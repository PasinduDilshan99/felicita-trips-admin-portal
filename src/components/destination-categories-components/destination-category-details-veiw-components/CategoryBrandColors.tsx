"use client";

import React from "react";
import { Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryBrandColorsProps {
  primaryColor: string;
  hoverColor: string;
}

const CategoryBrandColors = ({
  primaryColor,
  hoverColor,
}: CategoryBrandColorsProps) => {
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
        <Palette
          className="w-5 h-5"
          style={{ color: primaryColor || theme.primary }}
        />
        Brand Colors
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="text-sm font-medium block mb-2"
              style={{ color: theme.textSecondary }}
            >
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg shadow-md"
                style={{ backgroundColor: primaryColor || theme.primary }}
              />
              <div>
                <code
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                    color: theme.text,
                  }}
                >
                  {primaryColor || theme.primary}
                </code>
              </div>
            </div>
          </div>

          <div>
            <label
              className="text-sm font-medium block mb-2"
              style={{ color: theme.textSecondary }}
            >
              Hover Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg shadow-md"
                style={{ backgroundColor: hoverColor || theme.accent }}
              />
              <div>
                <code
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                    color: theme.text,
                  }}
                >
                  {hoverColor || theme.accent}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="pt-4 border-t" style={{ borderColor: theme.border }}>
          <label
            className="text-sm font-medium block mb-2"
            style={{ color: theme.textSecondary }}
          >
            Color Preview
          </label>
          <div
            className="h-16 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${primaryColor || theme.primary}, ${
                hoverColor || theme.accent
              })`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { CategoryBrandColors };
