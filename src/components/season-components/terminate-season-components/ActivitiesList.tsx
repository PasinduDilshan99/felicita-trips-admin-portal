"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, AlertCircle } from "lucide-react";
import { ActivitiesListProps } from "@/types/season-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  activityBodyVariants,
  cardVariants,
  contentVariants,
  emptyVariants,
  headerVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return theme.success;
      case "INACTIVE":
        return theme.warning || "#f59e0b";
      default:
        return theme.textSecondary;
    }
  };

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
          <Activity
            className="w-4 h-4"
            style={{ color: theme.textSecondary }}
          />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Season Activities
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <AlertCircle
            size={24}
            className="mx-auto mb-2 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No activities associated with this season
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
        background: hexToRgba(theme.success, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: theme.success }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Season Activities ({activities.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.error, 0.1),
            color: theme.error,
            border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
          }}
        >
          Will lose association
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
                background: hexToRgba(theme.success, 0.06),
                border: `1px solid ${hexToRgba(theme.success, 0.15)}`,
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: hexToRgba(theme.success, 0.15),
                  color: theme.success,
                }}
              >
                <Activity size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: theme.text }}
                  >
                    {activity.activityName}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: hexToRgba(
                        getStatusColor(activity.activityStatus),
                        0.1,
                      ),
                      color: getStatusColor(activity.activityStatus),
                    }}
                  >
                    {activity.activityStatus}
                  </span>
                </div>
                {activity.activityDescription && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    {activity.activityDescription}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
