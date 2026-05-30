"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { RequirementsListProps } from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, contentVariants, emptyVariants, headerVariants, requirementsVariants } from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 1:
        return theme.success;
      case 0:
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <CheckCircle size={14} />;
      case 0:
        return <AlertCircle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  if (requirements.length === 0) {
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
          <CheckCircle
            className="w-4 h-4"
            style={{ color: theme.textSecondary }}
          />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Requirements
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No special requirements
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
          <CheckCircle className="w-4 h-4" style={{ color: theme.success }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Requirements ({requirements.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.success, 0.1),
            color: theme.success,
            border: `1px solid ${hexToRgba(theme.success, 0.2)}`,
          }}
        >
          Will be removed
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4"
      >
        <div className="space-y-3">
          {requirements.map((req, idx) => (
            <motion.div
              key={req.id}
              variants={requirementsVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={idx}
              className="flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200"
              style={{
                background: hexToRgba(getStatusColor(req.status), 0.08),
                border: `1px solid ${hexToRgba(getStatusColor(req.status), 0.2)}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: hexToRgba(getStatusColor(req.status), 0.15),
                  color: getStatusColor(req.status),
                }}
              >
                {getStatusIcon(req.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: getStatusColor(req.status) }}
                  >
                    {req.name}
                  </span>
                  {req.value && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(getStatusColor(req.status), 0.15),
                        color: getStatusColor(req.status),
                      }}
                    >
                      {req.value}
                    </span>
                  )}
                </div>
                {req.description && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.textSecondary }}
                  >
                    {req.description}
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
