"use client";

import React, { useId } from "react";
import { DollarSign, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

export type PricingMode = "destination" | "activity" | "tour" | "package";

interface PricingFieldConfig {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  min?: number;
  step?: number;
  currency?: string;
}

interface PricingFormProps {
  formData: any;
  errors?: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  mode?: PricingMode;
  title?: string;
  description?: string;
  showOptionalBadge?: boolean;
}

export const PricingForm: React.FC<PricingFormProps> = ({
  formData,
  errors = {},
  onInputChange,
  mode = "destination",
  title,
  description,
  showOptionalBadge = true,
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

  // Get configuration based on mode
  const getConfig = () => {
    switch (mode) {
      case "activity":
        return {
          title: title || "Pricing",
          description: description || "Set pricing for participants",
          fields: [
            {
              label: "Price for Local Participants",
              name: "priceLocal",
              required: true,
              placeholder: "0.00",
              helperText: "Price in LKR for local participants",
              min: 0,
              step: 0.01,
              currency: "Rs",
            },
            {
              label: "Price for Foreign Participants",
              name: "priceForeigners",
              required: true,
              placeholder: "0.00",
              helperText: "Price in USD for foreign participants",
              min: 0,
              step: 0.01,
              currency: "$",
            },
          ],
          showOptional: false,
        };
      
      case "tour":
        return {
          title: title || "Tour Pricing",
          description: description || "Set pricing for tour packages",
          fields: [
            {
              label: "Base Price",
              name: "basePrice",
              required: true,
              placeholder: "0.00",
              helperText: "Base price per person",
              min: 0,
              step: 0.01,
              currency: "$",
            },
            {
              label: "Discount Price",
              name: "discountPrice",
              required: false,
              placeholder: "0.00",
              helperText: "Discounted price (optional)",
              min: 0,
              step: 0.01,
              currency: "$",
            },
          ],
          showOptional: true,
        };
      
      case "package":
        return {
          title: title || "Package Pricing",
          description: description || "Set pricing for packages",
          fields: [
            {
              label: "Package Price",
              name: "packagePrice",
              required: true,
              placeholder: "0.00",
              helperText: "Total package price",
              min: 0,
              step: 0.01,
              currency: "$",
            },
            {
              label: "Deposit Amount",
              name: "depositAmount",
              required: false,
              placeholder: "0.00",
              helperText: "Required deposit (optional)",
              min: 0,
              step: 0.01,
              currency: "$",
            },
          ],
          showOptional: true,
        };
      
      case "destination":
      default:
        return {
          title: title || "Pricing Information",
          description: description || "Optional pricing details for customers",
          fields: [
            {
              label: "Extra Price",
              name: "extraPrice",
              required: false,
              placeholder: "0.00",
              helperText: "Additional cost for this destination",
              min: 0,
              step: 0.01,
              currency: "$",
            },
            {
              label: "Price Note",
              name: "extraPriceNote",
              required: false,
              placeholder: "e.g., Entrance fee, Tax not included, etc.",
              helperText: "Additional pricing information",
              maxLength: 200,
              isTextArea: false,
            },
          ],
          showOptional: true,
        };
    }
  };

  const config = getConfig();

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
        <FormHeader
          title={config.title}
          description={config.description}
          icon={DollarSign}
        />

        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={`${uid}-${field.name}`}
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: theme.textSecondary }}
                >
                  {field.label}
                  {field.required && <span style={{ color: theme.error }}> *</span>}
                  {!field.required && config.showOptional && showOptionalBadge && (
                    <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>
                      (Optional)
                    </span>
                  )}
                </label>
                
                {field.name === "extraPriceNote" || field.name === "priceNote" ? (
                  <input
                    id={`${uid}-${field.name}`}
                    type="text"
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={onInputChange}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength || 200}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                      errors[field.name] ? " field-error" : ""
                    }`}
                    style={{
                      ...fieldBase,
                      borderColor: errors[field.name] ? theme.error : theme.border,
                    }}
                    {...focusHandlers(!!errors[field.name])}
                  />
                ) : (
                  <div className="relative">
                    {field.currency && (
                      <span
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {field.currency}
                      </span>
                    )}
                    <input
                      id={`${uid}-${field.name}`}
                      type="number"
                      name={field.name}
                      value={formData[field.name] ?? ""}
                      onChange={onInputChange}
                      min={field.min || 0}
                      step={field.step || 0.01}
                      placeholder={field.placeholder}
                      className={`w-full ${field.currency ? "pl-8" : "pl-4"} pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                        errors[field.name] ? " field-error" : ""
                      }`}
                      style={{
                        ...fieldBase,
                        borderColor: errors[field.name] ? theme.error : theme.border,
                      }}
                      {...focusHandlers(!!errors[field.name])}
                    />
                  </div>
                )}
                
                {errors[field.name] && (
                  <p
                    className="mt-1.5 text-xs flex items-center gap-1"
                    style={{ color: theme.error }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {errors[field.name]}
                  </p>
                )}
                
                {field.helperText && !errors[field.name] && (
                  <p
                    className="mt-1.5 text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    {field.helperText}
                  </p>
                )}
                
                {(formData[field.name]?.length > (field.maxLength || 200) * 0.75) && (
                  <p
                    className="mt-1.5 text-xs text-right"
                    style={{ color: theme.textSecondary }}
                  >
                    {(formData[field.name]?.length || 0)}/{field.maxLength || 200} characters
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};