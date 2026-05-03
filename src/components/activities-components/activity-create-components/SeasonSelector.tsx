"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ChevronDown, Check, Search, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import { SeasonType } from "@/types/common-types";

interface SeasonSelectorProps {
  value?: number;
  onChange: (seasonId: number) => void;
  error?: string;
  required?: boolean;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
}) => {
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const seasons: SeasonType[] = categories?.seasonsList || [];

  const getMonthName = (month: number): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return months[month - 1] || "";
  };

  const selectedSeason = seasons.find((s) => s.seasonId === value);

  const filteredSeasons = seasons.filter(
    (season) =>
      season.seasonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      season.seasonStandardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const clickedInsideWrapper = wrapperRef.current?.contains(target);
      const clickedInsidePortal = target?.closest?.("[data-season-dropdown]");

      if (!clickedInsideWrapper && !clickedInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownContent = (
    <div
      data-season-dropdown
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
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.06)",
      }}
    >
      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: theme.border }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: theme.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search seasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
            }}
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-64 overflow-y-auto">
        {categoriesLoading ? (
          <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
            <div
              className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
            />
            <p className="mt-2 text-sm">Loading seasons...</p>
          </div>
        ) : filteredSeasons.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
            No seasons found
          </div>
        ) : (
          filteredSeasons.map((season) => (
            <button
              key={season.seasonId}
              type="button"
              onClick={() => {
                onChange(season.seasonId);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="w-full px-4 py-3 text-left flex items-center justify-between transition-colors"
              style={{
                backgroundColor:
                  value === season.seasonId ? `${theme.primary}15` : "transparent",
              }}
              onMouseEnter={(e) => {
                if (value !== season.seasonId) {
                  e.currentTarget.style.backgroundColor = `${theme.border}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (value !== season.seasonId) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium" style={{ color: theme.text }}>
                    {season.seasonName}
                  </p>
                  {season.isPeak && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${theme.warning}20`,
                        color: theme.warning,
                      }}
                    >
                      Peak
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  {getMonthName(season.startMonth)} – {getMonthName(season.endMonth)}
                </p>
                {season.seasonDescription && (
                  <p className="text-xs mt-0.5 opacity-75" style={{ color: theme.textSecondary }}>
                    {season.seasonDescription}
                  </p>
                )}
              </div>
              {value === season.seasonId && (
                <Check className="w-4 h-4 ml-2 flex-shrink-0" style={{ color: theme.primary }} />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
        Season
        {required && <span style={{ color: theme.error }}> *</span>}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-left flex items-center justify-between transition-all duration-200"
        style={{
          backgroundColor: theme.background,
          borderColor: error ? theme.error : isOpen ? theme.primary : theme.border,
          color: theme.text,
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <span className={!selectedSeason ? "opacity-70" : ""}>
            {selectedSeason ? selectedSeason.seasonName : "Select a season..."}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: theme.textSecondary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}

      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: theme.error }}>
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};