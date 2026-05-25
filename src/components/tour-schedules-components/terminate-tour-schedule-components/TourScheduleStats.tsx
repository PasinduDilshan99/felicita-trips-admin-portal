// components/tour-schedules-components/terminate-tour-schedule-components/TourScheduleStats.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Calendar, Clock, MapPin, Hotel, Tag, Hash, AlertCircle } from "lucide-react";
import { TourScheduleDetails } from "@/types/tour-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: EASE_OUT,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const valueVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
      delay: 0.1,
    },
  },
};

interface TourScheduleStatsProps {
  scheduleDetails: TourScheduleDetails;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const TourScheduleStats: React.FC<TourScheduleStatsProps> = ({ scheduleDetails }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return theme.success;
      case "INACTIVE":
        return theme.warning || "#f59e0b";
      case "TERMINATED":
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const statItems: StatItem[] = [
    {
      label: "Duration Range",
      value: `${scheduleDetails.durationStart}h – ${scheduleDetails.durationEnd}h`,
      icon: <Clock size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Date Range",
      value: `${formatDate(scheduleDetails.assumeStartDate)} – ${formatDate(scheduleDetails.assumeEndDate)}`,
      icon: <Calendar size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Categories",
      value: scheduleDetails.categories.length,
      icon: <Tag size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Types",
      value: scheduleDetails.types.length,
      icon: <Hash size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Accommodations",
      value: scheduleDetails.accommodations.length,
      icon: <Hotel size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: scheduleDetails.images.length,
      icon: <MapPin size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Schedule Status",
      value: scheduleDetails.scheduleStatus || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(scheduleDetails.scheduleStatus),
      formatter: (val) => val,
    },
    {
      label: "Tour Status",
      value: scheduleDetails.tourStatus || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(scheduleDetails.tourStatus),
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
          const displayValue = item.formatter ? item.formatter(item.value) : item.value;
          
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
              <div className="flex items-center gap-1.5" style={{ color: item.color, opacity: 0.85 }}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
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
              {(item.label === "Schedule Status" || item.label === "Tour Status") && (
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