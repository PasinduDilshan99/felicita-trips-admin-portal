"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";

interface QuickStatsProps {
  totalActivities: number;
  totalImages: number;
  avgDuration: number;
  isWishlisted: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalActivities,
  totalImages,
  avgDuration,
  isWishlisted,
}) => {
  const { theme } = useTheme();
  
  const stats = [
    { label: "Total Activities", value: totalActivities, color: theme.primary },
    { label: "Total Images", value: totalImages, color: theme.success },
    { label: "Avg Duration", value: `${avgDuration}h`, color: theme.warning },
    ...(isWishlisted ? [{ label: "Wishlist", value: "Added ♥", color: "#be185d" }] : []),
  ];

  return (
    <div 
      className="bg-white rounded-2xl border shadow-sm p-5 fade-up delay-3 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <h3 className="flex items-center gap-2.5 text-base font-bold mb-4" style={{ color: theme.text }}>
        <IconBadge icon={BarChart3} color={theme.warning} />
        Quick Stats
      </h3>
      <div className="space-y-1">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between py-2.5 px-4 rounded-xl transition-colors hover:bg-gray-50"
            style={{ color: theme.textSecondary }}
          >
            <span className="text-sm">{stat.label}</span>
            <span className="text-sm font-bold" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};