// components/destination-categories-components/destination-category-details-view-components/DestinationsList.tsx
"use client";

import React from "react";
import { MapPin, Star, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { CategoryDestination } from "@/types/destination-types";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";

interface DestinationsListProps {
  destinations: CategoryDestination[];
  color: string;
}

const DestinationsList = ({ destinations, color }: DestinationsListProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const handleViewDestination = (destinationId: number) => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view/${destinationId}`
    );
  };

  const primaryDestinations = destinations.filter(d => d.primary);
  const otherDestinations = destinations.filter(d => !d.primary);

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: theme.border }}>
        <h2
          className="text-xl font-semibold flex items-center gap-2"
          style={{ color: theme.text }}
        >
          <MapPin className="w-5 h-5" style={{ color: color || theme.primary }} />
          Associated Destinations
          <span
            className="text-sm px-2 py-0.5 rounded-full ml-2"
            style={{
              backgroundColor: hexToRgba(color || theme.primary, 0.1),
              color: color || theme.primary,
            }}
          >
            {destinations.length}
          </span>
        </h2>
        <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
          Destinations that belong to this category
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: theme.border }}>
        {/* Primary Destination Section */}
        {primaryDestinations.length > 0 && (
          <div className="p-4" style={{ backgroundColor: hexToRgba(color || theme.primary, 0.03) }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4" style={{ color: theme.warning }} />
              <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                Primary Destination
              </span>
            </div>
            {primaryDestinations.map((destination) => (
              <DestinationCard
                key={destination.destinationId}
                destination={destination}
                isPrimary={true}
                color={color}
                onView={handleViewDestination}
              />
            ))}
          </div>
        )}

        {/* Other Destinations Section */}
        {otherDestinations.length > 0 && (
          <div className="p-4">
            <div className="mb-3">
              <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                All Destinations ({otherDestinations.length})
              </span>
            </div>
            <div className="space-y-3">
              {otherDestinations.map((destination) => (
                <DestinationCard
                  key={destination.destinationId}
                  destination={destination}
                  isPrimary={false}
                  color={color}
                  onView={handleViewDestination}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Destination Card Sub-component
const DestinationCard = ({ 
  destination, 
  isPrimary, 
  color, 
  onView 
}: { 
  destination: CategoryDestination;
  isPrimary: boolean;
  color: string;
  onView: (id: number) => void;
}) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md"
      style={{
        backgroundColor: isPrimary ? hexToRgba(color, 0.1) : theme.surface,
        border: `1px solid ${isPrimary ? color : theme.border}`,
      }}
      onClick={() => onView(destination.destinationId)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className="font-semibold text-lg"
              style={{ color: theme.text }}
            >
              {destination.destinationName}
            </h3>
            {isPrimary && (
              <span
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.1),
                  color: theme.warning,
                }}
              >
                <Star className="w-3 h-3" />
                Primary
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                destination.destinationStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {destination.destinationStatus}
            </span>
          </div>
          <p className="text-sm mb-2 line-clamp-2" style={{ color: theme.textSecondary }}>
            {destination.destinationDescription}
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: theme.textSecondary }}>
            <MapPin className="w-3 h-3" />
            <span>{destination.location}</span>
            {destination.ratings > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" style={{ color: theme.warning }} />
                  <span>{destination.ratings.toFixed(1)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          className="p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          style={{
            color: color || theme.primary,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onView(destination.destinationId);
          }}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export { DestinationsList };