"use client";

import React, { useId } from "react";
import { Edit, Calendar, MapPin, Navigation, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, fieldVariants } from "@/app/animations/variants";
import { TOUR_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";
import { BasicInfoFormProps } from "@/types/tour-types";

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  tour,
  hasChanged,
  onFieldChange,
  availableSeasons,
}) => {
  const { theme } = useTheme();
  const uid = useId();

  const focusHandlers = (isChanged: boolean) => ({
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = isChanged
        ? theme.primary
        : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden w-full"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
          }}
        >
          <Edit className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-sm sm:text-base font-semibold"
            style={{ color: theme.text }}
          >
            Basic Information
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Core details about the tour
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Tour Name */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label
              htmlFor={`${uid}-name`}
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Tour Name <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              id={`${uid}-name`}
              type="text"
              value={tour.tourName}
              onChange={(e) => onFieldChange("tourName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("tourName")
                  ? theme.primary
                  : theme.border,
                backgroundColor: hasChanged("tourName")
                  ? `${theme.primary}10`
                  : theme.background,
              }}
              placeholder="e.g., Sri Lanka Adventure Tour"
              {...focusHandlers(hasChanged("tourName"))}
            />
            <AnimatePresence>
              {hasChanged("tourName") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs mt-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label
              htmlFor={`${uid}-description`}
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Description <span style={{ color: theme.error }}>*</span>
            </label>
            <textarea
              id={`${uid}-description`}
              value={tour.tourDescription}
              onChange={(e) => onFieldChange("tourDescription", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
              style={{
                ...fieldBase,
                borderColor: hasChanged("tourDescription")
                  ? theme.primary
                  : theme.border,
                backgroundColor: hasChanged("tourDescription")
                  ? `${theme.primary}10`
                  : theme.background,
              }}
              placeholder="Describe the tour in detail..."
              {...focusHandlers(hasChanged("tourDescription"))}
            />
          </motion.div>

          {/* Duration */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Clock className="w-3.5 h-3.5" />
              Duration (days) <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              value={tour.duration}
              onChange={(e) =>
                onFieldChange("duration", parseInt(e.target.value))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("duration")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("duration"))}
            />
          </motion.div>

          {/* Season */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Season <span style={{ color: theme.error }}>*</span>
            </label>
            <select
              value={tour.seasonName}
              onChange={(e) => onFieldChange("seasonName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
              style={{
                ...fieldBase,
                borderColor: hasChanged("seasonName")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("seasonName"))}
            >
              <option value="">Select season...</option>
              {availableSeasons.map((season) => (
                <option key={season.seasonId} value={season.seasonName}>
                  {season.seasonName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Start Location */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <MapPin className="w-3.5 h-3.5" />
              Start Location <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="text"
              value={tour.startLocation}
              onChange={(e) => onFieldChange("startLocation", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("startLocation")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="e.g., Colombo"
              {...focusHandlers(hasChanged("startLocation"))}
            />
          </motion.div>

          {/* End Location */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <MapPin className="w-3.5 h-3.5" />
              End Location <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="text"
              value={tour.endLocation}
              onChange={(e) => onFieldChange("endLocation", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("endLocation")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="e.g., Colombo"
              {...focusHandlers(hasChanged("endLocation"))}
            />
          </motion.div>

          {/* Latitude & Longitude */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Navigation className="w-3.5 h-3.5" />
              Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={tour.latitude}
              onChange={(e) =>
                onFieldChange("latitude", parseFloat(e.target.value))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("latitude")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="e.g., 6.9271"
              {...focusHandlers(hasChanged("latitude"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Navigation className="w-3.5 h-3.5" />
              Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={tour.longitude}
              onChange={(e) =>
                onFieldChange("longitude", parseFloat(e.target.value))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("longitude")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="e.g., 79.8612"
              {...focusHandlers(hasChanged("longitude"))}
            />
          </motion.div>

          {/* Status */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.textSecondary }}
            >
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TOUR_UPDATE_STATUS_OPTIONS.map((opt) => {
                const isSelected = tour.statusName === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFieldChange("statusName", opt.value)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? `${opt.color}10`
                        : theme.background,
                      borderColor: isSelected ? opt.color : theme.border,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span
                      className="flex-1 text-sm font-medium"
                      style={{ color: isSelected ? opt.color : theme.text }}
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4"
                        style={{ color: opt.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Assign To & Message */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Assign To
            </label>
            <input
              type="text"
              value={tour.assignToName || ""}
              onChange={(e) => onFieldChange("assignToName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("assignTo")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="Assigned person or department"
              {...focusHandlers(hasChanged("assignTo"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Assign Message
            </label>
            <textarea
              value={tour.assignMessage || ""}
              onChange={(e) => onFieldChange("assignMessage", e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
              style={{
                ...fieldBase,
                borderColor: hasChanged("assignMessage")
                  ? theme.primary
                  : theme.border,
              }}
              placeholder="Additional assignment notes..."
              {...focusHandlers(hasChanged("assignMessage"))}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
