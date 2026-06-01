"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Plus,
  X,
  ChevronDown,
  Trash2,
  Edit2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageTravelTipResponse } from "@/types/package-types";
import {
  TravelTipRequest,
  UpdateTravelTipRequest,
} from "@/types/package-types";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, formVariants, tipVariants } from "@/app/animations/variants";

interface TravelTipsFormProps {
  travelTips: PackageTravelTipResponse[];
  addedTravelTips: TravelTipRequest[];
  removedTravelTips: number[];
  updatedTravelTips: UpdateTravelTipRequest[];
  onAddTravelTip: (
    title: string,
    description: string,
    displayOrder: number,
  ) => void;
  onRemoveTravelTip: (id: number) => void;
  onUpdateTravelTip: (
    id: number,
    title: string,
    description: string,
    displayOrder: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
}

export const TravelTipsForm: React.FC<TravelTipsFormProps> = ({
  travelTips,
  addedTravelTips,
  removedTravelTips,
  updatedTravelTips,
  onAddTravelTip,
  onRemoveTravelTip,
  onUpdateTravelTip,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTip, setEditingTip] = useState<PackageTravelTipResponse | null>(
    null,
  );
  const [newTipTitle, setNewTipTitle] = useState("");
  const [newTipDescription, setNewTipDescription] = useState("");
  const [editTipData, setEditTipData] = useState({
    title: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const isTipRemoved = (id: number) => removedTravelTips.includes(id);
  const isTipUpdated = (id: number) =>
    updatedTravelTips.some((u) => u.packageTipId === id);
  const getTipUpdate = (id: number) =>
    updatedTravelTips.find((u) => u.packageTipId === id);

  const handleAddTip = () => {
    if (newTipTitle.trim() && newTipDescription.trim()) {
      const maxOrder = Math.max(...travelTips.map((t) => t.displayOrder), 0);
      onAddTravelTip(
        newTipTitle.trim(),
        newTipDescription.trim(),
        maxOrder + 1,
      );
      setNewTipTitle("");
      setNewTipDescription("");
      setShowAddForm(false);
    }
  };

  const handleEditClick = (tip: PackageTravelTipResponse) => {
    const update = getTipUpdate(tip.id);
    setEditingTip(tip);
    setEditTipData({
      title: update?.tipTitle || tip.title,
      description: update?.tipDescription || tip.description,
      status: update?.status || "ACTIVE",
    });
  };

  const handleUpdateTip = () => {
    if (!editingTip) return;
    if (!editTipData.title.trim() || !editTipData.description.trim()) {
      alert("Title and description are required");
      return;
    }
    onUpdateTravelTip(
      editingTip.id,
      editTipData.title,
      editTipData.description,
      editingTip.displayOrder,
      editTipData.status,
    );
    setEditingTip(null);
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
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.accent}18`,
              color: theme.accent,
            }}
          >
            <Lightbulb className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Travel Tips
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Helpful advice for travelers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddForm(!showAddForm);
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Tip
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

      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* Edit Tip Modal */}
          <AnimatePresence>
            {editingTip && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setEditingTip(null)}
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
                    Edit Travel Tip
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        value={editTipData.title}
                        onChange={(e) =>
                          setEditTipData({
                            ...editTipData,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editTipData.description}
                        onChange={(e) =>
                          setEditTipData({
                            ...editTipData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            setEditTipData({ ...editTipData, status: "ACTIVE" })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm flex items-center justify-center gap-2"
                          style={{
                            backgroundColor:
                              editTipData.status === "ACTIVE"
                                ? `${theme.success}10`
                                : theme.background,
                            borderColor:
                              editTipData.status === "ACTIVE"
                                ? theme.success
                                : theme.border,
                            color:
                              editTipData.status === "ACTIVE"
                                ? theme.success
                                : theme.text,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.success }}
                          />
                          Active
                        </button>
                        <button
                          onClick={() =>
                            setEditTipData({
                              ...editTipData,
                              status: "INACTIVE",
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm flex items-center justify-center gap-2"
                          style={{
                            backgroundColor:
                              editTipData.status === "INACTIVE"
                                ? `${theme.error}10`
                                : theme.background,
                            borderColor:
                              editTipData.status === "INACTIVE"
                                ? theme.error
                                : theme.border,
                            color:
                              editTipData.status === "INACTIVE"
                                ? theme.error
                                : theme.text,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.error }}
                          />
                          Inactive
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditingTip(null)}
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
                        onClick={handleUpdateTip}
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

          {/* Add Tip Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.accent}08`,
                  border: `1px solid ${theme.accent}25`,
                }}
              >
                <h4
                  className="text-sm font-medium mb-3"
                  style={{ color: theme.text }}
                >
                  Add Travel Tip
                </h4>
                <div className="space-y-3">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTipTitle}
                      onChange={(e) => setNewTipTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="e.g., Best Time to Visit"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                    </label>
                    <textarea
                      value={newTipDescription}
                      onChange={(e) => setNewTipDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Provide helpful advice for travelers..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTipTitle("");
                        setNewTipDescription("");
                      }}
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
                      onClick={handleAddTip}
                      disabled={
                        !newTipTitle.trim() || !newTipDescription.trim()
                      }
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      style={{
                        backgroundColor: theme.accent,
                        color: "#fff",
                      }}
                    >
                      Add Tip
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Travel Tips List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {travelTips.map((tip) => {
                if (isTipRemoved(tip.id)) return null;
                const update = getTipUpdate(tip.id);
                const currentTitle = update?.tipTitle || tip.title;
                const currentDescription =
                  update?.tipDescription || tip.description;
                const isActive = update ? update.status === "ACTIVE" : true;

                return (
                  <motion.div
                    key={tip.id}
                    variants={tipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="rounded-xl p-4 transition-all"
                    style={{
                      backgroundColor: `${theme.accent}05`,
                      border: `1px solid ${isTipUpdated(tip.id) ? theme.accent : theme.border}`,
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: theme.accent }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4
                            className="text-sm font-semibold"
                            style={{ color: theme.text }}
                          >
                            {currentTitle}
                          </h4>
                          {isTipUpdated(tip.id) && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${theme.accent}20`,
                                color: theme.accent,
                              }}
                            >
                              Modified
                            </span>
                          )}
                          {!isActive && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${theme.error}20`,
                                color: theme.error,
                              }}
                            >
                              Inactive
                            </span>
                          )}
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          {currentDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(tip)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                          title="Edit tip"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onUpdateTravelTip(
                              tip.id,
                              currentTitle,
                              currentDescription,
                              tip.displayOrder,
                              isActive ? "INACTIVE" : "ACTIVE",
                            )
                          }
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{
                            color: isActive ? theme.warning : theme.success,
                          }}
                          title={isActive ? "Deactivate" : "Activate"}
                        >
                          {isActive ? (
                            <X className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onRemoveTravelTip(tip.id)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.error }}
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* New Tips Preview */}
          {addedTravelTips.length > 0 && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: theme.success }}
              >
                New travel tips to add:
              </p>
              <div className="space-y-2">
                {addedTravelTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}10`,
                      border: `1px dashed ${theme.success}`,
                    }}
                  >
                    <Lightbulb
                      className="w-3.5 h-3.5 mt-0.5"
                      style={{ color: theme.success }}
                    />
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: theme.text }}
                      >
                        {tip.tipTitle}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        {tip.tipDescription}
                      </p>
                    </div>
                    <span
                      className="text-xs text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.success }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {travelTips.length === 0 && addedTravelTips.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                style={{ color: theme.textSecondary }}
              />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                No travel tips added yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Click "Add Tip" to provide helpful advice for travelers
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
