// components/common-components/CommonQuickStats.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export interface QuickStatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}

export interface CommonQuickStatsProps {
  stats: QuickStatItem[];
  title?: string;
  statusBadge?: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CommonQuickStats: React.FC<CommonQuickStatsProps> = ({
  stats,
  title = "Quick Stats",
  statusBadge,
  footerContent,
  className = "",
  columns = 2,
}) => {
  const { theme } = useTheme();

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          {title}
        </h2>
        {statusBadge}
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className={`grid ${gridCols[columns]} gap-3`}>
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            const statColor = stat.color || theme.primary;

            return (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                style={{
                  backgroundColor: hexToRgba(statColor, 0.04),
                }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: hexToRgba(statColor, 0.1) }}
                >
                  <IconComponent
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ color: statColor }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] sm:text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-sm sm:text-base font-semibold truncate"
                    style={{ color: theme.text }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {footerContent && (
          <div
            className="mt-4 pt-3 border-t"
            style={{ borderColor: hexToRgba(theme.border, 0.5) }}
          >
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};
