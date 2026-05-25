// components/tours-components/update-tour-components/TravelTipsForm.tsx
"use client";

import React, { useState } from "react";
import { Lightbulb, Plus, X, ChevronDown, GripVertical, CheckCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { TravelTip } from "@/types/tour-types";
import { TravelTipInput, UpdateTravelTipInput } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";

interface TravelTipsFormProps {
  travelTips: TravelTip[];
  addedTravelTips: TravelTipInput[];
  removedTravelTips: number[];
  updatedTravelTips: UpdateTravelTipInput[];
  onAddTravelTip: (title: string, description: string, displayOrder: number) => void;
  onRemoveTravelTip: (id: number) => void;
  onUpdateTravelTip: (id: number, title: string, description: string, displayOrder: number, status: "ACTIVE" | "INACTIVE") => void;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const tipVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

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
  const [newTipTitle, setNewTipTitle] = useState("");
  const [newTipDescription, setNewTipDescription] = useState("");

  const isTipRemoved = (id: number) => removedTravelTips.includes(id);
  const isTipUpdated = (id: number) => updatedTravelTips.some(u => u.travelTipId === id);
  const getTipUpdate = (id: number) => updatedTravelTips.find(u => u.travelTipId === id);

  const handleAddTip = () => {
    if (newTipTitle.trim() && newTipDescription.trim()) {
      const maxOrder = Math.max(...travelTips.map(t => t.displayOrder), 0);
      onAddTravelTip(newTipTitle.trim(), newTipDescription.trim(), maxOrder + 1);
      setNewTipTitle("");
      setNewTipDescription("");
      setShowAddForm(false);
    }
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
            style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
          >
            <Lightbulb className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Travel Tips
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
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
            style={{ transform: isExpanded ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
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
                <h4 className="text-sm font-medium mb-3" style={{ color: theme.text }}>
                  Add Travel Tip
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTipTitle}
                      onChange={(e) => setNewTipTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                      placeholder="e.g., Best Time to Visit"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Description
                    </label>
                    <textarea
                      value={newTipDescription}
                      onChange={(e) => setNewTipDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
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
                      disabled={!newTipTitle.trim() || !newTipDescription.trim()}
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
                const currentDescription = update?.tipDescription || tip.description;
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
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: theme.accent }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-semibold" style={{ color: theme.text }}>
                            {currentTitle}
                          </h4>
                          {isTipUpdated(tip.id) && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                              Modified
                            </span>
                          )}
                          {!isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${theme.error}20`, color: theme.error }}>
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>
                          {currentDescription}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateTravelTip(tip.id, currentTitle, currentDescription, tip.displayOrder, isActive ? "INACTIVE" : "ACTIVE")}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: isActive ? theme.warning : theme.success }}
                          title={isActive ? "Deactivate" : "Activate"}
                        >
                          {isActive ? <X className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
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
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <p className="text-xs font-medium mb-2" style={{ color: theme.success }}>
                New travel tips to add:
              </p>
              <div className="space-y-2">
                {addedTravelTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: `${theme.success}10`, border: `1px dashed ${theme.success}` }}
                  >
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5" style={{ color: theme.success }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text }}>
                        {tip.tipTitle}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                        {tip.tipDescription}
                      </p>
                    </div>
                    <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.success }}>
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};