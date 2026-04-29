"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Eye, Edit, ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryQuickActionsProps {
  categoryId: number;
  categoryName: string;
  color: string;
  hoverColor: string;
  onEdit: () => void;
  onBack: () => void;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.3, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const shineVariants: Variants = {
  rest: { x: "-100%" },
  hover: {
    x: "100%",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const CategoryQuickActions = ({
  categoryId,
  categoryName,
  color,
  hoverColor,
  onEdit,
  onBack,
}: CategoryQuickActionsProps) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const themeColor = color || theme.primary;
  const themeHoverColor = hoverColor || theme.accent;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1.5px solid ${theme.border}`,
      }}
    >
      {/* Color accent bar */}
      <motion.div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${themeColor}, ${themeColor}60, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 mb-5"
        >
          <motion.div
            variants={iconVariants}
            initial="rest"
            whileHover="hover"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: hexToRgba(themeColor, 0.12),
            }}
          >
            <Eye className="w-4 h-4" style={{ color: themeColor }} />
          </motion.div>
          <h2
            className="text-lg sm:text-xl font-semibold"
            style={{ color: theme.text }}
          >
            Quick Actions
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: themeColor, opacity: 0.6 }} />
          </motion.div>
        </motion.div>

        {/* Category Info Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mb-5 p-3 rounded-xl text-center"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(themeColor, 0.08)}, ${hexToRgba(themeColor, 0.03)})`,
            border: `1px solid ${hexToRgba(themeColor, 0.15)}`,
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
            Currently viewing
          </p>
          <p className="text-sm font-semibold" style={{ color: themeColor }}>
            {categoryName}
          </p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary, opacity: 0.6 }}>
            ID: {categoryId}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {/* Edit Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onEdit}
            className="cursor-pointer relative w-full py-3 px-4 rounded-xl font-medium shadow-md overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, ${themeHoverColor})`,
              color: "#fff",
            }}
          >
            {/* Shine effect */}
            <motion.span
              variants={shineVariants}
              initial="rest"
              whileHover="hover"
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              <motion.div
                variants={iconVariants}
                initial="rest"
                whileHover="hover"
              >
                <Edit className="w-4 h-4" />
              </motion.div>
              Edit Category
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
            </span>
          </motion.button>

          {/* Back Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onBack}
            className="cursor-pointer w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
            style={{
              border: `1.5px solid ${theme.border}`,
              color: theme.textSecondary,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(themeColor, 0.05);
              e.currentTarget.style.borderColor = themeColor;
              e.currentTarget.style.color = themeColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.color = theme.textSecondary;
            }}
          >
            <motion.div
              variants={iconVariants}
              initial="rest"
              whileHover="hover"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
            Back to Categories
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};

export { CategoryQuickActions };