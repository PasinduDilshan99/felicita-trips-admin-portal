"use client";

import React from "react";

export const StatCardSkeleton = ({ 
  delay = 0, 
  prefix = "stats" 
}: { 
  delay?: number; 
  prefix?: string;
}) => (
  <div
    className={`${prefix}-stat-card ${prefix}-skeleton-card`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className={`${prefix}-skel ${prefix}-skel--icon`} />
    <div className={`${prefix}-skel ${prefix}-skel--val`} />
    <div className={`${prefix}-skel ${prefix}-skel--label`} />
  </div>
);