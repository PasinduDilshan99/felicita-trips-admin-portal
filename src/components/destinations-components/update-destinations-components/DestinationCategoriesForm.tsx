"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ChevronDown, X, Check } from "lucide-react";
import { DestinationCategory } from "@/types/common-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

interface DestinationCategoriesFormProps {
  currentCategoryIds: number[];
  originalCategoryIds: number[];
  availableCategories: DestinationCategory[];
  onCategoryChange: (categoryId: number) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const DestinationCategoriesForm: React.FC<DestinationCategoriesFormProps> = ({
  currentCategoryIds,
  originalCategoryIds,
  availableCategories,
  onCategoryChange,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const getCategoryColor = (id: number) =>
    availableCategories.find((c) => c.destinationCategoryId === id)
      ?.destinationCategoryColor || theme.primary;

  const getCategoryName = (id: number) =>
    availableCategories.find((c) => c.destinationCategoryId === id)
      ?.destinationCategoryName || `Category ${id}`;

  const isCategorySelected = (id: number) => currentCategoryIds.includes(id);
  const isCategoryNewlyAdded = (id: number) =>
    currentCategoryIds.includes(id) && !originalCategoryIds.includes(id);

  const selectedCount = currentCategoryIds.length;
  const isModified = currentCategoryIds.length !== originalCategoryIds.length ||
    currentCategoryIds.some((id) => !originalCategoryIds.includes(id));

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
      <button
        onClick={() => onToggleSection("categories")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("categories") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("categories") ? `1px solid ${theme.border}` : "none",
        }}
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
              {selectedCount === 0 ? "None selected" : `${selectedCount} selected`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              {selectedCount}
            </span>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("categories") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("categories") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Selected tags */}
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: theme.textSecondary }}>
                Selected Categories
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem] items-center">
                {currentCategoryIds.length > 0 ? (
                  currentCategoryIds.map((id) => {
                    const color = getCategoryColor(id);
                    const isNew = isCategoryNewlyAdded(id);
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${color}18`,
                          color,
                          border: `1px solid ${color}35`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        {getCategoryName(id)}
                        {isNew && (
                          <span className="text-xs ml-0.5" style={{ color: theme.success }}>(New)</span>
                        )}
                        <button
                          type="button"
                          onClick={() => onCategoryChange(id)}
                          className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full cursor-pointer"
                          style={{ color, backgroundColor: `${color}25` }}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs italic" style={{ color: theme.textSecondary }}>
                    No categories selected yet
                  </span>
                )}
              </div>
            </div>

            {/* Available categories grid */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: theme.textSecondary }}>
                Available Categories ({availableCategories.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
                {availableCategories.map((category) => {
                  const isSelected = isCategorySelected(category.destinationCategoryId);
                  const isNew = isCategoryNewlyAdded(category.destinationCategoryId);
                  const color = getCategoryColor(category.destinationCategoryId);

                  return (
                    <label
                      key={category.destinationCategoryId}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isSelected ? `${color}10` : "transparent",
                      }}
                    >
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md"
                        style={{
                          backgroundColor: isSelected ? color : "transparent",
                          border: `2px solid ${isSelected ? color : theme.border}`,
                        }}
                      >
                        {isSelected && <Check className="w-3 h-3" style={{ color: "#fff" }} />}
                      </span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onCategoryChange(category.destinationCategoryId)}
                        className="sr-only"
                      />
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm" style={{ color: isSelected ? color : theme.text }}>
                        {category.destinationCategoryName}
                      </span>
                      {isNew && (
                        <span className="ml-auto text-xs" style={{ color: theme.success }}>(New)</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {isModified && (
              <div className="mt-4 pt-3 flex items-center gap-2 text-xs border-t" style={{ borderColor: theme.border, color: theme.primary }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                Categories have been modified
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};