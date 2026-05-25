// components/tour-schedule-components/TourScheduleListCard.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Eye,
  ArrowRight,
  AlertCircle,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { TourScheduleListItem, TourScheduleCategory, TourScheduleType } from "@/types/tour-schedule-types";
import { hexToRgba } from "@/utils/functions";
import { TOUR_CATEGORIES_PAGE_URL } from "@/utils/urls";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  hover: { y: -4, transition: { duration: 0.2, ease: "easeOut" } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 25px -4px rgba(0,0,0,0.2)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  tap: { scale: 0.98, y: 0, transition: { duration: 0.1 } },
};

const shineVariants: Variants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeInOut" } },
};

const getSafeString = (value: any, fallback: string = ""): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return fallback;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

interface TourScheduleListCardProps {
  schedule: TourScheduleListItem;
}

const TourScheduleListCard: React.FC<TourScheduleListCardProps> = ({ schedule }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const scheduleName = getSafeString(schedule?.tourScheduleName, "Unnamed Schedule");
  const tourName = getSafeString(schedule?.tourName, "");
  const description = getSafeString(schedule?.description, "No description available");
  const categories = schedule?.categories || [];
  const types = schedule?.types || [];
  const scheduleStatus = schedule?.scheduleStatus || "INACTIVE";
  const startLocation = getSafeString(schedule?.startLocation, "N/A");
  const endLocation = getSafeString(schedule?.endLocation, "N/A");
  const season = getSafeString(schedule?.season, "N/A");
  const startDate = schedule?.assumeStartDate;
  const endDate = schedule?.assumeEndDate;
  const durationStart = schedule?.durationStart || 0;
  const durationEnd = schedule?.durationEnd || 0;
  const specialNote = getSafeString(schedule?.specialNote, "");
  const createdAt = schedule?.createdAt;
  const updatedAt = schedule?.updatedAt;

  const handleViewDetails = () => {
    router.push(`${TOUR_CATEGORIES_PAGE_URL}/${schedule.tourScheduleId}`);
  };

  const isActive = scheduleStatus === "ACTIVE";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div className="p-5 sm:p-6">
        <motion.div variants={contentVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <motion.h3
                  className="text-xl sm:text-2xl font-bold transition-colors duration-200 cursor-pointer"
                  style={{ color: theme.text }}
                  whileHover={{ color: theme.primary }}
                  onClick={handleViewDetails}
                >
                  {scheduleName}
                </motion.h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                  }`}
                >
                  {isActive ? (
                    <>
                      <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Active
                    </>
                  ) : (
                    "Inactive"
                  )}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" style={{ color: theme.success }} />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>{tourName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>{startLocation} → {endLocation}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories and Types */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
            {categories.length > 0 && (
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <div className="flex flex-wrap gap-1">
                  {categories.slice(0, 2).map((category: TourScheduleCategory) => (
                    <span
                      key={category.categoryId}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(theme.primary, 0.1),
                        color: theme.primary,
                      }}
                    >
                      {category.categoryName}
                      {category.primaryCategory && " (Primary)"}
                    </span>
                  ))}
                  {categories.length > 2 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: theme.textSecondary }}>
                      +{categories.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
            {types.length > 0 && (
              <div className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <div className="flex flex-wrap gap-1">
                  {types.slice(0, 2).map((type: TourScheduleType) => (
                    <span
                      key={type.typeId}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(theme.accent, 0.1),
                        color: theme.accent,
                      }}
                    >
                      {type.typeName}
                      {type.primaryType && " (Primary)"}
                    </span>
                  ))}
                  {types.length > 2 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: theme.textSecondary }}>
                      +{types.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg line-clamp-2 text-sm"
            style={{
              color: theme.textSecondary,
              borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
              background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
            }}
          >
            {description}
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 mb-6"
            style={{ borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.accent, 0.1) }}>
                <Clock className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Duration</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>{durationStart}-{durationEnd} days</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.primary, 0.1) }}>
                <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Season</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>{season}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.success, 0.1) }}>
                <Calendar className="w-5 h-5" style={{ color: theme.success }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Start Date</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>{startDate ? formatDate(startDate) : "TBD"}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.warning, 0.1) }}>
                <Calendar className="w-5 h-5" style={{ color: theme.warning }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>End Date</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>{endDate ? formatDate(endDate) : "TBD"}</div>
              </div>
            </div>
          </motion.div>

          {/* Special Note */}
          {specialNote && (
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: hexToRgba(theme.warning, 0.08) }}>
                <AlertCircle className="w-4 h-4 mt-0.5" style={{ color: theme.warning }} />
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: theme.warning }}>Special Note</div>
                  <span className="text-sm" style={{ color: theme.warning }}>{specialNote}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer with metadata and button */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4"
          >
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              {createdAt && (
                <div>Created: {formatDate(createdAt)}</div>
              )}
              {updatedAt && updatedAt !== createdAt && (
                <div>Updated: {formatDate(updatedAt)}</div>
              )}
            </div>

            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleViewDetails}
              className="relative cursor-pointer font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap w-full sm:w-auto"
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent || theme.primary} 100%)`,
                color: "#fff",
                boxShadow: `0 4px 15px -3px ${theme.primary}55`,
              }}
            >
              <motion.span
                variants={shineVariants}
                initial="rest"
                animate="hover"
                className="absolute inset-0"
                style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)" }}
              />
              <span className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.35)" }} />
              <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="relative tracking-wide text-sm">View Details</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TourScheduleListCard;