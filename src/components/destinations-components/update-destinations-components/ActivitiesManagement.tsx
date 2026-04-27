"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Plus,
  ChevronDown,
  ChevronUp,
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
  Layers,
  Sparkles,
} from "lucide-react";
import { Activity, NewActivityRequest } from "@/types/destination-types";
import { ActivityCategory, SeasonType } from "@/types/common-types";
import { useTheme } from "@/contexts/ThemeContext";

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

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Available for booking",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Temporarily unavailable",
    color: "#6b7280",
    bg: "#F9FAFB",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Strips microseconds / seconds from a backend time string like "08:00:00.000000" → "08:00" */
const formatTimeDisplay = (raw: string | null | undefined): string => {
  if (!raw) return "Not set";
  // Keep only HH:MM
  return raw.slice(0, 5);
};

/** Converts a full "HH:MM:SS.ffffff" to "HH:MM" for <input type="time"> */
const toInputTime = (raw: string | null | undefined): string => {
  if (!raw) return "";
  return raw.slice(0, 5);
};

// ─── Component ──────────────────────────────────────────────────────────────

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

  const toggleActivity = (id: number) =>
    setExpandedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

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

  // Input focus ring helpers
  const focusStyle = (hasError?: boolean): React.CSSProperties => ({
    backgroundColor: theme.background,
    color: theme.text,
    border: `1.5px solid ${hasError ? theme.error : theme.border}`,
    transition:
      "border-color 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s cubic-bezier(0.22,1,0.36,1)",
  });

  const onFocus = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = theme.primary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}1A`;
  };
  const onBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = theme.border;
    e.currentTarget.style.boxShadow = "none";
  };

  const readOnly: React.CSSProperties = {
    backgroundColor: `${theme.border}25`,
    color: theme.textSecondary,
    border: `1.5px solid ${theme.border}`,
    cursor: "not-allowed",
  };

  return (
    <>
      <style>{`
        /* ── Keyframes ─────────────────────────────────────────── */
        @keyframes am-fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes am-slideDown {
          from { opacity: 0; transform: translateY(-16px) scaleY(0.97); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes am-cardIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes am-tagPop {
          0%   { opacity: 0; transform: scale(0.8); }
          65%  { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes am-expandBody {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes am-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-4px); }
          40%     { transform: translateX(4px); }
          60%     { transform: translateX(-3px); }
          80%     { transform: translateX(3px); }
        }

        /* ── Utility classes ──────────────────────────────────── */
        .am-panel-body   { animation: am-fadeSlide 0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .am-form-wrap    { animation: am-slideDown 0.3s  cubic-bezier(0.22,1,0.36,1) both; }
        .am-card         { animation: am-cardIn   0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .am-card-body    { animation: am-expandBody 0.22s cubic-bezier(0.22,1,0.36,1) both; }
        .am-tag          { animation: am-tagPop    0.22s cubic-bezier(0.22,1,0.36,1) both; }
        .am-shake        { animation: am-shake     0.4s  cubic-bezier(0.22,1,0.36,1); }

        /* ── Status pills ─────────────────────────────────────── */
        .am-status-pill {
          transition: background 0.18s ease, border-color 0.18s ease,
                      box-shadow 0.18s ease, transform 0.15s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        .am-status-pill:hover { transform: translateY(-1px); }
        .am-status-pill:active { transform: translateY(0) scale(0.98); }

        /* ── Category rows ────────────────────────────────────── */
        .am-cat-row {
          transition: background 0.15s ease, transform 0.15s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        .am-cat-row:hover { transform: translateX(2px); }

        /* ── Remove / icon btns ───────────────────────────────── */
        .am-icon-btn {
          transition: background 0.15s ease, color 0.15s ease,
                      transform 0.15s cubic-bezier(0.22,1,0.36,1);
        }
        .am-icon-btn:hover { transform: scale(1.18); }
        .am-icon-btn:active { transform: scale(0.95); }

        /* ── Add-activity CTA ─────────────────────────────────── */
        .am-add-btn {
          transition: background 0.18s ease, box-shadow 0.18s ease,
                      transform 0.15s cubic-bezier(0.22,1,0.36,1);
        }
        .am-add-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(13,78,74,0.22);
        }
        .am-add-btn:active { transform: translateY(0) scale(0.98); }

        /* ── Toggle header ────────────────────────────────────── */
        .am-header { transition: background 0.18s ease; }
        .am-header:hover { background: rgba(20,184,166,0.04); }

        /* ── Section divider ──────────────────────────────────── */
        .am-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .am-section-label::after {
          content: "";
          flex: 1;
          height: 1px;
          background: currentColor;
          opacity: 0.12;
        }

        /* ── Scrollbar inside lists ───────────────────────────── */
        .am-scroll::-webkit-scrollbar { width: 4px; }
        .am-scroll::-webkit-scrollbar-track { background: transparent; }
        .am-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }

        /* ── Confirmation overlay ─────────────────────────────── */
        .am-confirm {
          animation: am-fadeSlide 0.18s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── Responsive overrides ─────────────────────────────── */
        @media (max-width: 480px) {
          .am-grid-2 { grid-template-columns: 1fr !important; }
          .am-hide-xs { display: none !important; }
          .am-stat-row { flex-wrap: wrap; gap: 8px; }
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1.5px solid ${error ? theme.error : theme.border}`,
          boxShadow: error
            ? `0 0 0 3px ${theme.error}18, 0 4px 24px rgba(0,0,0,0.06)`
            : "0 4px 24px rgba(0,0,0,0.06)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* ── Panel Header ─────────────────────────────────────── */}
        <div
          className="am-header flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
          style={{ borderBottom: `1.5px solid ${theme.border}` }}
          onClick={() => setIsExpanded((p) => !p)}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}25 0%, ${theme.accent}10 100%)`,
                color: theme.accent,
              }}
            >
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold leading-tight"
                style={{ color: theme.text }}
              >
                Activities Management
              </h2>
              <div
                className="am-stat-row flex items-center gap-3 mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                <span className="text-xs">
                  <span style={{ color: theme.text, fontWeight: 600 }}>
                    {totalCount}
                  </span>{" "}
                  total
                </span>
                <span
                  className="w-1 h-1 rounded-full am-hide-xs"
                  style={{ backgroundColor: theme.border }}
                />
                <span className="text-xs am-hide-xs">
                  {existingCount} existing
                </span>
                {newActivities.length > 0 && (
                  <>
                    <span
                      className="w-1 h-1 rounded-full am-hide-xs"
                      style={{ backgroundColor: theme.border }}
                    />
                    <span
                      className="text-xs font-medium"
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShowForm();
                if (!isExpanded) setIsExpanded(true);
              }}
              className="am-add-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}CC 100%)`,
                color: "#fff",
                boxShadow: `0 2px 8px ${theme.accent}35`,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <span
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${theme.border}40`,
                color: theme.textSecondary,
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* ── Panel Body ───────────────────────────────────────── */}
        {isExpanded && (
          <div className="am-panel-body">
            {/* ── New Activity Form ────────────────────────────── */}
            {showNewActivityForm && (
              <div ref={formRef} className="am-form-wrap px-4 sm:px-6 pt-5">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: `2px solid ${theme.accent}`,
                    boxShadow: `0 0 0 4px ${theme.accent}12, 0 8px 32px ${theme.accent}10`,
                    backgroundColor: theme.background,
                  }}
                >
                  {/* Form header */}
                  <div
                    className="flex items-center justify-between px-4 sm:px-5 py-3"
                    style={{
                      background: `linear-gradient(90deg, ${theme.accent}10 0%, transparent 100%)`,
                      borderBottom: `1.5px solid ${theme.accent}25`,
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
                    <button
                      onClick={() => {
                        setShowNewActivityForm(false);
                        setFormErrors({});
                      }}
                      className="am-icon-btn w-7 h-7 flex items-center justify-center rounded-lg"
                      style={{
                        color: theme.textSecondary,
                        backgroundColor: `${theme.border}40`,
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div
                    className="am-scroll p-4 sm:p-5 space-y-5 overflow-y-auto"
                    style={{ maxHeight: "70vh" }}
                  >
                    {/* Row: Name + Duration */}
                    <div
                      className="grid gap-4"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                      }}
                    >
                      <FieldWrap
                        label="Activity Name"
                        required
                        error={formErrors.name}
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
                          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                          style={focusStyle(!!formErrors.name)}
                          onFocus={onFocus}
                          onBlur={onBlur}
                          placeholder="e.g., Guided Rock Climb"
                        />
                      </FieldWrap>

                      <FieldWrap label="Duration (hours)" required>
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
                            className="w-full pl-8 pr-3 py-2 rounded-xl text-sm focus:outline-none"
                            style={focusStyle()}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </div>
                      </FieldWrap>
                    </div>

                    {/* Description */}
                    <FieldWrap
                      label="Description"
                      required
                      error={formErrors.description}
                    >
                      <textarea
                        value={newActivityData.description}
                        onChange={(e) =>
                          setNewActivityData((d) => ({
                            ...d,
                            description: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
                        style={focusStyle(!!formErrors.description)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        rows={3}
                        placeholder="Describe the activity in detail…"
                      />
                    </FieldWrap>

                    {/* ── Categories ── */}
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
                      {newActivityData.addActivityCategoriesId.length > 0 && (
                        <div
                          className="flex flex-wrap gap-1.5 p-3 rounded-xl mb-3"
                          style={{
                            backgroundColor: `${theme.accent}08`,
                            border: `1.5px solid ${theme.accent}25`,
                          }}
                        >
                          {newActivityData.addActivityCategoriesId.map(
                            (id, i) => {
                              const color = getCatColor(id);
                              return (
                                <span
                                  key={id}
                                  className="am-tag inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${color}18`,
                                    color,
                                    border: `1px solid ${color}35`,
                                    animationDelay: `${i * 30}ms`,
                                  }}
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {getCatName(id)}
                                  <button
                                    type="button"
                                    onClick={() => handleCategoryToggle(id)}
                                    className="am-icon-btn flex items-center justify-center w-4 h-4 rounded-full"
                                    style={{
                                      color,
                                      backgroundColor: `${color}25`,
                                    }}
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              );
                            },
                          )}
                        </div>
                      )}

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
                            className="w-full text-sm rounded-xl px-3 py-1.5 focus:outline-none"
                            style={focusStyle()}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                          {categorySearchQuery && (
                            <button
                              onClick={() => setCategorySearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2"
                              style={{ color: theme.textSecondary }}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Grid */}
                      <div
                        className="am-scroll grid gap-1 rounded-xl p-2 overflow-y-auto"
                        style={{
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(160px, 1fr))",
                          maxHeight: 200,
                          border: `1.5px solid ${theme.border}`,
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
                              <label
                                key={cat.activityCategoryId}
                                className="am-cat-row flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                                style={{
                                  backgroundColor: isSelected
                                    ? `${color}12`
                                    : "transparent",
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
                              </label>
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

                    {/* ── Season + Status ── */}
                    <div
                      className="grid gap-4"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                      }}
                    >
                      <FieldWrap
                        label="Season"
                        required
                        error={formErrors.seasonId}
                        icon={<Calendar className="w-3.5 h-3.5" />}
                      >
                        <select
                          value={newActivityData.seasonId}
                          onChange={(e) =>
                            setNewActivityData((d) => ({
                              ...d,
                              seasonId: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none cursor-pointer"
                          style={focusStyle(!!formErrors.seasonId)}
                          onFocus={onFocus}
                          onBlur={onBlur}
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
                          {STATUS_OPTIONS.map((opt) => {
                            const active = newActivityData.status === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() =>
                                  setNewActivityData((d) => ({
                                    ...d,
                                    status: opt.value as "ACTIVE" | "INACTIVE",
                                  }))
                                }
                                className="am-status-pill flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-left"
                                style={{
                                  backgroundColor: active
                                    ? `${opt.color}12`
                                    : theme.background,
                                  border: `1.5px solid ${active ? opt.color : theme.border}`,
                                  boxShadow: active
                                    ? `0 0 0 3px ${opt.color}14`
                                    : "none",
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
                                <span>
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
                                </span>
                                {active && (
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                                    style={{ color: opt.color }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ── Available From / To ── */}
                    <div
                      className="grid gap-4"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(150px, 1fr))",
                      }}
                    >
                      <FieldWrap
                        label="Available From"
                        icon={<Clock className="w-3.5 h-3.5" />}
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
                          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                          style={focusStyle()}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </FieldWrap>

                      <FieldWrap
                        label="Available To"
                        icon={<Clock className="w-3.5 h-3.5" />}
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
                          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                          style={focusStyle()}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </FieldWrap>
                    </div>

                    {/* ── Pricing ── */}
                    <div
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: `${theme.border}12`,
                        border: `1.5px solid ${theme.border}`,
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <Banknote className="w-3.5 h-3.5" /> Pricing (LKR)
                      </p>
                      <div
                        className="grid gap-4"
                        style={{
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(140px, 1fr))",
                        }}
                      >
                        <FieldWrap
                          label="Local Price"
                          required
                          error={formErrors.priceLocal}
                        >
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
                            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                            style={focusStyle(!!formErrors.priceLocal)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </FieldWrap>

                        <FieldWrap
                          label="Foreigners Price"
                          required
                          error={formErrors.priceForeigners}
                        >
                          <input
                            type="number"
                            value={newActivityData.priceForeigners}
                            onChange={(e) =>
                              setNewActivityData((d) => ({
                                ...d,
                                priceForeigners:
                                  parseFloat(e.target.value) || 0,
                              }))
                            }
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                            style={focusStyle(!!formErrors.priceForeigners)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </FieldWrap>
                      </div>
                    </div>

                    {/* ── Participants ── */}
                    <div
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: `${theme.border}12`,
                        border: `1.5px solid ${theme.border}`,
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        <Users className="w-3.5 h-3.5" /> Participants
                      </p>
                      <div
                        className="grid gap-4"
                        style={{
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(140px, 1fr))",
                        }}
                      >
                        <FieldWrap
                          label="Min"
                          required
                          error={formErrors.minParticipate}
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
                            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                            style={focusStyle(!!formErrors.minParticipate)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </FieldWrap>

                        <FieldWrap label="Max" required>
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
                            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                            style={focusStyle()}
                            onFocus={onFocus}
                            onBlur={onBlur}
                          />
                        </FieldWrap>
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewActivityForm(false);
                          setFormErrors({});
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: theme.background,
                          border: `1.5px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddActivity}
                        className="am-add-btn flex-1 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm"
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
                </div>
              </div>
            )}

            {/* ── Existing Activities ───────────────────────────── */}
            <div className="px-4 sm:px-6 pt-5">
              <div
                className="am-section-label"
                style={{ color: theme.textSecondary }}
              >
                <Lock className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Existing Activities
                </span>
                <CountBadge
                  count={existingCount}
                  color={theme.textSecondary}
                  bg={`${theme.border}50`}
                />
              </div>

              {existingCount === 0 ? (
                <EmptyState
                  icon={<Globe className="w-8 h-8" />}
                  message="No existing activities"
                  sub="Add an activity using the button above"
                  theme={theme}
                />
              ) : (
                <div className="space-y-2.5">
                  {activities.map(
                    (activity, idx) =>
                      !isActivityRemoved(activity.activityId) && (
                        <div
                          key={activity.activityId}
                          className="am-card rounded-2xl overflow-hidden"
                          style={{
                            border: `1.5px solid ${
                              expandedActivities.includes(activity.activityId)
                                ? theme.accent + "80"
                                : theme.border
                            }`,
                            backgroundColor: theme.background,
                            animationDelay: `${idx * 35}ms`,
                            transition: "border-color 0.2s ease",
                          }}
                        >
                          {/* Card row */}
                          <div className="flex items-center gap-3 px-4 py-3">
                            <button
                              onClick={() =>
                                toggleActivity(activity.activityId)
                              }
                              className="am-icon-btn flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg"
                              style={{
                                color: theme.textSecondary,
                                backgroundColor: `${theme.border}40`,
                              }}
                            >
                              {expandedActivities.includes(
                                activity.activityId,
                              ) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

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

                            {/* Price chip */}
                            <span
                              className="am-hide-xs text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                              style={{
                                backgroundColor: `${theme.accent}12`,
                                color: theme.accent,
                              }}
                            >
                              LKR {activity.priceLocal?.toLocaleString() ?? 0}
                            </span>

                            {/* Remove button with confirm */}
                            <div className="relative flex-shrink-0">
                              {removeConfirm === activity.activityId ? (
                                <div
                                  className="am-confirm flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                                  style={{
                                    backgroundColor: `${theme.error}10`,
                                    border: `1.5px solid ${theme.error}40`,
                                  }}
                                >
                                  <span
                                    className="text-xs font-medium"
                                    style={{ color: theme.error }}
                                  >
                                    Remove?
                                  </span>
                                  <button
                                    onClick={() => {
                                      onRemoveActivity(activity.activityId);
                                      setRemoveConfirm(null);
                                    }}
                                    className="am-icon-btn w-5 h-5 flex items-center justify-center rounded"
                                    style={{
                                      backgroundColor: theme.error,
                                      color: "#fff",
                                    }}
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setRemoveConfirm(null)}
                                    className="am-icon-btn w-5 h-5 flex items-center justify-center rounded"
                                    style={{
                                      backgroundColor: `${theme.border}60`,
                                      color: theme.textSecondary,
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setRemoveConfirm(activity.activityId)
                                  }
                                  className="am-icon-btn w-8 h-8 flex items-center justify-center rounded-lg"
                                  style={{
                                    color: theme.error,
                                    backgroundColor: `${theme.error}10`,
                                  }}
                                  title="Remove activity"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expanded read-only details */}
                          {expandedActivities.includes(activity.activityId) && (
                            <div
                              className="am-card-body px-4 pb-4 space-y-4"
                              style={{ borderTop: `1px solid ${theme.border}` }}
                            >
                              <div
                                className="flex items-center gap-1.5 pt-3 text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                <Lock className="w-3 h-3" />
                                Read-only — only removal is allowed
                              </div>

                              <div
                                className="grid gap-3"
                                style={{
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(150px, 1fr))",
                                }}
                              >
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
                                  className="flex flex-wrap gap-1.5 p-2.5 rounded-xl"
                                  style={{
                                    backgroundColor: `${theme.border}20`,
                                    border: `1px solid ${theme.border}`,
                                  }}
                                >
                                  {activity.activityCategories?.length > 0 ? (
                                    activity.activityCategories.map(
                                      (catName) => {
                                        const color =
                                          getCatColorByName(catName);
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
                                              className="w-1.5 h-1.5 rounded-full"
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
                              <div
                                className="grid gap-3"
                                style={{
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(120px, 1fr))",
                                }}
                              >
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

                              {/* Prices + Participants */}
                              <div
                                className="grid gap-3"
                                style={{
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(130px, 1fr))",
                                }}
                              >
                                <ROField
                                  label="Local Price (LKR)"
                                  theme={theme}
                                >
                                  {activity.priceLocal?.toLocaleString() ?? 0}
                                </ROField>
                                <ROField
                                  label="Foreigners Price (LKR)"
                                  theme={theme}
                                >
                                  {activity.priceForeigners?.toLocaleString() ??
                                    0}
                                </ROField>
                                <ROField label="Min Participants" theme={theme}>
                                  {activity.minParticipate}
                                </ROField>
                                <ROField label="Max Participants" theme={theme}>
                                  {activity.maxParticipate}
                                </ROField>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>

            {/* ── New Activities Preview ────────────────────────── */}
            {newActivities.length > 0 && (
              <div className="px-4 sm:px-6 pt-5">
                <div
                  className="am-section-label"
                  style={{ color: theme.accent }}
                >
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Pending to Add
                  </span>
                  <CountBadge
                    count={newActivities.length}
                    color={theme.accent}
                    bg={`${theme.accent}18`}
                  />
                </div>

                <div className="space-y-2.5">
                  {newActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="am-card rounded-2xl px-4 py-3 flex items-start gap-3"
                      style={{
                        border: `2px solid ${theme.accent}`,
                        backgroundColor: `${theme.accent}06`,
                        animationDelay: `${idx * 35}ms`,
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
                          {getSeasonName(activity.seasonId)} · LKR{" "}
                          {activity.priceLocal.toLocaleString()}
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
                                    className="w-1 h-1 rounded-full"
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-5" />
          </div>
        )}

        {/* ── Error Banner ─────────────────────────────────────── */}
        {error && (
          <div
            className="px-5 py-3 flex items-center gap-2.5 text-sm"
            style={{
              borderTop: `1px solid ${theme.error}30`,
              backgroundColor: `${theme.error}08`,
              color: theme.error,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    </>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const FieldWrap: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, required, error, icon, children }) => {
  const { theme } = useTheme();
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
      className="w-full px-3 py-2 rounded-xl text-sm"
      style={{
        backgroundColor: `${theme.border}25`,
        color: theme.textSecondary,
        border: `1.5px solid ${theme.border}`,
        cursor: "not-allowed",
        minHeight: 36,
      }}
    >
      {children}
    </div>
  </div>
);

const CountBadge: React.FC<{
  count: number;
  color: string;
  bg: string;
}> = ({ count, color, bg }) => (
  <span
    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
    style={{ backgroundColor: bg, color }}
  >
    {count}
  </span>
);

const EmptyState: React.FC<{
  icon: React.ReactNode;
  message: string;
  sub: string;
  theme: any;
}> = ({ icon, message, sub, theme }) => (
  <div
    className="flex flex-col items-center justify-center py-10 rounded-2xl"
    style={{
      backgroundColor: `${theme.border}15`,
      border: `1.5px dashed ${theme.border}`,
    }}
  >
    <span style={{ color: theme.border }}>{icon}</span>
    <p
      className="text-sm font-medium mt-3"
      style={{ color: theme.textSecondary }}
    >
      {message}
    </p>
    <p className="text-xs mt-1" style={{ color: theme.border }}>
      {sub}
    </p>
  </div>
);
