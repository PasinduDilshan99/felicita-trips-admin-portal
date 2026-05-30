"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Info, Tag, Calendar } from "lucide-react";
import { BasicInfoPanelProps } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  tourDetails,
}) => {
  const { theme } = useTheme();

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
        <Info className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Basic Information
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
            {tourDetails.tourName}
          </motion.div>
        </motion.div>

        {/* Description */}
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
            {tourDetails.tourDescription || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Start & End Locations */}
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
              {tourDetails.startLocation}
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
              {tourDetails.endLocation}
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
            style={{ color: theme.text }}
          >
            {tourDetails.latitude?.toFixed(6)}°,{" "}
            {tourDetails.longitude?.toFixed(6)}°
          </motion.div>
        </motion.div>

        {/* Tour Type & Category */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Tag size={11} />
              Tour Type
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {tourDetails.tourTypeName || "N/A"}
            </motion.div>
            {tourDetails.tourTypeDescription && (
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {tourDetails.tourTypeDescription}
              </p>
            )}
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Tag size={11} />
              Category
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {tourDetails.tourCategoryName || "N/A"}
            </motion.div>
            {tourDetails.tourCategoryDescription && (
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {tourDetails.tourCategoryDescription}
              </p>
            )}
          </div>
        </motion.div>

        {/* Season */}
        <motion.div variants={infoRowVariants}>
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
            {tourDetails.seasonName || "All seasons"}
          </motion.div>
          {tourDetails.seasonDescription && (
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {tourDetails.seasonDescription}
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
