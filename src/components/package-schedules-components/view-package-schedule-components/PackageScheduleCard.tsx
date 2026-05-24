// components/package-schedule-components/PackageScheduleCard.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  AlertCircle,
  Package,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageScheduleListItem } from "@/types/package-schedule-types";
import { hexToRgba } from "@/utils/functions";
import { PACKAGES_PAGE_URL } from "@/utils/urls";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 25px -4px rgba(0,0,0,0.2)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 },
  },
};

const shineVariants: Variants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeInOut" } },
};

// Helper functions
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

const truncateDescription = (description: string, maxLength: number = 100): string => {
  if (!description) return "";
  if (description.length <= maxLength) return description;
  let truncated = description.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength - 20) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }
  return truncated + "...";
};

interface PackageScheduleCardProps {
  schedule: PackageScheduleListItem;
}

const PackageScheduleCard: React.FC<PackageScheduleCardProps> = ({ schedule }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const scheduleName = getSafeString(schedule?.packageScheduleName, "Unnamed Schedule");
  const packageName = getSafeString(schedule?.packageName, "");
  const tourScheduleName = getSafeString(schedule?.tourScheduleName, "");
  const description = getSafeString(schedule?.description, "");
  const truncatedDesc = truncateDescription(description, 100);
  const status = schedule?.status || "INACTIVE";
  const startDate = schedule?.startDate;
  const endDate = schedule?.endDate;
  const durationStart = schedule?.durationStart || 0;
  const durationEnd = schedule?.durationEnd || 0;
  const specialNote = getSafeString(schedule?.specialNote, "");

  const handleViewDetails = () => {
    router.push(`${PACKAGES_PAGE_URL}/${schedule.packageScheduleId}`);
  };

  const isActive = status === "ACTIVE";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Header Section with Status */}
      <div
        className="relative p-5"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.08)}, ${hexToRgba(theme.accent, 0.05)})`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
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

        <motion.h3
          className="text-xl font-bold mb-2 pr-20 transition-colors duration-200"
          style={{ color: theme.text }}
          whileHover={{ color: theme.primary }}
          onClick={handleViewDetails}
        >
          {scheduleName}
        </motion.h3>

        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" style={{ color: theme.success }} />
          <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
            {packageName}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <motion.div variants={contentVariants} initial="hidden" animate="visible" className="p-5 flex-grow flex flex-col">
        {/* Tour Schedule Info */}
        {tourScheduleName && (
          <motion.div variants={itemVariants} className="mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                Tour Schedule: {tourScheduleName}
              </span>
            </div>
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: theme.textSecondary }}
          >
            {truncatedDesc}
          </motion.p>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-3 py-4 rounded-xl mb-4"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
            borderTop: `1px solid ${theme.border}`,
            marginTop: "auto",
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: hexToRgba(theme.accent, 0.1) }}>
                <Clock className="w-4 h-4" style={{ color: theme.accent }} />
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>Duration</div>
            <div className="text-sm font-bold" style={{ color: theme.text }}>{durationStart}-{durationEnd} days</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: hexToRgba(theme.primary, 0.1) }}>
                <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>Period</div>
            <div className="text-sm font-bold" style={{ color: theme.text }}>
              {startDate && endDate ? `${formatDate(startDate)}` : "TBD"}
            </div>
          </div>
        </motion.div>

        {/* Date Range Details */}
        {startDate && endDate && (
          <motion.div variants={itemVariants} className="mb-3">
            <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
            </div>
          </motion.div>
        )}

        {/* Special Note */}
        {specialNote && (
          <motion.div variants={itemVariants} className="mb-4">
            <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: hexToRgba(theme.warning, 0.08) }}>
              <AlertCircle className="w-3.5 h-3.5 mt-0.5" style={{ color: theme.warning }} />
              <span className="text-xs" style={{ color: theme.warning }}>{specialNote}</span>
            </div>
          </motion.div>
        )}

        {/* View Details Button */}
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={handleViewDetails}
          className="relative w-full mt-auto font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
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
            style={{
              background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
            }}
          />
          <span className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.35)" }} />
          <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="relative tracking-wide text-sm">View Details</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PackageScheduleCard;