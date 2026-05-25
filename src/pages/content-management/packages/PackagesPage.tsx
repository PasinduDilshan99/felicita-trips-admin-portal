"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Scatter,
  ZAxis,
} from "recharts";
import { PackageStatisticsData } from "@/types/package-types";
import { PackageService } from "@/services/packageService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCardSkeleton } from "@/components/common-components/management-components/ActionCardSkeleton";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";

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
   Skeleton Components
───────────────────────────────────────────── */
const StatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="ap-stat-card ap-skeleton-card"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="ap-skel ap-skel--icon" />
    <div className="ap-skel ap-skel--val" />
    <div className="ap-skel ap-skel--label" />
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
  const data = payload[0]?.payload;
  return (
    <div className="ap-tooltip">
      <p className="ap-tooltip__label">{label}</p>
      <p className="ap-tooltip__value">
        {payload[0].value.toLocaleString()} participants
      </p>
      {data?.totalSchedules && (
        <p className="ap-tooltip__sub">Schedules: {data.totalSchedules}</p>
      )}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ap-tooltip">
      <p className="ap-tooltip__label">{payload[0].name}</p>
      <p className="ap-tooltip__value">
        {payload[0].value.toLocaleString()} packages
      </p>
    </div>
  );
};

const CustomComboTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ap-tooltip">
      <p className="ap-tooltip__label">{label}</p>
      <p className="ap-tooltip__value">
        Rating: {payload[0]?.value?.toFixed(1) || 0} / 5.0
      </p>
      {payload[1] && (
        <p className="ap-tooltip__sub">
          Reviews: {payload[1]?.value?.toLocaleString() || 0}
        </p>
      )}
    </div>
  );
};

const CustomPriceTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="ap-tooltip">
      <p className="ap-tooltip__label">{label}</p>
      <p className="ap-tooltip__value">
        Total Price: ${data.totalPrice?.toLocaleString()}
      </p>
      <p className="ap-tooltip__sub">
        Price/Person: ${data.pricePerPerson?.toLocaleString()}
      </p>
      <p className="ap-tooltip__sub">
        Participants: {data.totalParticipants?.toLocaleString()}
      </p>
    </div>
  );
};

const CustomCapacityTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  const utilizationRate =
    ((data.averageParticipants - data.minPersonCount) /
      (data.maxPersonCount - data.minPersonCount)) *
    100;
  return (
    <div className="ap-tooltip">
      <p className="ap-tooltip__label">{label}</p>
      <p className="ap-tooltip__value">
        Capacity: {data.minPersonCount} - {data.maxPersonCount} persons
      </p>
      <p className="ap-tooltip__sub">
        Average: {data.averageParticipants.toLocaleString()} participants
      </p>
      <p className="ap-tooltip__sub">
        Utilization: {utilizationRate.toFixed(1)}%
      </p>
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
  <div className="ap-section-header">
    <div className="ap-section-header__left">
      <div className="ap-section-header__bar" />
      <div>
        <div className="ap-section-header__title-row">
          <h2 className="ap-section-header__title">{title}</h2>
          {badge && (
            <span
              className={`ap-section-badge${live ? " ap-section-badge--live" : ""}`}
            >
              {live && <span className="ap-live-dot" />}
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="ap-section-header__subtitle">{subtitle}</p>}
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
   Gauge Chart Component for Capacity Utilization
───────────────────────────────────────────── */
const CapacityGauge = ({
  packageName,
  minCapacity,
  maxCapacity,
  averageParticipants,
}: {
  packageName: string;
  minCapacity: number;
  maxCapacity: number;
  averageParticipants: number;
}) => {
  const { theme } = useTheme();
  const p = theme.primary ?? "#0D4E4A";
  const utilization =
    ((averageParticipants - minCapacity) / (maxCapacity - minCapacity)) * 100;
  const clampedUtilization = Math.min(Math.max(utilization, 0), 100);

  // Determine color based on utilization
  const getGaugeColor = () => {
    if (clampedUtilization >= 70) return "#10b981";
    if (clampedUtilization >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const angle = (clampedUtilization / 100) * 180;
  const strokeDasharray = `${angle}, 180`;

  return (
    <div className="ap-gauge-container">
      <div className="ap-gauge-title">{packageName}</div>
      <div className="ap-gauge-chart">
        <svg viewBox="0 0 200 120" className="ap-gauge-svg">
          <path
            d="M20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getGaugeColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={getGaugeColor()}
          >
            {Math.round(clampedUtilization)}%
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            Utilization
          </text>
        </svg>
      </div>
      <div className="ap-gauge-stats">
        <div className="ap-gauge-stat">
          <span className="ap-gauge-stat-label">Min:</span>
          <span className="ap-gauge-stat-value">{minCapacity}</span>
        </div>
        <div className="ap-gauge-stat">
          <span className="ap-gauge-stat-label">Avg:</span>
          <span className="ap-gauge-stat-value">{averageParticipants}</span>
        </div>
        <div className="ap-gauge-stat">
          <span className="ap-gauge-stat-label">Max:</span>
          <span className="ap-gauge-stat-value">{maxCapacity}</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const PackagesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<PackageStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const packagesData = webManagementSideBarData.find(
    (item) => item.name === "Packages",
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Packages", href: WEB_MANAGEMENT_PACKAGES_PATH },
  ];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await PackageService.getPackageStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the package statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const barChartData = statistics?.packagePopularities || [];
  const pieChartData = statistics?.packageTypeDistributions || [];
  const comboData = statistics?.packageRatingOverviews || [];
  const priceData = statistics?.packagePriceDistributions || [];
  const capacityData = statistics?.packageCapacityUtilizations || [];

  /* Chart Colors */
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#FDA4AF",
    "#60A5FA",
    "#FBBF24",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#2DD4BF",
  ];

  /* KPI Summary Cards */
  type StatCard = {
    title: string;
    value: number;
    icon: JSX.Element;
    accent: string;
    prefix?: string;
    suffix?: string;
  };

  const statCards: StatCard[] = statistics
    ? [
        {
          title: "Total Packages",
          value: statistics.summary.totalPackages,
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
              <path d="M4 4h16v16H4z" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
              <path d="M9 16h4" />
            </svg>
          ),
        },
        {
          title: "Active Packages",
          value: statistics.summary.activePackages,
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
          title: "Total Participants",
          value: statistics.summary.totalParticipants,
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
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          ),
        },
        {
          title: "Avg Package Rating",
          value: statistics.summary.averagePackageRating,
          accent: "violet",
          suffix: "/5.0",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
        {
          title: "Avg Package Price",
          value: statistics.summary.averagePackagePrice,
          accent: "rose",
          prefix: "$",
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
              <path d="M12 6v2M12 16v2" />
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

  /* ──────────────────── Render ──────────────────── */
  return (
    <>
      <style>{`
        /* ── Base tokens ── */
        .ap-root {
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
          --vi-bg:   #ede9fe;  --vi-fg:   #5b21b6;  --vi-mid:   #8b5cf6;  --vi-border:   #c4b5fd;
          --ro-bg:   #ffe4e6;  --ro-fg:   #9f1239;  --ro-mid:   #f43f5e;  --ro-border:   #fda4af;

          background: var(--bg);
          min-height: 100vh;
          padding-bottom: 5rem;
          transition: background 0.3s ease;
        }

        /* ── Keyframes ── */
        @keyframes ap-shimmer {
          0%   { background-position: -700px 0; }
          100% { background-position: 700px 0; }
        }
        @keyframes ap-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ap-pulse-ring {
          0%   { box-shadow: 0 0 0 0   ${hexToRgba(p, 0.4)}; }
          70%  { box-shadow: 0 0 0 10px ${hexToRgba(p, 0)}; }
          100% { box-shadow: 0 0 0 0   ${hexToRgba(p, 0)}; }
        }
        @keyframes ap-live-blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.25; }
        }

        /* ── Loading ── */
        .ap-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 55vh;
          gap: 1.5rem;
        }
        .ap-spinner-wrap {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .ap-spinner {
          width: 56px; height: 56px;
          border: 3px solid var(--border);
          border-top-color: var(--p);
          border-radius: 50%;
          animation: ap-spin .7s linear infinite;
        }
        .ap-spinner-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ap-spinner-center::after {
          content: '';
          width: 9px; height: 9px;
          background: var(--p);
          border-radius: 50%;
          animation: ap-pulse-ring 1.5s ease-out infinite;
        }
        .ap-loading-text {
          font-size: .875rem;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: .025em;
        }
        .ap-loading-sub {
          font-size: .75rem;
          color: var(--muted);
          opacity: .6;
          margin-top: -.75rem;
        }

        /* ── Section header ── */
        .ap-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.125rem;
        }
        .ap-section-header__left {
          display: flex;
          align-items: flex-start;
          gap: .875rem;
        }
        .ap-section-header__bar {
          width: 4px;
          min-height: 40px;
          border-radius: 2px;
          background: linear-gradient(180deg, var(--p) 0%, var(--acc) 100%);
          flex-shrink: 0;
          align-self: stretch;
        }
        .ap-section-header__title-row {
          display: flex;
          align-items: center;
          gap: .625rem;
          flex-wrap: wrap;
        }
        .ap-section-header__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          letter-spacing: -.018em;
        }
        .ap-section-header__subtitle {
          font-size: .8125rem;
          color: var(--muted);
          margin: .2rem 0 0;
          font-weight: 400;
          line-height: 1.5;
        }
        .ap-section-badge {
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
        .ap-section-badge--live {
          background: ${hexToRgba(successColor, 0.09)};
          color: ${successColor};
          border-color: ${hexToRgba(successColor, 0.25)};
        }
        .ap-live-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: ${successColor};
          animation: ap-live-blink 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ── Action cards grid ── */
        .ap-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.125rem;
        }
        @media (max-width: 1100px) { .ap-actions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .ap-actions-grid { grid-template-columns: 1fr; } }

        /* ── Stat cards ── */
        .ap-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .ap-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .ap-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .ap-stats-grid { grid-template-columns: 1fr; } }

        .ap-stat-card {
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
        .ap-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,.1);
        }

        .ap-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 14px 14px 0 0;
          opacity: 0;
          transition: opacity .24s ease;
        }
        .ap-stat-card:hover::before { opacity: 1; }
        .ap-stat-card--blue::before    { background: var(--blue-mid); }
        .ap-stat-card--emerald::before { background: var(--em-mid); }
        .ap-stat-card--amber::before   { background: var(--am-mid); }
        .ap-stat-card--violet::before  { background: var(--vi-mid); }
        .ap-stat-card--rose::before    { background: var(--ro-mid); }

        .ap-stat-card--blue:hover    { border-color: var(--blue-border); }
        .ap-stat-card--emerald:hover { border-color: var(--em-border); }
        .ap-stat-card--amber:hover   { border-color: var(--am-border); }
        .ap-stat-card--violet:hover  { border-color: var(--vi-border); }
        .ap-stat-card--rose:hover    { border-color: var(--ro-border); }

        .ap-stat-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform .22s cubic-bezier(0.22,1,0.36,1);
        }
        .ap-stat-card:hover .ap-stat-icon { transform: scale(1.1); }
        .ap-stat-icon svg { width: 20px; height: 20px; }
        .ap-stat-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .ap-stat-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .ap-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .ap-stat-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }
        .ap-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }

        .ap-stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.04em;
          position: relative;
          z-index: 1;
        }
        .ap-stat-label {
          font-size: .7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .065em;
          position: relative;
          z-index: 1;
        }
        .ap-stat-prefix {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--muted);
          margin-right: 2px;
        }
        .ap-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
        }

        /* ── Skeleton ── */
        .ap-skeleton-card { pointer-events: none !important; }
        .ap-skel {
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            var(--border) 25%,
            ${isDarkMode ? hexToRgba(surf, 0.6) : "#f8fafc"} 50%,
            var(--border) 75%
          );
          background-size: 700px 100%;
          animation: ap-shimmer 1.5s infinite;
        }
        .ap-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
        .ap-skel--val    { width: 55%; height: 28px; margin-top: .625rem; border-radius: 7px; }
        .ap-skel--label  { width: 80%; height: 10px; border-radius: 5px; }

        /* ── Charts Grid ── */
        .ap-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .ap-charts-grid { grid-template-columns: 1fr; }
        }

        .ap-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.625rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
          transition: box-shadow .22s ease;
        }
        .ap-chart-card:hover { box-shadow: 0 6px 18px rgba(15,23,42,.07); }

        .ap-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.375rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ap-chart-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .9375rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -.012em;
        }
        .ap-chart-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ap-chart-dot--p  { background: var(--p); }
        .ap-chart-dot--acc { background: var(--acc); }
        .ap-chart-sub {
          font-size: .75rem;
          color: var(--muted);
          font-weight: 600;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        .ap-pie-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.125rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .ap-pie-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: .8125rem;
          color: var(--muted);
          font-weight: 500;
        }
        .ap-pie-legend-dot {
          width: 10px; height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .ap-pie-legend-count {
          font-weight: 700;
          color: var(--text);
          margin-left: 2px;
        }

        /* ── Gauge Chart Styles ── */
        .ap-capacity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .ap-gauge-container {
          background: var(--bg);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ap-gauge-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .ap-gauge-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-gauge-chart {
          display: flex;
          justify-content: center;
        }
        .ap-gauge-svg {
          width: 100%;
          max-width: 200px;
          height: auto;
        }
        .ap-gauge-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .ap-gauge-stat {
          display: flex;
          gap: 0.25rem;
          font-size: 0.7rem;
        }
        .ap-gauge-stat-label {
          color: var(--muted);
        }
        .ap-gauge-stat-value {
          font-weight: 600;
          color: var(--text);
        }

        /* ── Tooltip ── */
        .ap-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 9px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .ap-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .ap-tooltip__value {
          font-size: .9375rem;
          color: #f8fafc;
          font-weight: 700;
        }
        .ap-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }

        /* ── Error banner ── */
        .ap-error-banner {
          background: ${hexToRgba(errColor, 0.05)};
          border: 1.5px solid ${hexToRgba(errColor, 0.22)};
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .ap-error-banner__left {
          display: flex;
          align-items: center;
          gap: .75rem;
          color: var(--err);
          font-size: .875rem;
          font-weight: 600;
        }
        .ap-error-banner__left svg { width: 20px; height: 20px; flex-shrink: 0; }
        .ap-retry-btn {
          background: var(--err);
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: .5rem 1.125rem;
          font-size: .8125rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity .15s, transform .12s;
        }
        .ap-retry-btn:hover   { opacity: .88; }
        .ap-retry-btn:active  { transform: scale(.97); }

        /* ── Empty state ── */
        .ap-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .ap-empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          color: var(--muted);
          opacity: 0.5;
        }
        .ap-empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .ap-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        /* ── Info banner ── */
        .ap-info-banner {
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
        .ap-info-icon {
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
        .ap-info-banner:hover .ap-info-icon { transform: scale(1.08) rotate(-4deg); }
        .ap-info-icon svg { width: 18px; height: 18px; }
        .ap-info-title {
          font-size: .875rem;
          font-weight: 700;
          color: var(--p);
          margin-bottom: .25rem;
          letter-spacing: -.01em;
        }
        .ap-info-text {
          font-size: .8125rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Spacing ── */
        .ap-mt-6 { margin-top: 1.5rem; }
        .ap-mt-7 { margin-top: 1.875rem; }
        .ap-mt-8 { margin-top: 2.5rem; }
      `}</style>

      <div className="ap-root">
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
                  title="Packages"
                  description="Manage and analyze travel package performance"
                  breadcrumbItems={breadcrumbItems}
                />
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="ap-loading">
              <div className="ap-spinner-wrap">
                <div className="ap-spinner" />
                <div className="ap-spinner-center" />
              </div>
              <span className="ap-loading-text">Loading package data…</span>
              <span className="ap-loading-sub">
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
                    subtitle="Jump directly to any package management task"
                    badge={`${packagesData?.subData.length ?? 0} actions`}
                  />
                  <div className="ap-actions-grid">
                    {loading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <ActionCardSkeleton
                            key={i}
                            delay={i * 0.07}
                            theme={theme}
                            isDarkMode={isDarkMode}
                          />
                        ))
                      : packagesData?.subData.map((action, idx) => {
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

              {/* ── Error State ── */}
              {error && (
                <Reveal delay={0}>
                  <div className="ap-mt-6">
                    <div className="ap-error-banner">
                      <div className="ap-error-banner__left">
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
                        className="ap-retry-btn"
                        onClick={fetchStatistics}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* ── KPI Summary Cards ── */}
              {!error && (
                <Reveal delay={120}>
                  <section className="ap-mt-8">
                    <SectionHeader
                      title="Package Overview"
                      subtitle="Key metrics and performance indicators"
                      badge="Live"
                      live
                    />
                    <div className="ap-stats-grid">
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <StatCardSkeleton key={i} delay={i * 0.06} />
                          ))
                        : statCards.map((card, i) => (
                            <div
                              key={i}
                              className={`ap-stat-card ap-stat-card--${card.accent}`}
                            >
                              <div
                                className={`ap-stat-icon ap-stat-icon--${card.accent}`}
                              >
                                {card.icon}
                              </div>
                              <div className="ap-stat-value">
                                {card.title === "Avg Package Price" &&
                                  card.prefix && (
                                    <span className="ap-stat-prefix">
                                      {card.prefix}
                                    </span>
                                  )}
                                {card.title === "Avg Package Rating" ? (
                                  <>
                                    <AnimatedCount
                                      value={card.value}
                                      duration={950 + i * 70}
                                      decimals={1}
                                    />
                                    <span className="ap-stat-suffix">
                                      {card.suffix}
                                    </span>
                                  </>
                                ) : card.title === "Avg Package Price" ? (
                                  <>
                                    <AnimatedCount
                                      value={card.value}
                                      duration={950 + i * 70}
                                      decimals={0}
                                    />
                                    <span className="ap-stat-suffix">
                                      {card.suffix}
                                    </span>
                                  </>
                                ) : (
                                  <AnimatedCount
                                    value={card.value}
                                    duration={950 + i * 70}
                                  />
                                )}
                              </div>
                              <div className="ap-stat-label">{card.title}</div>
                            </div>
                          ))}
                    </div>
                  </section>
                </Reveal>
              )}

              {/* ── Charts Section ── */}
              {!error && statistics && (
                <>
                  {/* Row 1: Bar Chart (Package Popularity) + Pie Chart (Type Distribution) */}
                  <Reveal delay={180}>
                    <section className="ap-mt-8">
                      <SectionHeader
                        title="Popularity & Distribution"
                        subtitle="Package popularity and type distribution"
                      />
                      <div className="ap-charts-grid">
                        {/* Bar Chart - Package Popularity */}
                        <div className="ap-chart-card">
                          <div className="ap-chart-header">
                            <div className="ap-chart-title">
                              <span className="ap-chart-dot ap-chart-dot--p" />
                              Package Popularity
                            </div>
                            <span className="ap-chart-sub">
                              By participant count
                            </span>
                          </div>
                          {barChartData.length > 0 ? (
                            <div style={{ height: 320 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={barChartData}
                                  layout="vertical"
                                  margin={{
                                    top: 4,
                                    right: 30,
                                    bottom: 4,
                                    left: 120,
                                  }}
                                  barSize={28}
                                >
                                  <defs>
                                    <linearGradient
                                      id="popularityGrad"
                                      x1="0"
                                      y1="0"
                                      x2="1"
                                      y2="0"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor={p}
                                        stopOpacity={0.9}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor={p}
                                        stopOpacity={0.6}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={hexToRgba(border, 0.8)}
                                    horizontal={false}
                                  />
                                  <XAxis
                                    type="number"
                                    tick={{ fontSize: 11, fill: textSecondary }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                      value.toLocaleString()
                                    }
                                  />
                                  <YAxis
                                    type="category"
                                    dataKey="packageName"
                                    tick={{
                                      fontSize: 11,
                                      fill: textSecondary,
                                      fontWeight: 500,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={115}
                                  />
                                  <Tooltip content={<CustomBarTooltip />} />
                                  <Bar
                                    dataKey="totalParticipants"
                                    fill="url(#popularityGrad)"
                                    radius={[0, 6, 6, 0]}
                                    name="Participants"
                                    animationBegin={300}
                                    animationDuration={900}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="ap-empty-state">
                              <p className="ap-empty-text">
                                No popularity data available
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pie Chart - Package Type Distribution */}
                        <div className="ap-chart-card">
                          <div className="ap-chart-header">
                            <div className="ap-chart-title">
                              <span className="ap-chart-dot ap-chart-dot--acc" />
                              Package Type Distribution
                            </div>
                            <span className="ap-chart-sub">
                              {pieChartData.length} types
                            </span>
                          </div>
                          {pieChartData.length > 0 ? (
                            <>
                              <div style={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <defs>
                                      {PIE_COLORS.map((color, idx) => (
                                        <linearGradient
                                          key={`grad-${idx}`}
                                          id={`pieGrad-${idx}`}
                                          x1="0"
                                          y1="0"
                                          x2="1"
                                          y2="1"
                                        >
                                          <stop
                                            offset="0%"
                                            stopColor={color}
                                            stopOpacity={0.9}
                                          />
                                          <stop
                                            offset="100%"
                                            stopColor={color}
                                            stopOpacity={0.7}
                                          />
                                        </linearGradient>
                                      ))}
                                    </defs>
                                    <Pie
                                      data={pieChartData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={55}
                                      outerRadius={95}
                                      paddingAngle={3}
                                      dataKey="totalPackages"
                                      nameKey="packageTypeName"
                                      animationBegin={200}
                                      animationDuration={900}
                                    >
                                      {pieChartData.map((_, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                          stroke={surf}
                                          strokeWidth={2}
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="ap-pie-legend">
                                {pieChartData.map((item, i) => (
                                  <div key={i} className="ap-pie-legend-item">
                                    <span
                                      className="ap-pie-legend-dot"
                                      style={{
                                        background:
                                          PIE_COLORS[i % PIE_COLORS.length],
                                      }}
                                    />
                                    {item.packageTypeName}
                                    <span className="ap-pie-legend-count">
                                      {item.totalPackages.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="ap-empty-state">
                              <p className="ap-empty-text">
                                No type distribution data available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </Reveal>

                  {/* Row 2: Combo Chart (Rating Overview) + Column Chart (Price Distribution) */}
                  <Reveal delay={240}>
                    <section className="ap-mt-7">
                      <SectionHeader
                        title="Quality & Pricing Analysis"
                        subtitle="Rating overview and price distribution"
                      />
                      <div className="ap-charts-grid">
                        {/* Combo Chart - Package Rating Overview */}
                        <div className="ap-chart-card">
                          <div className="ap-chart-header">
                            <div className="ap-chart-title">
                              <span className="ap-chart-dot ap-chart-dot--p" />
                              Package Ratings
                            </div>
                            <span className="ap-chart-sub">
                              Average rating & review count
                            </span>
                          </div>
                          {comboData.length > 0 ? (
                            <div style={{ height: 320 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                  data={comboData}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    bottom: 60,
                                    left: 0,
                                  }}
                                >
                                  <defs>
                                    <linearGradient
                                      id="ratingGrad"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor={p}
                                        stopOpacity={0.9}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor={p}
                                        stopOpacity={0.4}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={hexToRgba(border, 0.8)}
                                  />
                                  <XAxis
                                    dataKey="packageName"
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
                                    yAxisId="left"
                                    domain={[0, 5]}
                                    tick={{ fontSize: 11, fill: textSecondary }}
                                    axisLine={false}
                                    tickLine={false}
                                    label={{
                                      value: "Rating",
                                      angle: -90,
                                      position: "insideLeft",
                                      style: {
                                        fill: textSecondary,
                                        fontSize: 11,
                                      },
                                    }}
                                  />
                                  <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 11, fill: textSecondary }}
                                    axisLine={false}
                                    tickLine={false}
                                    label={{
                                      value: "Reviews",
                                      angle: 90,
                                      position: "insideRight",
                                      style: {
                                        fill: textSecondary,
                                        fontSize: 11,
                                      },
                                    }}
                                  />
                                  <Tooltip content={<CustomComboTooltip />} />
                                  <Legend verticalAlign="top" height={36} />
                                  <Bar
                                    yAxisId="left"
                                    dataKey="averageRating"
                                    fill="url(#ratingGrad)"
                                    radius={[7, 7, 0, 0]}
                                    name="Average Rating"
                                    barSize={30}
                                    animationBegin={300}
                                    animationDuration={900}
                                  />
                                  <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="totalReviews"
                                    stroke={successColor}
                                    strokeWidth={2.5}
                                    dot={{ fill: successColor, r: 4 }}
                                    name="Total Reviews"
                                    animationBegin={400}
                                    animationDuration={900}
                                  />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="ap-empty-state">
                              <p className="ap-empty-text">
                                No rating data available
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Column Chart - Price Distribution */}
                        <div className="ap-chart-card">
                          <div className="ap-chart-header">
                            <div className="ap-chart-title">
                              <span className="ap-chart-dot ap-chart-dot--acc" />
                              Price Distribution
                            </div>
                            <span className="ap-chart-sub">
                              Total package price
                            </span>
                          </div>
                          {priceData.length > 0 ? (
                            <div style={{ height: 320 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={priceData}
                                  margin={{
                                    top: 4,
                                    right: 4,
                                    bottom: 60,
                                    left: 0,
                                  }}
                                >
                                  <defs>
                                    <linearGradient
                                      id="priceGrad"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor={p}
                                        stopOpacity={0.9}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor={p}
                                        stopOpacity={0.6}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={hexToRgba(border, 0.8)}
                                    vertical={false}
                                  />
                                  <XAxis
                                    dataKey="packageName"
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
                                    width={45}
                                    tickFormatter={(value) =>
                                      `$${value.toLocaleString()}`
                                    }
                                  />
                                  <Tooltip content={<CustomPriceTooltip />} />
                                  <Bar
                                    dataKey="totalPrice"
                                    fill="url(#priceGrad)"
                                    radius={[7, 7, 0, 0]}
                                    name="Total Price"
                                    animationBegin={300}
                                    animationDuration={900}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="ap-empty-state">
                              <p className="ap-empty-text">
                                No price data available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </Reveal>

                  {/* Row 3: Gauge/Stacked Bar - Capacity Utilization */}
                  <Reveal delay={300}>
                    <section className="ap-mt-7">
                      <SectionHeader
                        title="Capacity Utilization"
                        subtitle="Package capacity and utilization rates"
                      />
                      <div className="ap-chart-card">
                        <div className="ap-chart-header">
                          <div className="ap-chart-title">
                            <span className="ap-chart-dot ap-chart-dot--p" />
                            Capacity Analysis
                          </div>
                          <span className="ap-chart-sub">
                            {capacityData.length} packages
                          </span>
                        </div>
                        {capacityData.length > 0 ? (
                          <div className="ap-capacity-grid">
                            {capacityData.map((item, idx) => (
                              <CapacityGauge
                                key={idx}
                                packageName={item.packageName}
                                minCapacity={item.minPersonCount}
                                maxCapacity={item.maxPersonCount}
                                averageParticipants={item.averageParticipants}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="ap-empty-state">
                            <p className="ap-empty-text">
                              No capacity data available
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  </Reveal>
                </>
              )}

              {/* ── Info banner ── */}
              <Reveal delay={360}>
                <section className="ap-mt-7">
                  <div className="ap-info-banner">
                    <div className="ap-info-icon">
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
                      <p className="ap-info-title">Package Management</p>
                      <p className="ap-info-text">
                        Manage travel packages, track popularity, monitor
                        ratings, analyze pricing, and optimize capacity
                        utilization. Packages combine multiple tours and
                        activities into bundled experiences. Use the quick
                        actions above to create new packages, update existing
                        ones, or remove outdated packages. The capacity gauges
                        show utilization rates to help optimize package sizes
                        and pricing strategies.
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

export default PackagesPage;
