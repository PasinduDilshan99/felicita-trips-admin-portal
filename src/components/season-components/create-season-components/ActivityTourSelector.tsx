// components/season-components/ActivityTourSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, Compass, Search, ChevronDown, Check, AlertCircle, Loader, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityService } from "@/services/activityService";
import { TourService } from "@/services/tourService";

interface ActivityTourSelectorProps {
  selectedActivityIds: number[];
  selectedTourIds: number[];
  onActivityChange: (activityIds: number[]) => void;
  onTourChange: (tourIds: number[]) => void;
  errors?: {
    activities?: string;
    tours?: string;
  };
}

interface ActivityItem {
  activityId: number;
  activityName: string;
}

interface TourItem {
  tourId: number;
  tourName: string;
}

export const ActivityTourSelector: React.FC<ActivityTourSelectorProps> = ({
  selectedActivityIds,
  selectedTourIds,
  onActivityChange,
  onTourChange,
  errors,
}) => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingTours, setLoadingTours] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");
  const [tourSearch, setTourSearch] = useState("");
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const activityDropdownRef = useRef<HTMLDivElement>(null);
  const tourDropdownRef = useRef<HTMLDivElement>(null);

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await ActivityService.getActivityIdsAndNames();
      if (response.code === 200 && response.data) {
        setActivities(response.data);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setApiError("Failed to load activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchTours = async () => {
    try {
      setLoadingTours(true);
      const response = await TourService.getAllTourNames();
      if (response.code === 200 && response.data) {
        setTours(response.data);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      setApiError("Failed to load tours");
    } finally {
      setLoadingTours(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchTours();
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target as Node)) {
        setIsActivityDropdownOpen(false);
        setActivitySearch("");
      }
      if (tourDropdownRef.current && !tourDropdownRef.current.contains(event.target as Node)) {
        setIsTourDropdownOpen(false);
        setTourSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredActivities = activities.filter((a) =>
    a.activityName.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const filteredTours = tours.filter((t) =>
    t.tourName.toLowerCase().includes(tourSearch.toLowerCase())
  );

  const handleToggleActivity = (activityId: number) => {
    if (selectedActivityIds.includes(activityId)) {
      onActivityChange(selectedActivityIds.filter((id) => id !== activityId));
    } else {
      onActivityChange([...selectedActivityIds, activityId]);
    }
  };

  const handleToggleTour = (tourId: number) => {
    if (selectedTourIds.includes(tourId)) {
      onTourChange(selectedTourIds.filter((id) => id !== tourId));
    } else {
      onTourChange([...selectedTourIds, tourId]);
    }
  };

  const ActivityDropdown = () => (
    <div className="relative" ref={activityDropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: theme.textSecondary }} />
        <input
          type="text"
          placeholder="Search activities..."
          value={activitySearch}
          onChange={(e) => {
            setActivitySearch(e.target.value);
            setIsActivityDropdownOpen(true);
          }}
          onFocus={() => setIsActivityDropdownOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
          style={{
            backgroundColor: theme.background,
            borderColor: isActivityDropdownOpen ? theme.primary : theme.border,
            color: theme.text,
          }}
        />
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
          style={{ color: theme.textSecondary, transform: isActivityDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          onClick={() => setIsActivityDropdownOpen(!isActivityDropdownOpen)}
        />
      </div>

      {isActivityDropdownOpen && (
        <div
          className="absolute w-full mt-2 rounded-xl shadow-lg z-50"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {loadingActivities ? (
            <div className="p-4 text-center"><Loader className="w-5 h-5 animate-spin mx-auto" style={{ color: theme.primary }} /></div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>No activities found</div>
          ) : (
            filteredActivities.map((activity) => {
              const isSelected = selectedActivityIds.includes(activity.activityId);
              return (
                <button
                  key={activity.activityId}
                  type="button"
                  onClick={() => handleToggleActivity(activity.activityId)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-opacity-10"
                  style={{ backgroundColor: isSelected ? `${theme.primary}10` : "transparent" }}
                >
                  <span className="text-sm" style={{ color: theme.text }}>{activity.activityName}</span>
                  {isSelected && <Check className="w-4 h-4" style={{ color: theme.primary }} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  const TourDropdown = () => (
    <div className="relative" ref={tourDropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: theme.textSecondary }} />
        <input
          type="text"
          placeholder="Search tours..."
          value={tourSearch}
          onChange={(e) => {
            setTourSearch(e.target.value);
            setIsTourDropdownOpen(true);
          }}
          onFocus={() => setIsTourDropdownOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
          style={{
            backgroundColor: theme.background,
            borderColor: isTourDropdownOpen ? theme.primary : theme.border,
            color: theme.text,
          }}
        />
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
          style={{ color: theme.textSecondary, transform: isTourDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          onClick={() => setIsTourDropdownOpen(!isTourDropdownOpen)}
        />
      </div>

      {isTourDropdownOpen && (
        <div
          className="absolute w-full mt-2 rounded-xl shadow-lg z-50"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {loadingTours ? (
            <div className="p-4 text-center"><Loader className="w-5 h-5 animate-spin mx-auto" style={{ color: theme.primary }} /></div>
          ) : filteredTours.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>No tours found</div>
          ) : (
            filteredTours.map((tour) => {
              const isSelected = selectedTourIds.includes(tour.tourId);
              return (
                <button
                  key={tour.tourId}
                  type="button"
                  onClick={() => handleToggleTour(tour.tourId)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-opacity-10"
                  style={{ backgroundColor: isSelected ? `${theme.primary}10` : "transparent" }}
                >
                  <span className="text-sm" style={{ color: theme.text }}>{tour.tourName}</span>
                  {isSelected && <Check className="w-4 h-4" style={{ color: theme.primary }} />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: theme.border }}>
        <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}>
          <Activity className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: theme.text }}>Activities & Tours</h2>
          <p className="text-xs" style={{ color: theme.textSecondary }}>Select activities and tours that are available during this season</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Activities Section */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
            Activities <span style={{ color: theme.error }}>*</span>
          </label>
          <ActivityDropdown />
          
          {/* Selected Activities Tags */}
          {selectedActivityIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedActivityIds.map((id) => {
                const activity = activities.find((a) => a.activityId === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                    {activity?.activityName || `Activity ${id}`}
                    <button type="button" onClick={() => handleToggleActivity(id)} className="hover:scale-110">×</button>
                  </span>
                );
              })}
            </div>
          )}
          {errors?.activities && <p className="mt-1 text-xs" style={{ color: theme.error }}>{errors.activities}</p>}
        </div>

        {/* Tours Section */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
            Tours <span style={{ color: theme.error }}>*</span>
          </label>
          <TourDropdown />
          
          {/* Selected Tours Tags */}
          {selectedTourIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTourIds.map((id) => {
                const tour = tours.find((t) => t.tourId === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                    {tour?.tourName || `Tour ${id}`}
                    <button type="button" onClick={() => handleToggleTour(id)} className="hover:scale-110">×</button>
                  </span>
                );
              })}
            </div>
          )}
          {errors?.tours && <p className="mt-1 text-xs" style={{ color: theme.error }}>{errors.tours}</p>}
        </div>
      </div>
    </div>
  );
};