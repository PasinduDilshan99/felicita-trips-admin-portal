"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  Star,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DestinationCategoryStatsProps,
  StatItem,
} from "@/types/destination-category-types";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const DestinationCategoryStats: React.FC<
  DestinationCategoryStatsProps
> = ({ categoryDetails }) => {
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

  const primaryDestinationsCount = categoryDetails.destinations.filter(
    (dest) => dest.primary,
  ).length;

  const statItems: StatItem[] = [
    {
      label: "Total Destinations",
      value: categoryDetails.destinations.length,
      icon: <MapPin size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Primary Destinations",
      value: primaryDestinationsCount,
      icon: <Star size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: categoryDetails.images.length,
      icon: <ImageIcon size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: categoryDetails.categoryStatus || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(categoryDetails.categoryStatus),
      formatter: (val) => val,
    },
    {
      label: "Created At",
      value: formatDate(categoryDetails.createdAt),
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
      formatter: (val) => val,
    },
    {
      label: "Updated At",
      value: formatDate(categoryDetails.updatedAt),
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
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
