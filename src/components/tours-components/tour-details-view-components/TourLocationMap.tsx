"use client";

import React from "react";
import { MapPin, Navigation, Maximize2, ExternalLink } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface TourLocationMapProps {
  latitude: number;
  longitude: number;
  startLocation: string;
  endLocation: string;
}

export const TourLocationMap: React.FC<TourLocationMapProps> = ({
  latitude,
  longitude,
  startLocation,
  endLocation,
}) => {
  const { theme } = useTheme();

  const hasCoordinates =
    latitude && longitude && latitude !== 0 && longitude !== 0;

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(startLocation)}`;

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
      {/* Header */}
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <MapPin
            className="w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: theme.primary }}
          />
          <h2
            className="text-base sm:text-lg font-semibold"
            style={{ color: theme.text }}
          >
            Location
          </h2>
        </div>
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: theme.primary }}
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          Open in Google Maps
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* Location Info */}
        <div className="space-y-3 mb-4">
          {/* Start Location */}
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}
            >
              <MapPin className="w-3 h-3" style={{ color: theme.success }} />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: theme.textSecondary }}
              >
                Start Location
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {startLocation}
              </p>
            </div>
          </div>

          {/* End Location */}
          <div className="flex items-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}
            >
              <MapPin className="w-3 h-3" style={{ color: theme.error }} />
            </div>
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: theme.textSecondary }}
              >
                End Location
              </p>
              <p
                className="text-sm sm:text-base font-medium"
                style={{ color: theme.text }}
              >
                {endLocation}
              </p>
            </div>
          </div>

          {/* Coordinates */}
          {hasCoordinates && (
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
              >
                <Navigation
                  className="w-3 h-3"
                  style={{ color: theme.primary }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  Coordinates
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: theme.textSecondary }}
                >
                  {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div
          className="relative rounded-xl overflow-hidden bg-gray-100 transition-all duration-200 hover:shadow-md"
          style={{ minHeight: "250px" }}
        >
          {hasCoordinates ? (
            <iframe
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              width="100%"
              height="250"
              style={{ border: 0, pointerEvents: "none", display: "block" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tour Location Map"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{
                minHeight: "250px",
                backgroundColor: hexToRgba(theme.primary, 0.05),
              }}
            >
              <MapPin
                className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-50"
                style={{ color: theme.primary }}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: theme.text }}
              >
                {startLocation}
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Click to view on Google Maps
              </p>
            </div>
          )}

          {/* Single transparent overlay — sole click handler for the map area */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={openGoogleMaps}
          />

          {/* Maximize button — stopPropagation prevents double-fire with overlay */}
          <button
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ color: theme.primary }}
            onClick={(e) => {
              e.stopPropagation();
              openGoogleMaps();
            }}
          >
            <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        <p
          className="text-xs text-center mt-3"
          style={{ color: theme.textSecondary }}
        >
          Click on the map to open in Google Maps for full navigation
        </p>
      </div>
    </div>
  );
};
