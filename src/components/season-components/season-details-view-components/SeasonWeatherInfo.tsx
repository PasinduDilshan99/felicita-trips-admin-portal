"use client";

import React from "react";
import { Thermometer, CloudRain, Wind, Sun, Droplets } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SeasonWeatherInfoProps } from "@/types/season-types";
import { hexToRgba } from "@/utils/functions";

export const SeasonWeatherInfo: React.FC<SeasonWeatherInfoProps> = ({
  temperatureMin,
  temperatureMax,
  weatherSummary,
  rainfallPattern,
  monsoonType,
}) => {
  const { theme } = useTheme();

  const getMonsoonTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "northeast monsoon":
        return <Wind className="w-4 h-4" />;
      case "southwest monsoon":
        return <CloudRain className="w-4 h-4" />;
      case "inter-monsoon":
        return <Sun className="w-4 h-4" />;
      default:
        return <Droplets className="w-4 h-4" />;
    }
  };

  const getMonsoonTypeColor = (type: string): string => {
    switch (type?.toLowerCase()) {
      case "northeast monsoon":
        return "#3b82f6";
      case "southwest monsoon":
        return "#10b981";
      case "inter-monsoon":
        return "#f59e0b";
      default:
        return theme.primary;
    }
  };

  const monsoonColor = getMonsoonTypeColor(monsoonType);
  const avgTemperature = (temperatureMin + temperatureMax) / 2;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
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
          Weather Information
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Temperature Card */}
        <div
          className="rounded-xl p-3 sm:p-4"
          style={{
            backgroundColor: hexToRgba(theme.warning, 0.06),
            border: `1px solid ${hexToRgba(theme.warning, 0.15)}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4" style={{ color: theme.warning }} />
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Temperature
            </p>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: theme.warning }}
            >
              {avgTemperature}°C
            </span>
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              (Range: {temperatureMin}°C - {temperatureMax}°C)
            </span>
          </div>
        </div>

        {/* Monsoon Type Card */}
        {monsoonType && (
          <div
            className="rounded-xl p-3 sm:p-4"
            style={{
              backgroundColor: hexToRgba(monsoonColor, 0.06),
              border: `1px solid ${hexToRgba(monsoonColor, 0.15)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {getMonsoonTypeIcon(monsoonType)}
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Monsoon Type
              </p>
            </div>
            <p
              className="text-base sm:text-lg font-semibold"
              style={{ color: monsoonColor }}
            >
              {monsoonType}
            </p>
          </div>
        )}

        {/* Weather Summary */}
        {weatherSummary && (
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
              border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4" style={{ color: theme.primary }} />
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Weather Summary
              </p>
            </div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {weatherSummary}
            </p>
          </div>
        )}

        {/* Rainfall Pattern */}
        {rainfallPattern && (
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.04),
              border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4" style={{ color: theme.primary }} />
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Rainfall Pattern
              </p>
            </div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {rainfallPattern}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
