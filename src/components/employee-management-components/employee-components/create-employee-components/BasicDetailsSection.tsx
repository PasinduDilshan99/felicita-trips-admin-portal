"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeBasicDetails, EmployeeCreateData } from "@/types/employee-types";
import { UserBasicDetails } from "@/types/user-types";

interface BasicDetailsSectionProps {
  formData: CreateEmployeeBasicDetails;
  userDetails: UserBasicDetails;
  employeeCreateData: EmployeeCreateData;
  onUpdate: (field: string, value: any) => void;
}

/* ─── Floating Label Input ─────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  animationDelay?: number;
}

const FormField: React.FC<FieldProps> = ({ label, required, children, animationDelay = 0 }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: theme.textSecondary, letterSpacing: "0.06em" }}
      >
        {label}
        {required && (
          <span
            className="ml-1 text-xs"
            style={{ color: theme.error, fontWeight: 700 }}
          >
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
};

/* ─── Styled Input ──────────────────────────────────────────────────────────── */
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme: any;
}

const StyledInput: React.FC<StyledInputProps> = ({ theme, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        border: `1.5px solid ${focused ? theme.primary : hovered ? theme.primary + "66" : theme.border}`,
        boxShadow: focused
          ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12`
          : hovered
          ? `0 2px 6px ${theme.border}80`
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1), background 0.2s",
        ...style,
      }}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

/* ─── Styled Select ─────────────────────────────────────────────────────────── */
interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  theme: any;
  children: React.ReactNode;
}

const StyledSelect: React.FC<StyledSelectProps> = ({ theme, children, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none pr-10"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          border: `1.5px solid ${focused ? theme.primary : hovered ? theme.primary + "66" : theme.border}`,
          boxShadow: focused
            ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12`
            : hovered
            ? `0 2px 6px ${theme.border}80`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
          cursor: "pointer",
          ...style,
        }}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </select>
      {/* Custom chevron icon */}
      <div
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200"
        style={{
          transform: focused ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={focused ? theme.primary : theme.textSecondary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
};

/* ─── Section Header ────────────────────────────────────────────────────────── */
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  theme: any;
  animationDelay?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle, theme, animationDelay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  return (
    <div
      className="flex items-center gap-3 mb-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)`,
          border: `1.5px solid ${theme.primary}33`,
        }}
      >
        <span style={{ color: theme.primary }}>{icon}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold" style={{ color: theme.text, lineHeight: 1.2 }}>
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Divider ────────────────────────────────────────────────────────────────── */
const SectionDivider: React.FC<{ theme: any; animationDelay?: number }> = ({ theme, animationDelay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  return (
    <div
      className="mt-8 pt-8 border-t"
      style={{
        borderColor: theme.border,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export const BasicDetailsSection: React.FC<BasicDetailsSectionProps> = ({
  formData,
  userDetails,
  employeeCreateData,
  onUpdate,
}) => {
  const { theme } = useTheme();

  // Stagger base delay per grid row (50ms per item)
  const delay = (i: number) => i * 50;

  return (
    <div className="space-y-0">
      {/* ── Employment Details ── */}
      <SectionHeader
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        }
        title="Employment Details"
        subtitle="Core role and contract information"
        theme={theme}
        animationDelay={0}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <FormField label="Employee Code" required animationDelay={delay(1)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.employeeCode}
            onChange={(e) => onUpdate("employeeCode", e.target.value)}
            placeholder="e.g., EMP001"
          />
        </FormField>

        <FormField label="Employee Type" required animationDelay={delay(2)}>
          <StyledSelect
            theme={theme}
            value={formData.employeeTypeId || ""}
            onChange={(e) => onUpdate("employeeTypeId", parseInt(e.target.value))}
          >
            <option value="">Select Employee Type</option>
            {employeeCreateData?.employeeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Department" required animationDelay={delay(3)}>
          <StyledSelect
            theme={theme}
            value={formData.departmentId || ""}
            onChange={(e) => onUpdate("departmentId", parseInt(e.target.value))}
          >
            <option value="">Select Department</option>
            {employeeCreateData?.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Designation" required animationDelay={delay(4)}>
          <StyledSelect
            theme={theme}
            value={formData.designationId || ""}
            onChange={(e) => onUpdate("designationId", parseInt(e.target.value))}
          >
            <option value="">Select Designation</option>
            {employeeCreateData?.designationTypes.map((desig) => (
              <option key={desig.id} value={desig.id}>{desig.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Hire Date" required animationDelay={delay(5)}>
          <StyledInput
            theme={theme}
            type="date"
            value={formData.hireDate}
            onChange={(e) => onUpdate("hireDate", e.target.value)}
          />
        </FormField>

        <FormField label="Employment Type" required animationDelay={delay(6)}>
          <StyledSelect
            theme={theme}
            value={formData.employmentType}
            onChange={(e) => onUpdate("employmentType", e.target.value)}
          >
            <option value="">Select Employment Type</option>
            {employeeCreateData?.employmentTypes.map((type) => (
              <option key={type.id} value={type.label}>{type.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Work Location" required animationDelay={delay(7)}>
          <StyledSelect
            theme={theme}
            value={formData.workLocation}
            onChange={(e) => onUpdate("workLocation", e.target.value)}
          >
            <option value="">Select Work Location</option>
            {employeeCreateData?.workLocations.map((loc) => (
              <option key={loc.id} value={loc.label}>{loc.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Employee Grade" animationDelay={delay(8)}>
          <StyledSelect
            theme={theme}
            value={formData.employeeGrade || ""}
            onChange={(e) => onUpdate("employeeGrade", e.target.value || null)}
          >
            <option value="">Select Grade</option>
            {employeeCreateData?.employeeGrades.map((grade) => (
              <option key={grade.id} value={grade.label}>{grade.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Salary" required animationDelay={delay(9)}>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
              style={{ color: theme.textSecondary }}
            >
              LKR
            </span>
            <StyledInput
              theme={theme}
              type="number"
              value={formData.salary || ""}
              onChange={(e) => onUpdate("salary", parseFloat(e.target.value))}
              placeholder="0.00"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </FormField>

        <FormField label="Status" required animationDelay={delay(10)}>
          <StyledSelect
            theme={theme}
            value={formData.status}
            onChange={(e) => onUpdate("status", e.target.value)}
          >
            {employeeCreateData?.statuses.map((status) => (
              <option key={status.id} value={status.label}>{status.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Supervisor" animationDelay={delay(11)}>
          <StyledSelect
            theme={theme}
            value={formData.supervisorId || ""}
            onChange={(e) => onUpdate("supervisorId", e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Select Supervisor</option>
            {employeeCreateData?.supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>{sup.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Reporting Manager" animationDelay={delay(12)}>
          <StyledSelect
            theme={theme}
            value={formData.reportingManagerId || ""}
            onChange={(e) => onUpdate("reportingManagerId", e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Select Reporting Manager</option>
            {employeeCreateData?.reportingManagers.map((mgr) => (
              <option key={mgr.id} value={mgr.id}>{mgr.label}</option>
            ))}
          </StyledSelect>
        </FormField>
      </div>

      {/* ── Bank Details ── */}
      <SectionDivider theme={theme} animationDelay={delay(13)} />

      <SectionHeader
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        }
        title="Bank Details"
        subtitle="Payment and account information"
        theme={theme}
        animationDelay={delay(14)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Bank Account Number" animationDelay={delay(15)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.bankAccountNumber || ""}
            onChange={(e) => onUpdate("bankAccountNumber", e.target.value || null)}
            placeholder="Enter account number"
          />
        </FormField>

        <FormField label="Bank Name" animationDelay={delay(16)}>
          <StyledSelect
            theme={theme}
            value={formData.bankName || ""}
            onChange={(e) => onUpdate("bankName", e.target.value || null)}
          >
            <option value="">Select Bank</option>
            {employeeCreateData?.bankNames.map((bank) => (
              <option key={bank.id} value={bank.label}>{bank.label}</option>
            ))}
          </StyledSelect>
        </FormField>

        <FormField label="Bank Branch" animationDelay={delay(17)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.bankBranch || ""}
            onChange={(e) => onUpdate("bankBranch", e.target.value || null)}
            placeholder="Enter branch name"
          />
        </FormField>

        <FormField label="IFSC Code" animationDelay={delay(18)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.ifscCode || ""}
            onChange={(e) => onUpdate("ifscCode", e.target.value || null)}
            placeholder="e.g., SAMP0001234"
            style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}
          />
        </FormField>
      </div>

      {/* ── Statutory Details ── */}
      <SectionDivider theme={theme} animationDelay={delay(19)} />

      <SectionHeader
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
        }
        title="Statutory Details"
        subtitle="Compliance and provident fund information"
        theme={theme}
        animationDelay={delay(20)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="UAN Number" animationDelay={delay(21)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.uanNumber || ""}
            onChange={(e) => onUpdate("uanNumber", e.target.value || null)}
            placeholder="Enter UAN number"
            style={{ fontFamily: "monospace" }}
          />
        </FormField>

        <FormField label="PF Number" animationDelay={delay(22)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.pfNumber || ""}
            onChange={(e) => onUpdate("pfNumber", e.target.value || null)}
            placeholder="Enter PF number"
            style={{ fontFamily: "monospace" }}
          />
        </FormField>

        <FormField label="ESI Number" animationDelay={delay(23)}>
          <StyledInput
            theme={theme}
            type="text"
            value={formData.esiNumber || ""}
            onChange={(e) => onUpdate("esiNumber", e.target.value || null)}
            placeholder="Enter ESI number"
            style={{ fontFamily: "monospace" }}
          />
        </FormField>
      </div>
    </div>
  );
};