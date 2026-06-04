"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface CapacityGaugeProps {
  packageName: string;
  minCapacity: number;
  maxCapacity: number;
  averageParticipants: number;
  prefix?: string;
}

export const CapacityGauge: React.FC<CapacityGaugeProps> = ({
  packageName,
  minCapacity,
  maxCapacity,
  averageParticipants,
  prefix = "pk",
}) => {
  const { theme } = useTheme();
  const p = theme.primary ?? "#0D4E4A";
  const utilization =
    ((averageParticipants - minCapacity) / (maxCapacity - minCapacity)) * 100;
  const clampedUtilization = Math.min(Math.max(utilization, 0), 100);

  const getGaugeColor = () => {
    if (clampedUtilization >= 70) return "#10b981";
    if (clampedUtilization >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const angle = (clampedUtilization / 100) * 180;
  const strokeDasharray = `${angle}, 180`;

  return (
    <div className={`${prefix}-gauge-container`}>
      <div className={`${prefix}-gauge-title`}>{packageName}</div>
      <div className={`${prefix}-gauge-chart`}>
        <svg viewBox="0 0 200 120" className={`${prefix}-gauge-svg`}>
          <path
            d="M20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getGaugeColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={getGaugeColor()}
          >
            {Math.round(clampedUtilization)}%
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            Utilization
          </text>
        </svg>
      </div>
      <div className={`${prefix}-gauge-stats`}>
        <div className={`${prefix}-gauge-stat`}>
          <span className={`${prefix}-gauge-stat-label`}>Min:</span>
          <span className={`${prefix}-gauge-stat-value`}>{minCapacity}</span>
        </div>
        <div className={`${prefix}-gauge-stat`}>
          <span className={`${prefix}-gauge-stat-label`}>Avg:</span>
          <span className={`${prefix}-gauge-stat-value`}>
            {averageParticipants}
          </span>
        </div>
        <div className={`${prefix}-gauge-stat`}>
          <span className={`${prefix}-gauge-stat-label`}>Max:</span>
          <span className={`${prefix}-gauge-stat-value`}>{maxCapacity}</span>
        </div>
      </div>
    </div>
  );
};
