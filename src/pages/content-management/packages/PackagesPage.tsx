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
  Line,
} from "recharts";
import { PackageStatisticsData } from "@/types/package-types";
import { PackageService } from "@/services/packageService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { PACKAGE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  PieChartCard,
  getStatisticsStyles,
  PackageBarTooltip,
  PackageComboTooltip,
  PackagePriceTooltip,
  CapacityGauge,
} from "@/components/statistics-components";
import CommonLoading from "@/components/common-components/CommonLoading";
import { getPackageStatisticsData } from "@/data/statistics-data";

const PackagesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<PackageStatisticsData | null>(
    null,
  );
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

  const statCards = getPackageStatisticsData(statistics);

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
    "pk",
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
        message="Loading package statistics..."
        subMessage="Packages"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Package-specific Styles */
        .pk-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .pk-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .pk-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px)  { .pk-stats-grid { grid-template-columns: 1fr; } }

        .pk-stat-prefix {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--muted);
          margin-right: 2px;
        }
        .pk-stat-suffix {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          margin-left: 4px;
        }

        .pk-charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .pk-charts-grid { grid-template-columns: 1fr; }
        }

        .pk-capacity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .stats-tooltip__sub {
          font-size: .75rem;
          color: #94a3b8;
          margin-top: 4px;
        }
      `}</style>

      <div className="pk-root">
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
                  breadcrumbItems={PACKAGE_PAGE_BREADCRUMB_DATA}
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
                  prefix="pk"
                />
                <div className="pk-actions-grid">
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
                <div className="pk-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="pk"
                  />
                </div>
              </Reveal>
            )}

            {/* ── KPI Summary Cards ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="pk-mt-8">
                  <SectionHeader
                    title="Package Overview"
                    subtitle="Key metrics and performance indicators"
                    badge="Live"
                    live
                    prefix="pk"
                  />
                  <div className="pk-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`pk-stat-card pk-stat-card--${card.accent}`}
                      >
                        <div
                          className={`pk-stat-icon pk-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="pk-stat-value">
                          {card.prefix && (
                            <span className="pk-stat-prefix">
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
                              {card.suffix && (
                                <span className="pk-stat-suffix">
                                  {card.suffix}
                                </span>
                              )}
                            </>
                          ) : card.title === "Avg Package Price" ? (
                            <>
                              <AnimatedCount
                                value={card.value}
                                duration={950 + i * 70}
                                decimals={0}
                              />
                              {card.suffix && (
                                <span className="pk-stat-suffix">
                                  {card.suffix}
                                </span>
                              )}
                            </>
                          ) : (
                            <AnimatedCount
                              value={card.value}
                              duration={950 + i * 70}
                            />
                          )}
                        </div>
                        <div className="pk-stat-label">{card.title}</div>
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
                  <section className="pk-mt-8">
                    <SectionHeader
                      title="Popularity & Distribution"
                      subtitle="Package popularity and type distribution"
                      prefix="pk"
                    />
                    <div className="pk-charts-grid">
                      {/* Bar Chart - Package Popularity */}
                      <div className="pk-chart-card">
                        <div className="pk-chart-header">
                          <div className="pk-chart-title">
                            <span className="pk-chart-dot pk-chart-dot--p" />
                            Package Popularity
                          </div>
                          <span className="pk-chart-sub">
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
                                <Tooltip content={<PackageBarTooltip />} />
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
                          <div className="pk-empty-state">
                            <p className="pk-empty-text">
                              No popularity data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pie Chart - Package Type Distribution */}
                      <PieChartCard
                        data={pieChartData}
                        colors={PIE_COLORS}
                        title="Package Type Distribution"
                        total={pieChartData.reduce(
                          (sum, item) => sum + item.totalPackages,
                          0,
                        )}
                        prefix="pk"
                      />
                    </div>
                  </section>
                </Reveal>

                {/* Row 2: Combo Chart (Rating Overview) + Column Chart (Price Distribution) */}
                <Reveal delay={240}>
                  <section className="pk-mt-7">
                    <SectionHeader
                      title="Quality & Pricing Analysis"
                      subtitle="Rating overview and price distribution"
                      prefix="pk"
                    />
                    <div className="pk-charts-grid">
                      {/* Combo Chart - Package Rating Overview */}
                      <div className="pk-chart-card">
                        <div className="pk-chart-header">
                          <div className="pk-chart-title">
                            <span className="pk-chart-dot pk-chart-dot--p" />
                            Package Ratings
                          </div>
                          <span className="pk-chart-sub">
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
                                <Tooltip content={<PackageComboTooltip />} />
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
                          <div className="pk-empty-state">
                            <p className="pk-empty-text">
                              No rating data available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Column Chart - Price Distribution */}
                      <div className="pk-chart-card">
                        <div className="pk-chart-header">
                          <div className="pk-chart-title">
                            <span className="pk-chart-dot pk-chart-dot--acc" />
                            Price Distribution
                          </div>
                          <span className="pk-chart-sub">
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
                                <Tooltip content={<PackagePriceTooltip />} />
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
                          <div className="pk-empty-state">
                            <p className="pk-empty-text">
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
                  <section className="pk-mt-7">
                    <SectionHeader
                      title="Capacity Utilization"
                      subtitle="Package capacity and utilization rates"
                      prefix="pk"
                    />
                    <div className="pk-chart-card">
                      <div className="pk-chart-header">
                        <div className="pk-chart-title">
                          <span className="pk-chart-dot pk-chart-dot--p" />
                          Capacity Analysis
                        </div>
                        <span className="pk-chart-sub">
                          {capacityData.length} packages
                        </span>
                      </div>
                      {capacityData.length > 0 ? (
                        <div className="pk-capacity-grid">
                          {capacityData.map((item, idx) => (
                            <CapacityGauge
                              key={idx}
                              packageName={item.packageName}
                              minCapacity={item.minPersonCount}
                              maxCapacity={item.maxPersonCount}
                              averageParticipants={item.averageParticipants}
                              prefix="pk"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="pk-empty-state">
                          <p className="pk-empty-text">
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
              <section className="pk-mt-7">
                <InfoBanner
                  title="Package Management"
                  description="Manage travel packages, track popularity, monitor ratings, analyze pricing, and optimize capacity utilization. Packages combine multiple tours and activities into bundled experiences. Use the quick actions above to create new packages, update existing ones, or remove outdated packages. The capacity gauges show utilization rates to help optimize package sizes and pricing strategies."
                  prefix="pk"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagesPage;
