"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { InputField } from "@/components/common-components/create-components/InputField";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface ScheduleFormProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <FormHeader
        title="Schedule"
        description="Set duration and available time period"
        icon={Calendar}
      />

      <div className="px-6 py-6 space-y-6">
        <InputField
          label="Duration (Hours)"
          name="durationHours"
          value={formData.durationHours}
          onChange={onInputChange}
          type="number"
          required
          min={0.5}
          step={0.5}
          placeholder="e.g., 2.5"
          error={errors.durationHours}
          helperText="How long does this activity typically take?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Available From (Time)"
            name="availableFrom"
            value={formData.availableFrom}
            onChange={onInputChange}
            type="time"
            required
            error={errors.availableFrom}
            helperText="Start time of the activity"
          />

          <InputField
            label="Available To (Time)"
            name="availableTo"
            value={formData.availableTo}
            onChange={onInputChange}
            type="time"
            required
            error={errors.availableTo}
            helperText="End time of the activity"
          />
        </div>
      </div>
    </div>
  );
};