"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { AlertTriangle, MapPin, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { DestinationForTerminate } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.18, ease: EASE_IN },
  },
};

const modalVariants: Variants = {
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

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const loadingIconVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

interface TerminationModalProps {
  isOpen: boolean;
  selectedDestination: DestinationForTerminate | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TerminationModal: React.FC<TerminationModalProps> = ({
  isOpen,
  selectedDestination,
  loading,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Only blur, no background color, with cursor pointer */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 cursor-pointer"
            style={{
              backdropFilter: "blur(0px)",
              backgroundColor: "transparent",
            }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: theme.surface,
                boxShadow: `0 24px 64px ${hexToRgba(theme.text, 0.25)}`,
                border: `1.5px solid ${hexToRgba(theme.error, 0.4)}`,
              }}
            >
              {/* Header */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="px-4 sm:px-6 py-5 flex items-center gap-3 sm:gap-4"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.12)} 0%, ${hexToRgba(theme.error, 0.05)} 100%)`,
                  borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.25)}`,
                }}
              >
                <motion.div
                  variants={itemVariants}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.error}, ${theme.error}CC)`,
                    color: "#fff",
                    boxShadow: `0 4px 12px ${hexToRgba(theme.error, 0.3)}`,
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertTriangle size={18} className="sm:w-5 sm:h-5" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-base sm:text-lg font-bold" style={{ color: theme.error }}>
                    Confirm Termination
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: hexToRgba(theme.error, 0.8) }}>
                    This action cannot be reversed
                  </p>
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="px-4 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  You are about to permanently terminate:
                </motion.p>

                {/* Destination Card - Added cursor pointer */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer"
                  style={{
                    background: hexToRgba(theme.error, 0.06),
                    border: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                  whileHover={{
                    scale: 1.01,
                    borderColor: hexToRgba(theme.error, 0.35),
                    transition: { duration: 0.15 },
                  }}
                  onClick={() => !loading && onClose()}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <MapPin size={14} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: theme.text }}>
                      {selectedDestination?.destinationName}
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      ID · {selectedDestination?.destinationId}
                    </p>
                  </div>
                </motion.div>

                {/* Warning Box - Not clickable, no cursor pointer */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl"
                  style={{
                    background: hexToRgba(theme.error, 0.06),
                    border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <AlertCircle
                    size={14}
                    style={{ color: theme.error, marginTop: 2, flexShrink: 0 }}
                  />
                  <p className="text-xs leading-relaxed" style={{ color: theme.error }}>
                    All activities and images linked to this destination will be permanently deleted.
                    <br />
                    <strong>This cannot be undone.</strong>
                  </p>
                </motion.div>
              </motion.div>

              {/* Actions */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="px-4 sm:px-6 pb-4 sm:pb-5 flex flex-col sm:flex-row gap-3"
                style={{ borderTop: `1px solid ${hexToRgba(theme.error, 0.15)}`, paddingTop: "16px" }}
              >
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: theme.background,
                    border: `1.5px solid ${theme.border}`,
                    color: theme.textSecondary,
                  }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${theme.error}, ${theme.error}CC)`,
                    color: "#fff",
                    boxShadow: loading ? "none" : `0 4px 12px ${hexToRgba(theme.error, 0.35)}`,
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        variants={loadingIconVariants}
                        animate="animate"
                        className="flex items-center justify-center"
                      >
                        <Loader2 size={16} />
                      </motion.div>
                      <span>Terminating...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Confirm Termination</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Footer Note - Not clickable */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                className="text-center text-xs pb-5"
                style={{ color: theme.textSecondary }}
              >
                By confirming, you acknowledge that all associated data will be permanently deleted.
              </motion.p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};