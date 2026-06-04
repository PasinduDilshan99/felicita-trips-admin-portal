// app/employees/create/page.tsx (FIXED VERSION)
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { CreateConfirmModal } from "@/components/common-components/CreateConfirmModal";
import { CollapsibleCard } from "@/components/common-components/CollapsibleCard";
import { UserService } from "@/services/userService";
import { EmployeeService } from "@/services/employeeService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import { EmergencyContactsSection } from "@/components/employee-management-components/employee-components/create-employee-components/EmergencyContactsSection";
import { AssetsSection } from "@/components/employee-management-components/employee-components/create-employee-components/AssetsSection";
import { DocumentsSection } from "@/components/employee-management-components/employee-components/create-employee-components/DocumentsSection";
import { DriverDetailsSection } from "@/components/employee-management-components/employee-components/create-employee-components/DriverDetailsSection";
import { GuideSpecializationsSection } from "@/components/employee-management-components/employee-components/create-employee-components/GuideSpecializationsSection";
import { IncentivesSection } from "@/components/employee-management-components/employee-components/create-employee-components/IncentivesSection";
import { SalaryStructuresSection } from "@/components/employee-management-components/employee-components/create-employee-components/SalaryStructuresSection";
import { SkillsSection } from "@/components/employee-management-components/employee-components/create-employee-components/SkillsSection";
import { WorkHistoriesSection } from "@/components/employee-management-components/employee-components/create-employee-components/WorkHistoriesSection";
import { ShiftAssignmentsSection } from "@/components/employee-management-components/employee-components/create-employee-components/ShiftAssignmentsSection";
import { SocialMediaAccountsSection } from "@/components/employee-management-components/employee-components/create-employee-components/SocialMediaAccountsSection";

import {
  User,
  Phone,
  Briefcase,
  FileText,
  Car,
  Compass,
  Gift,
  DollarSign,
  Award,
  History,
  Clock,
  Share2,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  CreateEmployeeRequest,
  EmployeeCreateData,
  CreateEmployeeEmergencyContact,
  CreateEmployeeAsset,
  CreateEmployeeDocument,
  CreateEmployeeDriverDetail,
  CreateEmployeeGuideSpecialization,
  CreateEmployeeIncentive,
  CreateEmployeeSalaryStructure,
  CreateEmployeeSkill,
  CreateEmployeeWorkHistory,
  CreateEmployeeShiftAssignment,
  CreateEmployeeSocialMediaAccount,
} from "@/types/employee-types";
import { BasicDetailsSection } from "@/components/employee-management-components/employee-components/create-employee-components/BasicDetailsSection";
import { UserBasicDetails, UserNameAndId } from "@/types/user-types";
import { hexToRgba } from "@/utils/functions";
import { UserDetailsCard } from "@/components/employee-management-components/employee-components/create-employee-components/UserDetailsCard";

// Type for search items
interface UserSearchItem {
  id: number;
  name: string;
}

// Initial empty state for form data
const getInitialFormData = (): CreateEmployeeRequest => ({
  basicDetails: {
    userId: 0,
    employeeCode: "",
    employeeTypeId: 0,
    departmentId: 0,
    designationId: 0,
    hireDate: new Date().toISOString().split("T")[0],
    employmentType: "",
    supervisorId: null,
    reportingManagerId: null,
    salary: 0,
    bankAccountNumber: null,
    bankName: null,
    bankBranch: null,
    ifscCode: null,
    uanNumber: null,
    pfNumber: null,
    esiNumber: null,
    probationPeriodMonths: null,
    probationEndDate: null,
    confirmationDate: null,
    exitDate: null,
    workLocation: "",
    costCenter: null,
    employeeGrade: null,
    status: "ACTIVE",
  },
  emergencyContacts: [],
  assets: [],
  documents: [],
  driverDetails: null,
  guideSpecializations: [],
  incentives: [],
  salaryStructures: [],
  skills: [],
  workHistories: [],
  shiftAssignments: [],
  socialMediaAccounts: [],
});

