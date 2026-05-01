"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  TrendingUp,
  Tag,
  Clock,
  Calendar,
  Users,
  ChevronDown,
  Shield,
  Share2,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  SEASON_DETAILS_VIEW_PAGE_URL,
  ACTIVITY_CATEGORY_VIEW_DETAILS_URL,
} from "@/utils/urls";

interface ActivityItem {
  activityId: number;
  activityName: string;
  activityDescription?: string;
  activityCategories?: string[];
  durationHours?: number;
  season?: string;
  seasonId?: number;
  minParticipate?: number;
  maxParticipate?: number;
  availableFrom?: string;
  availableTo?: string;
}

interface ActivitiesListProps {
  activities: ActivityItem[];
}

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ activities }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [hoveredActivity, setHoveredActivity] = useState<number | null>(null);

  const handleCategoryClick = (categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${ACTIVITY_CATEGORY_VIEW_DETAILS_URL}?name=${encodeURIComponent(categoryName)}`);
  };

  const handleSeasonClick = (seasonName: string, seasonId: number | undefined, e: React.MouseEvent) => {
    e.stopPropagation();
    if (seasonId) {
      router.push(`${SEASON_DETAILS_VIEW_PAGE_URL}/${seasonId}?name=${encodeURIComponent(seasonName)}`);
    } else {
      router.push(`${SEASON_DETAILS_VIEW_PAGE_URL}?name=${encodeURIComponent(seasonName)}`);
    }
  };

  const handleActivityDetailsClick = (activityId: number, activityName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activityId}?name=${encodeURIComponent(activityName)}`);
  };

  const handleShareClick = (activityName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: activityName, text: `Check out this activity: ${activityName}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      className="rounded-2xl border shadow-sm p-7"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2.5 text-lg font-bold" style={{ color: theme.text }}>
          <IconBadge icon={Activity} color={theme.accent} />
          Available Activities
        </h2>
        <motion.span
          className="px-3.5 py-1.5 rounded-full text-xs font-bold border"
          style={{
            backgroundColor: hexToRgba(theme.accent, 0.1),
            color: theme.accent,
            borderColor: hexToRgba(theme.accent, 0.3),
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          {activities.length} total
        </motion.span>
      </div>

      {/* Activity Cards */}
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const isOpen = selectedActivity === activity.activityId;
          const isHovered = hoveredActivity === activity.activityId;

          return (
            <motion.div
              key={activity.activityId}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                border: `2px solid ${isOpen ? theme.primary : isHovered ? hexToRgba(theme.primary, 0.35) : theme.border}`,
                backgroundColor: theme.surface,
                boxShadow: isOpen
                  ? `0 0 0 3px ${hexToRgba(theme.primary, 0.08)}, 0 8px 24px ${hexToRgba(theme.primary, 0.12)}`
                  : isHovered
                  ? `0 4px 16px ${hexToRgba(theme.primary, 0.08)}`
                  : "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              whileTap={{ scale: 0.995 }}
              onClick={() => setSelectedActivity(isOpen ? null : activity.activityId)}
              onHoverStart={() => setHoveredActivity(activity.activityId)}
              onHoverEnd={() => setHoveredActivity(null)}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  {/* Icon */}
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
                    animate={{ scale: isHovered || isOpen ? 1.08 : 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <TrendingUp size={16} color="#fff" />
                  </motion.div>

                  {/* Title + Description */}
                  <div className="flex-1">
                    <h3 className="font-bold mb-1" style={{ color: theme.text }}>
                      {activity.activityName}
                    </h3>
                    {activity.activityDescription && (
                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                        {activity.activityDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {activity.activityCategories && activity.activityCategories.length > 0 ? (
                    activity.activityCategories.map((cat, i) => (
                      <motion.span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer"
                        style={{
                          backgroundColor: hexToRgba(theme.success, 0.1),
                          color: theme.success,
                          borderColor: hexToRgba(theme.success, 0.3),
                        }}
                        whileHover={{
                          y: -2,
                          backgroundColor: hexToRgba(theme.success, 0.2),
                          scale: 1.04,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => handleCategoryClick(cat, e)}
                      >
                        <Tag size={10} /> {cat}
                      </motion.span>
                    ))
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      style={{ backgroundColor: theme.background, color: theme.textSecondary, borderColor: theme.border }}
                    >
                      No categories
                    </span>
                  )}
                </div>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-2">
                  {/* Duration */}
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: hexToRgba(theme.warning, 0.1),
                      color: theme.warning,
                      borderColor: hexToRgba(theme.warning, 0.3),
                    }}
                  >
                    <Clock size={11} /> {activity.durationHours ?? 0}h
                  </span>

                  {/* Season — clickable */}
                  <motion.span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                      borderColor: hexToRgba(theme.primary, 0.3),
                    }}
                    whileHover={{ y: -2, backgroundColor: hexToRgba(theme.primary, 0.2), scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => handleSeasonClick(activity.season || "N/A", activity.seasonId, e)}
                  >
                    <Calendar size={11} /> {activity.season ?? "N/A"}
                  </motion.span>

                  {/* Participants */}
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: hexToRgba(theme.secondary, 0.1),
                      color: theme.secondary,
                      borderColor: hexToRgba(theme.secondary, 0.3),
                    }}
                  >
                    <Users size={11} /> {activity.minParticipate ?? 0}–{activity.maxParticipate ?? 0} pax
                  </span>
                </div>

                {/* Collapse toggle hint */}
                <div
                  className="flex items-center justify-center gap-1.5 mt-3.5 text-[11px]"
                  style={{ color: theme.textSecondary }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isOpen ? "collapse" : "view"}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isOpen ? "Collapse" : "View details"}
                    </motion.span>
                  </AnimatePresence>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <ChevronDown size={14} style={{ color: theme.textSecondary }} />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Details Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.div
                      className="p-5 border-t"
                      style={{ borderColor: theme.border, backgroundColor: theme.background }}
                      initial={{ y: -8 }}
                      animate={{ y: 0 }}
                      exit={{ y: -8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        {/* Operating Hours */}
                        <motion.div
                          className="p-3.5 rounded-xl border"
                          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, duration: 0.25 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IconBadge icon={Clock} color={theme.success} />
                            <span className="text-xs font-bold" style={{ color: theme.text }}>Operating Hours</span>
                          </div>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            From: <strong style={{ color: theme.text }}>{activity.availableFrom ? activity.availableFrom.slice(0, 5) : "N/A"}</strong>
                          </p>
                          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                            To: <strong style={{ color: theme.text }}>{activity.availableTo ? activity.availableTo.slice(0, 5) : "N/A"}</strong>
                          </p>
                          <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${theme.success}, ${hexToRgba(theme.success, 0.5)})` }}
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>

                        {/* Group Size */}
                        <motion.div
                          className="p-3.5 rounded-xl border"
                          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.25 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IconBadge icon={Users} color={theme.secondary} />
                            <span className="text-xs font-bold" style={{ color: theme.text }}>Group Size</span>
                          </div>
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            Min: <strong style={{ color: theme.text }}>{activity.minParticipate ?? 0}</strong>
                          </p>
                          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                            Max: <strong style={{ color: theme.text }}>{activity.maxParticipate ?? 0}</strong>
                          </p>
                        </motion.div>

                        {/* Duration */}
                        <motion.div
                          className="p-3.5 rounded-xl border"
                          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.25 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IconBadge icon={Clock} color={theme.warning} />
                            <span className="text-xs font-bold" style={{ color: theme.text }}>Duration</span>
                          </div>
                          <p className="text-2xl font-extrabold" style={{ color: theme.text }}>
                            {activity.durationHours ?? 0}
                            <span className="text-sm font-medium ml-1" style={{ color: theme.textSecondary }}>hrs</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: theme.success }}>
                            <Shield size={12} /> Flexible timing
                          </div>
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        className="flex justify-end gap-3"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.25 }}
                      >
                        <motion.button
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{
                            backgroundColor: hexToRgba(theme.success, 0.1),
                            color: theme.success,
                            border: `1px solid ${hexToRgba(theme.success, 0.3)}`,
                          }}
                          whileHover={{ scale: 1.05, backgroundColor: hexToRgba(theme.success, 0.2) }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => handleShareClick(activity.activityName, e)}
                        >
                          <Share2 size={14} /> Share
                        </motion.button>
                        <motion.button
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{
                            backgroundColor: hexToRgba(theme.primary, 0.1),
                            color: theme.primary,
                            border: `1px solid ${hexToRgba(theme.primary, 0.3)}`,
                          }}
                          whileHover={{ scale: 1.05, backgroundColor: hexToRgba(theme.primary, 0.2) }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => handleActivityDetailsClick(activity.activityId, activity.activityName, e)}
                        >
                          <Eye size={14} /> More Details
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};