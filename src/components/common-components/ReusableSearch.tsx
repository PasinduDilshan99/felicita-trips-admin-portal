// components/common/ReusableSearch.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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

export interface SearchItem {
  id: number | string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface ReusableSearchProps<T extends SearchItem> {
  items: T[];
  loading?: boolean;
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  onClearSelection?: () => void;
  initialSearchTerm?: string;
  placeholder?: string;
  title?: string;
  renderItem?: (
    item: T,
    searchTerm: string,
    isActive: boolean,
  ) => React.ReactNode;
  getItemId?: (item: T) => number | string;
  getItemName?: (item: T) => string;
  getItemDescription?: (item: T) => string;
  noResultsMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
}

const ReusableSearch = <T extends SearchItem>({
  items,
  loading = false,
  selectedItem,
  onSelectItem,
  onClearSelection,
  initialSearchTerm = "",
  placeholder = "Search...",
  title = "Items",
  renderItem,
  getItemId = (item) => item.id,
  getItemName = (item) => item.name,
  getItemDescription = (item) => item.description || "",
  noResultsMessage = "No items found",
  loadingMessage = "Loading items...",
  disabled = false,
}: ReusableSearchProps<T>) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    const filtered = items.filter((item) =>
      getItemName(item).toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(filtered);
  }, [searchTerm, items, getItemName]);

  // Update search term when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setSearchTerm(getItemName(selectedItem));
    } else if (!initialSearchTerm) {
      setSearchTerm("");
    }
  }, [selectedItem, getItemName, initialSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleSelectItem = (item: T) => {
    onSelectItem(item);
    setSearchTerm(getItemName(item));
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
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.18),
            color: theme.primary,
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
  const defaultRenderItem = (
    item: T,
    searchTerm: string,
    isActive: boolean,
  ) => (
    <>
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
            : hexToRgba(theme.primary, 0.1),
        }}
      >
        <Search
          size={14}
          style={{ color: isActive ? "#fff" : theme.primary }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm" style={{ color: theme.text }}>
          {highlightMatch(getItemName(item), searchTerm)}
        </div>
        {getItemDescription(item) && (
          <div
            className="text-xs mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            {getItemDescription(item).length > 60
              ? `${getItemDescription(item).substring(0, 60)}...`
              : getItemDescription(item)}
          </div>
        )}
      </div>
      {isActive && (
        <CheckCircle2
          className="flex-shrink-0"
          size={16}
          style={{ color: theme.primary }}
        />
      )}
    </>
  );

  return (
    <>
      <style jsx>{`
        @keyframes dropdownReveal {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes itemEntrance {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative w-full">
        {/* Input Container */}
        <div
          className={`flex items-center rounded-xl border-2 transition-all duration-200 ${
            isFocused ? "focused" : ""
          }${selectedItem ? " has-value" : ""}`}
          style={{
            borderColor: isFocused ? theme.primary : theme.border,
            backgroundColor: isFocused
              ? hexToRgba(theme.primary, 0.02)
              : theme.surface,
            boxShadow: isFocused
              ? `0 0 0 4px ${hexToRgba(theme.primary, 0.12)}`
              : "none",
          }}
        >
          <Search
            className="ml-4 flex-shrink-0"
            size={17}
            style={{ color: isFocused ? theme.primary : theme.textSecondary }}
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
            className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm disabled:opacity-50"
            style={{ color: theme.text }}
          />

          {searchTerm && !disabled && (
            <button
              className="mr-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.15),
                color: theme.primary,
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {selectedItem && !disabled && (
            <div
              className="mr-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              }}
            >
              <span className="text-xs font-semibold text-white">
                ID: {getItemId(selectedItem)}
              </span>
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {showDropdown && !disabled && (
          <div
            className="absolute z-50 w-full mt-2 rounded-xl border-2 shadow-lg overflow-hidden animate-fadeIn"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              animation: "fadeInUp 0.2s ease-out",
            }}
          >
            <div className="max-h-72 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2
                    className="w-8 h-8 animate-spin mx-auto"
                    style={{ color: theme.primary }}
                  />
                  <p
                    className="mt-2 text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {loadingMessage}
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: theme.textSecondary }}
                  />
                  <p style={{ color: theme.textSecondary }}>
                    {noResultsMessage}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Try a different search term
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isActive =
                    selectedItem && getItemId(item) === getItemId(selectedItem);
                  return (
                    <button
                      key={getItemId(item)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                        isActive ? "active" : ""
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? hexToRgba(theme.primary, 0.08)
                          : "transparent",
                        borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                        animation: `fadeInUp 0.25s ease-out ${idx * 0.03}s both`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = hexToRgba(
                            theme.primary,
                            0.05,
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                      onClick={() => handleSelectItem(item)}
                    >
                      {renderItem
                        ? renderItem(item, searchTerm, !!isActive)
                        : defaultRenderItem(item, searchTerm, !!isActive)}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Backdrop */}
        {showDropdown && !disabled && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ReusableSearch;