const CreateEmployeePage = () => {
  const { theme } = useTheme();
  const router = useRouter();

  // State for users list (without employees)
  const [users, setUsers] = useState<UserNameAndId[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserNameAndId | null>(null);
  const [userDetails, setUserDetails] = useState<UserBasicDetails | null>(null);

  // State for employee create data (dropdown options)
  const [employeeCreateData, setEmployeeCreateData] =
    useState<EmployeeCreateData | null>(null);

  // State for form data
  const [formData, setFormData] =
    useState<CreateEmployeeRequest>(getInitialFormData());

  // UI state
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [loadingCreateData, setLoadingCreateData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: "Create", href: "/employees/create" },
  ];

  // Fetch users without employees
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await UserService.getUserNamesAndIdsWithoutEmployees();
      if (response.code === 200 && response.data) {
        setUsers(response.data);
      } else {
        throw new Error(response.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load users",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch employee create data (dropdown options)
  const fetchEmployeeCreateData = async () => {
    setLoadingCreateData(true);
    try {
      const response = await EmployeeService.getEmployeeCreateData();
      if (response.code === 200 && response.data) {
        setEmployeeCreateData(response.data);
      } else {
        throw new Error(
          response.message || "Failed to load employee create data",
        );
      }
    } catch (err: any) {
      console.error("Error fetching employee create data:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load form data",
      });
    } finally {
      setLoadingCreateData(false);
    }
  };

  // Fetch user details when selected
  const fetchUserDetails = async (userId: number) => {
    setLoadingUserDetails(true);
    try {
      const response = await UserService.getUserBasicDetailsByUserId(userId);
      if (response.code === 200 && response.data) {
        setUserDetails(response.data);
        // Auto-fill basic details with user info
        setFormData((prev) => ({
          ...prev,
          basicDetails: {
            ...prev.basicDetails,
            userId: response.data.userId,
          },
        }));
      } else {
        throw new Error(response.message || "Failed to load user details");
      }
    } catch (err: any) {
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load user details",
      });
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleSelectUser = async (id: number, name: string) => {
    setSelectedUser({ userId: id, username: name });
    await fetchUserDetails(id);
  };

  const handleClearUserSelection = () => {
    setSelectedUser(null);
    setUserDetails(null);
    setFormData(getInitialFormData());

    const url = new URL(window.location.href);
    url.searchParams.delete("user-id");
    url.searchParams.delete("user-name");
    window.history.replaceState({}, "", url.toString());
  };

  // Update form data for basic details
  const updateBasicDetails = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      basicDetails: {
        ...prev.basicDetails,
        [field]: value,
      },
    }));
  };

  // Update other sections with safety checks
  const updateEmergencyContacts = (
    contacts: CreateEmployeeEmergencyContact[],
  ) => {
    setFormData((prev) => ({ ...prev, emergencyContacts: contacts || [] }));
  };

  const updateAssets = (assets: CreateEmployeeAsset[]) => {
    setFormData((prev) => ({ ...prev, assets: assets || [] }));
  };

  const updateDocuments = (documents: CreateEmployeeDocument[]) => {
    setFormData((prev) => ({ ...prev, documents: documents || [] }));
  };

  const updateDriverDetails = (details: CreateEmployeeDriverDetail | null) => {
    setFormData((prev) => ({ ...prev, driverDetails: details ?? null }));
  };

  const updateGuideSpecializations = (
    specializations: CreateEmployeeGuideSpecialization[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      guideSpecializations: specializations || [],
    }));
  };

  const updateIncentives = (incentives: CreateEmployeeIncentive[]) => {
    setFormData((prev) => ({ ...prev, incentives: incentives || [] }));
  };

  const updateSalaryStructures = (
    structures: CreateEmployeeSalaryStructure[],
  ) => {
    setFormData((prev) => ({ ...prev, salaryStructures: structures || [] }));
  };

  const updateSkills = (skills: CreateEmployeeSkill[]) => {
    setFormData((prev) => ({ ...prev, skills: skills || [] }));
  };

  const updateWorkHistories = (histories: CreateEmployeeWorkHistory[]) => {
    setFormData((prev) => ({ ...prev, workHistories: histories || [] }));
  };

  const updateShiftAssignments = (
    assignments: CreateEmployeeShiftAssignment[],
  ) => {
    setFormData((prev) => ({ ...prev, shiftAssignments: assignments || [] }));
  };

  const updateSocialMediaAccounts = (
    accounts: CreateEmployeeSocialMediaAccount[],
  ) => {
    setFormData((prev) => ({ ...prev, socialMediaAccounts: accounts || [] }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const basic = formData.basicDetails;
    if (!basic.userId) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Please select a user first",
      });
      return false;
    }
    if (!basic.employeeCode) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Employee code is required",
      });
      return false;
    }
    if (!basic.employeeTypeId) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Employee type is required",
      });
      return false;
    }
    if (!basic.departmentId) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Department is required",
      });
      return false;
    }
    if (!basic.designationId) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Designation is required",
      });
      return false;
    }
    if (!basic.hireDate) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Hire date is required",
      });
      return false;
    }
    if (!basic.workLocation) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Work location is required",
      });
      return false;
    }
    if (basic.salary <= 0) {
      setToast({
        type: "error",
        title: "Validation Error",
        message: "Valid salary is required",
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const response = await EmployeeService.createEmployee(formData);
      if (response.code === 200) {
        setToast({
          type: "success",
          title: "Employee Created Successfully!",
          message: `Employee has been created successfully.`,
          actionLink: "/employees",
        });
        setShowConfirmModal(false);
        // Reset form
        handleClearUserSelection();
        fetchUsers();
      } else {
        throw new Error(response.message || "Failed to create employee");
      }
    } catch (err: any) {
      setToast({
        type: "error",
        title: "Creation Failed",
        message: err.message || "Failed to create employee. Please try again.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Convert users to search items
  const searchItems: UserSearchItem[] = users.map((user) => ({
    id: user.userId,
    name: user.username,
  }));

  const selectedSearchItem: UserSearchItem | null = selectedUser
    ? {
        id: selectedUser.userId,
        name: selectedUser.username,
      }
    : null;

  useEffect(() => {
    fetchUsers();
    fetchEmployeeCreateData();
  }, []);

  if (loadingUsers && !selectedUser) {
    return (
      <CommonLoading
        message="Loading users..."
        subMessage="Please wait while we fetch available users"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (loadingCreateData) {
    return (
      <CommonLoading
        message="Loading form data..."
        subMessage="Please wait while we prepare the form"
        size="lg"
        fullScreen={true}
      />
    );
  }

  return (
    <div
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
          actionText="View Employees"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Create Employee"
            description="Register a new employee in the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no user is selected */}
        {!selectedUser && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.primary, 0.1),
                  color: theme.primary,
                }}
              >
                <User className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select User
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a user to create an employee record
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<UserSearchItem>
                items={searchItems}
                loading={loadingUsers}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectUser(item.id, item.name)}
                onClearSelection={handleClearUserSelection}
                placeholder="Search users..."
                title="Users"
                variant="primary"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected User Info Bar */}
        {selectedUser && (
          <SelectedItemBar
            item={
              selectedUser
                ? {
                    id: selectedUser.userId,
                    name: selectedUser.username,
                  }
                : null
            }
            onClear={handleClearUserSelection}
            variant="primary"
            title="Selected User"
            showId={true}
            clearButtonText="Change User"
            size="md"
          />
        )}

        {/* User Details Display */}
        {selectedUser && userDetails && (
          <UserDetailsCard userDetails={userDetails} />
        )}

        {/* Loading User Details */}
        {loadingUserDetails && (
          <div className="mb-6">
            <CommonLoading
              message="Loading user details..."
              subMessage="Please wait"
              size="md"
              fullScreen={false}
            />
          </div>
        )}

        {/* Employee Form Sections */}
        {selectedUser && userDetails && employeeCreateData && (
          <div className="space-y-6">
            {/* Basic Details */}
            <CollapsibleCard
              title="Basic Details"
              icon={<User className="w-4 h-4" />}
              defaultExpanded={true}
            >
              <BasicDetailsSection
                formData={formData.basicDetails}
                userDetails={userDetails}
                employeeCreateData={employeeCreateData}
                onUpdate={updateBasicDetails}
              />
            </CollapsibleCard>

            {/* Emergency Contacts */}
            <CollapsibleCard
              title="Emergency Contacts"
              icon={<Phone className="w-4 h-4" />}
              badge={formData.emergencyContacts?.length || 0}
              badgeColor={theme.warning}
            >
              <EmergencyContactsSection
                contacts={formData.emergencyContacts || []}
                onUpdate={updateEmergencyContacts}
              />
            </CollapsibleCard>

            {/* Assets */}
            <CollapsibleCard
              title="Assets"
              icon={<Briefcase className="w-4 h-4" />}
              badge={formData.assets?.length || 0}
              badgeColor={theme.primary}
            >
              <AssetsSection
                assets={formData.assets || []}
                onUpdate={updateAssets}
                employeeCreateData={employeeCreateData}
              />
            </CollapsibleCard>

            {/* Documents */}
            <CollapsibleCard
              title="Documents"
              icon={<FileText className="w-4 h-4" />}
              badge={formData.documents?.length || 0}
              badgeColor={theme.primary}
            >
              <DocumentsSection
                documents={formData.documents || []}
                onUpdate={updateDocuments}
                userId={selectedUser.userId}
              />
            </CollapsibleCard>

            {/* Driver Details (Optional) */}
            <CollapsibleCard
              title="Driver Details"
              icon={<Car className="w-4 h-4" />}
              defaultExpanded={false}
            >
              <DriverDetailsSection
                details={formData.driverDetails ?? null}
                onUpdate={updateDriverDetails}
              />
            </CollapsibleCard>

            {/* Guide Specializations (Optional) */}
            <CollapsibleCard
              title="Guide Specializations"
              icon={<Compass className="w-4 h-4" />}
              badge={formData.guideSpecializations?.length || 0}
              badgeColor={theme.warning}
              defaultExpanded={false}
            >
              <GuideSpecializationsSection
                specializations={formData.guideSpecializations || []}
                onUpdate={updateGuideSpecializations}
              />
            </CollapsibleCard>

            {/* Incentives */}
            <CollapsibleCard
              title="Incentives"
              icon={<Gift className="w-4 h-4" />}
              badge={formData.incentives?.length || 0}
              badgeColor={theme.success}
              defaultExpanded={false}
            >
              <IncentivesSection
                incentives={formData.incentives || []}
                onUpdate={updateIncentives}
              />
            </CollapsibleCard>

            {/* Salary Structures */}
            <CollapsibleCard
              title="Salary Structures"
              icon={<DollarSign className="w-4 h-4" />}
              badge={formData.salaryStructures?.length || 0}
              badgeColor={theme.success}
              defaultExpanded={false}
            >
              <SalaryStructuresSection
                structures={formData.salaryStructures || []}
                onUpdate={updateSalaryStructures}
                employeeCreateData={employeeCreateData}
              />
            </CollapsibleCard>

            {/* Skills */}
            <CollapsibleCard
              title="Skills"
              icon={<Award className="w-4 h-4" />}
              badge={formData.skills?.length || 0}
              badgeColor={theme.primary}
              defaultExpanded={false}
            >
              <SkillsSection
                skills={formData.skills || []}
                onUpdate={updateSkills}
              />
            </CollapsibleCard>

            {/* Work Histories */}
            <CollapsibleCard
              title="Work Histories"
              icon={<History className="w-4 h-4" />}
              badge={formData.workHistories?.length || 0}
              badgeColor={theme.warning}
              defaultExpanded={false}
            >
              <WorkHistoriesSection
                histories={formData.workHistories || []}
                onUpdate={updateWorkHistories}
                employeeCreateData={employeeCreateData}
              />
            </CollapsibleCard>

            {/* Shift Assignments */}
            <CollapsibleCard
              title="Shift Assignments"
              icon={<Clock className="w-4 h-4" />}
              badge={formData.shiftAssignments?.length || 0}
              badgeColor={theme.primary}
              defaultExpanded={false}
            >
              <ShiftAssignmentsSection
                assignments={formData.shiftAssignments || []}
                onUpdate={updateShiftAssignments}
                employeeCreateData={employeeCreateData}
                userId={selectedUser.userId}
              />
            </CollapsibleCard>

            {/* Social Media Accounts */}
            <CollapsibleCard
              title="Social Media Accounts"
              icon={<Share2 className="w-4 h-4" />}
              badge={formData.socialMediaAccounts?.length || 0}
              badgeColor={theme.primary}
              defaultExpanded={false}
            >
              <SocialMediaAccountsSection
                accounts={formData.socialMediaAccounts || []}
                onUpdate={updateSocialMediaAccounts}
                employeeCreateData={employeeCreateData}
                userId={selectedUser.userId}
              />
            </CollapsibleCard>

            {/* Action Buttons */}
            <div
              className="rounded-2xl shadow-lg p-6 transition-colors duration-300"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setFormData(getInitialFormData());
                    if (selectedUser) {
                      setFormData((prev) => ({
                        ...prev,
                        basicDetails: {
                          ...prev.basicDetails,
                          userId: selectedUser.userId,
                        },
                      }));
                    }
                  }}
                  className="cursor-pointer flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2"
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
                  <RefreshCw className="w-4 h-4" />
                  Reset Form
                </button>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loadingSubmit}
                  className="cursor-pointer flex-1 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                  }}
                >
                  <Save className="w-4 h-4" />
                  {loadingSubmit ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <CreateConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Create Employee"
        message={`Are you sure you want to create an employee record for "${selectedUser?.username}"?`}
        itemName={selectedUser?.username || "this employee"}
        confirmText="Create Employee"
        cancelText="Cancel"
        type="create"
        isLoading={loadingSubmit}
      />
    </div>
  );
};

export default CreateEmployeePage;
