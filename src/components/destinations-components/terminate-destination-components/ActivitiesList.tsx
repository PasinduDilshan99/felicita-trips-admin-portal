"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Activity, ChevronDown, Clock, DollarSign, Users, Calendar, Tag, Eye } from "lucide-react";
import Link from "next/link";
import { Activity as ActivityType } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ACTIVITY_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const activityCardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const headerVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: { duration: 0.15 } },
  tap: { scale: 0.99, transition: { duration: 0.1 } },
};

const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.22,
      ease: "easeIn",
    },
  },
};

const infoRowVariants: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
  hover: {
    scale: 1.05,
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

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

interface ActivitiesListProps {
  activities: ActivityType[];
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ activities }) => {
  const { theme } = useTheme();
  const { formatPrice, currentCurrency } = useCurrency();
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);

  const toggleActivity = (activityId: number) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Format time display (remove seconds if present)
  const formatTimeRange = (from: string, to: string): string => {
    const formatTime = (time: string) => {
      if (!time) return "Not set";
      return time.length > 5 ? time.substring(0, 5) : time;
    };
    return `${formatTime(from)}–${formatTime(to)}`;
  };

  if (activities.length === 0) {
    return (
      <motion.div
        variants={emptyVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-8 rounded-xl"
        style={{
          backgroundColor: hexToRgba(theme.border, 0.1),
          border: `1.5px dashed ${hexToRgba(theme.border, 0.5)}`,
        }}
      >
        <Activity size={32} style={{ color: theme.textSecondary, opacity: 0.5 }} className="mx-auto mb-2" />
        <p className="text-xs" style={{ color: theme.textSecondary }}>No activities found</p>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary, opacity: 0.7 }}>Activities will appear here once added</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2.5"
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .activity-content {
          animation: slideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {activities.map((activity) => {
        const isExpanded = expandedActivities.includes(activity.activityId);
        
        return (
          <motion.div
            key={activity.activityId}
            variants={activityCardVariants}
            layout
            className="rounded-xl overflow-hidden"
            style={{
              border: `1.5px solid ${
                isExpanded
                  ? hexToRgba(theme.warning || theme.accent, 0.5)
                  : hexToRgba(theme.border, 0.8)
              }`,
              background: theme.surface,
              transition: "border-color 0.2s ease",
            }}
          >
            {/* Header - Clickable */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => toggleActivity(activity.activityId)}
                variants={headerVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="flex-1 flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                style={{
                  cursor: "pointer",
                }}
              >
                <motion.div
                  className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    background: isExpanded
                      ? `linear-gradient(135deg, ${theme.warning || theme.accent}, ${theme.warning || theme.accent})`
                      : hexToRgba(theme.warning || theme.accent, 0.1),
                    color: isExpanded ? "#fff" : (theme.warning || theme.accent),
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Activity size={13} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <span 
                    className="text-sm font-medium truncate block" 
                    style={{ color: theme.text }}
                  >
                    {activity.activityName}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span 
                      className="text-xs flex items-center gap-1"
                      style={{ color: theme.textSecondary }}
                    >
                      <Clock size={10} />
                      {activity.durationHours}h
                    </span>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.border }} />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: theme.warning || theme.accent }}
                    >
                      {formatPrice(activity.priceLocal)}
                    </span>
                  </div>
                </div>

                <motion.div
                  variants={chevronVariants}
                  animate={isExpanded ? "open" : "closed"}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{ color: theme.warning || theme.accent }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              {/* Navigation Button */}
              <Link
                href={`${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activity.activityId}`}
                className="flex-shrink-0 mr-2"
              >
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    color: theme.primary,
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                  }}
                  title="View activity details"
                >
                  <Eye size={16} />
                </motion.button>
              </Link>
            </div>

            {/* Expanded Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="px-4 pb-4"
                  style={{ borderTop: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.2)}` }}
                >
                  <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                    {/* Duration */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Clock size={11} />
                        Duration
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.text }}>
                        {activity.durationHours} hours
                      </p>
                    </motion.div>

                    {/* Local Price - Formatted with currency */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <DollarSign size={11} />
                        Local Price
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.success || theme.text }}>
                        {formatPrice(activity.priceLocal)}
                      </p>
                    </motion.div>

                    {/* Foreign Price - Formatted with currency */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <DollarSign size={11} />
                        Foreign Price
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.success || theme.text }}>
                        {formatPrice(activity.priceForeigners)}
                      </p>
                    </motion.div>

                    {/* Group Size */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Users size={11} />
                        Group Size
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.text }}>
                        {activity.minParticipate}–{activity.maxParticipate} people
                      </p>
                    </motion.div>

                    {/* Available Time */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Clock size={11} />
                        Available
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.text }}>
                        {formatTimeRange(activity.availableFrom, activity.availableTo)}
                      </p>
                    </motion.div>

                    {/* Season */}
                    <motion.div variants={infoRowVariants}>
                      <p className="text-xs mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Calendar size={11} />
                        Season
                      </p>
                      <p className="text-xs font-semibold" style={{ color: theme.text }}>
                        {activity.season || "All seasons"}
                      </p>
                    </motion.div>
                  </div>

                  {/* Categories */}
                  {activity.activityCategories?.length > 0 && (
                    <motion.div variants={infoRowVariants} className="mt-3">
                      <p className="text-xs mb-1.5 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                        <Tag size={11} />
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {activity.activityCategories.map((c, idx) => (
                          <motion.span
                            key={c}
                            variants={categoryVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            custom={idx}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: hexToRgba(theme.warning || theme.accent, 0.1),
                              color: theme.warning || theme.accent,
                              border: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.25)}`,
                            }}
                          >
                            {c}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Description */}
                  {activity.activityDescription && (
                    <motion.div variants={infoRowVariants} className="mt-3">
                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                        {activity.activityDescription}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};