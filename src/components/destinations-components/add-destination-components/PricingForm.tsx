"use client";

import React, { useId } from "react";
import { DollarSign, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface PricingFormProps {
  formData: any;
  errors?: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PricingForm: React.FC<PricingFormProps> = ({
  formData,
  errors = {},
  onInputChange,
}) => {
  const { theme } = useTheme();
  const uid = useId();

  const focusHandlers = (hasError: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${
        hasError ? theme.error : theme.primary
      }18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  return (
    <>
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .field-error { animation: errorShake 0.35s ease; }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.success}18`,
              color: theme.success,
            }}
          >
            <DollarSign className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Pricing Information
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Optional pricing details for customers
            </p>
          </div>
        </div>

        {/* ── Fields ── */}
        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Extra Price */}
            <div>
              <label
                htmlFor={`${uid}-extra-price`}
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Extra Price
                <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  $
                </span>
                <input
                  id={`${uid}-extra-price`}
                  type="number"
                  name="extraPrice"
                  value={formData.extraPrice ?? ""}
                  onChange={onInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                    errors.extraPrice ? " field-error" : ""
                  }`}
                  style={{
                    ...fieldBase,
                    borderColor: errors.extraPrice ? theme.error : theme.border,
                  }}
                  {...focusHandlers(!!errors.extraPrice)}
                />
              </div>
              {errors.extraPrice && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.extraPrice}
                </p>
              )}
            </div>

            {/* Price Note */}
            <div>
              <label
                htmlFor={`${uid}-price-note`}
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Price Note
                <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                  (Optional)
                </span>
              </label>
              <input
                id={`${uid}-price-note`}
                type="text"
                name="extraPriceNote"
                value={formData.extraPriceNote ?? ""}
                onChange={onInputChange}
                placeholder="e.g., Entrance fee, Tax not included, etc."
                maxLength={200}
                className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                  errors.extraPriceNote ? " field-error" : ""
                }`}
                style={{
                  ...fieldBase,
                  borderColor: errors.extraPriceNote ? theme.error : theme.border,
                }}
                {...focusHandlers(!!errors.extraPriceNote)}
              />
              {errors.extraPriceNote && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.extraPriceNote}
                </p>
              )}
              {(formData.extraPriceNote?.length ?? 0) > 150 && (
                <p
                  className="mt-1.5 text-xs text-right"
                  style={{ color: theme.textSecondary }}
                >
                  {(formData.extraPriceNote?.length ?? 0)}/200 characters
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};