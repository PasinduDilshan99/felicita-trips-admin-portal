"use client";

import React from "react";

export const InfoBanner = ({ 
  title, 
  description, 
  prefix = "stats" 
}: { 
  title: string; 
  description: string; 
  prefix?: string;
}) => (
  <div className={`${prefix}-info-banner`}>
    <div className={`${prefix}-info-icon`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </div>
    <div>
      <p className={`${prefix}-info-title`}>{title}</p>
      <p className={`${prefix}-info-text`}>{description}</p>
    </div>
  </div>
);