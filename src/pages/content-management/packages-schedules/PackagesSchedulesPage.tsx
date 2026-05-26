"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
  Area,
} from "recharts";
import { PackageScheduleStatisticsData } from "@/types/package-types";
import { PackageService } from "@/services/packageService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { PACKAGE_SCHEDULE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getPackageScheduleStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  PackageScheduleLineTooltip,
  PackageSchedulePieTooltip,
  PackageScheduleDurationTooltip,
  PackageScheduleParticipationTooltip,
  PackageScheduleRatingTooltip,
} from "@/components/statistics-components";

const PackagesSchedulesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<PackageScheduleStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const packagesData = contentManagementSideBarData.find(
    (item) => item.name === "Packages",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await PackageService.getPackageScheduleStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the package schedule statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const lineChartData = statistics?.scheduleTimelines || [];
  
  // Transform status distribution for pie chart
  const pieChartData = statistics?.scheduleStatusDistributions?.map(item => ({
    name: item.statusId === 1 ? "Active" : "Inactive",
    value: item.totalSchedules,
    statusId: item.statusId
  })) || [];
  
  const durationData = statistics?.durationDistributions || [];
  const participationData = statistics?.scheduleParticipationPerformances || [];
  const ratingData = statistics?.scheduleRatingOverviews || [];

  /* Chart Colors */
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#FDA4AF",
  ];

  const statCards = getPackageScheduleStatisticsData(statistics);

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
    "ps",
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
        message="Loading package schedule statistics..."
        subMessage="Package Schedules"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Package Schedule-specific Styles */
        .ps-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .ps-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .ps-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .ps-stats-grid { grid-template-columns: 1fr; } }

        .ps-stat-prefix, .ps-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
        }
        .ps-stat-prefix {
          margin-right: 2px;
        }
        .ps-stat-suffix {
          margin-left: 4px;
        }

        .ps-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .ps-charts-grid { grid-template-columns: 1fr; }
        }

        .ps-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .ps-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="ps-root">
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
                  title="Package Schedules"
                  description="Manage and analyze package schedule performance"
                  breadcrumbItems={PACKAGE_SCHEDULE_PAGE_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any package management task"
                  badge={`${packagesData?.subData.length ?? 0} actions`}
                  prefix="ps"
                />
                <div className="ps-actions-grid">
                  {packagesData?.subData.map((action) => {
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
                <div className="ps-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="ps"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="ps-mt-8">
                  <SectionHeader
                    title="Schedule Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="ps"
                  />
                  <div className="ps-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`ps-stat-card ps-stat-card--${card.accent}`}
                      >
                        <div
                          className={`ps-stat-icon ps-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="ps-stat-value">
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                            decimals={card.title === "Avg Rating" ? 1 : card.title === "Avg Duration" ? 1 : 0}
                          />
                          {card.suffix && <span className="ps-stat-suffix">{card.suffix}</span>}
                        </div>
                        <div className="ps-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Line Chart (Schedule Timeline) + Pie Chart (Status Distribution) */}
                <Reveal delay={180}>
                  <section className="ps-mt-8">
                    <SectionHeader
                      title="Timeline & Status"
                      subtitle="Schedule trends and status distribution"
                      prefix="ps"
                    />
                    <div className="ps-charts-grid">
                      {/* Line Chart - Schedule Timeline */}
                      <div className="ps-chart-card">
                        <div className="ps-chart-header">
                          <div className="ps-chart-title">
                            <span className="ps-chart-dot ps-chart-dot--p" />
                            Schedule Timeline
                          </div>
                          <span className="ps-chart-sub">Over time</span>
                        </div>
                        {lineChartData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={lineChartData}
                                margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
                              >
                                <defs>
                                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={p} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={p} stopOpacity={0.01} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                />
                                <XAxis
                                  dataKey="timeline"
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
                                />
                                <Tooltip content={<PackageScheduleLineTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="totalSchedules"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#lineGradient)"
                                  name="Schedules"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="totalSchedules"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  dot={{ fill: p, r: 4, strokeWidth: 2, stroke: surf }}
                                  activeDot={{ r: 6, fill: p }}
                                  name="Schedules"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ps-empty-state">
                            <p className="ps-empty-text">No timeline data available</p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Status Distribution */}
                      <div className="ps-chart-card">
                        <div className="ps-chart-header">
                          <div className="ps-chart-title">
                            <span className="ps-chart-dot ps-chart-dot--acc" />
                            Status Distribution
                          </div>
                          <span className="ps-chart-sub">Active vs Inactive</span>
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
                                        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
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
                                    dataKey="value"
                                    nameKey="name"
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
                                  <Tooltip content={<PackageSchedulePieTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="ps-pie-legend">
                              {pieChartData.map((item, i) => (
                                <div key={i} className="ps-pie-legend-item">
                                  <span
                                    className="ps-pie-legend-dot"
                                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                                  />
                                  {item.name}
                                  <span className="ps-pie-legend-count">
                                    {item.value.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="ps-empty-state">
                            <p className="ps-empty-text">No status data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Column Chart (Duration Distribution) + Bar Chart (Participation Performance) */}
                <Reveal delay={240}>
                  <section className="ps-mt-7">
                    <SectionHeader
                      title="Duration & Participation"
                      subtitle="Duration distribution and participation performance"
                      prefix="ps"
                    />
                    <div className="ps-charts-grid">
                      {/* Column Chart - Duration Distribution */}
                      <div className="ps-chart-card">
                        <div className="ps-chart-header">
                          <div className="ps-chart-title">
                            <span className="ps-chart-dot ps-chart-dot--p" />
                            Duration Distribution
                          </div>
                          <span className="ps-chart-sub">By schedule</span>
                        </div>
                        {durationData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={durationData}
                                margin={{ top: 4, right: 4, bottom: 60, left: 0 }}
                              >
                                <defs>
                                  <linearGradient id="durationGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={p} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={p} stopOpacity={0.6} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={hexToRgba(border, 0.8)}
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="scheduleName"
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
                                  label={{
                                    value: "Duration (days)",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fill: textSecondary, fontSize: 11 }
                                  }}
                                />
                                <Tooltip content={<PackageScheduleDurationTooltip />} />
                                <Bar
                                  dataKey="averageDuration"
                                  fill="url(#durationGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Avg Duration"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ps-empty-state">
                            <p className="ps-empty-text">No duration data available</p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Participation Performance */}
                      <div className="ps-chart-card">
                        <div className="ps-chart-header">
                          <div className="ps-chart-title">
                            <span className="ps-chart-dot ps-chart-dot--acc" />
                            Participation Performance
                          </div>
                          <span className="ps-chart-sub">Total participants by schedule</span>
                        </div>
                        {participationData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={participationData}
                                layout="vertical"
                                margin={{ top: 4, right: 30, bottom: 4, left: 120 }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient id="participationGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={p} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={p} stopOpacity={0.6} />
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
                                  tickFormatter={(value) => value.toLocaleString()}
                                />
                                <YAxis
                                  type="category"
                                  dataKey="scheduleName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={115}
                                />
                                <Tooltip content={<PackageScheduleParticipationTooltip />} />
                                <Bar
                                  dataKey="totalParticipants"
                                  fill="url(#participationGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Participants"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ps-empty-state">
                            <p className="ps-empty-text">No participation data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Combo Chart - Rating Overview */}
                <Reveal delay={300}>
                  <section className="ps-mt-7">
                    <SectionHeader
                      title="Quality Analysis"
                      subtitle="Rating overview and review counts"
                      prefix="ps"
                    />
                    <div className="ps-chart-card">
                      <div className="ps-chart-header">
                        <div className="ps-chart-title">
                          <span className="ps-chart-dot ps-chart-dot--p" />
                          Rating Overview
                        </div>
                        <span className="ps-chart-sub">{ratingData.length} schedules</span>
                      </div>
                      {ratingData.length > 0 ? (
                        <div style={{ height: 400 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={ratingData}
                              margin={{ top: 20, right: 30, bottom: 60, left: 0 }}
                            >
                              <defs>
                                <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={p} stopOpacity={0.9} />
                                  <stop offset="100%" stopColor={p} stopOpacity={0.4} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={hexToRgba(border, 0.8)}
                              />
                              <XAxis
                                dataKey="scheduleName"
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
                                height={80}
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
                                  style: { fill: textSecondary, fontSize: 11 }
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
                                  style: { fill: textSecondary, fontSize: 11 }
                                }}
                              />
                              <Tooltip content={<PackageScheduleRatingTooltip />} />
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
                        <div className="ps-empty-state">
                          <p className="ps-empty-text">No rating data available</p>
                        </div>
                      )}
                    </div>
                  </section>
                </Reveal>
              </>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={360}>
              <section className="ps-mt-7">
                <InfoBanner
                  title="Package Schedule Management"
                  description="Manage package schedules, track timeline trends, monitor status distribution, analyze duration patterns, and evaluate participation performance. The combo chart shows rating overviews to help identify top-performing schedules. Use the quick actions above to create new schedules, update existing ones, or remove outdated schedules. Statistics and charts reflect real-time data from your backend."
                  prefix="ps"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagesSchedulesPage;