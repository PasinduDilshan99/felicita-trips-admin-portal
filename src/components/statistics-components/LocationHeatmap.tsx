"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface LocationHeatmapProps {
  data: Array<{ startLocation: string; totalTours: number }>;
  prefix?: string;
}

export const LocationHeatmap: React.FC<LocationHeatmapProps> = ({ 
  data, 
  prefix = "tr" 
}) => {
  const { theme, isDarkMode } = useTheme();
  const p = theme.primary ?? "#0D4E4A";
  
  // Find max value for color scaling
  const maxTours = Math.max(...data.map(d => d.totalTours));
  
  // Generate color based on value
  const getColor = (value: number) => {
    const intensity = value / maxTours;
    if (intensity > 0.8) return p;
    if (intensity > 0.6) return hexToRgba(p, 0.8);
    if (intensity > 0.4) return hexToRgba(p, 0.6);
    if (intensity > 0.2) return hexToRgba(p, 0.4);
    return hexToRgba(p, 0.2);
  };
  
  // Sort data by tour count descending
  const sortedData = [...data].sort((a, b) => b.totalTours - a.totalTours);
  
  return (
    <div className={`${prefix}-heatmap-container`}>
      <div className={`${prefix}-heatmap-grid`}>
        {sortedData.map((item, idx) => (
          <div key={idx} className={`${prefix}-heatmap-cell`}>
            <div
              className={`${prefix}-heatmap-bar`}
              style={{
                backgroundColor: getColor(item.totalTours),
                width: `${(item.totalTours / maxTours) * 100}%`,
              }}
            >
              <span className={`${prefix}-heatmap-value`}>{item.totalTours}</span>
            </div>
            <div className={`${prefix}-heatmap-label`}>{item.startLocation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};