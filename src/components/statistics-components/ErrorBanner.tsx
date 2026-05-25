"use client";

import React from "react";

export const ErrorBanner = ({
  error,
  onRetry,
  prefix = "stats",
}: {
  error: string;
  onRetry: () => void;
  prefix?: string;
}) => (
  <div className={`${prefix}-error-banner`}>
    <div className={`${prefix}-error-banner__left`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {error}
    </div>
    <button className={`${prefix}-retry-btn`} onClick={onRetry}>
      Retry
    </button>
  </div>
);
