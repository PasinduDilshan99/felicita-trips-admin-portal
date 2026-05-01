"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.02,
      duration: 0.2,
      ease: EASE_OUT,
    },
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
    },
  },
};

const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const clearButtonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.15 } },
  tap: { scale: 0.9, transition: { duration: 0.1 } },
};

export interface SearchItem {
  id: number | string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CommonSearchProps<T extends SearchItem> {
  // Data
  items: T[];
  loading?: boolean;
  selectedItem: T | null;
  
  // Callbacks
  onSelectItem: (item: T) => void;
  onClearSelection?: () => void;
  
  // Configuration
  initialSearchTerm?: string;
  placeholder?: string;
  title?: string;
  noResultsMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  
  // Customization
  getItemId?: (item: T) => number | string;
  getItemName?: (item: T) => string;
  getItemDescription?: (item: T) => string;
  renderItem?: (item: T, searchTerm: string, isActive: boolean) => React.ReactNode;
  getBadgeText?: (item: T) => string;
  
  // Styling variants
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  hideBadge?: boolean;
}

const CommonSearch = <T extends SearchItem>({
  items,
  loading = false,
  selectedItem,
  onSelectItem,
  onClearSelection,
  initialSearchTerm = "",
  placeholder = "Search...",
  title = "Items",
  noResultsMessage = "No items found",
  loadingMessage = "Loading items...",
  disabled = false,
  getItemId = (item) => item.id,
  getItemName = (item) => item.name,
  getItemDescription = (item) => item.description || "",
  renderItem,
  getBadgeText,
  variant = "default",
  size = "md",
  hideBadge = false,
}: CommonSearchProps<T>) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create stable references for filtering functions
  const stableGetItemId = useCallback(
    (item: T) => getItemId(item),
    [getItemId]
  );

  const stableGetItemName = useCallback(
    (item: T) => getItemName(item),
    [getItemName]
  );

  const stableGetItemDescription = useCallback(
    (item: T) => getItemDescription(item),
    [getItemDescription]
  );

