"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tag, X, AlertCircle, Check, ChevronDown } from "lucide-react";
import { DestinationCategory } from "@/types/common-types";
import { useTheme } from "@/contexts/ThemeContext";

interface CategorySelectorProps {
  categories: DestinationCategory[];
  selectedCategoryIds: number[];
  onCategoryChange: (categoryId: number) => void;
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryIds,
  onCategoryChange,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (categoryId: number): string => {
    const category = categories.find(
      (cat) => cat.destinationCategoryId === categoryId
    );
    return category?.destinationCategoryColor || theme.primary;
  };

  const getCategoryHoverColor = (categoryId: number): string => {
    const category = categories.find(
      (cat) => cat.destinationCategoryId === categoryId
    );
    return (
      category?.destinationCategoryHoverColor ||
      category?.destinationCategoryColor ||
      theme.primary
    );
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(
      (cat) => cat.destinationCategoryId === categoryId
    );
    return category
      ? category.destinationCategoryName
      : `Category ${categoryId}`;
  };

  const filteredCategories = categories.filter((cat) =>
    cat.destinationCategoryName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const selectedCount = selectedCategoryIds.length;

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
        .category-tag {
          animation: tagPop 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .category-row {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .category-row:hover {
          transform: translateX(2px);
        }
        .panel-body {
          animation: fadeSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .remove-btn {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .remove-btn:hover {
          transform: scale(1.2);
        }
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
        {/* ── Header ── */}
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
              <h2
                className="text-base font-semibold leading-tight"
                style={{ color: theme.text }}
              >
                Categories
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                {selectedCount === 0
                  ? "None selected"
                  : `${selectedCount} selected`}
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

        {/* ── Body ── */}
        {isExpanded && (
          <div className="panel-body">
            {/* Selected tags row */}
            <div
              className="px-6 py-4"
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Selected
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem] items-center">
                {selectedCategoryIds.length > 0 ? (
                  selectedCategoryIds.map((id) => {
                    const color = getCategoryColor(id);
                    return (
                      <span
                        key={id}
                        className="category-tag inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${color}18`,
                          color: color,
                          border: `1px solid ${color}35`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        {getCategoryName(id)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryChange(id);
                          }}
                          className="remove-btn ml-0.5 flex items-center justify-center w-4 h-4 rounded-full"
                          style={{
                            color: color,
                            backgroundColor: `${color}25`,
                          }}
                          aria-label={`Remove ${getCategoryName(id)}`}
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
            </div>

            {/* Search + List */}
            <div className="px-6 pb-5 pt-4">
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Available ({categories.length})
              </p>

              {/* Search */}
              {categories.length > 6 && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search categories…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm rounded-lg px-3 py-2 outline-none transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = theme.primary)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = theme.border)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Grid */}
              <div
                ref={listRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isSelected = selectedCategoryIds.includes(
                      category.destinationCategoryId
                    );
                    const color = getCategoryColor(
                      category.destinationCategoryId
                    );
                    return (
                      <label
                        key={category.destinationCategoryId}
                        className="category-row flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                        style={{
                          backgroundColor: isSelected
                            ? `${color}10`
                            : "transparent",
                        }}
                        onMouseEnter={(e) =>
                          !isSelected &&
                          ((e.currentTarget.style.backgroundColor = `${theme.border}50`))
                        }
                        onMouseLeave={(e) =>
                          !isSelected &&
                          ((e.currentTarget.style.backgroundColor =
                            "transparent"))
                        }
                      >
                        {/* Custom checkbox */}
                        <span
                          className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200"
                          style={{
                            backgroundColor: isSelected
                              ? color
                              : "transparent",
                            border: `2px solid ${isSelected ? color : theme.border}`,
                          }}
                        >
                          {isSelected && (
                            <Check
                              className="w-3 h-3"
                              style={{ color: "#fff" }}
                            />
                          )}
                        </span>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            onCategoryChange(category.destinationCategoryId)
                          }
                          className="sr-only"
                        />

                        {/* Color dot */}
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />

                        <span
                          className="text-sm font-medium truncate"
                          style={{
                            color: isSelected ? color : theme.text,
                          }}
                        >
                          {category.destinationCategoryName}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <p
                    className="col-span-2 text-sm text-center py-4"
                    style={{ color: theme.textSecondary }}
                  >
                    No categories match your search
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
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