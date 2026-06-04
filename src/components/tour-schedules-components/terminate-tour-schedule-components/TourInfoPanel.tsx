"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  Calendar,
  Info,
  Compass,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourInfoPanelProps } from "@/types/tour-schedule-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const TourInfoPanel: React.FC<TourInfoPanelProps> = ({
  scheduleDetails,
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
        <Compass className="w-4 h-4" style={{ color: theme.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Associated Tour
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Tour Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Tour Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.tourName}
          </motion.div>
        </motion.div>

        {/* Tour Description */}
        {scheduleDetails.tourDescription && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Info size={11} />
              Description
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs leading-relaxed break-words"
              style={{ color: theme.textSecondary }}
            >
              {scheduleDetails.tourDescription}
            </motion.div>
          </motion.div>
        )}

        {/* Duration & Season */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Clock size={11} />
              Duration
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.tourDuration} days
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Calendar size={11} />
              Season
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.season || "All seasons"}
            </motion.div>
          </div>
        </motion.div>

        {/* Locations */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <MapPin size={11} />
              Start Location
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.startLocation}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Navigation size={11} />
              End Location
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.endLocation}
            </motion.div>
          </div>
        </motion.div>

        {/* Coordinates */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Coordinates
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs font-mono"
            style={{ color: theme.textSecondary }}
          >
            {scheduleDetails.latitude?.toFixed(6)}°,{" "}
            {scheduleDetails.longitude?.toFixed(6)}°
          </motion.div>
        </motion.div>

        {/* Tour Status */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Tour Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.tourStatus === "ACTIVE"
                  ? theme.success
                  : theme.error,
                0.1,
              ),
              color:
                scheduleDetails.tourStatus === "ACTIVE"
                  ? theme.success
                  : theme.error,
              border: `1px solid ${
                scheduleDetails.tourStatus === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {scheduleDetails.tourStatus || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
