"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
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
  ResponsiveContainer,
} from "recharts";
import { DestinationStatisticsData } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────
   Utility
───────────────────────────────────────────── */
const hexToRgba = (hex: string, opacity: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────── */
const AnimatedCount = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
};

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
const StatCardSkeleton = () => (
  <div className="dp-stat-card dp-skeleton-card">
    <div className="dp-skel dp-skel--icon" />
    <div className="dp-skel dp-skel--val" />
    <div className="dp-skel dp-skel--label" />
  </div>
);

/* ─────────────────────────────────────────────
   Action config
───────────────────────────────────────────── */
const ACTION_CONFIG: Record<string, { accent: string; icon: JSX.Element; pillLabel: string }> = {
  view: {
    accent: "blue",
    pillLabel: "Browse",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  add: {
    accent: "emerald",
    pillLabel: "Create",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  update: {
    accent: "amber",
    pillLabel: "Edit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
        <path d="M17.586 3.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  remove: {
    accent: "rose",
    pillLabel: "Remove",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  default: {
    accent: "violet",
    pillLabel: "Manage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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

/* ─────────────────────────────────────────────
   Custom Tooltips
───────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{label}</p>
      <p className="dp-tooltip__value">{payload[0].value} destinations</p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{payload[0].name}</p>
      <p className="dp-tooltip__value">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Section Header Component
───────────────────────────────────────────── */
const SectionHeader = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) => (
  <div className="dp-section-header">
    <div className="dp-section-header__left">
      <div className="dp-section-header__bar" />
      <div>
        <div className="dp-section-header__title-row">
          <h2 className="dp-section-header__title">{title}</h2>
          {badge && <span className="dp-section-badge">{badge}</span>}
        </div>
        {subtitle && <p className="dp-section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const DestinationPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<DestinationStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const destinationsData = webManagementSideBarData.find(
    (item) => item.name === "Destinations"
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Trigger card entrance animation
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setVisibleCards(true), 80);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setVisibleCards(false);
      const response = await DestinationService.getDestinationStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Chart data ── */
  const PIE_COLORS = [theme.primary ?? "#0D4E4A", "#FDA4AF"];
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
  type StatCard = {
    title: string;
    value: number;
    icon: JSX.Element;
    accent: string;
    trend?: string;
  };

  const statCards: StatCard[] = statistics
    ? [
        {
          title: "Total Destinations",
          value: statistics.destinationDetails.totalDestinationCount,
          accent: "blue",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: "Inactive",
          value: statistics.destinationDetails.inActiveDestinations,
          accent: "rose",
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          ),
        },
      ]
    : [];

  const p = theme.primary ?? "#0D4E4A";
  const acc = theme.accent ?? "#1a7a74";
  const surf = theme.surface ?? "#ffffff";
  const bg = theme.background ?? "#f8fafb";
  const border = theme.border ?? "#e5e7eb";
  const textPrimary = theme.text ?? "#111827";
  const textSecondary = theme.textSecondary ?? "#6b7280";
  const errColor = theme.error ?? "#ef4444";
  const successColor = theme.success ?? "#10b981";

  /* ─────── Render ─────── */
  return (
    <>
      <style>{`
        /* ── Base tokens ── */
        .dp-root {
          --p: ${p};
          --acc: ${acc};
          --surf: ${surf};
          --bg: ${bg};
          --border: ${border};
          --text: ${textPrimary};
          --muted: ${textSecondary};
          --err: ${errColor};
          --ok: ${successColor};

          /* Accent palette */
          --blue-bg: #dbeafe;   --blue-fg: #1d4ed8;   --blue-mid: #3b82f6;
          --em-bg: #d1fae5;     --em-fg: #065f46;     --em-mid: #10b981;
          --am-bg: #fef3c7;     --am-fg: #92400e;     --am-mid: #f59e0b;
          --ro-bg: #ffe4e6;     --ro-fg: #9f1239;     --ro-mid: #f43f5e;
          --vi-bg: #ede9fe;     --vi-fg: #5b21b6;     --vi-mid: #8b5cf6;
          --tl-bg: #ccfbf1;     --tl-fg: #134e4a;     --tl-mid: #14b8a6;

          background: var(--bg);
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .dp-wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* ── Keyframes ── */
        @keyframes dp-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes dp-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dp-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dp-pulse-ring {
          0%   { box-shadow: 0 0 0 0 ${hexToRgba(p, 0.35)}; }
          70%  { box-shadow: 0 0 0 10px ${hexToRgba(p, 0)}; }
          100% { box-shadow: 0 0 0 0 ${hexToRgba(p, 0)}; }
        }
        @keyframes dp-bar-grow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
        }

        /* ── Loading ── */
        .dp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 58vh;
          gap: 1.25rem;
        }
        .dp-spinner-wrap {
          position: relative;
          width: 52px;
          height: 52px;
        }
        .dp-spinner {
          width: 52px;
          height: 52px;
          border: 3px solid var(--border);
          border-top-color: var(--p);
          border-radius: 50%;
          animation: dp-spin .75s linear infinite;
        }
        .dp-spinner-dot {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-spinner-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--p);
          border-radius: 50%;
          animation: dp-pulse-ring 1.4s ease-out infinite;
        }
        .dp-loading-text {
          font-size: .875rem;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: .02em;
        }

        /* ── Section header ── */
        .dp-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.125rem;
        }
        .dp-section-header__left {
          display: flex;
          align-items: flex-start;
          gap: .875rem;
        }
        .dp-section-header__bar {
          width: 4px;
          height: 100%;
          min-height: 36px;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--p) 0%, var(--acc) 100%);
          flex-shrink: 0;
        }
        .dp-section-header__title-row {
          display: flex;
          align-items: center;
          gap: .625rem;
        }
        .dp-section-header__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          letter-spacing: -.015em;
        }
        .dp-section-header__subtitle {
          font-size: .8125rem;
          color: var(--muted);
          margin: .2rem 0 0;
          font-weight: 400;
        }
        .dp-section-badge {
          display: inline-flex;
          align-items: center;
          font-size: .6875rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
          background: ${hexToRgba(p, 0.1)};
          color: var(--p);
          border: 1px solid ${hexToRgba(p, 0.18)};
        }

        /* ── Action cards ── */
        .dp-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.125rem;
        }
        @media (max-width: 1100px) { .dp-actions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .dp-actions-grid { grid-template-columns: 1fr; } }

        .dp-action-card {
          display: block;
          text-decoration: none;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.375rem 1.25rem 1.125rem;
          position: relative;
          overflow: hidden;
          transition: transform .24s cubic-bezier(0.22,1,0.36,1),
                      box-shadow .24s cubic-bezier(0.22,1,0.36,1),
                      border-color .24s ease;
          box-shadow: 0 1px 3px rgba(15,23,42,.05), 0 1px 2px rgba(15,23,42,.03);
        }

        /* Gradient tint layer */
        .dp-action-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity .28s ease;
          border-radius: inherit;
          pointer-events: none;
        }
        /* Glow border on hover */
        .dp-action-card::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 17px;
          opacity: 0;
          transition: opacity .28s ease;
          pointer-events: none;
        }

        .dp-action-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 16px 40px rgba(15,23,42,.12), 0 4px 12px rgba(15,23,42,.06);
        }
        .dp-action-card:hover::before { opacity: 1; }
        .dp-action-card:hover::after  { opacity: 1; }

        .dp-action-card--blue::before   { background: linear-gradient(145deg, #eff6ff, #dbeafe99); }
        .dp-action-card--blue::after    { border: 1.5px solid #93c5fd; }
        .dp-action-card--emerald::before{ background: linear-gradient(145deg, #f0fdf4, #d1fae599); }
        .dp-action-card--emerald::after { border: 1.5px solid #6ee7b7; }
        .dp-action-card--amber::before  { background: linear-gradient(145deg, #fffbeb, #fef3c799); }
        .dp-action-card--amber::after   { border: 1.5px solid #fcd34d; }
        .dp-action-card--rose::before   { background: linear-gradient(145deg, #fff1f2, #ffe4e699); }
        .dp-action-card--rose::after    { border: 1.5px solid #fda4af; }
        .dp-action-card--violet::before { background: linear-gradient(145deg, #f5f3ff, #ede9fe99); }
        .dp-action-card--violet::after  { border: 1.5px solid #c4b5fd; }

        .dp-action-card__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: .875rem;
        }

        .dp-action-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dp-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform .22s cubic-bezier(0.22,1,0.36,1);
        }
        .dp-action-card:hover .dp-icon-wrap { transform: scale(1.1) rotate(-4deg); }
        .dp-icon-wrap svg { width: 21px; height: 21px; }

        .dp-icon-wrap--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dp-icon-wrap--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dp-icon-wrap--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-icon-wrap--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dp-icon-wrap--violet  { background: var(--vi-bg);   color: var(--vi-fg); }

        .dp-pill {
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .dp-pill--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dp-pill--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dp-pill--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-pill--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dp-pill--violet  { background: var(--vi-bg);   color: var(--vi-fg); }

        .dp-action-card__name {
          font-size: .9375rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 .2rem;
          letter-spacing: -.01em;
        }
        .dp-action-card__desc {
          font-size: .8125rem;
          color: var(--muted);
          margin: 0;
          line-height: 1.55;
        }

        .dp-action-card__cta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: .8125rem;
          font-weight: 600;
          padding-top: .25rem;
          border-top: 1px solid var(--border);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity .22s ease, transform .22s ease;
        }
        .dp-action-card:hover .dp-action-card__cta {
          opacity: 1;
          transform: translateY(0);
        }
        .dp-action-card__cta svg { width: 13px; height: 13px; }
        .dp-cta--blue    { color: var(--blue-fg); }
        .dp-cta--emerald { color: var(--em-fg); }
        .dp-cta--amber   { color: var(--am-fg); }
        .dp-cta--rose    { color: var(--ro-fg); }
        .dp-cta--violet  { color: var(--vi-fg); }

        /* ── Stat cards ── */
        .dp-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .dp-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .dp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px)  { .dp-stats-grid { grid-template-columns: 1fr; } }

        .dp-stat-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: .625rem;
          transition: transform .22s cubic-bezier(0.22,1,0.36,1),
                      box-shadow .22s ease;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
          position: relative;
          overflow: hidden;
        }
        /* Subtle top-accent stripe */
        .dp-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
          opacity: 0;
          transition: opacity .22s ease;
        }
        .dp-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(15,23,42,.1), 0 2px 6px rgba(15,23,42,.05);
        }
        .dp-stat-card:hover::before { opacity: 1; }

        .dp-stat-card--blue::before    { background: linear-gradient(90deg, var(--blue-mid), transparent); }
        .dp-stat-card--emerald::before { background: linear-gradient(90deg, var(--em-mid), transparent); }
        .dp-stat-card--rose::before    { background: linear-gradient(90deg, var(--ro-mid), transparent); }
        .dp-stat-card--violet::before  { background: linear-gradient(90deg, var(--vi-mid), transparent); }
        .dp-stat-card--amber::before   { background: linear-gradient(90deg, var(--am-mid), transparent); }
        .dp-stat-card--teal::before    { background: linear-gradient(90deg, var(--tl-mid), transparent); }

        .dp-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dp-stat-icon svg { width: 20px; height: 20px; }
        .dp-stat-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dp-stat-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dp-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dp-stat-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }
        .dp-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-stat-icon--teal    { background: var(--tl-bg);   color: var(--tl-fg); }

        .dp-stat-value {
          font-size: 1.875rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.03em;
        }
        .dp-stat-label {
          font-size: .725rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* ── Skeleton ── */
        .dp-skeleton-card { pointer-events: none; }
        .dp-skel {
          border-radius: 6px;
          background: linear-gradient(90deg, var(--border) 25%, var(--surf) 50%, var(--border) 75%);
          background-size: 800px 100%;
          animation: dp-shimmer 1.4s infinite;
        }
        .dp-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
        .dp-skel--val    { width: 60%; height: 28px; margin-top: .625rem; }
        .dp-skel--label  { width: 80%; height: 10px; }

        /* ── Charts ── */
        .dp-charts-row {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 1.25rem;
        }
        @media (max-width: 860px) { .dp-charts-row { grid-template-columns: 1fr; } }

        .dp-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.625rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.05);
        }

        .dp-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.375rem;
        }
        .dp-chart-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .9375rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -.01em;
        }
        .dp-chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dp-chart-dot--p  { background: var(--p); }
        .dp-chart-dot--ok { background: var(--ok); }

        .dp-chart-sub {
          font-size: .75rem;
          color: var(--muted);
          font-weight: 500;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        /* Pie legend */
        .dp-pie-legend {
          display: flex;
          justify-content: center;
          gap: 1.75rem;
          margin-top: 1.125rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .dp-pie-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: .8125rem;
          color: var(--muted);
          font-weight: 500;
        }
        .dp-pie-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .dp-pie-legend-count {
          font-weight: 700;
          color: var(--text);
          margin-left: 2px;
        }

        /* ── Tooltip ── */
        .dp-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 8px 13px;
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.06);
        }
        .dp-tooltip__label {
          font-size: .72rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 3px;
        }
        .dp-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }

        /* ── Error ── */
        .dp-error-banner {
          background: ${hexToRgba(errColor, 0.06)};
          border: 1.5px solid ${hexToRgba(errColor, 0.25)};
          border-radius: 12px;
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
          color: var(--err);
          font-size: .875rem;
          font-weight: 600;
        }
        .dp-error-banner__left svg { width: 20px; height: 20px; flex-shrink: 0; }
        .dp-retry-btn {
          background: var(--err);
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: .5rem 1.125rem;
          font-size: .8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .15s, transform .15s;
          white-space: nowrap;
          letter-spacing: .01em;
        }
        .dp-retry-btn:hover { opacity: .88; transform: scale(.98); }

        /* ── Info banner ── */
        .dp-info-banner {
          background: linear-gradient(135deg,
            ${hexToRgba(p, 0.04)} 0%,
            ${hexToRgba(acc, 0.06)} 100%);
          border: 1.5px solid ${hexToRgba(p, 0.15)};
          border-radius: 16px;
          padding: 1.375rem 1.625rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .dp-info-icon {
          width: 40px;
          height: 40px;
          background: ${hexToRgba(p, 0.1)};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--p);
          flex-shrink: 0;
        }
        .dp-info-icon svg { width: 18px; height: 18px; }
        .dp-info-title {
          font-size: .875rem;
          font-weight: 700;
          color: var(--p);
          margin-bottom: .25rem;
          letter-spacing: -.01em;
        }
        .dp-info-text {
          font-size: .8125rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Entrance animations ── */
        .dp-fade-up {
          animation: dp-fadeUp .5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .dp-delay-1 { animation-delay: .05s; }
        .dp-delay-2 { animation-delay: .1s; }
        .dp-delay-3 { animation-delay: .15s; }
        .dp-delay-4 { animation-delay: .2s; }

        /* ── Spacing ── */
        .dp-mt-6 { margin-top: 1.5rem; }
        .dp-mt-7 { margin-top: 1.875rem; }
        .dp-mt-8 { margin-top: 2.25rem; }
      `}</style>

      <div className="dp-root">
        <div className="dp-wrap">

          {/* ── Breadcrumb / Header ── */}
          <PageHeader
            title="Destinations"
            description="Manage and monitor your travel destination locations"
            breadcrumbItems={breadcrumbItems}
          />

          {loading ? (
            <div className="dp-loading">
              <div className="dp-spinner-wrap">
                <div className="dp-spinner" />
                <div className="dp-spinner-dot" />
              </div>
              <span className="dp-loading-text">Loading destination data…</span>
            </div>
          ) : (
            <>
              {/* ── Quick Actions ── */}
              <section className="dp-fade-up dp-delay-1">
                <SectionHeader
                  title="Quick Actions"
                  subtitle="Jump directly to any destination management task"
                  badge={`${destinationsData?.subData.length ?? 0} actions`}
                />
                <div className="dp-actions-grid">
                  {destinationsData?.subData.map((action, idx) => {
                    const { accent, icon, pillLabel } = getActionConfig(action.name);
                    return (
                      <a
                        key={action.id}
                        href={action.url}
                        className={`dp-action-card dp-action-card--${accent}`}
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      >
                        <div className="dp-action-card__inner">
                          <div className="dp-action-card__top">
                            <div className={`dp-icon-wrap dp-icon-wrap--${accent}`}>{icon}</div>
                            <span className={`dp-pill dp-pill--${accent}`}>{pillLabel}</span>
                          </div>
                          <div>
                            <p className="dp-action-card__name">{action.name}</p>
                            <p className="dp-action-card__desc">{action.description}</p>
                          </div>
                          <div className={`dp-action-card__cta dp-cta--${accent}`}>
                            <span>Open</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>

              {/* ── Error ── */}
              {error && (
                <div className="dp-mt-6 dp-fade-up">
                  <div className="dp-error-banner">
                    <div className="dp-error-banner__left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                    <button className="dp-retry-btn" onClick={fetchStatistics}>Retry</button>
                  </div>
                </div>
              )}

              {/* ── Statistics ── */}
              {!error && (
                <section className="dp-mt-8 dp-fade-up dp-delay-2">
                  <SectionHeader
                    title="Destination Statistics"
                    subtitle="Live counts across all destination records"
                    badge="Live"
                  />
                  <div className="dp-stats-grid">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
                      : statCards.map((card, i) => (
                          <div
                            key={i}
                            className={`dp-stat-card dp-stat-card--${card.accent} dp-fade-up`}
                            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                          >
                            <div className={`dp-stat-icon dp-stat-icon--${card.accent}`}>
                              {card.icon}
                            </div>
                            <div className="dp-stat-value">
                              <AnimatedCount value={card.value} duration={900 + i * 80} />
                            </div>
                            <div className="dp-stat-label">{card.title}</div>
                          </div>
                        ))}
                  </div>
                </section>
              )}

              {/* ── Charts ── */}
              {!error && statistics && (
                <section className="dp-mt-8 dp-fade-up dp-delay-3">
                  <SectionHeader
                    title="Analytics Overview"
                    subtitle="Visual breakdown of wishlist distribution and category spread"
                  />
                  <div className="dp-charts-row">

                    {/* Pie — Wishlist */}
                    <div className="dp-chart-card">
                      <div className="dp-chart-header">
                        <div className="dp-chart-title">
                          <span className="dp-chart-dot dp-chart-dot--p" />
                          Wishlist Distribution
                        </div>
                        <span className="dp-chart-sub">
                          {(statistics.wishDetails.wishListCount + statistics.wishDetails.notWishListCount).toLocaleString()} total
                        </span>
                      </div>
                      <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%" cy="50%"
                              innerRadius={62}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {pieChartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
                            {item.name}
                            <span className="dp-pie-legend-count">{item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bar — By Category */}
                    <div className="dp-chart-card">
                      <div className="dp-chart-header">
                        <div className="dp-chart-title">
                          <span className="dp-chart-dot dp-chart-dot--ok" />
                          Destinations by Category
                        </div>
                        <span className="dp-chart-sub">
                          {barChartData.length} categories
                        </span>
                      </div>
                      <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} barSize={26} margin={{ top: 4, right: 4, bottom: 40, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={hexToRgba(border, 0.8)} vertical={false} />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 11, fill: textSecondary, fontWeight: 500 }}
                              axisLine={false}
                              tickLine={false}
                              angle={-30}
                              textAnchor="end"
                              interval={0}
                            />
                            <YAxis
                              tick={{ fontSize: 11, fill: textSecondary }}
                              axisLine={false}
                              tickLine={false}
                              width={28}
                            />
                            <Tooltip
                              content={<CustomBarTooltip />}
                              cursor={{ fill: hexToRgba(p, 0.06), radius: 6 }}
                            />
                            <Bar dataKey="count" fill={p} radius={[7, 7, 0, 0]} name="Destinations" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </section>
              )}

              {/* ── Info banner ── */}
              <section className="dp-mt-7 dp-fade-up dp-delay-4">
                <div className="dp-info-banner">
                  <div className="dp-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <p className="dp-info-title">Destination Management</p>
                    <p className="dp-info-text">
                      Use the quick-action cards above to browse, create, edit, or remove destinations.
                      Statistics and charts reflect the latest data from your backend and update each time you visit this page.
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