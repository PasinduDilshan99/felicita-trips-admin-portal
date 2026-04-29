"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { AlertTriangle, X, CheckCircle, Info, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info" | "success";
  isLoading?: boolean;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: EASE_IN },
  },
};

const dialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 },
  },
};

const closeButtonVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: 90,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 },
  },
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      duration: 0.4,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.25, ease: EASE_OUT },
  },
};

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <AlertCircle className="w-6 h-6" style={{ color: theme.error }} />
        );
      case "success":
        return (
          <CheckCircle className="w-6 h-6" style={{ color: theme.success }} />
        );
      case "info":
        return (
          <Info
            className="w-6 h-6"
            style={{ color: theme.secondary || theme.primary }}
          />
        );
      default:
        return (
          <AlertTriangle className="w-6 h-6" style={{ color: theme.warning }} />
        );
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return theme.error;
      case "success":
        return theme.success;
      case "info":
        return theme.secondary || theme.primary;
      default:
        return theme.warning;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "danger":
        return theme.error;
      case "success":
        return theme.success;
      case "info":
        return theme.secondary || theme.primary;
      default:
        return theme.warning;
    }
  };

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={!isLoading ? onClose : undefined}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Color accent bar */}
              <motion.div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${getHeaderColor()}, ${getHeaderColor()}60, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              />

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 sm:px-6 py-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {getIcon()}
                  </motion.div>
                  <motion.h3
                    className="text-base sm:text-lg font-semibold"
                    style={{ color: getHeaderColor() }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    {title}
                  </motion.h3>
                </div>
                {!isLoading && (
                  <motion.button
                    variants={closeButtonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={onClose}
                    className="cursor-pointer p-1.5 rounded-lg transition-colors"
                    style={{ color: theme.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.textSecondary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                )}
              </div>

              {/* Body */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="px-5 sm:px-6 py-4 sm:py-5"
              >
                <motion.p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {message}
                </motion.p>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="flex gap-3 px-5 sm:px-6 py-4 border-t"
                style={{ borderColor: theme.border }}
              >
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.borderColor = getHeaderColor();
                      e.currentTarget.style.backgroundColor = hexToRgba(
                        getHeaderColor(),
                        0.05,
                      );
                      e.currentTarget.style.color = getHeaderColor();
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = theme.background;
                    e.currentTarget.style.color = theme.textSecondary;
                  }}
                >
                  {cancelText}
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    backgroundColor: getButtonColor(),
                  }}
                >
                  {/* Shine effect on hover */}
                  {!isLoading && (
                    <motion.span
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%", transition: { duration: 0.6 } }}
                    />
                  )}
                  {isLoading ? (
                    <>
                      <motion.div
                        variants={spinnerVariants}
                        animate="animate"
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : type === "danger" ? (
                    <motion.span
                      variants={pulseVariants}
                      animate="animate"
                      className="flex items-center gap-2"
                    >
                      {confirmText}
                    </motion.span>
                  ) : (
                    confirmText
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
