"use client";

import React from "react";
import { FileText } from "lucide-react";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { TourInfoFormProps } from "@/types/tour-types";
import { TOUR_DESCRIPTION_MAX_CHARACTERS, TOUR_NAME_MAX_CHARACTERS } from "@/data/tour-constant-data";

export const TourInfoForm: React.FC<TourInfoFormProps> = ({
  formData,
  errors,
  onInputChange,
  onStatusChange,
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
        title="Tour Information"
        description="Core details shown to customers"
        icon={FileText}
      />

      <div className="px-6 py-6 space-y-6">
        <InputField
          label="Tour Name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          placeholder="e.g., Sri Lanka Cultural Tour"
          maxLength={TOUR_NAME_MAX_CHARACTERS}
          showCounter
          error={errors.name}
        />

        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          type="textarea"
          required
          rows={5}
          placeholder="Describe the tour, highlights, what customers can expect..."
          maxLength={TOUR_DESCRIPTION_MAX_CHARACTERS}
          showCounter
          error={errors.description}
        />

        <InputField
          label="Duration (Days)"
          name="duration"
          value={formData.duration}
          onChange={onInputChange}
          type="number"
          required
          min={1}
          step={1}
          placeholder="e.g., 7"
          error={errors.duration}
          helperText="Total number of days for this tour"
        />

        <StatusSelector
          value={formData.status}
          onChange={onStatusChange}
          required
        />
      </div>
    </div>
  );
};
