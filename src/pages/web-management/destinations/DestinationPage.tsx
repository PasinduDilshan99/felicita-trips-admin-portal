"use client";

import React, { useState, useEffect, JSX } from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DestinationStatisticsData } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Animated number counter */
const AnimatedCount = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 900;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}</>;
};

/** Skeleton loader for stat cards */
const StatCardSkeleton = () => (
  <div className="dp-stat-card dp-skeleton">
    <div className="dp-skeleton-icon" />
    <div className="dp-skeleton-line dp-skeleton-line--short" />
    <div className="dp-skeleton-line dp-skeleton-line--wide" />
  </div>
);

/* ─────────────────────────────────────────────
   Config helpers
───────────────────────────────────────────── */

const ACTION_CONFIG: Record<
  string,
  { accent: string; icon: JSX.Element }
> = {
  view: {
    accent: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  add: {
    accent: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  update: {
    accent: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
        <path d="M17.586 3.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  remove: {
    accent: "rose",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  default: {
    accent: "violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
};

const getActionConfig = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("view") || lower.includes("all")) return ACTION_CONFIG.view;
  if (lower.includes("add") || lower.includes("create")) return ACTION_CONFIG.add;
  if (lower.includes("update") || lower.includes("edit")) return ACTION_CONFIG.update;
  if (lower.includes("remove") || lower.includes("delete")) return ACTION_CONFIG.remove;
  return ACTION_CONFIG.default;
};

const ACCENT_STYLES: Record<string, { pill: string; iconWrap: string; arrow: string }> = {
  blue:    { pill: "dp-pill--blue",    iconWrap: "dp-icon-wrap--blue",    arrow: "dp-arrow--blue" },
  emerald: { pill: "dp-pill--emerald", iconWrap: "dp-icon-wrap--emerald", arrow: "dp-arrow--emerald" },
  amber:   { pill: "dp-pill--amber",   iconWrap: "dp-icon-wrap--amber",   arrow: "dp-arrow--amber" },
  rose:    { pill: "dp-pill--rose",    iconWrap: "dp-icon-wrap--rose",    arrow: "dp-arrow--rose" },
  violet:  { pill: "dp-pill--violet",  iconWrap: "dp-icon-wrap--violet",  arrow: "dp-arrow--violet" },
};

/* ─────────────────────────────────────────────
   Custom Tooltip for recharts
───────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="dp-tooltip">
        <p className="dp-tooltip__label">{label}</p>
        <p className="dp-tooltip__value">{payload[0].value} destinations</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="dp-tooltip">
        <p className="dp-tooltip__label">{payload[0].name}</p>
        <p className="dp-tooltip__value">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */

const DestinationPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<DestinationStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destinationsData = webManagementSideBarData.find(
    (item) => item.name === "Destinations"
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Destinations", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}` },
  ];

  useEffect(() => { fetchStatistics(); }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DestinationService.getDestinationStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Chart data ── */
  const PIE_COLORS = ["#3B82F6", "#FDA4AF"];
  const pieChartData = statistics
    ? [
        { name: "Wishlisted", value: statistics.wishDetails.wishListCount },
        { name: "Not Wishlisted", value: statistics.wishDetails.notWishListCount },
      ]
    : [];

  const barChartData =
    statistics?.categoryDetails.map((cat) => ({
      name: cat.categoryName,
      count: cat.count,
    })) || [];

  /* ── Stat cards ── */
  type StatCard = { title: string; value: number; icon: JSX.Element; accent: string; };

  const statCards: StatCard[] = statistics
    ? [
        {
          title: "Total",
          value: statistics.destinationDetails.totalDestinationCount,
          accent: "blue",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          ),
        },
        {
          title: "Active",
          value: statistics.destinationDetails.activeDestinations,
          accent: "emerald",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: "Inactive",
          value: statistics.destinationDetails.inActiveDestinations,
          accent: "rose",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          ),
        },
        {
          title: "Hidden",
          value: statistics.destinationDetails.hiddenDestinations,
          accent: "violet",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ),
        },
        {
          title: "Recently Updated",
          value: statistics.destinationDetails.recentlyUpdateDestinations,
          accent: "amber",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
          ),
        },
        {
          title: "Recently Added",
          value: statistics.destinationDetails.recentlyAddedDestinations,
          accent: "teal",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          ),
        },
      ]
    : [];

  /* ─────── Render ─────── */
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* Tokens */
        .dp-root {
          --dp-bg: ${theme.background};
          --dp-surface: ${theme.surface};
          --dp-border: ${theme.border};
          --dp-text-primary: ${theme.text};
          --dp-text-secondary: ${theme.textSecondary};
          --dp-text-muted: ${theme.textSecondary};
          --dp-radius-md: 12px;
          --dp-radius-lg: 16px;
          --dp-shadow-sm: 0 1px 3px rgba(15,23,42,.06), 0 1px 2px rgba(15,23,42,.04);
          --dp-shadow-md: 0 4px 12px rgba(15,23,42,.08), 0 2px 4px rgba(15,23,42,.04);
          --dp-shadow-lg: 0 12px 32px rgba(15,23,42,.10), 0 4px 8px rgba(15,23,42,.06);
          background: var(--dp-bg);
          min-height: 100vh;
          padding-bottom: 3rem;
        }

        /* Container for consistent padding */
        .dp-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Section title ── */
        .dp-section-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--dp-text-primary);
          letter-spacing: -.01em;
          margin-bottom: 1rem;
        }
        .dp-section-heading::before {
          content: '';
          display: block;
          width: 4px;
          height: 18px;
          background: linear-gradient(180deg, ${theme.primary}, ${theme.accent});
          border-radius: 2px;
        }

        /* ── Action cards - FULL WIDTH ── */
        .dp-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          width: 100%;
        }
        
        @media (max-width: 1024px) {
          .dp-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 640px) {
          .dp-actions-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .dp-action-card {
          display: block;
          background: var(--dp-surface);
          border: 1.5px solid var(--dp-border);
          border-radius: var(--dp-radius-lg);
          padding: 1.5rem 1.25rem;
          text-decoration: none;
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
          box-shadow: var(--dp-shadow-sm);
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .dp-action-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity .22s ease;
          border-radius: inherit;
        }
        .dp-action-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--dp-shadow-lg);
        }
        .dp-action-card:hover::before { opacity: 1; }

        /* Accent tints on hover */
        .dp-action-card--blue::before   { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
        .dp-action-card--emerald::before{ background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%); }
        .dp-action-card--amber::before  { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }
        .dp-action-card--rose::before   { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); }
        .dp-action-card--violet::before { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }

        .dp-action-card__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: .75rem;
        }
        .dp-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dp-icon-wrap svg { width: 22px; height: 22px; }

        .dp-icon-wrap--blue    { background:#dbeafe; color:#2563eb; }
        .dp-icon-wrap--emerald { background:#d1fae5; color:#059669; }
        .dp-icon-wrap--amber   { background:#fef3c7; color:#d97706; }
        .dp-icon-wrap--rose    { background:#ffe4e6; color:#e11d48; }
        .dp-icon-wrap--violet  { background:#ede9fe; color:#7c3aed; }

        .dp-action-card__name {
          font-size: .9375rem;
          font-weight: 600;
          color: var(--dp-text-primary);
          margin: 0;
        }
        .dp-action-card__desc {
          font-size: .8125rem;
          color: var(--dp-text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        .dp-action-card__footer {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: .8125rem;
          font-weight: 500;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity .2s ease, transform .2s ease;
        }
        .dp-action-card:hover .dp-action-card__footer {
          opacity: 1;
          transform: translateX(0);
        }
        .dp-action-card__footer svg { width: 14px; height: 14px; }
        .dp-arrow--blue    { color: #2563eb; }
        .dp-arrow--emerald { color: #059669; }
        .dp-arrow--amber   { color: #d97706; }
        .dp-arrow--rose    { color: #e11d48; }
        .dp-arrow--violet  { color: #7c3aed; }

        /* Pill badge on card */
        .dp-pill {
          display: inline-flex;
          align-items: center;
          font-size: .6875rem;
          font-weight: 600;
          letter-spacing: .04em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
          position: absolute;
          top: .875rem;
          right: .875rem;
          z-index: 2;
        }
        .dp-pill--blue    { background:#dbeafe; color:#1d4ed8; }
        .dp-pill--emerald { background:#d1fae5; color:#065f46; }
        .dp-pill--amber   { background:#fef3c7; color:#92400e; }
        .dp-pill--rose    { background:#ffe4e6; color:#9f1239; }
        .dp-pill--violet  { background:#ede9fe; color:#5b21b6; }

        /* ── Stat cards - FULL WIDTH with flexible columns ── */
        .dp-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: .875rem;
          width: 100%;
        }
        
        @media (max-width: 1200px) {
          .dp-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .dp-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .dp-stats-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .dp-stat-card {
          background: var(--dp-surface);
          border: 1.5px solid var(--dp-border);
          border-radius: var(--dp-radius-md);
          padding: 1.25rem;
          box-shadow: var(--dp-shadow-sm);
          display: flex;
          flex-direction: column;
          gap: .5rem;
          transition: box-shadow .2s, transform .2s;
          width: 100%;
        }
        .dp-stat-card:hover {
          box-shadow: var(--dp-shadow-md);
          transform: translateY(-2px);
        }
        .dp-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-stat-icon svg { width: 19px; height: 19px; }

        .dp-stat-icon--blue    { background:#dbeafe; color:#2563eb; }
        .dp-stat-icon--emerald { background:#d1fae5; color:#059669; }
        .dp-stat-icon--rose    { background:#ffe4e6; color:#e11d48; }
        .dp-stat-icon--violet  { background:#ede9fe; color:#7c3aed; }
        .dp-stat-icon--amber   { background:#fef3c7; color:#d97706; }
        .dp-stat-icon--teal    { background:#ccfbf1; color:#0d9488; }

        .dp-stat-value {
          font-size: 1.625rem;
          font-weight: 700;
          color: var(--dp-text-primary);
          line-height: 1;
          letter-spacing: -.02em;
        }
        .dp-stat-title {
          font-size: .75rem;
          font-weight: 500;
          color: var(--dp-text-secondary);
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        /* ── Charts ── */
        .dp-charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .dp-charts-grid { grid-template-columns: 1fr; }
        }
        .dp-chart-card {
          background: var(--dp-surface);
          border: 1.5px solid var(--dp-border);
          border-radius: var(--dp-radius-lg);
          padding: 1.5rem;
          box-shadow: var(--dp-shadow-sm);
        }
        .dp-chart-title {
          font-size: .9375rem;
          font-weight: 600;
          color: var(--dp-text-primary);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dp-chart-title-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dp-chart-title-dot--blue { background:${theme.primary}; }
        .dp-chart-title-dot--emerald { background:${theme.success}; }

        /* Pie legend */
        .dp-pie-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .dp-pie-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: .8125rem;
          color: var(--dp-text-secondary);
          font-weight: 500;
        }
        .dp-pie-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Tooltip */
        .dp-tooltip {
          background: #0f172a;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,.2);
        }
        .dp-tooltip__label {
          font-size: .75rem;
          color: #94a3b8;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .dp-tooltip__value {
          font-size: .875rem;
          color: #f8fafc;
          font-weight: 700;
        }

        /* ── Info banner ── */
        .dp-info-banner {
          background: linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)} 0%, ${hexToRgba(theme.accent, 0.05)} 100%);
          border: 1.5px solid ${hexToRgba(theme.primary, 0.2)};
          border-radius: var(--dp-radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .dp-info-banner__icon {
          width: 36px;
          height: 36px;
          background: ${hexToRgba(theme.primary, 0.1)};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: ${theme.primary};
        }
        .dp-info-banner__icon svg { width: 18px; height: 18px; }
        .dp-info-banner__title {
          font-size: .875rem;
          font-weight: 600;
          color: ${theme.primary};
          margin-bottom: .25rem;
        }
        .dp-info-banner__text {
          font-size: .8125rem;
          color: ${theme.textSecondary};
          line-height: 1.6;
        }

        /* ── Error banner ── */
        .dp-error-banner {
          background: ${hexToRgba(theme.error, 0.1)};
          border: 1.5px solid ${hexToRgba(theme.error, 0.3)};
          border-radius: var(--dp-radius-md);
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .dp-error-banner__left {
          display: flex;
          align-items: center;
          gap: .75rem;
          color: ${theme.error};
          font-size: .875rem;
          font-weight: 500;
        }
        .dp-error-banner__left svg { width: 20px; height: 20px; flex-shrink: 0; }
        .dp-retry-btn {
          background: ${theme.error};
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: .5rem 1rem;
          font-size: .8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background .15s;
          white-space: nowrap;
        }
        .dp-retry-btn:hover { background: ${hexToRgba(theme.error, 0.8)}; }

        /* ── Skeleton ── */
        @keyframes dp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .dp-skeleton {
          pointer-events: none;
        }
        .dp-skeleton-icon,
        .dp-skeleton-line {
          border-radius: 6px;
          background: linear-gradient(90deg, ${theme.border} 25%, ${theme.surface} 50%, ${theme.border} 75%);
          background-size: 800px 100%;
          animation: dp-shimmer 1.4s infinite;
        }
        .dp-skeleton-icon { width: 38px; height: 38px; border-radius: 9px; }
        .dp-skeleton-line { height: 10px; margin-top: .5rem; }
        .dp-skeleton-line--short { width: 50%; }
        .dp-skeleton-line--wide  { width: 80%; margin-top: .75rem; height: 20px; }

        /* ── Loading full-screen ── */
        .dp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
          color: var(--dp-text-secondary);
          font-size: .875rem;
        }
        .dp-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${theme.border};
          border-top-color: ${theme.primary};
          border-radius: 50%;
          animation: dp-spin .7s linear infinite;
        }
        @keyframes dp-spin { to { transform: rotate(360deg); } }

        /* Spacing utility */
        .dp-mt-6 { margin-top: 1.5rem; }
        .dp-mt-8 { margin-top: 2rem; }
      `}</style>

      <div className="dp-root">
        <div className="dp-container">

          {/* ── Breadcrumb / Header ── */}
          <PageHeader
            title="Destinations"
            description="Manage and monitor your travel destination locations"
            breadcrumbItems={breadcrumbItems}
          />

          {loading ? (
            <div className="dp-loading">
              <div className="dp-spinner" />
              <span>Loading destination data…</span>
            </div>
          ) : (
            <>
              {/* ─── Quick-action cards - FULL WIDTH ─── */}
              <section>
                <p className="dp-section-heading">Quick Actions</p>
                <div className="dp-actions-grid">
                  {destinationsData?.subData.map((action) => {
                    const { accent, icon } = getActionConfig(action.name);
                    const styles = ACCENT_STYLES[accent] ?? ACCENT_STYLES.violet;
                    const pillLabel =
                      accent === "blue" ? "Browse" :
                      accent === "emerald" ? "Create" :
                      accent === "amber" ? "Edit" :
                      accent === "rose" ? "Remove" : "Manage";

                    return (
                      <a
                        key={action.id}
                        href={action.url}
                        className={`dp-action-card dp-action-card--${accent}`}
                      >
                        <span className={`dp-pill ${styles.pill}`}>{pillLabel}</span>
                        <div className="dp-action-card__inner">
                          <div className={`dp-icon-wrap ${styles.iconWrap}`}>{icon}</div>
                          <div>
                            <p className="dp-action-card__name">{action.name}</p>
                            <p className="dp-action-card__desc">{action.description}</p>
                          </div>
                          <div className={`dp-action-card__footer ${styles.arrow}`}>
                            <span>Open</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>

              {/* ─── Error banner ─── */}
              {error && (
                <div className="dp-mt-6">
                  <div className="dp-error-banner">
                    <div className="dp-error-banner__left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                    <button className="dp-retry-btn" onClick={fetchStatistics}>
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Stat cards - FULL WIDTH ─── */}
              {!error && (
                <section className="dp-mt-8">
                  <p className="dp-section-heading">Destination Statistics</p>
                  <div className="dp-stats-grid">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
                      : statCards.map((card, i) => (
                          <div key={i} className="dp-stat-card">
                            <div className={`dp-stat-icon dp-stat-icon--${card.accent}`}>
                              {card.icon}
                            </div>
                            <div className="dp-stat-value">
                              <AnimatedCount value={card.value} />
                            </div>
                            <div className="dp-stat-title">{card.title}</div>
                          </div>
                        ))}
                  </div>
                </section>
              )}

              {/* ─── Charts ─── */}
              {!error && statistics && (
                <section className="dp-mt-8">
                  <p className="dp-section-heading">Analytics Overview</p>
                  <div className="dp-charts-grid">

                    {/* Pie — Wishlist */}
                    <div className="dp-chart-card">
                      <div className="dp-chart-title">
                        <span className="dp-chart-title-dot dp-chart-title-dot--blue" />
                        Wishlist Distribution
                      </div>
                      <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%" cy="50%"
                              innerRadius={60}
                              outerRadius={95}
                              paddingAngle={4}
                              dataKey="value"
                              label={false}
                            >
                              {pieChartData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                  stroke="none"
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="dp-pie-legend">
                        {pieChartData.map((item, i) => (
                          <div key={i} className="dp-pie-legend-item">
                            <span className="dp-pie-legend-dot" style={{ background: PIE_COLORS[i] }} />
                            {item.name}: <strong style={{ color: theme.text, marginLeft: 3 }}>{item.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bar — By Category */}
                    <div className="dp-chart-card">
                      <div className="dp-chart-title">
                        <span className="dp-chart-title-dot dp-chart-title-dot--emerald" />
                        Destinations by Category
                      </div>
                      <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11, fill: theme.textSecondary, fontWeight: 500 }}
                              axisLine={false}
                              tickLine={false}
                              angle={-30}
                              textAnchor="end"
                              height={64}
                            />
                            <YAxis
                              tick={{ fontSize: 11, fill: theme.textSecondary }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: hexToRgba(theme.primary, 0.05) }} />
                            <Bar dataKey="count" fill={theme.primary} radius={[6, 6, 0, 0]} name="Destinations" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </section>
              )}

              {/* ─── Info banner ─── */}
              <section className="dp-mt-8">
                <div className="dp-info-banner">
                  <div className="dp-info-banner__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <p className="dp-info-banner__title">Destination Management</p>
                    <p className="dp-info-banner__text">
                      Use the quick-action cards above to browse, create, edit, or remove destinations.
                      Statistics and charts update in real-time to reflect the current state.
                    </p>
                  </div>
                </div>
              </section>

            </>
          )}

        </div>
      </div>
    </>
  );
};

export default DestinationPage;