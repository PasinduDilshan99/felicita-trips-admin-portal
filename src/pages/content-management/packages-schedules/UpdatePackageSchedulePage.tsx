// app/package-schedules/update/page.tsx (updated)

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { PackageScheduleService } from "@/services/packageScheduleService";
import {
  PackageScheduleIdAndName,
  PackageScheduleDetails,
  UpdatePackageScheduleRequest,
} from "@/types/package-schedule-types";
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
import { useCurrency } from "@/contexts/CurrencyContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { hexToRgba } from "@/utils/functions";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PACKAGES_VIEW_PAGE_URL } from "@/utils/urls";
import { PackageScheduleReadOnlyDetails } from "@/components/package-schedules-components/update-package-schedule-components/PackageScheduleReadOnlyDetails";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Schedule is active",
    color: "#059669",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Schedule is inactive",
    color: "#6b7280",
  },
];

const UpdatePackageSchedulePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  const initialScheduleName = searchParams?.get("package-schedule-name") || "";
  const initialScheduleId = searchParams?.get("package-schedule-id") || "";

  // State for schedules list
  const [schedules, setSchedules] = useState<PackageScheduleIdAndName[]>([]);

  // State for selected schedule
  const [selectedSchedule, setSelectedSchedule] =
    useState<PackageScheduleIdAndName | null>(
      initialScheduleId && initialScheduleName
        ? {
            packageScheduleId: parseInt(initialScheduleId),
            packageScheduleName: initialScheduleName,
          }
        : null,
    );

  // State for original schedule details
  const [originalSchedule, setOriginalSchedule] =
    useState<PackageScheduleDetails | null>(null);

  // State for edited schedule
  const [editedSchedule, setEditedSchedule] =
    useState<PackageScheduleDetails | null>(null);

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

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Package Schedules", href: PACKAGES_VIEW_PAGE_URL },
    {
      label: "Update",
      href: PACKAGES_VIEW_PAGE_URL,
    },
  ];

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
    (schedule: PackageScheduleIdAndName | null) => {
      const url = new URL(window.location.href);
      if (schedule) {
        url.searchParams.set(
          "package-schedule-id",
          schedule.packageScheduleId.toString(),
        );
        url.searchParams.set(
          "package-schedule-name",
          schedule.packageScheduleName,
        );
      } else {
        url.searchParams.delete("package-schedule-id");
        url.searchParams.delete("package-schedule-name");
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
      const response =
        await PackageScheduleService.getPackageScheduleIdAndNames();
      setSchedules(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load package schedules");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load package schedules",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchedule = async (id: number, name: string) => {
    const newSelectedSchedule = {
      packageScheduleId: id,
      packageScheduleName: name,
    };
    setSelectedSchedule(newSelectedSchedule);
    // Update URL with the selected schedule
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
      const response =
        await PackageScheduleService.getPackageScheduleDetails(id);
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
  const prepareUpdateData = (): UpdatePackageScheduleRequest | null => {
    if (!editedSchedule || !selectedSchedule) return null;

    return {
      packageScheduleId: selectedSchedule.packageScheduleId,
      packageScheduleName: editedSchedule.packageScheduleName,
      packageId: editedSchedule.packageId,
      assumeStartDate: editedSchedule.assumeStartDate,
      assumeEndDate: editedSchedule.assumeEndDate,
      durationStart: editedSchedule.durationStart,
      durationEnd: editedSchedule.durationEnd,
      specialNote: editedSchedule.specialNote,
      description: editedSchedule.description,
      status: editedSchedule.scheduleStatus as "ACTIVE" | "INACTIVE",
      tourScheduleId: editedSchedule.tourScheduleId,
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
      const response =
        await PackageScheduleService.updatePackageSchedule(updateData);

      setSuccess(
        `Schedule "${editedSchedule?.packageScheduleName}" updated successfully!`,
      );

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedSchedule?.packageScheduleName} has been updated successfully.`,
        actionLink: `${PACKAGES_VIEW_PAGE_URL}/view?id=${selectedSchedule?.packageScheduleId}`,
      });

      setShowConfirmModal(false);

      // After successful update, refresh the details
      setTimeout(() => {
        if (selectedSchedule) {
          fetchScheduleDetails(selectedSchedule.packageScheduleId);
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
    // Clear URL parameters when clearing selection
    updateUrlWithSelectedSchedule(null);
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalSchedule || !editedSchedule) return [];

    const changes: ChangedField[] = [];

    const basicFields = [
      { key: "packageScheduleName", label: "Schedule Name" },
      { key: "description", label: "Description" },
      { key: "durationStart", label: "Duration Start (days)" },
      { key: "durationEnd", label: "Duration End (days)" },
      { key: "scheduleStatus", label: "Status" },
    ];

    basicFields.forEach(({ key, label }) => {
      const oldValue = originalSchedule[key as keyof PackageScheduleDetails];
      const newValue = editedSchedule[key as keyof PackageScheduleDetails];
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
    id: schedule.packageScheduleId,
    name: schedule.packageScheduleName,
  }));

  const selectedSearchItem = selectedSchedule
    ? {
        id: selectedSchedule.packageScheduleId,
        name: selectedSchedule.packageScheduleName,
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
        message="Loading schedules..."
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
            title="Update Package Schedule"
            description="Edit and update existing package schedule information"
            breadcrumbItems={breadcrumbItems}
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
              Select Package Schedule to Update
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
              placeholder="Search package schedules..."
              title="Package Schedules"
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
              id: selectedSchedule.packageScheduleId,
              name: selectedSchedule.packageScheduleName,
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
                        value={editedSchedule.packageScheduleName}
                        onChange={(e) =>
                          handleBasicFieldChange(
                            "packageScheduleName",
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

                    {/* Duration Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1.5 flex items-center gap-1.5"
                          style={{ color: theme.textSecondary }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Duration Start (days)
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
                          Duration End (days)
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
                        {STATUS_OPTIONS.map((opt) => {
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

            {/* Read-only Package Details Component */}
            <PackageScheduleReadOnlyDetails
              schedule={editedSchedule}
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
            itemName={editedSchedule.packageScheduleName}
            changedFields={getChangedFields()}
            confirmText="Update Schedule"
            cancelText="Cancel"
            title="Confirm Schedule Update"
            message={`You are about to update "${editedSchedule.packageScheduleName}". Please review the changes below before confirming.`}
            showFieldComparisons={true}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UpdatePackageSchedulePage;
