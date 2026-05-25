"use client";

import React, { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface StatusOption {
  value: "ACTIVE" | "INACTIVE";
  label: string;
  description: string;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Available for customers to book",
    color: "#10b981",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Hidden from customers",
    color: "#6b7280",
  },
];

interface StatusSelectorProps {
  value: "ACTIVE" | "INACTIVE";
  onChange: (value: "ACTIVE" | "INACTIVE") => void;
  label?: string;
  required?: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  value,
  onChange,
  label = "Status",
  required = false,
}) => {
  const { theme } = useTheme();

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
        {label}
        {required && <span style={{ color: theme.error }}> *</span>}
      </label>

      <div className="flex gap-3">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="cursor-pointer flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0"
              style={{
                backgroundColor: isSelected ? `${opt.color}10` : theme.background,
                borderColor: isSelected ? opt.color : theme.border,
                boxShadow: isSelected ? `0 0 0 3px ${opt.color}18` : "none",
              }}
            >
              <span
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isSelected ? `${opt.color}20` : `${theme.border}60`,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? opt.color : theme.textSecondary,
                  }}
                />
              </span>
              <span className="min-w-0">
                <span
                  className="block text-sm font-semibold leading-tight"
                  style={{ color: isSelected ? opt.color : theme.text }}
                >
                  {opt.label}
                </span>
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  {opt.description}
                </span>
              </span>
              {isSelected && (
                <CheckCircle2
                  className="w-4 h-4 ml-auto flex-shrink-0"
                  style={{ color: opt.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};