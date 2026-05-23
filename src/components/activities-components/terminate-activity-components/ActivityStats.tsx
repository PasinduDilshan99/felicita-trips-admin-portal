// components/activities-components/terminate-activity-components/ActivityStats.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Clock, DollarSign, Calendar, Users, Tag, ImageIcon, AlertCircle } from "lucide-react";
import { Activity } from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

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

interface ActivityStatsProps {
  activityDetails: Activity;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activityDetails }) => {
  const { theme } = useTheme();
  const { formatPrice, currentCurrency } = useCurrency();

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
      value: `${activityDetails.duration_hours}h`, 
      icon: <Clock size={14} />, 
      color: theme.primary,
      formatter: (val) => val,
    },
    { 
      label: "Local Price", 
      value: activityDetails.price_local, 
      icon: <DollarSign size={14} />, 
      color: theme.success,
      formatter: (val) => formatPrice(val as number),
    },
    { 
      label: "Foreign Price", 
      value: activityDetails.price_foreigners, 
      icon: <DollarSign size={14} />, 
      color: theme.warning || "#f59e0b",
      formatter: (val) => formatPrice(val as number),
    },
    { 
      label: "Group Size", 
      value: `${activityDetails.min_participate}–${activityDetails.max_participate}`, 
      icon: <Users size={14} />, 
      color: theme.accent,
      formatter: (val) => val,
    },
    { 
      label: "Images", 
      value: activityDetails.images.length, 
      icon: <ImageIcon size={14} />, 
      color: theme.primary,
      formatter: (val) => val,
    },
    { 
      label: "Status", 
      value: activityDetails.status || "Unknown", 
      icon: <AlertCircle size={14} />, 
      color: getStatusColor(activityDetails.status),
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
              {item.formatter ? item.formatter(item.value) : item.value}
            </motion.p>

            {/* Show currency indicator for price items */}
            {(item.label === "Local Price" || item.label === "Foreign Price") && 
             (item.label === "Local Price" ? activityDetails.price_local > 0 : activityDetails.price_foreigners > 0) && (
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