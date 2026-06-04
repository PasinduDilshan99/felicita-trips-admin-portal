"use client";

import React, { useState, useEffect } from "react";
import { ActivityStatisticsData } from "@/types/activity-types";
import { ActivityService } from "@/services/activityService";
import { useTheme } from "@/contexts/ThemeContext";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { ACTIVITY_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { getActivityStatisticsData } from "@/data/statistics-data";
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

const ActivitiesPage = () => {
  const { theme, isDarkMode } = useTheme();
  const [statistics, setStatistics] = useState<ActivityStatisticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activitiesData = contentManagementSideBarData.find(
    (item) => item.name === "Activities",
  );

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setStatistics(null);
      const response = await ActivityService.getActivitiesStatistics();
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

  const statCards = getActivityStatisticsData(statistics);

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
    "ap",
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
        message="Loading activity statistics..."
        subMessage="Activities"
        fullScreen
      />
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="ap-root">
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
                  title="Activities"
                  description="Manage travel activities and experiences"
                  breadcrumbItems={ACTIVITY_PAGE_BREADCRUMB_DATA}
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
                  prefix="ap"
                />
                <div className="ap-actions-grid">
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
                <div className="ap-mt-6">
                  <ErrorBanner
                    error={error}
                    onRetry={fetchStatistics}
                    prefix="ap"
                  />
                </div>
              </Reveal>
            )}

            {/* ── Statistics ── */}
            {!error && (
              <Reveal delay={120}>
                <section className="ap-mt-8">
                  <SectionHeader
                    title="Activity Statistics"
                    subtitle="Live counts across all activity records"
                    badge="Live"
                    live
                    prefix="ap"
                  />
                  <div className="ap-stats-grid">
                    {statCards.map((card, i) => (
                      <div
                        key={i}
                        className={`ap-stat-card ap-stat-card--${card.accent}`}
                      >
                        <div
                          className={`ap-stat-icon ap-stat-icon--${card.accent}`}
                        >
                          {card.icon}
                        </div>
                        <div className="ap-stat-value">
                          <AnimatedCount
                            value={card.value}
                            duration={950 + i * 70}
                          />
                        </div>
                        <div className="ap-stat-label">{card.title}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Charts ── */}
            {!error && statistics && (
              <Reveal delay={180}>
                <section className="ap-mt-8">
                  <SectionHeader
                    title="Analytics Overview"
                    subtitle="Visual breakdown of wishlist distribution and category spread"
                    prefix="ap"
                  />
                  <div className="ap-charts-row">
                    <PieChartCard
                      data={pieChartData}
                      colors={PIE_COLORS}
                      title="Wishlist Distribution"
                      total={
                        statistics.wishDetails.wishListCount +
                        statistics.wishDetails.notWishListCount
                      }
                      prefix="ap"
                    />
                    <BarChartCard
                      data={barChartData}
                      title="Activities by Category"
                      categoryCount={barChartData.length}
                      unit="activities"
                      color={p}
                      borderColor={border}
                      textSecondary={textSecondary}
                      prefix="ap"
                    />
                  </div>
                </section>
              </Reveal>
            )}

            {/* ── Info banner ── */}
            <Reveal delay={240}>
              <section className="ap-mt-7">
                <InfoBanner
                  title="Activity Management"
                  description="Manage all travel activities and experiences offered. Add new activities, update existing ones, feature popular experiences, or remove activities that are no longer available. Activities can be categorized by type, difficulty level, and duration. Statistics and charts reflect the latest data from your backend and update each time you visit this page."
                  prefix="ap"
                />
              </section>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivitiesPage;
