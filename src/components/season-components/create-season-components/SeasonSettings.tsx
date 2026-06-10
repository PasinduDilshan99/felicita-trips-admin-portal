// components/season-components/SeasonSettings.tsx
"use client";

import React from "react";
import { Settings, TrendingUp, Hash } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface SeasonSettingsProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onStatusChange: (value: "ACTIVE" | "INACTIVE") => void;
  onPeakChange: (checked: boolean) => void;
}

export const SeasonSettings: React.FC<SeasonSettingsProps> = ({
  formData,
  errors,
  onInputChange,
  onStatusChange,
  onPeakChange,
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
      <FormHeader
        title="Settings"
        description="Configure season properties"
        icon={Settings}
      />

      <div className="px-6 py-6 space-y-6">
        <InputField
          label="Display Order"
          name="displayOrder"
          value={formData.displayOrder}
          onChange={onInputChange}
          type="number"
          required
          min={0}
          step={1}
          placeholder="1"
          error={errors.displayOrder}
          helperText="Order in which seasons are displayed (lower numbers first)"
        />

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPeak}
              onChange={(e) => onPeakChange(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: theme.primary }}
            />
            <div>
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                Peak Season
              </span>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Mark this as a peak travel season (higher demand, premium pricing)
              </p>
            </div>
          </label>
        </div>

        <StatusSelector
          value={formData.status as "ACTIVE" | "INACTIVE"}
          onChange={onStatusChange}
          required
        />
      </div>
    </div>
  );
};