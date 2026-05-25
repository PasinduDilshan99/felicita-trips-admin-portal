// components/common-components/SeasonSelector.tsx
"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import { BaseDropdown, BaseDropdownOption } from "./BaseDropdown";

interface SeasonSelectorProps {
  value?: number;
  onChange: (seasonId: number) => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

const getMonthName = (month: number): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[month - 1] || "";
};

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
  label = "Season",
  placeholder = "Select a season...",
}) => {
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();

  const seasons = categories?.seasonsList || [];

  const options: BaseDropdownOption[] = seasons.map((season) => ({
    id: season.seasonId,
    label: season.seasonName,
    subLabel: `${getMonthName(season.startMonth)} – ${getMonthName(season.endMonth)}`,
    description: season.seasonDescription,
    badge: season.isPeak ? "Peak" : undefined,
  }));

  return (
    <BaseDropdown
      value={value}
      options={options}
      onChange={(id) => onChange(id as number)}
      label={label}
      placeholder={placeholder}
      error={error}
      required={required}
      icon={<Sparkles className="w-4 h-4" />}
      loading={categoriesLoading}
      searchable={true}
    />
  );
};