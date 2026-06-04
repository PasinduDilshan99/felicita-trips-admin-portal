"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Percent,
  Users,
  Calendar,
  Gift,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PackageStatsProps } from "@/types/package-types";
import {
  containerVariants,
  statCardVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export const PackageStats: React.FC<PackageStatsProps> = ({
  packageDetails,
}) => {
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

  const calculateDiscountedPrice = (
    price: number,
    discount: number,
  ): number => {
    return price - (price * discount) / 100;
  };

  const discountedPrice = calculateDiscountedPrice(
    packageDetails.totalPrice,
    packageDetails.discountPercentage,
  );

  const statItems: StatItem[] = [
    {
      label: "Total Price",
      value: packageDetails.totalPrice,
      icon: <DollarSign size={14} />,
      color: theme.success,
      formatter: (val) => formatPrice(val as number),
    },
    {
      label: "Discounted Price",
      value: discountedPrice,
      icon: <DollarSign size={14} />,
      color: theme.primary,
      formatter: (val) => formatPrice(val as number),
    },
    {
      label: "Discount",
      value: `${packageDetails.discountPercentage}%`,
      icon: <Percent size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Price Per Person",
      value: packageDetails.pricePerPerson,
      icon: <Users size={14} />,
      color: theme.accent,
      formatter: (val) => formatPrice(val as number),
    },
    {
      label: "Capacity",
      value: `${packageDetails.minPersonCount}–${packageDetails.maxPersonCount}`,
      icon: <Users size={14} />,
      color: theme.primary,
      formatter: (val) => val,
    },
    {
      label: "Schedules",
      value: packageDetails.schedules.length,
      icon: <Calendar size={14} />,
      color: theme.warning || "#f59e0b",
      formatter: (val) => val,
    },
    {
      label: "Features",
      value: packageDetails.features.length,
      icon: <Gift size={14} />,
      color: theme.success,
      formatter: (val) => val,
    },
    {
      label: "Images",
      value: packageDetails.images.length,
      icon: <Gift size={14} />,
      color: theme.accent,
      formatter: (val) => val,
    },
    {
      label: "Status",
      value: packageDetails.packageStatus || "Unknown",
      icon: <AlertCircle size={14} />,
      color: getStatusColor(packageDetails.packageStatus),
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

            {/* Show currency indicator for price items */}
            {(item.label === "Total Price" ||
              item.label === "Discounted Price" ||
              item.label === "Price Per Person") &&
              (item.label === "Total Price"
                ? packageDetails.totalPrice > 0
                : true) && (
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
