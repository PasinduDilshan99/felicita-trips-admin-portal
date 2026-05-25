// components/activity-schedules-components/terminate-activity-schedule-components/PackageInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Package, Calendar, DollarSign, Users, AlertCircle } from "lucide-react";
import { ActivityScheduleDetails } from "@/types/activity-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const infoRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const valueVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

interface PackageInfoPanelProps {
  scheduleDetails: ActivityScheduleDetails;
}

export const PackageInfoPanel: React.FC<PackageInfoPanelProps> = ({ scheduleDetails }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const formatDate = (date: string | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (!scheduleDetails.packageId || scheduleDetails.packageId === 0) {
    return null;
  }

  const calculateDiscountedPrice = (price: number | null, discount: number | null): number | null => {
    if (!price || !discount) return price;
    return price - (price * discount / 100);
  };

  const discountedPrice = calculateDiscountedPrice(scheduleDetails.totalPrice, scheduleDetails.discountPercentage);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.success, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <Package className="w-4 h-4" style={{ color: theme.success }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Associated Package
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Package Name */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Package Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.packageName || "N/A"}
          </motion.div>
        </motion.div>

        {/* Package Description */}
        {scheduleDetails.packageDescription && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Description
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs leading-relaxed break-words"
              style={{ color: theme.textSecondary }}
            >
              {scheduleDetails.packageDescription}
            </motion.div>
          </motion.div>
        )}

        {/* Pricing */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <DollarSign size={11} />
              Total Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              {scheduleDetails.totalPrice ? formatPrice(scheduleDetails.totalPrice) : "N/A"}
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <DollarSign size={11} />
              Discount
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.warning || "#f59e0b" }}
            >
              {scheduleDetails.discountPercentage ? `${scheduleDetails.discountPercentage}%` : "0%"}
            </motion.div>
          </div>
        </motion.div>

        {/* Discounted Price & Price Per Person */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <DollarSign size={11} />
              Discounted Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.success }}
            >
              {discountedPrice ? formatPrice(discountedPrice) : "N/A"}
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Users size={11} />
              Price Per Person
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.pricePerPerson ? formatPrice(scheduleDetails.pricePerPerson) : "N/A"}
            </motion.div>
          </div>
        </motion.div>

        {/* Group Size & Date Range */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Users size={11} />
              Group Size
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.minPersonCount}–{scheduleDetails.maxPersonCount} people
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Calendar size={11} />
              Date Range
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.packageScheduleStartDate && scheduleDetails.packageScheduleEndDate 
                ? `${formatDate(scheduleDetails.packageScheduleStartDate)} – ${formatDate(scheduleDetails.packageScheduleEndDate)}`
                : "Not specified"}
            </motion.div>
          </div>
        </motion.div>

        {/* Package Schedule Info */}
        {scheduleDetails.packageScheduleId > 0 && scheduleDetails.packageScheduleName && (
          <motion.div variants={infoRowVariants} className="pt-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
            <p className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>
              Package Schedule Reference
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>Schedule Name</p>
                <p className="text-xs" style={{ color: theme.text }}>{scheduleDetails.packageScheduleName}</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>Duration Range</p>
                <p className="text-xs" style={{ color: theme.text }}>
                  {scheduleDetails.packageScheduleDurationStart}h – {scheduleDetails.packageScheduleDurationEnd}h
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Package Status */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Package Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.packageStatus === "ACTIVE" ? theme.success : theme.error,
                0.1
              ),
              color: scheduleDetails.packageStatus === "ACTIVE" ? theme.success : theme.error,
            }}
          >
            {scheduleDetails.packageStatus || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};