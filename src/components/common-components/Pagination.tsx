// components/common-components/Pagination.tsx
"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showResultsCount?: boolean;
  showFirstLastButtons?: boolean;
  showProgressBar?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'compact';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  showResultsCount = true,
  showFirstLastButtons = true,
  showProgressBar = true,
  maxVisiblePages = 7,
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const progress = Math.round((currentPage / totalPages) * 100);

  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  const getPageNumbers = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const half = Math.floor((maxVisiblePages - 3) / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage - half <= 2) {
      end = Math.min(totalPages - 1, 1 + maxVisiblePages - 3);
    }
    if (currentPage + half >= totalPages - 1) {
      start = Math.max(2, totalPages - (maxVisiblePages - 3));
    }

    pages.push(1);
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push(-2);
    pages.push(totalPages);

    return pages;
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      height: '28px',
      minWidth: '28px',
      padding: '0 8px',
      fontSize: '12px',
      iconSize: 12,
      gap: '2px',
    },
    md: {
      height: '34px',
      minWidth: '34px',
      padding: '0 10px',
      fontSize: '13px',
      iconSize: 14,
      gap: '4px',
    },
    lg: {
      height: '40px',
      minWidth: '40px',
      padding: '0 14px',
      fontSize: '14px',
      iconSize: 16,
      gap: '6px',
    },
  };

  const config = sizeConfig[size];

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: config.height,
    minWidth: config.minWidth,
    padding: config.padding,
    border: `1px solid ${theme.border}`,
    borderRadius: variant === 'compact' ? '6px' : '8px',
    background: theme.surface,
    color: theme.textSecondary,
    fontSize: config.fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease',
    userSelect: 'none' as const,
    lineHeight: 1,
    outline: 'none',
    flexShrink: 0,
  };

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const,
  };

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: theme.primary,
    borderColor: theme.primary,
    color: '#ffffff',
    cursor: 'default',
    pointerEvents: 'none' as const,
  };

  // Minimal variant button styles
  if (variant === 'minimal') {
    Object.assign(btnBase, {
      border: 'none',
      background: 'transparent',
    });
    Object.assign(btnActive, {
      background: theme.primary,
      border: 'none',
    });
  }

  // Compact variant has smaller gap
  const containerGap = variant === 'compact' ? '2px' : config.gap;

  return (
    <>
      <style>{`
        .pg-btn:hover {
          background: ${theme.background} !important;
          border-color: ${theme.primary} !important;
          color: ${theme.text} !important;
        }
        .pg-btn:active { transform: scale(0.95); }
        .pg-btn:focus-visible {
          outline: 2px solid ${theme.primary};
          outline-offset: 2px;
        }
        @keyframes pg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pg-root { animation: pg-in 0.25s ease; }
      `}</style>

      <div
        className={`pg-root ${className}`}
        style={{
          borderTop: variant === 'minimal' ? 'none' : `1px solid ${theme.border}`,
          backgroundColor: variant === 'minimal' ? 'transparent' : theme.surface,
          padding: variant === 'compact' ? '0.5rem 0' : '0 1.25rem',
        }}
      >
        {/* Progress Bar */}
        {showProgressBar && variant !== 'minimal' && (
          <div
            style={{
              height: '2px',
              background: theme.border,
              borderRadius: '99px',
              overflow: 'hidden',
              margin: '14px 0',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: theme.primary,
                borderRadius: '99px',
                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
        )}

        {/* Mobile Layout */}
        <div
          className="flex items-center justify-between sm:hidden"
          style={{ paddingBottom: variant === 'compact' ? '0' : '14px' }}
        >
          <button
            className={currentPage > 1 ? 'pg-btn' : ''}
            onClick={handlePrev}
            style={currentPage === 1 ? btnDisabled : btnBase}
            aria-label="Previous page"
          >
            <ChevronLeft size={config.iconSize} />
          </button>

          <span style={{ fontSize: config.fontSize, color: theme.textSecondary }}>
            Page{' '}
            <strong style={{ fontWeight: 500, color: theme.text }}>{currentPage}</strong>
            {' '}of{' '}
            <strong style={{ fontWeight: 500, color: theme.text }}>{totalPages}</strong>
          </span>

          <button
            className={currentPage < totalPages ? 'pg-btn' : ''}
            onClick={handleNext}
            style={currentPage === totalPages ? btnDisabled : btnBase}
            aria-label="Next page"
          >
            <ChevronRight size={config.iconSize} />
          </button>
        </div>

        {/* Desktop Layout */}
        <div
          className="hidden sm:flex sm:items-center sm:justify-between"
          style={{ 
            paddingBottom: variant === 'compact' ? '0' : '14px', 
            gap: '1rem', 
            flexWrap: 'wrap' as const 
          }}
        >
          {/* Results Count */}
          {showResultsCount && variant !== 'minimal' && (
            <p style={{ fontSize: config.fontSize, color: theme.textSecondary, margin: 0 }}>
              Showing{' '}
              <strong style={{ fontWeight: 500, color: theme.text }}>{startItem}–{endItem}</strong>
              {' '}of{' '}
              <strong style={{ fontWeight: 500, color: theme.text }}>{totalItems}</strong>
              {' '}results
            </p>
          )}

          {/* Navigation */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: containerGap }}
            aria-label="Pagination"
          >
            {/* First Page Button */}
            {showFirstLastButtons && variant !== 'minimal' && (
              <button
                className={currentPage > 1 ? 'pg-btn' : ''}
                onClick={() => onPageChange(1)}
                style={currentPage === 1 ? btnDisabled : btnBase}
                aria-label="First page"
                title="First page"
              >
                <ChevronsLeft size={config.iconSize} />
              </button>
            )}

            {/* Previous Button */}
            <button
              className={currentPage > 1 ? 'pg-btn' : ''}
              onClick={handlePrev}
              style={currentPage === 1 ? btnDisabled : btnBase}
              aria-label="Previous page"
            >
              <ChevronLeft size={config.iconSize} />
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: containerGap === '2px' ? '2px' : '2px', margin: '0 2px' }}>
              {getPageNumbers().map((page, idx) => {
                if (page < 0) {
                  return (
                    <span
                      key={`e${idx}`}
                      style={{
                        fontSize: config.fontSize,
                        color: theme.textSecondary,
                        padding: '0 4px',
                        userSelect: 'none',
                        letterSpacing: '0.05em',
                      }}
                    >
                      ···
                    </span>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    className={isActive ? '' : 'pg-btn'}
                    onClick={() => !isActive && onPageChange(page)}
                    style={isActive ? btnActive : btnBase}
                    aria-label={`Page ${page}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              className={currentPage < totalPages ? 'pg-btn' : ''}
              onClick={handleNext}
              style={currentPage === totalPages ? btnDisabled : btnBase}
              aria-label="Next page"
            >
              <ChevronRight size={config.iconSize} />
            </button>

            {/* Last Page Button */}
            {showFirstLastButtons && variant !== 'minimal' && (
              <button
                className={currentPage < totalPages ? 'pg-btn' : ''}
                onClick={() => onPageChange(totalPages)}
                style={currentPage === totalPages ? btnDisabled : btnBase}
                aria-label="Last page"
                title="Last page"
              >
                <ChevronsRight size={config.iconSize} />
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Pagination;