"use client";

import React, { useState } from "react";
import { DestinationForTerminate } from "@/types/destination-types";
import { MapPin } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ReusableSearch, {
  SearchItem,
} from "@/components/common-components/ReusableSearch";
import { hexToRgba } from "@/utils/functions";
interface DestinationSearchProps {
  destinations: DestinationForTerminate[];
  loading: boolean;
  selectedDestination: DestinationForTerminate | null;
  onSelectDestination: (id: number, name: string) => void;
  onClearSelection?: () => void;
  initialSearchTerm?: string;
}

export const DestinationSearch: React.FC<DestinationSearchProps> = ({
  destinations,
  loading,
  selectedDestination,
  onSelectDestination,
  onClearSelection,
  initialSearchTerm = "",
}) => {
  const { theme } = useTheme();

  const searchItems: SearchItem[] = destinations.map((dest) => ({
    id: dest.destinationId,
    name: dest.destinationName,
  }));

  const handleSelectItem = (item: SearchItem) => {
    onSelectDestination(item.id as number, item.name);
  };

  const renderDestinationItem = (
    item: SearchItem,
    searchTerm: string,
    isActive: boolean,
  ) => {
    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.18),
              color: theme.primary,
              fontWeight: 600,
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      );
    };

    return (
      <>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${theme.error}, ${theme.error})`
              : hexToRgba(theme.error, 0.1),
          }}
        >
          <MapPin
            size={14}
            style={{ color: isActive ? "#fff" : theme.error }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm" style={{ color: theme.text }}>
            {highlightMatch(item.name, searchTerm)}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: theme.textSecondary }}
          >
            ID · {item.id}
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: isActive
              ? hexToRgba(theme.error, 0.2)
              : hexToRgba(theme.error, 0.1),
            color: theme.error,
            border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
          }}
        >
          {isActive ? "Selected" : "Select"}
        </span>
      </>
    );
  };

  return (
    <ReusableSearch
      items={searchItems}
      loading={loading}
      selectedItem={
        selectedDestination
          ? {
              id: selectedDestination.destinationId,
              name: selectedDestination.destinationName,
            }
          : null
      }
      onSelectItem={handleSelectItem}
      onClearSelection={onClearSelection}
      initialSearchTerm={initialSearchTerm}
      placeholder="Search destination by name..."
      title="Destinations"
      renderItem={renderDestinationItem}
      getItemId={(item) => item.id}
      getItemName={(item) => item.name}
      noResultsMessage="No destinations found"
      loadingMessage="Loading destinations..."
    />
  );
};
