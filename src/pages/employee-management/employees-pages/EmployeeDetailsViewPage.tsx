"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { EmployeeService } from "@/services/employeeService";
import { EmployeeFullDetails } from "@/types/employee-types";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import {
  EMPLOYEE_TERMINATE_PAGE_URL,
  EMPLOYEE_UPDATE_PAGE_URL,
  EMPLOYEES_VIEW_PAGE_URL,
} from "@/utils/urls";
import {
  BasicInfoCard,
  EmploymentInfoCard,
  ManagementCard,
} from "@/components/employee-management-components/employee-components/employee-details-view-components/BasicInfoCard";
import {
  ShiftsCard,
  EmergencyContactsCard,
} from "@/components/employee-management-components/employee-components/employee-details-view-components/ShiftsCard";
import {
  SocialMediaCard,
  SkillsCard,
} from "@/components/employee-management-components/employee-components/employee-details-view-components/SocialMediaCard";
import {
  PerformanceMetricsCard,
  PerformanceReviewsCard,
} from "@/components/employee-management-components/employee-components/employee-details-view-components/PerformanceMetricsCard";
import {
  AssetsCard,
  TimestampsCard,
} from "@/components/employee-management-components/employee-components/employee-details-view-components/AssetsCard";
import { EmployeeHeroHeader } from "@/components/employee-management-components/employee-components/employee-details-view-components/EmployeeHeroHeader";

const EmployeeDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const employeeId = parseInt(params?.employeeId as string);

  const [employee, setEmployee] = useState<EmployeeFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employeeId && !isNaN(employeeId)) {
      fetchEmployeeDetails();
    } else {
      setError("Invalid employee ID");
      setLoading(false);
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await EmployeeService.getEmployeeFullDetails(employeeId);
      setEmployee(response.data);
    } catch (err: any) {
      setError(
        err.message || "Failed to load employee details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(EMPLOYEES_VIEW_PAGE_URL);
    }
  };
  const handleEdit = () =>
    router.push(
      `${EMPLOYEE_UPDATE_PAGE_URL}/${employeeId}?name${employee?.username}`,
    );
  const handleDelete = () => {
    router.push(
      `${EMPLOYEE_TERMINATE_PAGE_URL}/${employeeId}?name${employee?.username}`,
    );
  };

  if (loading) {
    return (
      <CommonLoading
        message="Loading employee details..."
        subMessage="Please wait while we fetch employee information"
        size="lg"
      />
    );
  }

  if (error || !employee) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Employee"
        message="The employee couldn't be loaded. Please try again."
        variant="error"
        showBackButton
        showRetryButton
        onBack={handleBack}
        onRetry={fetchEmployeeDetails}
        backButtonText="Back to Employees"
        retryButtonText="Try Again"
        fullScreen
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <EmployeeHeroHeader
        employee={employee}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left column (sidebar) ── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <BasicInfoCard employee={employee} animationDelay={0} />
            <EmploymentInfoCard employee={employee} animationDelay={60} />
            <ManagementCard employee={employee} animationDelay={120} />
            <ShiftsCard shifts={employee.shifts} animationDelay={180} />
            <EmergencyContactsCard
              contacts={employee.emergencyContacts}
              animationDelay={240}
            />
          </div>

          {/* ── Right column (main content) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <SocialMediaCard
              socialMedia={employee.socialMedia}
              animationDelay={80}
            />
            <SkillsCard skills={employee.skills} animationDelay={140} />
            <PerformanceMetricsCard
              metrics={employee.performanceMetrics}
              animationDelay={200}
            />
            <PerformanceReviewsCard
              reviews={employee.performanceReviews}
              animationDelay={260}
            />
            <AssetsCard assets={employee.assets} animationDelay={320} />
            <TimestampsCard
              createdAt={employee.createdAt}
              updatedAt={employee.updatedAt}
              animationDelay={380}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsViewPage;
