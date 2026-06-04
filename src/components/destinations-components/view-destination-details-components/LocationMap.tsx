"use client";

import React from "react";
import { Navigation, ExternalLink } from "lucide-react";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";
import { LocationMapProps } from "@/types/destination-types";

export const LocationMap: React.FC<LocationMapProps> = ({
  location,
  latitude,
  longitude,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm p-5 fade-up delay-4 transition-colors duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <h3
        className="flex items-center gap-2.5 text-base font-bold mb-4"
        style={{ color: theme.text }}
      >
        <IconBadge icon={Navigation} color="#dc2626" />
        Location
      </h3>
      <div
        className="mb-3.5 rounded-xl overflow-hidden h-[200px] border"
        style={{ borderColor: theme.border }}
      >
        <iframe
          src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Destination Location Map"
        />
      </div>
      <p className="text-sm font-semibold mb-1.5" style={{ color: theme.text }}>
        {location}
      </p>
      <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>
        {latitude?.toFixed(6) ?? "N/A"}, {longitude?.toFixed(6) ?? "N/A"}
      </p>
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps?q=${latitude},${longitude}`,
            "_blank",
          )
        }
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold transition-all hover:scale-[1.02]"
        style={{ backgroundColor: theme.primary }}
      >
        <ExternalLink size={15} /> Open in Google Maps
      </button>
    </div>
  );
};
