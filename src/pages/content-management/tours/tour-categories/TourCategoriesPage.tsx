"use client";

import React, { useState, useEffect } from "react";
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
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  Line,
} from "recharts";
import { TourCategoryStatisticsData } from "@/types/tour-types";
import { TourService } from "@/services/tourService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_CATEGORY_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { getTourCategoryStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  TourCategoryPieTooltip,
  TourCategoryBarTooltip,
  TourCategoryComboTooltip,
  TourCategoryStackedTooltip,
  TourCategoryBubbleTooltip,
} from "@/components/statistics-components";

const TourCategoriesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<TourCategoryStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toursData = contentManagementSideBarData.find(
    (item) => item.name === "Tours",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await TourService.getTourCategoryStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError(
        "We couldn't load the tour category statistics. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const pieChartData = statistics?.categoryDistribution || [];
  const barChartData = statistics?.categoryBookingPerformance || [];
  const comboData = statistics?.categoryRatingOverview || [];
  const stackedData = statistics?.categoryPrimarySecondaryUsage || [];

  // Prepare bubble chart data by combining multiple data sources
  const bubbleData =
    statistics?.categoryParticipationImpact.map((impact) => {
      const rating = statistics.categoryRatingOverview.find(
        (r) => r.categoryId === impact.categoryId,
      );
      const distribution = statistics.categoryDistribution.find(
        (d) => d.categoryName === impact.categoryName,
      );
      return {
        categoryName: impact.categoryName,
        totalParticipants: impact.totalParticipants,
        averageRating: rating?.averageRating || 0,
        totalTours: distribution?.totalTours || 0,
      };
    }) || [];

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

  const statCards = getTourCategoryStatisticsData(statistics);

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
    "tc",
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
        message="Loading tour category statistics..."
        subMessage="Tour Categories"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Tour Category-specific Styles */
        .tc-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { .tc-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .tc-stats-grid { grid-template-columns: 1fr; } }

        .tc-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .tc-charts-grid { grid-template-columns: 1fr; }
        }

        /* Bubble Chart Styles */
        .tc-bubble-legend {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.125rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .tc-bubble-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .tc-bubble-legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${p};
          opacity: 0.6;
        }
        .tc-bubble-legend-dot--large {
          width: 20px;
          height: 20px;
          opacity: 0.8;
        }

        .tc-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .tc-empty-text {
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
      `}</style>

      <div className="tc-root">
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
                  title="Tour Categories"
                  description="Manage and analyze tour category performance"
                  breadcrumbItems={TOUR_CATEGORY_PAGE_BREADCRUMB_DATA}
                />
              </div>
            </div>
          </Reveal>

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Quick Actions ── */}
            <Reveal delay={60}>
              <section>
                <SectionHeader
                  title="Quick Actions"
                  subtitle="Jump directly to any tour management task"
                  badge={`${toursData?.subData.length ?? 0} actions`}
                  prefix="tc"
                />
                <div className="tc-actions-grid">
                  {toursData?.subData.map((action) => {
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
                <div className="tc-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="tc"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="tc-mt-8">
                  <SectionHeader
                    title="Category Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="tc"
                  />
                  <div className="tc-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`tc-stat-card tc-stat-card--${card.accent}`}
                      >
                        <div
                          className={`tc-stat-icon tc-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="tc-stat-value">
                          {card.title === "Average Rating" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={1}
                              />
                              <span className="tc-stat-suffix">
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
                        <div className="tc-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Pie Chart (Distribution) + Bar Chart (Booking Performance) */}
                <Reveal delay={180}>
                  <section className="tc-mt-8">
                    <SectionHeader
                      title="Category Distribution & Performance"
                      subtitle="Tour distribution and booking metrics by category"
                      prefix="tc"
                    />
                    <div className="tc-charts-grid">
                      {/* Pie Chart - Category Distribution */}
                      <div className="tc-chart-card">
                        <div className="tc-chart-header">
                          <div className="tc-chart-title">
                            <span className="tc-chart-dot tc-chart-dot--p" />
                            Category Distribution
                          </div>
                          <span className="tc-chart-sub">
                            {pieChartData.length} categories
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
                                    dataKey="totalTours"
                                    nameKey="categoryName"
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
                                  <Tooltip
                                    content={<TourCategoryPieTooltip />}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="tc-pie-legend">
                              {pieChartData.slice(0, 6).map((item, i) => (
                                <div key={i} className="tc-pie-legend-item">
                                  <span
                                    className="tc-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.categoryName}
                                  <span className="tc-pie-legend-count">
                                    {item.totalTours.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="tc-empty-state">
                            <p className="tc-empty-text">
                              No distribution data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Booking Performance */}
                      <div className="tc-chart-card">
                        <div className="tc-chart-header">
                          <div className="tc-chart-title">
                            <span className="tc-chart-dot tc-chart-dot--acc" />
                            Booking Performance
                          </div>
                          <span className="tc-chart-sub">
                            Total bookings per category
                          </span>
                        </div>
                        {barChartData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={barChartData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 60,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="bookingGrad"
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
                                  dataKey="categoryName"
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
                                  width={35}
                                />
                                <Tooltip content={<TourCategoryBarTooltip />} />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#bookingGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="tc-empty-state">
                            <p className="tc-empty-text">
                              No booking data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Combo Chart (Ratings Overview) + Stacked Bar (Primary vs Secondary Usage) */}
                <Reveal delay={240}>
                  <section className="tc-mt-7">
                    <SectionHeader
                      title="Quality & Usage Analysis"
                      subtitle="Rating overview and category usage patterns"
                      prefix="tc"
                    />
                    <div className="tc-charts-grid">
                      {/* Combo Chart - Ratings Overview (Bar + Line) */}
                      <div className="tc-chart-card">
                        <div className="tc-chart-header">
                          <div className="tc-chart-title">
                            <span className="tc-chart-dot tc-chart-dot--p" />
                            Ratings Overview
                          </div>
                          <span className="tc-chart-sub">
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
                                  dataKey="categoryName"
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
                                  content={<TourCategoryComboTooltip />}
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
                          <div className="tc-empty-state">
                            <p className="tc-empty-text">
                              No rating data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Stacked Bar - Primary vs Secondary Usage */}
                      <div className="tc-chart-card">
                        <div className="tc-chart-header">
                          <div className="tc-chart-title">
                            <span className="tc-chart-dot tc-chart-dot--acc" />
                            Primary vs Secondary Usage
                          </div>
                          <span className="tc-chart-sub">
                            Category assignment patterns
                          </span>
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
                                  dataKey="categoryName"
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
                                  content={<TourCategoryStackedTooltip />}
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
                                  dataKey="primaryUsage"
                                  stackId="a"
                                  fill="url(#primaryGrad)"
                                  name="Primary Category"
                                  radius={[4, 0, 0, 4]}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Bar
                                  dataKey="secondaryUsage"
                                  stackId="a"
                                  fill="url(#secondaryGrad)"
                                  name="Secondary Category"
                                  radius={[0, 4, 4, 0]}
                                  animationBegin={400}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="tc-empty-state">
                            <p className="tc-empty-text">
                              No usage data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Bubble Chart - Participation Impact */}
                <Reveal delay={300}>
                  <section className="tc-mt-7">
                    <SectionHeader
                      title="Participation Impact"
                      subtitle="Bubble chart showing participants, tours, and ratings"
                      prefix="tc"
                    />
                    <div className="tc-chart-card">
                      <div className="tc-chart-header">
                        <div className="tc-chart-title">
                          <span className="tc-chart-dot tc-chart-dot--p" />
                          Category Impact Analysis
                        </div>
                        <span className="tc-chart-sub">
                          Bubble size = Total Participants
                        </span>
                      </div>
                      {bubbleData.length > 0 ? (
                        <>
                          <div style={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 60,
                                  left: 60,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="bubbleGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={p}
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={acc}
                                      stopOpacity={0.5}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                />
                                <XAxis
                                  dataKey="totalTours"
                                  type="number"
                                  name="Total Tours"
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "Number of Tours",
                                    position: "bottom",
                                    offset: 40,
                                    style: {
                                      fill: textSecondary,
                                      fontSize: 12,
                                    },
                                  }}
                                />
                                <YAxis
                                  dataKey="averageRating"
                                  type="number"
                                  name="Average Rating"
                                  domain={[0, 5]}
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  label={{
                                    value: "Average Rating",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                      fill: textSecondary,
                                      fontSize: 12,
                                    },
                                  }}
                                />
                                <ZAxis
                                  dataKey="totalParticipants"
                                  type="number"
                                  range={[60, 400]}
                                  name="Total Participants"
                                />
                                <Tooltip
                                  content={<TourCategoryBubbleTooltip />}
                                />
                                <Legend
                                  verticalAlign="bottom"
                                  height={50}
                                  formatter={() => (
                                    <span
                                      style={{
                                        color: textSecondary,
                                        fontSize: 11,
                                      }}
                                    >
                                      Circle size = Total Participants
                                    </span>
                                  )}
                                />
                                <Scatter
                                  name="Categories"
                                  data={bubbleData}
                                  fill="url(#bubbleGrad)"
                                  stroke={p}
                                  strokeWidth={1.5}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="tc-bubble-legend">
                            <div className="tc-bubble-legend-item">
                              <div className="tc-bubble-legend-dot" />
                              <span>Smaller bubble = Fewer participants</span>
                            </div>
                            <div className="tc-bubble-legend-item">
                              <div className="tc-bubble-legend-dot tc-bubble-legend-dot--large" />
                              <span>Larger bubble = More participants</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="tc-empty-state">
                          <p className="tc-empty-text">
                            No participation data available
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
              <section className="tc-mt-7">
                <InfoBanner
                  title="Tour Category Management"
                  description="Manage tour categories and analyze their performance. Track category distribution, booking metrics, ratings, and usage patterns. Categories help organize tours by type, difficulty, and interests. Use the quick actions above to add, edit, or remove categories. The bubble chart shows the relationship between number of tours, average rating, and participant impact for each category."
                  prefix="tc"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourCategoriesPage;
