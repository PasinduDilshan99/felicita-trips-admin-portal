"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Palette, Hash, Clock, User, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BasicInfoPanelProps } from "@/types/package-type-types";
import {
  cardVariants,
  contentVariants,
  headerVariants,
  infoRowVariants,
  valueVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({
  packageTypeDetails,
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
        <Tag className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Package Type Information
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
            {packageTypeDetails.typeName}
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
            {packageTypeDetails.description || "No description provided"}
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
                  backgroundColor: packageTypeDetails.color || theme.primary,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {packageTypeDetails.color || "Default"}
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
                  backgroundColor:
                    packageTypeDetails.hoverColor || theme.accent,
                  borderColor: theme.border,
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {packageTypeDetails.hoverColor || "Default"}
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
                packageTypeDetails.status === "ACTIVE"
                  ? theme.success
                  : packageTypeDetails.status === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
                0.1,
              ),
              color:
                packageTypeDetails.status === "ACTIVE"
                  ? theme.success
                  : packageTypeDetails.status === "INACTIVE"
                    ? theme.warning || "#f59e0b"
                    : theme.error,
              border: `1px solid ${
                packageTypeDetails.status === "ACTIVE"
                  ? hexToRgba(theme.success, 0.3)
                  : packageTypeDetails.status === "INACTIVE"
                    ? hexToRgba(theme.warning || "#f59e0b", 0.3)
                    : hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {packageTypeDetails.status || "Unknown"}
          </motion.div>
        </motion.div>

        {/* Audit Information */}
        <motion.div
          variants={infoRowVariants}
          className="pt-2 space-y-2 border-t"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <User size={10} />
                Created By
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {packageTypeDetails.createdByName} (ID:{" "}
                {packageTypeDetails.createdBy})
              </p>
            </div>
            <div>
              <p
                className="text-[10px] flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <Clock size={10} />
                Created At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(packageTypeDetails.createdAt)}
              </p>
            </div>
          </div>

          {packageTypeDetails.updatedByName && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: theme.textSecondary }}
                >
                  <User size={10} />
                  Updated By
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {packageTypeDetails.updatedByName}{" "}
                  {packageTypeDetails.updatedBy &&
                    `(ID: ${packageTypeDetails.updatedBy})`}
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
                  {formatDate(packageTypeDetails.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {packageTypeDetails.terminatedBy && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <User size={10} />
                  Terminated By
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {packageTypeDetails.terminatedBy}{" "}
                  {packageTypeDetails.terminatedBy &&
                    `(ID: ${packageTypeDetails.terminatedBy})`}
                </p>
              </div>
              <div>
                <p
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <Clock size={10} />
                  Terminated At
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {formatDate(packageTypeDetails.terminatedAt || "")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
