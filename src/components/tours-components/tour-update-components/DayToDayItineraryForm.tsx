"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  Trash2,
  Loader2,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DayToDayResponse,
  TourDestinationInput,
  UpdateDestinationInput,
} from "@/types/tour-types";
import { DestinationCategory, ActivityCategory } from "@/types/common-types";
import { ActivityService } from "@/services/activityService";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityByDestination } from "@/types/activity-types";
import { cardVariants, dayVariants } from "@/app/animations/variants";

interface DayToDayItineraryFormProps {
  dayToDayResponses: DayToDayResponse[];
  addedDestinations: TourDestinationInput[];
  removedDestinations: number[];
  removedActivities: number[];
  updatedDestinations: UpdateDestinationInput[];
  availableDestinations: any[];
  availableActivities: any[];
  availableDestinationCategories: DestinationCategory[];
  availableActivityCategories: ActivityCategory[];
  onAddDestination: (
    destinationId: number,
    activityId: number,
    dayNumber: number,
  ) => void;
  onRemoveDestination: (tourDestinationId: number) => void;
  onRemoveActivity: (activityId: number) => void;
  onUpdateDestination: (
    tourDestinationId: number,
    dayNumber: number,
    status: "ACTIVE" | "INACTIVE",
  ) => void;
  onAddActivityToDestination?: (
    destinationId: number,
    activityId: number,
  ) => void;
}

interface NewlyAddedActivity {
  activityId: number;
  activityName: string;
  durationHours: number;
  availableFrom: string;
  availableTo: string;
  activitiesCategory?: Array<{ id: number; name: string; color?: string }>;
  destinationId: number;
}

