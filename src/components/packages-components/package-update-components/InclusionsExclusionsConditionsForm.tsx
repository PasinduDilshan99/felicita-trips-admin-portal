"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PackageInclusionResponse,
  PackageExclusionResponse,
  PackageConditionResponse,
} from "@/types/package-types";
import {
  Inclusion,
  UpdateInclusionRequest,
  Exclusion,
  UpdateExclusionRequest,
  Condition,
  UpdateConditionRequest,
} from "@/types/package-types";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, formVariants, itemVariants, sectionVariants } from "@/app/animations/variants";

interface InclusionsExclusionsConditionsFormProps {
  inclusions: PackageInclusionResponse[];
  exclusions: PackageExclusionResponse[];
  conditions: PackageConditionResponse[];
  addedInclusions: Inclusion[];
  removedInclusions: number[];
  updatedInclusions: UpdateInclusionRequest[];
  addedExclusions: Exclusion[];
  removedExclusions: number[];
  updatedExclusions: UpdateExclusionRequest[];
  addedConditions: Condition[];
  removedConditions: number[];
  updatedConditions: UpdateConditionRequest[];
  onAddInclusion: (text: string, displayOrder: number) => void;
  onRemoveInclusion: (id: number) => void;
  onUpdateInclusion: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddExclusion: (text: string, displayOrder: number) => void;
  onRemoveExclusion: (id: number) => void;
  onUpdateExclusion: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddCondition: (text: string, displayOrder: number) => void;
  onRemoveCondition: (id: number) => void;
  onUpdateCondition: (
    id: number,
    text: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
}

export const InclusionsExclusionsConditionsForm: React.FC<
  InclusionsExclusionsConditionsFormProps
> = ({
  inclusions,
  exclusions,
  conditions,
  addedInclusions,
  removedInclusions,
  updatedInclusions,
  addedExclusions,
  removedExclusions,
  updatedExclusions,
  addedConditions,
  removedConditions,
  updatedConditions,
  onAddInclusion,
  onRemoveInclusion,
  onUpdateInclusion,
  onAddExclusion,
  onRemoveExclusion,
  onUpdateExclusion,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["inclusions", "exclusions", "conditions"]),
  );
  const [showInclusionForm, setShowInclusionForm] = useState(false);
  const [showExclusionForm, setShowExclusionForm] = useState(false);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [newInclusionText, setNewInclusionText] = useState("");
  const [newExclusionText, setNewExclusionText] = useState("");
  const [newConditionText, setNewConditionText] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  const isInclusionRemoved = (id: number) => removedInclusions.includes(id);
  const isInclusionUpdated = (id: number) =>
    updatedInclusions.some((u) => u.packageInclusionId === id);
  const getInclusionUpdate = (id: number) =>
    updatedInclusions.find((u) => u.packageInclusionId === id);

  const isExclusionRemoved = (id: number) => removedExclusions.includes(id);
  const isExclusionUpdated = (id: number) =>
    updatedExclusions.some((u) => u.packageExclusionId === id);
  const getExclusionUpdate = (id: number) =>
    updatedExclusions.find((u) => u.packageExclusionId === id);

  const isConditionRemoved = (id: number) => removedConditions.includes(id);
  const isConditionUpdated = (id: number) =>
    updatedConditions.some((u) => u.packageConditionId === id);
  const getConditionUpdate = (id: number) =>
    updatedConditions.find((u) => u.packageConditionId === id);

  const handleAddInclusion = () => {
    if (newInclusionText.trim()) {
      const maxOrder = Math.max(...inclusions.map((i) => i.displayOrder), 0);
      onAddInclusion(newInclusionText.trim(), maxOrder + 1);
      setNewInclusionText("");
      setShowInclusionForm(false);
    }
  };

  const handleAddExclusion = () => {
    if (newExclusionText.trim()) {
      const maxOrder = Math.max(...exclusions.map((e) => e.displayOrder), 0);
      onAddExclusion(newExclusionText.trim(), maxOrder + 1);
      setNewExclusionText("");
      setShowExclusionForm(false);
    }
  };

  const handleAddCondition = () => {
    if (newConditionText.trim()) {
      const maxOrder = Math.max(...conditions.map((c) => c.displayOrder), 0);
      onAddCondition(newConditionText.trim(), maxOrder + 1);
      setNewConditionText("");
      setShowConditionForm(false);
    }
  };

