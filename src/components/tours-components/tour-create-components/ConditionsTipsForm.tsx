"use client";

import React, { useState } from "react";
import { FileText, Lightbulb, Plus, X, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ConditionsTipsFormProps } from "@/types/tour-types";

export const ConditionsTipsForm: React.FC<ConditionsTipsFormProps> = ({
  conditions,
  travelTips,
  onConditionsChange,
  onTravelTipsChange,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newCondition, setNewCondition] = useState("");
  const [newTip, setNewTip] = useState({ title: "", description: "" });

  const addCondition = () => {
    if (!newCondition.trim()) return;
    onConditionsChange([
      ...conditions,
      {
        conditionText: newCondition.trim(),
        displayOrder: conditions.length,
        status: "ACTIVE",
      },
    ]);
    setNewCondition("");
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    const reordered = newConditions.map((cond, idx) => ({
      ...cond,
      displayOrder: idx,
    }));
    onConditionsChange(reordered);
  };

  const addTravelTip = () => {
    if (!newTip.title.trim() || !newTip.description.trim()) return;
    onTravelTipsChange([
      ...travelTips,
      {
        tipTitle: newTip.title.trim(),
        tipDescription: newTip.description.trim(),
        displayOrder: travelTips.length,
        status: "ACTIVE",
      },
    ]);
    setNewTip({ title: "", description: "" });
  };

  const removeTravelTip = (index: number) => {
    const newTips = travelTips.filter((_, i) => i !== index);
    const reordered = newTips.map((tip, idx) => ({
      ...tip,
      displayOrder: idx,
    }));
    onTravelTipsChange(reordered);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.warning}18`,
              color: theme.warning,
            }}
          >
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Conditions & Travel Tips
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Terms, conditions, and helpful tips for travelers
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300"
          style={{
            color: theme.textSecondary,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-8">
          {/* Conditions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Terms & Conditions
              </h3>
            </div>

            <div className="space-y-2 mb-4">
              {conditions.map((cond, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: `${theme.warning}08`,
                    border: `1px solid ${theme.warning}20`,
                  }}
                >
                  <span className="text-sm" style={{ color: theme.text }}>
                    {cond.conditionText}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="p-1 rounded hover:bg-opacity-20 transition-colors"
                    style={{ color: theme.error }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition..."
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                }}
                onKeyPress={(e) => e.key === "Enter" && addCondition()}
              />
              <button
                type="button"
                onClick={addCondition}
                disabled={!newCondition.trim()}
                className="px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                style={{
                  backgroundColor: theme.warning,
                  color: "white",
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Travel Tips */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4" style={{ color: theme.accent }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Travel Tips
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              {travelTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `${theme.accent}08`,
                    border: `1px solid ${theme.accent}20`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {tip.tipTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTravelTip(index)}
                      className="p-1 rounded hover:bg-opacity-20 transition-colors"
                      style={{ color: theme.error }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    {tip.tipDescription}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newTip.title}
                onChange={(e) =>
                  setNewTip({ ...newTip, title: e.target.value })
                }
                placeholder="Tip title..."
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                }}
              />
              <textarea
                value={newTip.description}
                onChange={(e) =>
                  setNewTip({ ...newTip, description: e.target.value })
                }
                placeholder="Tip description..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                }}
              />
              <button
                type="button"
                onClick={addTravelTip}
                disabled={!newTip.title.trim() || !newTip.description.trim()}
                className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{
                  backgroundColor: `${theme.accent}20`,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Travel Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
