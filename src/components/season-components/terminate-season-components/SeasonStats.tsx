"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Thermometer,
  CloudRain,
  TrendingUp,
  Activity,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SeasonStatsProps, StatItem } from "@/types/season-types";
import { formatMonth } from "@/utils/commonFunctions";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const SeasonStats: React.FC<SeasonStatsProps> = ({ seasonDetails }) => {
  const { theme } = useTheme();

  const statItems: StatItem[] = [
    {
      label: "Months",
      value: `${formatMonth(seasonDetails.startMonth)} – ${formatMonth(seasonDetails.endMonth)}`,
      icon: <Calendar size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Temperature",
      value: `${seasonDetails.temperatureMin}°C – ${seasonDetails.temperatureMax}°C`,
      icon: <Thermometer size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Monsoon Type",
      value: seasonDetails.monsoonType || "N/A",
      icon: <CloudRain size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Peak Season",
      value: seasonDetails.isPeak ? "Yes" : "No",
      icon: <TrendingUp size={14} />,
      color: seasonDetails.isPeak ? theme.success : theme.textSecondary,
      formatter: (val) => val,
    },
    {
      label: "Display Order",
      value: seasonDetails.displayOrder,
      icon: <Calendar size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Activities",
      value: seasonDetails.activities.length,
      icon: <Activity size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Tours",
      value: seasonDetails.tours.length,
      icon: <MapPin size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: seasonDetails.seasonImages.length,
      icon: <ImageIcon size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: seasonDetails.status === 1 ? "Active" : "Inactive",
      icon: <AlertCircle size={14} />,
      color: seasonDetails.status === 1 ? theme.success : theme.error,
      formatter: (val) => val,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}
      >
        {statItems.map((item, i) => {
          const displayValue = item.formatter
            ? item.formatter(item.value)
            : item.value;

          return (
            <motion.div
              key={`${item.label}-${i}`}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              className="relative rounded-xl p-3 transition-all duration-200 cursor-pointer"
              style={{
                background: hexToRgba(item.color, 0.08),
                border: `1.5px solid ${hexToRgba(item.color, 0.2)}`,
                backdropFilter: "blur(0px)",
              }}
            >
              <div
                className="flex items-center gap-1.5"
                style={{ color: item.color, opacity: 0.85 }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-xs font-medium tracking-wide">
                  {item.label}
                </span>
              </div>

              <motion.p
                variants={valueVariants}
                className="text-base sm:text-lg font-bold mt-1.5 truncate"
                style={{ color: theme.text }}
                key={`value-${item.label}-${String(displayValue)}`}
                initial="hidden"
                animate="visible"
              >
                {displayValue}
              </motion.p>

              {/* Status indicator dot */}
              {item.label === "Status" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                  className="absolute top-2 right-2"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 0 2px ${hexToRgba(item.color, 0.2)}`,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
