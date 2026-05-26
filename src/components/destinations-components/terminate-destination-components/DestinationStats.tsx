"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ImageIcon, Clock, DollarSign, Shield } from "lucide-react";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface DestinationStatsProps {
  destinationDetails: SingleDestinationResponse;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const DestinationStats: React.FC<DestinationStatsProps> = ({
  destinationDetails,
}) => {
  const { theme } = useTheme();
  const { formatPrice, currentCurrency } = useCurrency();

  const stats = {
    totalActivities: destinationDetails.activities.length,
    totalImages: destinationDetails.images.length,
    avgDuration:
      destinationDetails.activities.length > 0
        ? Math.round(
            destinationDetails.activities.reduce(
              (sum, a) => sum + a.durationHours,
              0,
            ) / destinationDetails.activities.length,
          )
        : 0,
    minPrice:
      destinationDetails.activities.length > 0
        ? Math.min(...destinationDetails.activities.map((a) => a.priceLocal))
        : 0,
  };

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

  const getDisplayValue = (item: StatItem): string | number => {
    if (item.formatter) {
      return item.formatter(item.value);
    }
    return item.value;
  };

  const statItems: StatItem[] = [
    {
      label: "Activities",
      value: stats.totalActivities,
      icon: <Activity size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: stats.totalImages,
      icon: <ImageIcon size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Avg Duration",
      value: `${stats.avgDuration}h`,
      icon: <Clock size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Min Price",
      value: stats.minPrice,
      icon: <DollarSign size={14} />,
      color: theme.success,
      formatter: (val) => {
        const numVal = typeof val === "number" ? val : 0;
        return numVal > 0 ? formatPrice(numVal) : "—";
      },
    },
    {
      label: "Status",
      value: destinationDetails.statusName || "Unknown",
      icon: <Shield size={14} />,
      color: getStatusColor(destinationDetails.statusName),
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
      <style>{`
        @keyframes statPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .stat-value-update {
          animation: statPulse 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

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
              {getDisplayValue(item)}
            </motion.p>

            {/* Show currency indicator for price */}
            {item.label === "Min Price" && stats.minPrice > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1 mt-1"
              >
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {currentCurrency.code}
                </span>
              </motion.div>
            )}

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
