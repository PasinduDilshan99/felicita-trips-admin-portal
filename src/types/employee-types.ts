// types/employee-types.ts

import { ApiResponse } from "./common-types";

// CEO Details Types
export interface CeoDetails {
  userId: number;
  name: string;
  title: string;
  speech: string[];
  imageUrl: string;
}

export type CeoDetailsApiResponse = ApiResponse<CeoDetails>;

// Employee Basic Types
export interface EmployeeBasic {
  employeeId: number;
  employeeCode: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  nic: string;
  employeeTypeId: number;
  employeeType: string;
  departmentId: number;
  departmentName: string;
  designationId: number;
  designationName: string;
  hireDate: string;
  employmentType: string;
  workLocation: string;
  employeeGrade: string | null;
  salary: number;
  supervisorId: number | null;
  supervisorName: string;
  reportingManagerId: number | null;
  reportingManagerName: string;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
  createdAt: string;
  updatedAt: string;
}


// Filter Options Types
export interface FilterOption {
  id: number;
  label: string;
}

export interface EmployeeFilterOptions {
  employeeTypes: FilterOption[];
  departments: FilterOption[];
  employmentTypes: FilterOption[];
  workLocations: FilterOption[];
  employeeGrades: FilterOption[];
  supervisors: FilterOption[];
  reportingManagers: FilterOption[];
  statuses: FilterOption[];
}

export type EmployeeFilterOptionsApiResponse = ApiResponse<EmployeeFilterOptions>;

export type EmployeeBasicListApiResponse = ApiResponse<EmployeeBasic[]>;

