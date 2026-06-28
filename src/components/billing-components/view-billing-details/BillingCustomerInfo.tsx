"use client";

import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingCustomer } from "@/types/billing-types";
import { hexToRgba } from "@/utils/functions";

interface BillingCustomerInfoProps {
  customer: BookingCustomer;
}

export const BillingCustomerInfo: React.FC<BillingCustomerInfoProps> = ({
  customer,
}) => {
  const { theme } = useTheme();

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
          <User
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          Customer Information
        </h2>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        <div
          className="flex items-center gap-3 p-2 rounded-lg"
          style={{ backgroundColor: hexToRgba(theme.primary, 0.04) }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
          >
            <User className="w-5 h-5" style={{ color: theme.primary }} />
          </div>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Full Name
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {customer.fullName}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 p-2 rounded-lg"
          style={{
            backgroundColor: hexToRgba(theme.primary || theme.primary, 0.04),
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: hexToRgba(theme.primary || theme.primary, 0.1),
            }}
          >
            <Mail
              className="w-5 h-5"
              style={{ color: theme.primary || theme.primary }}
            />
          </div>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Email Address
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {customer.email}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 p-2 rounded-lg"
          style={{ backgroundColor: hexToRgba(theme.success, 0.04) }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}
          >
            <Phone className="w-5 h-5" style={{ color: theme.success }} />
          </div>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: theme.textSecondary }}
            >
              Mobile Number
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {customer.mobileNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
