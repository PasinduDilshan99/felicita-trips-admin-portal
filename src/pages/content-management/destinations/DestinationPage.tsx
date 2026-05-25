"use client";

import React, { useState, useEffect } from "react";
import { DestinationStatisticsData } from "@/types/destination-types";
import { DestinationService } from "@/services/destinationService";
import { useTheme } from "@/contexts/ThemeContext";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { DESTINATION_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { getDestinationStatisticsData } from "@/data/statistics-data";
import {
  AnimatedCount,
  SectionHeader,
  Reveal,
  getActionConfig,
  ErrorBanner,
  InfoBanner,
  PieChartCard,
  BarChartCard,
  getStatisticsStyles,
} from "@/components/statistics-components";
import CommonLoading from "@/components/common-components/CommonLoading";

const DestinationPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] =
    useState<DestinationStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destinationsData = contentManagementSideBarData.find(
    (item) => item.name === "Destinations",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await DestinationService.getDestinationStatistics();
      if (response.data) setStatistics(response.data);
    } catch {
      setError("We couldn't load the statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Chart data ── */
  const PIE_COLORS = [theme.primary ?? "#0D4E4A", "#FDA4AF"];
  const pieChartData = statistics
    ? [
        { name: "Wishlisted", value: statistics.wishDetails.wishListCount },
        {
          name: "Not Wishlisted",
          value: statistics.wishDetails.notWishListCount,
        },
      ]
    : [];

  const barChartData =
    statistics?.categoryDetails.map((cat) => ({
      name: cat.categoryName,
      count: cat.count,
    })) || [];

  const statCards = getDestinationStatisticsData(statistics);

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
    "dp",
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

  if (loading) {
    return (
      <CommonLoading
        message="Loading destination statistics..."
        subMessage="Destinations"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{styles}</style>

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
                  title="Destinations"
                  description="Manage and monitor your travel destination locations"
                  breadcrumbItems={DESTINATION_PAGE_BREADCRUMB_DATA}
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
                  subtitle="Jump directly to any destination management task"
                  badge={`${destinationsData?.subData.length ?? 0} actions`}
                  prefix="dp"
                />
                <div className="dp-actions-grid">
                  {destinationsData?.subData.map((action) => {
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
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="dp"
                  />
                </div>
              </Reveal>
            )}

            {/* ── Statistics ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="dp-mt-8">
                  <SectionHeader
                    title="Destination Statistics"
                    subtitle="Live counts across all destination records"
                    badge="Live"
                    live
                    prefix="dp"
                  />
                  <div className="dp-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`dp-stat-card dp-stat-card--${card.accent}`}
                      >
                        <div
                          className={`dp-stat-icon dp-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="dp-stat-value">
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                          />
                        </div>
                        <div className="dp-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts ── */}
            {!error && statistics && (
              <Reveal delay={180}>
                <section className="dp-mt-8">
                  <SectionHeader
                    title="Analytics Overview"
                    subtitle="Visual breakdown of wishlist distribution and category spread"
                    prefix="dp"
                  />
                  <div className="dp-charts-row">
                    <PieChartCard
                      data={pieChartData}
                      colors={PIE_COLORS}
                      title="Wishlist Distribution"
                      total={
                        statistics.wishDetails.wishListCount +
                        statistics.wishDetails.notWishListCount
                      }
                      prefix="dp"
                    />
                    <BarChartCard
                      data={barChartData}
                      title="Destinations by Category"
                      categoryCount={barChartData.length}
                      unit="destinations"
                      color={p}
                      borderColor={border}
                      textSecondary={textSecondary}
                      prefix="dp"
                    />
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={240}>
              <section className="dp-mt-7">
                <InfoBanner
                  title="Destination Management"
                  description="Use the quick-action cards above to browse, create, edit, or remove destinations. Statistics and charts reflect the latest data from your backend and update each time you visit this page."
                  prefix="dp"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationPage;
