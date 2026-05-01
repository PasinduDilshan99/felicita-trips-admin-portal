// components/common-components/SelectedItemBar.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export interface SelectedItem {
  id: number | string;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type SelectedItemBarVariant = "primary" | "success" | "warning" | "error" | "info";

export interface SelectedItemBarProps {
  item: SelectedItem | null;
  onClear: () => void;
  variant?: SelectedItemBarVariant;
  title?: string;
  showId?: boolean;
  clearButtonText?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SelectedItemBar: React.FC<SelectedItemBarProps> = ({
  item,
  onClear,
  variant = "primary",
  title = "Currently Selected",
  showId = true,
  clearButtonText = "Change",
  className = "",
  size = "md",
}) => {
  const { theme } = useTheme();

  if (!item) return null;

  // Get variant colors
  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return {
          primary: theme.success,
          bgLight: hexToRgba(theme.success, 0.1),
          border: `1px solid ${theme.success}`,
          text: theme.success,
        };
      case "warning":
        return {
          primary: theme.warning,
          bgLight: hexToRgba(theme.warning, 0.1),
          border: `1px solid ${theme.warning}`,
          text: theme.warning,
        };
      case "error":
        return {
          primary: theme.error,
          bgLight: hexToRgba(theme.error, 0.1),
          border: `1px solid ${theme.error}`,
          text: theme.error,
        };
      case "info":
        return {
          primary: theme.accent,
          bgLight: hexToRgba(theme.accent, 0.1),
          border: `1px solid ${theme.accent}`,
          text: theme.accent,
        };
      default:
        return {
          primary: theme.primary,
          bgLight: hexToRgba(theme.primary, 0.1),
          border: `1px solid ${theme.primary}`,
          text: theme.primary,
        };
    }
  };

  const colors = getVariantColors();

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "p-2",
      textSize: "text-xs",
      badgeSize: "text-xs",
      buttonPadding: "px-2 py-1",
      gap: "gap-1.5",
    },
    md: {
      padding: "p-4",
      textSize: "text-sm",
      badgeSize: "text-xs",
      buttonPadding: "px-3 py-1.5",
      gap: "gap-2",
    },
    lg: {
      padding: "p-5",
      textSize: "text-base",
      badgeSize: "text-sm",
      buttonPadding: "px-4 py-2",
      gap: "gap-3",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`mb-6 rounded-xl flex items-center justify-between transition-all duration-300 ${config.padding} ${className}`}
      style={{
        backgroundColor: colors.bgLight,
        border: colors.border,
      }}
    >
      <div>
        <div
          className={`${config.textSize} mb-0.5`}
          style={{ color: theme.textSecondary }}
        >
          {title}:
        </div>
        <div
          className={`font-semibold ${config.textSize === "text-base" ? "text-base" : "text-sm"}`}
          style={{ color: colors.primary }}
        >
          {item.name}
          {showId && item.id && (
            <span className={`ml-2 ${config.badgeSize}`} style={{ color: theme.textSecondary }}>
              (ID: {item.id})
            </span>
          )}
        </div>
        {item.description && (
          <div
            className={`${config.textSize === "text-base" ? "text-xs" : "text-xs"} mt-0.5`}
            style={{ color: theme.textSecondary }}
          >
            {item.description}
          </div>
        )}
      </div>
      <button
        onClick={onClear}
        className={`rounded-lg transition-all duration-200 flex items-center gap-2 ${config.buttonPadding} ${config.textSize} font-medium hover:opacity-90 active:scale-95`}
        style={{
          backgroundColor: theme.error,
          color: "#fff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <X className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"}`} />
        {clearButtonText}
      </button>
    </div>
  );
};

export default SelectedItemBar;