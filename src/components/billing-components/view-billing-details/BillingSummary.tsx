"use client";

import React from "react";
import {
  DollarSign,
  TrendingDown,
  Shield,
  Receipt,
  CreditCard,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BillingSummary as BillingSummaryType } from "@/types/billing-types";
import { hexToRgba } from "@/utils/functions";

interface BillingSummaryProps {
  summary: BillingSummaryType;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({ summary }) => {
  const { theme } = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const summaryItems = [
    {
      label: "Subtotal",
      value: summary.subtotal,
      icon: DollarSign,
      color: theme.primary,
    },
    {
      label: "Discount",
      value: -summary.discountAmount,
      icon: TrendingDown,
      color: theme.success,
    },
    {
      label: "Tax",
      value: summary.taxAmount,
      icon: Receipt,
      color: theme.warning,
    },
    {
      label: "Insurance",
      value: summary.insuranceAmount,
      icon: Shield,
      color: theme.primary || theme.primary,
    },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2
          className="text-base sm:text-lg font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <CreditCard
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          Billing Summary
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(item.color, 0.04),
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: hexToRgba(item.color, 0.1) }}
              >
                <item.icon
                  className="w-3.5 h-3.5"
                  style={{ color: item.color }}
                />
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                {item.label}
              </span>
            </div>
            <span
              className={`text-sm font-semibold ${item.value < 0 ? "text-emerald-500" : ""}`}
              style={{ color: item.value < 0 ? theme.success : theme.text }}
            >
              {item.value < 0 ? "-" : ""}
              {formatPrice(Math.abs(item.value))}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div
          className="border-t my-2"
          style={{ borderColor: hexToRgba(theme.border, 0.5) }}
        />

        {/* Final Amount */}
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.08),
            border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
          }}
        >
          <span className="text-sm font-semibold" style={{ color: theme.text }}>
            Final Amount
          </span>
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            {formatPrice(summary.finalAmount)}
          </span>
        </div>

        {/* Payment Status */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div
            className="flex flex-col items-center p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.06),
              border: `1px solid ${hexToRgba(theme.success, 0.1)}`,
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Paid
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: theme.success }}
            >
              {formatPrice(summary.paidAmount)}
            </span>
          </div>
          <div
            className="flex flex-col items-center p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(theme.error, 0.06),
              border: `1px solid ${hexToRgba(theme.error, 0.1)}`,
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Due
            </span>
            <span className="text-sm font-bold" style={{ color: theme.error }}>
              {formatPrice(summary.dueAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
