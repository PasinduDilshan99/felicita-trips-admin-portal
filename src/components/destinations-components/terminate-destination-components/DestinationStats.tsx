"use client";

import React from "react";
import { Activity, ImageIcon, Clock, DollarSign, Shield, MapPin, Tag, Globe } from "lucide-react";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface DestinationStatsProps {
  destinationDetails: SingleDestinationResponse;
}

export const DestinationStats: React.FC<DestinationStatsProps> = ({ destinationDetails }) => {
  const { theme } = useTheme();

  const stats = {
    totalActivities: destinationDetails.activities.length,
    totalImages: destinationDetails.images.length,
    avgDuration: destinationDetails.activities.length > 0
      ? Math.round(
          destinationDetails.activities.reduce((sum, a) => sum + a.durationHours, 0) /
          destinationDetails.activities.length
        )
      : 0,
    minPrice: destinationDetails.activities.length > 0
      ? Math.min(...destinationDetails.activities.map((a) => a.priceLocal))
      : 0,
  };

  const statItems = [
    { label: "Activities", value: stats.totalActivities, icon: <Activity size={14} />, color: theme.success },
    { label: "Images", value: stats.totalImages, icon: <ImageIcon size={14} />, color: theme.accent },
    { label: "Avg Duration", value: `${stats.avgDuration}h`, icon: <Clock size={14} />, color: theme.warning },
    { label: "Min Price", value: `LKR ${(stats.minPrice ?? 0).toLocaleString()}`, icon: <DollarSign size={14} />, color: theme.success },
    { label: "Status", value: destinationDetails.statusName, icon: <Shield size={14} />, color: theme.error },
  ];

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
      {statItems.map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-3 transition-all duration-200 hover:scale-105"
          style={{
            background: hexToRgba(item.color, 0.1),
            border: `1.5px solid ${hexToRgba(item.color, 0.2)}`,
          }}
        >
          <div className="flex items-center gap-1.5" style={{ color: item.color, opacity: 0.8 }}>
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </div>
          <p className="text-base font-bold mt-1" style={{ color: theme.text }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};