"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { TourScheduleStatisticsData } from "@/types/tour-types";
import { TourService } from "@/services/tourService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { TOUR_SCHEDULE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getTourScheduleStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  TourScheduleLineTooltip,
  TourScheduleDurationTooltip,
  TourScheduleExecutionTooltip,
  TourScheduleRatingTooltip,
  TourScheduleParticipationTooltip,
} from "@/components/statistics-components";

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const ToursSchedulesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<TourScheduleStatisticsData | null>(null);
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
      const response = await TourService.getTourScheduleStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the tour schedule statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const lineChartData = statistics?.scheduleTimeline || [];
  const columnChartData = statistics?.durationDistribution || [];
  const barChartData = statistics?.executionPerformance || [];
  const comboData = statistics?.ratingOverview || [];
  const participationData = statistics?.participationTrend || [];

  const statCards = getTourScheduleStatisticsData(statistics);

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
    "ts",
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
        message="Loading tour schedule statistics..."
        subMessage="Tour Schedules"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Tour Schedule-specific Styles */
        .ts-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { .ts-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .ts-stats-grid { grid-template-columns: 1fr; } }

        .ts-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
        }

        .ts-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .ts-charts-grid { grid-template-columns: 1fr; }
        }

        .ts-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .ts-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="ts-root">
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
                  title="Tour Schedules"
                  description="Manage and analyze tour schedule performance"
                  breadcrumbItems={TOUR_SCHEDULE_PAGE_BREADCRUMB_DATA}
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
                  prefix="ts"
                />
                <div className="ts-actions-grid">
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
                <div className="ts-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="ts"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="ts-mt-8">
                  <SectionHeader
                    title="Schedule Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="ts"
                  />
                  <div className="ts-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`ts-stat-card ts-stat-card--${card.accent}`}
                      >
                        <div
                          className={`ts-stat-icon ts-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="ts-stat-value">
                          {card.title === "Average Rating" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={1}
                              />
                              <span className="ts-stat-suffix">{card.suffix}</span>
                            </>
                          ) : card.title === "Utilization Rate" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={0}
                              />
                              <span className="ts-stat-suffix">{card.suffix}</span>
                            </>
                          ) : (
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                            />
                          )}
                        </div>
                        <div className="ts-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Line Chart (Schedule Timeline) + Column Chart (Duration Distribution) */}
                <Reveal delay={180}>
                  <section className="ts-mt-8">
                    <SectionHeader
                      title="Timeline & Duration Analysis"
                      subtitle="Schedule trends and duration distribution"
                      prefix="ts"
                    />
                    <div className="ts-charts-grid">
                      {/* Line Chart - Schedule Timeline */}
                      <div className="ts-chart-card">
                        <div className="ts-chart-header">
                          <div className="ts-chart-title">
                            <span className="ts-chart-dot ts-chart-dot--p" />
                            Schedule Timeline
                          </div>
                          <span className="ts-chart-sub">Over time</span>
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
                                  dataKey="scheduleDate"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                  }}
                                />
                                <YAxis
                                  tick={{ fontSize: 11, fill: textSecondary }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={40}
                                />
                                <Tooltip content={<TourScheduleLineTooltip />} />
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
                          <div className="ts-empty-state">
                            <p className="ts-empty-text">No timeline data available</p>
                          </div>
                        )}
                      </div>

                      {/* Column Chart - Duration Distribution */}
                      <div className="ts-chart-card">
                        <div className="ts-chart-header">
                          <div className="ts-chart-title">
                            <span className="ts-chart-dot ts-chart-dot--acc" />
                            Duration Distribution
                          </div>
                          <span className="ts-chart-sub">Schedule duration ranges</span>
                        </div>
                        {columnChartData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={columnChartData}
                                margin={{ top: 4, right: 4, bottom: 40, left: 0 }}
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
                                  dataKey="durationStart"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  tickFormatter={(value, index) => {
                                    const dataPoint = columnChartData[index];
                                    return `${dataPoint.durationStart}-${dataPoint.durationEnd}h`;
                                  }}
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
                                <Tooltip content={<TourScheduleDurationTooltip />} />
                                <Bar
                                  dataKey="totalSchedules"
                                  fill="url(#durationGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Schedules"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ts-empty-state">
                            <p className="ts-empty-text">No duration data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Bar Chart (Execution Performance) + Combo Chart (Rating Overview) */}
                <Reveal delay={240}>
                  <section className="ts-mt-7">
                    <SectionHeader
                      title="Performance & Quality"
                      subtitle="Execution performance and rating overview"
                      prefix="ts"
                    />
                    <div className="ts-charts-grid">
                      {/* Bar Chart - Execution Performance */}
                      <div className="ts-chart-card">
                        <div className="ts-chart-header">
                          <div className="ts-chart-title">
                            <span className="ts-chart-dot ts-chart-dot--p" />
                            Execution Performance
                          </div>
                          <span className="ts-chart-sub">Completed instances by schedule</span>
                        </div>
                        {barChartData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={barChartData}
                                layout="vertical"
                                margin={{ top: 4, right: 30, bottom: 4, left: 120 }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient id="executionGrad" x1="0" y1="0" x2="1" y2="0">
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
                                <Tooltip content={<TourScheduleExecutionTooltip />} />
                                <Bar
                                  dataKey="completedInstances"
                                  fill="url(#executionGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Completed Instances"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="ts-empty-state">
                            <p className="ts-empty-text">No execution data available</p>
                          </div>
                        )}
                      </div>

                      {/* Combo Chart - Rating Overview */}
                      <div className="ts-chart-card">
                        <div className="ts-chart-header">
                          <div className="ts-chart-title">
                            <span className="ts-chart-dot ts-chart-dot--acc" />
                            Rating Overview
                          </div>
                          <span className="ts-chart-sub">Average rating & review count</span>
                        </div>
                        {comboData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={comboData}
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
                                    style: { fill: textSecondary, fontSize: 11 },
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
                                    style: { fill: textSecondary, fontSize: 11 },
                                  }}
                                />
                                <Tooltip content={<TourScheduleRatingTooltip />} />
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
                          <div className="ts-empty-state">
                            <p className="ts-empty-text">No rating data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Line/Area Chart - Participation Trend */}
                <Reveal delay={300}>
                  <section className="ts-mt-7">
                    <SectionHeader
                      title="Participation Trend"
                      subtitle="Participant engagement across schedules"
                      prefix="ts"
                    />
                    <div className="ts-chart-card">
                      <div className="ts-chart-header">
                        <div className="ts-chart-title">
                          <span className="ts-chart-dot ts-chart-dot--p" />
                          Participation Analysis
                        </div>
                        <span className="ts-chart-sub">{participationData.length} schedules</span>
                      </div>
                      {participationData.length > 0 ? (
                        <div style={{ height: 400 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={participationData}
                              margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
                            >
                              <defs>
                                <linearGradient id="participationGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={p} stopOpacity={0.3} />
                                  <stop offset="100%" stopColor={p} stopOpacity={0.02} />
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
                                tick={{ fontSize: 11, fill: textSecondary }}
                                axisLine={false}
                                tickLine={false}
                                width={45}
                                tickFormatter={(value) => value.toLocaleString()}
                                label={{
                                  value: "Participants",
                                  angle: -90,
                                  position: "insideLeft",
                                  style: { fill: textSecondary, fontSize: 11 },
                                }}
                              />
                              <Tooltip content={<TourScheduleParticipationTooltip />} />
                              <Legend verticalAlign="top" height={36} />
                              <Area
                                type="monotone"
                                dataKey="totalParticipants"
                                stroke={p}
                                strokeWidth={2.5}
                                fill="url(#participationGrad)"
                                name="Participants (Trend)"
                                animationBegin={300}
                                animationDuration={900}
                              />
                              <Bar
                                dataKey="totalParticipants"
                                fill={p}
                                fillOpacity={0.4}
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                                name="Participants (Count)"
                                animationBegin={400}
                                animationDuration={900}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="ts-empty-state">
                          <p className="ts-empty-text">No participation data available</p>
                        </div>
                      )}
                    </div>
                  </section>
                </Reveal>
              </>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={360}>
              <section className="ts-mt-7">
                <InfoBanner
                  title="Tour Schedule Management"
                  description="Manage tour schedules, track timeline trends, analyze duration distributions, and monitor execution performance. The participation trend chart shows participant engagement across different schedules. Use the quick actions above to create new schedules, update existing ones, or remove outdated schedules. Statistics and charts reflect real-time data from your backend and update each time you visit this page."
                  prefix="ts"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToursSchedulesPage;