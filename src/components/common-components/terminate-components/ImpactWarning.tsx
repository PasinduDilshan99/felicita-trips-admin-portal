// components/common-components/termination/ImpactWarning.tsx
"use client";

import React from "react";
import { Shield, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export interface ImpactItem {
  icon?: React.ReactNode;
  text: string;
}

export interface ImpactWarningProps {
  items?: ImpactItem[];
  title?: string;
  entityType?: "destination" | "activity" | "custom";
  customItems?: ImpactItem[];
}

const defaultDestinationItems: ImpactItem[] = [
  { text: "All activities associated with this destination will be permanently deleted" },
  { text: "All destination images will be permanently deleted from storage" },
  { text: "This action cannot be undone — recovery is not possible" },
  { text: "This termination will be logged for audit trail purposes" },
];

const defaultActivityItems: ImpactItem[] = [
  { text: "All schedules associated with this activity will be permanently deleted" },
  { text: "All category associations will be permanently removed" },
  { text: "All activity images will be permanently deleted from storage" },
  { text: "This action cannot be undone — recovery is not possible" },
  { text: "This termination will be logged for audit trail purposes" },
];

export const ImpactWarning: React.FC<ImpactWarningProps> = ({
  items,
  title = "Termination Impact",
  entityType = "custom",
  customItems,
}) => {
  const { theme } = useTheme();

  const getItems = (): ImpactItem[] => {
    if (customItems) return customItems;
    if (items) return items;
    if (entityType === "destination") return defaultDestinationItems;
    if (entityType === "activity") return defaultActivityItems;
    return defaultDestinationItems;
  };

  const impactItems = getItems();

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hexToRgba(theme.error, 0.05),
        border: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.error, 0.3)}` }}
      >
        <Shield className="w-4 h-4" style={{ color: theme.error }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>{title}</h3>
      </div>
      <div className="px-4 py-4">
        <div className="space-y-3">
          {impactItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                style={{ background: hexToRgba(theme.error, 0.1), color: theme.error }}
              >
                {item.icon || <AlertCircle size={11} />}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: theme.error }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};