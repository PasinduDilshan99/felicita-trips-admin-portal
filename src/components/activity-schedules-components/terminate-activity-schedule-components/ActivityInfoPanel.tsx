"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Clock, DollarSign, Users, MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ActivityInfoPanelProps } from "@/types/activity-schedule-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const ActivityInfoPanel: React.FC<ActivityInfoPanelProps> = ({
  scheduleDetails,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const formatTime = (time: string): string => {
    if (!time) return "N/A";
    return time.length > 5 ? time.substring(0, 5) : time;
  };

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
        <Activity className="w-4 h-4" style={{ color: theme.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Associated Activity
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Activity Name */}
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
            {scheduleDetails.activityName}
          </motion.div>
        </motion.div>

        {/* Activity Description */}
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
            {scheduleDetails.activityDescription || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Destination */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <MapPin size={11} />
            Destination
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {scheduleDetails.destinationName}
          </motion.div>
        </motion.div>

        {/* Season */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Season
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {scheduleDetails.season || "All seasons"}
          </motion.div>
        </motion.div>

        {/* Activity Duration & Available Hours */}
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
              {scheduleDetails.durationHours} hours
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Clock size={11} />
              Available Hours
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatTime(scheduleDetails.availableFrom)} –{" "}
              {formatTime(scheduleDetails.availableTo)}
            </motion.div>
          </div>
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
              Local Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.success }}
            >
              {formatPrice(scheduleDetails.priceLocal)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <DollarSign size={11} />
              Foreign Price
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm font-semibold"
              style={{ color: theme.warning || "#f59e0b" }}
            >
              {formatPrice(scheduleDetails.priceForeigners)}
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
            {scheduleDetails.minParticipate}–{scheduleDetails.maxParticipate}{" "}
            people
          </motion.div>
        </motion.div>

        {/* Activity Status */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Activity Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.activityStatus === "ACTIVE"
                  ? theme.success
                  : scheduleDetails.activityStatus === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
                0.1,
              ),
              color:
                scheduleDetails.activityStatus === "ACTIVE"
                  ? theme.success
                  : scheduleDetails.activityStatus === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
              border: `1px solid ${
                scheduleDetails.activityStatus === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : scheduleDetails.activityStatus === "INACTIVE"
                    ? hexToRgba(theme.warning || "#f59e0b", 0.3)
                    : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {scheduleDetails.activityStatus || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