  // Use useMemo instead of useEffect for filtering to prevent infinite loops
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    const searchLower = searchTerm.toLowerCase();
    return items.filter((item) =>
      stableGetItemName(item).toLowerCase().includes(searchLower)
    );
  }, [searchTerm, items, stableGetItemName]);

  // Update search term when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setSearchTerm(stableGetItemName(selectedItem));
    } else if (!initialSearchTerm) {
      setSearchTerm("");
    }
  }, [selectedItem, stableGetItemName, initialSearchTerm]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get variant colors
  const getVariantColors = () => {
    switch (variant) {
      case "primary":
        return {
          primary: theme.primary,
          accent: theme.accent,
          bgLight: hexToRgba(theme.primary, 0.1),
          bgLighter: hexToRgba(theme.primary, 0.05),
          text: theme.primary,
        };
      case "success":
        return {
          primary: theme.success,
          accent: theme.success,
          bgLight: hexToRgba(theme.success, 0.1),
          bgLighter: hexToRgba(theme.success, 0.05),
          text: theme.success,
        };
      case "warning":
        return {
          primary: theme.warning,
          accent: theme.warning,
          bgLight: hexToRgba(theme.warning, 0.1),
          bgLighter: hexToRgba(theme.warning, 0.05),
          text: theme.warning,
        };
      case "error":
        return {
          primary: theme.error,
          accent: theme.error,
          bgLight: hexToRgba(theme.error, 0.1),
          bgLighter: hexToRgba(theme.error, 0.05),
          text: theme.error,
        };
      default:
        return {
          primary: theme.primary,
          accent: theme.accent,
          bgLight: hexToRgba(theme.primary, 0.1),
          bgLighter: hexToRgba(theme.primary, 0.05),
          text: theme.primary,
        };
    }
  };

  const colors = getVariantColors();

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "px-3 py-2",
      inputPadding: "px-2 py-2",
      iconSize: 14,
      fontSize: "text-xs",
      badgePadding: "px-2 py-1",
      badgeTextSize: "text-xs",
    },
    md: {
      padding: "px-4 py-3.5",
      inputPadding: "px-3 py-3.5",
      iconSize: 17,
      fontSize: "text-sm",
      badgePadding: "px-3 py-1.5",
      badgeTextSize: "text-xs",
    },
    lg: {
      padding: "px-5 py-4",
      inputPadding: "px-4 py-4",
      iconSize: 20,
      fontSize: "text-base",
      badgePadding: "px-4 py-2",
      badgeTextSize: "text-sm",
    },
  };

  const config = sizeConfig[size];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleSelectItem = (item: T) => {
    onSelectItem(item);
    setSearchTerm(stableGetItemName(item));
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
    if (onClearSelection) {
      onClearSelection();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: hexToRgba(colors.primary, 0.18),
            color: colors.primary,
            fontWeight: 600,
            borderRadius: "2px",
            padding: "0 1px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // Default render function for items
  const defaultRenderItem = (item: T, searchTerm: string, isActive: boolean) => (
    <>
      <motion.div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
            : colors.bgLight,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.15 }}
      >
        <Search
          size={14}
          style={{ color: isActive ? "#fff" : colors.primary }}
        />
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${config.fontSize}`} style={{ color: theme.text }}>
          {highlightMatch(stableGetItemName(item), searchTerm)}
        </div>
        {stableGetItemDescription(item) && (
          <div className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            {stableGetItemDescription(item).length > 60
              ? `${stableGetItemDescription(item).substring(0, 60)}...`
              : stableGetItemDescription(item)}
          </div>
        )}
      </div>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CheckCircle2
            className="flex-shrink-0"
            size={16}
            style={{ color: colors.primary }}
          />
        </motion.div>
      )}
    </>
  );

  // Get badge text
  const getBadgeTextValue = (item: T): string => {
    if (getBadgeText) return getBadgeText(item);
    return `ID: ${stableGetItemId(item)}`;
  };

  return (
    <div className="relative w-full">
      {/* Input Container */}
      <motion.div
        className={`flex items-center rounded-xl border-2 transition-all duration-200 cursor-text`}
        style={{
          borderColor: isFocused ? colors.primary : theme.border,
          backgroundColor: isFocused ? colors.bgLighter : theme.surface,
          boxShadow: isFocused
            ? `0 0 0 4px ${hexToRgba(colors.primary, 0.12)}`
            : "none",
        }}
        animate={{
          borderColor: isFocused ? colors.primary : theme.border,
        }}
        transition={{ duration: 0.2 }}
      >
        <Search
          className={`ml-3 sm:ml-4 flex-shrink-0`}
          size={config.iconSize}
          style={{ color: isFocused ? colors.primary : theme.textSecondary }}
        />

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => {
            if (!disabled) {
              setIsFocused(true);
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
            setIsFocused(false);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 bg-transparent outline-none ${config.inputPadding} ${config.fontSize} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{ color: theme.text }}
        />

        {searchTerm && !disabled && (
          <motion.button
            className={`mr-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer`}
            style={{
              backgroundColor: hexToRgba(colors.primary, 0.15),
              color: colors.primary,
            }}
            variants={clearButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={size === "lg" ? 16 : 14} />
          </motion.button>
        )}

        {selectedItem && !disabled && !hideBadge && (
          <motion.div
            className={`mr-2 sm:mr-3 flex items-center gap-1.5 rounded-lg ${config.badgePadding} flex-shrink-0 cursor-default`}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className={`font-semibold text-white ${config.badgeTextSize}`}>
              {getBadgeTextValue(selectedItem)}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && !disabled && (
          <motion.div
            ref={dropdownRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 w-full mt-2 rounded-xl border-2 shadow-lg overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div
                className="px-3 sm:px-4 py-2 border-b sticky top-0"
                style={{ borderColor: theme.border, backgroundColor: theme.surface }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: theme.textSecondary }}
                >
                  {title}
                </span>
                {!loading && filteredItems.length > 0 && (
                  <span
                    className="text-xs ml-2"
                    style={{ color: colors.primary }}
                  >
                    ({filteredItems.length})
                  </span>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <motion.div
                    variants={loadingVariants}
                    animate="animate"
                    className="inline-flex"
                  >
                    <Loader2
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      style={{ color: colors.primary }}
                    />
                  </motion.div>
                  <p className="mt-2 text-xs sm:text-sm" style={{ color: theme.textSecondary }}>
                    {loadingMessage}
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: theme.textSecondary }}
                  />
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {noResultsMessage}
                  </p>
                  <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div>
                  {filteredItems.map((item, idx) => {
                    const isActive =
                      selectedItem && stableGetItemId(item) === stableGetItemId(selectedItem);
                    return (
                      <motion.button
                        key={stableGetItemId(item)}
                        custom={idx}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`w-full px-3 sm:px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                          isActive ? "active" : ""
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? hexToRgba(colors.primary, 0.08)
                            : "transparent",
                          borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                        }}
                        whileHover={{
                          backgroundColor: isActive
                            ? hexToRgba(colors.primary, 0.08)
                            : hexToRgba(colors.primary, 0.05),
                          x: 2,
                        }}
                        transition={{ duration: 0.15 }}
                        onClick={() => handleSelectItem(item)}
                      >
                        {renderItem
                          ? renderItem(item, searchTerm, !!isActive)
                          : defaultRenderItem(item, searchTerm, !!isActive)}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${hexToRgba(theme.border, 0.6)};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${hexToRgba(theme.border, 0.8)};
        }
      `}</style>
    </div>
  );
};

export default CommonSearch;