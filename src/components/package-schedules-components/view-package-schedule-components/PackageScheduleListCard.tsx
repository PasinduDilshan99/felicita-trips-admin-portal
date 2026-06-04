"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  AlertCircle,
  Package,
  MapPin,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { PackageScheduleListCardProps } from "@/types/package-schedule-types";
import { formatDate, getSafeString } from "@/utils/commonFunctions";
import { PACKAGE_SCHEDULE_DETAILS_VIEW_URL } from "@/utils/urls";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  itemVariants,
  shineVariants,
} from "@/app/animations/variants";

const PackageScheduleListCard: React.FC<PackageScheduleListCardProps> = ({
  schedule,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const scheduleName = getSafeString(
    schedule?.packageScheduleName,
    "Unnamed Schedule",
  );
  const packageName = getSafeString(schedule?.packageName, "");
  const tourScheduleName = getSafeString(schedule?.tourScheduleName, "");
  const description = getSafeString(
    schedule?.description,
    "No description available",
  );
  const status = schedule?.status || "INACTIVE";
  const startDate = schedule?.startDate;
  const endDate = schedule?.endDate;
  const durationStart = schedule?.durationStart || 0;
  const durationEnd = schedule?.durationEnd || 0;
  const specialNote = getSafeString(schedule?.specialNote, "");

  const handleViewDetails = () => {
    router.push(
      `${PACKAGE_SCHEDULE_DETAILS_VIEW_URL}/${schedule.packageScheduleId}?@PACKAGE_SCHEDULE_DETAILS_VIEW_URL${schedule.packageScheduleName}`,
    );
  };
  const isActive = status === "ACTIVE";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="p-5 sm:p-6">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4"
          >
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
                  <Package
                    className="w-4 h-4"
                    style={{ color: theme.success }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {packageName}
                  </span>
                </div>
                {tourScheduleName && (
                  <div className="flex items-center gap-1">
                    <MapPin
                      className="w-4 h-4"
                      style={{ color: theme.accent }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      {tourScheduleName}
                    </span>
                  </div>
                )}
              </div>
            </div>
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
            style={{
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: hexToRgba(theme.accent, 0.1) }}
              >
                <Clock className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Duration
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {durationStart}-{durationEnd} days
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: hexToRgba(theme.success, 0.1) }}
              >
                <Calendar
                  className="w-5 h-5"
                  style={{ color: theme.success }}
                />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Start Date
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {startDate ? formatDate(startDate) : "TBD"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: hexToRgba(theme.warning, 0.1) }}
              >
                <Calendar
                  className="w-5 h-5"
                  style={{ color: theme.warning }}
                />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  End Date
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {endDate ? formatDate(endDate) : "TBD"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: hexToRgba(theme.primary, 0.1) }}
              >
                <Layers className="w-5 h-5" style={{ color: theme.primary }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Schedule ID
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  #{schedule.packageScheduleId}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Date Range Summary */}
          {startDate && endDate && (
            <motion.div variants={itemVariants} className="mb-4">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: theme.textSecondary }}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  Schedule Period: {formatDate(startDate)} -{" "}
                  {formatDate(endDate)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Special Note */}
          {specialNote && (
            <motion.div variants={itemVariants} className="mb-4">
              <div
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: hexToRgba(theme.warning, 0.08) }}
              >
                <AlertCircle
                  className="w-4 h-4 mt-0.5"
                  style={{ color: theme.warning }}
                />
                <div>
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: theme.warning }}
                  >
                    Special Note
                  </div>
                  <span className="text-sm" style={{ color: theme.warning }}>
                    {specialNote}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* View Details Button */}
          <motion.div variants={itemVariants} className="mt-4">
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
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
                }}
              />
              <span
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "rgba(255,255,255,0.35)" }}
              />
              <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="relative tracking-wide text-sm">
                View Details
              </span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PackageScheduleListCard;
