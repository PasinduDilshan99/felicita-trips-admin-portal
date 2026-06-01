"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  contentVariants,
  emptyVariants,
  featureVariants,
  headerVariants,
} from "@/app/animations/variants";
import { FeaturesListProps } from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";

export const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
  const { theme } = useTheme();

  if (features.length === 0) {
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
          <Gift className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Features
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No features added
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
          <Gift className="w-4 h-4" style={{ color: theme.success }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Features ({features.length})
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
          {features.map((feature, idx) => (
            <motion.div
              key={feature.featureId}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={idx}
              className="flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200"
              style={{
                background: hexToRgba(feature.color || theme.success, 0.08),
                border: `1px solid ${hexToRgba(feature.color || theme.success, 0.2)}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: hexToRgba(feature.color || theme.success, 0.15),
                  color: feature.color || theme.success,
                }}
              >
                <CheckCircle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: feature.color || theme.success }}
                  >
                    {feature.featureName}
                  </span>
                  {feature.featureValue && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(
                          feature.color || theme.success,
                          0.15,
                        ),
                        color: feature.color || theme.success,
                      }}
                    >
                      {feature.featureValue}
                    </span>
                  )}
                </div>
                {feature.featureDescription && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.textSecondary }}
                  >
                    {feature.featureDescription}
                  </p>
                )}
                {feature.specialNote && (
                  <div className="flex items-start gap-1 mt-1">
                    <Info
                      size={10}
                      style={{ color: theme.textSecondary, marginTop: 1 }}
                    />
                    <p
                      className="text-[10px]"
                      style={{ color: theme.textSecondary }}
                    >
                      {feature.specialNote}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
