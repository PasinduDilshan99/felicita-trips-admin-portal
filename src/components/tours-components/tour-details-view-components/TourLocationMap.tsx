// components/tours-components/tour-details-view-components/TourLocationMap.tsx
"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Maximize2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TourLocationMapProps {
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const TourLocationMap: React.FC<TourLocationMapProps> = ({
  latitude,
  longitude,
  startLocation,
  endLocation,
}) => {
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasCoordinates = latitude && longitude && latitude !== 0 && longitude !== 0;
  
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(startLocation)}`;
  
  const staticMapUrl = hasCoordinates
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=600x300&markers=color:red%7C${latitude},${longitude}&key=YOUR_API_KEY`
    : null;

  const openGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.primary }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            Location
          </h2>
        </div>
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: theme.primary }}
        >
          <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
          Open in Maps
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* Location Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}
            >
              <MapPin className="w-3 h-3" style={{ color: theme.success }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                Start Location
              </p>
              <p className="text-sm sm:text-base font-medium" style={{ color: theme.text }}>
                {startLocation}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}
            >
              <MapPin className="w-3 h-3" style={{ color: theme.error }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                End Location
              </p>
              <p className="text-sm sm:text-base font-medium" style={{ color: theme.text }}>
                {endLocation}
              </p>
            </div>
          </div>

          {hasCoordinates && (
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
              >
                <Navigation className="w-3 h-3" style={{ color: theme.primary }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Coordinates
                </p>
                <p className="text-xs font-mono" style={{ color: theme.textSecondary }}>
                  {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div
          className="relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md"
          style={{ minHeight: "200px" }}
          onClick={openGoogleMaps}
        >
          {hasCoordinates && staticMapUrl ? (
            <img
              src={staticMapUrl}
              alt="Tour location map"
              className="w-full h-full object-cover"
              style={{ minHeight: "200px" }}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ minHeight: "200px", backgroundColor: hexToRgba(theme.primary, 0.05) }}
            >
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-50" style={{ color: theme.primary }} />
              <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                {startLocation}
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Click to view on Google Maps
              </p>
            </div>
          )}
          
          {/* Map overlay button */}
          <button
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 shadow-md transition-all duration-200 hover:scale-105"
            style={{ color: theme.primary }}
            onClick={(e) => {
              e.stopPropagation();
              openGoogleMaps();
            }}
          >
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};