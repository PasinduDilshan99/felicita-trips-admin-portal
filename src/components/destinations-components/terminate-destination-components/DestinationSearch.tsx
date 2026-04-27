"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin, Loader2, AlertCircle, X } from "lucide-react";
import { DestinationForTerminate } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface DestinationSearchProps {
  destinations: DestinationForTerminate[];
  loading: boolean;
  selectedDestination: DestinationForTerminate | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectDestination: (id: number, name: string) => void;
}

export const DestinationSearch: React.FC<DestinationSearchProps> = ({
  destinations,
  loading,
  selectedDestination,
  searchTerm,
  setSearchTerm,
  onSelectDestination,
}) => {
  const { theme } = useTheme();
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationForTerminate[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updateDropdownPosition = useCallback(() => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDestinations(destinations);
      return;
    }
    const filtered = destinations.filter((dest) =>
      dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
    setShowDropdown(true);
    setTimeout(updateDropdownPosition, 0);
  }, [searchTerm, destinations, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [updateDropdownPosition]);

  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
    }
  }, [showDropdown, updateDropdownPosition]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    setTimeout(updateDropdownPosition, 0);
  };

  const handleSelect = (id: number, name: string) => {
    onSelectDestination(id, name);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setShowDropdown(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.18),
            color: theme.primary,
            fontWeight: 600,
            borderRadius: 2,
            padding: "0 1px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const dropdownContent = showDropdown && mounted && (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 99999,
        backgroundColor: theme.surface,
        border: `1.5px solid ${theme.border}`,
        borderRadius: "14px",
        boxShadow: `0 12px 40px ${hexToRgba(theme.text, 0.2)}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 16px 7px",
          borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}`,
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
          Destinations
        </span>
        {!loading && (
          <span className="text-xs font-semibold" style={{ color: theme.primary }}>
            {filteredDestinations.length} result{filteredDestinations.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div style={{ maxHeight: "280px", overflowY: "auto", overflowX: "hidden" }}>
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 size={20} className="animate-spin" style={{ color: theme.primary }} />
            <p className="text-sm" style={{ color: theme.textSecondary }}>Loading destinations…</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <AlertCircle size={22} style={{ color: theme.textSecondary }} />
            <p className="text-sm font-medium" style={{ color: theme.text }}>No destinations found</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>Try a different search term</p>
          </div>
        ) : (
          filteredDestinations.map((dest) => (
            <button
              key={dest.destinationId}
              style={{
                width: "100%",
                padding: "11px 16px",
                textAlign: "left",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                transition: "background 0.14s, transform 0.14s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = hexToRgba(theme.primary, 0.05);
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              onClick={() => handleSelect(dest.destinationId, dest.destinationName)}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.primary, 0.05)})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.primary,
                }}
              >
                <MapPin size={14} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                  {highlightMatch(dest.destinationName, searchTerm)}
                </p>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  ID · {dest.destinationId}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                Select
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative" ref={searchContainerRef}>
        <div
          className={`flex items-center bg-white border-2 rounded-xl transition-all duration-200 ${
            isFocused ? "shadow-lg ring-2" : "hover:opacity-80"
          }`}
          style={{
            borderColor: isFocused ? theme.primary : theme.border,
            boxShadow: isFocused ? `0 0 0 2px ${hexToRgba(theme.primary, 0.2)}` : "none",
            backgroundColor: theme.surface,
          }}
          onClick={() => {
            setShowDropdown(true);
            setIsFocused(true);
            setTimeout(updateDropdownPosition, 0);
          }}
        >
          <Search className="flex-shrink-0 ml-4 w-4 h-4" style={{ color: theme.textSecondary }} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { 
              setIsFocused(true); 
              setShowDropdown(true);
              setTimeout(updateDropdownPosition, 0);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search destination by name..."
            className="flex-1 px-4 py-3 outline-none bg-transparent"
            style={{ color: theme.text }}
          />
          {searchTerm && (
            <button
              className="mr-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: hexToRgba(theme.textSecondary, 0.1) }}
              onClick={handleClear}
            >
              <X size={14} style={{ color: theme.textSecondary }} />
            </button>
          )}
          {selectedDestination && (
            <div
              className="flex-shrink-0 mr-2 flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
            >
              <MapPin size={10} className="text-white" />
              <span className="text-xs font-mono text-white">
                #{selectedDestination.destinationId}
              </span>
            </div>
          )}
        </div>
      </div>
      {dropdownContent}
    </div>
  );
};