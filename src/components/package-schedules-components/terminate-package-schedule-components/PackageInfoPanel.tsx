"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, Users, Percent, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { PackageInfoPanelProps } from "@/types/package-schedule-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const PackageInfoPanel: React.FC<PackageInfoPanelProps> = ({
  scheduleDetails,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const calculateDiscountedPrice = (
    price: number,
    discount: number,
  ): number => {
    return price - (price * discount) / 100;
  };

  const discountedPrice = calculateDiscountedPrice(
    scheduleDetails.totalPrice,
    scheduleDetails.discountPercentage,
  );

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
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Package Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.packageName}
          </motion.div>
        </motion.div>

        {/* Package Description */}
        {scheduleDetails.packageDescription && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
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

        {/* Package Type */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Package Type
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {scheduleDetails.packageTypeName}
          </motion.div>
          {scheduleDetails.packageTypeDescription && (
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {scheduleDetails.packageTypeDescription}
            </p>
          )}
        </motion.div>

        {/* Pricing */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <DollarSign size={11} />
              Total Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.text }}
            >
              {formatPrice(scheduleDetails.totalPrice)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Percent size={11} />
              Discount
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.warning || "#f59e0b" }}
            >
              {scheduleDetails.discountPercentage}%
            </motion.div>
          </div>
        </motion.div>

        {/* Discounted Price & Price Per Person */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <DollarSign size={11} />
              Discounted Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.success }}
            >
              {formatPrice(discountedPrice)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Users size={11} />
              Price Per Person
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatPrice(scheduleDetails.pricePerPerson)}
            </motion.div>
          </div>
        </motion.div>

        {/* Group Size */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Users size={11} />
            Group Size
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {scheduleDetails.minPersonCount}–{scheduleDetails.maxPersonCount}{" "}
            people
          </motion.div>
        </motion.div>

        {/* Colors */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Palette size={11} />
              Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{
                  backgroundColor: scheduleDetails.color || theme.primary,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {scheduleDetails.color || "Default"}
              </span>
            </div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Palette size={11} />
              Hover Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{
                  backgroundColor: scheduleDetails.hoverColor || theme.accent,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {scheduleDetails.hoverColor || "Default"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Package Status */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Package Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.packageStatus === "ACTIVE"
                  ? theme.success
                  : theme.error,
                0.1,
              ),
              color:
                scheduleDetails.packageStatus === "ACTIVE"
                  ? theme.success
                  : theme.error,
              border: `1px solid ${
                scheduleDetails.packageStatus === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {scheduleDetails.packageStatus || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
