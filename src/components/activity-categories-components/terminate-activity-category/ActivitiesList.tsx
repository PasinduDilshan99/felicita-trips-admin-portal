"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Star, AlertCircle } from "lucide-react";
import {
  PrimaryActivity,
  OtherActivity,
} from "@/types/activity-category-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { activityBodyVariants, cardVariants, contentVariants, emptyVariants, headerVariants } from "@/app/animations/variants";

interface ActivitiesListProps {
  title: string;
  activities: (PrimaryActivity | OtherActivity)[];
  variant: "primary" | "secondary";
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  title,
  activities,
  variant,
}) => {
  const { theme } = useTheme();

  const getVariantColors = () => {
    if (variant === "primary") {
      return {
        icon: <Star size={14} />,
        color: theme.warning || "#f59e0b",
        bgColor: hexToRgba(theme.warning || "#f59e0b", 0.05),
        borderColor: hexToRgba(theme.warning || "#f59e0b", 0.3),
        badgeColor: theme.warning || "#f59e0b",
        badgeText: "Primary",
      };
    }
    return {
      icon: <Activity size={14} />,
      color: theme.accent,
      bgColor: hexToRgba(theme.accent, 0.05),
      borderColor: hexToRgba(theme.border, 0.8),
      badgeColor: theme.accent,
      badgeText: "Associated",
    };
  };

  const colors = getVariantColors();

  if (activities.length === 0) {
    return (
      <motion.div
        variants={emptyVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl overflow-hidden w-full"
        style={{
          background: hexToRgba(theme.border, 0.1),
          border: `1.5px dashed ${hexToRgba(theme.border, 0.5)}`,
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          {colors.icon}
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            {title}
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <AlertCircle
            size={24}
            className="mx-auto mb-2 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No {title.toLowerCase()} found
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: colors.bgColor,
        border: `1.5px solid ${colors.borderColor}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        <div className="flex items-center gap-2">
          {colors.icon}
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            {title} ({activities.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(colors.color, 0.1),
            color: colors.color,
            border: `1px solid ${hexToRgba(colors.color, 0.2)}`,
          }}
        >
          {colors.badgeText}
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4"
      >
        <div className="space-y-2">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.activityId}
              variants={activityBodyVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={idx}
              className="flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200"
              style={{
                background: hexToRgba(colors.color, 0.06),
                border: `1px solid ${hexToRgba(colors.color, 0.15)}`,
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: hexToRgba(colors.color, 0.15),
                  color: colors.color,
                }}
              >
                {variant === "primary" ? (
                  <Star size={13} />
                ) : (
                  <Activity size={13} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: theme.text }}
                >
                  {activity.activityName}
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Activity ID: {activity.activityId}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
