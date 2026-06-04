"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BasicInfoPanelProps } from "@/types/activity-schedule-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  scheduleDetails,
}) => {
  const { theme } = useTheme();

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
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
        <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Schedule Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Schedule Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Schedule Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.activityScheduleName}
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
            {scheduleDetails.scheduleDescription || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Date Range */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Calendar size={11} />
              Start Date
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatDate(scheduleDetails.scheduleAssumeStartDate)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Calendar size={11} />
              End Date
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatDate(scheduleDetails.scheduleAssumeEndDate)}
            </motion.div>
          </div>
        </motion.div>

        {/* Duration Range */}
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
              Duration Start
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.scheduleDurationHoursStart} hours
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Clock size={11} />
              Duration End
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.scheduleDurationHoursEnd} hours
            </motion.div>
          </div>
        </motion.div>

        {/* Special Note */}
        {scheduleDetails.scheduleSpecialNote && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Info size={11} />
              Special Note
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs italic"
              style={{ color: theme.textSecondary }}
            >
              {scheduleDetails.scheduleSpecialNote}
            </motion.div>
          </motion.div>
        )}

        {/* Status */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Schedule Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.scheduleStatus === "ACTIVE"
                  ? theme.success
                  : scheduleDetails.scheduleStatus === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
                0.1,
              ),
              color:
                scheduleDetails.scheduleStatus === "ACTIVE"
                  ? theme.success
                  : scheduleDetails.scheduleStatus === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
              border: `1px solid ${
                scheduleDetails.scheduleStatus === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : scheduleDetails.scheduleStatus === "INACTIVE"
                    ? hexToRgba(theme.warning || "#f59e0b", 0.3)
                    : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {scheduleDetails.scheduleStatus || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
