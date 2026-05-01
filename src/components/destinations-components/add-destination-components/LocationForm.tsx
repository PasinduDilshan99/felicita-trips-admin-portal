"use client";

import React, { useId, useRef, useState } from "react";
import { MapPin, Navigation, AlertCircle, ExternalLink, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface LocationFormProps {
  formData: any;
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGetCurrentLocation: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  errors,
  loading,
  onInputChange,
  onGetCurrentLocation,
}) => {
  const { theme } = useTheme();
  const uid = useId();
  const [mapExpanded, setMapExpanded] = useState(false);

  const hasCoords =
    formData.latitude !== "" &&
    formData.latitude !== null &&
    formData.longitude !== "" &&
    formData.longitude !== null;

  const focusHandlers = (hasError: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${
        hasError ? theme.error : theme.primary
      }18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const mapsUrl =
    hasCoords
      ? `https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`
      : "#";

  const embedUrl =
    hasCoords
      ? `https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=13&output=embed`
      : null;

  return (
    <>
      <style>{`
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .field-error { animation: errorShake 0.35s ease; }

        @keyframes mapSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .map-panel { animation: mapSlideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .location-btn {
          transition: background 0.18s ease, border-color 0.18s ease,
                      box-shadow 0.18s ease, transform 0.15s ease;
        }
        .location-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .location-btn:not(:disabled):active { transform: translateY(0); }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner { animation: spin 0.8s linear infinite; }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.error}18`,
              color: theme.error,
            }}
          >
            <MapPin className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Location & Coordinates
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Used for map display and filtering
            </p>
          </div>

          {/* Coords badge */}
          {hasCoords && (
            <span
              className="ml-auto text-xs font-mono px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${theme.primary}12`,
                color: theme.primary,
                border: `1px solid ${theme.primary}25`,
              }}
            >
              {Number(formData.latitude).toFixed(4)}°,{" "}
              {Number(formData.longitude).toFixed(4)}°
            </span>
          )}
        </div>

        {/* ── Fields ── */}
        <div className="px-6 py-6 space-y-5">

          {/* Location name */}
          <div>
            <label
              htmlFor={`${uid}-location`}
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Location Name
              <span style={{ color: theme.error }}> *</span>
            </label>
            <input
              id={`${uid}-location`}
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="e.g. Sigiriya, Central Province, Sri Lanka"
              className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                errors.location ? " field-error" : ""
              }`}
              style={{
                ...fieldBase,
                borderColor: errors.location ? theme.error : theme.border,
              }}
              {...focusHandlers(!!errors.location)}
            />
            {errors.location && (
              <p
                className="mt-1.5 text-xs flex items-center gap-1"
                style={{ color: theme.error }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Lat / Lng + button */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">

            {/* Latitude */}
            <div>
              <label
                htmlFor={`${uid}-latitude`}
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Latitude
                <span style={{ color: theme.error }}> *</span>
              </label>
              <div className="relative">
                <input
                  id={`${uid}-latitude`}
                  type="number"
                  name="latitude"
                  value={formData.latitude ?? ""}
                  onChange={onInputChange}
                  step="0.000001"
                  min="-90"
                  max="90"
                  placeholder="e.g. 7.9570"
                  className={`w-full pl-4 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                    errors.latitude ? " field-error" : ""
                  }`}
                  style={{
                    ...fieldBase,
                    borderColor: errors.latitude ? theme.error : theme.border,
                  }}
                  {...focusHandlers(!!errors.latitude)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium pointer-events-none"
                  style={{ color: theme.textSecondary }}
                >
                  °N
                </span>
              </div>
              {errors.latitude && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.latitude}
                </p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label
                htmlFor={`${uid}-longitude`}
                className="block text-sm font-medium mb-1.5"
                style={{ color: theme.textSecondary }}
              >
                Longitude
                <span style={{ color: theme.error }}> *</span>
              </label>
              <div className="relative">
                <input
                  id={`${uid}-longitude`}
                  type="number"
                  name="longitude"
                  value={formData.longitude ?? ""}
                  onChange={onInputChange}
                  step="0.000001"
                  min="-180"
                  max="180"
                  placeholder="e.g. 80.7600"
                  className={`w-full pl-4 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm${
                    errors.longitude ? " field-error" : ""
                  }`}
                  style={{
                    ...fieldBase,
                    borderColor: errors.longitude ? theme.error : theme.border,
                  }}
                  {...focusHandlers(!!errors.longitude)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium pointer-events-none"
                  style={{ color: theme.textSecondary }}
                >
                  °E
                </span>
              </div>
              {errors.longitude && (
                <p
                  className="mt-1.5 text-xs flex items-center gap-1"
                  style={{ color: theme.error }}
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.longitude}
                </p>
              )}
            </div>

            {/* Current location button */}
            <button
              type="button"
              onClick={onGetCurrentLocation}
              disabled={loading}
              className="cursor-pointer location-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner inline-block w-4 h-4 border-2 rounded-full border-t-transparent"
                    style={{ borderColor: `${theme.primary}40`, borderTopColor: theme.primary }}
                  />
                  Locating…
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Use My Location
                </>
              )}
            </button>
          </div>

          {/* Map toggle */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${theme.border}` }}
          >
            <button
              type="button"
              onClick={() => setMapExpanded((p) => !p)}
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
                {hasCoords ? "Preview on Map" : "Map Preview (enter coordinates first)"}
              </span>
              <ChevronDown
                className="w-4 h-4 transition-transform duration-300"
                style={{
                  transform: mapExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  color: theme.textSecondary,
                }}
              />
            </button>

            {mapExpanded && (
              <div className="map-panel">
                {hasCoords && embedUrl ? (
                  <div className="relative">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="260"
                      style={{ border: 0, display: "block" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location preview"
                    />
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md transition-opacity hover:opacity-90"
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
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-10 gap-2"
                    style={{ backgroundColor: theme.background }}
                  >
                    <MapPin
                      className="w-8 h-8 opacity-30"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Enter latitude and longitude to preview the map
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};