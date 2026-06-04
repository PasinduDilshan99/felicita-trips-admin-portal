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
} from "recharts";
import { TourStatisticsData } from "@/types/tour-types";
import { TourService } from "@/services/tourService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { getTourStatisticsData } from "@/data/statistics-data";
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
  TourBarTooltip,
  TourCategoryTooltip,
  LocationHeatmap,
} from "@/components/statistics-components";

const ToursPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<TourStatisticsData | null>(null);
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
      const response = await TourService.getTourStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the tour statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Chart data transformations */
  const barChartData = statistics?.tourPopularity || [];
  const pieChartData = statistics?.bookingStatusDistribution || [];
  const categoryBarData = statistics?.categoryPerformance || [];
  const locationData = statistics?.locationDistribution || [];

  /* Chart Colors */
  const PIE_COLORS = [
    theme.primary ?? "#0D4E4A",
    "#FDA4AF",
    "#60A5FA",
    "#FBBF24",
    "#34D399",
    "#A78BFA",
  ];

  const statCards = getTourStatisticsData(statistics);

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
    "tr",
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
        message="Loading tour statistics..."
        subMessage="Tours"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Tour-specific Styles */
        .tr-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { .tr-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .tr-stats-grid { grid-template-columns: 1fr; } }

        .tr-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
        }

        .tr-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .tr-charts-grid { grid-template-columns: 1fr; }
        }

        /* Heatmap Styles */
        .tr-heatmap-container {
          width: 100%;
        }
        .tr-heatmap-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .tr-heatmap-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .tr-heatmap-bar {
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          transition: all 0.3s ease;
          min-width: 40px;
        }
        .tr-heatmap-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${isDarkMode ? "#fff" : "#1f2937"};
        }
        .tr-heatmap-label {
          min-width: 120px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
        }
        @media (max-width: 640px) {
          .tr-heatmap-label {
            min-width: 80px;
            font-size: 0.75rem;
          }
          .tr-heatmap-bar {
            height: 32px;
          }
        }

        .tr-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surf);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }
        .tr-empty-text {
          color: var(--muted);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="tr-root">
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
                  title="Tours"
                  description="Manage and analyze tour performance and statistics"
                  breadcrumbItems={TOUR_PAGE_BREADCRUMB_DATA}
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
                  prefix="tr"
                />
                <div className="tr-actions-grid">
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
                <div className="tr-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="tr"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="tr-mt-8">
                  <SectionHeader
                    title="Tour Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="tr"
                  />
                  <div className="tr-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`tr-stat-card tr-stat-card--${card.accent}`}
                      >
                        <div
                          className={`tr-stat-icon tr-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="tr-stat-value">
                          {card.title === "Average Rating" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={1}
                              />
                              <span className="tr-stat-suffix">
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
                        <div className="tr-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts Section ── */}
            {!error && statistics && (
              <>
                {/* Row 1: Bar Chart (Tour Popularity) + Pie Chart (Booking Status) */}
                <Reveal delay={180}>
                  <section className="tr-mt-8">
                    <SectionHeader
                      title="Tour Analytics"
                      subtitle="Popularity and booking status breakdown"
                      prefix="tr"
                    />
                    <div className="tr-charts-grid">
                      {/* Bar Chart - Tour Popularity */}
                      <div className="tr-chart-card">
                        <div className="tr-chart-header">
                          <div className="tr-chart-title">
                            <span className="tr-chart-dot tr-chart-dot--p" />
                            Tour Popularity
                          </div>
                          <span className="tr-chart-sub">
                            By total bookings
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
                                />
                                <YAxis
                                  type="category"
                                  dataKey="tourName"
                                  tick={{
                                    fontSize: 11,
                                    fill: textSecondary,
                                    fontWeight: 500,
                                  }}
                                  axisLine={false}
                                  tickLine={false}
                                  width={95}
                                />
                                <Tooltip content={<TourBarTooltip />} />
                                <Bar
                                  dataKey="totalBookings"
                                  fill="url(#popularityGrad)"
                                  radius={[0, 6, 6, 0]}
                                  name="Bookings"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="tr-empty-state">
                            <p className="tr-empty-text">
                              No tour popularity data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Booking Status Distribution */}
                      <PieChartCard
                        data={pieChartData}
                        colors={PIE_COLORS}
                        title="Booking Status"
                        total={pieChartData.reduce(
                          (sum, item) => sum + item.totalCount,
                          0,
                        )}
                        prefix="tr"
                      />
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Bar Chart (Category Performance) */}
                <Reveal delay={240}>
                  <section className="tr-mt-7">
                    <SectionHeader
                      title="Category Analysis"
                      subtitle="Performance by category"
                      prefix="tr"
                    />
                    <div className="tr-charts-grid">
                      <div className="tr-chart-card">
                        <div className="tr-chart-header">
                          <div className="tr-chart-title">
                            <span className="tr-chart-dot tr-chart-dot--p" />
                            Category Performance
                          </div>
                          <span className="tr-chart-sub">
                            Tours per category
                          </span>
                        </div>
                        {categoryBarData.length > 0 ? (
                          <div style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={categoryBarData}
                                margin={{
                                  top: 4,
                                  right: 4,
                                  bottom: 60,
                                  left: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="categoryGrad"
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
                                <Tooltip content={<TourCategoryTooltip />} />
                                <Bar
                                  dataKey="totalTours"
                                  fill="url(#categoryGrad)"
                                  radius={[7, 7, 0, 0]}
                                  name="Tours"
                                  animationBegin={300}
                                  animationDuration={900}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="tr-empty-state">
                            <p className="tr-empty-text">
                              No category data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Placeholder for future chart */}
                      <div className="tr-chart-card">
                        <div className="tr-chart-header">
                          <div className="tr-chart-title">
                            <span className="tr-chart-dot tr-chart-dot--acc" />
                            Additional Metrics
                          </div>
                          <span className="tr-chart-sub">Coming soon</span>
                        </div>
                        <div className="tr-empty-state">
                          <p className="tr-empty-text">
                            More analytics coming soon
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </Reveal>

                {/* Row 3: Heatmap - Location Distribution */}
                <Reveal delay={300}>
                  <section className="tr-mt-7">
                    <SectionHeader
                      title="Location Distribution"
                      subtitle="Tours by start location (heatmap view)"
                      prefix="tr"
                    />
                    <div className="tr-chart-card">
                      <div className="tr-chart-header">
                        <div className="tr-chart-title">
                          <span className="tr-chart-dot tr-chart-dot--p" />
                          Location Heatmap
                        </div>
                        <span className="tr-chart-sub">
                          {locationData.length} locations
                        </span>
                      </div>
                      {locationData.length > 0 ? (
                        <LocationHeatmap data={locationData} prefix="tr" />
                      ) : (
                        <div className="tr-empty-state">
                          <p className="tr-empty-text">
                            No location data available
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
              <section className="tr-mt-7">
                <InfoBanner
                  title="Tour Management"
                  description="Manage all tours, track popularity, monitor booking status, and analyze performance by category, type, and location. Use the quick actions above to create new tours, update existing ones, or remove outdated tours. Statistics and charts reflect real-time data from your backend and update each time you visit this page."
                  prefix="tr"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToursPage;
