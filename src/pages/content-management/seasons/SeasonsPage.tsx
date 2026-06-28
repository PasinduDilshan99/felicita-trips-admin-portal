"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { SeasonService } from "@/services/seasonService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getSeasonStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  SeasonBarTooltip,
  SeasonTourTooltip,
  SeasonPopularityTooltip,
  PeakSeasonTooltip,
} from "@/components/statistics-components";
import { SeasonStatisticsData } from "@/types/season-types";
import { SEASON_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const SeasonsPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<SeasonStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const seasonsData = contentManagementSideBarData.find(
    (item) => item.name === "Seasons",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await SeasonService.getSeasonStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the season statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const activityChartData = statistics?.seasonActivityCounts || [];
  const tourChartData = statistics?.seasonTourCounts || [];
  const popularityData = statistics?.seasonPopularities || [];
  const peakSeasonData = statistics?.peakSeasonDistributions || [];
  const weatherData = statistics?.seasonWeatherOverviews || [];

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

  const statCards = getSeasonStatisticsData(statistics);

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
    "sn",
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
        message="Loading season statistics..."
        subMessage="Seasons"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Prevent horizontal scrolling */
        .sn-root {
          overflow-x: hidden;
          max-width: 100%;
        }

        /* Additional Season-specific Styles */
        .sn-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .sn-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .sn-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .sn-stats-grid { grid-template-columns: 1fr; } }

        .sn-stat-value--text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--p);
          word-break: break-word;
        }

        .sn-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .sn-charts-grid { grid-template-columns: 1fr; }
        }

        .sn-chart-card-full {
          grid-column: 1 / -1;
        }

        /* Fix for chart containers to prevent overflow */
        .sn-chart-card {
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(15,23,42,.04);
          transition: box-shadow .22s ease;
          overflow-x: auto;
          overflow-y: hidden;
        }
        
        /* Hide scrollbar for chart containers when not needed */
        .sn-chart-card::-webkit-scrollbar {
          height: 4px;
        }
        
        .sn-chart-card::-webkit-scrollbar-track {
          background: var(--border);
          border-radius: 4px;
        }
        
        .sn-chart-card::-webkit-scrollbar-thumb {
          background: var(--p);
          border-radius: 4px;
        }

        .sn-chart-card:hover { 
          box-shadow: 0 6px 18px rgba(15,23,42,.07); 
        }

        .sn-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.375rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .sn-chart-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .9375rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -.012em;
        }
        
        .sn-chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .sn-chart-dot--p { background: var(--p); }
        .sn-chart-dot--acc { background: var(--acc); }
        
        .sn-chart-sub {
          font-size: .75rem;
          color: var(--muted);
          font-weight: 600;
          background: var(--bg);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
        }

        .sn-pie-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.125rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        
        .sn-pie-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: .8125rem;
          color: var(--muted);
          font-weight: 500;
        }
        
        .sn-pie-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        
        .sn-pie-legend-count {
          font-weight: 700;
          color: var(--text);
          margin-left: 2px;
        }

        /* Weather Card Styles */
        .sn-weather-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }
        .sn-weather-card {
          background: linear-gradient(135deg, var(--surf) 0%, var(--bg) 100%);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 1rem;
          transition: all 0.2s ease;
        }
        .sn-weather-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
        .sn-weather-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--p);
          display: inline-block;
        }
        .sn-weather-temp {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--p);
          margin: 0.5rem 0;
        }
        .sn-weather-rainfall {
          font-size: 0.875rem;
          color: var(--muted);
          margin: 0.25rem 0;
        }
        .sn-weather-summary {
          font-size: 0.8125rem;
          color: var(--text);
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
        }

        .sn-empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .sn-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }

        /* Action cards grid fix */
        .sn-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.125rem;
        }

        /* Fix for main container */
        .sn-root > div > div {
          overflow-x: hidden;
        }

        /* Ensure content doesn't overflow */
        .mx-auto {
          max-width: 100%;
          overflow-x: hidden;
        }

        /* Fix for XAxis long text */
        .recharts-xAxis .recharts-cartesian-axis-tick-value {
          white-space: nowrap;
        }
        
        /* Responsive chart container */
        .recharts-responsive-container {
          min-width: 0;
        }
      `}</style>

      <div className="sn-root">
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
                  title="Seasons"
                  description="Manage and analyze seasonal performance across activities and tours"
                  breadcrumbItems={SEASON_PAGE_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any season management task"
                  badge={`${seasonsData?.subData.length ?? 0} actions`}
                  prefix="sn"
                />
                <div className="sn-actions-grid">
                  {seasonsData?.subData.map((action) => {
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
                <div className="sn-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="sn"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="sn-mt-8">
                  <SectionHeader
                    title="Season Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="sn"
                  />
                  <div className="sn-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`sn-stat-card sn-stat-card--${card.accent}`}
                      >
                        <div
                          className={`sn-stat-icon sn-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        {card.valueText ? (
                          <div className="sn-stat-value sn-stat-value--text">
                            {card.valueText}
                          </div>
                        ) : (
                          <div className="sn-stat-value">
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                              decimals={card.title === "Average Rating" ? 1 : 0}
                            />
                            {card.suffix && (
                              <span className="sn-stat-suffix">
                                {card.suffix}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="sn-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Activity Count by Season + Tour Count by Season */}
                <Reveal delay={180}>
                  <section className="sn-mt-8">
                    <SectionHeader
                      title="Seasonal Distribution"
                      subtitle="Activities and tours across seasons"
                      prefix="sn"
                    />
                    <div className="sn-charts-grid">
                      {/* Bar Chart - Activity Count by Season */}
                      <div className="sn-chart-card">
                        <div className="sn-chart-header">
                          <div className="sn-chart-title">
                            <span className="sn-chart-dot sn-chart-dot--p" />
                            Activities by Season
                          </div>
                          <span className="sn-chart-sub">
                            {activityChartData.length} seasons
                          </span>
                        </div>
                        {activityChartData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={activityChartData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="activityGrad"
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
                                  dataKey="seasonName"
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
                                <Tooltip content={<SeasonBarTooltip />} />
                                <Bar
                                  dataKey="totalActivities"
                                  fill="url(#activityGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Activities"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="sn-empty-state">
                            <p className="sn-empty-text">
                              No activity data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bar Chart - Tour Count by Season */}
                      <div className="sn-chart-card">
                        <div className="sn-chart-header">
                          <div className="sn-chart-title">
                            <span className="sn-chart-dot sn-chart-dot--acc" />
                            Tours by Season
                          </div>
                          <span className="sn-chart-sub">
                            {tourChartData.length} seasons
                          </span>
                        </div>
                        {tourChartData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={tourChartData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="tourGrad"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor={acc}
                                      stopOpacity={0.9}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={acc}
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
                                  dataKey="seasonName"
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
                                <Tooltip content={<SeasonTourTooltip />} />
                                <Bar
                                  dataKey="totalTours"
                                  fill="url(#tourGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Tours"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="sn-empty-state">
                            <p className="sn-empty-text">
                              No tour data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Popularity Chart (Combo) + Peak Season Distribution (Pie) */}
                <Reveal delay={240}>
                  <section className="sn-mt-7">
                    <SectionHeader
                      title="Popularity & Peak Analysis"
                      subtitle="Season popularity metrics and peak season distribution"
                      prefix="sn"
                    />
                    <div className="sn-charts-grid">
                      {/* Combo Chart - Season Popularity */}
                      <div className="sn-chart-card">
                        <div className="sn-chart-header">
                          <div className="sn-chart-title">
                            <span className="sn-chart-dot sn-chart-dot--p" />
                            Season Popularity
                          </div>
                          <span className="sn-chart-sub">
                            Total usage across activities & tours
                          </span>
                        </div>
                        {popularityData.length > 0 ? (
                          <div style={{ width: "100%", height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart
                                data={popularityData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  bottom: 40,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="usageGrad"
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
                                  dataKey="seasonName"
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
                                />
                                <Tooltip
                                  content={<SeasonPopularityTooltip />}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Bar
                                  dataKey="totalUsage"
                                  fill="url(#usageGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Total Usage"
                                  barSize={30}
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="sn-empty-state">
                            <p className="sn-empty-text">
                              No popularity data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Peak Season Distribution */}
                      <div className="sn-chart-card">
                        <div className="sn-chart-header">
                          <div className="sn-chart-title">
                            <span className="sn-chart-dot sn-chart-dot--acc" />
                            Peak Season Distribution
                          </div>
                          <span className="sn-chart-sub">
                            Activity & tour peak seasons
                          </span>
                        </div>
                        {peakSeasonData.length > 0 ? (
                          <>
                            <div style={{ width: "100%", height: 280 }}>
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
                                    data={peakSeasonData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="activityCount"
                                    nameKey="seasonName"
                                    animationBegin={200}
                                    animationDuration={900}
                                  >
                                    {peakSeasonData.map((_, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#pieGrad-${index % PIE_COLORS.length})`}
                                        stroke={surf}
                                        strokeWidth={2}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<PeakSeasonTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="sn-pie-legend">
                              {peakSeasonData.map((item, i) => (
                                <div key={i} className="sn-pie-legend-item">
                                  <span
                                    className="sn-pie-legend-dot"
                                    style={{
                                      background:
                                        PIE_COLORS[i % PIE_COLORS.length],
                                    }}
                                  />
                                  {item.seasonName}
                                  <span className="sn-pie-legend-count">
                                    {item.activityCount.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="sn-empty-state">
                            <p className="sn-empty-text">
                              No peak season data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Weather Overview Cards */}
                <Reveal delay={300}>
                  <section className="sn-mt-7">
                    <SectionHeader
                      title="Weather Overview"
                      subtitle="Temperature ranges and weather patterns by season"
                      prefix="sn"
                    />
                    <div className="sn-chart-card sn-chart-card-full">
                      <div className="sn-weather-grid">
                        {weatherData.length > 0 ? (
                          weatherData.map((season, idx) => (
                            <div key={idx} className="sn-weather-card">
                              <div className="sn-weather-title">
                                {season.seasonName}
                              </div>
                              <div className="sn-weather-temp">
                                {season.temperatureMin}° -{" "}
                                {season.temperatureMax}°
                              </div>
                              <div className="sn-weather-rainfall">
                                🌧️ Rainfall: {season.rainfallPattern}
                              </div>
                              <div className="sn-weather-summary">
                                {season.weatherSummary}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="sn-empty-state">
                            <p className="sn-empty-text">
                              No weather data available
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
              <section className="sn-mt-7">
                <InfoBanner
                  title="Season Management"
                  description="Manage seasons and analyze their performance across activities and tours. Track seasonal distribution, popularity metrics, and weather patterns. Seasons help optimize scheduling and pricing based on demand. Use the quick actions above to add, edit, or remove seasons. The weather overview provides insights into optimal travel periods."
                  prefix="sn"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeasonsPage;