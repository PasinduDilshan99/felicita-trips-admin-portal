"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tag, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import {
  cardVariants,
  categoryVariants,
  contentVariants,
  emptyVariants,
  headerVariants,
} from "@/app/animations/variants";
import { CategoriesListProps } from "@/types/activity-types";

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
}) => {
  const { theme } = useTheme();

  if (categories.length === 0) {
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
          <Tag className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Categories
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No categories assigned
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
        background: hexToRgba(theme.accent, 0.05),
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
        <Tag className="w-4 h-4" style={{ color: theme.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Categories ({categories.length})
        </h3>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              variants={categoryVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={idx}
              className="relative group"
            >
              <div
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: category.is_primary
                    ? `linear-gradient(135deg, ${theme.primary}, ${hexToRgba(theme.primary, 0.7)})`
                    : hexToRgba(theme.accent, 0.12),
                  color: category.is_primary ? "#fff" : theme.accent,
                  border: category.is_primary
                    ? "none"
                    : `1px solid ${hexToRgba(theme.accent, 0.3)}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  {category.is_primary && (
                    <Star size={12} className="text-yellow-300" />
                  )}
                  <span>{category.name}</span>
                </div>
              </div>
              {category.description && (
                <div
                  className="absolute left-0 top-full mt-1 px-2 py-1 rounded text-xs whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    color: theme.textSecondary,
                    boxShadow: `0 2px 8px ${hexToRgba(theme.text, 0.1)}`,
                  }}
                >
                  {category.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
