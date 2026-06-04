"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Hotel,
  Tag,
  Hash,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { StatItem, TourScheduleStatsProps } from "@/types/tour-schedule-types";
import { formatDate } from "@/utils/commonFunctions";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const TourScheduleStats: React.FC<TourScheduleStatsProps> = ({
  scheduleDetails,
}) => {
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
              {(item.label === "Schedule Status" ||
                item.label === "Tour Status") && (
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
