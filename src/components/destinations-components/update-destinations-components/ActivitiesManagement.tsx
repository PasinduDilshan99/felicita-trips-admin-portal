"use client";

import React, { useState, useRef } from "react";
import {
  Globe,
  Plus,
  ChevronDown,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Check,
  Lock,
  Clock,
  Users,
  Banknote,
  Calendar,
  Tag,
  Sparkles,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Activity, NewActivityRequest } from "@/types/destination-types";
import { ActivityCategory, SeasonType } from "@/types/common-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Link from "next/link";
import { ACTIVITY_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";
import { activityBodyVariants, activityCardVariants, bodyVariants, cardVariants, chevronVariants, confirmVariants, errorVariants, formVariants, headerVariants, pillVariants, tagVariants } from "@/app/animations/variants";
import { DESTINATION_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

interface ActivitiesManagementProps {
  activities: Activity[];
  removedActivities: number[];
  newActivities: NewActivityRequest[];
  availableActivityCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  onRemoveActivity: (activityId: number) => void;
  onAddNewActivity: (activity: NewActivityRequest) => void;
  onUpdateActivity: (activity: Activity) => void;
  error?: string;
}

/** Strips microseconds / seconds from a backend time string like "08:00:00.000000" → "08:00" */
const formatTimeDisplay = (raw: string | null | undefined): string => {
  if (!raw) return "Not set";
  return raw.slice(0, 5);
};

/** Converts a full "HH:MM:SS.ffffff" to "HH:MM" for <input type="time"> */
const toInputTime = (raw: string | null | undefined): string => {
  if (!raw) return "";
  return raw.slice(0, 5);
};

/* ─── Component ────────────────────────────────────────────────────────────── */

export const ActivitiesManagement: React.FC<ActivitiesManagementProps> = ({
  activities,
  removedActivities,
  newActivities,
  availableActivityCategories,
  availableSeasons,
  onRemoveActivity,
  onAddNewActivity,
  onUpdateActivity,
  error,
}) => {
  const { theme } = useTheme();
  const { formatPrice, currentCurrency } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [newActivityData, setNewActivityData] = useState<NewActivityRequest>({
    name: "",
    description: "",
    addActivityCategoriesId: [],
    removeActivityCategoriesId: [],
    durationHover: 0,
    availableFrom: "",
    availableTo: "",
    priceLocal: 0,
    priceForeigners: 0,
    minParticipate: 1,
    maxParticipate: 10,
    seasonId: 0,
    status: "ACTIVE",
    activityImages: [],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isActivityRemoved = (id: number) => removedActivities.includes(id);

  const toggleActivity = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCategoryToggle = (categoryId: number) => {
    const has = newActivityData.addActivityCategoriesId.includes(categoryId);
    setNewActivityData((d) => ({
      ...d,
      addActivityCategoriesId: has
        ? d.addActivityCategoriesId.filter((id) => id !== categoryId)
        : [...d.addActivityCategoriesId, categoryId],
    }));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!newActivityData.name.trim()) errs.name = "Activity name is required";
    if (!newActivityData.description.trim())
      errs.description = "Description is required";
    if (!newActivityData.seasonId) errs.seasonId = "Please select a season";
    if (newActivityData.priceLocal <= 0)
      errs.priceLocal = "Local price must be greater than 0";
    if (newActivityData.priceForeigners <= 0)
      errs.priceForeigners = "Foreigners price must be greater than 0";
    if (newActivityData.minParticipate > newActivityData.maxParticipate)
      errs.minParticipate = "Min must be ≤ max";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddActivity = () => {
    if (!validateForm()) return;
    onAddNewActivity({ ...newActivityData });
    setNewActivityData({
      name: "",
      description: "",
      addActivityCategoriesId: [],
      removeActivityCategoriesId: [],
      durationHover: 0,
      availableFrom: "",
      availableTo: "",
      priceLocal: 0,
      priceForeigners: 0,
      minParticipate: 1,
      maxParticipate: 10,
      seasonId: 0,
      status: "ACTIVE",
      activityImages: [],
    });
    setFormErrors({});
    setShowNewActivityForm(false);
  };

  const handleShowForm = () => {
    setShowNewActivityForm(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
  };

  const getSeasonName = (id: number) =>
    availableSeasons.find((s) => s.seasonId === id)?.seasonName ??
    `Season ${id}`;

  const getCatColor = (id: number) =>
    availableActivityCategories.find((c) => c.activityCategoryId === id)
      ?.activityCategoryColor ?? theme.accent;

  const getCatName = (id: number) =>
    availableActivityCategories.find((c) => c.activityCategoryId === id)
      ?.activityCategoryName ?? `Category ${id}`;

  const getCatColorByName = (name: string) =>
    availableActivityCategories.find((c) => c.activityCategoryName === name)
      ?.activityCategoryColor ?? theme.accent;

  const filteredCategories = availableActivityCategories.filter((c) =>
    c.activityCategoryName
      .toLowerCase()
      .includes(categorySearchQuery.toLowerCase()),
  );

  const existingCount = activities.filter(
    (a) => !isActivityRemoved(a.activityId),
  ).length;
  const totalCount = existingCount + newActivities.length;

  // Helper to format price with current currency
  const formatActivityPrice = (priceInUSD: number): string => {
    if (!priceInUSD || priceInUSD === 0) return formatPrice(0);
    return formatPrice(priceInUSD);
  };

  // Input focus ring helpers
  const focusHandlers = {
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
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

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
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* ── Panel Header ── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded((p) => !p)}
        whileHover={{ backgroundColor: `${theme.border}30` }}
        whileTap={{ backgroundColor: `${theme.border}50` }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}25 0%, ${theme.accent}10 100%)`,
              color: theme.accent,
            }}
          >
            <Globe className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h2
              className="text-sm sm:text-base font-semibold leading-tight truncate"
              style={{ color: theme.text }}
            >
              Activities Management
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                <span style={{ color: theme.text, fontWeight: 600 }}>
                  {totalCount}
                </span>{" "}
                total
              </span>
              {existingCount > 0 && (
                <>
                  <span
                    className="w-1 h-1 rounded-full hidden xs:block"
                    style={{ backgroundColor: theme.border }}
                  />
                  <span className="text-xs hidden xs:block" style={{ color: theme.textSecondary }}>
                    {existingCount} existing
                  </span>
                </>
              )}
              {newActivities.length > 0 && (
                <>
                  <span
                    className="w-1 h-1 rounded-full hidden xs:block"
                    style={{ backgroundColor: theme.border }}
                  />
                  <span
                    className="text-xs font-medium hidden xs:block"
                    style={{ color: theme.accent }}
                  >
                    +{newActivities.length} new
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: `${theme.primary}10`,
              color: theme.primary,
            }}
          >
            <Banknote className="w-3 h-3" />
            {currentCurrency.code}
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleShowForm();
              if (!isExpanded) setIsExpanded(true);
            }}
            variants={pillVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}CC 100%)`,
              color: "#fff",
              boxShadow: `0 2px 8px ${theme.accent}35`,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </motion.button>
          <motion.div
            variants={chevronVariants}
            animate={isExpanded ? "open" : "closed"}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Panel Body ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="body"
            variants={bodyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            {/* ── New Activity Form ── */}
            <AnimatePresence>
              {showNewActivityForm && (
                <motion.div
                  ref={formRef}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="px-4 sm:px-6 pt-5"
                >
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: `2px solid ${theme.accent}`,
                      boxShadow: `0 0 0 3px ${theme.accent}18`,
                      backgroundColor: theme.background,
                    }}
                  >
                    {/* Form header */}
                    <div
                      className="flex items-center justify-between px-4 sm:px-5 py-3"
                      style={{
                        background: `linear-gradient(90deg, ${theme.accent}10 0%, transparent 100%)`,
                        borderBottom: `1px solid ${theme.accent}25`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: theme.accent }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: theme.text }}
                        >
                          New Activity
                        </span>
                      </div>
                      <motion.button
                        onClick={() => {
                          setShowNewActivityForm(false);
                          setFormErrors({});
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer p-1 rounded transition-colors hover:bg-black/10"
                        style={{ color: theme.textSecondary }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Form fields */}
                    <div
                      className="p-4 sm:p-5 space-y-5 overflow-y-auto"
                      style={{ maxHeight: "70vh" }}
                    >
                      {/* Row: Name + Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldWrap
                          label="Activity Name"
                          required
                          error={formErrors.name}
                          theme={theme}
                        >
                          <input
                            type="text"
                            value={newActivityData.name}
                            onChange={(e) =>
                              setNewActivityData((d) => ({
                                ...d,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{
                              ...fieldBase,
                              borderColor: formErrors.name
                                ? theme.error
                                : theme.border,
                            }}
                            {...focusHandlers}
                            placeholder="e.g., Guided Rock Climb"
                          />
                        </FieldWrap>

                        <FieldWrap
                          label="Duration (hours)"
                          required
                          theme={theme}
                        >
                          <div className="relative">
                            <Clock
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                              style={{ color: theme.textSecondary }}
                            />
                            <input
                              type="number"
                              value={newActivityData.durationHover}
                              onChange={(e) =>
                                setNewActivityData((d) => ({
                                  ...d,
                                  durationHover: parseFloat(e.target.value) || 0,
                                }))
                              }
                              min="0"
                              step="0.5"
                              className="w-full pl-8 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                              style={{
                                ...fieldBase,
                                borderColor: theme.border,
                              }}
                              {...focusHandlers}
                            />
                          </div>
                        </FieldWrap>
                      </div>

                      {/* Description */}
                      <FieldWrap
                        label="Description"
                        required
                        error={formErrors.description}
                        theme={theme}
                      >
                        <textarea
                          value={newActivityData.description}
                          onChange={(e) =>
                            setNewActivityData((d) => ({
                              ...d,
                              description: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm resize-none"
                          style={{
                            ...fieldBase,
                            borderColor: formErrors.description
                              ? theme.error
                              : theme.border,
                          }}
                          {...focusHandlers}
                          rows={3}
                          placeholder="Describe the activity in detail…"
                        />
                      </FieldWrap>

                      {/* Categories */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label
                            className="text-xs font-medium flex items-center gap-1.5"
                            style={{ color: theme.textSecondary }}
                          >
                            <Tag className="w-3 h-3" /> Activity Categories
                          </label>
                          {newActivityData.addActivityCategoriesId.length > 0 && (
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${theme.accent}18`,
                                color: theme.accent,
                              }}
                            >
                              {newActivityData.addActivityCategoriesId.length}{" "}
                              selected
                            </span>
                          )}
                        </div>

                        {/* Selected tags */}
                        <AnimatePresence mode="popLayout">
                          {newActivityData.addActivityCategoriesId.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-3"
                              style={{
                                backgroundColor: `${theme.accent}08`,
                                border: `1px solid ${theme.accent}25`,
                              }}
                            >
                              {newActivityData.addActivityCategoriesId.map(
                                (id, i) => {
                                  const color = getCatColor(id);
                                  return (
                                    <motion.span
                                      key={id}
                                      variants={tagVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                      layout
                                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
                                      style={{
                                        backgroundColor: `${color}18`,
                                        color,
                                        border: `1px solid ${color}35`,
                                      }}
                                    >
                                      <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                      />
                                      {getCatName(id)}
                                      <motion.button
                                        type="button"
                                        onClick={() => handleCategoryToggle(id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer flex items-center justify-center w-4 h-4 rounded-full"
                                        style={{
                                          color,
                                          backgroundColor: `${color}25`,
                                        }}
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </motion.button>
                                    </motion.span>
                                  );
                                },
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Search */}
                        {availableActivityCategories.length > 5 && (
                          <div className="relative mb-2">
                            <input
                              type="text"
                              placeholder="Search categories…"
                              value={categorySearchQuery}
                              onChange={(e) =>
                                setCategorySearchQuery(e.target.value)
                              }
                              className="w-full text-sm rounded-lg px-3 py-1.5 border-2 focus:outline-none"
                              style={{
                                ...fieldBase,
                                borderColor: theme.border,
                              }}
                              {...focusHandlers}
                            />
                            {categorySearchQuery && (
                              <button
                                onClick={() => setCategorySearchQuery("")}
                                className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2"
                                style={{ color: theme.textSecondary }}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Grid */}
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-lg p-2 overflow-y-auto"
                          style={{
                            maxHeight: 200,
                            border: `1px solid ${theme.border}`,
                            backgroundColor: `${theme.border}10`,
                          }}
                        >
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => {
                              const isSelected =
                                newActivityData.addActivityCategoriesId.includes(
                                  cat.activityCategoryId,
                                );
                              const color =
                                cat.activityCategoryColor || theme.accent;
                              return (
                                <motion.label
                                  key={cat.activityCategoryId}
                                  whileHover={{ x: 2 }}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
                                  style={{
                                    backgroundColor: isSelected
                                      ? `${color}12`
                                      : "transparent",
                                    transition: "background-color 0.15s ease",
                                  }}
                                >
                                  <span
                                    className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded"
                                    style={{
                                      backgroundColor: isSelected
                                        ? color
                                        : "transparent",
                                      border: `2px solid ${isSelected ? color : theme.border}`,
                                      transition:
                                        "background 0.15s ease, border-color 0.15s ease",
                                    }}
                                  >
                                    {isSelected && (
                                      <Check
                                        className="w-2.5 h-2.5"
                                        style={{ color: "#fff" }}
                                      />
                                    )}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleCategoryToggle(cat.activityCategoryId)
                                    }
                                    className="sr-only"
                                  />
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span
                                    className="text-xs truncate"
                                    style={{
                                      color: isSelected ? color : theme.text,
                                      fontWeight: isSelected ? 600 : 400,
                                    }}
                                  >
                                    {cat.activityCategoryName}
                                  </span>
                                </motion.label>
                              );
                            })
                          ) : (
                            <p
                              className="col-span-full text-xs text-center py-5"
                              style={{ color: theme.textSecondary }}
                            >
                              No categories match
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Season + Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldWrap
                          label="Season"
                          required
                          error={formErrors.seasonId}
                          icon={<Calendar className="w-3.5 h-3.5" />}
                          theme={theme}
                        >
                          <select
                            value={newActivityData.seasonId}
                            onChange={(e) =>
                              setNewActivityData((d) => ({
                                ...d,
                                seasonId: parseInt(e.target.value),
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm cursor-pointer"
                            style={{
                              ...fieldBase,
                              borderColor: formErrors.seasonId
                                ? theme.error
                                : theme.border,
                            }}
                            {...focusHandlers}
                          >
                            <option value={0}>Select season…</option>
                            {availableSeasons.map((s) => (
                              <option key={s.seasonId} value={s.seasonId}>
                                {s.seasonName}
                              </option>
                            ))}
                          </select>
                        </FieldWrap>

                        <div>
                          <label
                            className="block text-xs font-medium mb-2"
                            style={{ color: theme.textSecondary }}
                          >
                            Status
                          </label>
                          <div className="flex gap-2">
                            {DESTINATION_UPDATE_STATUS_OPTIONS.map((opt) => {
                              const active = newActivityData.status === opt.value;
                              return (
                                <motion.button
                                  key={opt.value}
                                  type="button"
                                  onClick={() =>
                                    setNewActivityData((d) => ({
                                      ...d,
                                      status: opt.value as "ACTIVE" | "INACTIVE",
                                    }))
                                  }
                                  variants={pillVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                  className="cursor-pointer flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left"
                                  style={{
                                    backgroundColor: active
                                      ? `${opt.color}12`
                                      : theme.background,
                                    border: `2px solid ${active ? opt.color : theme.border}`,
                                    boxShadow: active
                                      ? `0 0 0 3px ${opt.color}18`
                                      : "none",
                                    transition:
                                      "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                                  }}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{
                                      backgroundColor: active
                                        ? opt.color
                                        : theme.textSecondary,
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <span
                                      className="block text-xs font-semibold"
                                      style={{
                                        color: active ? opt.color : theme.text,
                                      }}
                                    >
                                      {opt.label}
                                    </span>
                                    <span
                                      className="block text-xs leading-tight"
                                      style={{ color: theme.textSecondary }}
                                    >
                                      {opt.description}
                                    </span>
                                  </div>
                                  {active && (
                                    <CheckCircle2
                                      className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                                      style={{ color: opt.color }}
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Available From / To */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldWrap
                          label="Available From"
                          icon={<Clock className="w-3.5 h-3.5" />}
                          theme={theme}
                        >
                          <input
                            type="time"
                            value={toInputTime(newActivityData.availableFrom)}
                            onChange={(e) =>
                              setNewActivityData((d) => ({
                                ...d,
                                availableFrom: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{
                              ...fieldBase,
                              borderColor: theme.border,
                            }}
                            {...focusHandlers}
                          />
                        </FieldWrap>

                        <FieldWrap
                          label="Available To"
                          icon={<Clock className="w-3.5 h-3.5" />}
                          theme={theme}
                        >
                          <input
                            type="time"
                            value={toInputTime(newActivityData.availableTo)}
                            onChange={(e) =>
                              setNewActivityData((d) => ({
                                ...d,
                                availableTo: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{
                              ...fieldBase,
                              borderColor: theme.border,
                            }}
                            {...focusHandlers}
                          />
                        </FieldWrap>
                      </div>

                      {/* Pricing */}
                      <div
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: `${theme.border}12`,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Banknote className="w-3.5 h-3.5" /> Pricing 
                          <span className="text-xs font-normal normal-case">
                            (Enter in USD - will be converted to {currentCurrency.code})
                          </span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FieldWrap
                            label="Local Price (USD)"
                            required
                            error={formErrors.priceLocal}
                            theme={theme}
                          >
                            <div className="relative">
                              <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                $
                              </span>
                              <input
                                type="number"
                                value={newActivityData.priceLocal}
                                onChange={(e) =>
                                  setNewActivityData((d) => ({
                                    ...d,
                                    priceLocal: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                                style={{
                                  ...fieldBase,
                                  borderColor: formErrors.priceLocal
                                    ? theme.error
                                    : theme.border,
                                }}
                                {...focusHandlers}
                                placeholder="0.00"
                              />
                            </div>
                            {newActivityData.priceLocal > 0 && (
                              <p
                                className="text-xs mt-1"
                                style={{ color: theme.textSecondary }}
                              >
                                ≈ {formatPrice(newActivityData.priceLocal)}
                              </p>
                            )}
                          </FieldWrap>

                          <FieldWrap
                            label="Foreigners Price (USD)"
                            required
                            error={formErrors.priceForeigners}
                            theme={theme}
                          >
                            <div className="relative">
                              <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                $
                              </span>
                              <input
                                type="number"
                                value={newActivityData.priceForeigners}
                                onChange={(e) =>
                                  setNewActivityData((d) => ({
                                    ...d,
                                    priceForeigners: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                min="0"
                                step="0.01"
                                className="w-full pl-7 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                                style={{
                                  ...fieldBase,
                                  borderColor: formErrors.priceForeigners
                                    ? theme.error
                                    : theme.border,
                                }}
                                {...focusHandlers}
                                placeholder="0.00"
                              />
                            </div>
                            {newActivityData.priceForeigners > 0 && (
                              <p
                                className="text-xs mt-1"
                                style={{ color: theme.textSecondary }}
                              >
                                ≈ {formatPrice(newActivityData.priceForeigners)}
                              </p>
                            )}
                          </FieldWrap>
                        </div>
                      </div>

                      {/* Participants */}
                      <div
                        className="rounded-lg p-4"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FieldWrap
                            label="Min"
                            required
                            error={formErrors.minParticipate}
                            theme={theme}
                          >
                            <input
                              type="number"
                              value={newActivityData.minParticipate}
                              onChange={(e) =>
                                setNewActivityData((d) => ({
                                  ...d,
                                  minParticipate: parseInt(e.target.value) || 1,
                                }))
                              }
                              min="1"
                              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                              style={{
                                ...fieldBase,
                                borderColor: formErrors.minParticipate
                                  ? theme.error
                                  : theme.border,
                              }}
                              {...focusHandlers}
                            />
                          </FieldWrap>

                          <FieldWrap label="Max" required theme={theme}>
                            <input
                              type="number"
                              value={newActivityData.maxParticipate}
                              onChange={(e) =>
                                setNewActivityData((d) => ({
                                  ...d,
                                  maxParticipate: parseInt(e.target.value) || 10,
                                }))
                              }
                              min="1"
                              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                              style={{
                                ...fieldBase,
                                borderColor: theme.border,
                              }}
                              {...focusHandlers}
                            />
                          </FieldWrap>
                        </div>
                      </div>

                      {/* Form actions */}
                      <div className="flex gap-3 pt-1">
                        <motion.button
                          type="button"
                          onClick={() => {
                            setShowNewActivityForm(false);
                            setFormErrors({});
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor: theme.background,
                            border: `2px solid ${theme.border}`,
                            color: theme.textSecondary,
                          }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={handleAddActivity}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}BB 100%)`,
                            color: "#fff",
                            boxShadow: `0 2px 10px ${theme.accent}35`,
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Activity
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Existing Activities ── */}
            <div className="px-4 sm:px-6 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-3 h-3" style={{ color: theme.textSecondary }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: theme.textSecondary }}
                >
                  Existing Activities
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${theme.border}60`,
                    color: theme.textSecondary,
                  }}
                >
                  {existingCount}
                </span>
              </div>

              {existingCount === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 rounded-xl"
                  style={{
                    backgroundColor: `${theme.border}15`,
                    border: `1.5px dashed ${theme.border}`,
                  }}
                >
                  <Globe className="w-8 h-8" style={{ color: theme.border }} />
                  <p
                    className="text-sm font-medium mt-3"
                    style={{ color: theme.textSecondary }}
                  >
                    No existing activities
                  </p>
                  <p className="text-xs mt-1" style={{ color: theme.border }}>
                    Add an activity using the button above
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {activities.map(
                      (activity, idx) =>
                        !isActivityRemoved(activity.activityId) && (
                          <motion.div
                            key={activity.activityId}
                            layout
                            variants={activityCardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="rounded-xl overflow-hidden"
                            style={{
                              border: `1px solid ${
                                expandedActivities.includes(activity.activityId)
                                  ? theme.accent
                                  : theme.border
                              }`,
                              backgroundColor: theme.background,
                              transition: "border-color 0.2s ease",
                            }}
                          >
                            {/* Card row - Clickable for expansion */}
                            <div
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                              onClick={() => toggleActivity(activity.activityId)}
                              style={{
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${theme.border}20`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <motion.div
                                animate={{
                                  rotate: expandedActivities.includes(activity.activityId) ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg"
                                style={{
                                  color: theme.textSecondary,
                                  backgroundColor: `${theme.border}40`,
                                }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium truncate"
                                  style={{ color: theme.text }}
                                >
                                  {activity.activityName}
                                </p>
                                <p
                                  className="text-xs mt-0.5 truncate"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {activity.durationHours}h ·{" "}
                                  {activity.activityCategories?.join(", ") ||
                                    "No categories"}
                                </p>
                              </div>

                              {/* Price chip - formatted with currency */}
                              <span
                                className="hidden sm:inline-block text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                                style={{
                                  backgroundColor: `${theme.accent}12`,
                                  color: theme.accent,
                                }}
                              >
                                {formatActivityPrice(activity.priceLocal || 0)}
                              </span>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {/* View Button */}
                                <Link
                                  href={`${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activity.activityId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <motion.button
                                    onClick={(e) => e.stopPropagation()}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg"
                                    style={{
                                      color: theme.primary,
                                      backgroundColor: `${theme.primary}10`,
                                    }}
                                    title="View activity details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </motion.button>
                                </Link>

                                {/* Remove Button with Confirm */}
                                <AnimatePresence mode="wait">
                                  {removeConfirm === activity.activityId ? (
                                    <motion.div
                                      key="confirm"
                                      variants={confirmVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                                      style={{
                                        backgroundColor: `${theme.error}10`,
                                        border: `1px solid ${theme.error}40`,
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span
                                        className="text-xs font-medium"
                                        style={{ color: theme.error }}
                                      >
                                        Remove?
                                      </span>
                                      <motion.button
                                        onClick={() => {
                                          onRemoveActivity(activity.activityId);
                                          setRemoveConfirm(null);
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded"
                                        style={{
                                          backgroundColor: theme.error,
                                          color: "#fff",
                                        }}
                                      >
                                        <Check className="w-3 h-3" />
                                      </motion.button>
                                      <motion.button
                                        onClick={() => setRemoveConfirm(null)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="cursor-pointer w-5 h-5 flex items-center justify-center rounded"
                                        style={{
                                          backgroundColor: `${theme.border}60`,
                                          color: theme.textSecondary,
                                        }}
                                      >
                                        <X className="w-3 h-3" />
                                      </motion.button>
                                    </motion.div>
                                  ) : (
                                    <motion.button
                                      key="trash"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRemoveConfirm(activity.activityId);
                                      }}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg"
                                      style={{
                                        color: theme.error,
                                        backgroundColor: `${theme.error}10`,
                                      }}
                                      title="Remove activity"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {/* Expanded read-only details */}
                            <AnimatePresence>
                              {expandedActivities.includes(activity.activityId) && (
                                <motion.div
                                  variants={activityBodyVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  className="px-4 pb-4 space-y-4"
                                  style={{ borderTop: `1px solid ${theme.border}` }}
                                >
                                  <div
                                    className="flex items-center gap-1.5 pt-3 text-xs"
                                    style={{ color: theme.textSecondary }}
                                  >
                                    <Lock className="w-3 h-3" />
                                    Read-only — only removal is allowed
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <ROField label="Activity Name" theme={theme}>
                                      {activity.activityName}
                                    </ROField>
                                    <ROField label="Duration" theme={theme}>
                                      {activity.durationHours} hours
                                    </ROField>
                                  </div>

                                  <ROField label="Description" theme={theme}>
                                    <span className="whitespace-pre-wrap">
                                      {activity.activityDescription}
                                    </span>
                                  </ROField>

                                  {/* Categories */}
                                  <div>
                                    <label
                                      className="block text-xs font-medium mb-2"
                                      style={{ color: theme.textSecondary }}
                                    >
                                      Categories
                                    </label>
                                    <div
                                      className="flex flex-wrap gap-1.5 p-2.5 rounded-lg"
                                      style={{
                                        backgroundColor: `${theme.border}20`,
                                        border: `1px solid ${theme.border}`,
                                      }}
                                    >
                                      {activity.activityCategories?.length > 0 ? (
                                        activity.activityCategories.map(
                                          (catName) => {
                                            const color = getCatColorByName(catName);
                                            return (
                                              <span
                                                key={catName}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                                                style={{
                                                  backgroundColor: `${color}15`,
                                                  color,
                                                  border: `1px solid ${color}30`,
                                                }}
                                              >
                                                <span
                                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                  style={{ backgroundColor: color }}
                                                />
                                                {catName}
                                              </span>
                                            );
                                          },
                                        )
                                      ) : (
                                        <span
                                          className="text-xs italic"
                                          style={{ color: theme.textSecondary }}
                                        >
                                          No categories assigned
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Season + Times */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <ROField label="Season" theme={theme}>
                                      {activity.season}
                                    </ROField>
                                    <ROField label="Available From" theme={theme}>
                                      {formatTimeDisplay(activity.availableFrom)}
                                    </ROField>
                                    <ROField label="Available To" theme={theme}>
                                      {formatTimeDisplay(activity.availableTo)}
                                    </ROField>
                                  </div>

                                  {/* Prices + Participants - formatted with currency */}
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <ROField label="Local Price" theme={theme}>
                                      {formatActivityPrice(activity.priceLocal || 0)}
                                    </ROField>
                                    <ROField label="Foreigners Price" theme={theme}>
                                      {formatActivityPrice(activity.priceForeigners || 0)}
                                    </ROField>
                                    <ROField label="Min Participants" theme={theme}>
                                      {activity.minParticipate}
                                    </ROField>
                                    <ROField label="Max Participants" theme={theme}>
                                      {activity.maxParticipate}
                                    </ROField>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ),
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── New Activities Preview ── */}
            <AnimatePresence>
              {newActivities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 sm:px-6 pt-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3 h-3" style={{ color: theme.accent }} />
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: theme.accent }}
                    >
                      Pending to Add
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${theme.accent}18`,
                        color: theme.accent,
                      }}
                    >
                      {newActivities.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {newActivities.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        variants={activityCardVariants}
                        initial="hidden"
                        animate="visible"
                        className="rounded-xl px-4 py-3 flex items-start gap-3"
                        style={{
                          border: `2px solid ${theme.accent}`,
                          backgroundColor: `${theme.accent}06`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            style={{ color: theme.text }}
                          >
                            {activity.name}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {activity.durationHover}h ·{" "}
                            {getSeasonName(activity.seasonId)} ·{" "}
                            {formatActivityPrice(activity.priceLocal)}
                          </p>
                          {activity.addActivityCategoriesId.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {activity.addActivityCategoriesId.map((id) => {
                                const cat = availableActivityCategories.find(
                                  (c) => c.activityCategoryId === id,
                                );
                                const color =
                                  cat?.activityCategoryColor || theme.accent;
                                return (
                                  <span
                                    key={id}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs"
                                    style={{
                                      backgroundColor: `${color}15`,
                                      color,
                                    }}
                                  >
                                    <span
                                      className="w-1 h-1 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: color }}
                                    />
                                    {cat?.activityCategoryName ?? `Cat ${id}`}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <span
                          className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: theme.accent,
                            color: "#fff",
                          }}
                        >
                          New
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error Banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 sm:px-6 py-3 flex items-center gap-2 text-sm overflow-hidden"
            style={{
              borderTop: `1px solid ${theme.error}30`,
              backgroundColor: `${theme.error}08`,
              color: theme.error,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const FieldWrap: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  theme: any;
}> = ({ label, required, error, icon, children, theme }) => {
  return (
    <div>
      <label
        className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
        style={{ color: error ? theme.error : theme.textSecondary }}
      >
        {icon && (
          <span style={{ color: error ? theme.error : theme.textSecondary }}>
            {icon}
          </span>
        )}
        {label}
        {required && (
          <span style={{ color: theme.error }} aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="text-xs mt-1 flex items-center gap-1"
          style={{ color: theme.error }}
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const ROField: React.FC<{
  label: string;
  theme: any;
  children: React.ReactNode;
}> = ({ label, theme, children }) => (
  <div>
    <label
      className="block text-xs font-medium mb-1"
      style={{ color: theme.textSecondary }}
    >
      {label}
    </label>
    <div
      className="w-full px-3 py-2 rounded-lg text-sm"
      style={{
        backgroundColor: `${theme.border}25`,
        color: theme.textSecondary,
        border: `1px solid ${theme.border}`,
        cursor: "not-allowed",
        minHeight: 36,
      }}
    >
      {children}
    </div>
  </div>
);