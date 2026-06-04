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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Area,
} from "recharts";
import { ActivityScheduleStatisticsData } from "@/types/activity-types";
import { ActivityService } from "@/services/activityService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { ACTIVITY_SCHEDULE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getActivityScheduleStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  PieChartCard,
  getStatisticsStyles,
  GanttChart,
  ActivityScheduleLineTooltip,
  ActivityScheduleBarTooltip,
  ActivityScheduleRadarTooltip,
} from "@/components/statistics-components";

const ActivitiesSchedulePage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<ActivityScheduleStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activitiesData = contentManagementSideBarData.find(
    (item) => item.name === "Activity Schedules",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await ActivityService.getActivityScheduleStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the schedule statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const lineChartData = statistics?.participationTrends || [];
  const barChartData = statistics?.popularActivities || [];
  const radarData = statistics?.activityRatings || [];
  const pieChartData = statistics?.statusDistributions || [];
  const ganttData = statistics?.scheduleTimelines || [];

  /* Chart Colors */
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#FDA4AF",
    "#60A5FA",
    "#FBBF24",
    "#34D399",
  ];

  const statCards = getActivityScheduleStatisticsData(statistics);

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
    "as",
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
        message="Loading schedule statistics..."
        subMessage="Activity Schedules"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Activity Schedule-specific Styles */
        .as-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { .as-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .as-stats-grid { grid-template-columns: 1fr; } }

        .as-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
        }

        .as-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .as-charts-grid { grid-template-columns: 1fr; }
        }

        /* Gantt Chart Styles */
        .as-gantt-container {
          width: 100%;
          overflow-x: auto;
        }
        .as-gantt-header {
          display: flex;
          border-bottom: 2px solid var(--border);
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .as-gantt-label-col {
          width: 200px;
          flex-shrink: 0;
          font-weight: 600;
          color: var(--text);
          font-size: 0.8125rem;
        }
        .as-gantt-timeline-col {
          flex: 1;
          position: relative;
          display: flex;
        }
        .as-gantt-timeline-marker {
          flex: 1;
          font-size: 0.7rem;
          color: var(--muted);
          text-align: center;
        }
        .as-gantt-body {
          max-height: 400px;
          overflow-y: auto;
        }
        .as-gantt-row {
          display: flex;
          align-items: center;
          min-height: 60px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s ease;
        }
        .as-gantt-row:hover {
          background: ${hexToRgba(p, 0.04)};
        }
        .as-gantt-label {
          padding: 0.5rem;
        }
        .as-gantt-label-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.875rem;
        }
        .as-gantt-label-activity {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 2px;
        }
        .as-gantt-timeline-bar-container {
          position: relative;
          width: 100%;
          height: 40px;
          margin: 0.5rem 0;
        }
        .as-gantt-timeline-bar {
          position: absolute;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
          min-width: 40px;
        }
        .as-gantt-timeline-bar:hover {
          filter: brightness(0.95);
          transform: scaleY(1.05);
        }
        .as-gantt-bar-label {
          font-size: 0.7rem;
          color: white;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 8px;
        }

        .as-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .as-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="as-root">
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
                  title="Activity Schedule"
                  description="Manage and analyze activity schedules and timelines"
                  breadcrumbItems={ACTIVITY_SCHEDULE_PAGE_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any activity management task"
                  badge={`${activitiesData?.subData.length ?? 0} actions`}
                  prefix="as"
                />
                <div className="as-actions-grid">
                  {activitiesData?.subData.map((action) => {
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
                <div className="as-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="as"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="as-mt-8">
                  <SectionHeader
                    title="Schedule Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="as"
                  />
                  <div className="as-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`as-stat-card as-stat-card--${card.accent}`}
                      >
                        <div
                          className={`as-stat-icon as-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="as-stat-value">
                          {card.title === "Overall Rating" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={1}
                              />
                              <span className="as-stat-suffix">
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
                        <div className="as-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Line Chart + Bar Chart */}
                <Reveal delay={180}>
                  <section className="as-mt-8">
                    <SectionHeader
                      title="Participation Analytics"
                      subtitle="Trends and popular activities"
                      prefix="as"
                    />
                    <div className="as-charts-grid">
                      {/* Line Chart - Participation Trends */}
                      <div className="as-chart-card">
                        <div className="as-chart-header">
                          <div className="as-chart-title">
                            <span className="as-chart-dot as-chart-dot--p" />
                            Participation Trends
                          </div>
                          <span className="as-chart-sub">Over time</span>
                        </div>
                        {lineChartData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={lineChartData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 20,
                                  left: 10,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="lineGradient"
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
                                  dataKey="activityDate"
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
                                <Tooltip
                                  content={<ActivityScheduleLineTooltip />}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="totalParticipants"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#lineGradient)"
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
                          <div className="as-empty-state">
                            <p className="as-empty-text">
                              No trend data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Popular Activities */}
                      <div className="as-chart-card">
                        <div className="as-chart-header">
                          <div className="as-chart-title">
                            <span className="as-chart-dot as-chart-dot--acc" />
                            Popular Activities
                          </div>
                          <span className="as-chart-sub">
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
                                  left: 100,
                                }}
                                barSize={28}
                              >
                                <defs>
                                  <linearGradient
                                    id="barGradient"
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
                                />
                                <YAxis
                                  type="category"
                                  dataKey="activityName"
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
                                  content={<ActivityScheduleBarTooltip />}
                                />
                                <Bar
                                  dataKey="totalParticipants"
                                  fill="url(#barGradient)"
                                  radius={[0, 6, 6, 0]}
                                  name="Participants"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="as-empty-state">
                            <p className="as-empty-text">
                              No popular activity data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Radar Chart + Pie Chart */}
                <Reveal delay={240}>
                  <section className="as-mt-7">
                    <SectionHeader
                      title="Quality & Distribution"
                      subtitle="Rating overview and status distribution"
                      prefix="as"
                    />
                    <div className="as-charts-grid">
                      {/* Radar Chart - Rating Overview */}
                      <div className="as-chart-card">
                        <div className="as-chart-header">
                          <div className="as-chart-title">
                            <span className="as-chart-dot as-chart-dot--p" />
                            Activity Ratings
                          </div>
                          <span className="as-chart-sub">
                            Average rating (1-5)
                          </span>
                        </div>
                        {radarData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart
                                data={radarData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 20,
                                  left: 30,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="radarGrad"
                                    x1="0"
                                    y1="0"
                                    x2="1"
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
                                      stopOpacity={0.05}
                                    />
                                  </linearGradient>
                                </defs>
                                <PolarGrid stroke={hexToRgba(border, 0.6)} />
                                <PolarAngleAxis
                                  dataKey="activityName"
                                  tick={{
                                    fontSize: 9,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                />
                                <PolarRadiusAxis
                                  angle={30}
                                  domain={[0, 5]}
                                  tick={{
                                    fontSize: 10,
                                    fill: textSecondary,
                                  }}
                                  axisLine={false}
                                />
                                <Radar
                                  name="Average Rating"
                                  dataKey="averageRating"
                                  stroke={p}
                                  strokeWidth={2.5}
                                  fill="url(#radarGrad)"
                                  fillOpacity={0.6}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                                <Tooltip
                                  content={<ActivityScheduleRadarTooltip />}
                                />
                                <Legend
                                  verticalAlign="bottom"
                                  height={36}
                                  formatter={() => (
                                    <span
                                      style={{
                                        color: textSecondary,
                                        fontSize: 11,
                                      }}
                                    >
                                      Rating out of 5.0
                                    </span>
                                  )}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="as-empty-state">
                            <p className="as-empty-text">
                              No rating data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Status Distribution */}
                      <PieChartCard
                        data={pieChartData}
                        colors={PIE_COLORS}
                        title="Status Distribution"
                        total={pieChartData.reduce(
                          (sum, item) => sum + item.totalCount,
                          0,
                        )}
                        prefix="as"
                      />
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Gantt Chart - Schedule Timeline */}
                <Reveal delay={300}>
                  <section className="as-mt-7">
                    <SectionHeader
                      title="Schedule Timeline"
                      subtitle="Activity schedule visualization"
                      prefix="as"
                    />
                    <div className="as-chart-card">
                      <div className="as-chart-header">
                        <div className="as-chart-title">
                          <span className="as-chart-dot as-chart-dot--p" />
                          Timeline View
                        </div>
                        <span className="as-chart-sub">
                          {ganttData.length} schedules
                        </span>
                      </div>
                      {ganttData.length > 0 ? (
                        <GanttChart data={ganttData} prefix="as" />
                      ) : (
                        <div className="as-empty-state">
                          <p className="as-empty-text">
                            No schedule data available
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
              <section className="as-mt-7">
                <InfoBanner
                  title="Schedule Management"
                  description="Manage activity schedules, track participation trends, and monitor performance metrics. The Gantt chart provides a visual timeline of all scheduled activities. Use the quick actions above to create new schedules, edit existing ones, or remove outdated schedules. Statistics and charts reflect real-time data from your backend and update each time you visit this page."
                  prefix="as"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivitiesSchedulePage;
