"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  DollarSign,
  Users,
  Activity,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  ActivityScheduleStatsProps,
  StatItem,
} from "@/types/activity-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const ActivityScheduleStats: React.FC<ActivityScheduleStatsProps> = ({
  scheduleDetails,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

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

  const formatTime = (time: string): string => {
    if (!time) return "N/A";
    return time.length > 5 ? time.substring(0, 5) : time;
  };

  const statItems: StatItem[] = [
    {
      label: "Duration Range",
      value: `${scheduleDetails.scheduleDurationHoursStart}h – ${scheduleDetails.scheduleDurationHoursEnd}h`,
      icon: <Clock size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Local Price",
      value: scheduleDetails.priceLocal,
      icon: <DollarSign size={14} />,
      color: theme.success,
      formatter: (val) => formatPrice(val as number),
    },
    {
      label: "Foreign Price",
      value: scheduleDetails.priceForeigners,
      icon: <DollarSign size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => formatPrice(val as number),
    },
    {
      label: "Group Size",
      value: `${scheduleDetails.minParticipate}–${scheduleDetails.maxParticipate}`,
      icon: <Users size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Activity Duration",
      value: `${scheduleDetails.durationHours}h`,
      icon: <Activity size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Available Hours",
      value: `${formatTime(scheduleDetails.availableFrom)} – ${formatTime(scheduleDetails.availableTo)}`,
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
      formatter: (val) => val,
    },
    {
      label: "Categories",
      value: scheduleDetails.activityCategoryDtos.length,
      icon: <MapPin size={14} />,
      color: theme.success,
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
      label: "Activity Status",
      value: scheduleDetails.activityStatus || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(scheduleDetails.activityStatus),
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
                item.label === "Activity Status") && (
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
