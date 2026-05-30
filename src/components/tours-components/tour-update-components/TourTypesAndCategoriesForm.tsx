"use client";

import React, { useState } from "react";
import { Tag, Plus, X, ChevronDown, Star, Layers } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  TourType as CommonTourType,
  TourCategory as CommonTourCategory,
} from "@/types/common-types";
import { UpdateTourType, UpdateTourCategory } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, sectionVariants, tagVariants } from "@/app/animations/variants";

interface ApiTourType {
  tourTypeId: number;
  tourTypeName: string;
  tourTypeDescription: string;
}

interface ApiTourCategory {
  tourCategoryId: number;
  tourCategoryName: string;
  tourCategoryDescription: string;
}

interface TourTypesAndCategoriesFormProps {
  tourTypes: ApiTourType[];
  tourCategories: ApiTourCategory[];
  removedTourTypes: number[];
  newTourTypes: number[];
  updatedTourTypes: UpdateTourType[];
  removedTourCategories: number[];
  newTourCategories: number[];
  updatedTourCategories: UpdateTourCategory[];
  availableTourTypes: CommonTourType[];
  availableTourCategories: CommonTourCategory[];
  onAddTourType: (typeId: number) => void;
  onRemoveTourType: (typeId: number) => void;
  onUpdateTourType: (
    typeId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddTourCategory: (categoryId: number) => void;
  onRemoveTourCategory: (categoryId: number) => void;
  onUpdateTourCategory: (
    categoryId: number,
    isPrimary: boolean,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
}

export const TourTypesAndCategoriesForm: React.FC<
  TourTypesAndCategoriesFormProps
> = ({
  tourTypes,
  tourCategories,
  removedTourTypes,
  newTourTypes,
  updatedTourTypes,
  removedTourCategories,
  newTourCategories,
  updatedTourCategories,
  availableTourTypes,
  availableTourCategories,
  onAddTourType,
  onRemoveTourType,
  onUpdateTourType,
  onAddTourCategory,
  onRemoveTourCategory,
  onUpdateTourCategory,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["types", "categories"]),
  );
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isPrimaryForType, setIsPrimaryForType] = useState(false);
  const [isPrimaryForCategory, setIsPrimaryForCategory] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  const isTypeRemoved = (id: number) => removedTourTypes.includes(id);
  const isTypeNew = (id: number) => newTourTypes.includes(id);
  const isTypeUpdated = (id: number) =>
    updatedTourTypes.some((u) => u.tourTypeId === id);
  const getTypeUpdate = (id: number) =>
    updatedTourTypes.find((u) => u.tourTypeId === id);

  const isCategoryRemoved = (id: number) => removedTourCategories.includes(id);
  const isCategoryNew = (id: number) => newTourCategories.includes(id);
  const isCategoryUpdated = (id: number) =>
    updatedTourCategories.some((u) => u.tourCategoryId === id);
  const getCategoryUpdate = (id: number) =>
    updatedTourCategories.find((u) => u.tourCategoryId === id);

  // Get primary status - tracked through updated state
  const getTypeIsPrimary = (typeId: number): boolean => {
    const update = getTypeUpdate(typeId);
    if (update) return update.isPrimary;
    return false;
  };

  const getCategoryIsPrimary = (categoryId: number): boolean => {
    const update = getCategoryUpdate(categoryId);
    if (update) return update.isPrimary;
    return false;
  };

  // Helper to get type name from availableTourTypes
  const getTypeName = (typeId: number): string => {
    const type = availableTourTypes.find((t) => t.tourTypeId === typeId);
    return type?.tourTypeName || `Type ${typeId}`;
  };

  // Helper to get category name from availableTourCategories
  const getCategoryName = (categoryId: number): string => {
    const category = availableTourCategories.find(
      (c) => c.tourCategoryId === categoryId,
    );
    return category?.tourCategoryName || `Category ${categoryId}`;
  };

  const availableTypesToAdd = availableTourTypes.filter(
    (t) =>
      !tourTypes.some((existing) => existing.tourTypeId === t.tourTypeId) &&
      !isTypeRemoved(t.tourTypeId),
  );

  const availableCategoriesToAdd = availableTourCategories.filter(
    (c) =>
      !tourCategories.some(
        (existing) => existing.tourCategoryId === c.tourCategoryId,
      ) && !isCategoryRemoved(c.tourCategoryId),
  );

  const handleAddType = () => {
    if (selectedTypeId) {
      onAddTourType(selectedTypeId);
      setSelectedTypeId(null);
      setIsPrimaryForType(false);
      setShowTypeForm(false);
    }
  };

  const handleAddCategory = () => {
    if (selectedCategoryId) {
      onAddTourCategory(selectedCategoryId);
      setSelectedCategoryId(null);
      setIsPrimaryForCategory(false);
      setShowCategoryForm(false);
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
        className="flex items-center gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: `${theme.success}18`,
            color: theme.success,
          }}
        >
          <Layers className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-sm sm:text-base font-semibold"
            style={{ color: theme.text }}
          >
            Tour Types & Categories
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Manage tour classifications
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 space-y-6">
        {/* Tour Types Section */}
        <div>
          <button
            onClick={() => toggleSection("types")}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{
              backgroundColor: `${theme.border}20`,
            }}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: theme.primary }} />
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Tour Types
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                {tourTypes.filter((t) => !isTypeRemoved(t.tourTypeId)).length}
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                transform: expandedSections.has("types")
                  ? "rotate(180deg)"
                  : "none",
                color: theme.textSecondary,
              }}
            />
          </button>

          {expandedSections.has("types") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              {/* Add Type Form */}
              <AnimatePresence>
                {showTypeForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${theme.primary}08`,
                      border: `1px solid ${theme.primary}25`,
                    }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: theme.text }}
                    >
                      Add Tour Type
                    </h4>
                    <select
                      value={selectedTypeId || ""}
                      onChange={(e) =>
                        setSelectedTypeId(parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm mb-3"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      <option value="">Select a tour type...</option>
                      {availableTypesToAdd.map((type) => (
                        <option key={type.tourTypeId} value={type.tourTypeId}>
                          {type.tourTypeName} - {type.tourTypeDescription}
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrimaryForType}
                        onChange={(e) => setIsPrimaryForType(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Mark as Primary Type
                      </span>
                      <Star
                        className="w-3.5 h-3.5"
                        style={{ color: theme.warning }}
                      />
                    </label>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowTypeForm(false);
                          setSelectedTypeId(null);
                          setIsPrimaryForType(false);
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
                        onClick={handleAddType}
                        disabled={!selectedTypeId}
                        className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{
                          backgroundColor: theme.primary,
                          color: "#fff",
                        }}
                      >
                        Add Type
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Types List */}
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence mode="popLayout">
                  {tourTypes.map((type) => {
                    if (isTypeRemoved(type.tourTypeId)) return null;
                    const isPrimary = getTypeIsPrimary(type.tourTypeId);
                    const update = getTypeUpdate(type.tourTypeId);
                    const isActive = update ? update.status === "ACTIVE" : true;

                    return (
                      <motion.div
                        key={type.tourTypeId}
                        variants={tagVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                        style={{
                          backgroundColor: isActive
                            ? `${theme.primary}15`
                            : `${theme.textSecondary}10`,
                          border: `1px solid ${isActive ? theme.primary : theme.textSecondary}40`,
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span
                          style={{
                            color: isActive
                              ? theme.primary
                              : theme.textSecondary,
                          }}
                        >
                          {type.tourTypeName}
                        </span>

                        {/* Primary Star Toggle */}
                        <button
                          onClick={() =>
                            onUpdateTourType(
                              type.tourTypeId,
                              !isPrimary,
                              isActive ? "ACTIVE" : "INACTIVE",
                            )
                          }
                          className="cursor-pointer transition-all hover:scale-110"
                          title={
                            isPrimary ? "Remove primary" : "Set as primary"
                          }
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            style={{
                              color: isPrimary
                                ? theme.warning
                                : `${theme.primary}70`,
                              fill: isPrimary ? theme.warning : "none",
                            }}
                          />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() =>
                            onUpdateTourType(
                              type.tourTypeId,
                              isPrimary,
                              isActive ? "INACTIVE" : "ACTIVE",
                            )
                          }
                          className="cursor-pointer text-xs px-1.5 py-0.5 rounded-full transition-all"
                          style={{
                            backgroundColor: isActive
                              ? `${theme.error}20`
                              : `${theme.success}20`,
                            color: isActive ? theme.error : theme.success,
                          }}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveTourType(type.tourTypeId)}
                          className="cursor-pointer ml-1 p-0.5 rounded-full hover:bg-black/10 transition-all"
                        >
                          <X
                            className="w-3 h-3"
                            style={{ color: theme.error }}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowTypeForm(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tour Type
              </button>
            </motion.div>
          )}
        </div>

        {/* Tour Categories Section */}
        <div>
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
            style={{
              backgroundColor: `${theme.border}20`,
            }}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: theme.accent }} />
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                Tour Categories
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                }}
              >
                {
                  tourCategories.filter(
                    (c) => !isCategoryRemoved(c.tourCategoryId),
                  ).length
                }
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                transform: expandedSections.has("categories")
                  ? "rotate(180deg)"
                  : "none",
                color: theme.textSecondary,
              }}
            />
          </button>

          {expandedSections.has("categories") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              {/* Add Category Form */}
              <AnimatePresence>
                {showCategoryForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${theme.accent}08`,
                      border: `1px solid ${theme.accent}25`,
                    }}
                  >
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: theme.text }}
                    >
                      Add Tour Category
                    </h4>
                    <select
                      value={selectedCategoryId || ""}
                      onChange={(e) =>
                        setSelectedCategoryId(parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm mb-3"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      <option value="">Select a tour category...</option>
                      {availableCategoriesToAdd.map((category) => (
                        <option
                          key={category.tourCategoryId}
                          value={category.tourCategoryId}
                        >
                          {category.tourCategoryName} -{" "}
                          {category.tourCategoryDescription}
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrimaryForCategory}
                        onChange={(e) =>
                          setIsPrimaryForCategory(e.target.checked)
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Mark as Primary Category
                      </span>
                      <Star
                        className="w-3.5 h-3.5"
                        style={{ color: theme.warning }}
                      />
                    </label>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowCategoryForm(false);
                          setSelectedCategoryId(null);
                          setIsPrimaryForCategory(false);
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
                        onClick={handleAddCategory}
                        disabled={!selectedCategoryId}
                        className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        style={{
                          backgroundColor: theme.accent,
                          color: "#fff",
                        }}
                      >
                        Add Category
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Categories List */}
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence mode="popLayout">
                  {tourCategories.map((category) => {
                    if (isCategoryRemoved(category.tourCategoryId)) return null;
                    const isPrimary = getCategoryIsPrimary(
                      category.tourCategoryId,
                    );
                    const update = getCategoryUpdate(category.tourCategoryId);
                    const isActive = update ? update.status === "ACTIVE" : true;

                    return (
                      <motion.div
                        key={category.tourCategoryId}
                        variants={tagVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                        style={{
                          backgroundColor: isActive
                            ? `${theme.accent}15`
                            : `${theme.textSecondary}10`,
                          border: `1px solid ${isActive ? theme.accent : theme.textSecondary}40`,
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span
                          style={{
                            color: isActive
                              ? theme.accent
                              : theme.textSecondary,
                          }}
                        >
                          {category.tourCategoryName}
                        </span>

                        {/* Primary Star Toggle */}
                        <button
                          onClick={() =>
                            onUpdateTourCategory(
                              category.tourCategoryId,
                              !isPrimary,
                              isActive ? "ACTIVE" : "INACTIVE",
                            )
                          }
                          className="cursor-pointer transition-all hover:scale-110"
                          title={
                            isPrimary ? "Remove primary" : "Set as primary"
                          }
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            style={{
                              color: isPrimary
                                ? theme.warning
                                : `${theme.accent}70`,
                              fill: isPrimary ? theme.warning : "none",
                            }}
                          />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() =>
                            onUpdateTourCategory(
                              category.tourCategoryId,
                              isPrimary,
                              isActive ? "INACTIVE" : "ACTIVE",
                            )
                          }
                          className="cursor-pointer text-xs px-1.5 py-0.5 rounded-full transition-all"
                          style={{
                            backgroundColor: isActive
                              ? `${theme.error}20`
                              : `${theme.success}20`,
                            color: isActive ? theme.error : theme.success,
                          }}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() =>
                            onRemoveTourCategory(category.tourCategoryId)
                          }
                          className="cursor-pointer ml-1 p-0.5 rounded-full hover:bg-black/10 transition-all"
                        >
                          <X
                            className="w-3 h-3"
                            style={{ color: theme.error }}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.accent}10`,
                  color: theme.accent,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tour Category
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
