"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  MapPin,
  Tag,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { StatItem, TourStatsProps } from "@/types/tour-types";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const TourStats: React.FC<TourStatsProps> = ({ tourDetails }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return theme.success;
      case "INACTIVE":
        return theme.error;
      case "PENDING":
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };

  const statItems: StatItem[] = [
    {
      label: "Duration",
      value: `${tourDetails.duration} days`,
      icon: <Clock size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Schedules",
      value: tourDetails.schedules.length,
      icon: <Calendar size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: tourDetails.images.length,
      icon: <ImageIcon size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Tour Type",
      value: tourDetails.tourTypeName || "N/A",
      icon: <Tag size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Category",
      value: tourDetails.tourCategoryName || "N/A",
      icon: <Tag size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: tourDetails.statusName || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(tourDetails.statusName),
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
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {statItems.map((item, i) => (
          <motion.div
            key={i}
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
              key={
                typeof item.value === "number"
                  ? item.value
                  : item.value.toString()
              }
              initial="hidden"
              animate="visible"
            >
              {item.formatter ? item.formatter(item.value) : item.value}
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
        ))}
      </div>
    </motion.div>
  );
};
