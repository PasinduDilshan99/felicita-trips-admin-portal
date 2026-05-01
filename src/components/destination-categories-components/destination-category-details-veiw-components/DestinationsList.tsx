"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPin, Star, CheckCircle, XCircle, ArrowRight, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { CategoryDestination } from "@/types/destination-types";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { hexToRgba } from "@/utils/functions";

interface DestinationsListProps {
  destinations: CategoryDestination[];
  color: string;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const destinationCardVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const expandedContentVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 12,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
      staggerChildren: 0.03,
      delayChildren: 0.05,
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
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const chevronVariants: Variants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
};

const DestinationsList = ({ destinations, color }: DestinationsListProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [showAllPrimary, setShowAllPrimary] = useState(false);
  const [showAllOther, setShowAllOther] = useState(false);
  const [expandedDestinations, setExpandedDestinations] = useState<Set<number>>(new Set());

  const INITIAL_VISIBLE_COUNT = 3;

  const handleViewDestination = (destinationId: number) => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view/${destinationId}`
    );
  };

  const toggleDestinationExpand = (destinationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDestinations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(destinationId)) {
        newSet.delete(destinationId);
      } else {
        newSet.add(destinationId);
      }
      return newSet;
    });
  };

  const primaryDestinations = destinations.filter(d => d.primary);
  const otherDestinations = destinations.filter(d => !d.primary);

  const visiblePrimary = showAllPrimary ? primaryDestinations : primaryDestinations.slice(0, INITIAL_VISIBLE_COUNT);
  const visibleOther = showAllOther ? otherDestinations : otherDestinations.slice(0, INITIAL_VISIBLE_COUNT);

  const themeColor = color || theme.primary;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Header */}
      <div className="p-5 sm:p-6 border-b" style={{ borderColor: theme.border }}>
        <h2
          className="text-lg sm:text-xl font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <MapPin className="w-5 h-5" style={{ color: themeColor }} />
          Associated Destinations
          <span
            className="text-xs sm:text-sm px-2 py-0.5 rounded-full ml-2"
            style={{
              backgroundColor: hexToRgba(themeColor, 0.1),
              color: themeColor,
            }}
          >
            {destinations.length}
          </span>
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: theme.textSecondary }}>
          Destinations that belong to this category
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: theme.border }}>
        {/* Primary Destination Section */}
        {primaryDestinations.length > 0 && (
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="p-4"
            style={{ backgroundColor: hexToRgba(themeColor, 0.03) }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4" style={{ color: theme.warning }} />
              <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                Primary Destination
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(themeColor, 0.1),
                  color: themeColor,
                }}
              >
                {primaryDestinations.length}
              </span>
            </div>

            <motion.div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {visiblePrimary.map((destination) => (
                  <DestinationCard
                    key={destination.destinationId}
                    destination={destination}
                    isPrimary={true}
                    color={themeColor}
                    onView={handleViewDestination}
                    isExpanded={expandedDestinations.has(destination.destinationId)}
                    onToggleExpand={toggleDestinationExpand}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Show More/Less Button for Primary */}
            {primaryDestinations.length > INITIAL_VISIBLE_COUNT && (
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowAllPrimary(!showAllPrimary)}
                className="cursor-pointer mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  color: themeColor,
                  backgroundColor: hexToRgba(themeColor, 0.08),
                  border: `1px solid ${hexToRgba(themeColor, 0.2)}`,
                }}
              >
                {showAllPrimary ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More ({primaryDestinations.length - INITIAL_VISIBLE_COUNT} more)
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Other Destinations Section */}
        {otherDestinations.length > 0 && (
          <motion.div 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="p-4"
          >
            <div className="mb-3">
              <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                All Destinations
              </span>
              <span
                className="text-xs ml-2 px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: hexToRgba(theme.border, 0.5),
                  color: theme.textSecondary,
                }}
              >
                {otherDestinations.length}
              </span>
            </div>

            <motion.div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {visibleOther.map((destination) => (
                  <DestinationCard
                    key={destination.destinationId}
                    destination={destination}
                    isPrimary={false}
                    color={themeColor}
                    onView={handleViewDestination}
                    isExpanded={expandedDestinations.has(destination.destinationId)}
                    onToggleExpand={toggleDestinationExpand}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Show More/Less Button for Other */}
            {otherDestinations.length > INITIAL_VISIBLE_COUNT && (
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowAllOther(!showAllOther)}
                className="cursor-pointer mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  color: themeColor,
                  backgroundColor: hexToRgba(themeColor, 0.08),
                  border: `1px solid ${hexToRgba(themeColor, 0.2)}`,
                }}
              >
                {showAllOther ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More ({otherDestinations.length - INITIAL_VISIBLE_COUNT} more)
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {destinations.length === 0 && (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textSecondary, opacity: 0.5 }} />
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              No destinations associated with this category yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Destination Card Sub-component
const DestinationCard = ({ 
  destination, 
  isPrimary, 
  color, 
  onView,
  isExpanded,
  onToggleExpand,
}: { 
  destination: CategoryDestination;
  isPrimary: boolean;
  color: string;
  onView: (id: number) => void;
  isExpanded: boolean;
  onToggleExpand: (id: number, e: React.MouseEvent) => void;
}) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getStatusColor = () => {
    if (destination.destinationStatus === "ACTIVE") {
      return { bg: hexToRgba(theme.success, 0.1), text: theme.success };
    }
    return { bg: hexToRgba(theme.error, 0.1), text: theme.error };
  };

  const statusColors = getStatusColor();

  return (
    <motion.div
      variants={destinationCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: isPrimary ? hexToRgba(color, 0.08) : theme.surface,
        border: `1px solid ${isPrimary ? color : theme.border}`,
        overflow: "hidden",
      }}
    >
      {/* Compact Header - Always visible */}
      <div
        className="p-3 sm:p-4 flex items-center justify-between gap-3"
        onClick={(e) => onToggleExpand(destination.destinationId, e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="font-semibold text-sm sm:text-base truncate"
              style={{ color: theme.text }}
            >
              {destination.destinationName}
            </h3>
            
            {isPrimary && (
              <span
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.1),
                  color: theme.warning,
                }}
              >
                <Star className="w-3 h-3" />
                Primary
              </span>
            )}
            
            <span
              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
              }}
            >
              {destination.destinationStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Navigate Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{
              color,
              backgroundColor: hexToRgba(color, 0.1),
            }}
            onClick={(e) => {
              e.stopPropagation();
              onView(destination.destinationId);
            }}
            title="View destination"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>

          {/* Expand/Collapse Chevron */}
          <motion.div
            variants={chevronVariants}
            animate={isExpanded ? "open" : "closed"}
            transition={{ duration: 0.25 }}
            className="p-1 rounded-lg"
            style={{ color: theme.textSecondary }}
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            variants={expandedContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-3 pb-3 sm:px-4 sm:pb-4"
            style={{ borderTop: `1px solid ${hexToRgba(theme.border, 0.5)}` }}
          >
            {/* Description */}
            <motion.div variants={infoRowVariants} className="mb-3">
              <p className="text-xs sm:text-sm leading-relaxed line-clamp-3" style={{ color: theme.textSecondary }}>
                {destination.destinationDescription}
              </p>
            </motion.div>

            {/* Location */}
            <motion.div variants={infoRowVariants} className="mb-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                <MapPin className="w-3 h-3" style={{ color }} />
                <span>{destination.location}</span>
              </div>
            </motion.div>

            {/* Rating */}
            {destination.ratings > 0 && (
              <motion.div variants={infoRowVariants} className="mb-2">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                  <Star className="w-3 h-3" style={{ color: theme.warning }} />
                  <span>{destination.ratings.toFixed(1)} / 5.0</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { DestinationsList };