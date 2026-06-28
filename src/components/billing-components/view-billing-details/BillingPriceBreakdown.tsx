"use client";

import React, { useState } from "react";
import { Receipt, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PriceBreakdownItem } from "@/types/billing-types";
import { hexToRgba } from "@/utils/functions";

interface BillingPriceBreakdownProps {
  items: PriceBreakdownItem[];
}

export const BillingPriceBreakdown: React.FC<BillingPriceBreakdownProps> = ({
  items,
}) => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (!items.length) {
    return null;
  }

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
        <div className="flex items-center justify-between">
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <Receipt
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Price Breakdown
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {items.length} items
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="space-y-2">
          {/* Header */}
          <div
            className="grid grid-cols-4 gap-2 pb-2 border-b text-xs font-medium uppercase tracking-wide"
            style={{
              color: theme.textSecondary,
              borderColor: hexToRgba(theme.border, 0.5),
            }}
          >
            <span>Item</span>
            <span className="text-center">Qty</span>
            <span className="text-center">Unit Price</span>
            <span className="text-right">Total</span>
          </div>

          {visibleItems.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 p-2 rounded-lg text-sm"
              style={{
                backgroundColor:
                  idx % 2 === 0
                    ? hexToRgba(theme.primary, 0.03)
                    : "transparent",
              }}
            >
              <div>
                <p className="font-medium" style={{ color: theme.text }}>
                  {item.itemName}
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {item.itemType}
                </p>
              </div>
              <div
                className="text-center"
                style={{ color: theme.textSecondary }}
              >
                {item.quantity}
              </div>
              <div
                className="text-center"
                style={{ color: theme.textSecondary }}
              >
                {formatPrice(item.unitPrice)}
              </div>
              <div
                className="text-right font-semibold"
                style={{ color: theme.text }}
              >
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs font-medium mt-3 transition-colors hover:opacity-80"
            style={{ color: theme.primary }}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {items.length} Items
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
