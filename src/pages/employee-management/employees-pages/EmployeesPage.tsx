"use client";

import React, { useState, useEffect } from "react";
import { employeeManagementSideBarData } from "@/data/side-bar-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { EmployeeStatisticsData } from "@/types/employee-types";
import { EmployeeService } from "@/services/employeeService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { EMPLOYEE_MANAGEMENT_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import {
  AnimatedCount,
  CustomBarTooltip,
  CustomLineTooltip,
  CustomPieTooltip,
  CustomSalaryTooltip,
  getActionConfig,
  Reveal,
  SectionHeader,
} from "@/components/statistics-components";

const EmployeesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<EmployeeStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const employeesData = employeeManagementSideBarData.find(
    (item) => item.name === "Employee Management",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await EmployeeService.getEmployeeStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const departmentData = statistics?.departmentWiseEmployees || [];
  const employeeTypeData = statistics?.employeeTypeDistribution || [];
  const workLocationData = statistics?.workLocationDistribution || [];
  const gradeData =
    statistics?.employeeGradeDistribution.filter((g) => g.employeeGrade) || [];
  const hiringTrendData = statistics?.monthlyHiringTrend || [];
  const salaryData = statistics?.salaryByDepartment || [];
  const performanceData = statistics?.performanceRatingDistribution || [];
  const skillData = statistics?.skillDistribution?.slice(0, 10) || [];
  const assetData = statistics?.assetDistribution || [];
  const shiftData = statistics?.shiftDistribution || [];

  // Colors for charts
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#6366f1",
  ];

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

        /* ── KPI Cards ── */
        .dp-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 1024px) { .dp-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .dp-kpi-grid { grid-template-columns: 1fr; } }

        .dp-kpi-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          transition: transform .24s cubic-bezier(0.22,1,0.36,1), box-shadow .24s ease;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
        }
        .dp-kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,.1);
        }
        .dp-kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dp-kpi-icon svg { width: 24px; height: 24px; }
        .dp-kpi-content {
          flex: 1;
        }
        .dp-kpi-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
          letter-spacing: -.03em;
        }
        .dp-kpi-label {
          font-size: .7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .065em;
        }

        .dp-kpi-icon--blue    { background: var(--blue-bg); color: var(--blue-fg); }
        .dp-kpi-icon--emerald { background: var(--em-bg);   color: var(--em-fg); }
        .dp-kpi-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-kpi-icon--violet  { background: var(--vi-bg);   color: var(--vi-fg); }

        /* ── Secondary Stats ── */
        .dp-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) { .dp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .dp-stats-grid { grid-template-columns: 1fr; } }

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
          transition: transform .24s cubic-bezier(0.22,1,0.36,1), box-shadow .24s ease;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
        }
        .dp-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(15,23,42,.1);
        }
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
        .dp-stat-card--rose::before    { background: var(--ro-mid); }
        .dp-stat-card--amber::before   { background: var(--am-mid); }
        .dp-stat-card--teal::before    { background: var(--tl-mid); }

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
        .dp-stat-icon--rose    { background: var(--ro-bg);   color: var(--ro-fg); }
        .dp-stat-icon--amber   { background: var(--am-bg);   color: var(--am-fg); }
        .dp-stat-icon--teal    { background: var(--tl-bg);   color: var(--tl-fg); }

        .dp-stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -.04em;
        }
        .dp-stat-label {
          font-size: .7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .065em;
        }

        /* ── Skeleton ── */
        .dp-skeleton-card { pointer-events: none !important; }
        .dp-skel {
          border-radius: 6px;
          background: linear-gradient(90deg, var(--border) 25%, ${isDarkMode ? hexToRgba(surf, 0.6) : "#f8fafc"} 50%, var(--border) 75%);
          background-size: 700px 100%;
          animation: dp-shimmer 1.5s infinite;
        }
        .dp-skel--icon   { width: 40px; height: 40px; border-radius: 10px; }
        .dp-skel--val    { width: 55%; height: 28px; margin-top: .625rem; border-radius: 7px; }
        .dp-skel--label  { width: 80%; height: 10px; border-radius: 5px; }

        /* ── Charts ── */
        .dp-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .dp-charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .dp-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
          transition: box-shadow .22s ease;
        }
        .dp-chart-card:hover { box-shadow: 0 6px 18px rgba(15,23,42,.07); }

        .dp-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .dp-chart-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .875rem;
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
          font-size: .7rem;
          color: var(--muted);
          font-weight: 600;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        /* ── Legend ── */
        .dp-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .dp-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: .75rem;
          color: var(--muted);
          font-weight: 500;
        }
        .dp-legend-dot {
          width: 10px; height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        /* ── Tooltip ── */
        .dp-tooltip {
          background: #0f172a;
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          border: 1px solid rgba(255,255,255,.07);
        }
        .dp-tooltip__label {
          font-size: .7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .055em;
          margin-bottom: 4px;
        }
        .dp-tooltip__value {
          font-size: .875rem;
          color: #f8fafc;
          font-weight: 700;
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
          transition: opacity .15s, transform .12s;
        }
        .dp-retry-btn:hover   { opacity: .88; }
        .dp-retry-btn:active  { transform: scale(.97); }

        /* ── Info banner ── */
        .dp-info-banner {
          background: linear-gradient(135deg, ${hexToRgba(p, 0.04)} 0%, ${hexToRgba(acc, 0.06)} 100%);
          border: 1.5px solid ${hexToRgba(p, 0.14)};
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
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
        }
        .dp-info-banner:hover .dp-info-icon { transform: scale(1.08) rotate(-4deg); }
        .dp-info-icon svg { width: 18px; height: 18px; }
        .dp-info-title {
          font-size: .875rem;
          font-weight: 700;
          color: var(--p);
          margin-bottom: .25rem;
        }
        .dp-info-text {
          font-size: .8125rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0;
        }

        .dp-mt-6 { margin-top: 1.5rem; }
        .dp-mt-7 { margin-top: 1.875rem; }
        .dp-mt-8 { margin-top: 2rem; }
        .dp-mb-6 { margin-bottom: 1.5rem; }
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
                  title="Employees"
                  description="Manage and monitor employee data, performance, and analytics"
                  breadcrumbItems={EMPLOYEE_MANAGEMENT_PAGE_BREADCRUMB_DATA}
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
              <span className="dp-loading-text">Loading employee data…</span>
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
                    subtitle="Jump directly to any employee management task"
                    badge={`${employeesData?.subData.length ?? 0} actions`}
                  />
                  <div className="dp-actions-grid">
                    {employeesData?.subData.map((action, idx) => {
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

              {/* ── KPI Summary Cards ── */}
              {!error && statistics && (
                <Reveal delay={120}>
                  <section className="dp-mt-8">
                    <SectionHeader
                      title="KPI Summary"
                      subtitle="Key performance indicators across workforce"
                      badge="Live"
                      live
                    />
                    <div className="dp-kpi-grid">
                      <div className="dp-kpi-card">
                        <div className="dp-kpi-icon dp-kpi-icon--blue">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                        </div>
                        <div className="dp-kpi-content">
                          <div className="dp-kpi-value">
                            <AnimatedCount
                              value={statistics.kpiSummary.totalEmployees}
                            />
                          </div>
                          <div className="dp-kpi-label">Total Employees</div>
                        </div>
                      </div>
                      <div className="dp-kpi-card">
                        <div className="dp-kpi-icon dp-kpi-icon--emerald">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="dp-kpi-content">
                          <div className="dp-kpi-value">
                            <AnimatedCount
                              value={statistics.kpiSummary.activeEmployees}
                            />
                          </div>
                          <div className="dp-kpi-label">Active Employees</div>
                        </div>
                      </div>
                      <div className="dp-kpi-card">
                        <div className="dp-kpi-icon dp-kpi-icon--amber">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l3 3" />
                          </svg>
                        </div>
                        <div className="dp-kpi-content">
                          <div className="dp-kpi-value">
                            <AnimatedCount
                              value={
                                statistics.kpiSummary.employeesJoinedThisMonth
                              }
                            />
                          </div>
                          <div className="dp-kpi-label">
                            New Hires (This Month)
                          </div>
                        </div>
                      </div>
                      <div className="dp-kpi-card">
                        <div className="dp-kpi-icon dp-kpi-icon--violet">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div className="dp-kpi-content">
                          <div className="dp-kpi-value">
                            <AnimatedCount
                              value={statistics.kpiSummary.averageRating}
                              decimals={1}
                            />
                            <span style={{ fontSize: "1rem" }}> / 5</span>
                          </div>
                          <div className="dp-kpi-label">Average Rating</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Reveal>
              )}

              {/* ── Secondary Stats ── */}
              {!error && statistics && (
                <Reveal delay={140}>
                  <section className="dp-mt-6">
                    <div className="dp-stats-grid">
                      <div className="dp-stat-card dp-stat-card--rose">
                        <div className="dp-stat-icon dp-stat-icon--rose">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M15 9l-6 6M9 9l6 6" />
                          </svg>
                        </div>
                        <div className="dp-stat-value">
                          <AnimatedCount
                            value={statistics.kpiSummary.inactiveEmployees}
                          />
                        </div>
                        <div className="dp-stat-label">Inactive Employees</div>
                      </div>
                      <div className="dp-stat-card dp-stat-card--amber">
                        <div className="dp-stat-icon dp-stat-icon--amber">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            <path d="M12 8v4l3 3" />
                          </svg>
                        </div>
                        <div className="dp-stat-value">
                          <AnimatedCount
                            value={
                              statistics.kpiSummary.employeesWithoutSupervisor
                            }
                          />
                        </div>
                        <div className="dp-stat-label">Without Supervisor</div>
                      </div>
                      <div className="dp-stat-card dp-stat-card--teal">
                        <div className="dp-stat-icon dp-stat-icon--teal">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.75}
                          >
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                          </svg>
                        </div>
                        <div className="dp-stat-value">
                          <AnimatedCount
                            value={statistics.kpiSummary.totalAssets}
                          />
                        </div>
                        <div className="dp-stat-label">Total Assets</div>
                      </div>
                    </div>
                  </section>
                </Reveal>
              )}

              {/* ── Charts Section ── */}
              {!error && statistics && (
                <Reveal delay={180}>
                  <section className="dp-mt-8">
                    <SectionHeader
                      title="Analytics Dashboard"
                      subtitle="Comprehensive employee analytics across all dimensions"
                    />

                    <div className="dp-charts-grid">
                      {/* Department Wise Employees - Bar Chart */}
                      {departmentData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--p" />
                              Department Wise Employees
                            </div>
                            <span className="dp-chart-sub">
                              {departmentData.length} departments
                            </span>
                          </div>
                          <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={departmentData}
                                layout="vertical"
                                margin={{ left: 20, right: 10 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                  horizontal={false}
                                />
                                <XAxis
                                  type="number"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <YAxis
                                  type="category"
                                  dataKey="departmentName"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  width={100}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar
                                  dataKey="employeeCount"
                                  name="Employees"
                                  fill={p}
                                  radius={[0, 8, 8, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Employee Type Distribution - Donut Chart */}
                      {employeeTypeData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--ok" />
                              Employee Type Distribution
                            </div>
                          </div>
                          <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={employeeTypeData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={90}
                                  dataKey="employeeCount"
                                  nameKey="employeeType"
                                  paddingAngle={3}
                                >
                                  {employeeTypeData.map((_, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="dp-legend">
                            {employeeTypeData.map((item, idx) => (
                              <div key={idx} className="dp-legend-item">
                                <span
                                  className="dp-legend-dot"
                                  style={{
                                    background:
                                      PIE_COLORS[idx % PIE_COLORS.length],
                                  }}
                                />
                                {item.employeeType} ({item.employeeCount})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Location Distribution - Pie Chart */}
                      {workLocationData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--p" />
                              Work Location Distribution
                            </div>
                          </div>
                          <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={workLocationData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={0}
                                  outerRadius={100}
                                  dataKey="employeeCount"
                                  nameKey="workLocation"
                                  paddingAngle={3}
                                >
                                  {workLocationData.map((_, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="dp-legend">
                            {workLocationData.map((item, idx) => (
                              <div key={idx} className="dp-legend-item">
                                <span
                                  className="dp-legend-dot"
                                  style={{
                                    background:
                                      PIE_COLORS[idx % PIE_COLORS.length],
                                  }}
                                />
                                {item.workLocation} ({item.employeeCount})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Employee Grade Distribution - Bar Chart */}
                      {gradeData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--ok" />
                              Employee Grade Distribution
                            </div>
                          </div>
                          <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={gradeData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="employeeGrade"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar
                                  dataKey="employeeCount"
                                  name="Employees"
                                  fill={p}
                                  radius={[8, 8, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Monthly Hiring Trend - Line Chart */}
                      {hiringTrendData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--p" />
                              Monthly Hiring Trend
                            </div>
                          </div>
                          <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={hiringTrendData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                />
                                <XAxis
                                  dataKey="month"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  angle={-30}
                                  textAnchor="end"
                                  height={60}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <Tooltip content={<CustomLineTooltip />} />
                                <Line
                                  type="monotone"
                                  dataKey="hiredCount"
                                  name="Hired"
                                  stroke={p}
                                  strokeWidth={3}
                                  dot={{ r: 4, fill: p }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Salary by Department - Bar Chart */}
                      {salaryData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--ok" />
                              Salary by Department
                            </div>
                          </div>
                          <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={salaryData}
                                margin={{ bottom: 40 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="departmentName"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  angle={-30}
                                  textAnchor="end"
                                  height={60}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  tickFormatter={(v) =>
                                    `$${(v / 1000).toFixed(0)}k`
                                  }
                                />
                                <Tooltip content={<CustomSalaryTooltip />} />
                                <Bar
                                  dataKey="averageSalary"
                                  name="Avg Salary"
                                  fill={p}
                                  radius={[8, 8, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Performance Rating Distribution - Pie Chart */}
                      {performanceData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--p" />
                              Performance Rating Distribution
                            </div>
                          </div>
                          <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={performanceData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={0}
                                  outerRadius={100}
                                  dataKey="totalReviews"
                                  nameKey="ratingGroup"
                                  paddingAngle={3}
                                >
                                  {performanceData.map((_, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  content={({ active, payload }: any) => {
                                    if (active && payload?.length) {
                                      return (
                                        <div className="dp-tooltip">
                                          <p className="dp-tooltip__label">
                                            Rating {payload[0].name}
                                          </p>
                                          <p className="dp-tooltip__value">
                                            {payload[0].value} reviews
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="dp-legend">
                            {performanceData.map((item, idx) => (
                              <div key={idx} className="dp-legend-item">
                                <span
                                  className="dp-legend-dot"
                                  style={{
                                    background:
                                      PIE_COLORS[idx % PIE_COLORS.length],
                                  }}
                                />
                                Rating {item.ratingGroup} ({item.totalReviews})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skill Distribution - Horizontal Bar Chart */}
                      {skillData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--ok" />
                              Skill Distribution
                            </div>
                            <span className="dp-chart-sub">Top 10 skills</span>
                          </div>
                          <div style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={skillData}
                                layout="vertical"
                                margin={{ left: 80 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                  horizontal={false}
                                />
                                <XAxis
                                  type="number"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <YAxis
                                  type="category"
                                  dataKey="skillName"
                                  tick={{ fontSize: 10, fill: textSecondary }}
                                  width={80}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar
                                  dataKey="employeeCount"
                                  name="Employees"
                                  fill={p}
                                  radius={[0, 8, 8, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Asset Distribution - Bar Chart */}
                      {assetData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--p" />
                              Asset Distribution
                            </div>
                          </div>
                          <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={assetData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.6)}
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="assetType"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  angle={-30}
                                  textAnchor="end"
                                  height={60}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                />
                                <Tooltip
                                  content={({
                                    active,
                                    payload,
                                    label,
                                  }: any) => {
                                    if (active && payload?.length) {
                                      return (
                                        <div className="dp-tooltip">
                                          <p className="dp-tooltip__label">
                                            {label}
                                          </p>
                                          <p className="dp-tooltip__value">
                                            {payload[0].value} assets
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar
                                  dataKey="totalAssets"
                                  name="Assets"
                                  fill={p}
                                  radius={[8, 8, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Shift Distribution - Pie Chart */}
                      {shiftData.length > 0 && (
                        <div className="dp-chart-card">
                          <div className="dp-chart-header">
                            <div className="dp-chart-title">
                              <span className="dp-chart-dot dp-chart-dot--ok" />
                              Shift Distribution
                            </div>
                          </div>
                          <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={shiftData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={0}
                                  outerRadius={100}
                                  dataKey="employeeCount"
                                  nameKey="shiftName"
                                  paddingAngle={3}
                                >
                                  {shiftData.map((_, idx) => (
                                    <Cell
                                      key={`cell-${idx}`}
                                      fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="dp-legend">
                            {shiftData.map((item, idx) => (
                              <div key={idx} className="dp-legend-item">
                                <span
                                  className="dp-legend-dot"
                                  style={{
                                    background:
                                      PIE_COLORS[idx % PIE_COLORS.length],
                                  }}
                                />
                                {item.shiftName} ({item.employeeCount})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <div>
                      <p className="dp-info-title">Employee Management</p>
                      <p className="dp-info-text">
                        Use the quick-action cards above to browse, create,
                        edit, or remove employees. The analytics dashboard
                        provides comprehensive insights including department
                        distribution, hiring trends, salary analysis,
                        performance ratings, skills, assets, and shift patterns.
                        All statistics reflect the latest data from your
                        backend.
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

export default EmployeesPage;
