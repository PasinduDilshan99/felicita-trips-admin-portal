// components/common-components/DestinationSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { BaseDropdown, BaseDropdownOption } from "./BaseDropdown";
import { DestinationService } from "@/services/destinationService";
import { DestinationForTour } from "@/types/destination-types";

interface DestinationSelectorProps {
  value?: number;
  onChange: (destinationId: number) => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
  label = "Destination",
  placeholder = "Select a destination...",
}) => {
  const [destinations, setDestinations] = useState<DestinationForTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await DestinationService.getDestinationNames();
        if (response.code === 200 && response.data) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const options: BaseDropdownOption[] = destinations.map((dest) => ({
    id: dest.destinationId,
    label: dest.destinationName,
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
      icon={<MapPin className="w-4 h-4" />}
      loading={loading}
      searchable={true}
    />
  );
};