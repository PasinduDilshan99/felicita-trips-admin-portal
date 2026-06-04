"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader,
  Clock,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityService } from "@/services/activityService";
import { Activity as ActivityType } from "@/types/activity-types";
import {
  ActivityListItem,
  ActivitySelectorProps,
} from "@/types/activity-schedule-types";

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivityId,
  onActivitySelect,
  onActivityClear,
  error,
  required = false,
  label = "Select Activity",
  placeholder = "Search and select an activity...",
  showDetails = true,
  fetchDetails = true,
}) => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityListItem | null>(null);
  const [activityDetails, setActivityDetails] = useState<ActivityType | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const currentSelectedId: number | null = selectedActivity?.activityId ?? null;

  const fetchActivityDetails = async (activityId: number) => {
    try {
      setLoadingDetails(true);
      console.log("Fetching details for activity:", activityId);
      const response = await ActivityService.getActivityById(activityId);
      console.log("Activity details response:", response);
      if (response.code === 200 && response.data) {
        const details = response.data;
        setActivityDetails(details);
        onActivitySelect(activityId, details);
      } else {
        console.error("Failed to fetch activity details:", response);
        setApiError("Failed to load activity details");
      }
    } catch (err) {
      console.error("Error fetching activity details:", err);
      setApiError("Error loading activity details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const response = await ActivityService.getActivityIdsAndNames();

      if (response.code === 200 && response.data) {
        const data: ActivityListItem[] = response.data;
        setActivities(data);

        if (selectedActivityId && selectedActivityId > 0) {
          const preSelected = data.find(
            (a) => a.activityId === selectedActivityId,
          );
          if (preSelected) {
            console.log("Pre-selecting activity:", preSelected);
            setSelectedActivity(preSelected);
            if (fetchDetails) {
              await fetchActivityDetails(preSelected.activityId);
            } else {
              onActivitySelect(preSelected.activityId);
            }
          }
        }
      } else {
        setApiError(response.message || "Failed to load activities");
      }
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Error loading activities. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, []); // Run only once on mount

  // Close dropdown on click outside
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

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current && dropdownMenuRef.current) {
      const inputRect = dropdownRef.current.getBoundingClientRect();
      const dropdownMenu = dropdownMenuRef.current;

      dropdownMenu.style.position = "absolute";
      dropdownMenu.style.top = "100%";
      dropdownMenu.style.left = "0";
      dropdownMenu.style.right = "0";
      dropdownMenu.style.marginTop = "8px";

      const menuHeight = 300;
      const spaceBelow = window.innerHeight - inputRect.bottom;

      if (spaceBelow < menuHeight && inputRect.top > menuHeight) {
        dropdownMenu.style.top = "auto";
        dropdownMenu.style.bottom = "100%";
        dropdownMenu.style.marginBottom = "8px";
        dropdownMenu.style.marginTop = "0";
      } else {
        dropdownMenu.style.top = "100%";
        dropdownMenu.style.bottom = "auto";
        dropdownMenu.style.marginTop = "8px";
        dropdownMenu.style.marginBottom = "0";
      }
    }
  }, [isDropdownOpen]);

  const filteredActivities = React.useMemo(() => {
    if (!searchQuery.trim()) return activities;
    return activities.filter((activity) =>
      activity.activityName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [activities, searchQuery]);

  const handleSelectActivity = (activity: ActivityListItem) => {
    console.log("Selecting activity:", activity);
    setSelectedActivity(activity);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (fetchDetails) {
      fetchActivityDetails(activity.activityId);
    } else {
      onActivitySelect(activity.activityId);
    }
  };

  const handleClearActivity = () => {
    setSelectedActivity(null);
    setActivityDetails(null);
    if (onActivityClear) onActivityClear();
    onActivitySelect(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString;
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
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
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
            Search and select an activity
          </p>
        </div>
        {selectedActivity && (
          <button
            type="button"
            onClick={handleClearActivity}
            className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.error }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        {!selectedActivity ? (
          <div
            className="relative"
            ref={dropdownRef}
            style={{ position: "relative", zIndex: 50 }}
          >
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
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
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
                ) : apiError ? (
                  <div className="p-4 text-center">
                    <div
                      className="text-sm mb-2"
                      style={{ color: theme.error }}
                    >
                      <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                      {apiError}
                    </div>
                    <button
                      onClick={fetchActivities}
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
                    const isSelected =
                      currentSelectedId === activity.activityId;
                    return (
                      <button
                        key={activity.activityId}
                        type="button"
                        onClick={() => handleSelectActivity(activity)}
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
                            e.currentTarget.style.backgroundColor =
                              "transparent";
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
                            className="w-4 h-4 ml-2 flex-shrink-0"
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
                    <Activity
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {selectedActivity.activityName}
                    </p>
                    {activityDetails?.destinationName && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary,
                        }}
                      >
                        {activityDetails.destinationName}
                      </span>
                    )}
                  </div>

                  {loadingDetails ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader
                        className="w-4 h-4 animate-spin"
                        style={{ color: theme.primary }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Loading activity details...
                      </span>
                    </div>
                  ) : (
                    showDetails &&
                    activityDetails && (
                      <div className="space-y-3">
                        {activityDetails.description && (
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {activityDetails.description}
                          </p>
                        )}

                        <div
                          className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t"
                          style={{ borderColor: theme.border }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: theme.primary }}
                            />
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Duration
                              </p>
                              <p
                                className="text-xs font-medium"
                                style={{ color: theme.text }}
                              >
                                {activityDetails.duration_hours} hours
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: theme.success }}
                            />
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Local Price
                              </p>
                              <p
                                className="text-xs font-medium"
                                style={{ color: theme.text }}
                              >
                                {formatCurrency(activityDetails.price_local)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: theme.warning }}
                            />
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Foreigner Price
                              </p>
                              <p
                                className="text-xs font-medium"
                                style={{ color: theme.text }}
                              >
                                {formatCurrency(
                                  activityDetails.price_foreigners,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: theme.primary }}
                            />
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Capacity
                              </p>
                              <p
                                className="text-xs font-medium"
                                style={{ color: theme.text }}
                              >
                                {activityDetails.min_participate} -{" "}
                                {activityDetails.max_participate} persons
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 col-span-2">
                            <Calendar
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: theme.primary }}
                            />
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                Available Time
                              </p>
                              <p
                                className="text-xs font-medium"
                                style={{ color: theme.text }}
                              >
                                {formatTime(activityDetails.available_from)} -{" "}
                                {formatTime(activityDetails.available_to)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {activityDetails.activities_category &&
                          activityDetails.activities_category.length > 0 && (
                            <div
                              className="pt-2 border-t"
                              style={{ borderColor: theme.border }}
                            >
                              <p
                                className="text-xs font-medium mb-2"
                                style={{ color: theme.textSecondary }}
                              >
                                Categories:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {activityDetails.activities_category.map(
                                  (category) => (
                                    <span
                                      key={category.id}
                                      className="text-xs px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: category.is_primary
                                          ? `${theme.primary}20`
                                          : `${theme.primary}10`,
                                        color: theme.primary,
                                      }}
                                    >
                                      {category.name}
                                      {category.is_primary && " (Primary)"}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearActivity}
                  className="ml-3 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20 flex-shrink-0"
                  style={{ color: theme.error }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}

        {!error && !selectedActivity && activities.length > 0 && (
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Search and select an activity from the list
          </p>
        )}

        {error && (
          <p
            className="text-xs flex items-center gap-1"
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
