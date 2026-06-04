"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, MapPin, Navigation, DollarSign } from "lucide-react";
import { SingleDestinationResponse } from "@/types/destination-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

interface DestinationBasicInfoFormProps {
  destination: SingleDestinationResponse;
  originalDestination: SingleDestinationResponse | null;
  onFieldChange: (field: string, value: any) => void;
  statusOptions: Array<{ value: string; label: string; description: string; color: string }>;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
}

export const DestinationBasicInfoForm: React.FC<DestinationBasicInfoFormProps> = ({
  destination,
  originalDestination,
  onFieldChange,
  statusOptions,
  expandedSections,
  onToggleSection,
  theme,
}) => {
  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const hasChanged = (field: string): boolean => {
    if (!originalDestination) return false;
    return originalDestination[field as keyof SingleDestinationResponse] !== 
           destination[field as keyof SingleDestinationResponse];
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("basic")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("basic") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("basic") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Edit className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Basic Information
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Core details about the destination
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("basic") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6 space-y-5">
            {/* Destination Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                Destination Name <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="text"
                value={destination.destinationName}
                onChange={(e) => onFieldChange("destinationName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("destinationName") ? theme.primary : theme.border,
                }}
                placeholder="e.g., Sigiriya Rock Fortress"
                {...focusHandlers}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                Description <span style={{ color: theme.error }}>*</span>
              </label>
              <textarea
                value={destination.destinationDescription}
                onChange={(e) => onFieldChange("destinationDescription", e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("destinationDescription") ? theme.primary : theme.border,
                }}
                placeholder="Describe the destination in detail..."
                {...focusHandlers}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                <MapPin className="w-3.5 h-3.5" />
                Location <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="text"
                value={destination.location}
                onChange={(e) => onFieldChange("location", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("location") ? theme.primary : theme.border,
                }}
                placeholder="e.g., Matale District, Sri Lanka"
                {...focusHandlers}
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                  <Navigation className="w-3.5 h-3.5" />
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={destination.latitude}
                  onChange={(e) => onFieldChange("latitude", parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{
                    ...fieldBase,
                    borderColor: hasChanged("latitude") ? theme.primary : theme.border,
                  }}
                  placeholder="e.g., 7.9567"
                  {...focusHandlers}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                  <Navigation className="w-3.5 h-3.5" />
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={destination.longitude}
                  onChange={(e) => onFieldChange("longitude", parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{
                    ...fieldBase,
                    borderColor: hasChanged("longitude") ? theme.primary : theme.border,
                  }}
                  placeholder="e.g., 80.7417"
                  {...focusHandlers}
                />
              </div>
            </div>

            {/* Extra Price & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                  <DollarSign className="w-3.5 h-3.5" />
                  Extra Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={destination.extraPrice || ""}
                  onChange={(e) => onFieldChange("extraPrice", parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  placeholder="0.00"
                  {...focusHandlers}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                  Extra Price Note
                </label>
                <input
                  type="text"
                  value={destination.extraPriceNote || ""}
                  onChange={(e) => onFieldChange("extraPriceNote", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                  style={{ ...fieldBase, borderColor: theme.border }}
                  placeholder="e.g., Entrance fee, Tax, etc."
                  {...focusHandlers}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((opt) => {
                  const isSelected = destination.statusName === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onFieldChange("statusName", opt.value)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected ? `${opt.color}10` : theme.background,
                        borderColor: isSelected ? opt.color : theme.border,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium" style={{ color: isSelected ? opt.color : theme.text }}>
                          {opt.label}
                        </span>
                        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                          {opt.description}
                        </p>
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4" style={{ color: opt.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};