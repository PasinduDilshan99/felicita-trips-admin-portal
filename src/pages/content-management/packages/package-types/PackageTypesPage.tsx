"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Legend,
  ComposedChart,
  Line,
  Area,
  LineChart,
} from "recharts";
import { PackageTypeStatisticsData } from "@/types/package-types";
import { PackageService } from "@/services/packageService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PACKAGE_TYPE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { getPackageTypeStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  CustomPieTooltip,
  PackageTypeRevenueTooltip,
  PackageTypeBookingTooltip,
  PackageTypeRatingTooltip,
  PackageTypeLineTooltip,
  PackageTypeStackedTooltip,
} from "@/components/statistics-components";

const PackageTypesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<PackageTypeStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const packageTypesData = contentManagementSideBarData
    .find(item => item.name === "Packages")
    ?.subData.find(subItem => subItem.name === "Package Types");

  const packageTypeActions = packageTypesData?.grandSubData || [];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await PackageService.getPackageTypeStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        "We couldn't load the package type statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations with useMemo for performance */
  const pieChartData = useMemo(
    () => statistics?.typeDistributions || [],
    [statistics]
  );
  const revenueData = useMemo(
    () => statistics?.typeRevenuePerformances || [],
    [statistics]
  );
  const bookingData = useMemo(
    () => statistics?.typeBookingPerformances || [],
    [statistics]
  );
  const ratingData = useMemo(
    () => statistics?.typeRatingOverviews || [],
    [statistics]
  );
  const stackedData = useMemo(
    () => statistics?.typePrimarySecondaryUsages || [],
    [statistics]
  );
  const trendData = useMemo(
    () => statistics?.typeParticipationImpacts || [],
    [statistics]
  );

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

  const statCards = getPackageTypeStatisticsData(statistics);

  const p = theme.primary ?? "#0D4E4A";
  const acc = theme.accent ?? "#1a7a74";
  const surf = theme.surface ?? "#ffffff";
  const bg = theme.background ?? "#f8fafb";
  const border = theme.border ?? "#e5e7eb";
  const textPrimary = theme.text ?? "#111827";
  const textSecondary = theme.textSecondary ?? "#6b7280";
  const errColor = theme.error ?? "#ef4444";
  const successColor = theme.success ?? "#10b981";

  const styles = getStatisticsStyles(
    "pt",
    p,
    acc,
    surf,
    bg,
    border,
    textPrimary,
    textSecondary,
    errColor,
    successColor,
    isDarkMode,
  );

  // Show CommonLoading while loading
  if (loading) {
    return (
      <CommonLoading
        message="Loading package type statistics..."
        subMessage="Package Types"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Package Type-specific Styles */
        .pt-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { 
          .pt-stats-grid { 
            grid-template-columns: repeat(2, 1fr); 
          } 
        }
        @media (max-width: 580px)  { 
          .pt-stats-grid { 
            grid-template-columns: 1fr; 
          } 
        }

        .pt-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .pt-stat-value--text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--p);
          word-break: break-word;
        }

        .pt-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .pt-charts-grid { 
            grid-template-columns: 1fr; 
          }
        }

        .pt-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .pt-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .stats-tooltip__total {
          font-size: .8125rem;
          color: #cbd5e1;
          margin-top: 6px;
          padding-top: 4px;
          border-top: 1px solid #334155;
        }

        .pt-pie-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .pt-pie-legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .pt-pie-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .pt-pie-legend-count {
          margin-left: 0.25rem;
          font-weight: 600;
          color: var(--text);
        }

        .pt-chart-card {
          background: var(--surf);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.25rem;
          transition: all 0.2s ease;
        }
        .pt-chart-card:hover {
          border-color: var(--p);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .pt-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .pt-chart-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text);
        }
        .pt-chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .pt-chart-dot--p {
          background: var(--p);
        }
        .pt-chart-dot--acc {
          background: var(--acc);
        }
        .pt-chart-sub {
          font-size: 0.75rem;
          color: var(--muted);
        }
      `}</style>

      <div className="pt-root">
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
                  title="Package Types"
                  description="Manage and analyze package type performance"
                  breadcrumbItems={PACKAGE_TYPE_PAGE_BREADCRUMB_DATA}
                />
              </div>
            </div>
          </Reveal>

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Quick Actions ── */}
            {packageTypeActions.length > 0 && (
              <Reveal delay={60}>
                <section>
                  <SectionHeader
                    title="Quick Actions"
                    subtitle="Manage package type configurations"
                    badge={`${packageTypeActions.length} actions`}
                    prefix="pt"
                  />
                  <div className="pt-actions-grid">
                    {packageTypeActions.map((action) => {
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
            )}

            {/* ── Error ── */}
            {error && (
              <Reveal delay={0}>
                <div className="mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="pt"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="mt-8">
                  <SectionHeader
                    title="Type Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="pt"
                  />
                  <div className="pt-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`pt-stat-card pt-stat-card--${card.accent}`}
                      >
                        <div
                          className={`pt-stat-icon pt-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        {card.valueText ? (
                          <div className="pt-stat-value pt-stat-value--text">
                            {card.valueText}
                          </div>
                        ) : (
                          <div className="pt-stat-value">
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                              decimals={card.title === "Highest Rated" ? 1 : 0}
                            />
                            {card.suffix && (
                              <span className="pt-stat-suffix">
                                {card.suffix}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="pt-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Pie Chart (Type Distribution) + Bar Chart (Revenue Performance) */}
                <Reveal delay={180}>
                  <section className="mt-8">
                    <SectionHeader
                      title="Distribution & Revenue"
                      subtitle="Package type distribution and revenue performance"
                      prefix="pt"
                    />
                    <div className="pt-charts-grid">
                      {/* Pie Chart - Type Distribution */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--p" />
                            Type Distribution
                          </div>
                          <span className="pt-chart-sub">
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
                                    nameKey="typeName"
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
                            <div className="pt-pie-legend">
                              {pieChartData.map((item, i) => (
                                <div key={i} className="pt-pie-legend-item">
                                  <span
                                    className="pt-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.typeName}
                                  <span className="pt-pie-legend-count">
                                    {item.totalPackages.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No distribution data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Revenue Performance */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--acc" />
                            Revenue Performance
                          </div>
                          <span className="pt-chart-sub">
                            Total revenue by type
                          </span>
                        </div>
                        {revenueData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={revenueData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 60,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="revenueGrad"
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
                                  dataKey="typeName"
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
                                <Tooltip
                                  content={<PackageTypeRevenueTooltip />}
                                />
                                <Bar
                                  dataKey="totalRevenue"
                                  fill="url(#revenueGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Revenue"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No revenue data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Bar Chart (Booking Performance) + Combo Chart (Rating Overview) */}
                <Reveal delay={240}>
                  <section className="mt-7">
                    <SectionHeader
                      title="Booking & Quality"
                      subtitle="Booking performance and rating overview"
                      prefix="pt"
                    />
                    <div className="pt-charts-grid">
                      {/* Bar Chart - Booking Performance */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--p" />
                            Booking Performance
                          </div>
                          <span className="pt-chart-sub">
                            Total participants by type
                          </span>
                        </div>
                        {bookingData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={bookingData}
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
                                    id="bookingGrad"
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
                                  dataKey="typeName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip
                                  content={<PackageTypeBookingTooltip />}
                                />
                                <Bar
                                  dataKey="totalParticipants"
                                  fill="url(#bookingGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Participants"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No booking data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Combo Chart - Rating Overview */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--acc" />
                            Rating Overview
                          </div>
                          <span className="pt-chart-sub">
                            Average rating & review count
                          </span>
                        </div>
                        {ratingData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={ratingData}
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
                                  dataKey="typeName"
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
                                <Tooltip
                                  content={<PackageTypeRatingTooltip />}
                                />
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
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No rating data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Line Chart (Participation Trend) + Stacked Bar (Primary vs Secondary Usage) */}
                <Reveal delay={300}>
                  <section className="mt-7">
                    <SectionHeader
                      title="Trend & Usage Analysis"
                      subtitle="Participation trends and usage patterns"
                      prefix="pt"
                    />
                    <div className="pt-charts-grid">
                      {/* Line Chart - Participation Trend */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--p" />
                            Participation Trend
                          </div>
                          <span className="pt-chart-sub">Over time</span>
                        </div>
                        {trendData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={trendData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 20,
                                  left: 10,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="trendGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={p}
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={p}
                                      stopOpacity={0.01}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                />
                                <XAxis
                                  dataKey="month"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={40}
                                  tickFormatter={(value) =>
                                    value.toLocaleString()
                                  }
                                />
                                <Tooltip content={<PackageTypeLineTooltip />} />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                  type="monotone"
                                  dataKey="totalParticipants"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#trendGradient)"
                                  name="Participants"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalParticipants"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  dot={{
                                    fill: p,
                                    r: 4,
                                    strokeWidth: 2,
                                    stroke: surf,
                                  }}
                                  activeDot={{ r: 6, fill: p }}
                                  name="Participants"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No trend data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Stacked Bar - Primary vs Secondary Usage */}
                      <div className="pt-chart-card">
                        <div className="pt-chart-header">
                          <div className="pt-chart-title">
                            <span className="pt-chart-dot pt-chart-dot--acc" />
                            Primary vs Secondary Usage
                          </div>
                          <span className="pt-chart-sub">Usage patterns</span>
                        </div>
                        {stackedData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={stackedData}
                                layout="vertical"
                                margin={{
                                  top: 4,
                                  right: 30,
                                  bottom: 4,
                                  left: 100,
                                }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient
                                    id="primaryGrad"
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
                                      stopOpacity={0.7}
                                    />
                                  </linearGradient>
                                  <linearGradient
                                    id="secondaryGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={successColor}
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={successColor}
                                      stopOpacity={0.7}
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
                                />
                                <YAxis
                                  type="category"
                                  dataKey="typeName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={95}
                                />
                                <Tooltip
                                  content={<PackageTypeStackedTooltip />}
                                />
                                <Legend
                                  verticalAlign="top"
                                  height={36}
                                  iconType="circle"
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color: textSecondary,
                                        fontSize: 12,
                                      }}
                                    >
                                      {value}
                                    </span>
                                  )}
                                />
                                <Bar
                                  dataKey="primaryCount"
                                  stackId="a"
                                  fill="url(#primaryGrad)"
                                  name="Primary Usage"
                                  radius={[4, 0, 0, 4]}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Bar
                                  dataKey="secondaryCount"
                                  stackId="a"
                                  fill="url(#secondaryGrad)"
                                  name="Secondary Usage"
                                  radius={[0, 4, 4, 0]}
                                  animationBegin={400}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="pt-empty-state">
                            <p className="pt-empty-text">
                              No usage data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>
              </>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={360}>
              <section className="mt-7">
                <InfoBanner
                  title="Package Type Management"
                  description="Manage package types and analyze their performance. Track type distribution, revenue performance, booking metrics, ratings, and usage patterns. Types help categorize packages by travel style, duration, and interests. Use the quick actions above to add, edit, or remove package types. The line chart shows participation trends over time, while the stacked bar shows primary vs secondary usage patterns."
                  prefix="pt"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageTypesPage;