"use client";

import React, { useState } from "react";
import { ClipboardList, Plus, X, AlertCircle, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Requirement {
  name: string;
  value: string;
  description: string;
  color: string;
  status: "ACTIVE" | "INACTIVE";
}

interface RequirementsFormProps {
  requirements: Requirement[];
  onRequirementsChange: (requirements: Requirement[]) => void;
  errors?: Record<string, string>;
}

const DEFAULT_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

export const RequirementsForm: React.FC<RequirementsFormProps> = ({
  requirements,
  onRequirementsChange,
  errors = {},
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newRequirement, setNewRequirement] = useState<Requirement>({
    name: "",
    value: "",
    description: "",
    color: DEFAULT_COLORS[0],
    status: "ACTIVE",
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addRequirement = () => {
    if (!newRequirement.name.trim() || !newRequirement.value.trim()) {
      return;
    }
    onRequirementsChange([...requirements, { ...newRequirement }]);
    setNewRequirement({
      name: "",
      value: "",
      description: "",
      color: DEFAULT_COLORS[0],
      status: "ACTIVE",
    });
  };

  const removeRequirement = (index: number) => {
    onRequirementsChange(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, field: keyof Requirement, value: string) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    onRequirementsChange(updated);
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
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.warning}18`,
              color: theme.warning,
            }}
          >
            <ClipboardList className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Requirements
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              What participants need to know or bring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {requirements.length > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${theme.warning}15`,
                color: theme.warning,
              }}
            >
              {requirements.length}
            </span>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-300"
            style={{
              color: theme.textSecondary,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6">
          {/* Existing requirements */}
          {requirements.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                Current Requirements
              </p>
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: `${req.color}10`,
                    border: `1px solid ${req.color}30`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                          Requirement Name
                        </label>
                        <input
                          type="text"
                          value={req.name}
                          onChange={(e) => updateRequirement(index, "name", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                          Value/Detail
                        </label>
                        <input
                          type="text"
                          value={req.value}
                          onChange={(e) => updateRequirement(index, "value", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs block mb-1" style={{ color: theme.textSecondary }}>
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={req.description}
                          onChange={(e) => updateRequirement(index, "description", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                          }}
                          placeholder="Additional details about this requirement"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-1.5 rounded-lg hover:bg-opacity-20 transition-colors flex-shrink-0"
                      style={{ color: theme.error }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new requirement */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
              Add New Requirement
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Requirement name (e.g., Fitness Level)"
                  value={newRequirement.name}
                  onChange={(e) => setNewRequirement({ ...newRequirement, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Value (e.g., Moderate)"
                  value={newRequirement.value}
                  onChange={(e) => setNewRequirement({ ...newRequirement, value: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={newRequirement.description}
                  onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 text-sm"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 text-left flex items-center gap-3"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: newRequirement.color }}
                  />
                  <span style={{ color: theme.textSecondary }}>Choose color</span>
                </button>
                {showColorPicker && (
                  <div
                    className="absolute z-10 mt-2 p-2 rounded-xl shadow-lg"
                    style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="grid grid-cols-5 gap-2">
                      {DEFAULT_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setNewRequirement({ ...newRequirement, color });
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={addRequirement}
              disabled={!newRequirement.name.trim() || !newRequirement.value.trim()}
              className="cursor-pointer w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${theme.success}10`,
                border: `1px solid ${theme.success}30`,
                color: theme.success,
              }}
            >
              <Plus className="w-4 h-4" />
              Add Requirement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};