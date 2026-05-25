"use client";

import React from "react";

export const SectionHeader = ({
  title,
  subtitle,
  badge,
  live,
  prefix = "stats",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  live?: boolean;
  prefix?: string;
}) => (
  <div className={`${prefix}-section-header`}>
    <div className={`${prefix}-section-header__left`}>
      <div className={`${prefix}-section-header__bar`} />
      <div>
        <div className={`${prefix}-section-header__title-row`}>
          <h2 className={`${prefix}-section-header__title`}>{title}</h2>
          {badge && (
            <span
              className={`${prefix}-section-badge${live ? ` ${prefix}-section-badge--live` : ""}`}
            >
              {live && <span className={`${prefix}-live-dot`} />}
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className={`${prefix}-section-header__subtitle`}>{subtitle}</p>}
      </div>
    </div>
  </div>
);