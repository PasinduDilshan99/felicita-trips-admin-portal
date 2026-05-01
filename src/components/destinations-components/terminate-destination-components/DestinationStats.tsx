"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Activity, ImageIcon, Clock, DollarSign, Shield, MapPin, Tag, Globe } from "lucide-react";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

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

export const DestinationStats: React.FC<DestinationStatsProps> = ({ destinationDetails }) => {
  const { theme } = useTheme();
  const { formatPrice, currentCurrency } = useCurrency();

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

  // Format status display
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

  // Helper function to format display value
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
        const numVal = typeof val === 'number' ? val : 0;
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
            <div className="flex items-center gap-1.5" style={{ color: item.color, opacity: 0.85 }}>
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-xs font-medium tracking-wide">{item.label}</span>
            </div>
            
            <motion.p
              variants={valueVariants}
              className="text-base sm:text-lg font-bold mt-1.5 truncate"
              style={{ color: theme.text }}
              key={typeof item.value === 'number' ? item.value : item.value.toString()}
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