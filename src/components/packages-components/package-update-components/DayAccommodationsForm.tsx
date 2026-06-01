"use client";

import React, { useState } from "react";
import {
  Hotel,
  Bus,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cake,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { DayAccommodationResponse } from "@/types/package-types";
import {
  AddDayAccommodationRequest,
  UpdateDayAccommodationRequest,
} from "@/types/package-types";
import { useTheme } from "@/contexts/ThemeContext";
import { cardVariants, dayVariants, formVariants } from "@/app/animations/variants";

interface DayAccommodationsFormProps {
  dayAccommodations: DayAccommodationResponse[];
  addedDayAccommodations: AddDayAccommodationRequest[];
  removedDayAccommodations: number[];
  updatedDayAccommodations: UpdateDayAccommodationRequest[];
  onAddDayAccommodation: (accommodation: AddDayAccommodationRequest) => void;
  onRemoveDayAccommodation: (accommodationId: number) => void;
  onUpdateDayAccommodation: (
    accommodation: UpdateDayAccommodationRequest,
  ) => void;
  error?: string;
}

const MealToggle: React.FC<{
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string | null;
  onToggle: (enabled: boolean) => void;
  onDescriptionChange: (description: string) => void;
  theme: any;
}> = ({
  label,
  icon,
  enabled,
  description,
  onToggle,
  onDescriptionChange,
  theme,
}) => (
  <div
    className="p-3 rounded-lg"
    style={{ backgroundColor: `${theme.border}10` }}
  >
    <div className="flex items-center justify-between mb-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span
          className="flex items-center gap-1.5 text-sm"
          style={{ color: theme.text }}
        >
          {icon}
          {label}
        </span>
      </label>
    </div>
    {enabled && (
      <input
        type="text"
        value={description || ""}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder={`${label} description (optional)`}
        className="w-full px-3 py-2 rounded-lg border text-sm"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
          color: theme.text,
        }}
      />
    )}
  </div>
);

