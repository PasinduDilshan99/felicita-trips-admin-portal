"use client";

import React from "react";

export const CustomBarTooltip = ({ 
  active, 
  payload, 
  label, 
  unit = "items" 
}: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{label}</p>
      <p className="stats-tooltip__value">{payload[0].value} {unit}</p>
    </div>
  );
};

export const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-tooltip">
      <p className="stats-tooltip__label">{payload[0].name}</p>
      <p className="stats-tooltip__value">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};