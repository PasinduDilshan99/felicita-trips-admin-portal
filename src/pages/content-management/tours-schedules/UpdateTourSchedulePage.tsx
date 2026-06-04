"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TourScheduleService } from "@/services/tourScheduleService";
import {
  TourScheduleIdAndName,
  TourScheduleDetails,
  UpdateTourScheduleRequest,
} from "@/types/tour-schedule-types";
import {
  Search,
  Edit,
  Save,
  RefreshCw,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { motion, AnimatePresence } from "framer-motion";
import { TOUR_SCHEDULE_DETAILS_VIEW_URL } from "@/utils/urls";
import { TourInformation } from "@/components/tour-schedules-components/update-tour-schedule-components/TourInformation";
import { TourCategories } from "@/components/tour-schedules-components/update-tour-schedule-components/TourCategories";
import { TourTypes } from "@/components/tour-schedules-components/update-tour-schedule-components/TourTypes";
import { TourImages } from "@/components/tour-schedules-components/update-tour-schedule-components/TourImages";
import { DayByDayAccommodations } from "@/components/tour-schedules-components/update-tour-schedule-components/DayByDayAccommodations";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { TOUR_SCHEDULE_UPDATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { cardVariants, sectionVariants } from "@/app/animations/variants";
import { TOUR_SCHEDULE_UPDATE_STATUS_OPTIONS } from "@/data/status-options-data";

const UpdateTourSchedulePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const initialScheduleName = searchParams?.get("tour-schedule-name") || "";
  const initialScheduleId = searchParams?.get("tour-schedule-id") || "";

  // State for schedules list
  const [schedules, setSchedules] = useState<TourScheduleIdAndName[]>([]);

  // State for selected schedule
  const [selectedSchedule, setSelectedSchedule] =
    useState<TourScheduleIdAndName | null>(
      initialScheduleId && initialScheduleName
        ? {
            tourScheduleId: parseInt(initialScheduleId),
            tourScheduleName: initialScheduleName,
          }
        : null,
    );

  // State for original schedule details
  const [originalSchedule, setOriginalSchedule] =
    useState<TourScheduleDetails | null>(null);

  // State for edited schedule
  const [editedSchedule, setEditedSchedule] =
    useState<TourScheduleDetails | null>(null);

  // State for basic details changes
  const [basicDetailsChanged, setBasicDetailsChanged] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"]),
  );

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  };

  // Update URL when selected schedule changes
  const updateUrlWithSelectedSchedule = useCallback(
    (schedule: TourScheduleIdAndName | null) => {
      const url = new URL(window.location.href);
      if (schedule) {
        url.searchParams.set(
          "tour-schedule-id",
          schedule.tourScheduleId.toString(),
        );
        url.searchParams.set("tour-schedule-name", schedule.tourScheduleName);
      } else {
        url.searchParams.delete("tour-schedule-id");
        url.searchParams.delete("tour-schedule-name");
      }
      router.replace(url.toString(), { scroll: false });
    },
    [router],
  );

  // Fetch schedules list on initial load
  useEffect(() => {
    if (!selectedSchedule) {
      fetchSchedules();
    }
  }, []);

  // If initialScheduleId is provided, fetch details
  useEffect(() => {
    if (initialScheduleId && !originalSchedule) {
      handleSelectSchedule(parseInt(initialScheduleId), initialScheduleName);
    }
  }, [initialScheduleId, initialScheduleName]);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TourScheduleService.getTourScheduleIdAndNames();
      setSchedules(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour schedules");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load tour schedules",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchedule = async (id: number, name: string) => {
    const newSelectedSchedule = { tourScheduleId: id, tourScheduleName: name };
    setSelectedSchedule(newSelectedSchedule);
    updateUrlWithSelectedSchedule(newSelectedSchedule);
    await fetchScheduleDetails(id);
  };

  const fetchScheduleDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalSchedule(null);
    setEditedSchedule(null);
    setBasicDetailsChanged(false);

    try {
      const response = await TourScheduleService.getTourScheduleDetails(id);
      const scheduleData = response.data;
      setOriginalSchedule(scheduleData);
      setEditedSchedule(scheduleData);
    } catch (err: any) {
      setError(err.message || "Failed to load schedule details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load schedule details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle basic field changes
  const handleBasicFieldChange = (field: string, value: any) => {
    if (!editedSchedule) return;
    setBasicDetailsChanged(true);
    setEditedSchedule({
      ...editedSchedule,
      [field]: value,
    });
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return basicDetailsChanged;
  }, [basicDetailsChanged]);

  // Prepare update data
  const prepareUpdateData = (): UpdateTourScheduleRequest | null => {
    if (!editedSchedule || !selectedSchedule) return null;

    return {
      tourScheduleId: selectedSchedule.tourScheduleId,
      tourScheduleName: editedSchedule.tourScheduleName,
      tourId: editedSchedule.tourId,
      assumeStartDate: editedSchedule.assumeStartDate,
      assumeEndDate: editedSchedule.assumeEndDate,
      durationHoursStart: editedSchedule.durationStart,
      durationHoursEnd: editedSchedule.durationEnd,
      specialNotes: editedSchedule.specialNote,
      description: editedSchedule.description,
      status: editedSchedule.scheduleStatus as "ACTIVE" | "INACTIVE",
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await TourScheduleService.updateTourSchedule(updateData);

      setSuccess(
        `Schedule "${editedSchedule?.tourScheduleName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedSchedule?.tourScheduleName} has been updated successfully.`,
        actionLink: `${TOUR_SCHEDULE_DETAILS_VIEW_URL}/${selectedSchedule?.tourScheduleId}?name=${selectedSchedule?.tourScheduleName}`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        if (selectedSchedule) {
          fetchScheduleDetails(selectedSchedule.tourScheduleId);
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update schedule");
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update schedule. Please try again.",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalSchedule) {
      setEditedSchedule(originalSchedule);
      setBasicDetailsChanged(false);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearScheduleSelection = () => {
    setSelectedSchedule(null);
    setOriginalSchedule(null);
    setEditedSchedule(null);
    setToast(null);
    updateUrlWithSelectedSchedule(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalSchedule || !editedSchedule) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "tourScheduleName", label: "Schedule Name" },
      { key: "description", label: "Description" },
      { key: "durationStart", label: "Duration Start (hours)" },
      { key: "durationEnd", label: "Duration End (hours)" },
      { key: "scheduleStatus", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalSchedule[key as keyof TourScheduleDetails];
      const newValue = editedSchedule[key as keyof TourScheduleDetails];
      if (oldValue !== newValue) {
        changes.push({ field: label, oldValue, newValue });
      }
    });

    if (originalSchedule.assumeStartDate !== editedSchedule.assumeStartDate) {
      changes.push({
        field: "Start Date",
        oldValue: originalSchedule.assumeStartDate?.split("T")[0],
        newValue: editedSchedule.assumeStartDate?.split("T")[0],
      });
    }
    if (originalSchedule.assumeEndDate !== editedSchedule.assumeEndDate) {
      changes.push({
        field: "End Date",
        oldValue: originalSchedule.assumeEndDate?.split("T")[0],
        newValue: editedSchedule.assumeEndDate?.split("T")[0],
      });
    }
    if (originalSchedule.specialNote !== editedSchedule.specialNote) {
      changes.push({
        field: "Special Note",
        oldValue: originalSchedule.specialNote || "(empty)",
        newValue: editedSchedule.specialNote || "(empty)",
      });
    }

    return changes;
  };

  // Convert schedules to search items format
  const searchItems: SearchItem[] = schedules.map((schedule) => ({
    id: schedule.tourScheduleId,
    name: schedule.tourScheduleName,
  }));

  const selectedSearchItem = selectedSchedule
    ? {
        id: selectedSchedule.tourScheduleId,
        name: selectedSchedule.tourScheduleName,
      }
    : null;

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

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Show loading state
  if (loading) {
    return (
      <CommonLoading
        message="Loading tour schedules..."
        subMessage="Please wait while we fetch available schedules"
        size="lg"
      />
    );
  }

  return (
    <motion.div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Schedule"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Tour Schedule"
            description="Edit and update existing tour schedule information"
            breadcrumbItems={TOUR_SCHEDULE_UPDATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        {!selectedSchedule && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Search className="w-6 h-6" style={{ color: theme.primary }} />
              Select Tour Schedule to Update
            </h2>

            <CommonSearch
              items={searchItems}
              loading={loading}
              selectedItem={selectedSearchItem}
              onSelectItem={(item) =>
                handleSelectSchedule(item.id as number, item.name)
              }
              onClearSelection={handleClearScheduleSelection}
              initialSearchTerm={initialScheduleName}
              placeholder="Search tour schedules..."
              title="Tour Schedules"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
            />
          </div>
        )}

        {/* Selected Schedule Info Bar */}
        {selectedSchedule && (
          <SelectedItemBar
            item={{
              id: selectedSchedule.tourScheduleId,
              name: selectedSchedule.tourScheduleName,
            }}
            onClear={handleClearScheduleSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Schedule"
            size="md"
          />
        )}

        {/* Loading Details */}
        {loadingDetails && (
          <CommonLoading
            message="Loading schedule details..."
            subMessage="Please wait while we fetch the schedule information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Schedule Details Form */}
        {editedSchedule && selectedSchedule && (
          <div className="space-y-6">
            {/* Basic Information Section */}
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
              <button
                onClick={() => toggleSection("basic")}
                className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: expandedSections.has("basic")
                    ? `${theme.primary}05`
                    : "transparent",
                  borderBottom: expandedSections.has("basic")
                    ? `1px solid ${theme.border}`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-sm sm:text-base font-semibold"
                      style={{ color: theme.text }}
                    >
                      Basic Information
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Core details about the schedule (editable)
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-200"
                  style={{
                    transform: expandedSections.has("basic")
                      ? "rotate(180deg)"
                      : "none",
                    color: theme.textSecondary,
                  }}
                />
              </button>

              <AnimatePresence>
                {expandedSections.has("basic") && (
                  <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-6 space-y-5"
                  >
                    {/* Schedule Name */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Schedule Name{" "}
                        <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={editedSchedule.tourScheduleName}
                        onChange={(e) =>
                          handleBasicFieldChange(
                            "tourScheduleName",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          ...fieldBase,
                          borderColor: basicDetailsChanged
                            ? theme.primary
                            : theme.border,
                        }}
                        placeholder="e.g., Summer Special Schedule"
                        {...focusHandlers}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editedSchedule.description}
                        onChange={(e) =>
                          handleBasicFieldChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Schedule description..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(
                            editedSchedule.assumeStartDate,
                          )}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "assumeStartDate",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(
                            editedSchedule.assumeEndDate,
                          )}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "assumeEndDate",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Duration Range (Hours) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Duration Start (hours)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={editedSchedule.durationStart}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "durationStart",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Duration End (hours)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={editedSchedule.durationEnd}
                          onChange={(e) =>
                            handleBasicFieldChange(
                              "durationEnd",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          {...focusHandlers}
                        />
                      </div>
                    </div>

                    {/* Special Note */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Special Note
                      </label>
                      <textarea
                        value={editedSchedule.specialNote}
                        onChange={(e) =>
                          handleBasicFieldChange("specialNote", e.target.value)
                        }
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Any special notes about this schedule..."
                        {...focusHandlers}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {TOUR_SCHEDULE_UPDATE_STATUS_OPTIONS.map((opt) => {
                          const isSelected =
                            editedSchedule.scheduleStatus === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                handleBasicFieldChange(
                                  "scheduleStatus",
                                  opt.value,
                                )
                              }
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected
                                  ? `${opt.color}10`
                                  : theme.background,
                                borderColor: isSelected
                                  ? opt.color
                                  : theme.border,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: opt.color }}
                              />
                              <div className="flex-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected ? opt.color : theme.text,
                                  }}
                                >
                                  {opt.label}
                                </span>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {opt.description}
                                </p>
                              </div>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4"
                                  style={{ color: opt.color }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Read-only Tour Details Components */}
            <TourInformation schedule={editedSchedule} />
            <TourCategories
              categories={editedSchedule.categories || []}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
            <TourTypes
              types={editedSchedule.types || []}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
            <TourImages
              images={editedSchedule.images || []}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
            <DayByDayAccommodations
              accommodations={editedSchedule.accommodations || []}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
            />
          </div>
        )}

        {/* Action Buttons */}
        {editedSchedule && originalSchedule && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Schedule"}
              </button>
            </div>

            {/* Change Indicator */}
            {hasChanges() && !loadingUpdate && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Click "Update Schedule" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalSchedule && editedSchedule && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            isLoading={loadingUpdate}
            type="update"
            itemName={editedSchedule.tourScheduleName}
            changedFields={getChangedFields()}
            confirmText="Update Schedule"
            cancelText="Cancel"
            title="Confirm Schedule Update"
            message={`You are about to update "${editedSchedule.tourScheduleName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdateTourSchedulePage;
