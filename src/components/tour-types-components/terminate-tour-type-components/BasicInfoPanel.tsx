"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Palette, Hash, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BasicInfoPanelProps } from "@/types/tour-type-types";
import { cardVariants, contentVariants, headerVariants, infoRowVariants, valueVariants } from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  tourTypeDetails,
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
        <Tag className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Tour Type Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Type Name */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1 flex items-center gap-1"
            style={{ color: theme.textSecondary }}
          >
            <Hash size={11} />
            Type Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {tourTypeDetails.typeName}
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
            {tourTypeDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Colors */}
        <motion.div
          variants={infoRowVariants}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Palette size={11} />
              Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{
                  backgroundColor: tourTypeDetails.color || theme.primary,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {tourTypeDetails.color || "Default"}
              </span>
            </div>
          </div>
          <div>
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Palette size={11} />
              Hover Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{
                  backgroundColor: tourTypeDetails.hoverColor || theme.accent,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {tourTypeDetails.hoverColor || "Default"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status Badge */}
        <motion.div variants={infoRowVariants}>
          <p
            className="text-xs font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            Current Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                tourTypeDetails.status === "ACTIVE"
                  ? theme.success
                  : tourTypeDetails.status === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
                0.1,
              ),
              color:
                tourTypeDetails.status === "ACTIVE"
                  ? theme.success
                  : tourTypeDetails.status === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
              border: `1px solid ${
                tourTypeDetails.status === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : tourTypeDetails.status === "INACTIVE"
                    ? hexToRgba(theme.warning || "#f59e0b", 0.3)
                    : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {tourTypeDetails.status || "Unknown"}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
