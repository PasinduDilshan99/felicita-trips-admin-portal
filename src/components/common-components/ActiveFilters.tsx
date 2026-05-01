"use client";

import React from "react";
import { X, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Helper ──────────────────────────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

// ─── Animation styles (injected once) ────────────────────────────────────────

const AF_STYLES = `
  @keyframes af-slideIn {
    from { opacity: 0; transform: scale(0.82) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  @keyframes af-containerIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes af-slideOut {
    from { opacity: 1; transform: scale(1)    translateY(0);   max-width: 320px; padding-left: inherit; padding-right: inherit; margin-right: 0.4rem; }
    to   { opacity: 0; transform: scale(0.75) translateY(4px); max-width: 0;     padding-left: 0;       padding-right: 0;      margin-right: 0; }
  }
  .af-container-enter {
    animation: af-containerIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .af-chip-enter {
    animation: af-slideIn 0.24s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .af-chip-exit {
    animation: af-slideOut 0.22s cubic-bezier(0.4,0,1,1) forwards;
    overflow: hidden;
    pointer-events: none;
  }
  .af-x-btn {
    transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background-color 0.15s ease;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .af-x-btn:hover {
    opacity: 1 !important;
    transform: scale(1.25) rotate(90deg);
  }
  .af-x-btn:active {
    transform: scale(0.9) rotate(90deg);
  }
  .af-clear-btn {
    transition: opacity 0.15s ease, transform 0.15s ease, background-color 0.18s ease, color 0.18s ease;
  }
  .af-clear-btn:hover {
    transform: translateY(-1px);
  }
  .af-clear-btn:active {
    transform: translateY(0) scale(0.97);
  }
`;

let afStylesInjected = false;
function injectAfStyles() {
  if (afStylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = AF_STYLES;
  document.head.appendChild(el);
  afStylesInjected = true;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

export interface SortFilter {
  sortBy: string;
  sortLabel: string;
  sortDirection: "ASC" | "DESC";
}

export interface ActiveFiltersProps {
  filters?: ActiveFilter[];
  sortFilter?: SortFilter | null;
  onRemoveFilter: (key: string) => void;
  onRemoveSort?: () => void;
  onClearAll: () => void;
  title?: string;
  showClearAll?: boolean;
  className?: string;
  variant?: "default" | "compact" | "minimal";
}

// ─── Animated chip wrapper ────────────────────────────────────────────────────

interface ChipProps {
  id: string;
  delay?: number;
  onRemove: () => void;
  removeLabel: string;
  accentColor: string;
  textColor: string;
  surfaceColor: string;
  compact?: boolean;
  children: React.ReactNode;
}

const Chip: React.FC<ChipProps> = ({
  id, delay = 0, onRemove, removeLabel,
  accentColor, textColor, surfaceColor, compact, children,
}) => {
  const [exiting, setExiting] = React.useState(false);

  const handleRemove = () => {
    setExiting(true);
    setTimeout(onRemove, 200);
  };

  const pad = compact ? "0.2rem 0.5rem 0.2rem 0.65rem" : "0.3rem 0.6rem 0.3rem 0.85rem";
  const iconSize = compact ? 11 : 13;

  return (
    <span
      className={exiting ? "af-chip-exit" : "af-chip-enter"}
      style={{
        display: "inline-flex", alignItems: "center", gap: compact ? "0.3rem" : "0.4rem",
        padding: pad,
        borderRadius: "999px",
        fontSize: compact ? "0.72rem" : "0.78rem",
        fontWeight: 500,
        border: `1.5px solid ${hexToRgba(accentColor, 0.22)}`,
        backgroundColor: hexToRgba(accentColor, 0.07),
        color: textColor,
        animationDelay: `${delay}s`,
        whiteSpace: "nowrap",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
      <button
        className="af-x-btn"
        onClick={handleRemove}
        aria-label={removeLabel}
        style={{
          color: accentColor, opacity: 0.55,
          width: compact ? "1.1rem" : "1.25rem",
          height: compact ? "1.1rem" : "1.25rem",
          marginLeft: "0.1rem",
          flexShrink: 0,
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <X size={iconSize} strokeWidth={2.5} />
      </button>
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters = [],
  sortFilter = null,
  onRemoveFilter,
  onRemoveSort,
  onClearAll,
  title = "Active Filters",
  showClearAll = true,
  className = "",
  variant = "default",
}) => {
  const { theme } = useTheme();

  React.useEffect(() => { injectAfStyles(); }, []);

  const hasFilters = filters.length > 0;
  const hasSort = !!sortFilter?.sortBy;
  const hasAnyFilter = hasFilters || hasSort;

  const totalCount = filters.length + (hasSort ? 1 : 0);

  if (!hasAnyFilter) return null;

  const compact = variant === "compact" || variant === "minimal";
  const isMinimal = variant === "minimal";

  const containerPad = compact ? "0.625rem 0.875rem" : "0.875rem 1.125rem";

  return (
    <div
      className={`af-container-enter ${className}`}
      style={{
        display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: compact ? "0.5rem" : "0.625rem",
        padding: isMinimal ? "0" : containerPad,
        marginBottom: compact ? "1rem" : "1.25rem",
        borderRadius: isMinimal ? "0" : "0.875rem",
        border: isMinimal ? "none" : `1.5px solid ${hexToRgba(theme.primary, 0.12)}`,
        backgroundColor: isMinimal
          ? "transparent"
          : hexToRgba(theme.primary, 0.03),
        boxShadow: isMinimal
          ? "none"
          : `0 2px 12px -3px ${hexToRgba(theme.primary, 0.1)}`,
        backdropFilter: isMinimal ? "none" : "blur(6px)",
      }}
    >
      {/* ── Label ── */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "0.375rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: compact ? "1.5rem" : "1.75rem",
            height: compact ? "1.5rem" : "1.75rem",
            borderRadius: "0.45rem",
            backgroundColor: hexToRgba(theme.primary, 0.1),
            color: theme.primary,
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={compact ? 12 : 13} strokeWidth={2.2} />
        </span>
        <span
          style={{
            fontSize: compact ? "0.72rem" : "0.78rem",
            fontWeight: 600,
            color: theme.textSecondary,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        {/* Count badge */}
        <span
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            minWidth: "1.1rem", height: "1.1rem",
            padding: "0 0.25rem",
            borderRadius: "999px",
            fontSize: "0.65rem", fontWeight: 700,
            backgroundColor: theme.primary,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {totalCount}
        </span>
      </div>

      {/* ── Thin separator ── */}
      <span
        style={{
          width: "1px", height: compact ? "1.25rem" : "1.5rem",
          backgroundColor: hexToRgba(theme.primary, 0.15),
          flexShrink: 0,
        }}
      />

      {/* ── Filter chips ── */}
      <div
        style={{
          display: "flex", flexWrap: "wrap",
          gap: compact ? "0.35rem" : "0.45rem",
          flex: 1,
          alignItems: "center",
        }}
      >
        {filters.map((filter, i) => (
          <Chip
            key={filter.key}
            id={filter.key}
            delay={i * 0.04}
            onRemove={() => onRemoveFilter(filter.key)}
            removeLabel={`Remove ${filter.label} filter`}
            accentColor={theme.primary}
            textColor={theme.text}
            surfaceColor={theme.surface}
            compact={compact}
          >
            <span
              style={{
                fontWeight: 600, fontSize: "inherit",
                color: theme.primary, opacity: 0.8,
              }}
            >
              {filter.label}
            </span>
            <span
              style={{
                width: "1px", height: "0.75em",
                backgroundColor: hexToRgba(theme.primary, 0.3),
                display: "inline-block", flexShrink: 0,
              }}
            />
            <span style={{ color: theme.text, fontWeight: 500 }}>
              {filter.value}
            </span>
          </Chip>
        ))}

        {/* ── Sort chip ── */}
        {hasSort && sortFilter && (
          <Chip
            key="__sort__"
            id="__sort__"
            delay={filters.length * 0.04}
            onRemove={() => onRemoveSort?.()}
            removeLabel="Remove sort"
            accentColor={theme.accent ?? theme.primary}
            textColor={theme.text}
            surfaceColor={theme.surface}
            compact={compact}
          >
            {sortFilter.sortDirection === "ASC"
              ? <ArrowUp size={compact ? 10 : 12} strokeWidth={2.3} style={{ color: theme.accent ?? theme.primary, flexShrink: 0 }} />
              : <ArrowDown size={compact ? 10 : 12} strokeWidth={2.3} style={{ color: theme.accent ?? theme.primary, flexShrink: 0 }} />
            }
            <span
              style={{
                fontWeight: 600, fontSize: "inherit",
                color: theme.accent ?? theme.primary, opacity: 0.8,
              }}
            >
              Sort
            </span>
            <span
              style={{
                width: "1px", height: "0.75em",
                backgroundColor: hexToRgba(theme.accent ?? theme.primary, 0.3),
                display: "inline-block", flexShrink: 0,
              }}
            />
            <span style={{ color: theme.text, fontWeight: 500 }}>
              {sortFilter.sortLabel} · {sortFilter.sortDirection === "ASC" ? "↑ Asc" : "↓ Desc"}
            </span>
          </Chip>
        )}
      </div>

      {/* ── Clear all ── */}
      {showClearAll && (
        <button
          className="af-clear-btn"
          onClick={onClearAll}
          aria-label="Clear all filters"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            padding: compact ? "0.2rem 0.6rem" : "0.3rem 0.75rem",
            borderRadius: "999px",
            fontSize: compact ? "0.72rem" : "0.775rem",
            fontWeight: 600,
            color: theme.error ?? "#e05252",
            backgroundColor: hexToRgba(theme.error ?? "#e05252", 0.07),
            border: `1.5px solid ${hexToRgba(theme.error ?? "#e05252", 0.2)}`,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = hexToRgba(theme.error ?? "#e05252", 0.14);
            e.currentTarget.style.borderColor = hexToRgba(theme.error ?? "#e05252", 0.4);
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = hexToRgba(theme.error ?? "#e05252", 0.07);
            e.currentTarget.style.borderColor = hexToRgba(theme.error ?? "#e05252", 0.2);
          }}
        >
          <X size={compact ? 11 : 12} strokeWidth={2.5} />
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;