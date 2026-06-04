"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, ChevronDown, AlertCircle } from "lucide-react";
import { CategoryDestination } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { DestinationsListProps } from "@/types/destination-category-types";
import {
  cardVariants,
  chevronVariants,
  contentVariants,
  destinationCardVariants,
  detailVariants,
  EASE_OUT,
  emptyVariants,
  headerVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const DestinationsList: React.FC<DestinationsListProps> = ({
  destinations,
}) => {
  const { theme } = useTheme();
  const [expandedDestinations, setExpandedDestinations] = useState<number[]>(
    [],
  );

  const toggleDestination = (destinationId: number) => {
    setExpandedDestinations((prev) =>
      prev.includes(destinationId)
        ? prev.filter((id) => id !== destinationId)
        : [...prev, destinationId],
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return theme.success;
      case "INACTIVE":
        return theme.warning || "#f59e0b";
      default:
        return theme.textSecondary;
    }
  };

  if (destinations.length === 0) {
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
            Associated Destinations
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <AlertCircle
            size={24}
            className="mx-auto mb-2 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No destinations associated with this category
          </p>
        </div>
      </motion.div>
    );
  }

  // Separate primary and secondary destinations
  const primaryDestinations = destinations.filter((dest) => dest.primary);
  const secondaryDestinations = destinations.filter((dest) => !dest.primary);

  const renderDestinationSection = (
    title: string,
    destList: CategoryDestination[],
    isPrimary: boolean,
  ) => {
    if (destList.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {isPrimary ? (
            <Star size={12} style={{ color: theme.warning || "#f59e0b" }} />
          ) : (
            <MapPin size={12} style={{ color: theme.accent }} />
          )}
          <h4
            className="text-xs font-semibold"
            style={{ color: theme.textSecondary }}
          >
            {title} ({destList.length})
          </h4>
        </div>
        {destList.map((destination) => {
          const isExpanded = expandedDestinations.includes(
            destination.destinationId,
          );

          return (
            <motion.div
              key={destination.destinationId}
              variants={destinationCardVariants}
              layout
              className="rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${hexToRgba(isPrimary ? theme.warning || "#f59e0b" : theme.accent, 0.25)}`,
                background: theme.surface,
              }}
            >
              {/* Header - Clickable */}
              <motion.button
                onClick={() => toggleDestination(destination.destinationId)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer"
                whileHover={{
                  backgroundColor: hexToRgba(
                    isPrimary ? theme.warning || "#f59e0b" : theme.accent,
                    0.05,
                  ),
                }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isPrimary && (
                      <Star
                        size={12}
                        style={{ color: theme.warning || "#f59e0b" }}
                      />
                    )}
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: theme.text }}
                    >
                      {destination.destinationName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{ color: theme.textSecondary }}
                    >
                      <MapPin size={10} />
                      {destination.location}
                    </span>
                    {destination.ratings > 0 && (
                      <>
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: theme.border }}
                        />
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: theme.warning || "#f59e0b" }}
                        >
                          <Star size={10} fill={theme.warning || "#f59e0b"} />
                          {destination.ratings}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <motion.div
                  variants={chevronVariants}
                  animate={isExpanded ? "open" : "closed"}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{
                    color: isPrimary
                      ? theme.warning || "#f59e0b"
                      : theme.accent,
                  }}
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
                      borderTop: `1px solid ${hexToRgba(isPrimary ? theme.warning || "#f59e0b" : theme.accent, 0.15)}`,
                    }}
                  >
                    <div className="grid gap-2 mt-2">
                      {destination.destinationDescription && (
                        <div className="flex items-start gap-2">
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {destination.destinationDescription}
                          </p>
                        </div>
                      )}
                      <div
                        className="grid grid-cols-2 gap-2 pt-1 border-t"
                        style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                      >
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Destination ID
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            #{destination.destinationId}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Status
                          </p>
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{
                              background: hexToRgba(
                                getStatusColor(destination.destinationStatus),
                                0.1,
                              ),
                              color: getStatusColor(
                                destination.destinationStatus,
                              ),
                            }}
                          >
                            {destination.destinationStatus}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Primary Category
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {destination.primary ? "Yes" : "No"}
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
      </div>
    );
  };

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
          <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Associated Destinations ({destinations.length})
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
        className="px-4 py-4 space-y-4"
      >
        {renderDestinationSection(
          "Primary Destinations",
          primaryDestinations,
          true,
        )}
        {renderDestinationSection(
          "Secondary Destinations",
          secondaryDestinations,
          false,
        )}
      </motion.div>
    </motion.div>
  );
};
