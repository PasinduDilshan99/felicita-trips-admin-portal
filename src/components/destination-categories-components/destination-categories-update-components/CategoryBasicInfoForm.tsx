"use client";

import React, { useId } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FileText, AlertCircle, CheckCircle2, Sparkles, Edit3 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DESTINATION_CATEGORY_DESCRIPTION_MAX_CHARACTERS,
  DESTINATION_CATEGORY_NAME_MAX_CHARACTERS,
} from "@/data/destination-constant-data";
import { DESTINATION_CATEGORIES_STATUS_OPTIONS } from "@/data/status-options-data";

interface CategoryBasicInfoFormProps {
  category: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
};

const fieldGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
};

const pillVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { y: -2, transition: { duration: 0.15, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: { duration: 0.35, ease: EASE_OUT },
  }),
};

const errorVariants: Variants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const modifiedBadgeVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 6,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

interface CategoryBasicInfoFormPropsWithTracking extends CategoryBasicInfoFormProps {
  originalCategory?: string;
  originalDescription?: string;
  originalStatus?: string;
  hasChanged?: (field: string) => boolean;
}

const CategoryBasicInfoForm: React.FC<CategoryBasicInfoFormPropsWithTracking> = ({
  category,
  description,
  status,
  errors,
  onFieldChange,
  originalCategory,
  originalDescription,
  originalStatus,
  hasChanged,
}) => {
  const { theme } = useTheme();
  const uid = useId();

  const categoryNameLength = category.length;
  const descriptionLength = description.length;
  const descPct =
    (descriptionLength / DESTINATION_CATEGORY_DESCRIPTION_MAX_CHARACTERS) * 100;
  const descColor =
    descPct > 90 ? theme.error : descPct > 70 ? "#f59e0b" : theme.primary;

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const focusHandlers = (hasError: boolean, isChanged: boolean = false) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = hasError
        ? theme.error
        : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${hasError ? theme.error : theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = hasError
        ? theme.error
        : isChanged
        ? theme.primary
        : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const handleStatusClick = (value: string) => {
    onFieldChange("status", value);
  };

  const ModifiedBadge = ({ field }: { field: string }) => (
    <AnimatePresence>
      {hasChanged && hasChanged(field) && (
        <motion.p
          key="badge"
          variants={modifiedBadgeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-xs flex items-center gap-1 overflow-hidden mt-1.5"
          style={{ color: theme.primary }}
        >
          <Edit3 className="w-3 h-3" />
          This field has been modified
        </motion.p>
      )}
    </AnimatePresence>
  );

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
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
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
          <FileText className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h2
            className="text-sm sm:text-base font-semibold leading-tight truncate"
            style={{ color: theme.text }}
          >
            Category Information
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Basic details for the destination category
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="ml-auto"
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary, opacity: 0.6 }} />
        </motion.div>
      </motion.div>

      {/* Fields */}
      <motion.div
        variants={fieldGroupVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-5 sm:py-6"
      >
        {/* Category Name */}
        <motion.div variants={fieldVariants} className="mb-5 md:mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${uid}-category`}
              className="text-sm font-medium"
              style={{ color: theme.textSecondary }}
            >
              Category Name <span style={{ color: theme.error }}>*</span>
            </label>
            <motion.span
              className="text-xs tabular-nums"
              animate={{
                color:
                  categoryNameLength > DESTINATION_CATEGORY_NAME_MAX_CHARACTERS * 0.9
                    ? theme.error
                    : theme.textSecondary,
              }}
            >
              {categoryNameLength}/{DESTINATION_CATEGORY_NAME_MAX_CHARACTERS}
            </motion.span>
          </div>
          <input
            id={`${uid}-category`}
            type="text"
            value={category}
            onChange={(e) => onFieldChange("category", e.target.value)}
            placeholder="e.g., Beaches, Mountains, Historical Sites"
            maxLength={DESTINATION_CATEGORY_NAME_MAX_CHARACTERS}
            className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm transition-all duration-200"
            style={{
              ...fieldBase,
              borderColor: errors.category ? theme.error : 
                (hasChanged && hasChanged("category") ? theme.primary : theme.border),
              backgroundColor: hasChanged && hasChanged("category")
                ? `${theme.primary}10`
                : theme.background,
            }}
            {...focusHandlers(!!errors.category, hasChanged ? hasChanged("category") : false)}
          />
          {errors.category && (
            <motion.p
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              className="mt-1.5 text-xs flex items-center gap-1"
              style={{ color: theme.error }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errors.category}
            </motion.p>
          )}
          <ModifiedBadge field="category" />
        </motion.div>

        {/* Description */}
        <motion.div variants={fieldVariants} className="mb-5 md:mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={`${uid}-description`}
              className="text-sm font-medium"
              style={{ color: theme.textSecondary }}
            >
              Description <span style={{ color: theme.error }}>*</span>
            </label>
          </div>
          <textarea
            id={`${uid}-description`}
            value={description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={5}
            placeholder="Describe what makes this category special…"
            maxLength={DESTINATION_CATEGORY_DESCRIPTION_MAX_CHARACTERS}
            className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none transition-all duration-200"
            style={{
              ...fieldBase,
              borderColor: errors.description ? theme.error :
                (hasChanged && hasChanged("description") ? theme.primary : theme.border),
              backgroundColor: hasChanged && hasChanged("description")
                ? `${theme.primary}10`
                : theme.background,
            }}
            {...focusHandlers(!!errors.description, hasChanged ? hasChanged("description") : false)}
          />
          <div className="mt-2 space-y-1">
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.border }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: descColor }}
                variants={progressVariants}
                initial="hidden"
                animate="visible"
                custom={Math.min(descPct, 100)}
              />
            </div>
            <div className="flex items-center justify-between">
              {errors.description ? (
                <motion.p
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xs flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.description}
                </motion.p>
              ) : (
                <ModifiedBadge field="description" />
              )}
              <motion.span
                className="text-xs tabular-nums ml-auto"
                animate={{ color: descColor }}
              >
                {descriptionLength}/
                {DESTINATION_CATEGORY_DESCRIPTION_MAX_CHARACTERS}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div variants={fieldVariants}>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: theme.textSecondary }}
          >
            Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DESTINATION_CATEGORIES_STATUS_OPTIONS.map((opt) => {
              const isSelected = status === opt.value;
              const isChangedStatus = hasChanged && hasChanged("status");
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusClick(opt.value)}
                  variants={pillVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left w-full cursor-pointer"
                  style={{
                    backgroundColor: isSelected
                      ? `${opt.color}10`
                      : theme.background,
                    borderColor: isSelected
                      ? opt.color
                      : (isChangedStatus && isSelected ? theme.primary : theme.border),
                    boxShadow: isSelected
                      ? `0 0 0 3px ${opt.color}18`
                      : "none",
                    transition:
                      "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                  }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? `${opt.color}20`
                        : `${theme.border}60`,
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
                  <div className="min-w-0 flex-1">
                    <span
                      className="block text-sm font-semibold leading-tight"
                      style={{ color: isSelected ? opt.color : theme.text }}
                    >
                      {opt.label}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {opt.description}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "backOut" }}
                        className="flex-shrink-0"
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
          <ModifiedBadge field="status" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryBasicInfoForm;