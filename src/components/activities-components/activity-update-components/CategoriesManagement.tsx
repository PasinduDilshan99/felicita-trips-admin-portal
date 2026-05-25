// components/activities-components/update-activity-components/CategoriesManagement.tsx
"use client";

import React, { useState, useId } from "react";
import { Tag, Plus, X, Check, ChevronDown, Star } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ActivityCategoryFullDetail, AddCategoryRequest } from "@/types/activity-types";
import { ActivityCategory } from "@/types/common-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface CategoriesManagementProps {
  categories: ActivityCategoryFullDetail[];
  originalCategoryIds: number[];
  currentCategoryIds: number[];
  removedCategories: number[];
  newCategories: AddCategoryRequest[];
  availableCategories: ActivityCategory[];
  onCategoryPrimaryChange: (categoryId: number, isPrimary: boolean) => void;
  onRemoveCategory: (categoryId: number) => void;
  onAddNewCategory: (categoryId: number, isPrimary: boolean) => void;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

export const CategoriesManagement: React.FC<CategoriesManagementProps> = ({
  categories,
  originalCategoryIds,
  currentCategoryIds,
  removedCategories,
  newCategories,
  availableCategories,
  onCategoryPrimaryChange,
  onRemoveCategory,
  onAddNewCategory,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isPrimaryForNew, setIsPrimaryForNew] = useState(false);

  const getCategoryColor = (id: number) => {
    const cat = availableCategories.find((c) => c.activityCategoryId === id);
    return cat?.activityCategoryColor || theme.primary;
  };

  const getCategoryName = (id: number) => {
    const cat = availableCategories.find((c) => c.activityCategoryId === id);
    return cat?.activityCategoryName || `Category ${id}`;
  };

  const isCategoryRemoved = (id: number) => removedCategories.includes(id);
  const isCategoryNew = (id: number) => newCategories.some((c) => c.categoryId === id);
  const isCategoryPrimary = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.is_primary || false;
  };

  const filteredCategories = availableCategories.filter((cat) =>
    cat.activityCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableToAdd = availableCategories.filter(
    (cat) => !categories.some((c) => c.id === cat.activityCategoryId) && !isCategoryRemoved(cat.activityCategoryId)
  );

  const handleAddCategory = () => {
    if (selectedCategoryId) {
      onAddNewCategory(selectedCategoryId, isPrimaryForNew);
      setSelectedCategoryId(null);
      setIsPrimaryForNew(false);
      setShowAddForm(false);
      setSearchQuery("");
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
            style={{ backgroundColor: `${theme.success}18`, color: theme.success }}
          >
            <Tag className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Categories
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {categories.filter((c) => !isCategoryRemoved(c.id)).length} categories assigned
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
              backgroundColor: `${theme.success}15`,
              color: theme.success,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Category
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{ transform: isExpanded ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* Add Category Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.success}08`,
                  border: `1px solid ${theme.success}25`,
                }}
              >
                <h4 className="text-sm font-medium mb-3" style={{ color: theme.text }}>
                  Add New Category
                </h4>

                <select
                  value={selectedCategoryId || ""}
                  onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border-2 text-sm mb-3"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  <option value="">Select a category...</option>
                  {availableToAdd.map((cat) => (
                    <option key={cat.activityCategoryId} value={cat.activityCategoryId}>
                      {cat.activityCategoryName}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimaryForNew}
                    onChange={(e) => setIsPrimaryForNew(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>
                    Mark as Primary Category
                  </span>
                  <Star className="w-3.5 h-3.5" style={{ color: theme.warning }} />
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedCategoryId(null);
                      setIsPrimaryForNew(false);
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
                      backgroundColor: theme.success,
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
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {categories.map((category) => {
                const isRemoved = isCategoryRemoved(category.id);
                if (isRemoved) return null;

                const color = getCategoryColor(category.id);
                const isPrimary = category.is_primary;

                return (
                  <motion.div
                    key={category.id}
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span style={{ color }}>{category.name}</span>
                    
                    {/* Primary Star */}
                    <button
                      onClick={() => onCategoryPrimaryChange(category.id, !isPrimary)}
                      className="cursor-pointer transition-all hover:scale-110"
                      title={isPrimary ? "Remove primary" : "Set as primary"}
                    >
                      <Star
                        className="w-3.5 h-3.5"
                        style={{ color: isPrimary ? theme.warning : `${color}70`, fill: isPrimary ? theme.warning : "none" }}
                      />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveCategory(category.id)}
                      className="cursor-pointer ml-1 p-0.5 rounded-full hover:bg-black/10 transition-all"
                    >
                      <X className="w-3 h-3" style={{ color }} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* New Categories Preview */}
          {newCategories.length > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <p className="text-xs font-medium mb-2" style={{ color: theme.success }}>
                New categories to add:
              </p>
              <div className="flex flex-wrap gap-2">
                {newCategories.map((cat) => {
                  const color = getCategoryColor(cat.categoryId);
                  return (
                    <span
                      key={cat.categoryId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}40`,
                        color,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      {getCategoryName(cat.categoryId)}
                      {cat.isPrimary && <Star className="w-3 h-3 ml-0.5" style={{ color: theme.warning, fill: theme.warning }} />}
                      <span className="ml-1 text-[10px]">(New)</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};