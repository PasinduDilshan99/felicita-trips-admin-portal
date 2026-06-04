"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Plus, X, ChevronDown, Trash2, Clock, Users, DollarSign, Calendar, Tag, Sparkles, Eye, ChevronRight, MapPin, Info } from "lucide-react";
import { Activity as ActivityType, NewActivityRequest } from "@/types/destination-types";
import { ActivityCategory, SeasonType } from "@/types/common-types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cardVariants, sectionVariants } from "@/app/animations/variants";
import { DESTINATION_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

interface DestinationActivitiesFormProps {
  activities: ActivityType[];
  removedActivities: number[];
  newActivities: NewActivityRequest[];
  availableActivityCategories: ActivityCategory[];
  availableSeasons: SeasonType[];
  onRemoveActivity: (activityId: number) => void;
  onAddNewActivity: (activity: NewActivityRequest) => void;
  onViewActivity?: (activityId: number) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const DestinationActivitiesForm: React.FC<DestinationActivitiesFormProps> = ({
  activities,
  removedActivities,
  newActivities,
  availableActivityCategories,
  availableSeasons,
  onRemoveActivity,
  onAddNewActivity,
  onViewActivity,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const { formatPrice } = useCurrency();
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());
  const formRef = React.useRef<HTMLDivElement>(null);

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

  const toggleActivityExpand = (activityId: number) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
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
    if (!newActivityData.description.trim()) errs.description = "Description is required";
    if (!newActivityData.seasonId) errs.seasonId = "Please select a season";
    if (newActivityData.priceLocal <= 0) errs.priceLocal = "Local price must be greater than 0";
    if (newActivityData.priceForeigners <= 0) errs.priceForeigners = "Foreigners price must be greater than 0";
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
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const getSeasonName = (id: number) =>
    availableSeasons.find((s) => s.seasonId === id)?.seasonName ?? `Season ${id}`;

  const getCatColor = (id: number) =>
    availableActivityCategories.find((c) => c.activityCategoryId === id)
      ?.activityCategoryColor ?? theme.accent;

  const getCatName = (id: number) =>
    availableActivityCategories.find((c) => c.activityCategoryId === id)
      ?.activityCategoryName ?? `Category ${id}`;

  const filteredCategories = availableActivityCategories.filter((c) =>
    c.activityCategoryName.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const existingCount = activities.filter((a) => !isActivityRemoved(a.activityId)).length;
  const totalCount = existingCount + newActivities.length;

  const formatActivityPrice = (priceInUSD: number): string => {
    if (!priceInUSD || priceInUSD === 0) return formatPrice(0);
    return formatPrice(priceInUSD);
  };

  const toInputTime = (raw: string | null | undefined): string => {
    if (!raw) return "";
    return raw.slice(0, 5);
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("activities")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("activities") ? `${theme.accent}05` : "transparent",
          borderBottom: expandedSections.has("activities") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}25 0%, ${theme.accent}10 100%)`,
              color: theme.accent,
            }}
          >
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Activities Management
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {totalCount} total ({existingCount} existing, {newActivities.length} new)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShowForm();
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer transition-all"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}CC 100%)`,
              color: "#fff",
              boxShadow: `0 2px 8px ${theme.accent}35`,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("activities") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("activities") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* New Activity Form */}
            <AnimatePresence>
              {showNewActivityForm && (
                <motion.div
                  ref={formRef}
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  className="mb-6 rounded-xl overflow-hidden"
                  style={{
                    border: `2px solid ${theme.accent}`,
                    boxShadow: `0 0 0 3px ${theme.accent}18`,
                    backgroundColor: theme.background,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 sm:px-5 py-3"
                    style={{
                      background: `linear-gradient(90deg, ${theme.accent}10 0%, transparent 100%)`,
                      borderBottom: `1px solid ${theme.accent}25`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
                      <span className="text-sm font-semibold" style={{ color: theme.text }}>
                        New Activity
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNewActivityForm(false);
                        setFormErrors({});
                      }}
                      className="p-1 rounded transition-colors hover:bg-black/10"
                      style={{ color: theme.textSecondary }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-5 overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Activity Name <span style={{ color: theme.error }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={newActivityData.name}
                          onChange={(e) => setNewActivityData((d) => ({ ...d, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: formErrors.name ? theme.error : theme.border }}
                          {...focusHandlers}
                          placeholder="e.g., Guided Rock Climb"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Duration (hours) <span style={{ color: theme.error }}>*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
                          <input
                            type="number"
                            value={newActivityData.durationHover}
                            onChange={(e) => setNewActivityData((d) => ({ ...d, durationHover: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            step="0.5"
                            className="w-full pl-8 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                        Description <span style={{ color: theme.error }}>*</span>
                      </label>
                      <textarea
                        value={newActivityData.description}
                        onChange={(e) => setNewActivityData((d) => ({ ...d, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: formErrors.description ? theme.error : theme.border }}
                        {...focusHandlers}
                        rows={3}
                        placeholder="Describe the activity in detail…"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                          <Tag className="w-3 h-3" /> Activity Categories
                        </label>
                        {newActivityData.addActivityCategoriesId.length > 0 && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}>
                            {newActivityData.addActivityCategoriesId.length} selected
                          </span>
                        )}
                      </div>

                      {/* Selected tags */}
                      {newActivityData.addActivityCategoriesId.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg mb-3" style={{ backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}25` }}>
                          {newActivityData.addActivityCategoriesId.map((id) => {
                            const color = getCatColor(id);
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}35` }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                {getCatName(id)}
                                <button
                                  type="button"
                                  onClick={() => handleCategoryToggle(id)}
                                  className="flex items-center justify-center w-4 h-4 rounded-full"
                                  style={{ color, backgroundColor: `${color}25` }}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Search */}
                      {availableActivityCategories.length > 5 && (
                        <div className="relative mb-2">
                          <input
                            type="text"
                            placeholder="Search categories…"
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            className="w-full text-sm rounded-lg px-3 py-1.5 border-2 focus:outline-none"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                      )}

                      {/* Grid */}
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-lg p-2 overflow-y-auto"
                        style={{ maxHeight: 200, border: `1px solid ${theme.border}`, backgroundColor: `${theme.border}10` }}
                      >
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => {
                            const isSelected = newActivityData.addActivityCategoriesId.includes(cat.activityCategoryId);
                            const color = cat.activityCategoryColor || theme.accent;
                            return (
                              <label
                                key={cat.activityCategoryId}
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
                                style={{ backgroundColor: isSelected ? `${color}12` : "transparent" }}
                              >
                                <span
                                  className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded"
                                  style={{
                                    backgroundColor: isSelected ? color : "transparent",
                                    border: `2px solid ${isSelected ? color : theme.border}`,
                                  }}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5" style={{ color: "#fff" }} />}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleCategoryToggle(cat.activityCategoryId)}
                                  className="sr-only"
                                />
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs truncate" style={{ color: isSelected ? color : theme.text, fontWeight: isSelected ? 600 : 400 }}>
                                  {cat.activityCategoryName}
                                </span>
                              </label>
                            );
                          })
                        ) : (
                          <p className="col-span-full text-xs text-center py-5" style={{ color: theme.textSecondary }}>
                            No categories match
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Season + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Season <span style={{ color: theme.error }}>*</span>
                        </label>
                        <select
                          value={newActivityData.seasonId}
                          onChange={(e) => setNewActivityData((d) => ({ ...d, seasonId: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm cursor-pointer"
                          style={{ ...fieldBase, borderColor: formErrors.seasonId ? theme.error : theme.border }}
                          {...focusHandlers}
                        >
                          <option value={0}>Select season…</option>
                          {availableSeasons.map((s) => (
                            <option key={s.seasonId} value={s.seasonId}>{s.seasonName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Status
                        </label>
                        <div className="flex gap-2">
                          {DESTINATION_UPDATE_STATUS_OPTIONS.map((opt) => {
                            const active = newActivityData.status === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setNewActivityData((d) => ({ ...d, status: opt.value as "ACTIVE" | "INACTIVE" }))}
                                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer transition-all"
                                style={{
                                  backgroundColor: active ? `${opt.color}12` : theme.background,
                                  border: `2px solid ${active ? opt.color : theme.border}`,
                                }}
                              >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? opt.color : theme.textSecondary }} />
                                <div className="min-w-0">
                                  <span className="block text-xs font-semibold" style={{ color: active ? opt.color : theme.text }}>
                                    {opt.label}
                                  </span>
                                  <span className="block text-xs" style={{ color: theme.textSecondary }}>
                                    {opt.description}
                                  </span>
                                </div>
                                {active && (
                                  <Check className="w-3.5 h-3.5 ml-auto" style={{ color: opt.color }} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Available From / To */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Available From
                        </label>
                        <input
                          type="time"
                          value={toInputTime(newActivityData.availableFrom)}
                          onChange={(e) => setNewActivityData((d) => ({ ...d, availableFrom: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Available To
                        </label>
                        <input
                          type="time"
                          value={toInputTime(newActivityData.availableTo)}
                          onChange={(e) => setNewActivityData((d) => ({ ...d, availableTo: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${theme.border}12`, border: `1px solid ${theme.border}` }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                        <DollarSign className="w-3.5 h-3.5" /> Pricing
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                            Local Price (USD) <span style={{ color: theme.error }}>*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: theme.textSecondary }}>$</span>
                            <input
                              type="number"
                              value={newActivityData.priceLocal}
                              onChange={(e) => setNewActivityData((d) => ({ ...d, priceLocal: parseFloat(e.target.value) || 0 }))}
                              min="0"
                              step="0.01"
                              className="w-full pl-7 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                              style={{ ...fieldBase, borderColor: formErrors.priceLocal ? theme.error : theme.border }}
                              {...focusHandlers}
                              placeholder="0.00"
                            />
                          </div>
                          {newActivityData.priceLocal > 0 && (
                            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                              ≈ {formatPrice(newActivityData.priceLocal)}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                            Foreigners Price (USD) <span style={{ color: theme.error }}>*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: theme.textSecondary }}>$</span>
                            <input
                              type="number"
                              value={newActivityData.priceForeigners}
                              onChange={(e) => setNewActivityData((d) => ({ ...d, priceForeigners: parseFloat(e.target.value) || 0 }))}
                              min="0"
                              step="0.01"
                              className="w-full pl-7 pr-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                              style={{ ...fieldBase, borderColor: formErrors.priceForeigners ? theme.error : theme.border }}
                              {...focusHandlers}
                              placeholder="0.00"
                            />
                          </div>
                          {newActivityData.priceForeigners > 0 && (
                            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                              ≈ {formatPrice(newActivityData.priceForeigners)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${theme.border}12`, border: `1px solid ${theme.border}` }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                        <Users className="w-3.5 h-3.5" /> Participants
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                            Min <span style={{ color: theme.error }}>*</span>
                          </label>
                          <input
                            type="number"
                            value={newActivityData.minParticipate}
                            onChange={(e) => setNewActivityData((d) => ({ ...d, minParticipate: parseInt(e.target.value) || 1 }))}
                            min="1"
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{ ...fieldBase, borderColor: formErrors.minParticipate ? theme.error : theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                            Max <span style={{ color: theme.error }}>*</span>
                          </label>
                          <input
                            type="number"
                            value={newActivityData.maxParticipate}
                            onChange={(e) => setNewActivityData((d) => ({ ...d, maxParticipate: parseInt(e.target.value) || 10 }))}
                            min="1"
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewActivityForm(false);
                          setFormErrors({});
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: theme.background,
                          border: `2px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddActivity}
                        className="flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}BB 100%)`,
                          color: "#fff",
                          boxShadow: `0 2px 10px ${theme.accent}35`,
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Existing Activities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                  Existing Activities
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${theme.border}60`, color: theme.textSecondary }}>
                  {existingCount}
                </span>
              </div>

              {existingCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 rounded-xl" style={{ backgroundColor: `${theme.border}15`, border: `1.5px dashed ${theme.border}` }}>
                  <Activity className="w-8 h-8" style={{ color: theme.border }} />
                  <p className="text-sm font-medium mt-3" style={{ color: theme.textSecondary }}>No existing activities</p>
                  <p className="text-xs mt-1" style={{ color: theme.border }}>Add an activity using the button above</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activities.map((activity) => (
                    !isActivityRemoved(activity.activityId) && (
                      <motion.div
                        key={activity.activityId}
                        layout
                        className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${theme.border}`, backgroundColor: theme.background }}
                      >
                        {/* Activity Header - Always visible */}
                        <div 
                          className="p-4 cursor-pointer transition-colors hover:bg-opacity-50"
                          style={{ backgroundColor: expandedActivities.has(activity.activityId) ? `${theme.accent}05` : "transparent" }}
                          onClick={() => toggleActivityExpand(activity.activityId)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4" style={{ color: theme.accent }} />
                                <p className="text-sm font-semibold" style={{ color: theme.text }}>
                                  {activity.activityName}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                <span className="text-xs flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                  <Clock className="w-3 h-3" />
                                  {activity.durationHours}h
                                </span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ backgroundColor: `${theme.accent}12`, color: theme.accent }}>
                                  {formatActivityPrice(activity.priceLocal || 0)}
                                </span>
                                {activity.activityCategories && activity.activityCategories.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" style={{ color: theme.textSecondary }} />
                                    <span className="text-xs truncate max-w-[200px]" style={{ color: theme.textSecondary }}>
                                      {activity.activityCategories.slice(0, 2).join(", ")}
                                      {activity.activityCategories.length > 2 && ` +${activity.activityCategories.length - 2}`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {/* View button */}
                              {onViewActivity && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewActivity(activity.activityId);
                                  }}
                                  className="p-2 rounded-lg transition-all hover:bg-blue-500/10"
                                  style={{ color: theme.primary }}
                                  title="View activity details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              {/* Remove button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveActivity(activity.activityId);
                                }}
                                className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                                style={{ color: theme.error }}
                                title="Remove activity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {/* Expand/Collapse button */}
                              <motion.div
                                animate={{ rotate: expandedActivities.has(activity.activityId) ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-1"
                              >
                                <ChevronRight className="w-4 h-4" style={{ color: theme.textSecondary }} />
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedActivities.has(activity.activityId) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-t"
                              style={{ borderColor: theme.border }}
                            >
                              <div className="p-4 space-y-4">
                                {/* Description */}
                                {activity.activityDescription && (
                                  <div>
                                    <p className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                      <Info className="w-3 h-3" /> Description
                                    </p>
                                    <p className="text-sm" style={{ color: theme.text }}>
                                      {activity.activityDescription}
                                    </p>
                                  </div>
                                )}

                                {/* Detailed Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Pricing Details */}
                                  <div className="rounded-lg p-3" style={{ backgroundColor: `${theme.border}10` }}>
                                    <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                      <DollarSign className="w-3 h-3" /> Pricing Details
                                    </p>
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between text-sm">
                                        <span style={{ color: theme.textSecondary }}>Local Price:</span>
                                        <span className="font-semibold" style={{ color: theme.text }}>
                                          {formatActivityPrice(activity.priceLocal || 0)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span style={{ color: theme.textSecondary }}>Foreigners Price:</span>
                                        <span className="font-semibold" style={{ color: theme.text }}>
                                          {formatActivityPrice(activity.priceForeigners || 0)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Schedule Details */}
                                  <div className="rounded-lg p-3" style={{ backgroundColor: `${theme.border}10` }}>
                                    <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                      <Calendar className="w-3 h-3" /> Schedule
                                    </p>
                                    <div className="space-y-1.5">
                                      {activity.availableFrom && activity.availableTo && (
                                        <div className="flex justify-between text-sm">
                                          <span style={{ color: theme.textSecondary }}>Available Hours:</span>
                                          <span className="font-semibold" style={{ color: theme.text }}>
                                            {activity.availableFrom.slice(0,5)} - {activity.availableTo.slice(0,5)}
                                          </span>
                                        </div>
                                      )}
                                      {activity.season && (
                                        <div className="flex justify-between text-sm">
                                          <span style={{ color: theme.textSecondary }}>Season:</span>
                                          <span className="font-semibold" style={{ color: theme.accent }}>
                                            {activity.season}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Participants Details */}
                                  <div className="rounded-lg p-3" style={{ backgroundColor: `${theme.border}10` }}>
                                    <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                      <Users className="w-3 h-3" /> Participants
                                    </p>
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between text-sm">
                                        <span style={{ color: theme.textSecondary }}>Min / Max:</span>
                                        <span className="font-semibold" style={{ color: theme.text }}>
                                          {activity.minParticipate || 1} - {activity.maxParticipate || 10}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Categories */}
                                  {activity.activityCategories && activity.activityCategories.length > 0 && (
                                    <div className="rounded-lg p-3" style={{ backgroundColor: `${theme.border}10` }}>
                                      <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
                                        <Tag className="w-3 h-3" /> Categories
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {activity.activityCategories.map((cat, idx) => (
                                          <span
                                            key={idx}
                                            className="text-xs px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: `${theme.accent}12`, color: theme.accent }}
                                          >
                                            {cat}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* New Activities Preview */}
            {newActivities.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: theme.accent }}>
                  <Sparkles className="w-3 h-3" /> New Activities to Add ({newActivities.length})
                </p>
                <div className="space-y-2">
                  {newActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ backgroundColor: `${theme.accent}10`, border: `1px dashed ${theme.accent}` }}
                    >
                      <Activity className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text }}>{activity.name}</p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {activity.durationHover}h · {getSeasonName(activity.seasonId)} · {formatActivityPrice(activity.priceLocal)}
                        </p>
                      </div>
                      <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.accent }}>
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);