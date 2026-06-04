"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel,
  Utensils,
  Coffee,
  Sun,
  Moon,
  ChevronDown,
  Car,
  Bed,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { AccommodationsListProps } from "@/types/tour-schedule-types";
import {
  accommodationCardVariants,
  cardVariants,
  chevronVariants,
  contentVariants,
  detailVariants,
  EASE_OUT,
  emptyVariants,
  headerVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const AccommodationsList: React.FC<AccommodationsListProps> = ({
  accommodations,
}) => {
  const { theme } = useTheme();
  const [expandedAccommodations, setExpandedAccommodations] = useState<
    number[]
  >([]);

  const toggleAccommodation = (accommodationId: number) => {
    setExpandedAccommodations((prev) =>
      prev.includes(accommodationId)
        ? prev.filter((id) => id !== accommodationId)
        : [...prev, accommodationId],
    );
  };

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (accommodations.length === 0) {
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
          <Hotel className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Accommodations
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No accommodations configured
          </p>
        </div>
      </motion.div>
    );
  }

  const sortedAccommodations = [...accommodations].sort(
    (a, b) => a.day - b.day,
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.primary, 0.05),
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
          <Hotel className="w-4 h-4" style={{ color: theme.primary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Accommodations ({accommodations.length})
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
          Will be deleted
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-3"
      >
        {sortedAccommodations.map((accommodation) => {
          const isExpanded = expandedAccommodations.includes(
            accommodation.accommodationId,
          );

          return (
            <motion.div
              key={accommodation.accommodationId}
              variants={accommodationCardVariants}
              layout
              className="rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                background: theme.surface,
              }}
            >
              {/* Header - Clickable */}
              <motion.button
                onClick={() =>
                  toggleAccommodation(accommodation.accommodationId)
                }
                className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer"
                whileHover={{ backgroundColor: hexToRgba(theme.primary, 0.05) }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background: hexToRgba(theme.primary, 0.15),
                        color: theme.primary,
                      }}
                    >
                      {accommodation.day}
                    </span>
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: theme.text }}
                    >
                      Day {accommodation.day} Accommodation
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-8">
                    {accommodation.hotelName && (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <Hotel size={10} />
                        {accommodation.hotelName}
                      </span>
                    )}
                    {accommodation.transportName && (
                      <>
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: theme.border }}
                        />
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <Car size={10} />
                          {accommodation.transportName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <motion.div
                  variants={chevronVariants}
                  animate={isExpanded ? "open" : "closed"}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{ color: theme.primary }}
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
                    style={{
                      borderTop: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                    }}
                  >
                    <div className="grid gap-3 mt-2">
                      {/* Meals */}
                      <div className="grid grid-cols-2 gap-2">
                        {accommodation.breakfast && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Sun
                              size={12}
                              style={{ color: theme.warning || "#f59e0b" }}
                            />
                            <span style={{ color: theme.textSecondary }}>
                              Breakfast
                            </span>
                            {accommodation.breakfastDescription && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.breakfastDescription})
                              </span>
                            )}
                          </div>
                        )}
                        {accommodation.lunch && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Utensils
                              size={12}
                              style={{ color: theme.success }}
                            />
                            <span style={{ color: theme.textSecondary }}>
                              Lunch
                            </span>
                            {accommodation.lunchDescription && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.lunchDescription})
                              </span>
                            )}
                          </div>
                        )}
                        {accommodation.dinner && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Moon size={12} style={{ color: theme.primary }} />
                            <span style={{ color: theme.textSecondary }}>
                              Dinner
                            </span>
                            {accommodation.dinnerDescription && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.dinnerDescription})
                              </span>
                            )}
                          </div>
                        )}
                        {accommodation.morningTea && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Coffee size={12} style={{ color: theme.accent }} />
                            <span style={{ color: theme.textSecondary }}>
                              Morning Tea
                            </span>
                            {accommodation.morningTeaDescription && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.morningTeaDescription})
                              </span>
                            )}
                          </div>
                        )}
                        {accommodation.eveningTea && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Coffee size={12} style={{ color: theme.accent }} />
                            <span style={{ color: theme.textSecondary }}>
                              Evening Tea
                            </span>
                            {accommodation.eveningTeaDescription && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.eveningTeaDescription})
                              </span>
                            )}
                          </div>
                        )}
                        {accommodation.snacks && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Utensils
                              size={12}
                              style={{ color: theme.warning || "#f59e0b" }}
                            />
                            <span style={{ color: theme.textSecondary }}>
                              Snacks
                            </span>
                            {accommodation.snackNote && (
                              <span
                                className="text-[10px]"
                                style={{ color: theme.textSecondary }}
                              >
                                ({accommodation.snackNote})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Other Notes */}
                      {accommodation.otherNotes && (
                        <div className="flex items-start gap-1.5">
                          <Bed
                            size={12}
                            style={{ color: theme.textSecondary, marginTop: 1 }}
                          />
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {accommodation.otherNotes}
                          </p>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div
                        className="grid grid-cols-2 gap-2 pt-1 border-t"
                        style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                      >
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Created
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            {formatDate(accommodation.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Updated
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            {formatDate(accommodation.updatedAt)}
                          </p>
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
