"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bus, ChevronDown, Search, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { VehicleNumberIdType } from "@/types/package-types";

interface VehicleSelectorProps {
  value: number;
  onChange: (vehicleId: number) => void;
  vehicles: VehicleNumberIdType[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  value,
  onChange,
  vehicles,
  error,
  required = false,
  placeholder = "Select a vehicle...",
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedVehicle = vehicles.find((v) => v.vehicleId === value);

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vehicle.vehicleNumber && vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
        Vehicle {required && <span style={{ color: theme.error }}>*</span>}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg border focus:outline-none text-left flex items-center justify-between transition-all duration-200 text-sm"
        style={{
          backgroundColor: theme.background,
          borderColor: error ? theme.error : isOpen ? theme.primary : theme.border,
          color: theme.text,
        }}
      >
        <div className="flex items-center gap-2">
          <Bus className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
          <span className="text-xs">
            {selectedVehicle
              ? `${selectedVehicle.vehicleType}${selectedVehicle.vehicleNumber ? ` (${selectedVehicle.vehicleNumber})` : ''}`
              : placeholder}
          </span>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{
            color: theme.textSecondary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: theme.border }}>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: theme.textSecondary }} />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 rounded text-xs outline-none"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.text,
                }}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredVehicles.length === 0 ? (
              <div className="p-3 text-center text-xs" style={{ color: theme.textSecondary }}>
                No vehicles found
              </div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <button
                  key={vehicle.vehicleId}
                  type="button"
                  onClick={() => {
                    onChange(vehicle.vehicleId);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-opacity-10 transition-colors"
                  style={{
                    backgroundColor: value === vehicle.vehicleId ? `${theme.primary}10` : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium" style={{ color: theme.text }}>
                        {vehicle.vehicleType}
                      </p>
                      {vehicle.vehicleNumber && (
                        <p className="text-xs opacity-70" style={{ color: theme.textSecondary }}>
                          #{vehicle.vehicleNumber}
                        </p>
                      )}
                    </div>
                    {value === vehicle.vehicleId && (
                      <Check className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: theme.error }}>
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

import { Check } from "lucide-react";