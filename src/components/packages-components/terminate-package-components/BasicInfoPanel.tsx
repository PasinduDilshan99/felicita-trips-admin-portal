// components/packages-components/terminate-package-components/BasicInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Package, Calendar, Clock, Info, Users, DollarSign, Percent } from "lucide-react";
import { TourPackage } from "@/types/package-types";
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

interface BasicInfoPanelProps {
  packageDetails: TourPackage;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ packageDetails }) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const formatDate = (date: string): string => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.primary, 0.04),
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
        <Package className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Package Information
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
            {packageDetails.packageName}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Info size={11} />
            Description
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs leading-relaxed break-words"
            style={{ color: theme.textSecondary }}
          >
            {packageDetails.packageDescription || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Package Type */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Package Type
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {packageDetails.packageTypeName || "N/A"}
          </motion.div>
          {packageDetails.packageTypeDescription && (
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {packageDetails.packageTypeDescription}
            </p>
          )}
        </motion.div>

        {/* Date Range */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Calendar size={11} />
              Start Date
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatDate(packageDetails.startDate)}
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Calendar size={11} />
              End Date
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatDate(packageDetails.endDate)}
            </motion.div>
          </div>
        </motion.div>

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
              style={{ color: theme.success }}
            >
              {formatPrice(packageDetails.totalPrice)}
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Percent size={11} />
              Discount
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.warning || "#f59e0b" }}
            >
              {packageDetails.discountPercentage}%
            </motion.div>
          </div>
        </motion.div>

        {/* Price Per Person & Capacity */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
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
              {formatPrice(packageDetails.pricePerPerson)}
            </motion.div>
          </div>
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
              {packageDetails.minPersonCount}–{packageDetails.maxPersonCount} people
            </motion.div>
          </div>
        </motion.div>

        {/* Colors */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md"
                style={{ backgroundColor: packageDetails.color }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {packageDetails.color}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Hover Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md"
                style={{ backgroundColor: packageDetails.hoverColor }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {packageDetails.hoverColor}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Meta Info */}
        <motion.div variants={infoRowVariants} className="pt-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Created</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(packageDetails.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Created By</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                ID: {packageDetails.createdBy}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};