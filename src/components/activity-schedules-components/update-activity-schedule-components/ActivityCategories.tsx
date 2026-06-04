"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityCategoriesProps } from "@/types/activity-schedule-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

export const ActivityCategories: React.FC<ActivityCategoriesProps> = ({
  categories,
  expandedSections,
  onToggleSection,
}) => {
  const { theme } = useTheme();

  if (!categories || categories.length === 0) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("categories")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("categories")
            ? `${theme.primary}05`
            : "transparent",
          borderBottom: expandedSections.has("categories")
            ? `1px solid ${theme.border}`
            : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary,
            }}
          >
            <Tag className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Activity Categories
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Read-only category list ({categories.length} categories)
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            transform: expandedSections.has("categories")
              ? "rotate(180deg)"
              : "none",
            color: theme.textSecondary,
          }}
        />
      </button>

      <AnimatePresence>
        {expandedSections.has("categories") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-6"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}30`,
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {category.name}
                  {category.is_primary && (
                    <span className="text-yellow-500 text-xs ml-0.5">★</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
