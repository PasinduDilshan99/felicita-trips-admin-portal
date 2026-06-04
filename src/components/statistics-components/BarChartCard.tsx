"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { hexToRgba } from "@/utils/functions";
import { CustomBarTooltip } from "./CustomTooltips";

export const BarChartCard = ({ 
  data, 
  title, 
  categoryCount, 
  unit, 
  color, 
  borderColor, 
  textSecondary, 
  prefix = "stats" 
}: any) => (
  <div className={`${prefix}-chart-card`}>
    <div className={`${prefix}-chart-header`}>
      <div className={`${prefix}-chart-title`}>
        <span className={`${prefix}-chart-dot ${prefix}-chart-dot--ok`} />
        {title}
      </div>
      <span className={`${prefix}-chart-sub`}>{categoryCount} categories</span>
    </div>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={24}
          margin={{ top: 4, right: 4, bottom: 40, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={hexToRgba(borderColor, 0.8)}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 11,
              fill: textSecondary,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: textSecondary }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            content={(props: any) => <CustomBarTooltip {...props} unit={unit} />}
            cursor={{ fill: hexToRgba(color, 0.06), radius: 6 }}
          />
          <Bar
            dataKey="count"
            fill={color}
            radius={[7, 7, 0, 0]}
            name={unit}
            animationBegin={300}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);