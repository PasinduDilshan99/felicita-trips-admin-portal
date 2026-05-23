// components/activity-schedules-components/terminate-activity-schedule-components/TourInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { MapPin, Navigation, Clock, Calendar, AlertCircle } from "lucide-react";
import { ActivityScheduleDetails } from "@/types/activity-schedule-types";
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

interface TourInfoPanelProps {
  scheduleDetails: ActivityScheduleDetails;
}

export const TourInfoPanel: React.FC<TourInfoPanelProps> = ({ scheduleDetails }) => {
  const { theme } = useTheme();

  const formatDate = (date: string | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (!scheduleDetails.tourId || scheduleDetails.tourId === 0) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.warning || "#f59e0b", 0.05),
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
        <MapPin className="w-4 h-4" style={{ color: theme.warning || "#f59e0b" }} />
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
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Tour Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {scheduleDetails.tourName || "N/A"}
          </motion.div>
        </motion.div>

        {/* Tour Description */}
        {scheduleDetails.tourDescription && (
          <motion.div variants={infoRowVariants}>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
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

        {/* Duration & Locations */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
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
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <MapPin size={11} />
              Start Location
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.startLocation || "N/A"}
            </motion.div>
          </div>
        </motion.div>

        {/* End Location & Status */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Navigation size={11} />
              End Location
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {scheduleDetails.endLocation || "N/A"}
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
              Tour Status
            </p>
            <motion.div
              variants={valueVariants}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: hexToRgba(
                  scheduleDetails.tourStatus === "ACTIVE" ? theme.success : theme.error,
                  0.1
                ),
                color: scheduleDetails.tourStatus === "ACTIVE" ? theme.success : theme.error,
              }}
            >
              {scheduleDetails.tourStatus || "Unknown"}
            </motion.div>
          </div>
        </motion.div>

        {/* Tour Schedule Info */}
        {scheduleDetails.tourScheduleId > 0 && scheduleDetails.tourScheduleName && (
          <>
            <motion.div variants={infoRowVariants} className="pt-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
              <p className="text-xs font-semibold mb-2" style={{ color: theme.textSecondary }}>
                Tour Schedule Reference
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Schedule Name</p>
                  <p className="text-xs" style={{ color: theme.text }}>{scheduleDetails.tourScheduleName}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: theme.textSecondary }}>Duration Range</p>
                  <p className="text-xs" style={{ color: theme.text }}>
                    {scheduleDetails.tourScheduleDurationStart}h – {scheduleDetails.tourScheduleDurationEnd}h
                  </p>
                </div>
              </div>
              {scheduleDetails.tourScheduleStartDate && scheduleDetails.tourScheduleEndDate && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>Start Date</p>
                    <p className="text-xs" style={{ color: theme.text }}>{formatDate(scheduleDetails.tourScheduleStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: theme.textSecondary }}>End Date</p>
                    <p className="text-xs" style={{ color: theme.text }}>{formatDate(scheduleDetails.tourScheduleEndDate)}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};