export const DayAccommodationsForm: React.FC<DayAccommodationsFormProps> = ({
  dayAccommodations,
  addedDayAccommodations,
  removedDayAccommodations,
  updatedDayAccommodations,
  onAddDayAccommodation,
  onRemoveDayAccommodation,
  onUpdateDayAccommodation,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => {
    const initialExpanded = new Set<number>();
    dayAccommodations.forEach((day) => {
      initialExpanded.add(day.dayNumber);
    });
    return initialExpanded;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDay, setEditingDay] = useState<DayAccommodationResponse | null>(
    null,
  );

  const [newDayData, setNewDayData] = useState<AddDayAccommodationRequest>({
    dayNumber: dayAccommodations.length + 1,
    breakfast: false,
    breakfastDescription: null,
    lunch: false,
    lunchDescription: null,
    dinner: false,
    dinnerDescription: null,
    morningTea: false,
    morningTeaDescription: null,
    eveningTea: false,
    eveningTeaDescription: null,
    snacks: false,
    snackNote: null,
    hotelId: 0,
    transportId: 0,
    otherNotes: null,
  });

  const [editDayData, setEditDayData] = useState<UpdateDayAccommodationRequest>(
    {
      packageDayAccommodationId: 0,
      dayNumber: 0,
      breakfast: false,
      breakfastDescription: null,
      lunch: false,
      lunchDescription: null,
      dinner: false,
      dinnerDescription: null,
      morningTea: false,
      morningTeaDescription: null,
      eveningTea: false,
      eveningTeaDescription: null,
      snacks: false,
      snackNote: null,
      hotelId: 0,
      transportId: 0,
      otherNotes: null,
      status: "ACTIVE",
    },
  );

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) newSet.delete(dayNumber);
      else newSet.add(dayNumber);
      return newSet;
    });
  };

  const isDayRemoved = (id: number) => removedDayAccommodations.includes(id);
  const isDayUpdated = (id: number) =>
    updatedDayAccommodations.some((u) => u.packageDayAccommodationId === id);
  const getDayUpdate = (id: number) =>
    updatedDayAccommodations.find((u) => u.packageDayAccommodationId === id);

  const handleAddDay = () => {
    if (!newDayData.hotelId || !newDayData.transportId) {
      alert("Please select hotel and transport");
      return;
    }
    onAddDayAccommodation(newDayData);
    setNewDayData({
      dayNumber: dayAccommodations.length + 2,
      breakfast: false,
      breakfastDescription: null,
      lunch: false,
      lunchDescription: null,
      dinner: false,
      dinnerDescription: null,
      morningTea: false,
      morningTeaDescription: null,
      eveningTea: false,
      eveningTeaDescription: null,
      snacks: false,
      snackNote: null,
      hotelId: 0,
      transportId: 0,
      otherNotes: null,
    });
    setShowAddForm(false);
  };

  const handleEditClick = (day: DayAccommodationResponse) => {
    const update = getDayUpdate(day.packageDayAccommodationId);
    setEditingDay(day);
    setEditDayData({
      packageDayAccommodationId: day.packageDayAccommodationId,
      dayNumber: update?.dayNumber || day.dayNumber,
      breakfast: update?.breakfast ?? day.breakfast,
      breakfastDescription:
        update?.breakfastDescription ?? day.breakfastDescription,
      lunch: update?.lunch ?? day.lunch,
      lunchDescription: update?.lunchDescription ?? day.lunchDescription,
      dinner: update?.dinner ?? day.dinner,
      dinnerDescription: update?.dinnerDescription ?? day.dinnerDescription,
      morningTea: update?.morningTea ?? day.morningTea,
      morningTeaDescription:
        update?.morningTeaDescription ?? day.morningTeaDescription,
      eveningTea: update?.eveningTea ?? day.eveningTea,
      eveningTeaDescription:
        update?.eveningTeaDescription ?? day.eveningTeaDescription,
      snacks: update?.snacks ?? day.snacks,
      snackNote: update?.snackNote ?? day.snackNote,
      hotelId: update?.hotelId || day.hotelId,
      transportId: update?.transportId || day.transportId,
      otherNotes: update?.otherNotes ?? day.otherNotes,
      status: update?.status || "ACTIVE",
    });
  };

  const handleUpdateDay = () => {
    if (!editingDay) return;
    onUpdateDayAccommodation(editDayData);
    setEditingDay(null);
  };

  const sortedDays = [...dayAccommodations].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const focusHandlers = {
    onFocus: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
        style={{ borderBottom: `1px solid ${theme.border}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              backgroundColor: `${theme.primary}18`,
              color: theme.primary,
            }}
          >
            <Hotel className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.text }}
            >
              Day-by-Day Accommodations
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              Hotels, meals, and transportation per day
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
              backgroundColor: `${theme.primary}15`,
              color: theme.primary,
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

      {/* Body */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-5">
          {/* Add Day Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${theme.primary}08`,
                  border: `2px solid ${theme.primary}`,
                }}
              >
                <h4
                  className="text-sm font-semibold mb-4"
                  style={{ color: theme.text }}
                >
                  Add New Day
                </h4>

                <div className="space-y-3">
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
                      value={newDayData.dayNumber}
                      onChange={(e) =>
                        setNewDayData({
                          ...newDayData,
                          dayNumber: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Hotel ID <span style={{ color: theme.error }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={newDayData.hotelId}
                      onChange={(e) =>
                        setNewDayData({
                          ...newDayData,
                          hotelId: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Enter hotel ID"
                      {...focusHandlers}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Transport ID <span style={{ color: theme.error }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={newDayData.transportId}
                      onChange={(e) =>
                        setNewDayData({
                          ...newDayData,
                          transportId: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Enter transport ID"
                      {...focusHandlers}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MealToggle
                      label="Breakfast"
                      icon={<Coffee className="w-3.5 h-3.5" />}
                      enabled={newDayData.breakfast}
                      description={newDayData.breakfastDescription}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, breakfast: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({
                          ...newDayData,
                          breakfastDescription: desc,
                        })
                      }
                      theme={theme}
                    />
                    <MealToggle
                      label="Morning Tea"
                      icon={<Sun className="w-3.5 h-3.5" />}
                      enabled={newDayData.morningTea}
                      description={newDayData.morningTeaDescription}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, morningTea: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({
                          ...newDayData,
                          morningTeaDescription: desc,
                        })
                      }
                      theme={theme}
                    />
                    <MealToggle
                      label="Lunch"
                      icon={<Utensils className="w-3.5 h-3.5" />}
                      enabled={newDayData.lunch}
                      description={newDayData.lunchDescription}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, lunch: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({ ...newDayData, lunchDescription: desc })
                      }
                      theme={theme}
                    />
                    <MealToggle
                      label="Evening Tea"
                      icon={<Sun className="w-3.5 h-3.5" />}
                      enabled={newDayData.eveningTea}
                      description={newDayData.eveningTeaDescription}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, eveningTea: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({
                          ...newDayData,
                          eveningTeaDescription: desc,
                        })
                      }
                      theme={theme}
                    />
                    <MealToggle
                      label="Dinner"
                      icon={<Moon className="w-3.5 h-3.5" />}
                      enabled={newDayData.dinner}
                      description={newDayData.dinnerDescription}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, dinner: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({
                          ...newDayData,
                          dinnerDescription: desc,
                        })
                      }
                      theme={theme}
                    />
                    <MealToggle
                      label="Snacks"
                      icon={<Cake className="w-3.5 h-3.5" />}
                      enabled={newDayData.snacks}
                      description={newDayData.snackNote}
                      onToggle={(enabled) =>
                        setNewDayData({ ...newDayData, snacks: enabled })
                      }
                      onDescriptionChange={(desc) =>
                        setNewDayData({ ...newDayData, snackNote: desc })
                      }
                      theme={theme}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Other Notes
                    </label>
                    <textarea
                      value={newDayData.otherNotes || ""}
                      onChange={(e) =>
                        setNewDayData({
                          ...newDayData,
                          otherNotes: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm resize-none"
                      style={{ ...fieldBase, borderColor: theme.border }}
                      placeholder="Any additional notes for this day..."
                      {...focusHandlers}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewDayData({
                          dayNumber: dayAccommodations.length + 1,
                          breakfast: false,
                          breakfastDescription: null,
                          lunch: false,
                          lunchDescription: null,
                          dinner: false,
                          dinnerDescription: null,
                          morningTea: false,
                          morningTeaDescription: null,
                          eveningTea: false,
                          eveningTeaDescription: null,
                          snacks: false,
                          snackNote: null,
                          hotelId: 0,
                          transportId: 0,
                          otherNotes: null,
                        });
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
                      onClick={handleAddDay}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Add Day
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Day Modal */}
          <AnimatePresence>
            {editingDay && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4"
                onClick={() => setEditingDay(null)}
              >
                <div
                  className="rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                  style={{ backgroundColor: theme.surface }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: theme.text }}
                  >
                    Edit Day {editDayData.dayNumber}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Day Number
                        </label>
                        <input
                          type="number"
                          value={editDayData.dayNumber}
                          onChange={(e) =>
                            setEditDayData({
                              ...editDayData,
                              dayNumber: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Status
                        </label>
                        <select
                          value={editDayData.status}
                          onChange={(e) =>
                            setEditDayData({
                              ...editDayData,
                              status: e.target.value as "ACTIVE" | "INACTIVE",
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Hotel ID
                      </label>
                      <input
                        type="number"
                        value={editDayData.hotelId}
                        onChange={(e) =>
                          setEditDayData({
                            ...editDayData,
                            hotelId: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Transport ID
                      </label>
                      <input
                        type="number"
                        value={editDayData.transportId}
                        onChange={(e) =>
                          setEditDayData({
                            ...editDayData,
                            transportId: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <MealToggle
                        label="Breakfast"
                        icon={<Coffee className="w-3.5 h-3.5" />}
                        enabled={editDayData.breakfast}
                        description={editDayData.breakfastDescription}
                        onToggle={(enabled) =>
                          setEditDayData({ ...editDayData, breakfast: enabled })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({
                            ...editDayData,
                            breakfastDescription: desc,
                          })
                        }
                        theme={theme}
                      />
                      <MealToggle
                        label="Morning Tea"
                        icon={<Sun className="w-3.5 h-3.5" />}
                        enabled={editDayData.morningTea}
                        description={editDayData.morningTeaDescription}
                        onToggle={(enabled) =>
                          setEditDayData({
                            ...editDayData,
                            morningTea: enabled,
                          })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({
                            ...editDayData,
                            morningTeaDescription: desc,
                          })
                        }
                        theme={theme}
                      />
                      <MealToggle
                        label="Lunch"
                        icon={<Utensils className="w-3.5 h-3.5" />}
                        enabled={editDayData.lunch}
                        description={editDayData.lunchDescription}
                        onToggle={(enabled) =>
                          setEditDayData({ ...editDayData, lunch: enabled })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({
                            ...editDayData,
                            lunchDescription: desc,
                          })
                        }
                        theme={theme}
                      />
                      <MealToggle
                        label="Evening Tea"
                        icon={<Sun className="w-3.5 h-3.5" />}
                        enabled={editDayData.eveningTea}
                        description={editDayData.eveningTeaDescription}
                        onToggle={(enabled) =>
                          setEditDayData({
                            ...editDayData,
                            eveningTea: enabled,
                          })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({
                            ...editDayData,
                            eveningTeaDescription: desc,
                          })
                        }
                        theme={theme}
                      />
                      <MealToggle
                        label="Dinner"
                        icon={<Moon className="w-3.5 h-3.5" />}
                        enabled={editDayData.dinner}
                        description={editDayData.dinnerDescription}
                        onToggle={(enabled) =>
                          setEditDayData({ ...editDayData, dinner: enabled })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({
                            ...editDayData,
                            dinnerDescription: desc,
                          })
                        }
                        theme={theme}
                      />
                      <MealToggle
                        label="Snacks"
                        icon={<Cake className="w-3.5 h-3.5" />}
                        enabled={editDayData.snacks}
                        description={editDayData.snackNote}
                        onToggle={(enabled) =>
                          setEditDayData({ ...editDayData, snacks: enabled })
                        }
                        onDescriptionChange={(desc) =>
                          setEditDayData({ ...editDayData, snackNote: desc })
                        }
                        theme={theme}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Other Notes
                      </label>
                      <textarea
                        value={editDayData.otherNotes || ""}
                        onChange={(e) =>
                          setEditDayData({
                            ...editDayData,
                            otherNotes: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setEditingDay(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{
                          backgroundColor: theme.background,
                          border: `1px solid ${theme.border}`,
                          color: theme.textSecondary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateDay}
                        className="flex-1 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Days List */}
          <div className="space-y-4">
            {sortedDays.map((day) => {
              if (isDayRemoved(day.packageDayAccommodationId)) return null;
              const update = getDayUpdate(day.packageDayAccommodationId);
              const isUpdated = !!update;
              const isActive = update ? update.status === "ACTIVE" : true;
              const isDayExpanded = expandedDays.has(day.dayNumber);

              return (
                <motion.div
                  key={day.packageDayAccommodationId}
                  variants={dayVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${isDayExpanded ? theme.primary : theme.border}`,
                    backgroundColor: theme.background,
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleDay(day.dayNumber)}
                    style={{
                      backgroundColor: isDayExpanded
                        ? `${theme.primary}05`
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {update?.dayNumber || day.dayNumber}
                      </div>
                      <div>
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: theme.text }}
                        >
                          Day {update?.dayNumber || day.dayNumber}
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          Hotel: {day.hotelName} | Transport:{" "}
                          {day.vehicleTypeName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUpdated && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${theme.primary}20`,
                            color: theme.primary,
                          }}
                        >
                          Modified
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(day);
                        }}
                        className="p-1 rounded hover:bg-black/10"
                      >
                        <Edit2
                          className="w-3.5 h-3.5"
                          style={{ color: theme.primary }}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDayAccommodation(
                            day.packageDayAccommodationId,
                          );
                        }}
                        className="p-1 rounded hover:bg-black/10"
                      >
                        <Trash2
                          className="w-3.5 h-3.5"
                          style={{ color: theme.error }}
                        />
                      </button>
                      <ChevronRight
                        className="w-4 h-4 transition-transform"
                        style={{
                          transform: isDayExpanded ? "rotate(90deg)" : "none",
                          color: theme.textSecondary,
                        }}
                      />
                    </div>
                  </div>

                  {/* Day Content */}
                  {isDayExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${theme.border}10` }}
                        >
                          <h4
                            className="text-xs font-semibold mb-2 flex items-center gap-1"
                            style={{ color: theme.textSecondary }}
                          >
                            <Hotel className="w-3.5 h-3.5" /> Hotel Details
                          </h4>
                          <p className="text-sm">
                            <strong>Name:</strong> {day.hotelName}
                          </p>
                          <p className="text-sm">
                            <strong>Description:</strong> {day.hotelDescription}
                          </p>
                          <p className="text-sm">
                            <strong>Location:</strong> {day.hotelLocation}
                          </p>
                          {day.hotelWebsite && (
                            <p className="text-sm">
                              <strong>Website:</strong>{" "}
                              <a
                                href={day.hotelWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {day.hotelWebsite}
                              </a>
                            </p>
                          )}
                        </div>
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${theme.border}10` }}
                        >
                          <h4
                            className="text-xs font-semibold mb-2 flex items-center gap-1"
                            style={{ color: theme.textSecondary }}
                          >
                            <Bus className="w-3.5 h-3.5" /> Transport Details
                          </h4>
                          <p className="text-sm">
                            <strong>Vehicle:</strong> {day.vehicleTypeName}
                          </p>
                          <p className="text-sm">
                            <strong>Model:</strong> {day.vehicleModel}
                          </p>
                          <p className="text-sm">
                            <strong>Registration:</strong>{" "}
                            {day.vehicleRegistrationNumber}
                          </p>
                          <p className="text-sm">
                            <strong>Seats:</strong> {day.seatCapacity} |{" "}
                            <strong>AC:</strong>{" "}
                            {day.airCondition ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(update?.breakfast ?? day.breakfast) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Coffee
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Breakfast</p>
                            {(update?.breakfastDescription ??
                              day.breakfastDescription) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.breakfastDescription ??
                                  day.breakfastDescription}
                              </p>
                            )}
                          </div>
                        )}
                        {(update?.morningTea ?? day.morningTea) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Sun
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Morning Tea</p>
                            {(update?.morningTeaDescription ??
                              day.morningTeaDescription) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.morningTeaDescription ??
                                  day.morningTeaDescription}
                              </p>
                            )}
                          </div>
                        )}
                        {(update?.lunch ?? day.lunch) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Utensils
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Lunch</p>
                            {(update?.lunchDescription ??
                              day.lunchDescription) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.lunchDescription ??
                                  day.lunchDescription}
                              </p>
                            )}
                          </div>
                        )}
                        {(update?.eveningTea ?? day.eveningTea) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Sun
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Evening Tea</p>
                            {(update?.eveningTeaDescription ??
                              day.eveningTeaDescription) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.eveningTeaDescription ??
                                  day.eveningTeaDescription}
                              </p>
                            )}
                          </div>
                        )}
                        {(update?.dinner ?? day.dinner) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Moon
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Dinner</p>
                            {(update?.dinnerDescription ??
                              day.dinnerDescription) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.dinnerDescription ??
                                  day.dinnerDescription}
                              </p>
                            )}
                          </div>
                        )}
                        {(update?.snacks ?? day.snacks) && (
                          <div
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: `${theme.success}10` }}
                          >
                            <Cake
                              className="w-4 h-4 mx-auto mb-1"
                              style={{ color: theme.success }}
                            />
                            <p className="text-xs font-medium">Snacks</p>
                            {(update?.snackNote ?? day.snackNote) && (
                              <p className="text-xs mt-1 opacity-75">
                                {update?.snackNote ?? day.snackNote}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {(update?.otherNotes ?? day.otherNotes) && (
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${theme.warning}10` }}
                        >
                          <p className="text-xs italic">
                            📝 {update?.otherNotes ?? day.otherNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* New Days Preview */}
          {addedDayAccommodations.length > 0 && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: theme.border }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: theme.success }}
              >
                New days to add:
              </p>
              <div className="space-y-2">
                {addedDayAccommodations.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${theme.success}10`,
                      border: `1px dashed ${theme.success}`,
                    }}
                  >
                    <Hotel
                      className="w-3.5 h-3.5"
                      style={{ color: theme.success }}
                    />
                    <span className="text-sm" style={{ color: theme.text }}>
                      Day {day.dayNumber}: Hotel ID {day.hotelId}, Transport ID{" "}
                      {day.transportId}
                    </span>
                    <span
                      className="ml-auto text-xs text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: theme.success }}
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedDays.length === 0 && addedDayAccommodations.length === 0 && (
            <div className="text-center py-8">
              <Hotel
                className="w-12 h-12 mx-auto mb-3 opacity-30"
                style={{ color: theme.textSecondary }}
              />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                No day accommodations added yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Click "Add Day" to start building your package itinerary
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
