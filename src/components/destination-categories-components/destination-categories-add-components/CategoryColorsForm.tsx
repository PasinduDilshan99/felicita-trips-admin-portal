"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Palette, Check, Copy, Eye, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryColorsFormProps {
  color: string;
  hoverColor: string;
  errors: Record<string, string>;
  onColorChange: (color: string) => void;
  onHoverColorChange: (color: string) => void;
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
};

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
};

const fieldGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
};

const gradientVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const copyButtonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const colorSwatchVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, rotate: 3, transition: { duration: 0.2 } },
};

const CategoryColorsForm: React.FC<CategoryColorsFormProps> = ({
  color,
  hoverColor,
  errors,
  onColorChange,
  onHoverColorChange,
}) => {
  const { theme } = useTheme();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const copyToClipboard = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const focusHandlers = (hasError: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${hasError ? theme.error : theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden w-full"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
          }}
        >
          <Palette className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h2
            className="text-sm sm:text-base font-semibold leading-tight truncate"
            style={{ color: theme.text }}
          >
            Brand Colors
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Choose colors for your category branding
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="ml-auto"
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary, opacity: 0.6 }} />
        </motion.div>
      </motion.div>

      {/* Fields */}
      <motion.div
        variants={fieldGroupVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-5 sm:py-6 space-y-5"
      >
        {/* Primary Color */}
        <motion.div variants={fieldVariants}>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: theme.textSecondary }}
          >
            Primary Color <span style={{ color: theme.error }}>*</span>
          </label>
          <div className="flex gap-3 items-center">
            <motion.div
              variants={colorSwatchVariants}
              initial="rest"
              whileHover="hover"
              className="relative"
            >
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2"
                style={{
                  borderColor: errors.color ? theme.error : theme.border,
                }}
              />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm font-mono"
                style={{
                  ...fieldBase,
                  borderColor: errors.color ? theme.error : theme.border,
                }}
                {...focusHandlers(!!errors.color)}
                placeholder="#000000"
              />
              <motion.button
                variants={copyButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => copyToClipboard(color, "primary")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all duration-200"
                style={{
                  backgroundColor: hexToRgba(theme.border, 0.5),
                }}
                title="Copy to clipboard"
              >
                <AnimatePresence mode="wait">
                  {copiedField === "primary" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: theme.success }} />
                    </motion.div>
                  ) : (
                    <Copy className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            {/* Color preview dot */}
            <motion.div
              className="w-8 h-8 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: theme.border,
              }}
              whileHover={{ scale: 1.1 }}
            />
          </div>
          {errors.color && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: theme.error }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.color}
            </motion.p>
          )}
        </motion.div>

        {/* Hover Color */}
        <motion.div variants={fieldVariants}>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: theme.textSecondary }}
          >
            Hover Color <span style={{ color: theme.error }}>*</span>
          </label>
          <div className="flex gap-3 items-center">
            <motion.div
              variants={colorSwatchVariants}
              initial="rest"
              whileHover="hover"
            >
              <input
                type="color"
                value={hoverColor}
                onChange={(e) => onHoverColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2"
                style={{
                  borderColor: errors.hoverColor ? theme.error : theme.border,
                }}
              />
            </motion.div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={hoverColor}
                onChange={(e) => onHoverColorChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm font-mono"
                style={{
                  ...fieldBase,
                  borderColor: errors.hoverColor ? theme.error : theme.border,
                }}
                {...focusHandlers(!!errors.hoverColor)}
                placeholder="#000000"
              />
              <motion.button
                variants={copyButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => copyToClipboard(hoverColor, "hover")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all duration-200"
                style={{
                  backgroundColor: hexToRgba(theme.border, 0.5),
                }}
                title="Copy to clipboard"
              >
                <AnimatePresence mode="wait">
                  {copiedField === "hover" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: theme.success }} />
                    </motion.div>
                  ) : (
                    <Copy className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <motion.div
              className="w-8 h-8 rounded-full border-2"
              style={{
                backgroundColor: hoverColor,
                borderColor: theme.border,
              }}
              whileHover={{ scale: 1.1 }}
            />
          </div>
          {errors.hoverColor && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mt-1.5 flex items-center gap-1"
              style={{ color: theme.error }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.hoverColor}
            </motion.p>
          )}
        </motion.div>

        {/* Gradient Preview */}
        <motion.div variants={fieldVariants} className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
            <label
              className="text-sm font-medium"
              style={{ color: theme.textSecondary }}
            >
              Gradient Preview
            </label>
          </div>
          <motion.div
            variants={gradientVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="h-16 rounded-xl overflow-hidden cursor-pointer shadow-md"
            style={{
              background: `linear-gradient(135deg, ${color}, ${hoverColor})`,
            }}
          >
            <motion.div
              className="w-full h-full flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: hexToRgba("#000", 0.3) }}
            >
              <span className="text-white text-xs font-mono">{color}</span>
              <span className="text-white text-xs">→</span>
              <span className="text-white text-xs font-mono">{hoverColor}</span>
            </motion.div>
          </motion.div>
          <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
            This gradient will be used for buttons and accents
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Import missing components
import { AlertCircle } from "lucide-react";

export default CategoryColorsForm;