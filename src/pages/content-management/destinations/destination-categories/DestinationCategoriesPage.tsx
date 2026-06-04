"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DestinationCategoriesStatisticsData } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { DESTINATION_CATEGORY_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getDestinationCategoriesStatisticsData } from "@/data/statistics-data";
import CommonLoading from "@/components/common-components/CommonLoading";
import {
  AnimatedCount,
  SectionHeader,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  getStatisticsStyles,
  DestCategoryBarTooltip,
  DestCategoryLineTooltip,
} from "@/components/statistics-components";

const DestinationCategoriesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<DestinationCategoriesStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredLinePoint, setHoveredLinePoint] = useState<string | null>(null);

  const destinationsData = contentManagementSideBarData.find(
    (item) => item.name === "Destinations",
  );
  const categoriesData = destinationsData?.subData.find(
    (item) => item.name === "Destination Categories",
  );
  const categoryActions = categoriesData?.grandSubData || [];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await DestinationService.getDestinationCategoriesStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the category statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categoryUsageData = statistics?.categoryUsedDetails
    ? [...statistics.categoryUsedDetails].sort((a, b) => b.count - a.count)
    : [];

  const imagesCountData = statistics?.categoriesImagesCounts
    ? [...statistics.categoriesImagesCounts].sort(
        (a, b) => b.imagesCount - a.imagesCount,
      )
    : [];

  const statCards = getDestinationCategoriesStatisticsData(statistics);

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
    "dc",
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

  const getBarColor = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (hoveredBar === categoryName && hoverColor && hoverColor !== "#000000") {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : hexToRgba(p, 0.85);
  };

  const getLineColor = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (
      hoveredLinePoint === categoryName &&
      hoverColor &&
      hoverColor !== "#000000"
    ) {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : successColor;
  };

  const getDotFill = (
    categoryName: string,
    defaultColor: string,
    hoverColor: string,
  ) => {
    if (
      hoveredLinePoint === categoryName &&
      hoverColor &&
      hoverColor !== "#000000"
    ) {
      return hoverColor;
    }
    return defaultColor && defaultColor !== "#000000"
      ? defaultColor
      : successColor;
  };

  if (loading) {
    return (
      <CommonLoading
        message="Loading destination category statistics..."
        subMessage="Destination Categories"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{`
        ${styles}

        /* Additional Destination Category-specific Styles */
        .dc-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1200px) { .dc-stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .dc-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px)  { .dc-stats-grid { grid-template-columns: 1fr; } }

        .dc-charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 860px) { .dc-charts-row { grid-template-columns: 1fr; } }

        .dc-fade-up {
          animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .dc-delay-1 { animation-delay: 0.05s; }
        .dc-delay-2 { animation-delay: 0.1s; }
        .dc-delay-3 { animation-delay: 0.15s; }
        .dc-delay-4 { animation-delay: 0.2s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .stats-tooltip__color {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          margin-top: 6px;
        }
      `}</style>

      <div className="dc-root">
        <div>
          <div
            className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
            style={{
              backgroundColor: `${theme.surface}D9`,
              borderColor: theme.border,
            }}
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <PageHeader
                title="Destination Categories"
                description="Manage and monitor destination category classifications"
                breadcrumbItems={DESTINATION_CATEGORY_PAGE_BREADCRUMB_DATA}
              />
            </div>
          </div>

          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="dc-fade-up dc-delay-1">
              <SectionHeader
                title="Quick Actions"
                subtitle="Manage destination categories with these tools"
                badge={`${categoryActions.length} actions`}
                prefix="dc"
              />
              <div className="dc-actions-grid">
                {categoryActions.map((action) => {
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

            {error && (
              <div className="dc-mt-6 dc-fade-up">
                <ErrorBanner
                  error={error}
                  onRetry={fetchStatistics}
                  prefix="dc"
                />
              </div>
            )}

            {!error && (
              <section className="dc-mt-8 dc-fade-up dc-delay-2">
                <SectionHeader
                  title="Category Statistics"
                  subtitle="Live counts across all destination categories"
                  badge="Live"
                  prefix="dc"
                />
                <div className="dc-stats-grid">
                  {statCards.map((card, i) => (
                    <div
                      key={i}
                      className={`dc-stat-card dc-stat-card--${card.accent} dc-fade-up`}
                      style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                    >
                      <div
                        className={`dc-stat-icon dc-stat-icon--${card.accent}`}
                      >
                        {card.icon}
                      </div>
                      <div className="dc-stat-value">
                        <AnimatedCount
                          value={card.value}
                          duration={900 + i * 80}
                        />
                      </div>
                      <div className="dc-stat-label">{card.title}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!error && statistics && (
              <section className="dc-mt-8 dc-fade-up dc-delay-3">
                <SectionHeader
                  title="Analytics Overview"
                  subtitle="Category usage distribution and image count breakdown"
                  prefix="dc"
                />
                <div className="dc-charts-row">
                  <div className="dc-chart-card">
                    <div className="dc-chart-header">
                      <div className="dc-chart-title">
                        <span className="dc-chart-dot dc-chart-dot--p" />
                        Destinations by Category
                      </div>
                      <span className="dc-chart-sub">
                        {
                          statistics.destinationCategoriesDetails
                            .totalDestinationCategoriesCount
                        }{" "}
                        categories
                      </span>
                    </div>
                    <div
                      style={{
                        height: Math.max(340, categoryUsageData.length * 35),
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryUsageData}
                          layout="vertical"
                          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={hexToRgba(border, 0.8)}
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            tick={{
                              fontSize: 11,
                              fill: textSecondary,
                              fontWeight: 500,
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="categoryName"
                            tick={{ fontSize: 11, fill: textSecondary }}
                            axisLine={false}
                            tickLine={false}
                            width={120}
                            tickFormatter={(v: string) =>
                              v.length > 20 ? v.slice(0, 18) + "…" : v
                            }
                          />
                          <Tooltip content={<DestCategoryBarTooltip />} />
                          <Bar
                            dataKey="count"
                            radius={[0, 7, 7, 0]}
                            name="Destinations"
                            barSize={categoryUsageData.length > 15 ? 18 : 24}
                            onMouseEnter={(data, index) => {
                              if (data && categoryUsageData[index]) {
                                setHoveredBar(
                                  categoryUsageData[index].categoryName,
                                );
                              }
                            }}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {categoryUsageData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getBarColor(
                                  entry.categoryName,
                                  entry.color,
                                  entry.hoverColor,
                                )}
                                style={{ transition: "fill 0.2s ease" }}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="dc-chart-card">
                    <div className="dc-chart-header">
                      <div className="dc-chart-title">
                        <span className="dc-chart-dot dc-chart-dot--ok" />
                        Images per Category
                      </div>
                      <span className="dc-chart-sub">
                        {imagesCountData.length} categories
                      </span>
                    </div>
                    <div style={{ height: 340 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={imagesCountData}
                          margin={{ top: 4, right: 16, bottom: 80, left: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={hexToRgba(border, 0.8)}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="categoryName"
                            tick={{ fontSize: 11, fill: textSecondary }}
                            axisLine={false}
                            tickLine={false}
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                            tickFormatter={(v: string) =>
                              v.length > 15 ? v.slice(0, 12) + "…" : v
                            }
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: textSecondary,
                              fontWeight: 500,
                            }}
                            axisLine={false}
                            tickLine={false}
                            width={36}
                          />
                          <Tooltip content={<DestCategoryLineTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="imagesCount"
                            strokeWidth={2.5}
                            dot={(props: any) => {
                              const { cx, cy, payload, index } = props;
                              const isHovered =
                                hoveredLinePoint === payload.categoryName;
                              const fillColor = getDotFill(
                                payload.categoryName,
                                payload.color,
                                payload.hoverColor,
                              );
                              return (
                                <circle
                                  key={`dot-${index}`}
                                  cx={cx}
                                  cy={cy}
                                  r={isHovered ? 6 : 4}
                                  fill={fillColor}
                                  stroke={surf}
                                  strokeWidth={2}
                                  onMouseEnter={() =>
                                    setHoveredLinePoint(payload.categoryName)
                                  }
                                  onMouseLeave={() => setHoveredLinePoint(null)}
                                  style={{
                                    transition: "r 0.2s ease, fill 0.2s ease",
                                    cursor: "pointer",
                                  }}
                                />
                              );
                            }}
                            activeDot={false}
                            name="Images"
                          >
                            {imagesCountData.map((entry, index) => (
                              <Cell
                                key={`line-${index}`}
                                stroke={getLineColor(
                                  entry.categoryName,
                                  entry.color,
                                  entry.hoverColor,
                                )}
                                style={{ transition: "stroke 0.2s ease" }}
                              />
                            ))}
                          </Line>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="dc-mt-7 dc-fade-up dc-delay-4">
              <InfoBanner
                title="Category Management"
                description="Destination categories help organize locations by type (beaches, mountains, historical sites, etc.). Use the quick-action cards above to view, create, edit, or remove categories. The charts above show how many destinations belong to each category and how many images are associated with each category. Each category has its own color that changes on hover for better visual distinction."
                prefix="dc"
              />
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationCategoriesPage;
