// components/package-types-components/terminate-package-type-components/PackageTypeStats.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Package, Image as ImageIcon, Calendar, User, AlertCircle, Palette, Hash, Star } from "lucide-react";
import { PackageTypeDetails } from "@/types/package-type-types";
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

interface PackageTypeStatsProps {
  packageTypeDetails: PackageTypeDetails;
}

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const PackageTypeStats: React.FC<PackageTypeStatsProps> = ({ packageTypeDetails }) => {
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

  // Safely get counts with fallbacks
  const totalPackages = packageTypeDetails?.totalPackages ?? 0;
  const imagesCount = packageTypeDetails?.images?.length ?? 0;
  const primaryPackagesCount = packageTypeDetails?.packageBasicDetails?.filter(pkg => pkg.primaryType).length ?? 0;
  const status = packageTypeDetails?.status ?? "Unknown";
  const createdByName = packageTypeDetails?.createdByName ?? "Unknown";
  const createdAt = packageTypeDetails?.createdAt ?? "";

  const statItems: StatItem[] = [
    {
      label: "Total Packages",
      value: totalPackages,
      icon: <Package size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Primary Packages",
      value: primaryPackagesCount,
      icon: <Star size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: imagesCount,
      icon: <ImageIcon size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: status,
      icon: <AlertCircle size={14} />,
      color: getStatusColor(status),
      formatter: (val) => val,
    },
    {
      label: "Created By",
      value: createdByName,
      icon: <User size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Created At",
      value: formatDate(createdAt),
      icon: <Calendar size={14} />,
      color: theme.textSecondary,
      formatter: (val) => val,
    },
  ];

  // Generate a unique key for each stat item
  const getItemKey = (item: StatItem, index: number): string => {
    const valueStr = typeof item.value === 'number' ? item.value.toString() : String(item.value);
    return `${item.label}-${valueStr}-${index}`;
  };

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
        {statItems.map((item, i) => {
          const displayValue = item.formatter ? item.formatter(item.value) : item.value;
          const valueKey = typeof displayValue === 'number' ? displayValue : String(displayValue);
          
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
                key={`value-${item.label}-${valueKey}`}
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