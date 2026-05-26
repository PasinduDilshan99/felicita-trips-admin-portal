"use client";

import React, { useId, useRef } from "react";
import { Edit, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { DESCRIPTION_MAX_CHARACTERS, NAME_MAX_CHARACTERS } from "@/data/destination-constant-data";
import { DESTINATION_STATUS_OPTIONS } from "@/data/status-options-data";
import { cardVariants, fieldGroupVariants, fieldVariants, modifiedBadgeVariants, pillVariants } from "@/app/animations/variants";

interface BasicInfoFormProps {
  destination: any;
  hasChanged: (field: string) => boolean;
  onFieldChange: (field: string, value: any) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  destination,
  hasChanged,
  onFieldChange,
}) => {
  const { theme } = useTheme();
  const uid = useId();
  const statusRef = useRef<HTMLSelectElement>(null);

  const descLength = (destination.destinationDescription ?? "").length;
  const descPct = (descLength / DESCRIPTION_MAX_CHARACTERS) * 100;
  const descColor =
    descPct > 90 ? theme.error : descPct > 70 ? "#f59e0b" : theme.primary;

  const handleStatusClick = (value: string) => {
    if (!statusRef.current) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(statusRef.current, value);
    statusRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    onFieldChange("statusName", value);
  };

  const focusHandlers = (isChanged: boolean) => ({
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
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

  const ModifiedBadge = ({ field }: { field: string }) => (
    <AnimatePresence>
      {hasChanged(field) && (
        <motion.p
          key="badge"
          variants={modifiedBadgeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-xs flex items-center gap-1 overflow-hidden"
          style={{ color: theme.primary }}
        >
          This field has been modified
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .field-error { animation: errorShake 0.35s ease; }

        /* Smooth progress bar fill */
        .desc-bar-fill {
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      background-color 0.25s ease;
        }

        /* Remove number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* ── Card ── */}
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
        {/* ── Header ── */}
        <motion.div
          className="flex items-center gap-3 px-4 sm:px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
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
          <div className="min-w-0">
            <h2
              className="text-sm sm:text-base font-semibold leading-tight truncate"
              style={{ color: theme.text }}
            >
              Basic Information
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Core details about the destination
            </p>
          </div>
        </motion.div>

        {/* ── Fields ── */}
        <motion.div
          className="px-4 sm:px-6 py-5 sm:py-6"
          variants={fieldGroupVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Destination Name (outside grid, always full width) ── */}
          <motion.div variants={fieldVariants} className="mb-5 md:mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${uid}-name`}
                className="text-sm font-medium"
                style={{ color: theme.textSecondary }}
              >
                Destination Name
                <span style={{ color: theme.error }}> *</span>
              </label>
              <span
                className="text-xs tabular-nums"
                style={{
                  color:
                    (destination.destinationName ?? "").length >
                    NAME_MAX_CHARACTERS * 0.9
                      ? theme.error
                      : theme.textSecondary,
                }}
              >
                {(destination.destinationName ?? "").length}/{NAME_MAX_CHARACTERS}
              </span>
            </div>
            <input
              id={`${uid}-name`}
              type="text"
              value={destination.destinationName}
              onChange={(e) => onFieldChange("destinationName", e.target.value)}
              placeholder="e.g. Sigiriya Rock Fortress"
              maxLength={NAME_MAX_CHARACTERS}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("destinationName")
                  ? theme.primary
                  : theme.border,
                backgroundColor: hasChanged("destinationName")
                  ? `${theme.primary}10`
                  : theme.background,
              }}
              {...focusHandlers(hasChanged("destinationName"))}
            />
            <ModifiedBadge field="destinationName" />
          </motion.div>

          {/* Responsive grid: mobile 1col → md 2col */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

            {/* ── Status Pills ── */}
            <motion.div variants={fieldVariants} className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textSecondary }}
              >
                Status
              </label>

              {/* Hidden select */}
              <select
                ref={statusRef}
                name="statusName"
                value={destination.statusName}
                onChange={(e) => onFieldChange("statusName", e.target.value)}
                className="sr-only"
                aria-hidden="true"
                tabIndex={-1}
              >
                {DESTINATION_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Pills — 2×2 grid on all screens */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {DESTINATION_STATUS_OPTIONS.map((opt) => {
                  const isSelected = destination.statusName === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      onClick={() => handleStatusClick(opt.value)}
                      variants={pillVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 text-left min-w-0 cursor-pointer"
                      style={{
                        backgroundColor: isSelected
                          ? `${opt.color}10`
                          : theme.background,
                        borderColor: isSelected ? opt.color : theme.border,
                        boxShadow: isSelected
                          ? `0 0 0 3px ${opt.color}18`
                          : "none",
                        transition:
                          "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? `${opt.color}20`
                            : `${theme.border}60`,
                          transition: "background-color 0.18s ease",
                        }}
                      >
                        <motion.span
                          className="w-2.5 h-2.5 rounded-full"
                          animate={{
                            backgroundColor: isSelected
                              ? opt.color
                              : theme.textSecondary,
                            scale: isSelected ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className="block text-xs sm:text-sm font-semibold leading-tight truncate"
                          style={{
                            color: isSelected ? opt.color : theme.text,
                            transition: "color 0.18s ease",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span
                          className="block text-xs mt-0.5 truncate"
                          style={{ color: theme.textSecondary }}
                        >
                          {opt.description}
                        </span>
                      </span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            key="check"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2, ease: "backOut" }}
                            className="ml-auto flex-shrink-0"
                          >
                            <CheckCircle2
                              className="w-4 h-4"
                              style={{ color: opt.color }}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Description ── */}
            <motion.div variants={fieldVariants} className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${uid}-description`}
                  className="text-sm font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Description
                  <span style={{ color: theme.error }}> *</span>
                </label>
              </div>
              <textarea
                id={`${uid}-description`}
                value={destination.destinationDescription}
                onChange={(e) =>
                  onFieldChange("destinationDescription", e.target.value)
                }
                rows={5}
                placeholder="Describe what makes this destination special…"
                maxLength={DESCRIPTION_MAX_CHARACTERS}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("destinationDescription")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("destinationDescription")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                {...focusHandlers(hasChanged("destinationDescription"))}
              />

              {/* Progress bar + counter */}
              <div className="mt-2 space-y-1">
                <div
                  className="w-full h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: theme.border }}
                >
                  <div
                    className="desc-bar-fill h-full rounded-full"
                    style={{
                      width: `${Math.min(descPct, 100)}%`,
                      backgroundColor: descColor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <ModifiedBadge field="destinationDescription" />
                  <span
                    className="text-xs tabular-nums ml-auto"
                    style={{ color: descColor, transition: "color 0.25s ease" }}
                  >
                    {descLength}/{DESCRIPTION_MAX_CHARACTERS}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── Location ── */}
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Location
                <span style={{ color: theme.error }}> *</span>
              </label>
              <input
                type="text"
                value={destination.location}
                onChange={(e) => onFieldChange("location", e.target.value)}
                placeholder="e.g. Matale District, Sri Lanka"
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("location")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("location")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                {...focusHandlers(hasChanged("location"))}
              />
              <ModifiedBadge field="location" />
            </motion.div>

            {/* ── Extra Price ── */}
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Extra Price{" "}
                <span className="font-normal text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={destination.extraPrice || ""}
                onChange={(e) =>
                  onFieldChange("extraPrice", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{ ...fieldBase, borderColor: theme.border }}
                placeholder="0.00"
                {...focusHandlers(false)}
              />
            </motion.div>

            {/* ── Extra Price Note ── */}
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Extra Price Note
              </label>
              <input
                type="text"
                value={destination.extraPriceNote || ""}
                onChange={(e) => onFieldChange("extraPriceNote", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{ ...fieldBase, borderColor: theme.border }}
                placeholder="e.g., Entrance fee, Tax, etc."
                {...focusHandlers(false)}
              />
            </motion.div>

            {/* ── Latitude ── */}
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={destination.latitude}
                onChange={(e) =>
                  onFieldChange("latitude", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("latitude")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("latitude")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                placeholder="e.g. 7.9567"
                {...focusHandlers(hasChanged("latitude"))}
              />
              <ModifiedBadge field="latitude" />
            </motion.div>

            {/* ── Longitude ── */}
            <motion.div variants={fieldVariants}>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={destination.longitude}
                onChange={(e) =>
                  onFieldChange("longitude", parseFloat(e.target.value))
                }
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("longitude")
                    ? theme.primary
                    : theme.border,
                  backgroundColor: hasChanged("longitude")
                    ? `${theme.primary}10`
                    : theme.background,
                }}
                placeholder="e.g. 80.7417"
                {...focusHandlers(hasChanged("longitude"))}
              />
              <ModifiedBadge field="longitude" />
            </motion.div>

          </div>
        </motion.div>
      </motion.div>
    </>
  );
};