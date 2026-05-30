"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Calendar, Clock, MapPin, FileText } from "lucide-react";
import { Activity as ActivityType } from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

interface BasicInfoPanelProps {
  activityDetails: ActivityType;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  activityDetails,
}) => {
  const { theme } = useTheme();

  const formatTimeRange = (from: string, to: string): string => {
    const formatTime = (time: string) => {
      if (!time) return "Not set";
      return time.length > 5 ? time.substring(0, 5) : time;
    };
    return `${formatTime(from)} – ${formatTime(to)}`;
  };

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
        <Activity className="w-4 h-4" style={{ color: theme.primary }} />
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
        {/* Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Activity Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {activityDetails.name}
          </motion.div>
        </motion.div>

        {/* Destination */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Destination
          </p>
          <motion.div
            variants={valueVariants}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: theme.text }}
          >
            <MapPin size={12} style={{ color: theme.primary }} />
            {activityDetails.destinationName}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <FileText size={11} />
            Description
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs leading-relaxed break-words"
            style={{ color: theme.textSecondary }}
          >
            {activityDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Duration & Season Row */}
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
              {activityDetails.duration_hours} hours
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
              {activityDetails.seasonName || "All seasons"}
            </motion.div>
          </div>
        </motion.div>

        {/* Available Time Range */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Clock size={11} />
            Available Hours
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-mono"
            style={{ color: theme.text }}
          >
            {formatTimeRange(
              activityDetails.available_from,
              activityDetails.available_to,
            )}
          </motion.div>
        </motion.div>

        {/* Dates */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Created
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              {formatDate(activityDetails.created_at)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Updated
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              {formatDate(activityDetails.updated_at)}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
