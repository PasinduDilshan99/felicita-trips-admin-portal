"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Activity, ChevronDown, Check, Search, AlertCircle, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityService } from "@/services/activityService";

interface ActivityItem {
  activityId: number;
  name: string;
  description?: string;
  durationHours?: number;
  priceLocal?: number;
  priceForeigners?: number;
}

interface ActivityMultiSelectorProps {
  destinationId?: number;
  selectedActivities: number[];
  onActivitiesChange: (activities: number[]) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ActivityMultiSelector: React.FC<ActivityMultiSelectorProps> = ({
  destinationId,
  selectedActivities,
  onActivitiesChange,
  error,
  placeholder = "Select activities...",
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch activities when destinationId changes
  useEffect(() => {
    if (destinationId && destinationId > 0 && !disabled) {
      const fetchActivities = async () => {
        try {
          setLoading(true);
          const response = await ActivityService.getActivitiesByDestinationId(destinationId);
          if (response.code === 200 && response.data) {
            setActivities(
              response.data.map((activity) => ({
                activityId: activity.activityId,
                name: activity.name,
                description: activity.description,
                durationHours: activity.durationHours,
                priceLocal: activity.priceLocal,
                priceForeigners: activity.priceForeigners,
              }))
            );
          } else {
            setActivities([]);
          }
        } catch (error) {
          console.error("Error fetching activities:", error);
          setActivities([]);
        } finally {
          setLoading(false);
        }
      };
      fetchActivities();
    } else {
      setActivities([]);
    }
  }, [destinationId, disabled]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Recalculate dropdown position
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const clickedInsideWrapper = wrapperRef.current?.contains(target);
      const clickedInsidePortal = target?.closest?.("[data-activity-multi-dropdown]");

      if (!clickedInsideWrapper && !clickedInsidePortal) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleActivity = (activityId: number) => {
    if (selectedActivities.includes(activityId)) {
      onActivitiesChange(selectedActivities.filter(id => id !== activityId));
    } else {
      onActivitiesChange([...selectedActivities, activityId]);
    }
  };

  const removeActivity = (activityId: number) => {
    onActivitiesChange(selectedActivities.filter(id => id !== activityId));
  };

  const getActivityName = (activityId: number): string => {
    const activity = activities.find(a => a.activityId === activityId);
    return activity?.name || `Activity ${activityId}`;
  };

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDisabled = disabled || !destinationId || destinationId === 0;

  const selectedActivityObjects = activities.filter(a => selectedActivities.includes(a.activityId));

  const dropdownContent = (
    <div
      data-activity-multi-dropdown
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
            ref={searchInputRef}
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
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
            <p className="mt-2 text-sm">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
            {searchQuery
              ? "No activities match your search"
              : "No activities found for this destination"}
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const isSelected = selectedActivities.includes(activity.activityId);
            return (
              <button
                key={activity.activityId}
                type="button"
                onClick={() => toggleActivity(activity.activityId)}
                className="w-full px-4 py-3 text-left flex items-start justify-between transition-colors hover:bg-opacity-10"
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
                      className="w-4 h-4 rounded border-2 flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? theme.primary : "transparent",
                        borderColor: isSelected ? theme.primary : theme.border,
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3" style={{ color: "white" }} />}
                    </span>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {activity.name}
                    </p>
                  </div>
                  {activity.durationHours && (
                    <p className="text-xs mt-1 ml-6" style={{ color: theme.textSecondary }}>
                      Duration: {activity.durationHours} hours
                    </p>
                  )}
                  {activity.priceLocal && (
                    <p className="text-xs ml-6" style={{ color: theme.textSecondary }}>
                      From: Rs {activity.priceLocal} / ${activity.priceForeigners}
                    </p>
                  )}
                  {activity.description && (
                    <p className="text-xs mt-1 ml-6 opacity-75" style={{ color: theme.textSecondary }}>
                      {activity.description.substring(0, 100)}
                      {activity.description.length > 100 ? "..." : ""}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${isDisabled ? "opacity-60" : ""}`} ref={wrapperRef}>
      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
        Activities
      </label>

      {/* Selected Activities Tags */}
      {selectedActivityObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedActivityObjects.map((activity) => (
            <span
              key={activity.activityId}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.primary,
              }}
            >
              {activity.name}
              <button
                type="button"
                onClick={() => removeActivity(activity.activityId)}
                className="hover:opacity-70"
                disabled={isDisabled}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => !isDisabled && setIsOpen((prev) => !prev)}
        disabled={isDisabled}
        className="w-full px-3 py-2 rounded-lg border focus:outline-none text-left flex items-center justify-between transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: theme.background,
          borderColor: error ? theme.error : isOpen ? theme.primary : theme.border,
          color: theme.text,
        }}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            {isDisabled
              ? "Select destination first"
              : loading
              ? "Loading activities..."
              : selectedActivities.length > 0
              ? `${selectedActivities.length} activity(ies) selected`
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

      {isOpen && !isDisabled && typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}

      {error && (
        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: theme.error }}>
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};