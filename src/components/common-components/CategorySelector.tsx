"use client";

import React, { useState } from "react";
import { Tag, Star, X, AlertCircle, ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export type SelectionMode = "simple" | "primary-secondary";

interface BaseCategory {
  id: number;
  name: string;
  color?: string | null;
  hoverColor?: string | null;
  description?: string | null;
}

interface SimpleSelectedItem {
  id: number;
}

interface PrimarySecondarySelectedItem {
  id: number;
  isPrimary: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

type SelectedItem = SimpleSelectedItem | PrimarySecondarySelectedItem;

interface CategorySelectorProps<T extends BaseCategory> {
  categories: T[];
  selectedItems: SelectedItem[];
  onCategoryAdd: (categoryId: number) => void;
  onCategoryRemove: (categoryId: number) => void;
  onSetPrimary?: (categoryId: number) => void;
  mode?: SelectionMode;
  title?: string;
  description?: string;
  error?: string;
  showDescriptions?: boolean;
}

export const CategorySelector = <T extends BaseCategory>({
  categories,
  selectedItems,
  onCategoryAdd,
  onCategoryRemove,
  onSetPrimary,
  mode = "simple",
  title = "Categories",
  description = "Select categories",
  error,
  showDescriptions = false,
}: CategorySelectorProps<T>) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryColor = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || theme.primary;
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  const getCategoryDescription = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.description || "";
  };

  const isCategorySelected = (categoryId: number): boolean => {
    return selectedItems.some((item) => item.id === categoryId);
  };

  const isPrimaryCategory = (categoryId: number): boolean => {
    if (mode !== "primary-secondary") return false;
    const item = selectedItems.find(
      (item) => item.id === categoryId
    ) as PrimarySecondarySelectedItem;
    return item?.isPrimary || false;
  };

  const selectedCount = selectedItems.length;
  const primaryCount =
    mode === "primary-secondary"
      ? selectedItems.filter((item) => (item as PrimarySecondarySelectedItem).isPrimary).length
      : 0;

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = (categoryId: number) => {
    if (isCategorySelected(categoryId)) return;
    
    if (mode === "primary-secondary") {
      const hasPrimary = selectedItems.some(
        (item) => (item as PrimarySecondarySelectedItem).isPrimary
      );
      if (!hasPrimary && onSetPrimary) {
        onSetPrimary(categoryId);
      }
    }
    onCategoryAdd(categoryId);
  };

  const handleSetPrimary = (categoryId: number) => {
    if (onSetPrimary) {
      onSetPrimary(categoryId);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tagPop {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .category-tag { animation: tagPop 0.22s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .category-row { transition: background 0.15s ease, transform 0.15s ease; }
        .category-row:hover { transform: translateX(2px); }
        .panel-body { animation: fadeSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .remove-btn { transition: background 0.15s ease, transform 0.15s ease; }
        .remove-btn:hover { transform: scale(1.2); }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${error ? theme.error : theme.border}`,
          boxShadow: error
            ? `0 0 0 3px ${theme.error}18`
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
          style={{ borderBottom: `1px solid ${theme.border}` }}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.success}18`,
                color: theme.success,
              }}
            >
              <Tag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
                {title}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                {selectedCount}
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
          <div className="panel-body">
            {/* Selected items */}
            <div
              className="px-6 py-4"
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Selected {mode === "primary-secondary" ? "(★ = Primary)" : ""}
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem] items-center">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => {
                    const categoryId = item.id;
                    const isPrimary =
                      mode === "primary-secondary"
                        ? (item as PrimarySecondarySelectedItem).isPrimary
                        : false;
                    const color = getCategoryColor(categoryId);
                    return (
                      <span
                        key={categoryId}
                        className="category-tag inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${color}18`,
                          color: color,
                          border: `1px solid ${color}35`,
                        }}
                      >
                        {isPrimary && (
                          <Star className="w-3 h-3" style={{ color: color }} />
                        )}
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        {getCategoryName(categoryId)}
                        {isPrimary && (
                          <span
                            className="text-[10px] ml-0.5 px-1 py-0.5 rounded"
                            style={{ backgroundColor: `${color}30` }}
                          >
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryRemove(categoryId);
                          }}
                          className="remove-btn ml-0.5 flex items-center justify-center w-4 h-4 rounded-full hover:scale-110 transition-transform"
                          style={{
                            color: color,
                            backgroundColor: `${color}25`,
                          }}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span
                    className="text-xs italic"
                    style={{ color: theme.textSecondary }}
                  >
                    No categories selected yet
                  </span>
                )}
              </div>
              {mode === "primary-secondary" && primaryCount === 0 && selectedCount > 0 && (
                <p
                  className="text-xs mt-2 flex items-center gap-1"
                  style={{ color: theme.warning }}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Please set one category as primary
                </p>
              )}
            </div>

            {/* Category list */}
            <div className="px-6 pb-5 pt-4">
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Available ({categories.length})
              </p>

              {categories.length > 6 && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm rounded-lg px-3 py-2 outline-none transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const categoryId = category.id;
                    const isSelected = isCategorySelected(categoryId);
                    const isPrimary = isPrimaryCategory(categoryId);
                    const color = getCategoryColor(categoryId);

                    return (
                      <div
                        key={categoryId}
                        className="category-row rounded-xl overflow-hidden"
                        style={{
                          backgroundColor: isSelected ? `${color}08` : "transparent",
                          border: `1px solid ${isSelected ? `${color}30` : "transparent"}`,
                        }}
                      >
                        <div className="flex items-center justify-between p-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: theme.text }}
                              >
                                {category.name}
                              </span>
                            </div>
                            {showDescriptions && category.description && (
                              <p
                                className="text-xs mt-1 ml-5"
                                style={{ color: theme.textSecondary }}
                              >
                                {category.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <>
                                {mode === "primary-secondary" && !isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimary(categoryId)}
                                    className="px-2 py-1 rounded text-xs font-medium transition-all"
                                    style={{
                                      backgroundColor: `${theme.primary}20`,
                                      color: theme.primary,
                                    }}
                                  >
                                    Set as Primary
                                  </button>
                                )}
                                {mode === "primary-secondary" && isPrimary && (
                                  <span
                                    className="px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${theme.success}20`,
                                      color: theme.success,
                                    }}
                                  >
                                    Primary ✓
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => onCategoryRemove(categoryId)}
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                  style={{
                                    backgroundColor: `${theme.error}15`,
                                    color: theme.error,
                                  }}
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddCategory(categoryId)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2"
                                style={{
                                  backgroundColor: "transparent",
                                  borderColor: theme.border,
                                  color: theme.textSecondary,
                                }}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p
                    className="text-sm text-center py-4"
                    style={{ color: theme.textSecondary }}
                  >
                    No categories match your search
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            className="px-6 py-3 flex items-center gap-2 text-sm"
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
      </div>
    </>
  );
};