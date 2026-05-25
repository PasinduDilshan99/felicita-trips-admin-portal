"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH,
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DestinationCategoriesStatisticsData } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";


/* ─────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────── */
const AnimatedCount = ({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
};

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
const StatCardSkeleton = () => (
  <div className="dpc-stat-card dpc-skeleton-card">
    <div className="dpc-skel dpc-skel--icon" />
    <div className="dpc-skel dpc-skel--val" />
    <div className="dpc-skel dpc-skel--label" />
  </div>
);

/* ─────────────────────────────────────────────
   Action config for getting icon and pill label
───────────────────────────────────────────── */
const ACTION_CONFIG: Record<
  string,
  { accent: string; icon: JSX.Element; pillLabel: string }
> = {
  view: {
    accent: "blue",
    pillLabel: "Browse",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  add: {
    accent: "emerald",
    pillLabel: "Create",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  update: {
    accent: "amber",
    pillLabel: "Edit",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
        <path d="M17.586 3.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  remove: {
    accent: "rose",
    pillLabel: "Remove",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  default: {
    accent: "violet",
    pillLabel: "Manage",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
};

const getActionConfig = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("view") || lower.includes("all"))
    return ACTION_CONFIG.view;
  if (lower.includes("add") || lower.includes("create"))
    return ACTION_CONFIG.add;
  if (lower.includes("update") || lower.includes("edit"))
    return ACTION_CONFIG.update;
  if (
    lower.includes("remove") ||
    lower.includes("delete") ||
    lower.includes("terminate")
  )
    return ACTION_CONFIG.remove;
  return ACTION_CONFIG.default;
};

/* ─────────────────────────────────────────────
   Custom Tooltips
───────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="dpc-tooltip">
      <p className="dpc-tooltip__label">{label}</p>
      <p className="dpc-tooltip__value">{payload[0].value} destinations</p>
      {data.color && (
        <div
          className="dpc-tooltip__color"
          style={{ background: data.color }}
        />
      )}
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="dpc-tooltip">
      <p className="dpc-tooltip__label">{label}</p>
      <p className="dpc-tooltip__value">{payload[0].value} images</p>
      {data.color && (
        <div
          className="dpc-tooltip__color"
          style={{ background: data.color }}
        />
      )}
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
  <div className="dpc-section-header">
    <div className="dpc-section-header__left">
      <div className="dpc-section-header__bar" />
      <div>
        <div className="dpc-section-header__title-row">
          <h2 className="dpc-section-header__title">{title}</h2>
          {badge && <span className="dpc-section-badge">{badge}</span>}
        </div>
        {subtitle && <p className="dpc-section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const DestinationCategoriesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<DestinationCategoriesStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredLinePoint, setHoveredLinePoint] = useState<string | null>(null);

  // Find Destinations -> Destination Categories subData
  const destinationsData = webManagementSideBarData.find(
    (item) => item.name === "Destinations",
  );
  const categoriesData = destinationsData?.subData.find(
    (item) => item.name === "Destination Categories",
  );
  const categoryActions = categoriesData?.grandSubData || [];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Categories",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}`,
    },
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await DestinationService.getDestinationCategoriesStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the category statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Chart data ── */
  // Category usage bar chart (all categories by destination count)
  const categoryUsageData = statistics?.categoryUsedDetails
    ? [...statistics.categoryUsedDetails].sort((a, b) => b.count - a.count)
    : [];

  // Images count line chart (all categories)
  const imagesCountData = statistics?.categoriesImagesCounts
    ? [...statistics.categoriesImagesCounts].sort(
        (a, b) => b.imagesCount - a.imagesCount,
      )
    : [];

  // Helper function to get bar color (with hover effect)
  const getBarColor = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (hoveredBar === categoryName && hoverColor && hoverColor !== "#000000") {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : hexToRgba(p, 0.85);
  };

  // Helper function to get line color (with hover effect)
  const getLineColor = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (
      hoveredLinePoint === categoryName &&
      hoverColor &&
      hoverColor !== "#000000"
    ) {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : successColor;
  };

  // Helper function to get dot fill color
  const getDotFill = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (
      hoveredLinePoint === categoryName &&
      hoverColor &&
      hoverColor !== "#000000"
    ) {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : successColor;
  };

  /* ── Stat cards ── */
  type StatCard = {
    title: string;
    value: number;
    icon: JSX.Element;
    accent: string;
  };

  const statCards: StatCard[] = statistics
    ? [
        {
          title: "Total Categories",
          value:
            statistics.destinationCategoriesDetails
              .totalDestinationCategoriesCount,
          accent: "blue",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 7h-4.18A3 3 0 0014 5.18L13.59 4.2a2 2 0 00-1.6-.2L7.83 5.3a2 2 0 00-1.14 1.89L6 9h14z" />
              <rect x="4" y="9" width="16" height="12" rx="2" />
            </svg>
          ),
        },
        {
          title: "Active",
          value:
            statistics.destinationCategoriesDetails
              .activeDestinationsCategories,
          accent: "emerald",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          title: "Inactive",
          value:
            statistics.destinationCategoriesDetails
              .inActiveDestinationsCategories,
          accent: "rose",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          ),
        },
        {
          title: "Terminated",
          value:
            statistics.destinationCategoriesDetails
              .terminateDestinationsCategories,
          accent: "violet",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ),
        },
        {
          title: "Recently Updated",
          value:
            statistics.destinationCategoriesDetails
              .recentlyUpdateDestinationsCategories,
          accent: "amber",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
          ),
        },
        {
          title: "Recently Added",
          value:
            statistics.destinationCategoriesDetails
              .recentlyAddedDestinationsCategories,
          accent: "teal",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
        .dpc-root {
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

        .dpc-wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* ── Keyframes ── */
        @keyframes dpc-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes dpc-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dpc-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dpc-pulse-ring {
          0%   { box-shadow: 0 0 0 0 ${hexToRgba(p, 0.35)}; }
          70%  { box-shadow: 0 0 0 10px ${hexToRgba(p, 0)}; }
          100% { box-shadow: 0 0 0 0 ${hexToRgba(p, 0)}; }
        }

        /* ── Loading ── */
        .dpc-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 58vh;
          gap: 1.25rem;
        }
        .dpc-spinner-wrap {
          position: relative;
          width: 52px;
          height: 52px;
        }
        .dpc-spinner {
          width: 52px;
          height: 52px;
          border: 3px solid var(--border);
          border-top-color: var(--p);
          border-radius: 50%;
          animation: dpc-spin .75s linear infinite;
        }
        .dpc-spinner-dot {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dpc-spinner-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--p);
          border-radius: 50%;
          animation: dpc-pulse-ring 1.4s ease-out infinite;
        }
        .dpc-loading-text {
          font-size: .875rem;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: .02em;
        }

        /* ── Section header ── */
        .dpc-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.125rem;
        }
        .dpc-section-header__left {
          display: flex;
          align-items: flex-start;
          gap: .875rem;
        }
        .dpc-section-header__bar {
          width: 4px;
          height: 100%;
          min-height: 36px;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--p) 0%, var(--acc) 100%);
          flex-shrink: 0;
        }
        .dpc-section-header__title-row {
          display: flex;
          align-items: center;
          gap: .625rem;
        }
        .dpc-section-header__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          letter-spacing: -.015em;
        }
        .dpc-section-header__subtitle {
          font-size: .8125rem;
          color: var(--muted);
          margin: .2rem 0 0;
          font-weight: 400;
        }
        .dpc-section-badge {
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

        /* ── Action cards grid ── */
        .dpc-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.125rem;
        }
        @media (max-width: 1100px) { .dpc-actions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .dpc-actions-grid { grid-template-columns: 1fr; } }

        /* ── Stat cards ── */
        .dpc-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .dpc-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .dpc-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px)  { .dpc-stats-grid { grid-template-columns: 1fr; } }

        .dpc-stat-card {
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
        .dpc-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
          opacity: 0;
          transition: opacity .22s ease;
        }
        .dpc-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(15,23,42,.1), 0 2px 6px rgba(15,23,42,.05);
        }
        .dpc-stat-card:hover::before { opacity: 1; }

        .dpc-stat-card--blue::before    { background: linear-gradient(90deg, var(--blue-mid), transparent); }
        .dpc-stat-card--emerald::before { background: linear-gradient(90deg, var(--em-mid), transparent); }
        .dpc-stat-card--rose::before    { background: linear-gradient(90deg, var(--ro-mid), transparent); }
        .dpc-stat-card--violet::before  { background: linear-gradient(90deg, var(--vi-mid), transparent); }
        .dpc-stat-card--amber::before   { background: linear-gradient(90deg, var(--am-mid), transparent); }
        .dpc-stat-card--teal::before    { background: linear-gradient(90deg, var(--tl-mid), transparent); }

        .dpc-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dpc-stat-icon svg { width: 20px; height: 20px; }
        .dpc-stat-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dpc-stat-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dpc-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dpc-stat-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }
        .dpc-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dpc-stat-icon--teal    { background: var(--tl-bg);   color: var(--tl-fg); }

        .dpc-stat-value {
          font-size: 1.875rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.03em;
        }
        .dpc-stat-label {
          font-size: .725rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* ── Skeleton ── */
        .dpc-skeleton-card { pointer-events: none; }
        .dpc-skel {
          border-radius: 6px;
          background: linear-gradient(90deg, var(--border) 25%, var(--surf) 50%, var(--border) 75%);
          background-size: 800px 100%;
          animation: dpc-shimmer 1.4s infinite;
        }
        .dpc-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
        .dpc-skel--val    { width: 60%; height: 28px; margin-top: .625rem; }
        .dpc-skel--label  { width: 80%; height: 10px; }

        /* ── Charts ── */
        .dpc-charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 860px) { .dpc-charts-row { grid-template-columns: 1fr; } }

        .dpc-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.625rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.05);
        }

        .dpc-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.375rem;
        }
        .dpc-chart-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .9375rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -.01em;
        }
        .dpc-chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dpc-chart-dot--p  { background: var(--p); }
        .dpc-chart-dot--ok { background: var(--ok); }

        .dpc-chart-sub {
          font-size: .75rem;
          color: var(--muted);
          font-weight: 500;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        /* ── Tooltip ── */
        .dpc-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 8px 13px;
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.06);
        }
        .dpc-tooltip__label {
          font-size: .72rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 3px;
        }
        .dpc-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .dpc-tooltip__color {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          margin-top: 6px;
        }

        /* ── Error ── */
        .dpc-error-banner {
          background: ${hexToRgba(errColor, 0.06)};
          border: 1.5px solid ${hexToRgba(errColor, 0.25)};
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .dpc-error-banner__left {
          display: flex;
          align-items: center;
          gap: .75rem;
          color: var(--err);
          font-size: .875rem;
          font-weight: 600;
        }
        .dpc-error-banner__left svg { width: 20px; height: 20px; flex-shrink: 0; }
        .dpc-retry-btn {
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
        .dpc-retry-btn:hover { opacity: .88; transform: scale(.98); }

        /* ── Info banner ── */
        .dpc-info-banner {
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
        .dpc-info-icon {
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
        .dpc-info-icon svg { width: 18px; height: 18px; }
        .dpc-info-title {
          font-size: .875rem;
          font-weight: 700;
          color: var(--p);
          margin-bottom: .25rem;
          letter-spacing: -.01em;
        }
        .dpc-info-text {
          font-size: .8125rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Entrance animations ── */
        .dpc-fade-up {
          animation: dpc-fadeUp .5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .dpc-delay-1 { animation-delay: .05s; }
        .dpc-delay-2 { animation-delay: .1s; }
        .dpc-delay-3 { animation-delay: .15s; }
        .dpc-delay-4 { animation-delay: .2s; }

        /* ── Spacing ── */
        .dpc-mt-6 { margin-top: 1.5rem; }
        .dpc-mt-7 { margin-top: 1.875rem; }
        .dpc-mt-8 { margin-top: 2.25rem; }
      `}</style>

      <div className="dpc-root">
        <div>
          {/* ── Breadcrumb / Header ── */}
          <div
            className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
            style={{
              backgroundColor: `${theme.surface}D9`,
              borderColor: theme.border,
            }}
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <PageHeader
                title="Destination Categories"
                description="Manage and monitor destination category classifications"
                breadcrumbItems={breadcrumbItems}
              />
            </div>
          </div>

          {loading ? (
            <div className="dpc-loading">
              <div className="dpc-spinner-wrap">
                <div className="dpc-spinner" />
                <div className="dpc-spinner-dot" />
              </div>
              <span className="dpc-loading-text">Loading category data…</span>
            </div>
          ) : (
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* ── Quick Actions ── */}
              <section className="dpc-fade-up dpc-delay-1">
                <SectionHeader
                  title="Quick Actions"
                  subtitle="Manage destination categories with these tools"
                  badge={`${categoryActions.length} actions`}
                />
                <div className="dpc-actions-grid">
                  {categoryActions.map((action, idx) => {
                    const { accent, icon, pillLabel } = getActionConfig(
                      action.name,
                    );
                    return (
                      <ActionCard
                        key={action.id}
                        id={action.id}
                        name={action.name}
                        description={action.description}
                        url={action.url}
                        accent={accent}
                        icon={icon}
                        pillLabel={pillLabel}
                        ctaText="Open"
                        theme={theme}
                        isDarkMode={isDarkMode}
                      />
                    );
                  })}
                </div>
              </section>

              {/* ── Error ── */}
              {error && (
                <div className="dpc-mt-6 dpc-fade-up">
                  <div className="dpc-error-banner">
                    <div className="dpc-error-banner__left">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                    <button className="dpc-retry-btn" onClick={fetchStatistics}>
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* ── Statistics ── */}
              {!error && (
                <section className="dpc-mt-8 dpc-fade-up dpc-delay-2">
                  <SectionHeader
                    title="Category Statistics"
                    subtitle="Live counts across all destination categories"
                    badge="Live"
                  />
                  <div className="dpc-stats-grid">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <StatCardSkeleton key={i} />
                        ))
                      : statCards.map((card, i) => (
                          <div
                            key={i}
                            className={`dpc-stat-card dpc-stat-card--${card.accent} dpc-fade-up`}
                            style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                          >
                            <div
                              className={`dpc-stat-icon dpc-stat-icon--${card.accent}`}
                            >
                              {card.icon}
                            </div>
                            <div className="dpc-stat-value">
                              <AnimatedCount
                                value={card.value}
                                duration={900 + i * 80}
                              />
                            </div>
                            <div className="dpc-stat-label">{card.title}</div>
                          </div>
                        ))}
                  </div>
                </section>
              )}

              {/* ── Charts ── */}
              {!error && statistics && (
                <section className="dpc-mt-8 dpc-fade-up dpc-delay-3">
                  <SectionHeader
                    title="Analytics Overview"
                    subtitle="Category usage distribution and image count breakdown"
                  />
                  <div className="dpc-charts-row">
                    {/* Bar chart — Destinations by Category with per-category colors */}
                    <div className="dpc-chart-card">
                      <div className="dpc-chart-header">
                        <div className="dpc-chart-title">
                          <span className="dpc-chart-dot dpc-chart-dot--p" />
                          Destinations by Category
                        </div>
                        <span className="dpc-chart-sub">
                          {
                            statistics.destinationCategoriesDetails
                              .totalDestinationCategoriesCount
                          }{" "}
                          categories
                        </span>
                      </div>
                      <div
                        style={{
                          height: Math.max(340, categoryUsageData.length * 35),
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={categoryUsageData}
                            layout="vertical"
                            margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={hexToRgba(border, 0.8)}
                              horizontal={false}
                            />
                            <XAxis
                              type="number"
                              tick={{
                                fontSize: 11,
                                fill: textSecondary,
                                fontWeight: 500,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              type="category"
                              dataKey="categoryName"
                              tick={{ fontSize: 11, fill: textSecondary }}
                              axisLine={false}
                              tickLine={false}
                              width={120}
                              tickFormatter={(v: string) =>
                                v.length > 20 ? v.slice(0, 18) + "…" : v
                              }
                            />
                            <Tooltip
                              content={<CustomBarTooltip />}
                              cursor={{ fill: hexToRgba(p, 0.06), radius: 6 }}
                            />
                            <Bar
                              dataKey="count"
                              radius={[0, 7, 7, 0]}
                              name="Destinations"
                              barSize={categoryUsageData.length > 15 ? 18 : 24}
                              onMouseEnter={(data, index) => {
                                if (data && categoryUsageData[index]) {
                                  setHoveredBar(
                                    categoryUsageData[index].categoryName,
                                  );
                                }
                              }}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              {categoryUsageData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={getBarColor(
                                    entry.categoryName,
                                    entry.color,
                                    entry.hoverColor,
                                  )}
                                  style={{ transition: "fill 0.2s ease" }}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Line chart — Images per Category with per-category colors */}
                    <div className="dpc-chart-card">
                      <div className="dpc-chart-header">
                        <div className="dpc-chart-title">
                          <span className="dpc-chart-dot dpc-chart-dot--ok" />
                          Images per Category
                        </div>
                        <span className="dpc-chart-sub">
                          {imagesCountData.length} categories
                        </span>
                      </div>
                      <div style={{ height: 340 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={imagesCountData}
                            margin={{ top: 4, right: 16, bottom: 80, left: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={hexToRgba(border, 0.8)}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="categoryName"
                              tick={{ fontSize: 11, fill: textSecondary }}
                              axisLine={false}
                              tickLine={false}
                              angle={-45}
                              textAnchor="end"
                              interval={0}
                              height={80}
                              tickFormatter={(v: string) =>
                                v.length > 15 ? v.slice(0, 12) + "…" : v
                              }
                            />
                            <YAxis
                              tick={{
                                fontSize: 11,
                                fill: textSecondary,
                                fontWeight: 500,
                              }}
                              axisLine={false}
                              tickLine={false}
                              width={36}
                            />
                            <Tooltip
                              content={<CustomLineTooltip />}
                              cursor={{
                                stroke: hexToRgba(successColor, 0.3),
                                strokeWidth: 1,
                                strokeDasharray: "4 4",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="imagesCount"
                              strokeWidth={2.5}
                              dot={(props) => {
                                const { cx, cy, payload, index } = props;
                                const isHovered =
                                  hoveredLinePoint === payload.categoryName;
                                const color = getLineColor(
                                  payload.categoryName,
                                  payload.color,
                                  payload.hoverColor,
                                );
                                const fillColor = getDotFill(
                                  payload.categoryName,
                                  payload.color,
                                  payload.hoverColor,
                                );
                                return (
                                  <circle
                                    key={`dot-${index}`}
                                    cx={cx}
                                    cy={cy}
                                    r={isHovered ? 6 : 4}
                                    fill={fillColor}
                                    stroke={surf}
                                    strokeWidth={2}
                                    onMouseEnter={() =>
                                      setHoveredLinePoint(payload.categoryName)
                                    }
                                    onMouseLeave={() =>
                                      setHoveredLinePoint(null)
                                    }
                                    style={{
                                      transition: "r 0.2s ease, fill 0.2s ease",
                                      cursor: "pointer",
                                    }}
                                  />
                                );
                              }}
                              activeDot={false}
                              name="Images"
                            >
                              {imagesCountData.map((entry, index) => (
                                <Cell
                                  key={`line-${index}`}
                                  stroke={getLineColor(
                                    entry.categoryName,
                                    entry.color,
                                    entry.hoverColor,
                                  )}
                                  style={{ transition: "stroke 0.2s ease" }}
                                />
                              ))}
                            </Line>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ── Info banner ── */}
              <section className="dpc-mt-7 dpc-fade-up dpc-delay-4">
                <div className="dpc-info-banner">
                  <div className="dpc-info-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <p className="dpc-info-title">Category Management</p>
                    <p className="dpc-info-text">
                      Destination categories help organize locations by type
                      (beaches, mountains, historical sites, etc.). Use the
                      quick-action cards above to view, create, edit, or remove
                      categories. The charts above show how many destinations
                      belong to each category and how many images are associated
                      with each category. Each category has its own color that
                      changes on hover for better visual distinction.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DestinationCategoriesPage;
