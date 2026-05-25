// components/tour-schedules-components/terminate-tour-schedule-components/BasicInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Calendar, Clock, FileText, Info, AlertCircle, User } from "lucide-react";
import { TourScheduleDetails } from "@/types/tour-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";

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
  scheduleDetails: TourScheduleDetails;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ scheduleDetails }) => {
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
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Schedule Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.tourScheduleName}
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <FileText size={11} />
            Description
          </p>
          <motion.div
            variants={valueVariants}
            className="text-xs leading-relaxed break-words"
            style={{ color: theme.textSecondary }}
          >
            {scheduleDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Special Note */}
        {scheduleDetails.specialNote && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Info size={11} />
              Special Note
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs italic"
              style={{ color: theme.warning || "#f59e0b" }}
            >
              {scheduleDetails.specialNote}
            </motion.div>
          </motion.div>
        )}

        {/* Assign Message */}
        {scheduleDetails.assignMessage && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Info size={11} />
              Assign Message
            </p>
            <motion.div
              variants={valueVariants}
              className="text-xs"
              style={{ color: theme.textSecondary }}
            >
              {scheduleDetails.assignMessage}
            </motion.div>
          </motion.div>
        )}

        {/* Status */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Schedule Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                scheduleDetails.scheduleStatus === "ACTIVE" ? theme.success :
                scheduleDetails.scheduleStatus === "INACTIVE" ? theme.warning || "#f59e0b" :
                theme.error,
                0.1
              ),
              color: scheduleDetails.scheduleStatus === "ACTIVE" ? theme.success :
                     scheduleDetails.scheduleStatus === "INACTIVE" ? theme.warning || "#f59e0b" :
                     theme.error,
              border: `1px solid ${
                scheduleDetails.scheduleStatus === "ACTIVE" ? hexToRgba(theme.success, 0.3) :
                scheduleDetails.scheduleStatus === "INACTIVE" ? hexToRgba(theme.warning || "#f59e0b", 0.3) :
                hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {scheduleDetails.scheduleStatus || "Unknown"}
          </motion.div>
        </motion.div>

        {/* Audit Info */}
        <motion.div variants={infoRowVariants} className="pt-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Created At</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>{formatDate(scheduleDetails.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px]" style={{ color: theme.textSecondary }}>Updated At</p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>{formatDate(scheduleDetails.updatedAt)}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};