// components/tour-categories-components/terminate-tour-category-components/BasicInfoPanel.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Tag, Info, Palette, Hash, Clock, User, Calendar, FileText } from "lucide-react";
import { TourCategoryDetails } from "@/types/tour-category-types";
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
  categoryDetails: TourCategoryDetails;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ categoryDetails }) => {
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
          Category Information
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {/* Category Name */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Hash size={11} />
            Category Name
          </p>
          <motion.div
            variants={valueVariants}
            className="text-sm font-semibold break-words"
            style={{ color: theme.text }}
          >
            {categoryDetails.categoryName}
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
            {categoryDetails.description || "No description provided"}
          </motion.div>
        </motion.div>

        {/* Colors */}
        <motion.div variants={infoRowVariants} className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Palette size={11} />
              Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{ 
                  backgroundColor: categoryDetails.color || theme.primary,
                  borderColor: theme.border
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {categoryDetails.color || "Default"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Palette size={11} />
              Hover Color
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border"
                style={{ 
                  backgroundColor: categoryDetails.hoverColor || theme.accent,
                  borderColor: theme.border
                }}
              />
              <span className="text-xs" style={{ color: theme.text }}>
                {categoryDetails.hoverColor || "Default"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status Badge */}
        <motion.div variants={infoRowVariants}>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Current Status
          </p>
          <motion.div
            variants={valueVariants}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: hexToRgba(
                categoryDetails.status === "ACTIVE" ? theme.success :
                categoryDetails.status === "INACTIVE" ? theme.warning || "#f59e0b" :
                theme.error,
                0.1
              ),
              color: categoryDetails.status === "ACTIVE" ? theme.success :
                     categoryDetails.status === "INACTIVE" ? theme.warning || "#f59e0b" :
                     theme.error,
              border: `1px solid ${
                categoryDetails.status === "ACTIVE" ? hexToRgba(theme.success, 0.3) :
                categoryDetails.status === "INACTIVE" ? hexToRgba(theme.warning || "#f59e0b", 0.3) :
                hexToRgba(theme.error, 0.3)
              }`,
            }}
          >
            {categoryDetails.status || "Unknown"}
          </motion.div>
        </motion.div>

        {/* Audit Information */}
        <motion.div variants={infoRowVariants} className="pt-2 space-y-2 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <User size={10} />
                Created By
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {categoryDetails.createdByName} (ID: {categoryDetails.createdBy})
              </p>
            </div>
            <div>
              <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Clock size={10} />
                Created At
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {formatDate(categoryDetails.createdAt)}
              </p>
            </div>
          </div>

          {categoryDetails.updatedByName && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                  <User size={10} />
                  Updated By
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {categoryDetails.updatedByName} {categoryDetails.updatedBy && `(ID: ${categoryDetails.updatedBy})`}
                </p>
              </div>
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.textSecondary }}>
                  <Clock size={10} />
                  Updated At
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {formatDate(categoryDetails.updatedAt)}
                </p>
              </div>
            </div>
          )}

          {categoryDetails.terminatedBy && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.error }}>
                  <User size={10} />
                  Terminated By
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {categoryDetails.terminatedBy} {categoryDetails.terminatedBy && `(ID: ${categoryDetails.terminatedBy})`}
                </p>
              </div>
              <div>
                <p className="text-[10px] flex items-center gap-1" style={{ color: theme.error }}>
                  <Clock size={10} />
                  Terminated At
                </p>
                <p className="text-xs" style={{ color: theme.error }}>
                  {formatDate(categoryDetails.terminatedAt || "")}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};