"use client";

import React from "react";
import { Globe, MapPin, Tag, DollarSign } from "lucide-react";
import { SingleDestinationResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface BasicInfoPanelProps {
  destinationDetails: SingleDestinationResponse;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ destinationDetails }) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hexToRgba(theme.primary, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <Globe className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>Basic Information</h3>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Name</p>
          <div className="text-sm font-semibold" style={{ color: theme.text }}>{destinationDetails.destinationName}</div>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Description</p>
          <div className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>{destinationDetails.destinationDescription}</div>
        </div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Location</p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: theme.text }}>
            <MapPin size={12} style={{ color: theme.primary }} />
            {destinationDetails.location}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Coordinates</p>
            <div className="text-xs font-mono" style={{ color: theme.text }}>
              {destinationDetails.latitude.toFixed(6)}°, {destinationDetails.longitude.toFixed(6)}°
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Categories</p>
            <div className="flex flex-wrap gap-1">
              {destinationDetails.destinationCategoryDetailsDtos?.length > 0 ? (
                destinationDetails.destinationCategoryDetailsDtos.map((cat) => (
                  <span
                    key={cat.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: hexToRgba(theme.primary, 0.12),
                      color: theme.primary,
                      border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                    }}
                  >
                    <Tag size={10} />
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="text-xs italic" style={{ color: theme.textSecondary }}>No categories</span>
              )}
            </div>
          </div>
        </div>
        {destinationDetails.extraPrice && (
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Extra Price</p>
            <div className="flex items-center gap-1 text-xs" style={{ color: theme.text }}>
              <DollarSign size={12} style={{ color: theme.primary }} />
              LKR {destinationDetails.extraPrice.toLocaleString()}
              {destinationDetails.extraPriceNote && (
                <span style={{ color: theme.textSecondary }}>· {destinationDetails.extraPriceNote}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};