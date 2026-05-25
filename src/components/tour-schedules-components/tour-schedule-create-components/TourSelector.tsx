// components/tour-schedule-components/TourSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, ChevronDown, Check, AlertCircle, Loader, Clock, DollarSign, Calendar, RefreshCw, Compass } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourService } from "@/services/tourService";
import { Tour } from "@/types/tour-types";

interface TourSelectorProps {
  selectedTourId?: number;
  onTourSelect: (tourId: number, tourDetails?: Tour) => void;
  onTourClear?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  showDetails?: boolean;
  fetchDetails?: boolean;
}

interface TourListItem {
  tourId: number;
  tourName: string;
}

export const TourSelector: React.FC<TourSelectorProps> = ({
  selectedTourId,
  onTourSelect,
  onTourClear,
  error,
  required = false,
  label = "Select Tour",
  placeholder = "Search and select a tour...",
  showDetails = true,
  fetchDetails = true,
}) => {
  const { theme } = useTheme();
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourListItem | null>(null);
  const [tourDetails, setTourDetails] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const currentSelectedId: number | null = selectedTour?.tourId ?? null;

  const fetchTourDetails = async (tourId: number) => {
    try {
      setLoadingDetails(true);
      const response = await TourService.getTourById(tourId);
      if (response.code === 200 && response.data) {
        const details = response.data;
        setTourDetails(details);
        onTourSelect(tourId, details);
      } else {
        console.error("Failed to fetch tour details:", response);
        setApiError("Failed to load tour details");
      }
    } catch (err) {
      console.error("Error fetching tour details:", err);
      setApiError("Error loading tour details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchTours = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setApiError(null);
      const response = await TourService.getToursForTerminate();
      if (response.code === 200 && response.data) {
        const data: TourListItem[] = response.data;
        setTours(data);

        if (selectedTourId && selectedTourId > 0) {
          const preSelected = data.find((t) => t.tourId === selectedTourId);
          if (preSelected) {
            setSelectedTour(preSelected);
            if (fetchDetails) {
              await fetchTourDetails(preSelected.tourId);
            } else {
              onTourSelect(preSelected.tourId);
            }
          }
        }
      } else {
        setApiError(response.message || "Failed to load tours");
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      setApiError(err instanceof Error ? err.message : "Error loading tours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tours on mount
  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current && dropdownMenuRef.current) {
      const inputRect = dropdownRef.current.getBoundingClientRect();
      const dropdownMenu = dropdownMenuRef.current;
      
      dropdownMenu.style.position = 'absolute';
      dropdownMenu.style.top = '100%';
      dropdownMenu.style.left = '0';
      dropdownMenu.style.right = '0';
      dropdownMenu.style.marginTop = '8px';
      
      const menuHeight = 300;
      const spaceBelow = window.innerHeight - inputRect.bottom;
      
      if (spaceBelow < menuHeight && inputRect.top > menuHeight) {
        dropdownMenu.style.top = 'auto';
        dropdownMenu.style.bottom = '100%';
        dropdownMenu.style.marginBottom = '8px';
        dropdownMenu.style.marginTop = '0';
      }
    }
  }, [isDropdownOpen]);

  const filteredTours = React.useMemo(() => {
    if (!searchQuery.trim()) return tours;
    return tours.filter((tour) =>
      tour.tourName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tours, searchQuery]);

  const handleSelectTour = (tour: TourListItem) => {
    setSelectedTour(tour);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (fetchDetails) {
      fetchTourDetails(tour.tourId);
    } else {
      onTourSelect(tour.tourId);
    }
  };

  const handleClearTour = () => {
    setSelectedTour(null);
    setTourDetails(null);
    if (onTourClear) onTourClear();
    onTourSelect(0);
  };

  return (
    <div
      className="rounded-2xl overflow-visible transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
        >
          <Compass className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
            {label}
            {required && <span style={{ color: theme.error }}> *</span>}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Search and select a tour
          </p>
        </div>
        {selectedTour && (
          <button
            type="button"
            onClick={handleClearTour}
            className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.error }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        {!selectedTour ? (
          <div className="relative" ref={dropdownRef} style={{ position: 'relative', zIndex: 50 }}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: theme.textSecondary }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  setIsDropdownOpen(true);
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm transition-all duration-200"
                style={{
                  backgroundColor: theme.background,
                  borderColor: isDropdownOpen ? theme.primary : theme.border,
                  color: theme.text,
                }}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
                style={{
                  color: theme.textSecondary,
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
            </div>

            {isDropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute w-full mt-2 rounded-xl shadow-lg z-[9999]"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
              >
                {loading ? (
                  <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
                    <Loader className="w-5 h-5 animate-spin mx-auto mb-2" style={{ color: theme.primary }} />
                    Loading tours...
                  </div>
                ) : apiError ? (
                  <div className="p-4 text-center">
                    <div className="text-sm mb-2" style={{ color: theme.error }}>
                      <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                      {apiError}
                    </div>
                    <button
                      onClick={fetchTours}
                      className="text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                      style={{
                        backgroundColor: `${theme.primary}20`,
                        color: theme.primary,
                      }}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  </div>
                ) : filteredTours.length === 0 ? (
                  <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
                    {searchQuery ? "No tours match your search" : "No tours available"}
                  </div>
                ) : (
                  filteredTours.map((tour) => {
                    const isSelected = currentSelectedId === tour.tourId;
                    return (
                      <button
                        key={tour.tourId}
                        type="button"
                        onClick={() => handleSelectTour(tour)}
                        className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
                        style={{
                          backgroundColor: isSelected ? `${theme.primary}10` : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = `${theme.border}30`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:scale-150"
                              style={{
                                backgroundColor: isSelected ? theme.primary : theme.textSecondary,
                              }}
                            />
                            <p className="text-sm font-medium" style={{ color: theme.text }}>
                              {tour.tourName}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 ml-2 flex-shrink-0" style={{ color: theme.primary }} />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: `${theme.primary}08`,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4" style={{ color: theme.primary }} />
                    <p className="text-sm font-semibold" style={{ color: theme.text }}>
                      {selectedTour.tourName}
                    </p>
                    {tourDetails?.tourTypeName && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary,
                        }}
                      >
                        {tourDetails.tourTypeName}
                      </span>
                    )}
                  </div>

                  {loadingDetails ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader className="w-4 h-4 animate-spin" style={{ color: theme.primary }} />
                      <span className="text-xs" style={{ color: theme.textSecondary }}>
                        Loading tour details...
                      </span>
                    </div>
                  ) : (
                    showDetails &&
                    tourDetails && (
                      <div className="space-y-3">
                        {tourDetails.tourDescription && (
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            {tourDetails.tourDescription}
                          </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Duration</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.duration} days
                              </p>
                            </div>
                          </div>

                          {/* Start Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.success }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Start</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.startLocation}
                              </p>
                            </div>
                          </div>

                          {/* End Location */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.warning }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>End</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.endLocation}
                              </p>
                            </div>
                          </div>

                          {/* Category */}
                          <div className="flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Category</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.tourCategoryName}
                              </p>
                            </div>
                          </div>

                          {/* Season */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Season</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.seasonName}
                              </p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: tourDetails.statusName === "ACTIVE" ? theme.success : theme.error,
                              }}
                            />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Status</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {tourDetails.statusName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearTour}
                  className="ml-3 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20 flex-shrink-0"
                  style={{ color: theme.error }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}

        {!error && !selectedTour && tours.length > 0 && (
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Search and select a tour from the list
          </p>
        )}

        {error && (
          <p className="text-xs flex items-center gap-1" style={{ color: theme.error }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};