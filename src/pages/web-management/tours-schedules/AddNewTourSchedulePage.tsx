// app/add-new-tour-schedule/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
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
import { Tour } from "@/types/tour-types";
import { CreateTourScheduleRequest } from "@/types/tour-schedule-types";
import { TourScheduleService } from "@/services/tourScheduleService";
import { TourSelector } from "@/components/tour-schedules-components/tour-schedule-create-components/TourSelector";

// Toast state interface
interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
}

const AddNewTourSchedulePage = () => {
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
      label: "Tour Schedules",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tour-schedules`,
    },
    {
      label: "Add New Schedule",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/tour-schedules/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<CreateTourScheduleRequest>({
    tourScheduleName: "",
    tourId: 0,
    assumeStartDate: "",
    assumeEndDate: "",
    durationHoursStart: 0,
    durationHoursEnd: 0,
    specialNotes: "",
    description: "",
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTourDetails, setSelectedTourDetails] = useState<Tour | null>(null);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleTourSelect = (tourId: number, tourDetails?: Tour) => {
    setFormData(prev => ({
      ...prev,
      tourId,
      tourScheduleName: tourDetails?.tourName ? `${tourDetails.tourName} Schedule` : prev.tourScheduleName,
    }));
    if (tourDetails) {
      setSelectedTourDetails(tourDetails);
      // Auto-fill duration based on tour duration
      if (tourDetails.duration) {
        setFormData(prev => ({
          ...prev,
          durationHoursStart: 1,
          durationHoursEnd: tourDetails.duration * 24, // Convert days to hours
        }));
      }
    }
    if (errors.tourId) {
      setErrors({ ...errors, tourId: "" });
    }
  };

  const handleTourClear = () => {
    setFormData(prev => ({
      ...prev,
      tourId: 0,
      tourScheduleName: "",
      durationHoursStart: 0,
      durationHoursEnd: 0,
    }));
    setSelectedTourDetails(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (name === "durationHoursStart" || name === "durationHoursEnd") {
      processedValue = value === "" ? 0 : parseFloat(value);
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

    if (!formData.tourScheduleName.trim()) {
      newErrors.tourScheduleName = "Schedule name is required";
    }

    if (!formData.tourId) {
      newErrors.tourId = "Please select a tour";
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

  // Submit tour schedule
  const submitTourSchedule = async () => {
    setLoading(true);
    try {
      const response = await TourScheduleService.createTourSchedule(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Tour Schedule Created Successfully!",
          message: `${formData.tourScheduleName} has been added.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add tour schedule");
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
    await submitTourSchedule();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      tourScheduleName: "",
      tourId: 0,
      assumeStartDate: "",
      assumeEndDate: "",
      durationHoursStart: 0,
      durationHoursEnd: 0,
      specialNotes: "",
      description: "",
      status: "ACTIVE",
    });
    setSelectedTourDetails(null);
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
            title="Add New Tour Schedule"
            description="Create a new schedule for your tour"
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
              {/* Tour Selector */}
              <TourSelector
                selectedTourId={formData.tourId}
                onTourSelect={handleTourSelect}
                onTourClear={handleTourClear}
                error={errors.tourId}
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
                    name="tourScheduleName"
                    value={formData.tourScheduleName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Summer Special, Winter Adventure, Weekend Getaway"
                    error={errors.tourScheduleName}
                    helperText="Unique name for this tour schedule"
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
                      placeholder="24"
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
                    placeholder="Describe this tour schedule..."
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
            {selectedTourDetails && (
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
                    Tour Summary
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Tour Name</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.tourName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Duration</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.duration} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Route</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.startLocation} → {selectedTourDetails.endLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Type</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.tourTypeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Category</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.tourCategoryName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>Season</p>
                    <p className="text-sm font-medium" style={{ color: theme.text }}>
                      {selectedTourDetails.seasonName}
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
          title: "Create New Tour Schedule",
          message: "Are you sure you want to create this tour schedule?",
          itemName: formData.tourScheduleName || "Untitled Schedule",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: [
            "Verify that the date range is correct",
            "Ensure duration values are accurate",
            "Check that all required fields are filled",
            "You can edit this schedule anytime after creation",
            "The schedule will be available for booking based on dates",
            "Make sure the tour is active for this schedule",
          ],
        }}
        confirmText="Create Schedule"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Tour schedule created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create tour schedule:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message: error.message || "Failed to create tour schedule. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewTourSchedulePage;