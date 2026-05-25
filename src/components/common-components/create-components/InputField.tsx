"use client";

import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<InputElement>) => void;
  type?: "text" | "number" | "email" | "tel" | "url" | "textarea" | "select" | "date" | "datetime-local" | "time";
  required?: boolean;
  placeholder?: string;
  error?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  maxLength?: number;
  showCounter?: boolean;
  rows?: number;
  helperText?: string;
  options?: Array<{ value: string; label: string }>;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  error,
  min,
  max,
  step,
  maxLength,
  showCounter = false,
  rows = 3,
  helperText,
  options = [],
}) => {
  const { theme } = useTheme();
  const uid = useId();

  const stringValue = value?.toString() || "";
  const currentLength = stringValue.length;

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<InputElement>) => {
      e.currentTarget.style.borderColor = error ? theme.error : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? theme.error : theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<InputElement>) => {
      e.currentTarget.style.borderColor = error ? theme.error : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const commonProps = {
    id: `${uid}-${name}`,
    name,
    value: stringValue,
    onChange,
    disabled: false,
    className: `w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm ${error ? "field-error" : ""}`,
    style: {
      ...fieldBase,
      borderColor: error ? theme.error : theme.border,
    },
    ...focusHandlers,
  };

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          {...commonProps}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      );
    }

    if (type === "select") {
      return (
        <select {...commonProps}>
          <option value="">Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // For date, datetime-local, time, and other HTML5 input types
    return (
      <input
        {...commonProps}
        type={type}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={`${uid}-${name}`}
          className="text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          {label}
          {required && <span style={{ color: theme.error }}> *</span>}
        </label>
        {showCounter && maxLength && (
          <span
            className="text-xs tabular-nums"
            style={{
              color: currentLength > maxLength * 0.9 ? theme.error : theme.textSecondary,
            }}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      {renderInput()}

      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: theme.error }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs" style={{ color: theme.textSecondary }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

// Add animation style once at component level
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }
    .field-error { animation: errorShake 0.35s ease; }
  `;
  document.head.appendChild(style);
}