"use client";

import React, { useId } from "react";
import {
  Edit,
  CheckCircle2,
  Clock,
  Users,
  Banknote,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BasicInfoFormProps } from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cardVariants, fieldVariants } from "@/app/animations/variants";
import { ACTIVITY_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  activity,
  hasChanged,
  onFieldChange,
  availableSeasons,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
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

  const formatTimeForInput = (time: string): string => {
    if (!time) return "";
    return time.slice(0, 5);
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
            Core details about the activity
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6">
        {/* Activity Name */}
        <motion.div variants={fieldVariants} className="mb-5">
          <label
            htmlFor={`${uid}-name`}
            className="block text-sm font-medium mb-1.5"
            style={{ color: theme.textSecondary }}
          >
            Activity Name <span style={{ color: theme.error }}>*</span>
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            value={activity.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
            style={{
              ...fieldBase,
              borderColor: hasChanged("name") ? theme.primary : theme.border,
              backgroundColor: hasChanged("name")
                ? `${theme.primary}10`
                : theme.background,
            }}
            placeholder="e.g., Guided Nature Walk"
            {...focusHandlers(hasChanged("name"))}
          />
          <AnimatePresence>
            {hasChanged("name") && (
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
        <motion.div variants={fieldVariants} className="mb-5">
          <label
            htmlFor={`${uid}-description`}
            className="block text-sm font-medium mb-1.5"
            style={{ color: theme.textSecondary }}
          >
            Description <span style={{ color: theme.error }}>*</span>
          </label>
          <textarea
            id={`${uid}-description`}
            value={activity.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
            style={{
              ...fieldBase,
              borderColor: hasChanged("description")
                ? theme.primary
                : theme.border,
              backgroundColor: hasChanged("description")
                ? `${theme.primary}10`
                : theme.background,
            }}
            placeholder="Describe the activity in detail..."
            {...focusHandlers(hasChanged("description"))}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              value={activity.seasonId}
              onChange={(e) =>
                onFieldChange("seasonId", parseInt(e.target.value))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
              style={{
                ...fieldBase,
                borderColor: hasChanged("seasonId")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("seasonId"))}
            >
              <option value={0}>Select season...</option>
              {availableSeasons.map((season) => (
                <option key={season.seasonId} value={season.seasonId}>
                  {season.seasonName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Status */}
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ACTIVITY_UPDATE_STATUS_OPTIONS.map((opt) => {
                const isSelected = activity.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFieldChange("status", opt.value)}
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
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: opt.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Duration & Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Clock className="w-3.5 h-3.5" />
              Duration (hours) <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={activity.duration_hours}
              onChange={(e) =>
                onFieldChange("duration_hours", parseFloat(e.target.value))
              }
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("duration_hours")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("duration_hours"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Clock className="w-3.5 h-3.5" />
              Available From
            </label>
            <input
              type="time"
              value={formatTimeForInput(activity.available_from)}
              onChange={(e) => onFieldChange("available_from", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("available_from")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("available_from"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label
              className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.textSecondary }}
            >
              <Clock className="w-3.5 h-3.5" />
              Available To
            </label>
            <input
              type="time"
              value={formatTimeForInput(activity.available_to)}
              onChange={(e) => onFieldChange("available_to", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("available_to")
                  ? theme.primary
                  : theme.border,
              }}
              {...focusHandlers(hasChanged("available_to"))}
            />
          </motion.div>
        </div>

        {/* Pricing */}
        <div
          className="rounded-xl p-4 mt-5"
          style={{
            backgroundColor: `${theme.border}12`,
            border: `1px solid ${theme.border}`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
            style={{ color: theme.textSecondary }}
          >
            <Banknote className="w-3.5 h-3.5" /> Pricing (USD)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Local Price <span style={{ color: theme.error }}>*</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={activity.price_local}
                  onChange={(e) =>
                    onFieldChange("price_local", parseFloat(e.target.value))
                  }
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{
                    ...fieldBase,
                    borderColor: hasChanged("price_local")
                      ? theme.primary
                      : theme.border,
                  }}
                  {...focusHandlers(hasChanged("price_local"))}
                />
              </div>
              {activity.price_local > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  ≈ {formatPrice(activity.price_local)}
                </p>
              )}
            </motion.div>

            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Foreigners Price <span style={{ color: theme.error }}>*</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={activity.price_foreigners}
                  onChange={(e) =>
                    onFieldChange(
                      "price_foreigners",
                      parseFloat(e.target.value),
                    )
                  }
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{
                    ...fieldBase,
                    borderColor: hasChanged("price_foreigners")
                      ? theme.primary
                      : theme.border,
                  }}
                  {...focusHandlers(hasChanged("price_foreigners"))}
                />
              </div>
              {activity.price_foreigners > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: theme.textSecondary }}
                >
                  ≈ {formatPrice(activity.price_foreigners)}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Participants */}
        <div
          className="rounded-xl p-4 mt-5"
          style={{
            backgroundColor: `${theme.border}12`,
            border: `1px solid ${theme.border}`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
            style={{ color: theme.textSecondary }}
          >
            <Users className="w-3.5 h-3.5" /> Participants
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Minimum Participants{" "}
                <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={activity.min_participate}
                onChange={(e) =>
                  onFieldChange("min_participate", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("min_participate")
                    ? theme.primary
                    : theme.border,
                }}
                {...focusHandlers(hasChanged("min_participate"))}
              />
            </motion.div>

            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Maximum Participants{" "}
                <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={activity.max_participate}
                onChange={(e) =>
                  onFieldChange("max_participate", parseInt(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("max_participate")
                    ? theme.primary
                    : theme.border,
                }}
                {...focusHandlers(hasChanged("max_participate"))}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
