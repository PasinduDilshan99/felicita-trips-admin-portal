"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomPieTooltip } from "./CustomTooltips";

export const PieChartCard = ({
  data,
  colors,
  title,
  total,
  prefix = "stats",
}: any) => (
  <div className={`${prefix}-chart-card`}>
    <div className={`${prefix}-chart-header`}>
      <div className={`${prefix}-chart-title`}>
        <span className={`${prefix}-chart-dot ${prefix}-chart-dot--p`} />
        {title}
      </div>
      <span className={`${prefix}-chart-sub`}>
        {total.toLocaleString()} total
      </span>
    </div>
    <div style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            strokeWidth={0}
            animationBegin={200}
            animationDuration={900}
          >
            {data.map((_: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className={`${prefix}-pie-legend`}>
      {data.map((item: any, i: number) => (
        <div key={i} className={`${prefix}-pie-legend-item`}>
          <span
            className={`${prefix}-pie-legend-dot`}
            style={{ background: colors[i] }}
          />
          {item.name}
          <span className={`${prefix}-pie-legend-count`}>
            {item.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);