export const DayToDayItineraryForm: React.FC<DayToDayItineraryFormProps> = ({
  dayToDayResponses,
  addedDestinations,
  removedDestinations,
  removedActivities,
  updatedDestinations,
  availableDestinations,
  availableActivities,
  availableDestinationCategories,
  availableActivityCategories,
  onAddDestination,
  onRemoveDestination,
  onRemoveActivity,
  onUpdateDestination,
  onAddActivityToDestination,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => {
    const initialExpanded = new Set<number>();
    dayToDayResponses.forEach((day) => {
      initialExpanded.add(day.dayNumber);
    });
    return initialExpanded;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    number | null
  >(null);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null,
  );
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // State for dynamic activity fetching
  const [destinationActivities, setDestinationActivities] = useState<
    Map<number, ActivityByDestination[]>
  >(new Map());
  const [loadingActivities, setLoadingActivities] = useState<Set<number>>(
    new Set(),
  );
  const [showAddActivityForm, setShowAddActivityForm] = useState<number | null>(
    null,
  );
  const [selectedNewActivityId, setSelectedNewActivityId] = useState<
    Map<number, number>
  >(new Map());

  // State for newly added activities to display immediately
  const [newlyAddedActivities, setNewlyAddedActivities] = useState<
    NewlyAddedActivity[]
  >([]);

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const isDestinationRemoved = (tourDestinationId: number) =>
    removedDestinations.includes(tourDestinationId);
  const isActivityRemoved = (activityId: number) =>
    removedActivities.includes(activityId);
  const getDestinationUpdate = (tourDestinationId: number) =>
    updatedDestinations.find((u) => u.tourDestinationId === tourDestinationId);

  const getDestinationName = (id: number) => {
    const dest = availableDestinations.find((d) => d.destinationId === id);
    return dest?.destinationName || `Destination ${id}`;
  };

  const getActivityName = (id: number) => {
    // First check in newly added activities
    const newActivity = newlyAddedActivities.find((a) => a.activityId === id);
    if (newActivity) return newActivity.activityName;

    // Then check in available activities
    const activity = availableActivities.find((a) => a.activityId === id);
    return activity?.activityName || `Activity ${id}`;
  };

  // Fetch activities for a specific destination
  const fetchActivitiesForDestination = async (destinationId: number) => {
    if (destinationActivities.has(destinationId)) return;

    setLoadingActivities((prev) => new Set(prev).add(destinationId));
    try {
      const response =
        await ActivityService.getActivitiesByDestinationId(destinationId);
      setDestinationActivities((prev) =>
        new Map(prev).set(destinationId, response.data),
      );
    } catch (error) {
      console.error(
        `Failed to fetch activities for destination ${destinationId}:`,
        error,
      );
    } finally {
      setLoadingActivities((prev) => {
        const newSet = new Set(prev);
        newSet.delete(destinationId);
        return newSet;
      });
    }
  };

  // Handle adding a new activity to destination
  const handleAddActivityToDestination = async (
    destinationId: number,
    activityId: number,
  ) => {
    // Find the activity details from fetched activities
    const activities = destinationActivities.get(destinationId);
    const selectedActivity = activities?.find(
      (a) => a.activityId === activityId,
    );

    if (selectedActivity) {
      // Add to newly added activities state for immediate display
      const newActivity: NewlyAddedActivity = {
        activityId: selectedActivity.activityId,
        activityName: selectedActivity.name,
        durationHours: selectedActivity.durationHours,
        availableFrom: selectedActivity.availableFrom,
        availableTo: selectedActivity.availableTo,
        activitiesCategory: selectedActivity.categories?.map((cat) => ({
          id: cat.categoryId,
          name: cat.categoryName,
        })),
        destinationId: destinationId,
      };

      setNewlyAddedActivities((prev) => [...prev, newActivity]);
    }

    // Call the parent handler if provided
    if (onAddActivityToDestination) {
      onAddActivityToDestination(destinationId, activityId);
    }

    // Clear the selected activity for this destination
    setSelectedNewActivityId((prev) => {
      const newMap = new Map(prev);
      newMap.delete(destinationId);
      return newMap;
    });
    setShowAddActivityForm(null);
  };

  const handleAddDestinationSubmit = () => {
    if (selectedDestinationId && selectedActivityId && selectedDay) {
      onAddDestination(selectedDestinationId, selectedActivityId, selectedDay);
      setSelectedDestinationId(null);
      setSelectedActivityId(null);
      setSelectedDay(1);
      setShowAddForm(false);
    }
  };

  const filteredActivities = availableActivities.filter(
    (a) => a.destinationId === selectedDestinationId,
  );

  // Sort days by day number
  const sortedDays = useMemo(() => {
    return [...dayToDayResponses].sort((a, b) => a.dayNumber - b.dayNumber);
  }, [dayToDayResponses]);

  // Get all activities for a destination (existing + newly added)
  const getDestinationActivities = (
    destinationId: number,
    existingActivities: any[],
  ) => {
    const newActivities = newlyAddedActivities.filter(
      (a) => a.destinationId === destinationId,
    );
    return [...existingActivities, ...newActivities];
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.accent}18`,
              color: theme.accent,
            }}
          >
            <CalendarDays className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Day-to-Day Itinerary
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Plan daily destinations and activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddForm(!showAddForm);
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Day
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "none",
              color: theme.textSecondary,
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* Add Day/Destination Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.accent}08`,
                  border: `1px solid ${theme.accent}25`,
                }}
              >
                <h4
                  className="text-sm font-medium mb-3"
                  style={{ color: theme.text }}
                >
                  Add Destination to Itinerary
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Day Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Destination
                    </label>
                    <select
                      value={selectedDestinationId || ""}
                      onChange={(e) => {
                        setSelectedDestinationId(parseInt(e.target.value));
                        setSelectedActivityId(null);
                      }}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    >
                      <option value="">Select destination...</option>
                      {availableDestinations.map((dest) => (
                        <option
                          key={dest.destinationId}
                          value={dest.destinationId}
                        >
                          {dest.destinationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-xs font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Activity
                  </label>
                  <select
                    value={selectedActivityId || ""}
                    onChange={(e) =>
                      setSelectedActivityId(parseInt(e.target.value))
                    }
                    disabled={!selectedDestinationId}
                    className="w-full px-3 py-2 rounded-lg border-2 text-sm disabled:opacity-50"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  >
                    <option value="">Select activity...</option>
                    {filteredActivities.map((activity) => (
                      <option
                        key={activity.activityId}
                        value={activity.activityId}
                      >
                        {activity.activityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedDestinationId(null);
                      setSelectedActivityId(null);
                      setSelectedDay(1);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                      color: theme.textSecondary,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDestinationSubmit}
                    disabled={!selectedDestinationId || !selectedActivityId}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    style={{
                      backgroundColor: theme.accent,
                      color: "#fff",
                    }}
                  >
                    Add to Itinerary
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Itinerary Days */}
          <div className="space-y-4">
            {sortedDays.map((day) => {
              const visibleDestinations = day.destinations.filter(
                (d) => !isDestinationRemoved(d.destination.destinationId),
              );

              if (visibleDestinations.length === 0) return null;

              const isDayExpanded = expandedDays.has(day.dayNumber);

              return (
                <motion.div
                  key={`day-${day.dayNumber}`}
                  variants={dayVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${isDayExpanded ? theme.accent : theme.border}`,
                    backgroundColor: theme.background,
                  }}
                >
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-opacity-50 transition-colors"
                    style={{
                      backgroundColor: isDayExpanded
                        ? `${theme.accent}05`
                        : "transparent",
                    }}
                    onClick={() => toggleDay(day.dayNumber)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: theme.accent }}
                      >
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: theme.text }}
                        >
                          Day {day.dayNumber}
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {visibleDestinations.length} destination
                          {visibleDestinations.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isDayExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                    </motion.div>
                  </div>

                  {/* Day Content */}
                  {isDayExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      {visibleDestinations.map((destination) => {
                        const update = getDestinationUpdate(
                          destination.destination.destinationId,
                        );
                        const isUpdated = !!update;
                        const isActive = update
                          ? update.status === "ACTIVE"
                          : true;
                        const isLoadingActivities = loadingActivities.has(
                          destination.destination.destinationId,
                        );
                        const activitiesForDestination =
                          destinationActivities.get(
                            destination.destination.destinationId,
                          );
                        const showAddActivity =
                          showAddActivityForm ===
                          destination.destination.destinationId;
                        const selectedActivity = selectedNewActivityId.get(
                          destination.destination.destinationId,
                        );

                        // Get all activities (existing + newly added)
                        const allActivities = getDestinationActivities(
                          destination.destination.destinationId,
                          destination.activities,
                        );

                        return (
                          <div
                            key={destination.destination.destinationId}
                            className="rounded-lg p-3 transition-all"
                            style={{
                              backgroundColor: `${theme.border}10`,
                              border: `1px solid ${isUpdated ? theme.primary : theme.border}`,
                              opacity: isActive ? 1 : 0.6,
                            }}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <MapPin
                                    className="w-3.5 h-3.5"
                                    style={{ color: theme.primary }}
                                  />
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: theme.text }}
                                  >
                                    {destination.destination.destinationName}
                                  </span>
                                  {destination.destination.category?.map(
                                    (cat: any) => (
                                      <span
                                        key={cat.id}
                                        className="text-xs px-1.5 py-0.5 rounded-full"
                                        style={{
                                          backgroundColor: `${cat.color || theme.primary}15`,
                                          color: cat.color || theme.primary,
                                        }}
                                      >
                                        {cat.name}
                                      </span>
                                    ),
                                  )}
                                </div>

                                {/* Activities (Existing + Newly Added) */}
                                <div className="ml-5 space-y-2">
                                  {allActivities.map((activity) => {
                                    const isActivityRemovedFlag =
                                      isActivityRemoved(activity.activityId);
                                    if (isActivityRemovedFlag) return null;

                                    // Check if this is a newly added activity
                                    const isNewlyAdded =
                                      newlyAddedActivities.some(
                                        (a) =>
                                          a.activityId ===
                                            activity.activityId &&
                                          a.destinationId ===
                                            destination.destination
                                              .destinationId,
                                      );

                                    return (
                                      <div
                                        key={activity.activityId}
                                        className={`flex items-start gap-2 p-2 rounded-lg transition-all ${isNewlyAdded ? "animate-pulse" : ""}`}
                                        style={{
                                          backgroundColor: isNewlyAdded
                                            ? `${theme.success}15`
                                            : `${theme.border}20`,
                                          border: isNewlyAdded
                                            ? `1px solid ${theme.success}`
                                            : "none",
                                        }}
                                      >
                                        <Clock
                                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                                          style={{ color: theme.accent }}
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                              className="text-sm font-medium"
                                              style={{ color: theme.text }}
                                            >
                                              {activity.activityName}
                                            </span>
                                            {activity.activitiesCategory?.map(
                                              (cat: any) => (
                                                <span
                                                  key={cat.id}
                                                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                                                  style={{
                                                    backgroundColor: `${cat.color || theme.accent}15`,
                                                    color:
                                                      cat.color || theme.accent,
                                                  }}
                                                >
                                                  {cat.name}
                                                </span>
                                              ),
                                            )}
                                            {isNewlyAdded && (
                                              <span
                                                className="text-[10px] px-1.5 py-0.5 rounded-full"
                                                style={{
                                                  backgroundColor: `${theme.success}20`,
                                                  color: theme.success,
                                                }}
                                              >
                                                Newly Added
                                              </span>
                                            )}
                                          </div>
                                          <p
                                            className="text-xs mt-1"
                                            style={{
                                              color: theme.textSecondary,
                                            }}
                                          >
                                            Duration: {activity.durationHours}h
                                            | Available:{" "}
                                            {activity.availableFrom?.slice(
                                              0,
                                              5,
                                            )}{" "}
                                            -{" "}
                                            {activity.availableTo?.slice(0, 5)}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            onRemoveActivity(
                                              activity.activityId,
                                            )
                                          }
                                          className="p-1 rounded hover:bg-red-500/10 transition-all flex-shrink-0"
                                          title="Remove activity"
                                        >
                                          <Trash2
                                            className="w-3 h-3"
                                            style={{ color: theme.error }}
                                          />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Add New Activity Button */}
                                <button
                                  onClick={() => {
                                    setShowAddActivityForm(
                                      destination.destination.destinationId,
                                    );
                                    fetchActivitiesForDestination(
                                      destination.destination.destinationId,
                                    );
                                  }}
                                  className="mt-3 flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-all"
                                  style={{
                                    backgroundColor: `${theme.accent}15`,
                                    color: theme.accent,
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                  Add Activity to this Destination
                                </button>

                                {/* Add Activity Form */}
                                <AnimatePresence>
                                  {showAddActivity && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="mt-2 p-3 rounded-lg"
                                      style={{
                                        backgroundColor: `${theme.accent}08`,
                                        border: `1px solid ${theme.accent}25`,
                                      }}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span
                                          className="text-xs font-medium"
                                          style={{ color: theme.textSecondary }}
                                        >
                                          Select Activity to Add
                                        </span>
                                        <button
                                          onClick={() =>
                                            setShowAddActivityForm(null)
                                          }
                                          className="p-0.5 rounded hover:bg-black/10"
                                        >
                                          <X
                                            className="w-3 h-3"
                                            style={{
                                              color: theme.textSecondary,
                                            }}
                                          />
                                        </button>
                                      </div>

                                      {isLoadingActivities ? (
                                        <div className="flex items-center justify-center py-4">
                                          <Loader2
                                            className="w-4 h-4 animate-spin"
                                            style={{ color: theme.accent }}
                                          />
                                          <span
                                            className="text-xs ml-2"
                                            style={{
                                              color: theme.textSecondary,
                                            }}
                                          >
                                            Loading activities...
                                          </span>
                                        </div>
                                      ) : activitiesForDestination &&
                                        activitiesForDestination.length > 0 ? (
                                        <>
                                          <select
                                            value={selectedActivity || ""}
                                            onChange={(e) => {
                                              setSelectedNewActivityId((prev) =>
                                                new Map(prev).set(
                                                  destination.destination
                                                    .destinationId,
                                                  parseInt(e.target.value),
                                                ),
                                              );
                                            }}
                                            className="w-full px-2 py-1.5 rounded-lg border text-xs mb-2"
                                            style={{
                                              backgroundColor: theme.background,
                                              borderColor: theme.border,
                                              color: theme.text,
                                            }}
                                          >
                                            <option value="">
                                              Select an activity...
                                            </option>
                                            {activitiesForDestination.map(
                                              (activity) => {
                                                // Check if activity already exists in the destination (including newly added)
                                                const alreadyExists =
                                                  allActivities.some(
                                                    (a) =>
                                                      a.activityId ===
                                                        activity.activityId &&
                                                      !isActivityRemoved(
                                                        activity.activityId,
                                                      ),
                                                  );
                                                if (alreadyExists) return null;

                                                return (
                                                  <option
                                                    key={activity.activityId}
                                                    value={activity.activityId}
                                                  >
                                                    {activity.name} (
                                                    {activity.durationHours}h) -
                                                    ${activity.priceLocal}
                                                  </option>
                                                );
                                              },
                                            )}
                                          </select>
                                          <button
                                            onClick={() => {
                                              if (selectedActivity) {
                                                handleAddActivityToDestination(
                                                  destination.destination
                                                    .destinationId,
                                                  selectedActivity,
                                                );
                                              }
                                            }}
                                            disabled={!selectedActivity}
                                            className="w-full px-2 py-1 rounded-lg text-xs font-medium disabled:opacity-50 transition-all"
                                            style={{
                                              backgroundColor: theme.accent,
                                              color: "#fff",
                                            }}
                                          >
                                            Add Activity
                                          </button>
                                        </>
                                      ) : (
                                        <p
                                          className="text-xs text-center py-2"
                                          style={{ color: theme.textSecondary }}
                                        >
                                          No activities available for this
                                          destination
                                        </p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Day number update */}
                                <select
                                  value={update?.dayNumber || day.dayNumber}
                                  onChange={(e) =>
                                    onUpdateDestination(
                                      destination.destination.destinationId,
                                      parseInt(e.target.value),
                                      isActive ? "ACTIVE" : "INACTIVE",
                                    )
                                  }
                                  className="text-xs px-1 py-1 rounded border"
                                  style={{
                                    backgroundColor: theme.background,
                                    borderColor: theme.border,
                                    color: theme.text,
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {Array.from(
                                    { length: 30 },
                                    (_, i) => i + 1,
                                  ).map((d) => (
                                    <option key={d} value={d}>
                                      Day {d}
                                    </option>
                                  ))}
                                </select>

                                {/* Status Toggle */}
                                <button
                                  onClick={() =>
                                    onUpdateDestination(
                                      destination.destination.destinationId,
                                      update?.dayNumber || day.dayNumber,
                                      isActive ? "INACTIVE" : "ACTIVE",
                                    )
                                  }
                                  className="text-xs px-1.5 py-1 rounded transition-all whitespace-nowrap"
                                  style={{
                                    backgroundColor: isActive
                                      ? `${theme.error}20`
                                      : `${theme.success}20`,
                                    color: isActive
                                      ? theme.error
                                      : theme.success,
                                  }}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </button>

                                {/* Remove Button */}
                                <button
                                  onClick={() =>
                                    onRemoveDestination(
                                      destination.destination.destinationId,
                                    )
                                  }
                                  className="p-1 rounded hover:bg-red-500/10 transition-all"
                                  title="Remove destination"
                                >
                                  <X
                                    className="w-3.5 h-3.5"
                                    style={{ color: theme.error }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* New Destinations Preview */}
          {addedDestinations.length > 0 && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: theme.success }}
              >
                New destinations to add:
              </p>
              <div className="space-y-2">
                {addedDestinations.map((dest, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}10`,
                      border: `1px dashed ${theme.success}`,
                    }}
                  >
                    <CalendarDays
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: theme.success }}
                    />
                    <span className="text-sm" style={{ color: theme.text }}>
                      Day {dest.dayNumber}:{" "}
                      {getDestinationName(dest.destinationId)}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      →
                    </span>
                    <span className="text-sm" style={{ color: theme.text }}>
                      {getActivityName(dest.activityId)}
                    </span>
                    <span
                      className="ml-auto text-xs text-white px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.success }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newly Added Activities Preview (for tracking) */}
          {newlyAddedActivities.length > 0 && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: theme.success }}
              >
                Newly added activities (will be saved with the tour):
              </p>
              <div className="space-y-2">
                {newlyAddedActivities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}10`,
                      border: `1px dashed ${theme.success}`,
                    }}
                  >
                    <Activity
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: theme.success }}
                    />
                    <span className="text-sm" style={{ color: theme.text }}>
                      {activity.activityName}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      for {getDestinationName(activity.destinationId)}
                    </span>
                    <span
                      className="ml-auto text-xs text-white px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.success }}
                    >
                      Will be added
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedDays.length === 0 && addedDestinations.length === 0 && (
            <div className="text-center py-8">
              <CalendarDays
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                style={{ color: theme.textSecondary }}
              />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                No itinerary days added yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Click "Add Day" to start building your tour itinerary
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
