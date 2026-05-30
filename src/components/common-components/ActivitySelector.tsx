"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityService } from "@/services/activityService";

interface ActivitySelectorProps {
  selectedActivityIds: number[];
  onChange: (activityIds: number[]) => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
}

interface Activity {
  activityId: number;
  activityName: string;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivityIds,
  onChange,
  error,
  required = false,
  label = "Select Activities",
  placeholder = "Search and select activities...",
}) => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await ActivityService.getActivityIdsAndNames();
        if (response.code === 200 && response.data) {
          const activityList = response.data.map((item) => ({
            activityId: item.activityId,
            activityName: item.activityName,
          }));
          setActivities(activityList);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDropdownOpen]);

  const filteredActivities = activities.filter((activity) =>
    activity.activityName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleActivity = (activityId: number) => {
    if (selectedActivityIds.includes(activityId)) {
      onChange(selectedActivityIds.filter((id) => id !== activityId));
    } else {
      onChange([...selectedActivityIds, activityId]);
    }
  };

  const getSelectedActivitiesCount = () => {
    return selectedActivityIds.length;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
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
          style={{
            backgroundColor: `${theme.success}18`,
            color: theme.success,
          }}
        >
          <Activity className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-base font-semibold leading-tight"
            style={{ color: theme.text }}
          >
            {label}
            {required && <span style={{ color: theme.error }}> *</span>}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Select activities that belong to this category
          </p>
        </div>
        {getSelectedActivitiesCount() > 0 && (
          <span
            className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${theme.primary}12`,
              color: theme.primary,
            }}
          >
            {getSelectedActivitiesCount()} selected
          </span>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Selected Activities Tags */}
        {selectedActivityIds.length > 0 && (
          <div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: theme.textSecondary }}
            >
              Selected Activities:
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedActivityIds.map((id) => {
                const activity = activities.find((a) => a.activityId === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.primary}15`,
                      color: theme.primary,
                      border: `1px solid ${theme.primary}30`,
                    }}
                  >
                    {activity?.activityName || `Activity ${id}`}
                    <button
                      type="button"
                      onClick={() => handleToggleActivity(id)}
                      className="ml-1 hover:scale-110 transition-transform focus:outline-none"
                      style={{ color: theme.primary }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative" ref={dropdownRef}>
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
                // Prevent page jump on focus
                const scrollY = window.scrollY;
                setTimeout(() => window.scrollTo(0, scrollY), 0);
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
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute w-full mt-2 rounded-xl shadow-lg z-50"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                maxHeight: "300px",
                overflowY: "auto",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
              }}
            >
              {loading ? (
                <div
                  className="p-4 text-center text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  <Loader
                    className="w-5 h-5 animate-spin mx-auto mb-2"
                    style={{ color: theme.primary }}
                  />
                  Loading activities...
                </div>
              ) : filteredActivities.length === 0 ? (
                <div
                  className="p-4 text-center text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {searchQuery
                    ? "No activities match your search"
                    : "No activities available"}
                </div>
              ) : (
                filteredActivities.map((activity) => {
                  const isSelected = selectedActivityIds.includes(
                    activity.activityId,
                  );
                  return (
                    <button
                      key={activity.activityId}
                      type="button"
                      onClick={() => {
                        handleToggleActivity(activity.activityId);
                      }}
                      className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
                      style={{
                        backgroundColor: isSelected
                          ? `${theme.primary}10`
                          : "transparent",
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
                              backgroundColor: isSelected
                                ? theme.primary
                                : theme.textSecondary,
                            }}
                          />
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            {activity.activityName}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check
                          className="w-4 h-4 ml-2 flex-shrink-0 animate-in"
                          style={{ color: theme.primary }}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {!error && activities.length > 0 && (
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Click on activities to select/deselect. You can select multiple
            activities.
          </p>
        )}

        {error && (
          <p
            className="text-xs flex items-center gap-1 animate-in"
            style={{ color: theme.error }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
