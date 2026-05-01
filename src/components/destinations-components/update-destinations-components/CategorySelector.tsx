"use client";

import React, { useState, useRef } from "react";
import { Tag, X, AlertCircle, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { DestinationCategory } from "@/types/common-types";
import { useTheme } from "@/contexts/ThemeContext";

interface CategorySelectorProps {
  currentCategoryIds: number[];
  originalCategoryIds: number[];
  availableCategories: DestinationCategory[];
  onCategoryChange: (categoryId: number) => void;
  error?: string;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.32, ease: EASE_OUT } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.82, transition: { duration: 0.16, ease: "easeIn" } },
};

const rowVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 3, transition: { duration: 0.15, ease: "easeOut" } },
};

const chevronVariants: Variants = {
  open: { rotate: 180, transition: { duration: 0.28, ease: EASE_OUT } },
  closed: { rotate: 0, transition: { duration: 0.28, ease: EASE_OUT } },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.22, ease: EASE_OUT } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.16, ease: "easeIn" } },
};

const modifiedVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.16 } },
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  currentCategoryIds,
  originalCategoryIds,
  availableCategories,
  onCategoryChange,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (id: number) =>
    availableCategories.find((c) => c.destinationCategoryId === id)
      ?.destinationCategoryColor || theme.primary;

  const getCategoryName = (id: number) =>
    availableCategories.find((c) => c.destinationCategoryId === id)
      ?.destinationCategoryName || `Category ${id}`;

  const isCategorySelected = (id: number) => currentCategoryIds.includes(id);
  const isCategoryNewlyAdded = (id: number) =>
    currentCategoryIds.includes(id) && !originalCategoryIds.includes(id);
  const isCategoryRemoved = (id: number) =>
    originalCategoryIds.includes(id) && !currentCategoryIds.includes(id);

  const filteredCategories = availableCategories.filter((cat) =>
    cat.destinationCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = currentCategoryIds.length;
  const isModified =
    currentCategoryIds.length !== originalCategoryIds.length ||
    currentCategoryIds.some((id) => !originalCategoryIds.includes(id));

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
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded((prev) => !prev)}
        whileHover={{ backgroundColor: `${theme.border}30` }}
        whileTap={{ backgroundColor: `${theme.border}50` }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${theme.success}18`, color: theme.success }}
          >
            <Tag className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Categories
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {selectedCount === 0 ? "None selected" : `${selectedCount} selected`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.span
                key="count"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              >
                {selectedCount}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div variants={chevronVariants} animate={isExpanded ? "open" : "closed"}>
            <ChevronDown className="w-4 h-4" style={{ color: theme.textSecondary }} />
          </motion.div>
        </div>
      </motion.div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="body"
            variants={bodyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            {/* Selected tags */}
            <div
              className="px-4 sm:px-6 py-4"
              style={{ borderBottom: `1px solid ${theme.border}` }}
            >
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Selected Categories
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem] items-center">
                <AnimatePresence mode="popLayout">
                  {currentCategoryIds.length > 0 ? (
                    currentCategoryIds.map((id) => {
                      const color = getCategoryColor(id);
                      const isNew = isCategoryNewlyAdded(id);
                      return (
                        <motion.span
                          key={id}
                          layout
                          variants={tagVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${color}18`,
                            color,
                            border: `1px solid ${color}35`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          {getCategoryName(id)}
                          {isNew && (
                            <span className="text-xs ml-0.5" style={{ color: theme.success }}>
                              (New)
                            </span>
                          )}
                          <motion.button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onCategoryChange(id); }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full cursor-pointer"
                            style={{ color, backgroundColor: `${color}25` }}
                            aria-label={`Remove ${getCategoryName(id)}`}
                          >
                            <X className="w-2.5 h-2.5" />
                          </motion.button>
                        </motion.span>
                      );
                    })
                  ) : (
                    <motion.span
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs italic"
                      style={{ color: theme.textSecondary }}
                    >
                      No categories selected yet
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search + List */}
            <div className="px-4 sm:px-6 pb-5 pt-4">
              <p
                className="text-xs font-medium uppercase tracking-wide mb-3"
                style={{ color: theme.textSecondary }}
              >
                Available ({availableCategories.length})
              </p>

              {availableCategories.length > 6 && (
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm rounded-lg px-3 py-2 outline-none cursor-text"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      transition: "border-color 0.18s ease, box-shadow 0.18s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div
                ref={listRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                <AnimatePresence>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const isSelected = isCategorySelected(category.destinationCategoryId);
                      const isNew = isCategoryNewlyAdded(category.destinationCategoryId);
                      const isRemoved = isCategoryRemoved(category.destinationCategoryId);
                      const color = getCategoryColor(category.destinationCategoryId);

                      return (
                        <motion.label
                          key={category.destinationCategoryId}
                          variants={rowVariants}
                          initial="rest"
                          whileHover="hover"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? `${color}10` : "transparent",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.backgroundColor = `${theme.border}50`;
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <motion.span
                            animate={isSelected ? "checked" : "unchecked"}
                            variants={{
                              unchecked: { scale: 1 },
                              checked: { scale: [1, 1.2, 1], transition: { duration: 0.25, ease: EASE_OUT } },
                            }}
                            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md"
                            style={{
                              backgroundColor: isSelected ? color : "transparent",
                              border: `2px solid ${isSelected ? color : theme.border}`,
                              transition: "background-color 0.18s ease, border-color 0.18s ease",
                            }}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  key="check"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.18, ease: EASE_OUT }}
                                >
                                  <Check className="w-3 h-3" style={{ color: "#fff" }} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.span>

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onCategoryChange(category.destinationCategoryId)}
                            className="sr-only"
                          />

                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />

                          <div className="flex-1 min-w-0">
                            <span
                              className="text-sm font-medium"
                              style={{
                                color: isSelected ? color : theme.text,
                                transition: "color 0.18s ease",
                              }}
                            >
                              {category.destinationCategoryName}
                            </span>
                            {isNew && (
                              <span className="ml-2 text-xs" style={{ color: theme.success }}>
                                (New)
                              </span>
                            )}
                            {isRemoved && (
                              <span className="ml-2 text-xs" style={{ color: theme.error }}>
                                (Removing)
                              </span>
                            )}
                          </div>
                        </motion.label>
                      );
                    })
                  ) : (
                    <motion.p
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-2 text-sm text-center py-4"
                      style={{ color: theme.textSecondary }}
                    >
                      No categories match your search
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isModified && (
                  <motion.div
                    key="modified"
                    variants={modifiedVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-4 pt-3 flex items-center gap-2 text-xs"
                    style={{ borderTop: `1px solid ${theme.border}`, color: theme.primary }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Categories have been modified
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-4 sm:px-6 py-3 flex items-center gap-2 text-sm overflow-hidden"
            style={{
              borderTop: `1px solid ${theme.error}30`,
              backgroundColor: `${theme.error}08`,
              color: theme.error,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};