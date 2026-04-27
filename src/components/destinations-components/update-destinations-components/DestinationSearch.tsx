// components/destinations-components/DestinationSearch.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { DestinationForTerminate } from "@/types/destination-types";
import { Search, MapPin, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
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
  onSelectDestination: (id: number, name: string) => void;
  initialSearchTerm?: string;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({
  destinations,
  loading,
  selectedDestination,
  onSelectDestination,
  initialSearchTerm = "",
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDestinations(destinations);
      return;
    }
    const filtered = destinations.filter((dest) =>
      dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchTerm, destinations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleSelectDestination = (dest: DestinationForTerminate) => {
    onSelectDestination(dest.destinationId, dest.destinationName);
    setSearchTerm(dest.destinationName);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
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
            borderRadius: "2px",
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

  return (
    <>
      <style>{`
        @keyframes dropdownReveal {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes itemEntrance {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 ${hexToRgba(theme.primary, 0.18)}; }
          50% { box-shadow: 0 0 0 5px ${hexToRgba(theme.primary, 0)}; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .dest-search-wrapper {
          position: relative;
        }

        .dest-input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: ${theme.surface};
          border: 1.5px solid ${theme.border};
          border-radius: 14px;
          transition: border-color 0.22s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.22s cubic-bezier(0.22,1,0.36,1),
                      background 0.22s;
          overflow: hidden;
        }

        .dest-input-container:hover {
          border-color: ${theme.primary};
        }

        .dest-input-container.focused {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 4px ${hexToRgba(theme.primary, 0.12)};
          background: ${hexToRgba(theme.primary, 0.02)};
        }

        .dest-input-container.has-value {
          border-color: ${theme.primary};
          background: ${hexToRgba(theme.primary, 0.05)};
        }

        .dest-search-icon {
          flex-shrink: 0;
          margin-left: 16px;
          color: ${theme.textSecondary};
          transition: color 0.2s;
        }

        .dest-input-container.focused .dest-search-icon {
          color: ${theme.primary};
        }

        .dest-input {
          flex: 1;
          padding: 14px 12px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.9375rem;
          color: ${theme.text};
          letter-spacing: 0.01em;
        }

        .dest-input::placeholder {
          color: ${theme.textSecondary};
          opacity: 0.7;
        }

        .dest-clear-btn {
          flex-shrink: 0;
          margin-right: 8px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: ${hexToRgba(theme.primary, 0.15)};
          color: ${theme.primary};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }

        .dest-clear-btn:hover {
          background: ${hexToRgba(theme.primary, 0.25)};
          transform: scale(1.1);
        }

        .dest-id-badge {
          flex-shrink: 0;
          margin-right: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* Dropdown */
        .dest-dropdown {
          position: absolute;
          z-index: 50;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: ${theme.surface};
          border: 1.5px solid ${theme.border};
          border-radius: 14px;
          box-shadow: 0 12px 40px ${hexToRgba(theme.text, 0.13)},
                      0 2px 8px ${hexToRgba(theme.text, 0.06)};
          overflow: hidden;
          animation: dropdownReveal 0.22s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .dest-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px 8px;
          border-bottom: 1px solid ${hexToRgba(theme.border, 0.8)};
        }

        .dest-dropdown-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${theme.textSecondary};
        }

        .dest-dropdown-count {
          font-size: 0.7rem;
          color: ${theme.primary};
          font-weight: 600;
        }

        .dest-dropdown-list {
          max-height: 280px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: ${theme.border} transparent;
        }

        .dest-dropdown-list::-webkit-scrollbar {
          width: 4px;
        }

        .dest-dropdown-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .dest-dropdown-list::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 4px;
        }

        .dest-item {
          width: 100%;
          padding: 11px 16px;
          text-align: left;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid ${hexToRgba(theme.border, 0.5)};
          transition: background 0.14s cubic-bezier(0.22,1,0.36,1),
                      transform 0.14s cubic-bezier(0.22,1,0.36,1);
          animation: itemEntrance 0.25s cubic-bezier(0.22,1,0.36,1) backwards;
        }

        .dest-item:last-child {
          border-bottom: none;
        }

        .dest-item:hover {
          background: ${hexToRgba(theme.primary, 0.05)};
          transform: translateX(2px);
        }

        .dest-item.active {
          background: linear-gradient(90deg, ${hexToRgba(theme.primary, 0.08)} 0%, ${hexToRgba(theme.primary, 0.05)} 100%);
        }

        .dest-item-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)} 0%, ${hexToRgba(theme.primary, 0.05)} 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.primary};
          transition: background 0.14s;
        }

        .dest-item:hover .dest-item-icon,
        .dest-item.active .dest-item-icon {
          background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
          color: #fff;
        }

        .dest-item-body {
          flex: 1;
          min-width: 0;
        }

        .dest-item-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: ${theme.text};
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dest-item-id {
          font-size: 0.72rem;
          color: ${theme.textSecondary};
          margin-top: 1px;
          letter-spacing: 0.04em;
        }

        .dest-item-check {
          flex-shrink: 0;
          color: ${theme.primary};
          opacity: 0;
          transition: opacity 0.15s;
        }

        .dest-item.active .dest-item-check {
          opacity: 1;
        }

        /* Empty / Loading states */
        .dest-state-box {
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .dest-state-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dest-state-icon.loading {
          background: ${hexToRgba(theme.primary, 0.1)};
          color: ${theme.primary};
        }

        .dest-state-icon.empty {
          background: ${hexToRgba(theme.textSecondary, 0.1)};
          color: ${theme.textSecondary};
        }

        .dest-state-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: ${theme.textSecondary};
        }

        .dest-state-sub {
          font-size: 0.775rem;
          color: ${theme.textSecondary};
          opacity: 0.7;
        }

        .dest-spinner {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="dest-search-wrapper">
        {/* Input */}
        <div
          className={`dest-input-container${isFocused ? " focused" : ""}${
            selectedDestination ? " has-value" : ""
          }`}
        >
          <Search className="dest-search-icon" size={17} />

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              setIsFocused(true);
              setShowDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search destinations..."
            className="dest-input"
          />

          {searchTerm && (
            <button
              className="dest-clear-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}

          {selectedDestination && (
            <div className="dest-id-badge">
              <MapPin size={10} />
              #{selectedDestination.destinationId}
            </div>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="dest-dropdown">
            <div className="dest-dropdown-header">
              <span className="dest-dropdown-label">Destinations</span>
              {!loading && (
                <span className="dest-dropdown-count">
                  {filteredDestinations.length} result
                  {filteredDestinations.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="dest-dropdown-list">
              {loading ? (
                <div className="dest-state-box">
                  <div className="dest-state-icon loading">
                    <Loader2 size={20} className="dest-spinner" />
                  </div>
                  <p className="dest-state-title">Loading destinations</p>
                  <p className="dest-state-sub">Please wait a moment...</p>
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="dest-state-box">
                  <div className="dest-state-icon empty">
                    <AlertCircle size={20} />
                  </div>
                  <p className="dest-state-title">No destinations found</p>
                  <p className="dest-state-sub">Try a different search term</p>
                </div>
              ) : (
                filteredDestinations.map((dest, i) => {
                  const isActive =
                    selectedDestination?.destinationId === dest.destinationId;
                  return (
                    <button
                      key={dest.destinationId}
                      className={`dest-item${isActive ? " active" : ""}`}
                      style={{ animationDelay: `${i * 28}ms` }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectDestination(dest)}
                    >
                      <div className="dest-item-icon">
                        <MapPin size={14} />
                      </div>
                      <div className="dest-item-body">
                        <div className="dest-item-name">
                          {highlightMatch(dest.destinationName, searchTerm)}
                        </div>
                        <div className="dest-item-id">
                          ID · {dest.destinationId}
                        </div>
                      </div>
                      <CheckCircle2
                        className="dest-item-check"
                        size={15}
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Backdrop */}
        {showDropdown && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    </>
  );
};

export default DestinationSearch;