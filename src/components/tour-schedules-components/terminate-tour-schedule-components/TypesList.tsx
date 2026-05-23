// components/tour-schedules-components/terminate-tour-schedule-components/TypesList.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Hash, Star } from "lucide-react";
import { TourScheduleType } from "@/types/tour-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
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

const typeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: { duration: 0.15 },
  },
};

const emptyVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

interface TypesListProps {
  types: TourScheduleType[];
}

export const TypesList: React.FC<TypesListProps> = ({ types }) => {
  const { theme } = useTheme();

  if (types.length === 0) {
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
          <Hash className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Tour Types
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>No types assigned</p>
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
        background: hexToRgba(theme.warning || "#f59e0b", 0.05),
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
          <Hash className="w-4 h-4" style={{ color: theme.warning || "#f59e0b" }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Tour Types ({types.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.error, 0.1),
            color: theme.error,
            border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
          }}
        >
          Will lose association
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4"
      >
        <div className="flex flex-wrap gap-2">
          {types.map((type, idx) => (
            <motion.div
              key={type.typeId}
              variants={typeVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={idx}
              className="relative group"
            >
              <div
                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: type.primaryType 
                    ? `linear-gradient(135deg, ${theme.primary}, ${hexToRgba(theme.primary, 0.7)})`
                    : hexToRgba(theme.warning || "#f59e0b", 0.12),
                  color: type.primaryType ? "#fff" : (theme.warning || "#f59e0b"),
                  border: type.primaryType 
                    ? "none"
                    : `1px solid ${hexToRgba(theme.warning || "#f59e0b", 0.3)}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  {type.primaryType && <Star size={12} className="text-yellow-300" />}
                  <span>{type.typeName}</span>
                </div>
              </div>
              {type.description && (
                <div
                  className="absolute left-0 top-full mt-1 px-2 py-1 rounded text-xs whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    color: theme.textSecondary,
                    boxShadow: `0 2px 8px ${hexToRgba(theme.text, 0.1)}`,
                  }}
                >
                  {type.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};