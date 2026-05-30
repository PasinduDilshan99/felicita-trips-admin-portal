"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Plus, X, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InclusionsExclusionsFormProps } from "@/types/tour-types";

export const InclusionsExclusionsForm: React.FC<
  InclusionsExclusionsFormProps
> = ({ inclusions, exclusions, onInclusionsChange, onExclusionsChange }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  const addInclusion = () => {
    if (!newInclusion.trim()) return;
    onInclusionsChange([
      ...inclusions,
      {
        inclusionText: newInclusion.trim(),
        displayOrder: inclusions.length,
        status: "ACTIVE",
      },
    ]);
    setNewInclusion("");
  };

  const removeInclusion = (index: number) => {
    const newInclusions = inclusions.filter((_, i) => i !== index);
    const reordered = newInclusions.map((inc, idx) => ({
      ...inc,
      displayOrder: idx,
    }));
    onInclusionsChange(reordered);
  };

  const addExclusion = () => {
    if (!newExclusion.trim()) return;
    onExclusionsChange([
      ...exclusions,
      {
        exclusionText: newExclusion.trim(),
        displayOrder: exclusions.length,
        status: "ACTIVE",
      },
    ]);
    setNewExclusion("");
  };

  const removeExclusion = (index: number) => {
    const newExclusions = exclusions.filter((_, i) => i !== index);
    const reordered = newExclusions.map((exc, idx) => ({
      ...exc,
      displayOrder: idx,
    }));
    onExclusionsChange(reordered);
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
              backgroundColor: `${theme.success}18`,
              color: theme.success,
            }}
          >
            <CheckCircle className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Inclusions & Exclusions
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              What's included and what's not
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
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: theme.success }}
                />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  Inclusions
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                {inclusions.map((inc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}08`,
                      border: `1px solid ${theme.success}20`,
                    }}
                  >
                    <span className="text-sm" style={{ color: theme.text }}>
                      {inc.inclusionText}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
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
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add inclusion..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                  onKeyPress={(e) => e.key === "Enter" && addInclusion()}
                />
                <button
                  type="button"
                  onClick={addInclusion}
                  disabled={!newInclusion.trim()}
                  className="px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                  style={{
                    backgroundColor: theme.success,
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Exclusions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-4 h-4" style={{ color: theme.error }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  Exclusions
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                {exclusions.map((exc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.error}08`,
                      border: `1px solid ${theme.error}20`,
                    }}
                  >
                    <span className="text-sm" style={{ color: theme.text }}>
                      {exc.exclusionText}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
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
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="Add exclusion..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                  onKeyPress={(e) => e.key === "Enter" && addExclusion()}
                />
                <button
                  type="button"
                  onClick={addExclusion}
                  disabled={!newExclusion.trim()}
                  className="px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                  style={{
                    backgroundColor: theme.error,
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
