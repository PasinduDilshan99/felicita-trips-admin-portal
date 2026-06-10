// components/season-components/create-season-components/SeasonBasicInfo.tsx
"use client";

import React from "react";
import { Calendar, Sun, CloudRain, Thermometer, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InputField } from "@/components/common-components/create-components/InputField";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";

interface SeasonBasicInfoProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

// Fix: Convert to string values to match InputField expected type
const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MONSOON_TYPES = [
  { value: "NORTHEAST", label: "North East Monsoon" },
  { value: "SOUTHWEST", label: "South West Monsoon" },
  { value: "INTER_MONSOON", label: "Inter Monsoon" },
  { value: "DRY", label: "Dry Season" },
];

export const SeasonBasicInfo: React.FC<SeasonBasicInfoProps> = ({
  formData,
  errors,
  onInputChange,
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
        title="Basic Information"
        description="Core details about the season"
        icon={Calendar}
      />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Season Name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            placeholder="e.g., Summer Season"
            maxLength={100}
            showCounter
            error={errors.name}
            helperText="Display name for the season"
          />

          <InputField
            label="Standard Name"
            name="standardName"
            value={formData.standardName}
            onChange={onInputChange}
            required
            placeholder="e.g., Summer"
            maxLength={50}
            showCounter
            error={errors.standardName}
            helperText="Standard international name"
          />

          <InputField
            label="Local Name"
            name="localName"
            value={formData.localName}
            onChange={onInputChange}
            placeholder="e.g., Grishma Ruthu"
            maxLength={50}
            showCounter
            error={errors.localName}
            helperText="Local language name (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Start Month"
            name="startMonth"
            value={formData.startMonth}
            onChange={onInputChange}
            type="select"
            required
            options={MONTHS}
            error={errors.startMonth}
            helperText="When does the season begin?"
          />

          <InputField
            label="End Month"
            name="endMonth"
            value={formData.endMonth}
            onChange={onInputChange}
            type="select"
            required
            options={MONTHS}
            error={errors.endMonth}
            helperText="When does the season end?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Monsoon Type"
            name="monsoonType"
            value={formData.monsoonType}
            onChange={onInputChange}
            type="select"
            required
            options={MONSOON_TYPES}
            error={errors.monsoonType}
            helperText="Type of monsoon or weather pattern"
          />

          <InputField
            label="Rainfall Pattern"
            name="rainfallPattern"
            value={formData.rainfallPattern}
            onChange={onInputChange}
            placeholder="e.g., Heavy rainfall, Moderate showers, Dry"
            maxLength={200}
            showCounter
            error={errors.rainfallPattern}
            helperText="Describe the rainfall pattern"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Minimum Temperature (°C)"
            name="temperatureMin"
            value={formData.temperatureMin}
            onChange={onInputChange}
            type="number"
            required
            min={-10}
            max={50}
            step={0.5}
            placeholder="25"
            error={errors.temperatureMin}
            helperText="Average minimum temperature"
          />

          <InputField
            label="Maximum Temperature (°C)"
            name="temperatureMax"
            value={formData.temperatureMax}
            onChange={onInputChange}
            type="number"
            required
            min={-10}
            max={60}
            step={0.5}
            placeholder="35"
            error={errors.temperatureMax}
            helperText="Average maximum temperature"
          />
        </div>

        <InputField
          label="Weather Summary"
          name="weatherSummary"
          value={formData.weatherSummary}
          onChange={onInputChange}
          type="textarea"
          required
          rows={3}
          placeholder="Brief summary of weather conditions during this season..."
          maxLength={500}
          showCounter
          error={errors.weatherSummary}
          helperText="Short description of typical weather"
        />

        <InputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          type="textarea"
          required
          rows={4}
          placeholder="Detailed description of the season, what to expect, etc."
          maxLength={1000}
          showCounter
          error={errors.description}
          helperText="Comprehensive description of the season"
        />
      </div>
    </div>
  );
};