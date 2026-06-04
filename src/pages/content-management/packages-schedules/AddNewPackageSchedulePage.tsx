"use client";

import React, { useState } from "react";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { useTheme } from "@/contexts/ThemeContext";
import { Calendar } from "lucide-react";
import { FormCard } from "@/components/common-components/create-components/FormCard";
import { FormActions } from "@/components/common-components/FormActions";
import { InputField } from "@/components/common-components/create-components/InputField";
import { StatusSelector } from "@/components/common-components/StatusSelector";
import { PackageSelector } from "@/components/common-components/PackageSelector";
import { CreatePackageScheduleRequest } from "@/types/package-schedule-types";
import { PackageScheduleService } from "@/services/packageScheduleService";
import { CreateConfirmationDialog } from "@/components/common-components/create-components/CreateConfirmationDialog";
import { ToastState } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PACKAGE_SCHEDULE_CREATE_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { CREATE_PACKAGE_SCHEDULE_TIPS } from "@/data/tips-data";

const AddNewPackageSchedulePage = () => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<CreatePackageScheduleRequest>({
    packageScheduleName: "",
    packageId: 0,
    assumeStartDate: "",
    assumeEndDate: "",
    durationStart: 0,
    durationEnd: 0,
    specialNote: "",
    description: "",
    status: "ACTIVE",
    tourScheduleId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handlePackageSelect = (packageId: number, packageDetails?: any) => {
    setFormData((prev) => ({
      ...prev,
      packageId,
      packageScheduleName: packageDetails?.packageName
        ? `${packageDetails.packageName} Schedule`
        : prev.packageScheduleName,
    }));
    if (errors.packageId) {
      setErrors({ ...errors, packageId: "" });
    }
  };

  const handlePackageClear = () => {
    setFormData((prev) => ({
      ...prev,
      packageId: 0,
      packageScheduleName: "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    if (
      name === "durationStart" ||
      name === "durationEnd" ||
      name === "tourScheduleId"
    ) {
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

    if (!formData.packageScheduleName.trim()) {
      newErrors.packageScheduleName = "Schedule name is required";
    }

    if (!formData.packageId) {
      newErrors.packageId = "Please select a package";
    }

    if (!formData.assumeStartDate) {
      newErrors.assumeStartDate = "Start date is required";
    }

    if (!formData.assumeEndDate) {
      newErrors.assumeEndDate = "End date is required";
    }

    if (
      formData.assumeStartDate &&
      formData.assumeEndDate &&
      new Date(formData.assumeStartDate) > new Date(formData.assumeEndDate)
    ) {
      newErrors.assumeEndDate = "End date must be after start date";
    }

    if (!formData.durationStart || formData.durationStart < 1) {
      newErrors.durationStart = "Valid start duration is required";
    }

    if (
      !formData.durationEnd ||
      formData.durationEnd < formData.durationStart
    ) {
      newErrors.durationEnd =
        "End duration must be greater than start duration";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit package schedule
  const submitPackageSchedule = async () => {
    setLoading(true);
    try {
      const response =
        await PackageScheduleService.createPackageSchedule(formData);
      if (response.code === 200) {
        setToast({
          show: true,
          type: "success",
          title: "Package Schedule Created Successfully!",
          message: `${formData.packageScheduleName} has been added.`,
        });
        handleReset();
        return response;
      } else {
        throw new Error(response.message || "Failed to add package schedule");
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
    await submitPackageSchedule();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      packageScheduleName: "",
      packageId: 0,
      assumeStartDate: "",
      assumeEndDate: "",
      durationStart: 0,
      durationEnd: 0,
      specialNote: "",
      description: "",
      status: "ACTIVE",
      tourScheduleId: 0,
    });
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
            title="Add New Package Schedule"
            description="Create a new schedule for your package"
            breadcrumbItems={PACKAGE_SCHEDULE_CREATE_PAGE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1  gap-8">
          {/* Left Column - Forms */}
          <div>
            <form className="space-y-8">
              {/* Package Selector */}
              <PackageSelector
                selectedPackageId={formData.packageId}
                onPackageSelect={handlePackageSelect}
                onPackageClear={handlePackageClear}
                error={errors.packageId}
                required
                showDetails={true}
                fetchDetails={true}
              />

              {/* Schedule Information Card */}
              <FormCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                    <h2
                      className="text-lg font-semibold"
                      style={{ color: theme.text }}
                    >
                      Schedule Information
                    </h2>
                  </div>

                  <InputField
                    label="Schedule Name"
                    name="packageScheduleName"
                    value={formData.packageScheduleName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Summer Special Schedule, Winter Package Schedule"
                    error={errors.packageScheduleName}
                    helperText="Unique name for this package schedule"
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
                      label="Duration Start (Days)"
                      name="durationStart"
                      value={formData.durationStart}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min={1}
                      step={1}
                      placeholder="1"
                      error={errors.durationStart}
                      helperText="Starting day of the schedule"
                    />
                    <InputField
                      label="Duration End (Days)"
                      name="durationEnd"
                      value={formData.durationEnd}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min={1}
                      step={1}
                      placeholder="7"
                      error={errors.durationEnd}
                      helperText="Ending day of the schedule"
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
                    placeholder="Describe this package schedule..."
                    error={errors.description}
                    helperText="Brief description of the schedule"
                  />

                  <InputField
                    label="Special Notes (Optional)"
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleInputChange}
                    type="textarea"
                    rows={3}
                    placeholder="Any special notes or instructions for this schedule..."
                    error={errors.specialNote}
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
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CreateConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        details={{
          title: "Create New Package Schedule",
          message: "Are you sure you want to create this package schedule?",
          itemName: formData.packageScheduleName || "Untitled Schedule",
          type: "create",
          estimatedTime: "~2-3 seconds",
          tips: CREATE_PACKAGE_SCHEDULE_TIPS,
        }}
        confirmText="Create Schedule"
        cancelText="Cancel"
        onSuccess={() => {
          console.log("Package schedule created successfully");
        }}
        onError={(error) => {
          console.error("Failed to create package schedule:", error);
          setToast({
            show: true,
            type: "error",
            title: "Creation Failed",
            message:
              error.message ||
              "Failed to create package schedule. Please try again.",
          });
        }}
      />
    </div>
  );
};

export default AddNewPackageSchedulePage;
