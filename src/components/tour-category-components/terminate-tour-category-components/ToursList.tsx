// components/tour-categories-components/terminate-tour-category-components/ToursList.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPin, Navigation, Clock, Star, Calendar, ChevronDown } from "lucide-react";
import { TourCategoryTourReference } from "@/types/tour-category-types";
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
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
};

const tourCardVariants: Variants = {
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

const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const detailVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 12,
    transition: {
      duration: 0.25,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
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

interface ToursListProps {
  tours: TourCategoryTourReference[];
  primaryCategory?: boolean;
}

export const ToursList: React.FC<ToursListProps> = ({ tours, primaryCategory = false }) => {
  const { theme } = useTheme();
  const [expandedTours, setExpandedTours] = useState<number[]>([]);

  const toggleTour = (tourId: number) => {
    setExpandedTours((prev) =>
      prev.includes(tourId)
        ? prev.filter((id) => id !== tourId)
        : [...prev, tourId]
    );
  };

  if (tours.length === 0) {
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
          <MapPin className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Associated Tours
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>No tours associated with this category</p>
        </div>
      </motion.div>
    );
  }

  // Separate primary and secondary tours if needed
  const primaryTours = tours.filter(t => t.primaryCategory);
  const secondaryTours = tours.filter(t => !t.primaryCategory);
  
  const displayTours = primaryCategory ? primaryTours : tours;

  if (displayTours.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.warning || theme.accent, 0.05),
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
          {primaryCategory ? <Star className="w-4 h-4" style={{ color: theme.warning || "#f59e0b" }} /> : <MapPin className="w-4 h-4" style={{ color: theme.warning || theme.accent }} />}
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            {primaryCategory ? "Primary Tours" : "Associated Tours"} ({displayTours.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.warning || theme.accent, 0.1),
            color: theme.warning || theme.accent,
            border: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.2)}`,
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
        className="px-4 py-4 space-y-2.5"
      >
        {displayTours.map((tour) => {
          const isExpanded = expandedTours.includes(tour.tourId);

          return (
            <motion.div
              key={tour.tourId}
              variants={tourCardVariants}
              layout
              className="rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.25)}`,
                background: theme.surface,
              }}
            >
              {/* Header - Clickable */}
              <motion.button
                onClick={() => toggleTour(tour.tourId)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer"
                whileHover={{ backgroundColor: hexToRgba(theme.warning || theme.accent, 0.05) }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {tour.primaryCategory && (
                      <Star size={12} style={{ color: theme.warning || "#f59e0b" }} />
                    )}
                    <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                      {tour.tourName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs flex items-center gap-1" style={{ color: theme.textSecondary }}>
                      <Clock size={10} />
                      {tour.duration} days
                    </span>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.border }} />
                    <span className="text-xs" style={{ color: theme.textSecondary }}>
                      {tour.startLocation} → {tour.endLocation}
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

              {/* Expanded Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    variants={detailVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-3 pb-3"
                    style={{ borderTop: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.15)}` }}
                  >
                    <div className="grid gap-2 mt-2">
                      {tour.description && (
                        <div className="flex items-start gap-2">
                          <p className="text-xs" style={{ color: theme.textSecondary }}>
                            {tour.description}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px]" style={{ color: theme.textSecondary }}>Season</p>
                          <p className="text-xs" style={{ color: theme.text }}>{tour.season || "All seasons"}</p>
                        </div>
                        <div>
                          <p className="text-[10px]" style={{ color: theme.textSecondary }}>Status</p>
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              background: hexToRgba(
                                tour.status === "ACTIVE" ? theme.success : theme.error,
                                0.1
                              ),
                              color: tour.status === "ACTIVE" ? theme.success : theme.error,
                            }}
                          >
                            {tour.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t" style={{ borderColor: hexToRgba(theme.border, 0.5) }}>
                        <div>
                          <p className="text-[10px]" style={{ color: theme.textSecondary }}>Coordinates</p>
                          <p className="text-[10px] font-mono" style={{ color: theme.textSecondary }}>
                            {tour.latitude?.toFixed(4)}°, {tour.longitude?.toFixed(4)}°
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px]" style={{ color: theme.textSecondary }}>Tour ID</p>
                          <p className="text-xs" style={{ color: theme.textSecondary }}>#{tour.tourId}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};