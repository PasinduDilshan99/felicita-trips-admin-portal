"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, ChevronDown, ChevronUp, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";
import { DESTINATION_CATEGORY_VIEW_DETAILS_URL } from "@/utils/urls";

interface Category {
  id: number;
  name: string;
  description?: string;
  isPrimary: boolean;
}

interface CategoriesListProps {
  categories: Category[];
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const INITIAL_DISPLAY_COUNT = 3;
  const hasMoreCategories = categories.length > INITIAL_DISPLAY_COUNT;
  const displayedCategories = showAll ? categories : categories.slice(0, INITIAL_DISPLAY_COUNT);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    router.push(`${DESTINATION_CATEGORY_VIEW_DETAILS_URL}/${categoryId}?name=${encodeURIComponent(categoryName)}`);
  };

  return (
    <motion.div
      className="rounded-2xl border shadow-sm p-5"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <h3 className="flex items-center gap-2.5 text-base font-bold mb-4" style={{ color: theme.text }}>
        <IconBadge icon={Layers} color={theme.success} />
        Categories
        <motion.span
          className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: `${theme.success}15`, color: theme.success }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 300 }}
        >
          {categories.length}
        </motion.span>
      </h3>

      {/* Category Items */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {displayedCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{
                duration: 0.28,
                delay: index < INITIAL_DISPLAY_COUNT ? 0 : index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative p-2.5 rounded-xl border cursor-pointer overflow-hidden"
              style={{
                backgroundColor: cat.isPrimary ? `${theme.primary}10` : theme.background,
                borderColor: hoveredId === cat.id
                  ? cat.isPrimary ? `${theme.primary}50` : `${theme.primary}25`
                  : cat.isPrimary ? `${theme.primary}30` : theme.border,
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: hoveredId === cat.id
                  ? `0 4px 16px ${theme.primary}12`
                  : "none",
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleCategoryClick(cat.id, cat.name)}
              onHoverStart={() => setHoveredId(cat.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {/* Shimmer layer on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ backgroundColor: `${theme.primary}06` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === cat.id ? 1 : 0 }}
                transition={{ duration: 0.18 }}
              />

              <div className="relative flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: theme.text }}>
                  {cat.name}
                </span>

                <div className="flex items-center gap-1.5">
                  {cat.isPrimary && (
                    <motion.span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Primary
                    </motion.span>
                  )}

                  {/* Arrow icon that slides in on hover */}
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{
                      opacity: hoveredId === cat.id ? 1 : 0,
                      x: hoveredId === cat.id ? 0 : -4,
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <ArrowUpRight size={13} style={{ color: theme.primary }} />
                  </motion.div>
                </div>
              </div>

              {cat.description && (
                <p className="relative text-xs mt-1" style={{ color: theme.textSecondary }}>
                  {cat.description}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {categories.length === 0 && (
          <motion.p
            className="text-sm italic text-center py-3"
            style={{ color: theme.textSecondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No categories assigned
          </motion.p>
        )}

        {/* Show More / Less button */}
        {hasMoreCategories && (
          <motion.button
            layout
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full cursor-pointer mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: `${theme.primary}10`,
              color: theme.primary,
              border: `1px solid ${theme.primary}20`,
            }}
            whileHover={{
              backgroundColor: `${theme.primary}16`,
              borderColor: `${theme.primary}40`,
              y: -1,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ChevronDown size={16} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.span
                key={showAll ? "less" : "more"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {showAll
                  ? "Show Less"
                  : `Show More (${categories.length - INITIAL_DISPLAY_COUNT} more)`}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};