// app/add-new-activity-schedule/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import {
  ToastNotification,
  ToastType,
} from "@/components/common-components/ToastNotification";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, Clock } from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { Activity as ActivityType } from "@/types/activity-types";
import { CreateActivityScheduleRequest } from "@/types/activity-schedule-types";
import { ActivityScheduleService } from "@/services/activityScheduleService";
import { ActivitySelector } from "@/components/activity-schedules-components/activity-schedule-create-components/ActivitySelector";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const AddNewActivitySchedulePage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Activity Schedules",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activity-schedules`,
    },
    {
      label: "Add New Schedule",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/activity-schedules/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<CreateActivityScheduleRequest>({
    activityScheduleName: "",
    activityId: 0,
    assumeStartDate: "",
    assumeEndDate: "",
    durationHoursStart: 0,
    durationHoursEnd: 0,
    specialNotes: "",
    description: "",
    packageScheduleId: 0,
    tourScheduleId: 0,
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });
  const [selectedActivityDetails, setSelectedActivityDetails] = useState<ActivityType | null>(null);

  const handleActivitySelect = (activityId: number, activityDetails?: ActivityType) => {
    setFormData(prev => ({
      ...prev,
      activityId,
      activityScheduleName: activityDetails?.name ? `${activityDetails.name} Schedule` : prev.activityScheduleName,
    }));
    if (activityDetails) {
      setSelectedActivityDetails(activityDetails);
      // Auto-fill duration based on activity duration
      if (activityDetails.duration_hours) {
        setFormData(prev => ({
          ...prev,
          durationHoursStart: 1,
          durationHoursEnd: activityDetails.duration_hours,
        }));
      }
    }
    if (errors.activityId) {
      setErrors({ ...errors, activityId: "" });
    }
  };

  const handleActivityClear = () => {
    setFormData(prev => ({
      ...prev,
      activityId: 0,
      activityScheduleName: "",
      durationHoursStart: 0,
      durationHoursEnd: 0,
    }));
    setSelectedActivityDetails(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "durationHoursStart" || name === "durationHoursEnd" || 
        name === "packageScheduleId" || name === "tourScheduleId") {
      processedValue = value === "" ? 0 : parseInt(value);
    }

    setFormData({ ...formData, [name]: processedValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleStatusChange = (value: "ACTIVE" | "INACTIVE") => {
    setFormData({ ...formData, status: value });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityScheduleName.trim()) {
      newErrors.activityScheduleName = "Schedule name is required";
    }

    if (!formData.activityId) {
      newErrors.activityId = "Please select an activity";
    }

    if (!formData.assumeStartDate) {
      newErrors.assumeStartDate = "Start date is required";
    }

    if (!formData.assumeEndDate) {
      newErrors.assumeEndDate = "End date is required";
    }

    if (formData.assumeStartDate && formData.assumeEndDate && 
        new Date(formData.assumeStartDate) > new Date(formData.assumeEndDate)) {
      newErrors.assumeEndDate = "End date must be after start date";
    }

    if (!formData.durationHoursStart || formData.durationHoursStart < 0.5) {
      newErrors.durationHoursStart = "Valid start duration is required";
    }

    if (!formData.durationHoursEnd || formData.durationHoursEnd < formData.durationHoursStart) {
      newErrors.durationHoursEnd = "End duration must be greater than start duration";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit activity schedule
  const submitActivitySchedule = async () => {
    setLoading(true);
    try {
      const response = await ActivityScheduleService.createActivitySchedule(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Activity Schedule Created Successfully!",
          message: `${formData.activityScheduleName} has been added.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add activity schedule");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle create button click - opens dialog
  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    } else {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle confirm create from dialog
  const handleConfirmCreate = async () => {
    await submitActivitySchedule();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      activityScheduleName: "",
      activityId: 0,
      assumeStartDate: "",
      assumeEndDate: "",
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      packageScheduleId: 0,
      tourScheduleId: 0,
      status: "ACTIVE",
    });
    setSelectedActivityDetails(null);
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Activity Schedule"
            description="Create a new schedule for your activity"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form className="space-y-8">
              {/* Activity Selector */}
              <ActivitySelector
                selectedActivityId={formData.activityId}
                onActivitySelect={handleActivitySelect}
                onActivityClear={handleActivityClear}
                error={errors.activityId}
                required
                showDetails={true}
                fetchDetails={true}
              />

              {/* Schedule Information Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
                    <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                      Schedule Information
                    </h2>
                  </div>

                  <InputField
                    label="Schedule Name"
                    name="activityScheduleName"
                    value={formData.activityScheduleName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Morning Session, Evening Adventure, Weekend Special"
                    error={errors.activityScheduleName}
                    helperText="Unique name for this activity schedule"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Start Date"
                      name="assumeStartDate"
                      value={formData.assumeStartDate}
                      onChange={handleInputChange}
                      type="date"
                      required
                      error={errors.assumeStartDate}
                    />
                    <InputField
                      label="End Date"
                      name="assumeEndDate"
                      value={formData.assumeEndDate}
                      onChange={handleInputChange}
                      type="date"
                      required
                      error={errors.assumeEndDate}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Duration Start (Hours)"
                      name="durationHoursStart"
                      value={formData.durationHoursStart}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min={0.5}
                      step={0.5}
                      placeholder="1"
                      error={errors.durationHoursStart}
                      helperText="Starting hour of the schedule"
                    />
                    <InputField
                      label="Duration End (Hours)"
                      name="durationHoursEnd"
                      value={formData.durationHoursEnd}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min={0.5}
                      step={0.5}
                      placeholder="4"
                      error={errors.durationHoursEnd}
                      helperText="Ending hour of the schedule"
                    />
                  </div>

                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    type="textarea"
                    required
                    rows={4}
                    placeholder="Describe this activity schedule..."
                    error={errors.description}
                    helperText="Brief description of the schedule"
                  />

                  <InputField
                    label="Special Notes (Optional)"
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleInputChange}
                    type="textarea"
                    rows={3}
                    placeholder="Any special notes or instructions for this schedule..."
                    error={errors.specialNotes}
                    helperText="Additional information for this schedule"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Package Schedule ID (Optional)"
                      name="packageScheduleId"
                      value={formData.packageScheduleId}
                      onChange={handleInputChange}
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      error={errors.packageScheduleId}
                      helperText="Associated package schedule ID"
                    />
                    <InputField
                      label="Tour Schedule ID (Optional)"
                      name="tourScheduleId"
                      value={formData.tourScheduleId}
                      onChange={handleInputChange}
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      error={errors.tourScheduleId}
                      helperText="Associated tour schedule ID"
                    />
                  </div>

                  <StatusSelector
                    value={formData.status}
                    onChange={handleStatusChange}
                    required
                  />
                </div>
              </FormCard>

              {/* Form Actions */}
              <FormActions
                loading={loading}
                uploadingImages={false}
                onSubmit={handleCreateClick}
                onReset={handleReset}
                errors={errors}
                submitText="Schedule"
                submitButtonType="button"
              />
            </form>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Summary Card */}
            {selectedActivityDetails && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{ borderColor: theme.border }}
                >
                  <h3 className="font-semibold" style={{ color: theme.text }}>
                    Activity Summary
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-2">
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Activity Name</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedActivityDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Destination</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedActivityDetails.destinationName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Duration</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedActivityDetails.duration_hours} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Price Range</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      ${selectedActivityDetails.price_local} (Local) / ${selectedActivityDetails.price_foreigners} (Foreign)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Activity Schedule",
          message: "Are you sure you want to create this activity schedule?",
          itemName: formData.activityScheduleName || "Untitled Schedule",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Verify that the date range is correct",
            "Ensure duration values are accurate",
            "Check that all required fields are filled",
            "You can edit this schedule anytime after creation",
            "The schedule will be available for booking based on dates",
            "Make sure the activity is active for this schedule",
          ],
        }}
        confirmText="Create Schedule"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Activity schedule created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create activity schedule:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message: error.message || "Failed to create activity schedule. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewActivitySchedulePage;