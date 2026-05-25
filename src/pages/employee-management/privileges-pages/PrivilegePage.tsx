"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { employeeManagementSideBarData } from "@/data/side-bar-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PrivilegeStatisticsData, UserActivityStats } from "@/types/privilege-types";
import { PrivilegeService } from "@/services/privilegeService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCardSkeleton } from "@/components/common-components/management-components/ActionCardSkeleton";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import {
  PRIVILEGES_MANAGEMENT_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";

/* ─────────────────────────────────────────────
   Animated Counter — eases out, starts from 0
───────────────────────────────────────────── */
const AnimatedCount = ({
  value,
  duration = 1100,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = eased * value;
      setDisplay(
        decimals ? parseFloat(current.toFixed(decimals)) : Math.round(current),
      );
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, decimals]);

  return <>{display.toLocaleString()}</>;
};

/* ─────────────────────────────────────────────
   Skeleton Card
───────────────────────────────────────────── */
const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="dp-stat-card dp-skeleton-card"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="dp-skel dp-skel--icon" />
    <div className="dp-skel dp-skel--val" />
    <div className="dp-skel dp-skel--label" />
  </div>
);

/* ─────────────────────────────────────────────
   Custom Tooltips for Area Chart
───────────────────────────────────────────── */
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dp-tooltip">
      <p className="dp-tooltip__label">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="dp-tooltip__value" style={{ color: entry.color }}>
          {entry.name}: {entry.value} privileges
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Section Header
───────────────────────────────────────────── */
const SectionHeader = ({
  title,
  subtitle,
  badge,
  live,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  live?: boolean;
}) => (
  <div className="dp-section-header">
    <div className="dp-section-header__left">
      <div className="dp-section-header__bar" />
      <div>
        <div className="dp-section-header__title-row">
          <h2 className="dp-section-header__title">{title}</h2>
          {badge && (
            <span
              className={`dp-section-badge${live ? " dp-section-badge--live" : ""}`}
            >
              {live && <span className="dp-live-dot" />}
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="dp-section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Staggered Reveal Wrapper
───────────────────────────────────────────── */
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
};

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
  if (lower.includes("remove") || lower.includes("delete"))
    return ACTION_CONFIG.remove;
  return ACTION_CONFIG.default;
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const PrivilegePage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<PrivilegeStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredData, setHoveredData] = useState<any>(null);

  const privilegesData = employeeManagementSideBarData.find(
    (item) => item.name === "Privilege Management",
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    {
      label: "Privileges",
      href: PRIVILEGES_MANAGEMENT_PAGE_URL,
    },
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await PrivilegeService.getPrivilegesStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Chart data for Area Chart ── */
  // Create a map of all unique users from all three activity types
  const getUserActivityMap = () => {
    const userMap = new Map<string, { updates: number; creates: number; terminates: number }>();

    // Add updates
    statistics?.recentlyUpdates?.forEach((item) => {
      if (!userMap.has(item.username)) {
        userMap.set(item.username, { updates: 0, creates: 0, terminates: 0 });
      }
      userMap.get(item.username)!.updates = item.count;
    });

    // Add creates
    statistics?.recentlyCreate?.forEach((item) => {
      if (!userMap.has(item.username)) {
        userMap.set(item.username, { updates: 0, creates: 0, terminates: 0 });
      }
      userMap.get(item.username)!.creates = item.count;
    });

    // Add terminates
    statistics?.recentlyTerminate?.forEach((item) => {
      if (!userMap.has(item.username)) {
        userMap.set(item.username, { updates: 0, creates: 0, terminates: 0 });
      }
      userMap.get(item.username)!.terminates = item.count;
    });

    return userMap;
  };

  // Convert map to array and sort by total activity (updates + creates + terminates)
  const getAreaChartData = () => {
    const userMap = getUserActivityMap();
    const data = Array.from(userMap.entries()).map(([username, activities]) => ({
      name: username.length > 12 ? username.slice(0, 10) + "..." : username,
      fullName: username,
      updates: activities.updates,
      creates: activities.creates,
      terminates: activities.terminates,
      total: activities.updates + activities.creates + activities.terminates,
    }));
    
    // Sort by total activity descending and take top 8 for better visualization
    return data.sort((a, b) => b.total - a.total).slice(0, 8);
  };

  const areaChartData = getAreaChartData();

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
          title: "Total",
          value: statistics.privilegeDetails.totalCount,
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
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          ),
        },
        {
          title: "Active",
          value: statistics.privilegeDetails.activeCount,
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
          value: statistics.privilegeDetails.inActiveCount,
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
          title: "Hidden",
          value: statistics.privilegeDetails.hiddenCount,
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
          value: statistics.privilegeDetails.recentlyUpdateCount,
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
          value: statistics.privilegeDetails.recentlyAddedCount,
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

  // Chart colors with gradients
  const updateColor = "#f59e0b"; // Amber
  const createColor = "#10b981"; // Emerald
  const terminateColor = "#ef4444"; // Rose/Red

  /* ──────────────────── Render ──────────────────── */
  return (
    <>
      <style>{`
        /* ── Base tokens ── */
        .dp-root {
          --p:    ${p};
          --acc:  ${acc};
          --surf: ${surf};
          --bg:   ${bg};
          --border: ${border};
          --text: ${textPrimary};
          --muted: ${textSecondary};
          --err:  ${errColor};
          --ok:   ${successColor};

          --blue-bg: #dbeafe;  --blue-fg: #1d4ed8;  --blue-mid: #3b82f6;  --blue-border: #93c5fd;
          --em-bg:   #d1fae5;  --em-fg:   #065f46;  --em-mid:   #10b981;  --em-border:   #6ee7b7;
          --am-bg:   #fef3c7;  --am-fg:   #92400e;  --am-mid:   #f59e0b;  --am-border:   #fcd34d;
          --ro-bg:   #ffe4e6;  --ro-fg:   #9f1239;  --ro-mid:   #f43f5e;  --ro-border:   #fda4af;
          --vi-bg:   #ede9fe;  --vi-fg:   #5b21b6;  --vi-mid:   #8b5cf6;  --vi-border:   #c4b5fd;
          --tl-bg:   #ccfbf1;  --tl-fg:   #134e4a;  --tl-mid:   #14b8a6;  --tl-border:   #5eead4;

          background: var(--bg);
          min-height: 100vh;
          padding-bottom: 5rem;
          transition: background 0.3s ease;
        }

        .dp-wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* ── Keyframes ── */
        @keyframes dp-shimmer {
          0%   { background-position: -700px 0; }
          100% { background-position: 700px 0; }
        }
        @keyframes dp-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dp-pulse-ring {
          0%   { box-shadow: 0 0 0 0   ${hexToRgba(p, 0.4)}; }
          70%  { box-shadow: 0 0 0 10px ${hexToRgba(p, 0)}; }
          100% { box-shadow: 0 0 0 0   ${hexToRgba(p, 0)}; }
        }
        @keyframes dp-live-blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.25; }
        }

        /* ── Loading ── */
        .dp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 55vh;
          gap: 1.5rem;
        }
        .dp-spinner-wrap {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .dp-spinner {
          width: 56px; height: 56px;
          border: 3px solid var(--border);
          border-top-color: var(--p);
          border-radius: 50%;
          animation: dp-spin .7s linear infinite;
        }
        .dp-spinner-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-spinner-center::after {
          content: '';
          width: 9px; height: 9px;
          background: var(--p);
          border-radius: 50%;
          animation: dp-pulse-ring 1.5s ease-out infinite;
        }
        .dp-loading-text {
          font-size: .875rem;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: .025em;
        }
        .dp-loading-sub {
          font-size: .75rem;
          color: var(--muted);
          opacity: .6;
          margin-top: -.75rem;
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
          min-height: 40px;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--p) 0%, var(--acc) 100%);
          flex-shrink: 0;
          align-self: stretch;
        }
        .dp-section-header__title-row {
          display: flex;
          align-items: center;
          gap: .625rem;
          flex-wrap: wrap;
        }
        .dp-section-header__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          letter-spacing: -.018em;
        }
        .dp-section-header__subtitle {
          font-size: .8125rem;
          color: var(--muted);
          margin: .2rem 0 0;
          font-weight: 400;
          line-height: 1.5;
        }
        .dp-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: .675rem;
          font-weight: 700;
          letter-spacing: .065em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
          background: ${hexToRgba(p, 0.09)};
          color: var(--p);
          border: 1px solid ${hexToRgba(p, 0.18)};
        }
        .dp-section-badge--live {
          background: ${hexToRgba(successColor, 0.09)};
          color: ${successColor};
          border-color: ${hexToRgba(successColor, 0.25)};
        }
        .dp-live-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${successColor};
          animation: dp-live-blink 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ── Action cards grid ── */
        .dp-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.125rem;
        }
        @media (max-width: 1100px) { .dp-actions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .dp-actions-grid { grid-template-columns: 1fr; } }

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
          position: relative;
          overflow: hidden;
          cursor: default;
          transition:
            transform .24s cubic-bezier(0.22,1,0.36,1),
            box-shadow .24s ease,
            border-color .22s ease;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
        }
        .dp-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,.1), 0 2px 6px rgba(15,23,42,.04);
        }

        /* Accent top stripe */
        .dp-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
          opacity: 0;
          transition: opacity .24s ease;
        }
        .dp-stat-card:hover::before { opacity: 1; }
        .dp-stat-card--blue::before    { background: var(--blue-mid); }
        .dp-stat-card--emerald::before { background: var(--em-mid); }
        .dp-stat-card--rose::before    { background: var(--ro-mid); }
        .dp-stat-card--violet::before  { background: var(--vi-mid); }
        .dp-stat-card--amber::before   { background: var(--am-mid); }
        .dp-stat-card--teal::before    { background: var(--tl-mid); }

        /* Hover border tint */
        .dp-stat-card--blue:hover    { border-color: var(--blue-border); }
        .dp-stat-card--emerald:hover { border-color: var(--em-border); }
        .dp-stat-card--rose:hover    { border-color: var(--ro-border); }
        .dp-stat-card--violet:hover  { border-color: var(--vi-border); }
        .dp-stat-card--amber:hover   { border-color: var(--am-border); }
        .dp-stat-card--teal:hover    { border-color: var(--tl-border); }

        /* Corner glow on hover */
        .dp-stat-card::after {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity .28s ease;
          pointer-events: none;
        }
        .dp-stat-card:hover::after { opacity: 1; }
        .dp-stat-card--blue::after    { background: radial-gradient(circle, ${hexToRgba("#3b82f6", 0.12)}, transparent 70%); }
        .dp-stat-card--emerald::after { background: radial-gradient(circle, ${hexToRgba("#10b981", 0.12)}, transparent 70%); }
        .dp-stat-card--rose::after    { background: radial-gradient(circle, ${hexToRgba("#f43f5e", 0.12)}, transparent 70%); }
        .dp-stat-card--violet::after  { background: radial-gradient(circle, ${hexToRgba("#8b5cf6", 0.12)}, transparent 70%); }
        .dp-stat-card--amber::after   { background: radial-gradient(circle, ${hexToRgba("#f59e0b", 0.12)}, transparent 70%); }
        .dp-stat-card--teal::after    { background: radial-gradient(circle, ${hexToRgba("#14b8a6", 0.12)}, transparent 70%); }

        .dp-stat-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform .22s cubic-bezier(0.22,1,0.36,1);
        }
        .dp-stat-card:hover .dp-stat-icon { transform: scale(1.1); }
        .dp-stat-icon svg { width: 20px; height: 20px; }
        .dp-stat-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dp-stat-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dp-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dp-stat-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }
        .dp-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-stat-icon--teal    { background: var(--tl-bg);   color: var(--tl-fg); }

        .dp-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.04em;
          position: relative;
          z-index: 1;
        }
        .dp-stat-label {
          font-size: .7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .065em;
          position: relative;
          z-index: 1;
        }

        /* ── Skeleton ── */
        .dp-skeleton-card { pointer-events: none !important; }
        .dp-skel {
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            var(--border) 25%,
            ${isDarkMode ? hexToRgba(surf, 0.6) : "#f8fafc"} 50%,
            var(--border) 75%
          );
          background-size: 700px 100%;
          animation: dp-shimmer 1.5s infinite;
        }
        .dp-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
        .dp-skel--val    { width: 55%; height: 28px; margin-top: .625rem; border-radius: 7px; }
        .dp-skel--label  { width: 80%; height: 10px; border-radius: 5px; }

        /* ── Charts ── */
        .dp-charts-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .dp-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.625rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
          transition: box-shadow .22s ease;
        }
        .dp-chart-card:hover { box-shadow: 0 6px 18px rgba(15,23,42,.07); }

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
          letter-spacing: -.012em;
        }
        .dp-chart-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dp-chart-dot--p  { background: var(--p); }
        .dp-chart-dot--ok { background: var(--ok); }
        .dp-chart-sub {
          font-size: .75rem;
          color: var(--muted);
          font-weight: 600;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        /* ── Activity Legend ── */
        .dp-activity-legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.125rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .dp-activity-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: .8125rem;
          color: var(--muted);
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
          padding: 4px 8px;
          border-radius: 8px;
        }
        .dp-activity-legend-item:hover {
          background: ${hexToRgba(p, 0.05)};
        }
        .dp-activity-legend-dot {
          width: 10px; height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .dp-activity-legend-dot--updates { background: ${updateColor}; }
        .dp-activity-legend-dot--creates { background: ${createColor}; }
        .dp-activity-legend-dot--terminates { background: ${terminateColor}; }
        .dp-activity-legend-count {
          font-weight: 700;
          color: var(--text);
          margin-left: 2px;
        }

        /* ── Interactive Stats Card ── */
        .dp-interactive-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .dp-interactive-card {
          background: ${hexToRgba(p, 0.04)};
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .dp-interactive-card:hover {
          transform: translateY(-2px);
          border-color: var(--p);
          background: ${hexToRgba(p, 0.08)};
        }
        .dp-interactive-card--active {
          border-color: var(--p);
          background: ${hexToRgba(p, 0.12)};
          box-shadow: 0 4px 12px ${hexToRgba(p, 0.15)};
        }
        .dp-interactive-card__label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }
        .dp-interactive-card__value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text);
        }

        /* ── Tooltip ── */
        .dp-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .dp-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 4px;
        }
        .dp-tooltip__value {
          font-size: .875rem;
          color: #f8fafc;
          font-weight: 600;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dp-tooltip__value-bullet {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }

        /* ── Error banner ── */
        .dp-error-banner {
          background: ${hexToRgba(errColor, 0.05)};
          border: 1.5px solid ${hexToRgba(errColor, 0.22)};
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
          white-space: nowrap;
          letter-spacing: .01em;
          transition: opacity .15s, transform .12s;
        }
        .dp-retry-btn:hover   { opacity: .88; }
        .dp-retry-btn:active  { transform: scale(.97); }

        /* ── Info banner ── */
        .dp-info-banner {
          background: linear-gradient(135deg,
            ${hexToRgba(p, 0.04)} 0%,
            ${hexToRgba(acc, 0.06)} 100%);
          border: 1.5px solid ${hexToRgba(p, 0.14)};
          border-radius: 16px;
          padding: 1.375rem 1.625rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .dp-info-icon {
          width: 40px; height: 40px;
          background: ${hexToRgba(p, 0.09)};
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--p);
          flex-shrink: 0;
          transition: transform .22s ease;
        }
        .dp-info-banner:hover .dp-info-icon { transform: scale(1.08) rotate(-4deg); }
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

        /* ── Spacing utils ── */
        .dp-mt-6 { margin-top: 1.5rem; }
        .dp-mt-7 { margin-top: 1.875rem; }
        .dp-mt-8 { margin-top: 2.5rem; }
      `}</style>

      <div className="dp-root">
        <div>
          <Reveal delay={0}>
            <div
              className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${theme.surface}D9`,
                borderColor: theme.border,
              }}
            >
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <PageHeader
                  title="Privileges"
                  description="Manage and monitor user privilege settings"
                  breadcrumbItems={breadcrumbItems}
                />
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="dp-loading">
              <div className="dp-spinner-wrap">
                <div className="dp-spinner" />
                <div className="dp-spinner-center" />
              </div>
              <span className="dp-loading-text">Loading privilege data…</span>
              <span className="dp-loading-sub">
                Fetching statistics from the server
              </span>
            </div>
          ) : (
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* ── Quick Actions ── */}
              <Reveal delay={60}>
                <section>
                  <SectionHeader
                    title="Quick Actions"
                    subtitle="Jump directly to any privilege management task"
                    badge={`${privilegesData?.subData.length ?? 0} actions`}
                  />
                  <div className="dp-actions-grid">
                    {loading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <ActionCardSkeleton
                            key={i}
                            delay={i * 0.07}
                            theme={theme}
                            isDarkMode={isDarkMode}
                          />
                        ))
                      : privilegesData?.subData.map((action, idx) => {
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
              </Reveal>

              {/* ── Error ── */}
              {error && (
                <Reveal delay={0}>
                  <div className="dp-mt-6">
                    <div className="dp-error-banner">
                      <div className="dp-error-banner__left">
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
                      <button
                        className="dp-retry-btn"
                        onClick={fetchStatistics}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* ── Statistics ── */}
              {!error && (
                <Reveal delay={120}>
                  <section className="dp-mt-8">
                    <SectionHeader
                      title="Privilege Statistics"
                      subtitle="Live counts across all privilege records"
                      badge="Live"
                      live
                    />
                    <div className="dp-stats-grid">
                      {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <StatCardSkeleton key={i} delay={i * 0.06} />
                          ))
                        : statCards.map((card, i) => (
                            <div
                              key={i}
                              className={`dp-stat-card dp-stat-card--${card.accent}`}
                            >
                              <div
                                className={`dp-stat-icon dp-stat-icon--${card.accent}`}
                              >
                                {card.icon}
                              </div>
                              <div className="dp-stat-value">
                                <AnimatedCount
                                  value={card.value}
                                  duration={950 + i * 70}
                                />
                              </div>
                              <div className="dp-stat-label">{card.title}</div>
                            </div>
                          ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* ── Charts ── */}
              {!error && statistics && (
                <Reveal delay={180}>
                  <section className="dp-mt-8">
                    <SectionHeader
                      title="Analytics Overview"
                      subtitle="Interactive area chart showing user activity trends across privilege operations"
                    />
                    <div className="dp-charts-row">
                      {/* Area Chart — User Activity */}
                      <div className="dp-chart-card">
                        <div className="dp-chart-header">
                          <div className="dp-chart-title">
                            <span className="dp-chart-dot dp-chart-dot--p" />
                            User Privilege Activity Trends
                          </div>
                          <span className="dp-chart-sub">
                            Top {areaChartData.length} users by activity
                          </span>
                        </div>
                        {areaChartData.length > 0 ? (
                          <>
                            <div style={{ height: 400 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={areaChartData}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                  }}
                                >
                                  <defs>
                                    <linearGradient id="gradientUpdates" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={updateColor} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={updateColor} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="gradientCreates" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={createColor} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={createColor} stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="gradientTerminates" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={terminateColor} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={terminateColor} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={hexToRgba(border, 0.8)}
                                    vertical={false}
                                  />
                                  <XAxis
                                    dataKey="name"
                                    tick={{
                                      fontSize: 11,
                                      fill: textSecondary,
                                      fontWeight: 500,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}
                                  />
                                  <YAxis
                                    tick={{ fontSize: 11, fill: textSecondary }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={40}
                                    label={{
                                      value: "Number of Privileges",
                                      angle: -90,
                                      position: "insideLeft",
                                      style: {
                                        fontSize: 11,
                                        fill: textSecondary,
                                        fontWeight: 500,
                                      },
                                      offset: -5,
                                    }}
                                  />
                                  <Tooltip content={<CustomAreaTooltip />} />
                                  <Legend
                                    wrapperStyle={{
                                      paddingTop: 16,
                                      fontSize: 12,
                                    }}
                                    iconType="circle"
                                    formatter={(value) => (
                                      <span style={{ color: textSecondary, fontWeight: 500 }}>
                                        {value}
                                      </span>
                                    )}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="updates"
                                    name="Updates"
                                    stroke={updateColor}
                                    strokeWidth={2.5}
                                    fill="url(#gradientUpdates)"
                                    animationBegin={300}
                                    animationDuration={900}
                                    animationEasing="ease-out"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="creates"
                                    name="Creations"
                                    stroke={createColor}
                                    strokeWidth={2.5}
                                    fill="url(#gradientCreates)"
                                    animationBegin={400}
                                    animationDuration={900}
                                    animationEasing="ease-out"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="terminates"
                                    name="Terminations"
                                    stroke={terminateColor}
                                    strokeWidth={2.5}
                                    fill="url(#gradientTerminates)"
                                    animationBegin={500}
                                    animationDuration={900}
                                    animationEasing="ease-out"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="dp-activity-legend">
                              <div className="dp-activity-legend-item">
                                <span className="dp-activity-legend-dot dp-activity-legend-dot--updates" />
                                Updates
                                <span className="dp-activity-legend-count">
                                  {areaChartData.reduce((sum, d) => sum + d.updates, 0)}
                                </span>
                              </div>
                              <div className="dp-activity-legend-item">
                                <span className="dp-activity-legend-dot dp-activity-legend-dot--creates" />
                                Creations
                                <span className="dp-activity-legend-count">
                                  {areaChartData.reduce((sum, d) => sum + d.creates, 0)}
                                </span>
                              </div>
                              <div className="dp-activity-legend-item">
                                <span className="dp-activity-legend-dot dp-activity-legend-dot--terminates" />
                                Terminations
                                <span className="dp-activity-legend-count">
                                  {areaChartData.reduce((sum, d) => sum + d.terminates, 0)}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex items-center justify-center"
                            style={{ height: 400, color: textSecondary }}
                          >
                            No activity data available
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>
              )}

              {/* ── Info banner ── */}
              <Reveal delay={240}>
                <section className="dp-mt-7">
                  <div className="dp-info-banner">
                    <div className="dp-info-icon">
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
                      <p className="dp-info-title">Privilege Management</p>
                      <p className="dp-info-text">
                        Use the quick-action cards above to browse, create,
                        edit, or remove privileges. The interactive area chart
                        shows trends across updates, creations, and terminations
                        for top active users. Hover over any point for detailed
                        information. Statistics reflect the latest data from
                        your backend and update each time you visit this page.
                      </p>
                    </div>
                  </div>
                </section>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PrivilegePage;