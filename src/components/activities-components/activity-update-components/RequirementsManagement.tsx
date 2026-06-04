"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  ChevronDown,
  AlertCircle,
  Edit2,
  Check,
  Palette,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Requirement } from "@/types/activity-types";
import {
  ActivityRequirementRequest,
  UpdateRequirementRequest,
} from "@/types/activity-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import {
  cardVariants,
  formVariants,
  itemVariants,
} from "@/app/animations/variants";
import { ACTIVITY_UPDATE_PRESET_COLORS } from "@/data/colors-data";
import { ACTIVITY_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

interface RequirementsManagementProps {
  requirements: Requirement[];
  removedRequirements: number[];
  newRequirements: ActivityRequirementRequest[];
  onRemoveRequirement: (requirementId: number) => void;
  onAddNewRequirement: (requirement: ActivityRequirementRequest) => void;
  onUpdateRequirement: (requirement: UpdateRequirementRequest) => void;
  error?: string;
}

export const RequirementsManagement: React.FC<RequirementsManagementProps> = ({
  requirements,
  removedRequirements,
  newRequirements,
  onRemoveRequirement,
  onAddNewRequirement,
  onUpdateRequirement,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingRequirement, setEditingRequirement] =
    useState<Requirement | null>(null);

  const [newReqData, setNewReqData] = useState<ActivityRequirementRequest>({
    name: "",
    value: "",
    description: "",
    color: "#10B981",
    status: "ACTIVE",
  });

  const [editReqData, setEditReqData] = useState<UpdateRequirementRequest>({
    name: "",
    value: "",
    description: "",
    color: "",
    status: "ACTIVE",
  });

  const isRequirementRemoved = (id: number) => removedRequirements.includes(id);

  const handleAddRequirement = () => {
    if (!newReqData.name.trim() || !newReqData.value.trim()) {
      alert("Name and value are required");
      return;
    }
    onAddNewRequirement(newReqData);
    setNewReqData({
      name: "",
      value: "",
      description: "",
      color: "#10B981",
      status: "ACTIVE",
    });
    setShowNewForm(false);
  };

  const handleUpdateRequirement = () => {
    if (!editingRequirement) return;
    if (!editReqData.name.trim() || !editReqData.value.trim()) {
      alert("Name and value are required");
      return;
    }
    onUpdateRequirement({
      ...editReqData,
      requirementId: editingRequirement.id,
    });
    setEditingRequirement(null);
    setEditReqData({
      name: "",
      value: "",
      description: "",
      color: "",
      status: "ACTIVE",
    });
  };

  const handleEditClick = (req: Requirement) => {
    setEditingRequirement(req);
    setEditReqData({
      name: req.name,
      value: req.value,
      description: req.description || "",
      color: req.color,
      status: req.status === 1 ? "ACTIVE" : "INACTIVE",
    });
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
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
            <ClipboardList className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Requirements
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {requirements.filter((r) => !isRequirementRemoved(r.id)).length}{" "}
              requirements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNewForm(!showNewForm);
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{
              backgroundColor: `${theme.warning}15`,
              color: theme.warning,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Requirement
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "none",
              color: theme.textSecondary,
            }}
          />
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* New Requirement Form */}
          <AnimatePresence>
            {showNewForm && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.warning}08`,
                  border: `2px solid ${theme.warning}`,
                }}
              >
                <h4
                  className="text-sm font-semibold mb-4"
                  style={{ color: theme.text }}
                >
                  Add New Requirement
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newReqData.name}
                        onChange={(e) =>
                          setNewReqData({ ...newReqData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Age Requirement"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Value <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newReqData.value}
                        onChange={(e) =>
                          setNewReqData({
                            ...newReqData,
                            value: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., 18+ years"
                        {...focusHandlers}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                    </label>
                    <textarea
                      value={newReqData.description}
                      onChange={(e) =>
                        setNewReqData({
                          ...newReqData,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Optional description"
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-2"
                      style={{ color: theme.textSecondary }}
                    >
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {ACTIVITY_UPDATE_PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setNewReqData({ ...newReqData, color })
                          }
                          className="w-8 h-8 rounded-full border-2 transition-all"
                          style={{
                            backgroundColor: color,
                            borderColor:
                              newReqData.color === color
                                ? theme.text
                                : "transparent",
                            boxShadow:
                              newReqData.color === color
                                ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}`
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <input
                        type="color"
                        value={newReqData.color}
                        onChange={(e) =>
                          setNewReqData({
                            ...newReqData,
                            color: e.target.value,
                          })
                        }
                        className="w-10 h-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newReqData.color}
                        onChange={(e) =>
                          setNewReqData({
                            ...newReqData,
                            color: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Status
                    </label>
                    <div className="flex gap-3">
                      {ACTIVITY_UPDATE_STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setNewReqData({
                              ...newReqData,
                              status: opt.value as "ACTIVE" | "INACTIVE",
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm flex items-center justify-center gap-2"
                          style={{
                            backgroundColor:
                              newReqData.status === opt.value
                                ? `${opt.color}10`
                                : theme.background,
                            borderColor:
                              newReqData.status === opt.value
                                ? opt.color
                                : theme.border,
                            color:
                              newReqData.status === opt.value
                                ? opt.color
                                : theme.text,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: opt.color }}
                          />
                          {opt.label}
                          {newReqData.status === opt.value && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: theme.background,
                        border: `1px solid ${theme.border}`,
                        color: theme.textSecondary,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRequirement}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.warning }}
                    >
                      Add Requirement
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Requirement Modal */}
          <AnimatePresence>
            {editingRequirement && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setEditingRequirement(null)}
              >
                <div
                  className="rounded-2xl p-6 max-w-md w-full mx-4"
                  style={{ backgroundColor: theme.surface }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: theme.text }}
                  >
                    Edit Requirement
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          value={editReqData.name}
                          onChange={(e) =>
                            setEditReqData({
                              ...editReqData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Value
                        </label>
                        <input
                          type="text"
                          value={editReqData.value}
                          onChange={(e) =>
                            setEditReqData({
                              ...editReqData,
                              value: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editReqData.description}
                        onChange={(e) =>
                          setEditReqData({
                            ...editReqData,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={editReqData.color}
                          onChange={(e) =>
                            setEditReqData({
                              ...editReqData,
                              color: e.target.value,
                            })
                          }
                          className="w-10 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editReqData.color}
                          onChange={(e) =>
                            setEditReqData({
                              ...editReqData,
                              color: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="flex gap-3">
                        {ACTIVITY_UPDATE_STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              setEditReqData({
                                ...editReqData,
                                status: opt.value as "ACTIVE" | "INACTIVE",
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-lg border-2 text-sm flex items-center justify-center gap-2"
                            style={{
                              backgroundColor:
                                editReqData.status === opt.value
                                  ? `${opt.color}10`
                                  : theme.background,
                              borderColor:
                                editReqData.status === opt.value
                                  ? opt.color
                                  : theme.border,
                              color:
                                editReqData.status === opt.value
                                  ? opt.color
                                  : theme.text,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: opt.color }}
                            />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditingRequirement(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateRequirement}
                        className="flex-1 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Requirements List */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {requirements.map(
                (req) =>
                  !isRequirementRemoved(req.id) && (
                    <motion.div
                      key={req.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{
                        backgroundColor: hexToRgba(req.color, 0.08),
                        border: `1px solid ${hexToRgba(req.color, 0.2)}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: req.color }}
                          />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: req.color }}
                          >
                            {req.name}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: hexToRgba(req.color, 0.15),
                              color: req.color,
                            }}
                          >
                            {req.value}
                          </span>
                          {req.status === 0 && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${theme.textSecondary}20`,
                                color: theme.textSecondary,
                              }}
                            >
                              Inactive
                            </span>
                          )}
                        </div>
                        {req.description && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
                          >
                            {req.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <button
                          onClick={() => handleEditClick(req)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                          title="Edit requirement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveRequirement(req.id)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.error }}
                          title="Remove requirement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          {/* New Requirements Preview */}
          {newRequirements.length > 0 && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: theme.warning }}
              >
                New requirements to add:
              </p>
              <div className="space-y-2">
                {newRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${hexToRgba(req.color, 0.08)}`,
                      border: `1px dashed ${req.color}`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: req.color }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: req.color }}
                    >
                      {req.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: hexToRgba(req.color, 0.15),
                        color: req.color,
                      }}
                    >
                      {req.value}
                    </span>
                    <span
                      className="ml-auto text-xs text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.warning }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          className="px-4 sm:px-6 py-3 flex items-center gap-2 text-sm"
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
    </motion.div>
  );
};
