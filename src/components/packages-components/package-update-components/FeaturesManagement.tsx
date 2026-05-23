// components/packages-components/update-package-components/FeaturesManagement.tsx
"use client";

import React, { useState } from "react";
import {
  Star,
  Plus,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  Palette,
  Info,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PackageFeatureResponse } from "@/types/package-types";
import { AddFeatureRequest, UpdateFeatureRequest } from "@/types/package-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface FeaturesManagementProps {
  features: PackageFeatureResponse[];
  addedFeatures: AddFeatureRequest[];
  removedFeatures: number[];
  updatedFeatures: UpdateFeatureRequest[];
  onAddFeature: (feature: AddFeatureRequest) => void;
  onRemoveFeature: (featureId: number) => void;
  onUpdateFeature: (feature: UpdateFeatureRequest) => void;
  error?: string;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const PRESET_COLORS = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#06B6D4", "#84CC16",
];

export const FeaturesManagement: React.FC<FeaturesManagementProps> = ({
  features,
  addedFeatures,
  removedFeatures,
  updatedFeatures,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<PackageFeatureResponse | null>(null);

  const [newFeatureData, setNewFeatureData] = useState<AddFeatureRequest>({
    featureName: "",
    featureValue: "",
    featureDescription: "",
    status: "ACTIVE",
    color: "#10B981",
    hoverColor: "#059669",
    specialNote: "",
  });

  const [editFeatureData, setEditFeatureData] = useState<UpdateFeatureRequest>({
    featureId: 0,
    featureName: "",
    featureValue: "",
    featureDescription: "",
    status: "ACTIVE",
    color: "",
    hoverColor: "",
    specialNote: "",
  });

  const isFeatureRemoved = (id: number) => removedFeatures.includes(id);
  const isFeatureUpdated = (id: number) => updatedFeatures.some(u => u.featureId === id);
  const getFeatureUpdate = (id: number) => updatedFeatures.find(u => u.featureId === id);

  const handleAddFeature = () => {
    if (!newFeatureData.featureName.trim() || !newFeatureData.featureValue.trim()) {
      alert("Feature name and value are required");
      return;
    }
    onAddFeature(newFeatureData);
    setNewFeatureData({
      featureName: "",
      featureValue: "",
      featureDescription: "",
      status: "ACTIVE",
      color: "#10B981",
      hoverColor: "#059669",
      specialNote: "",
    });
    setShowAddForm(false);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature) return;
    if (!editFeatureData.featureName.trim() || !editFeatureData.featureValue.trim()) {
      alert("Feature name and value are required");
      return;
    }
    onUpdateFeature(editFeatureData);
    setEditingFeature(null);
    setEditFeatureData({
      featureId: 0,
      featureName: "",
      featureValue: "",
      featureDescription: "",
      status: "ACTIVE",
      color: "",
      hoverColor: "",
      specialNote: "",
    });
  };

  const handleEditClick = (feature: PackageFeatureResponse) => {
    const update = getFeatureUpdate(feature.featureId);
    setEditingFeature(feature);
    setEditFeatureData({
      featureId: feature.featureId,
      featureName: update?.featureName || feature.featureName,
      featureValue: update?.featureValue || feature.featureValue,
      featureDescription: update?.featureDescription || feature.featureDescription || "",
      status: update?.status || "ACTIVE",
      color: update?.color || feature.color,
      hoverColor: update?.hoverColor || "#059669",
      specialNote: update?.specialNote || feature.specialNote || "",
    });
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error ? `0 0 0 3px ${theme.error}18` : "0 2px 16px rgba(0,0,0,0.07)",
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
            style={{ backgroundColor: `${theme.warning}18`, color: theme.warning }}
          >
            <Star className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Package Features
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Key highlights and amenities
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
              backgroundColor: `${theme.warning}15`,
              color: theme.warning,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Feature
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{ transform: isExpanded ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* Add Feature Form */}
          <AnimatePresence>
            {showAddForm && (
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
                <h4 className="text-sm font-semibold mb-4" style={{ color: theme.text }}>
                  Add New Feature
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Feature Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newFeatureData.featureName}
                        onChange={(e) => setNewFeatureData({ ...newFeatureData, featureName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Free WiFi"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Feature Value <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newFeatureData.featureValue}
                        onChange={(e) => setNewFeatureData({ ...newFeatureData, featureValue: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Complimentary"
                        {...focusHandlers}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Description
                    </label>
                    <textarea
                      value={newFeatureData.featureDescription}
                      onChange={(e) => setNewFeatureData({ ...newFeatureData, featureDescription: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Detailed description of the feature..."
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                      Special Note
                    </label>
                    <input
                      type="text"
                      value={newFeatureData.specialNote}
                      onChange={(e) => setNewFeatureData({ ...newFeatureData, specialNote: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Any special notes about this feature..."
                      {...focusHandlers}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewFeatureData({ ...newFeatureData, color })}
                            className="w-8 h-8 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: color,
                              borderColor: newFeatureData.color === color ? theme.text : "transparent",
                              boxShadow: newFeatureData.color === color ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}` : "none",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newFeatureData.color}
                          onChange={(e) => setNewFeatureData({ ...newFeatureData, color: e.target.value })}
                          className="w-10 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newFeatureData.color}
                          onChange={(e) => setNewFeatureData({ ...newFeatureData, color: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                        Hover Color
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewFeatureData({ ...newFeatureData, hoverColor: color })}
                            className="w-8 h-8 rounded-full border-2 transition-all"
                            style={{
                              backgroundColor: color,
                              borderColor: newFeatureData.hoverColor === color ? theme.text : "transparent",
                              boxShadow: newFeatureData.hoverColor === color ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}` : "none",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newFeatureData.hoverColor}
                          onChange={(e) => setNewFeatureData({ ...newFeatureData, hoverColor: e.target.value })}
                          className="w-10 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newFeatureData.hoverColor}
                          onChange={(e) => setNewFeatureData({ ...newFeatureData, hoverColor: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewFeatureData({
                          featureName: "",
                          featureValue: "",
                          featureDescription: "",
                          status: "ACTIVE",
                          color: "#10B981",
                          hoverColor: "#059669",
                          specialNote: "",
                        });
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
                      onClick={handleAddFeature}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.warning }}
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Feature Modal */}
          <AnimatePresence>
            {editingFeature && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setEditingFeature(null)}
              >
                <div
                  className="rounded-2xl p-6 max-w-md w-full mx-4"
                  style={{ backgroundColor: theme.surface }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                    Edit Feature
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Feature Name
                        </label>
                        <input
                          type="text"
                          value={editFeatureData.featureName}
                          onChange={(e) => setEditFeatureData({ ...editFeatureData, featureName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Feature Value
                        </label>
                        <input
                          type="text"
                          value={editFeatureData.featureValue}
                          onChange={(e) => setEditFeatureData({ ...editFeatureData, featureValue: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Description
                      </label>
                      <textarea
                        value={editFeatureData.featureDescription}
                        onChange={(e) => setEditFeatureData({ ...editFeatureData, featureDescription: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Special Note
                      </label>
                      <input
                        type="text"
                        value={editFeatureData.specialNote}
                        onChange={(e) => setEditFeatureData({ ...editFeatureData, specialNote: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                          Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editFeatureData.color}
                            onChange={(e) => setEditFeatureData({ ...editFeatureData, color: e.target.value })}
                            className="w-10 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editFeatureData.color}
                            onChange={(e) => setEditFeatureData({ ...editFeatureData, color: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                          Hover Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editFeatureData.hoverColor}
                            onChange={(e) => setEditFeatureData({ ...editFeatureData, hoverColor: e.target.value })}
                            className="w-10 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editFeatureData.hoverColor}
                            onChange={(e) => setEditFeatureData({ ...editFeatureData, hoverColor: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                            style={{ ...fieldBase, borderColor: theme.border }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditingFeature(null)}
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
                        onClick={handleUpdateFeature}
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

          {/* Features List */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {features.map((feature) => {
                if (isFeatureRemoved(feature.featureId)) return null;
                const update = getFeatureUpdate(feature.featureId);
                const isActive = update ? update.status === "ACTIVE" : true;

                return (
                  <motion.div
                    key={feature.featureId}
                    variants={featureVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="rounded-xl p-3 transition-all"
                    style={{
                      backgroundColor: hexToRgba(feature.color, 0.08),
                      border: `1px solid ${hexToRgba(feature.color, 0.3)}`,
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: feature.color }}
                          />
                          <span className="text-sm font-semibold" style={{ color: feature.color }}>
                            {update?.featureName || feature.featureName}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: hexToRgba(feature.color, 0.15), color: feature.color }}>
                            {update?.featureValue || feature.featureValue}
                          </span>
                          {!isActive && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.error}20`, color: theme.error }}>
                              Inactive
                            </span>
                          )}
                        </div>
                        {(update?.featureDescription || feature.featureDescription) && (
                          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                            {update?.featureDescription || feature.featureDescription}
                          </p>
                        )}
                        {(update?.specialNote || feature.specialNote) && (
                          <div className="flex items-center gap-1 mt-1">
                            <Info className="w-3 h-3" style={{ color: theme.textSecondary }} />
                            <p className="text-xs italic" style={{ color: theme.textSecondary }}>
                              {update?.specialNote || feature.specialNote}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(feature)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                          title="Edit feature"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveFeature(feature.featureId)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.error }}
                          title="Remove feature"
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

          {/* New Features Preview */}
          {addedFeatures.length > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <p className="text-xs font-medium mb-2" style={{ color: theme.warning }}>
                New features to add:
              </p>
              <div className="space-y-2">
                {addedFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: hexToRgba(feature.color, 0.08), border: `1px dashed ${feature.color}` }}
                  >
                    <Star className="w-3.5 h-3.5 mt-0.5" style={{ color: feature.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: feature.color }}>
                        {feature.featureName}: {feature.featureValue}
                      </p>
                      {feature.featureDescription && (
                        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                          {feature.featureDescription}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.warning }}>
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