"use client";

import React from 'react';
import { Search, RefreshCw, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ─── Types ───────────────────────────────────────────────────────────────────

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'boolean'
  | 'search';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterPanelProps {
  filters: Record<string, any>;
  fields: FilterField[];
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortBy: string, sortDirection: 'ASC' | 'DESC') => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showSorting?: boolean;
  sortOptions?: SortOption[];
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  title?: string;
  searchButtonText?: string;
  resetButtonText?: string;
  showActiveFilters?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  isLoading?: boolean;
}

// ─── Inline animation styles injected once ──────────────────────────────────

const ANIMATION_STYLES = `
  @keyframes fp-fadeSlideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fp-chipIn {
    from { opacity: 0; transform: scale(0.8) translateY(4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes fp-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fp-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .fp-body-enter {
    animation: fp-fadeSlideIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .fp-chip {
    animation: fp-chipIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .fp-spinner {
    animation: fp-spin 0.7s linear infinite;
  }
  /* Input focus glow transition */
  .fp-input {
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }
  /* Hover lift on action buttons */
  .fp-btn-ghost:hover  { transform: translateY(-1px); }
  .fp-btn-ghost:active { transform: translateY(0); }
  .fp-btn-primary:hover  { transform: translateY(-1px); box-shadow: 0 8px 20px -4px var(--fp-shadow-primary); }
  .fp-btn-primary:active { transform: translateY(0); }
  /* Chevron rotation */
  .fp-chevron-open  { transform: rotate(180deg); }
  .fp-chevron-close { transform: rotate(0deg); }
  .fp-chevron { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  /* Sort direction button */
  .fp-dir-btn { transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease; }
  .fp-dir-btn:hover { transform: scale(1.08); }
  .fp-dir-btn:active { transform: scale(0.95); }
  /* Active filter chip X button */
  .fp-chip-close { transition: opacity 0.15s ease, transform 0.15s ease; }
  .fp-chip-close:hover { opacity: 0.7; transform: scale(1.2) rotate(90deg); }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = ANIMATION_STYLES;
  document.head.appendChild(el);
  stylesInjected = true;
}

// ─── Component ───────────────────────────────────────────────────────────────

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  fields,
  onFilterChange,
  onSearch,
  onReset,
  onPageSizeChange,
  onSortChange,
  pageSize = 12,
  pageSizeOptions = [6, 9, 12, 24, 48],
  showPageSize = true,
  showSorting = false,
  sortOptions = [],
  sortBy = '',
  sortDirection = 'ASC',
  title = 'Filters',
  searchButtonText = 'Search',
  resetButtonText = 'Reset',
  showActiveFilters = true,
  collapsible = false,
  defaultCollapsed = false,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [bodyKey, setBodyKey] = React.useState(0); // re-mount body to retrigger animation

  React.useEffect(() => { injectStyles(); }, []);

  // CSS variable for primary shadow (used in hover on search button)
  const primaryShadow = hexToRgba(theme.primary, 0.35);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleInputChange = (key: string, value: any) =>
    onFilterChange(key, value === '' ? null : value);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  const handleSortByChange = (value: string) =>
    onSortChange?.(value, sortDirection);

  const handleSortDirectionToggle = () => {
    if (onSortChange && sortBy)
      onSortChange(sortBy, sortDirection === 'ASC' ? 'DESC' : 'ASC');
  };

  const handleCollapse = () => {
    if (!collapsible) return;
    const next = !isCollapsed;
    setIsCollapsed(next);
    if (!next) setBodyKey(k => k + 1); // animate body on open
  };

  // ── Active filter count ───────────────────────────────────────────────────

  const activeFilterCount = Object.keys(filters).filter(key => {
    const v = filters[key];
    if (v === null || v === undefined || v === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;

  // ── Grid layout ───────────────────────────────────────────────────────────

  const getGridCols = () => {
    if (fields.some(f => f.width === 'quarter'))
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    if (fields.some(f => f.width === 'third'))
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  const getFieldWidth = (width?: string) => {
    switch (width) {
      case 'full':    return 'col-span-full';
      case 'half':    return 'md:col-span-1';
      case 'third':   return 'md:col-span-1 lg:col-span-1';
      case 'quarter': return 'md:col-span-1 lg:col-span-1 xl:col-span-1';
      default:        return 'md:col-span-1 lg:col-span-1';
    }
  };

  // ── Shared input styles ───────────────────────────────────────────────────

  const baseInput: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.625rem',
    border: `1.5px solid ${theme.border}`,
    backgroundColor: theme.background,
    color: theme.text,
    outline: 'none',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const onFocusInput = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = theme.primary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(theme.primary, 0.14)}`;
  };
  const onBlurInput = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = theme.border;
    e.currentTarget.style.boxShadow = 'none';
  };

  // ── Field renderer ────────────────────────────────────────────────────────

  const renderField = (field: FilterField) => {
    const value = filters[field.key] ?? field.defaultValue ?? '';

    const sharedProps = {
      className: 'fp-input',
      style: baseInput,
      onFocus: onFocusInput,
      onBlur: onBlurInput,
    };

    switch (field.type) {
      case 'search':
      case 'text':
        return (
          <div style={{ position: 'relative' }}>
            {field.type === 'search' && (
              <Search
                size={14}
                style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.textSecondary, pointerEvents: 'none',
                  transition: 'color 0.2s ease',
                }}
              />
            )}
            <input
              type="text"
              value={value || ''}
              onChange={e => handleInputChange(field.key, e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={field.placeholder || `${field.label}...`}
              {...sharedProps}
              style={{
                ...baseInput,
                paddingLeft: field.type === 'search' ? '2.25rem' : '0.875rem',
              }}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={e => handleInputChange(field.key, e.target.value ? parseFloat(e.target.value) : null)}
            onKeyPress={handleKeyPress}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            min={field.min} max={field.max} step={field.step}
            {...sharedProps}
          />
        );

      case 'select':
        return (
          <div style={{ position: 'relative' }}>
            <select
              value={value || ''}
              onChange={e => handleInputChange(field.key, e.target.value)}
              {...sharedProps}
              style={{ ...baseInput, paddingRight: '2rem', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">All {field.label}</option>
              {field.options?.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: theme.textSecondary,
              }}
            />
          </div>
        );

      case 'multiselect': {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div>
            <div style={{ position: 'relative' }}>
              <select
                multiple
                value={selected}
                onChange={e => handleInputChange(field.key, Array.from(e.target.selectedOptions, o => o.value))}
                {...sharedProps}
                style={{ ...baseInput, minHeight: '80px', cursor: 'pointer' }}
              >
                {field.options?.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {selected.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                {selected.map(val => {
                  const opt = field.options?.find(o => o.value === val);
                  return (
                    <span
                      key={val}
                      className="fp-chip"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem', fontWeight: 500,
                        backgroundColor: hexToRgba(theme.primary, 0.1),
                        color: theme.primary,
                        border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                      }}
                    >
                      {opt?.label || val}
                      <button
                        className="fp-chip-close"
                        onClick={() => handleInputChange(field.key, selected.filter(v => v !== val))}
                        style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'boolean':
        return (
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.35rem' }}>
            {(['true', 'false', ''] as const).map(v => {
              const label = v === 'true' ? 'Yes' : v === 'false' ? 'No' : 'All';
              const isActive = 
                v === 'true' ? (value === true || value === 'true') :
                v === 'false' ? (value === false || value === 'false') :
                (value === null || value === undefined || value === '');
              return (
                <label
                  key={v}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    cursor: 'pointer',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                    border: `1.5px solid ${isActive ? theme.primary : theme.border}`,
                    backgroundColor: isActive ? hexToRgba(theme.primary, 0.08) : 'transparent',
                    color: isActive ? theme.primary : theme.textSecondary,
                    transition: 'all 0.18s ease',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="radio"
                    value={v}
                    checked={isActive}
                    onChange={() => handleInputChange(field.key, v === 'true' ? true : v === 'false' ? false : null)}
                    style={{ display: 'none' }}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={e => handleInputChange(field.key, e.target.value)}
            {...sharedProps}
          />
        );

      default:
        return null;
    }
  };

  // ── Active filter chips ───────────────────────────────────────────────────

  const getDisplayValue = (field: FilterField, value: any): string => {
    if (field.type === 'select' && field.options) {
      return field.options.find(o => o.value === value)?.label ?? String(value);
    }
    if (field.type === 'multiselect' && Array.isArray(value) && field.options) {
      return value.map(v => field.options?.find(o => o.value === v)?.label ?? v).join(', ');
    }
    if (field.type === 'boolean') return value === true ? 'Yes' : 'No';
    return Array.isArray(value) ? value.join(', ') : String(value);
  };

  const getSortLabel = () =>
    sortOptions.find(o => o.value === sortBy)?.label ?? 'Sort';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        borderRadius: '1rem',
        border: `1.5px solid ${theme.border}`,
        backgroundColor: theme.surface,
        boxShadow: `0 4px 24px -4px ${hexToRgba(theme.primary, 0.08)}, 0 1px 4px -1px rgba(0,0,0,0.06)`,
        marginBottom: '1.5rem',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        // CSS variable for primary shadow used in button hover
        ['--fp-shadow-primary' as any]: primaryShadow,
      }}
    >
      {/* ── Header ── */}
      <div
        onClick={handleCollapse}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: isCollapsed ? 'none' : `1.5px solid ${theme.border}`,
          cursor: collapsible ? 'pointer' : 'default',
          userSelect: 'none',
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.04)} 0%, transparent 60%)`,
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Left: Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '2.25rem', height: '2.25rem',
              borderRadius: '0.625rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.15)}, ${hexToRgba(theme.accent ?? theme.primary, 0.08)})`,
              color: theme.primary,
              flexShrink: 0,
            }}
          >
            <Filter size={15} strokeWidth={2.2} />
          </span>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: theme.text, lineHeight: 1.2 }}>
              {title}
            </h2>
            {activeFilterCount > 0 && (
              <p style={{ fontSize: '0.75rem', color: theme.textSecondary, marginTop: '0.125rem' }}>
                {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
              </p>
            )}
          </div>
        </div>

        {/* Right: badge + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {activeFilterCount > 0 && showActiveFilters && (
            <span
              className="fp-chip"
              style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.7rem', fontWeight: 700,
                backgroundColor: theme.primary,
                color: '#fff',
                lineHeight: 1.4,
                letterSpacing: '0.01em',
              }}
            >
              {activeFilterCount}
            </span>
          )}
          {collapsible && (
            <ChevronDown
              size={18}
              strokeWidth={2}
              className={`fp-chevron ${isCollapsed ? 'fp-chevron-close' : 'fp-chevron-open'}`}
              style={{ color: theme.textSecondary }}
            />
          )}
        </div>
      </div>

      {/* ── Body ── */}
      {!isCollapsed && (
        <div key={bodyKey} className="fp-body-enter" style={{ padding: '1.25rem' }}>

          {/* Filter fields grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {fields.map((field, i) => (
              <div
                key={field.key}
                className={getFieldWidth(field.width)}
                style={{
                  animation: `fp-fadeSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s both`,
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem', fontWeight: 600,
                    color: theme.textSecondary,
                    marginBottom: '0.4rem',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}

            {/* Sorting field */}
            {showSorting && sortOptions.length > 0 && (
              <div
                style={{
                  animation: `fp-fadeSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1) ${fields.length * 0.04}s both`,
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem', fontWeight: 600,
                    color: theme.textSecondary,
                    marginBottom: '0.4rem',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sort By
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <select
                      value={sortBy}
                      onChange={e => handleSortByChange(e.target.value)}
                      className="fp-input"
                      style={{ ...baseInput, paddingRight: '2rem', appearance: 'none', cursor: 'pointer', flex: 1 }}
                      onFocus={onFocusInput}
                      onBlur={onBlurInput}
                    >
                      <option value="">Sort by…</option>
                      {sortOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: theme.textSecondary }} />
                  </div>

                  {sortBy && (
                    <button
                      className="fp-dir-btn"
                      onClick={handleSortDirectionToggle}
                      title={sortDirection === 'ASC' ? 'Ascending – click to toggle' : 'Descending – click to toggle'}
                      style={{
                        padding: '0 0.75rem',
                        borderRadius: '0.625rem',
                        border: `1.5px solid ${theme.border}`,
                        backgroundColor: hexToRgba(theme.primary, 0.06),
                        color: theme.primary,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                        fontSize: '0.75rem', fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sortDirection === 'ASC'
                        ? <><ArrowUp size={14} /> ASC</>
                        : <><ArrowDown size={14} /> DESC</>
                      }
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Divider + Action bar ── */}
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              justifyContent: 'flex-end', gap: '0.75rem',
              marginTop: '1.25rem', paddingTop: '1rem',
              borderTop: `1.5px solid ${theme.border}`,
            }}
          >
            {/* Page size */}
            {showPageSize && onPageSizeChange && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: 'auto' }}>
                <span style={{ fontSize: '0.8125rem', color: theme.textSecondary, whiteSpace: 'nowrap' }}>
                  Show
                </span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={pageSize}
                    onChange={e => onPageSizeChange(parseInt(e.target.value))}
                    className="fp-input"
                    style={{
                      ...baseInput,
                      width: 'auto', paddingRight: '2rem',
                      appearance: 'none', cursor: 'pointer',
                      fontSize: '0.8125rem',
                    }}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  >
                    {pageSizeOptions.map(s => (
                      <option key={s} value={s}>{s} / page</option>
                    ))}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: theme.textSecondary }} />
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              className="fp-btn-ghost"
              onClick={onReset}
              disabled={isLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.625rem',
                border: `1.5px solid ${theme.border}`,
                backgroundColor: 'transparent',
                color: theme.textSecondary,
                fontSize: '0.8125rem', fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease, color 0.18s ease',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.06);
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.color = theme.primary;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.color = theme.textSecondary;
              }}
            >
              <RefreshCw size={13} strokeWidth={2.2} />
              {resetButtonText}
            </button>

            {/* Search */}
            <button
              className="fp-btn-primary"
              onClick={onSearch}
              disabled={isLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '0.625rem',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent ?? theme.primary})`,
                color: '#fff',
                fontSize: '0.8125rem', fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.8 : 1,
                boxShadow: `0 4px 12px -2px ${hexToRgba(theme.primary, 0.3)}`,
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
                letterSpacing: '0.01em',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="fp-spinner"
                    style={{
                      display: 'inline-block', width: '0.9rem', height: '0.9rem',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff',
                    }}
                  />
                  Searching…
                </>
              ) : (
                <>
                  <Search size={13} strokeWidth={2.5} />
                  {searchButtonText}
                </>
              )}
            </button>
          </div>

          {/* ── Active filter chips ── */}
          {showActiveFilters && (activeFilterCount > 0 || sortBy) && (
            <div
              style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
                marginTop: '0.875rem',
                paddingTop: '0.75rem',
                borderTop: `1px dashed ${hexToRgba(theme.primary, 0.2)}`,
                animation: 'fp-fadeSlideIn 0.2s ease both',
              }}
            >
              {/* Filter chips */}
              {Object.entries(filters).map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null;
                if (Array.isArray(value) && value.length === 0) return null;
                const field = fields.find(f => f.key === key);
                if (!field) return null;

                return (
                  <span
                    key={key}
                    className="fp-chip"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.25rem 0.625rem 0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                      backgroundColor: hexToRgba(theme.primary, 0.07),
                      color: theme.primary,
                    }}
                  >
                    <span style={{ fontWeight: 600, opacity: 0.75 }}>{field.label}:</span>
                    <span style={{ fontWeight: 500 }}>{getDisplayValue(field, value)}</span>
                    <button
                      className="fp-chip-close"
                      onClick={() => handleInputChange(key, null)}
                      style={{ display: 'flex', alignItems: 'center', marginLeft: '0.1rem', opacity: 0.7 }}
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </span>
                );
              })}

              {/* Sort chip */}
              {sortBy && (
                <span
                  className="fp-chip"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.25rem 0.625rem 0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                    backgroundColor: hexToRgba(theme.primary, 0.07),
                    color: theme.primary,
                  }}
                >
                  <ArrowUpDown size={10} strokeWidth={2.2} />
                  <span style={{ fontWeight: 600, opacity: 0.75 }}>Sort:</span>
                  <span style={{ fontWeight: 500 }}>
                    {getSortLabel()} · {sortDirection === 'ASC' ? '↑' : '↓'}
                  </span>
                  <button
                    className="fp-chip-close"
                    onClick={() => onSortChange?.('', 'ASC')}
                    style={{ display: 'flex', alignItems: 'center', marginLeft: '0.1rem', opacity: 0.7 }}
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;