  const renderItem = (
    item: any,
    type: "inclusion" | "exclusion" | "condition",
    isRemoved: boolean,
    isUpdated: boolean,
    getUpdate: any,
    onUpdate: (id: number, text: string, status: "ACTIVE" | "INACTIVE") => void,
    onRemove: (id: number) => void,
    icon: React.ReactNode,
    color: string,
  ) => {
    if (isRemoved) return null;

    const update = getUpdate(item.id);
    const currentText =
      update?.inclusionText ||
      update?.exclusionText ||
      update?.conditionText ||
      item.description;
    const isActive = update ? update.status === "ACTIVE" : true;

    return (
      <motion.div
        key={item.id}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="flex items-center gap-3 p-3 rounded-lg group"
        style={{
          backgroundColor: `${color}08`,
          border: `1px solid ${isUpdated ? color : `${color}30`}`,
          opacity: isActive ? 1 : 0.6,
        }}
      >
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p
            className="text-sm"
            style={{ color: isActive ? theme.text : theme.textSecondary }}
          >
            {currentText}
          </p>
          {isUpdated && (
            <p className="text-xs mt-0.5" style={{ color: color }}>
              Modified
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() =>
              onUpdate(item.id, currentText, isActive ? "INACTIVE" : "ACTIVE")
            }
            className="p-1.5 rounded-lg transition-all hover:scale-110"
            style={{ color: isActive ? theme.warning : theme.success }}
            title={isActive ? "Deactivate" : "Activate"}
          >
            {isActive ? (
              <XCircle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg transition-all hover:scale-110"
            style={{ color: theme.error }}
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
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
      <div
        className="flex items-center gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
          }}
        >
          <CheckCircle className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-sm sm:text-base font-semibold"
            style={{ color: theme.text }}
          >
            Inclusions, Exclusions & Conditions
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Manage what's included, excluded, and special conditions
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 space-y-6">
        {/* Inclusions Section */}
        <div>
          <button
            onClick={() => toggleSection("inclusions")}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{ backgroundColor: `${theme.success}10` }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle
                className="w-4 h-4"
                style={{ color: theme.success }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Inclusions
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.success}20`,
                  color: theme.success,
                }}
              >
                {inclusions.filter((i) => !isInclusionRemoved(i.id)).length}
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                transform: expandedSections.has("inclusions")
                  ? "rotate(180deg)"
                  : "none",
                color: theme.textSecondary,
              }}
            />
          </button>

          {expandedSections.has("inclusions") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              <AnimatePresence>
                {showInclusionForm && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.success}10` }}
                  >
                    <textarea
                      value={newInclusionText}
                      onChange={(e) => setNewInclusionText(e.target.value)}
                      placeholder="Enter inclusion description..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border text-sm mb-2"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowInclusionForm(false)}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddInclusion}
                        className="px-3 py-1.5 rounded-lg text-sm text-white"
                        style={{ backgroundColor: theme.success }}
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                {inclusions.map((inc) =>
                  renderItem(
                    inc,
                    "inclusion",
                    isInclusionRemoved(inc.id),
                    isInclusionUpdated(inc.id),
                    getInclusionUpdate,
                    (id, text, status) =>
                      onUpdateInclusion(id, text, inc.displayOrder, status),
                    onRemoveInclusion,
                    <CheckCircle
                      className="w-4 h-4"
                      style={{ color: theme.success }}
                    />,
                    theme.success,
                  ),
                )}
              </div>

              <button
                onClick={() => setShowInclusionForm(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.success}10`,
                  color: theme.success,
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Inclusion
              </button>
            </motion.div>
          )}
        </div>

        {/* Exclusions Section */}
        <div>
          <button
            onClick={() => toggleSection("exclusions")}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{ backgroundColor: `${theme.error}10` }}
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" style={{ color: theme.error }} />
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Exclusions
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.error}20`,
                  color: theme.error,
                }}
              >
                {exclusions.filter((e) => !isExclusionRemoved(e.id)).length}
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                transform: expandedSections.has("exclusions")
                  ? "rotate(180deg)"
                  : "none",
                color: theme.textSecondary,
              }}
            />
          </button>

          {expandedSections.has("exclusions") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              <AnimatePresence>
                {showExclusionForm && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.error}10` }}
                  >
                    <textarea
                      value={newExclusionText}
                      onChange={(e) => setNewExclusionText(e.target.value)}
                      placeholder="Enter exclusion description..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border text-sm mb-2"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowExclusionForm(false)}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddExclusion}
                        className="px-3 py-1.5 rounded-lg text-sm text-white"
                        style={{ backgroundColor: theme.error }}
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                {exclusions.map((exc) =>
                  renderItem(
                    exc,
                    "exclusion",
                    isExclusionRemoved(exc.id),
                    isExclusionUpdated(exc.id),
                    getExclusionUpdate,
                    (id, text, status) =>
                      onUpdateExclusion(id, text, exc.displayOrder, status),
                    onRemoveExclusion,
                    <XCircle
                      className="w-4 h-4"
                      style={{ color: theme.error }}
                    />,
                    theme.error,
                  ),
                )}
              </div>

              <button
                onClick={() => setShowExclusionForm(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.error}10`,
                  color: theme.error,
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Exclusion
              </button>
            </motion.div>
          )}
        </div>

        {/* Conditions Section */}
        <div>
          <button
            onClick={() => toggleSection("conditions")}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{ backgroundColor: `${theme.warning}10` }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="w-4 h-4"
                style={{ color: theme.warning }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Conditions
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.warning}20`,
                  color: theme.warning,
                }}
              >
                {conditions.filter((c) => !isConditionRemoved(c.id)).length}
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                transform: expandedSections.has("conditions")
                  ? "rotate(180deg)"
                  : "none",
                color: theme.textSecondary,
              }}
            />
          </button>

          {expandedSections.has("conditions") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              <AnimatePresence>
                {showConditionForm && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.warning}10` }}
                  >
                    <textarea
                      value={newConditionText}
                      onChange={(e) => setNewConditionText(e.target.value)}
                      placeholder="Enter condition description..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border text-sm mb-2"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConditionForm(false)}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCondition}
                        className="px-3 py-1.5 rounded-lg text-sm text-white"
                        style={{ backgroundColor: theme.warning }}
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                {conditions.map((cond) =>
                  renderItem(
                    cond,
                    "condition",
                    isConditionRemoved(cond.id),
                    isConditionUpdated(cond.id),
                    getConditionUpdate,
                    (id, text, status) =>
                      onUpdateCondition(id, text, cond.displayOrder, status),
                    onRemoveCondition,
                    <AlertTriangle
                      className="w-4 h-4"
                      style={{ color: theme.warning }}
                    />,
                    theme.warning,
                  ),
                )}
              </div>

              <button
                onClick={() => setShowConditionForm(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.warning}10`,
                  color: theme.warning,
                }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Condition
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