// Employee Filter Parameters
export interface EmployeeFilterParams {
  name: string | null;
  employeeTypeId: number | null;
  status: string | null;
  departmentId: number | null;
  employmentType: string | null;
  workLocation: string | null;
  employeeGrade: string | null;
  supervisorId: number | null;
  reportingManagerId: number | null;
  pageSize: number;
  pageNumber: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

// Employee Full Details Types
export interface EmployeeShift {
  shiftName: string;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface EmployeeSkill {
  skillName: string;
  skillCategory: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  certification: string | null;
  certifiedDate: string | null;
  expiryDate: string | null;
  verified: boolean | null;
}

export interface EmployeeSocialMedia {
  platformName: string;
  username: string;
  profileUrl: string;
  followerCount: number;
  primary: boolean;
  verified: boolean;
}

export interface EmployeePerformanceMetric {
  metricDate: string;
  metricType: string;
  metricValue: number;
  targetValue: number;
  achievementPercentage: number;
  notes: string;
}

export interface EmployeePerformanceReview {
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  reviewDate: string | null;
  overallRating: number;
  attendanceRating: number | null;
  productivityRating: number | null;
  qualityRating: number | null;
  teamworkRating: number | null;
  strengths: string | null;
  areasForImprovement: string | null;
  goals: string | null;
  comments: string;
  status: string;
}

export interface EmployeeEmergencyContact {
  contactName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone: string | null;
  email: string;
  address: string | null;
  primary: boolean;
}

export interface EmployeeAsset {
  assetType: string;
  assetId: string | null;
  assetName: string;
  serialNumber: string;
  model: string;
  assignedDate: string;
  returnDate: string | null;
  conditionOnAssignment: string | null;
  conditionOnReturn: string | null;
  notes: string | null;
}

export interface EmployeeFullDetails extends EmployeeBasic {
  shifts: EmployeeShift[];
  skills: EmployeeSkill[];
  socialMedia: EmployeeSocialMedia[];
  performanceMetrics: EmployeePerformanceMetric[];
  performanceReviews: EmployeePerformanceReview[];
  emergencyContacts: EmployeeEmergencyContact[];
  assets: EmployeeAsset[];
}

export type EmployeeFullDetailsApiResponse = ApiResponse<EmployeeFullDetails>;

// Statistics Types
export interface KpiSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  employeesWithoutSupervisor: number;
  employeesJoinedThisMonth: number;
  averageRating: number;
  totalAssets: number;
}

export interface DepartmentWiseEmployee {
  departmentName: string;
  employeeCount: number;
}

export interface EmployeeTypeDistribution {
  employeeType: string;
  employeeCount: number;
}

export interface WorkLocationDistribution {
  workLocation: string;
  employeeCount: number;
}

export interface EmployeeGradeDistribution {
  employeeGrade: string | null;
  employeeCount: number;
}

export interface MonthlyHiringTrend {
  month: string;
  hiredCount: number;
}

export interface SalaryByDepartment {
  departmentName: string;
  averageSalary: number;
  totalSalary: number;
}

export interface PerformanceRatingDistribution {
  ratingGroup: number;
  totalReviews: number;
}

export interface SkillDistribution {
  skillName: string;
  employeeCount: number;
}

export interface AssetDistribution {
  assetType: string;
  totalAssets: number;
}

export interface ShiftDistribution {
  shiftName: string;
  employeeCount: number;
}

export interface EmployeeStatisticsData {
  kpiSummary: KpiSummary;
  departmentWiseEmployees: DepartmentWiseEmployee[];
  employeeTypeDistribution: EmployeeTypeDistribution[];
  workLocationDistribution: WorkLocationDistribution[];
  employeeGradeDistribution: EmployeeGradeDistribution[];
  monthlyHiringTrend: MonthlyHiringTrend[];
  salaryByDepartment: SalaryByDepartment[];
  performanceRatingDistribution: PerformanceRatingDistribution[];
  skillDistribution: SkillDistribution[];
  assetDistribution: AssetDistribution[];
  shiftDistribution: ShiftDistribution[];
}

export type EmployeeStatisticsApiResponse = ApiResponse<EmployeeStatisticsData>;

// Add these to your existing types/employee-types.ts file

// Create Employee Types
export interface CreateEmployeeBasicDetails {
  userId: number;
  employeeCode: string;
  employeeTypeId: number;
  departmentId: number;
  designationId: number;
  hireDate: string;
  employmentType: string;
  supervisorId: number | null;
  reportingManagerId: number | null;
  salary: number;
  bankAccountNumber: string | null;
  bankName: string | null;
  bankBranch: string | null;
  ifscCode: string | null;
  uanNumber: string | null;
  pfNumber: string | null;
  esiNumber: string | null;
  probationPeriodMonths: number | null;
  probationEndDate: string | null;
  confirmationDate: string | null;
  exitDate: string | null;
  workLocation: string;
  costCenter: string | null;
  employeeGrade: string | null;
  status: "ACTIVE" | "INACTIVE" | "TERMINATED";
}

export interface CreateEmployeeEmergencyContact {
  contactName: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone: string | null;
  email: string;
  address: string | null;
  isPrimary: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeAsset {
  assetType: string;
  assetId: string | null;
  assetName: string;
  serialNumber: string;
  model: string;
  assignedDate: string;
  returnDate: string | null;
  conditionOnAssignment: string | null;
  conditionOnReturn: string | null;
  notes: string | null;
  assignedBy: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeDocument {
  documentType: string;
  documentName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  expiryDate: string | null;
  verified: boolean;
  verifiedBy: number | null;
  verifiedDate: string | null;
  notes: string | null;
  uploadedBy: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeDriverDetail {
  licenseType: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  vehicleTypes: string;
  experienceYears: number;
  accidentFreeYears: number;
  routeExpertise: string;
  isAvailable: boolean;
}

export interface CreateEmployeeGuideSpecialization {
  specializationType: string;
  regions: string;
  languages: string;
  certifications: string;
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
}

export interface CreateEmployeeIncentive {
  incentiveDate: string;
  incentiveType: string;
  amount: number;
  calculationBasis: string;
  referenceId: string;
  paymentStatus: "pending" | "paid" | "cancelled";
  paidDate: string | null;
}

export interface CreateEmployeeSalaryStructure {
  componentId: number;
  amount: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeSkill {
  skillName: string;
  skillCategory: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  certification: string | null;
  certifiedDate: string | null;
  expiryDate: string | null;
  verified: boolean;
  verifiedBy: number | null;
  verifiedDate: string | null;
}

export interface CreateEmployeeWorkHistory {
  designationId: number;
  departmentId: number;
  salary: number;
  startDate: string;
  endDate: string;
  employmentType: string;
  reason: string;
  notes: string | null;
  status: "active" | "inactive";
}

export interface CreateEmployeeShiftAssignment {
  shiftId: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  assignedBy: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeSocialMediaAccount {
  platformId: number;
  username: string;
  profileUrl: string;
  followerCount: number;
  isPrimary: boolean;
  isPublic: boolean;
  verified: boolean;
  verifiedBy: number | null;
  verifiedDate: string | null;
  lastUpdated: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CreateEmployeeRequest {
  basicDetails: CreateEmployeeBasicDetails;
  emergencyContacts: CreateEmployeeEmergencyContact[];
  assets: CreateEmployeeAsset[];
  documents: CreateEmployeeDocument[];
  driverDetails?: CreateEmployeeDriverDetail | null;
  guideSpecializations?: CreateEmployeeGuideSpecialization[];
  incentives: CreateEmployeeIncentive[];
  salaryStructures: CreateEmployeeSalaryStructure[];
  skills: CreateEmployeeSkill[];
  workHistories: CreateEmployeeWorkHistory[];
  shiftAssignments: CreateEmployeeShiftAssignment[];
  socialMediaAccounts: CreateEmployeeSocialMediaAccount[];
}

export interface CreateEmployeeResponse {
  message: string;
}

export type CreateEmployeeApiResponse = ApiResponse<CreateEmployeeResponse>;

export interface EmployeeCreateDataOption {
  id: number;
  label: string;
}

export interface EmployeeCreateData {
  employeeTypes: EmployeeCreateDataOption[];
  departments: EmployeeCreateDataOption[];
  designationTypes: EmployeeCreateDataOption[];
  employmentTypes: EmployeeCreateDataOption[];
  bankNames: EmployeeCreateDataOption[];
  workLocations: EmployeeCreateDataOption[];
  employeeGrades: EmployeeCreateDataOption[];
  supervisors: EmployeeCreateDataOption[];
  reportingManagers: EmployeeCreateDataOption[];
  statuses: EmployeeCreateDataOption[];
  salaryComponents: EmployeeCreateDataOption[];
  shiftTypes: EmployeeCreateDataOption[];
  socialMediaPlatforms: EmployeeCreateDataOption[];
}

export type EmployeeCreateDataApiResponse = ApiResponse<EmployeeCreateData>;

export interface TourAssignmentEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  mobileNumber1: string;
  designationName: string;
  tours: {
    name: string | null;
    tour_id: number | null;
  }[];
}

export interface EmployeeAssignResponse {
  code: number;
  status: string;
  message: string;
  data: TourAssignmentEmployee[];
  timestamp: string;
}