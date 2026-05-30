"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Image as ImageIcon,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { ActivityCategoryDetails } from "@/types/activity-category-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface ActivityCategoryStatsProps {
  categoryDetails: ActivityCategoryDetails;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const ActivityCategoryStats: React.FC<ActivityCategoryStatsProps> = ({
  categoryDetails,
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

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const statItems: StatItem[] = [
    {
      label: "Primary Activities",
      value: categoryDetails.primaryActivities.length,
      icon: <Users size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Other Activities",
      value: categoryDetails.otherActivities.length,
      icon: <Users size={14} />,
      color: theme.accent,
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
      value: categoryDetails.status || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(categoryDetails.status),
      formatter: (val) => val,
    },
    {
      label: "Created By",
      value: categoryDetails.createdByName,
      icon: <User size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Created At",
      value: formatDate(categoryDetails.createdAt),
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
