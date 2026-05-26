"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface GanttChartProps {
  data: any[];
  prefix?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({ data, prefix = "as" }) => {
  const { theme } = useTheme();
  const p = theme.primary ?? "#0D4E4A";
  
  // Find date range for scaling
  const dates = data.flatMap(d => [new Date(d.assumeStartDate), new Date(d.assumeEndDate)]);
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  const dateRange = maxDate.getTime() - minDate.getTime();
  
  // Sort data by start date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.assumeStartDate).getTime() - new Date(b.assumeStartDate).getTime()
  );
  
  // Calculate position and width for each bar
  const getBarPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const left = ((start - minDate.getTime()) / dateRange) * 100;
    const width = ((end - start) / dateRange) * 100;
    return { left, width: Math.max(width, 2) };
  };
  
  return (
    <div className={`${prefix}-gantt-container`}>
      <div className={`${prefix}-gantt-header`}>
        <div className={`${prefix}-gantt-label-col`}>Schedule</div>
        <div className={`${prefix}-gantt-timeline-col`}>
          {Array.from({ length: 6 }).map((_, i) => {
            const date = new Date(minDate.getTime() + (dateRange / 6) * i);
            return (
              <div key={i} className={`${prefix}-gantt-timeline-marker`}>
                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            );
          })}
        </div>
      </div>
      <div className={`${prefix}-gantt-body`}>
        {sortedData.map((item, idx) => {
          const { left, width } = getBarPosition(item.assumeStartDate, item.assumeEndDate);
          const statusColor = item.status === 1 ? p : "#9ca3af";
          
          return (
            <div key={idx} className={`${prefix}-gantt-row`}>
              <div className={`${prefix}-gantt-label-col`}>
                <div className={`${prefix}-gantt-label`}>
                  <div className={`${prefix}-gantt-label-name`}>{item.scheduleName}</div>
                  <div className={`${prefix}-gantt-label-activity`}>{item.activityName}</div>
                </div>
              </div>
              <div className={`${prefix}-gantt-timeline-col`}>
                <div className={`${prefix}-gantt-timeline-bar-container`}>
                  <div
                    className={`${prefix}-gantt-timeline-bar`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: statusColor,
                    }}
                  >
                    <span className={`${prefix}-gantt-bar-label`}>{item.scheduleName}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};