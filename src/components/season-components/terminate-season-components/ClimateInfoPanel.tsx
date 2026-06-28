"use client";

import React from "react";
import { motion } from "framer-motion";
import { Thermometer, CloudRain, Droplet, Sun, Cloud } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ClimateInfoPanelProps } from "@/types/season-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const ClimateInfoPanel: React.FC<ClimateInfoPanelProps> = ({
  seasonDetails,
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.accent, 0.05),
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
        <CloudRain className="w-4 h-4" style={{ color: theme.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Climate Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Temperature Range */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Thermometer size={11} />
            Temperature Range
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold"
            style={{ color: theme.warning || "#f59e0b" }}
          >
            {seasonDetails.temperatureMin}°C – {seasonDetails.temperatureMax}°C
          </motion.div>
        </motion.div>

        {/* Weather Summary */}
        {seasonDetails.weatherSummary && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Sun size={11} />
              Weather Summary
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {seasonDetails.weatherSummary}
            </motion.div>
          </motion.div>
        )}

        {/* Monsoon Type & Rainfall Pattern */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Cloud size={11} />
              Monsoon Type
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {seasonDetails.monsoonType || "N/A"}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Droplet size={11} />
              Rainfall Pattern
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {seasonDetails.rainfallPattern || "N/A"}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
