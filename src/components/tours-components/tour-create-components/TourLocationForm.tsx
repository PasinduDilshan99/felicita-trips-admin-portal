"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { FormHeader } from "@/components/common-components/create-components/FormHeader";
import { InputField } from "@/components/common-components/create-components/InputField";

interface TourLocationFormProps {
  formData: any;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export const TourLocationForm: React.FC<TourLocationFormProps> = ({
  formData,
  errors,
  loading,
  onInputChange,
}) => {
  const { theme } = useTheme();
  const [mapExpanded, setMapExpanded] = useState(false);

  const hasCoords = formData.latitude !== 0 && formData.longitude !== 0;

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const syntheticEvent = {
            target: {
              name: "latitude",
              value: position.coords.latitude.toFixed(6),
            },
          } as any;
          onInputChange(syntheticEvent);

          const syntheticEventLng = {
            target: {
              name: "longitude",
              value: position.coords.longitude.toFixed(6),
            },
          } as any;
          onInputChange(syntheticEventLng);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };

  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`
    : "#";

  const embedUrl = hasCoords
    ? `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=13&output=embed`
    : null;

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
        title="Tour Location"
        description="Set start/end locations and map coordinates"
        icon={MapPin}
      />

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Start Location"
            name="startLocation"
            value={formData.startLocation}
            onChange={onInputChange}
            required
            placeholder="e.g., Colombo, Sri Lanka"
            error={errors.startLocation}
          />

          <InputField
            label="End Location"
            name="endLocation"
            value={formData.endLocation}
            onChange={onInputChange}
            required
            placeholder="e.g., Colombo, Sri Lanka"
            error={errors.endLocation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <InputField
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={onInputChange}
              type="number"
              required
              min={-90}
              max={90}
              step={0.000001}
              placeholder="e.g., 6.9271"
              error={errors.latitude}
            />
            <span
              className="absolute right-3 top-9 text-xs pointer-events-none"
              style={{ color: theme.textSecondary }}
            >
              °N
            </span>
          </div>

          <div className="relative">
            <InputField
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={onInputChange}
              type="number"
              required
              min={-180}
              max={180}
              step={0.000001}
              placeholder="e.g., 79.8612"
              error={errors.longitude}
            />
            <span
              className="absolute right-3 top-9 text-xs pointer-events-none"
              style={{ color: theme.textSecondary }}
            >
              °E
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50"
          style={{
            backgroundColor: `${theme.primary}10`,
            borderColor: `${theme.primary}30`,
            color: theme.primary,
          }}
        >
          <Navigation className="w-4 h-4" />
          Use Current Location
        </button>

        {/* Map Toggle */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${theme.border}` }}
        >
          <button
            type="button"
            onClick={() => setMapExpanded(!mapExpanded)}
            className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
            style={{
              backgroundColor: mapExpanded
                ? `${theme.primary}08`
                : theme.background,
              color: hasCoords ? theme.primary : theme.textSecondary,
            }}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {hasCoords
                ? "Preview on Map"
                : "Enter coordinates to preview map"}
            </span>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-300"
              style={{
                transform: mapExpanded ? "rotate(180deg)" : "rotate(0deg)",
                color: theme.textSecondary,
              }}
            />
          </button>

          {mapExpanded && hasCoords && embedUrl && (
            <div className="relative">
              <iframe
                src={embedUrl}
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                title="Tour location preview"
              />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md"
                style={{
                  backgroundColor: theme.surface,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <ExternalLink className="w-3 h-3" />
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
