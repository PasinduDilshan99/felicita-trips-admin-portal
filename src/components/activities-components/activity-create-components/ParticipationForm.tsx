"use client";

import React from "react";
import { Users } from "lucide-react";
import { InputField } from "@/components/common-components/create-components/InputField";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface ParticipationFormProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ParticipationForm: React.FC<ParticipationFormProps> = ({
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
        title="Participation Limits"
        description="Set minimum and maximum participant requirements"
        icon={Users}
      />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Minimum Participants"
            name="minParticipate"
            value={formData.minParticipate}
            onChange={onInputChange}
            type="number"
            required
            min={1}
            step={1}
            placeholder="1"
            error={errors.minParticipate}
            helperText="Minimum number of participants required"
          />

          <InputField
            label="Maximum Participants"
            name="maxParticipate"
            value={formData.maxParticipate}
            onChange={onInputChange}
            type="number"
            required
            min={1}
            step={1}
            placeholder="20"
            error={errors.maxParticipate}
            helperText="Maximum capacity for this activity"
          />
        </div>
      </div>
    </div>
  );
};