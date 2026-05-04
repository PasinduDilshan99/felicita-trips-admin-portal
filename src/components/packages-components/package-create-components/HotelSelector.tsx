"use client";

import React, { useState, useRef, useEffect } from "react";
import { Hotel, Star, ChevronDown, Search, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { HotelNameId } from "@/types/package-types";

interface HotelSelectorProps {
  value: number;
  onChange: (hotelId: number) => void;
  hotels: HotelNameId[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const HotelSelector: React.FC<HotelSelectorProps> = ({
  value,
  onChange,
  hotels,
  error,
  required = false,
  placeholder = "Select a hotel...",
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

  const selectedHotel = hotels.find((h) => h.hotelId === value);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-current" style={{ color: theme.warning }} />
    ));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
        Hotel {required && <span style={{ color: theme.error }}>*</span>}
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
          <Hotel className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
          <span className="text-xs">
            {selectedHotel
              ? `${selectedHotel.hotelName} (${selectedHotel.starRating}★)`
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
                placeholder="Search hotels..."
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
            {filteredHotels.length === 0 ? (
              <div className="p-3 text-center text-xs" style={{ color: theme.textSecondary }}>
                No hotels found
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <button
                  key={hotel.hotelId}
                  type="button"
                  onClick={() => {
                    onChange(hotel.hotelId);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-opacity-10 transition-colors"
                  style={{
                    backgroundColor: value === hotel.hotelId ? `${theme.primary}10` : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium" style={{ color: theme.text }}>
                        {hotel.hotelName}
                      </p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {renderStars(hotel.starRating)}
                      </div>
                    </div>
                    {value === hotel.hotelId && (
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