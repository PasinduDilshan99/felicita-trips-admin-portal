"use client";

import React from "react";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityPricingProps } from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";

export const ActivityPricing: React.FC<ActivityPricingProps> = ({
  priceLocal,
  priceForeigners,
  minParticipants,
  maxParticipants,
}) => {
  const { theme } = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
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
          className="text-base sm:text-lg font-semibold"
          style={{ color: theme.text }}
        >
          Pricing & Participants
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3 sm:p-4 transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.06),
              border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign
                className="w-4 h-4"
                style={{ color: theme.primary }}
              />
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Local Price
              </p>
            </div>
            <p
              className="text-xl sm:text-2xl font-bold"
              style={{ color: theme.primary }}
            >
              {formatPrice(priceLocal)}
            </p>
            <p
              className="text-[10px] sm:text-xs mt-1"
              style={{ color: theme.textSecondary }}
            >
              per person
            </p>
          </div>

          <div
            className="rounded-xl p-3 sm:p-4 transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(theme.accent || theme.primary, 0.06),
              border: `1px solid ${hexToRgba(theme.accent || theme.primary, 0.15)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: theme.accent || theme.primary }}
              />
              <p
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Foreigner Price
              </p>
            </div>
            <p
              className="text-xl sm:text-2xl font-bold"
              style={{ color: theme.accent || theme.primary }}
            >
              {formatPrice(priceForeigners)}
            </p>
            <p
              className="text-[10px] sm:text-xs mt-1"
              style={{ color: theme.textSecondary }}
            >
              per person
            </p>
          </div>
        </div>

        {/* Participant Info */}
        <div
          className="rounded-xl p-3 sm:p-4"
          style={{
            backgroundColor: hexToRgba(theme.success, 0.06),
            border: `1px solid ${hexToRgba(theme.success, 0.15)}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: theme.success }} />
            <p
              className="text-[10px] sm:text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Group Size
            </p>
          </div>
          <p
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.success }}
          >
            {minParticipants} - {maxParticipants} participants
          </p>
          <p
            className="text-[10px] sm:text-xs mt-1"
            style={{ color: theme.textSecondary }}
          >
            Minimum {minParticipants} participants required to run this activity
          </p>
        </div>
      </div>
    </div>
  );
};
