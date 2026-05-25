// components/employee-details/AssetsCard.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { EmployeeAsset } from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { InfoCard } from "./InfoCard";

interface AssetsCardProps {
  assets?: EmployeeAsset[];
  animationDelay?: number;
}

export const AssetsCard: React.FC<AssetsCardProps> = ({ assets, animationDelay = 0 }) => {
  const { theme } = useTheme();

  return (
    <InfoCard title="Assigned Assets" icon="💻" animationDelay={animationDelay}>
      {!assets?.length ? (
        <EmptyState message="No assets assigned" />
      ) : (
        <div className="space-y-3">
          {assets.map((asset, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{
                border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                boxShadow: `0 1px 4px ${hexToRgba(theme.text, 0.04)}`,
              }}
            >
              {/* Asset Header */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.04),
                  borderBottom: `1px solid ${hexToRgba(theme.border, 0.6)}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                >
                  {getAssetIcon(asset.assetType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>
                    {asset.assetName}
                  </div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>
                    {asset.assetType}{asset.model ? ` · ${asset.model}` : ""}
                  </div>
                </div>
                <div
                  className="text-xs font-mono px-2 py-1 rounded-md flex-shrink-0"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.08),
                    color: theme.textSecondary,
                  }}
                >
                  {asset.serialNumber}
                </div>
              </div>

              {/* Asset Details */}
              <div className="px-4 py-3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span style={{ color: theme.textSecondary }}>Assigned</span>
                    <div className="font-medium mt-0.5" style={{ color: theme.text }}>
                      {formatDate(asset.assignedDate)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: theme.textSecondary }}>Return date</span>
                    <div className="font-medium mt-0.5" style={{ color: asset.returnDate ? theme.text : theme.success }}>
                      {asset.returnDate ? formatDate(asset.returnDate) : "In use"}
                    </div>
                  </div>
                  {asset.conditionOnAssignment && (
                    <div>
                      <span style={{ color: theme.textSecondary }}>Condition</span>
                      <div className="font-medium mt-0.5" style={{ color: theme.text }}>
                        {asset.conditionOnAssignment}
                      </div>
                    </div>
                  )}
                </div>
                {asset.notes && (
                  <div
                    className="mt-2 text-xs italic px-2 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.06),
                      color: theme.textSecondary,
                    }}
                  >
                    {asset.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};


// components/employee-details/TimestampsCard.tsx
import { InfoRow } from "./InfoCard";
import { formatDate, formatDateTime, getAssetIcon } from "@/utils/utils";

interface TimestampsCardProps {
  createdAt?: string;
  updatedAt?: string;
  animationDelay?: number;
}

export const TimestampsCard: React.FC<TimestampsCardProps> = ({
  createdAt,
  updatedAt,
  animationDelay = 0,
}) => (
  <InfoCard title="Record Timestamps" icon="⏰" animationDelay={animationDelay}>
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      <InfoRow label="Created At" value={formatDateTime(createdAt)} />
      <InfoRow label="Last Updated" value={formatDateTime(updatedAt)} />
    </div>
  </InfoCard>
);

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