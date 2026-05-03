"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MapPin, ChevronDown, Check, Search, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { DestinationService } from "@/services/destinationService";
import { DestinationForTour } from "@/types/destination-types";

interface DestinationSelectorProps {
  value?: number;
  onChange: (destinationId: number) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
  placeholder = "Select a destination...",
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [destinations, setDestinations] = useState<DestinationForTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await DestinationService.getDestinationNames();
        if (response.code === 200 && response.data) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Recalculate dropdown position whenever it opens or on scroll/resize
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideWrapper = wrapperRef.current?.contains(target);
      const clickedInsideButton = buttonRef.current?.contains(target);
      // The portal dropdown won't be inside wrapperRef, so we check by a data attribute
      const clickedInsidePortal = (target as Element)?.closest?.("[data-destination-dropdown]");

      if (!clickedInsideWrapper && !clickedInsideButton && !clickedInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDestination = destinations.find((d) => d.destinationId === value);

  const filteredDestinations = destinations.filter((dest) =>
    dest.destinationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownContent = (
    <div
      data-destination-dropdown
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.06)",
      }}
    >
      {/* Search */}
      <div className="p-3 border-b" style={{ borderColor: theme.border }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: theme.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.border;
            }}
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center" style={{ color: theme.textSecondary }}>
            <div
              className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: theme.primary, borderTopColor: "transparent" }}
            />
            <p className="mt-2 text-sm">Loading destinations...</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
            No destinations found
          </div>
        ) : (
          filteredDestinations.map((dest) => (
            <button
              key={dest.destinationId}
              type="button"
              onClick={() => {
                onChange(dest.destinationId);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="w-full px-4 py-3 text-left flex items-center justify-between transition-colors"
              style={{
                backgroundColor:
                  value === dest.destinationId ? `${theme.primary}15` : "transparent",
              }}
              onMouseEnter={(e) => {
                if (value !== dest.destinationId) {
                  e.currentTarget.style.backgroundColor = `${theme.border}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (value !== dest.destinationId) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <p className="text-sm font-medium" style={{ color: theme.text }}>
                {dest.destinationName}
              </p>
              {value === dest.destinationId && (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: theme.primary }} />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
        Destination
        {required && <span style={{ color: theme.error }}> *</span>}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-left flex items-center justify-between transition-all duration-200"
        style={{
          backgroundColor: theme.background,
          borderColor: error ? theme.error : isOpen ? theme.primary : theme.border,
          color: theme.text,
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <span className={!selectedDestination ? "opacity-70" : ""}>
            {selectedDestination ? selectedDestination.destinationName : placeholder}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: theme.textSecondary,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Portal: renders dropdown directly into document.body, escaping any overflow:hidden parents */}
      {isOpen && typeof window !== "undefined" && createPortal(dropdownContent, document.body)}

      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: theme.error }}>
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};