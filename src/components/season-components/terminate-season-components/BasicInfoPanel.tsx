"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Hash, TrendingUp } from "lucide-react";
import { BasicInfoPanelProps } from "@/types/season-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";
import { formatDate, formatMonth } from "@/utils/commonFunctions";

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
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
          Season Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Season Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Hash size={11} />
            Season Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {seasonDetails.name}
          </motion.div>
        </motion.div>

        {/* Standard Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Standard Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm"
            style={{ color: theme.text }}
          >
            {seasonDetails.standardName}
          </motion.div>
        </motion.div>

        {/* Local Name */}
        {seasonDetails.localName && (
          <motion.div variants={infoRowVariants}>
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Local Name
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {seasonDetails.localName}
            </motion.div>
          </motion.div>
        )}

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
            {seasonDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Month Range */}
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
              Start Month
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatMonth(seasonDetails.startMonth)}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Calendar size={11} />
              End Month
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {formatMonth(seasonDetails.endMonth)}
            </motion.div>
          </div>
        </motion.div>

        {/* Peak Season & Display Order */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <TrendingUp size={11} />
              Peak Season
            </p>
            <motion.div
              variants={valueVariants}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                background: hexToRgba(
                  seasonDetails.isPeak ? theme.success : theme.textSecondary,
                  0.1,
                ),
                color: seasonDetails.isPeak
                  ? theme.success
                  : theme.textSecondary,
              }}
            >
              {seasonDetails.isPeak ? "Yes" : "No"}
            </motion.div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Hash size={11} />
              Display Order
            </p>
            <motion.div
              variants={valueVariants}
              className="text-sm"
              style={{ color: theme.text }}
            >
              {seasonDetails.displayOrder}
            </motion.div>
          </div>
        </motion.div>

        {/* Audit Info */}
        <motion.div
          variants={infoRowVariants}
          className="pt-2 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock size={10} />
                Created At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(seasonDetails.createdAt)}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock size={10} />
                Updated At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(seasonDetails.updatedAt)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
