// components/common-components/BaseDropdown.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface BaseDropdownOption {
  id: number | string;
  label: string;
  subLabel?: string;
  description?: string;
  color?: string;
  badge?: string;
  metadata?: Record<string, any>;
}

interface BaseDropdownProps {
  value?: number | string;
  options: BaseDropdownOption[];
  onChange: (id: number | string) => void;
  onSearch?: (query: string) => BaseDropdownOption[] | void;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  searchable?: boolean;
  renderOption?: (
    option: BaseDropdownOption,
    isSelected: boolean,
  ) => React.ReactNode;
  renderSelected?: (option: BaseDropdownOption | undefined) => React.ReactNode;
  disabled?: boolean;
}

export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  value,
  options,
  onChange,
  onSearch,
  label,
  placeholder = "Select an option...",
  error,
  required = false,
  icon,
  loading = false,
  searchable = true,
  renderOption,
  renderSelected,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [filteredOptions, setFilteredOptions] =
    useState<BaseDropdownOption[]>(options);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  // Filter options based on search
  useEffect(() => {
    if (onSearch) {
      const result = onSearch(searchQuery);
      if (result) {
        setFilteredOptions(result);
        return;
      }
    }

    if (searchQuery.trim()) {
      const filtered = options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (opt.subLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ??
            false) ||
          (opt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
            false),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options, onSearch]);

  // Recalculate dropdown position on open, scroll, resize
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current && searchable) {
      // Prevent body scroll and page jump
      const scrollY = window.scrollY;
      searchInputRef.current.focus();
      // Restore scroll position after focus
      window.scrollTo(0, scrollY);
    }
  }, [isOpen, searchable]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const clickedInsideWrapper = wrapperRef.current?.contains(target);
      const clickedInsidePortal = target?.closest?.("[data-base-dropdown]");

      if (!clickedInsideWrapper && !clickedInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleOptionClick = (optionId: number | string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery("");
  };

  const defaultRenderSelected = (option: BaseDropdownOption | undefined) => (
    <span className={!option ? "opacity-70" : ""}>
      {option ? option.label : placeholder}
    </span>
  );

  const defaultRenderOption = (
    option: BaseDropdownOption,
    isSelected: boolean,
  ) => (
    <>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {option.color && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: option.color }}
            />
          )}
          <p className="text-sm font-medium" style={{ color: theme.text }}>
            {option.label}
          </p>
          {option.badge && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${theme.warning}20`,
                color: theme.warning,
              }}
            >
              {option.badge}
            </span>
          )}
        </div>
        {option.subLabel && (
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            {option.subLabel}
          </p>
        )}
        {option.description && (
          <p
            className="text-xs mt-0.5 opacity-75"
            style={{ color: theme.textSecondary }}
          >
            {option.description}
          </p>
        )}
      </div>
      {isSelected && (
        <Check
          className="w-4 h-4 ml-2 flex-shrink-0"
          style={{ color: theme.primary }}
        />
      )}
    </>
  );

  const dropdownContent = (
    <div
      data-base-dropdown
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow:
          "0 10px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.06)",
      }}
    >
      {/* Search */}
      {searchable && (
        <div className="p-3 border-b" style={{ borderColor: theme.border }}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: theme.textSecondary }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                // Prevent page jump when clicking search input
                const scrollY = window.scrollY;
                setTimeout(() => window.scrollTo(0, scrollY), 0);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                // Prevent page scroll on focus
                const scrollY = window.scrollY;
                setTimeout(() => window.scrollTo(0, scrollY), 0);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.border;
              }}
            />
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div
            className="p-4 text-center"
            style={{ color: theme.textSecondary }}
          >
            <div
              className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
              style={{
                borderColor: theme.primary,
                borderTopColor: "transparent",
              }}
            />
            <p className="mt-2 text-sm">Loading...</p>
          </div>
        ) : filteredOptions.length === 0 ? (
          <div
            className="p-4 text-center text-sm"
            style={{ color: theme.textSecondary }}
          >
            No options found
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: isSelected
                    ? `${theme.primary}15`
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = `${theme.border}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {(renderOption || defaultRenderOption)(option, isSelected)}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: theme.textSecondary }}
      >
        {label}
        {required && <span style={{ color: theme.error }}> *</span>}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-left flex items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled ? theme.border : theme.background,
          borderColor: error
            ? theme.error
            : isOpen
              ? theme.primary
              : theme.border,
          color: theme.text,
        }}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {icon && <span style={{ color: theme.textSecondary }}>{icon}</span>}
          {(renderSelected || defaultRenderSelected)(selectedOption)}
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: theme.textSecondary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}

      {error && (
        <p
          className="mt-1.5 text-xs flex items-center gap-1"
          style={{ color: theme.error }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
