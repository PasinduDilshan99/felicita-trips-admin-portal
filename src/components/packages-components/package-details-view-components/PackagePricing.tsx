"use client";

import React from "react";
import { DollarSign, Users, Percent, TrendingDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackagePricingProps } from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";

export const PackagePricing: React.FC<PackagePricingProps> = ({
  totalPrice,
  discountPercentage,
  pricePerPerson,
  minPersonCount,
  maxPersonCount,
  color,
}) => {
  const { theme } = useTheme();

  const discountedPrice = totalPrice - (totalPrice * discountPercentage) / 100;
  const hasDiscount = discountPercentage > 0;

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
          Pricing Information
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Price Card */}
          <div
            className="rounded-xl p-4 transition-all duration-200"
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
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Total Package Price
              </p>
            </div>
            <p
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: theme.primary }}
            >
              ${totalPrice.toLocaleString()}
            </p>
          </div>

          {/* Price Per Person Card */}
          <div
            className="rounded-xl p-4 transition-all duration-200"
            style={{
              backgroundColor: hexToRgba(color, 0.06),
              border: `1px solid ${hexToRgba(color, 0.15)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" style={{ color }} />
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: theme.textSecondary }}
              >
                Price Per Person
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>
              ${pricePerPerson.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Discount Section */}
        {hasDiscount && (
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.06),
              border: `1px solid ${hexToRgba(theme.success, 0.15)}`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4" style={{ color: theme.success }} />
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: theme.textSecondary }}
                  >
                    Discount
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: theme.success }}
                  >
                    {discountPercentage}% OFF
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Discounted Price
                </p>
                <p
                  className="text-xl font-bold flex items-center gap-1"
                  style={{ color: theme.success }}
                >
                  <TrendingDown className="w-4 h-4" />$
                  {discountedPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Group Size Info */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.04),
            border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: theme.primary }} />
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Group Size
            </p>
          </div>
          <p className="text-base font-semibold" style={{ color: theme.text }}>
            {minPersonCount} - {maxPersonCount} persons
          </p>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Minimum {minPersonCount} participants required
          </p>
        </div>
      </div>
    </div>
  );
};
