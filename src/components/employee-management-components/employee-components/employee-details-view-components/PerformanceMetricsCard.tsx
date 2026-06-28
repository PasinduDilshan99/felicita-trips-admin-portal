"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  PerformanceMetricsCardProps,
  PerformanceReviewsCardProps,
} from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { InfoCard } from "./InfoCard";
import { formatDate } from "@/utils/utils";

export const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({
  metrics,
  animationDelay = 0,
}) => {
  const { theme } = useTheme();

  return (
    <InfoCard
      title="Performance Metrics"
      icon="📊"
      animationDelay={animationDelay}
    >
      {!metrics?.length ? (
        <EmptyState message="No performance metrics available" />
      ) : (
        <div className="space-y-4">
          {metrics.map((metric, idx) => {
            const pct = Math.min(metric.achievementPercentage, 100);
            const isOnTarget = metric.achievementPercentage >= 100;
            const barColor = isOnTarget ? theme.success : theme.warning;

            return (
              <div
                key={idx}
                className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.04),
                  border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                  <div>
                    <div
                      className="font-semibold text-sm"
                      style={{ color: theme.text }}
                    >
                      {metric.metricType}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {formatDate(metric.metricDate)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className="text-sm font-bold"
                      style={{ color: theme.text }}
                    >
                      {metric.metricValue}
                      <span
                        className="font-normal text-xs ml-1"
                        style={{ color: theme.textSecondary }}
                      >
                        / {metric.targetValue}
                      </span>
                    </div>
                    <div
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: barColor }}
                    >
                      {metric.achievementPercentage}% achieved
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.12),
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: isOnTarget
                        ? `linear-gradient(90deg, ${theme.success}, ${hexToRgba(theme.success, 0.7)})`
                        : `linear-gradient(90deg, ${theme.warning}, ${hexToRgba(theme.warning, 0.7)})`,
                    }}
                  />
                </div>

                {metric.notes && (
                  <div
                    className="mt-3 text-xs italic px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.06),
                      color: theme.textSecondary,
                      borderLeft: `2px solid ${hexToRgba(theme.primary, 0.3)}`,
                    }}
                  >
                    "{metric.notes}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </InfoCard>
  );
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-amber-400 text-sm">
          ★
        </span>
      ))}
      {half && <span className="text-amber-300 text-sm">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-gray-300 text-sm">
          ☆
        </span>
      ))}
    </div>
  );
};

const RatingRow: React.FC<{ label: string; value?: number | null }> = ({
  label,
  value,
}) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs" style={{ color: theme.textSecondary }}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {value ? <RatingStars rating={value} /> : null}
        <span
          className="text-xs font-medium w-6 text-right"
          style={{ color: theme.text }}
        >
          {value ?? "—"}
        </span>
      </div>
    </div>
  );
};

export const PerformanceReviewsCard: React.FC<PerformanceReviewsCardProps> = ({
  reviews,
  animationDelay = 0,
}) => {
  const { theme } = useTheme();

  return (
    <InfoCard
      title="Performance Reviews"
      icon="⭐"
      animationDelay={animationDelay}
    >
      {!reviews?.length ? (
        <EmptyState message="No performance reviews available" />
      ) : (
        <div className="space-y-4">
          {reviews.map((review, idx) => {
            const isCompleted = review.status === "COMPLETED";
            const statusColor = isCompleted ? theme.success : theme.warning;

            return (
              <div
                key={idx}
                className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                  boxShadow: `0 1px 4px ${hexToRgba(theme.text, 0.04)}`,
                }}
              >
                {/* Review header */}
                <div
                  className="px-4 py-3 flex items-center justify-between gap-2 flex-wrap"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.04),
                    borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                  }}
                >
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {formatDate(review.reviewPeriodStart)} –{" "}
                      {formatDate(review.reviewPeriodEnd)}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Reviewed:{" "}
                      {review.reviewDate
                        ? formatDate(review.reviewDate)
                        : "Pending"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={review.overallRating} />
                      <span
                        className="text-xs font-bold"
                        style={{ color: theme.text }}
                      >
                        {review.overallRating}/5
                      </span>
                    </div>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: hexToRgba(statusColor, 0.1),
                        color: statusColor,
                      }}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="px-4 py-3 space-y-2">
                  <RatingRow
                    label="Attendance"
                    value={review.attendanceRating}
                  />
                  <RatingRow
                    label="Productivity"
                    value={review.productivityRating}
                  />
                  <RatingRow label="Quality" value={review.qualityRating} />
                  <RatingRow label="Teamwork" value={review.teamworkRating} />
                </div>

                {/* Feedback section */}
                {(review.strengths ||
                  review.areasForImprovement ||
                  review.comments) && (
                  <div
                    className="px-4 py-3 space-y-2"
                    style={{
                      borderTop: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                    }}
                  >
                    {review.strengths && (
                      <div className="text-xs">
                        <span
                          className="font-semibold"
                          style={{ color: theme.success }}
                        >
                          Strengths:{" "}
                        </span>
                        <span style={{ color: theme.textSecondary }}>
                          {review.strengths}
                        </span>
                      </div>
                    )}
                    {review.areasForImprovement && (
                      <div className="text-xs">
                        <span
                          className="font-semibold"
                          style={{ color: theme.warning }}
                        >
                          Areas to improve:{" "}
                        </span>
                        <span style={{ color: theme.textSecondary }}>
                          {review.areasForImprovement}
                        </span>
                      </div>
                    )}
                    {review.comments && (
                      <div
                        className="text-xs italic px-3 py-2 rounded-lg"
                        style={{
                          backgroundColor: hexToRgba(theme.textSecondary, 0.06),
                          color: theme.textSecondary,
                          borderLeft: `2px solid ${hexToRgba(theme.primary, 0.3)}`,
                        }}
                      >
                        "{review.comments}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </InfoCard>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col items-center justify-center py-8 rounded-xl"
      style={{
        backgroundColor: hexToRgba(theme.textSecondary, 0.04),
        border: `1px dashed ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <span className="text-2xl mb-2 opacity-40">📭</span>
      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {message}
      </p>
    </div>
  );
};
