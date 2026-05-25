"use client";

import React, { useState, useEffect } from "react";
import {
  Car, AlertCircle, Calendar, Hash, Shield,
  MapPin, Clock, Award, CheckCircle2
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeDriverDetail } from "@/types/employee-types";

interface DriverDetailsSectionProps {
  details: CreateEmployeeDriverDetail | null;
  onUpdate: (details: CreateEmployeeDriverDetail | null) => void;
}

const licenseTypes = ["Light Vehicle", "Heavy Vehicle", "Motorcycle", "Commercial", "Public Service", "International"];
const vehicleTypesList = ["Car", "Van", "Bus", "Truck", "Motorcycle", "Auto Rickshaw", "Lorry"];

const getEmptyDriverDetails = (): CreateEmployeeDriverDetail => ({
  licenseType: "",
  licenseNumber: "",
  licenseIssueDate: new Date().toISOString().split("T")[0],
  licenseExpiryDate: "",
  vehicleTypes: "",
  experienceYears: 0,
  accidentFreeYears: 0,
  routeExpertise: "",
  isAvailable: true,
});

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)},${opacity})`;
};

/* ─── Styled Input ───────────────────────────────────────────────────────────── */
const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { theme: any }> = ({
  theme, style, ...props
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <input {...props}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
      style={{
        backgroundColor: theme.background, color: theme.text,
        border: `1.5px solid ${focused ? theme.primary : theme.border}`,
        boxShadow: focused ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12` : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
        ...style,
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
};

/* ─── Styled Select ──────────────────────────────────────────────────────────── */
const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { theme: any }> = ({
  theme, children, style, ...props
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select {...props}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none pr-10"
        style={{
          backgroundColor: theme.background, color: theme.text,
          border: `1.5px solid ${focused ? theme.primary : theme.border}`,
          boxShadow: focused ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12` : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
          cursor: "pointer", ...style,
        }}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={focused ? theme.primary : theme.textSecondary}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "stroke 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
};

/* ─── Styled Textarea ────────────────────────────────────────────────────────── */
const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { theme: any }> = ({
  theme, style, ...props
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea {...props}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
      style={{
        backgroundColor: theme.background, color: theme.text,
        border: `1.5px solid ${focused ? theme.primary : theme.border}`,
        boxShadow: focused ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12` : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
        ...style,
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
};

/* ─── Field Label ────────────────────────────────────────────────────────────── */
const FieldLabel: React.FC<{ label: string; required?: boolean; theme: any }> = ({ label, required, theme }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
    style={{ color: theme.textSecondary, letterSpacing: "0.06em" }}>
    {label}{required && <span className="ml-1" style={{ color: theme.error }}>*</span>}
  </label>
);

/* ─── Stat Badge ─────────────────────────────────────────────────────────────── */
const StatBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  theme: any;
}> = ({ icon, label, value, unit, color, theme }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl"
    style={{
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      border: `1.5px solid ${color}22`,
    }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}0e)`, color }}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>{label}</p>
      <p className="text-lg font-bold leading-tight" style={{ color: theme.text }}>
        {value} <span className="text-xs font-normal" style={{ color: theme.textSecondary }}>{unit}</span>
      </p>
    </div>
  </div>
);

/* ─── License Expiry Indicator ───────────────────────────────────────────────── */
const ExpiryIndicator: React.FC<{ expiryDate: string; theme: any }> = ({ expiryDate, theme }) => {
  if (!expiryDate) return null;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isExpired = daysLeft < 0;
  const isWarning = daysLeft >= 0 && daysLeft <= 90;
  const color = isExpired ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981";
  const label = isExpired
    ? `Expired ${Math.abs(daysLeft)} days ago`
    : isWarning
    ? `Expires in ${daysLeft} days`
    : `Valid — ${daysLeft} days remaining`;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl mt-2"
      style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}>
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export const DriverDetailsSection: React.FC<DriverDetailsSectionProps> = ({ details, onUpdate }) => {
  const { theme } = useTheme();
  const hasDetails = details !== null;
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (hasDetails) {
      requestAnimationFrame(() => setFormVisible(true));
    } else {
      setFormVisible(false);
    }
  }, [hasDetails]);

  const handleToggle = () => {
    onUpdate(hasDetails ? null : getEmptyDriverDetails());
  };

  const handleChange = (field: keyof CreateEmployeeDriverDetail, value: any) => {
    if (details) onUpdate({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* ── Toggle Banner ── */}
      <div
        className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300"
        style={{
          background: hasDetails
            ? `linear-gradient(135deg, ${theme.primary}14, ${theme.primary}06)`
            : hexToRgba(theme.primary, 0.04),
          border: `1.5px solid ${hasDetails ? theme.primary + "33" : theme.border}`,
          boxShadow: hasDetails ? `0 4px 16px ${theme.primary}14` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}0e)`,
              border: `1.5px solid ${theme.primary}33`,
              transform: hasDetails ? "scale(1.05) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Car className="w-5 h-5" style={{ color: theme.primary }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>Driver Details</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Enable if this employee has driving responsibilities
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          aria-label="Toggle driver details"
          className="relative inline-flex h-7 w-13 flex-shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none"
          style={{
            width: "52px",
            backgroundColor: hasDetails ? theme.primary : theme.border,
            boxShadow: hasDetails ? `0 0 0 3px ${theme.primary}22` : "none",
          }}
        >
          <span
            className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
            style={{
              transform: hasDetails ? "translateX(28px)" : "translateX(4px)",
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </button>
      </div>

      {/* ── Driver Form ── */}
      {hasDetails && details && (
        <div
          style={{
            opacity: formVisible ? 1 : 0,
            transform: formVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* ── License Details ── */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}0e)`, border: `1.5px solid ${theme.primary}33` }}>
                <Shield className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              </div>
              <h4 className="text-sm font-bold" style={{ color: theme.text }}>License Information</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel label="License Type" required theme={theme} />
                <StyledSelect theme={theme} value={details.licenseType}
                  onChange={(e) => handleChange("licenseType", e.target.value)}>
                  <option value="">Select license type</option>
                  {licenseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </StyledSelect>
              </div>

              <div>
                <FieldLabel label="License Number" required theme={theme} />
                <StyledInput theme={theme} type="text" value={details.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  placeholder="e.g., B1234567"
                  style={{ fontFamily: "monospace", letterSpacing: "0.06em" }} />
              </div>

              <div>
                <FieldLabel label="Issue Date" required theme={theme} />
                <StyledInput theme={theme} type="date" value={details.licenseIssueDate}
                  onChange={(e) => handleChange("licenseIssueDate", e.target.value)} />
              </div>

              <div>
                <FieldLabel label="Expiry Date" required theme={theme} />
                <StyledInput theme={theme} type="date" value={details.licenseExpiryDate}
                  onChange={(e) => handleChange("licenseExpiryDate", e.target.value)} />
                <ExpiryIndicator expiryDate={details.licenseExpiryDate} theme={theme} />
              </div>

              <div>
                <FieldLabel label="Vehicle Type" required theme={theme} />
                <StyledSelect theme={theme} value={details.vehicleTypes}
                  onChange={(e) => handleChange("vehicleTypes", e.target.value)}>
                  <option value="">Select vehicle type</option>
                  {vehicleTypesList.map((t) => <option key={t} value={t}>{t}</option>)}
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-5" style={{ borderColor: theme.border }} />

          {/* ── Experience Stats ── */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #10b98122, #10b98108)", border: "1.5px solid #10b98133" }}>
                <Award className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
              </div>
              <h4 className="text-sm font-bold" style={{ color: theme.text }}>Experience</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <StatBadge
                icon={<Clock className="w-4 h-4" />}
                label="Driving Experience"
                value={details.experienceYears}
                unit="years"
                color="#6366f1"
                theme={theme}
              />
              <StatBadge
                icon={<Shield className="w-4 h-4" />}
                label="Accident-Free Record"
                value={details.accidentFreeYears}
                unit="years"
                color="#10b981"
                theme={theme}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Experience (Years)" theme={theme} />
                <StyledInput theme={theme} type="number" value={details.experienceYears}
                  onChange={(e) => handleChange("experienceYears", parseInt(e.target.value) || 0)}
                  min="0" max="50" placeholder="0" />
              </div>
              <div>
                <FieldLabel label="Accident-Free Years" theme={theme} />
                <StyledInput theme={theme} type="number" value={details.accidentFreeYears}
                  onChange={(e) => handleChange("accidentFreeYears", parseInt(e.target.value) || 0)}
                  min="0" max="50" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-5" style={{ borderColor: theme.border }} />

          {/* ── Route & Availability ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #06b6d422, #06b6d408)", border: "1.5px solid #06b6d433" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "#06b6d4" }} />
              </div>
              <h4 className="text-sm font-bold" style={{ color: theme.text }}>Route & Availability</h4>
            </div>

            <div className="space-y-4">
              <div>
                <FieldLabel label="Route Expertise" theme={theme} />
                <StyledTextarea theme={theme} rows={3} value={details.routeExpertise}
                  onChange={(e) => handleChange("routeExpertise", e.target.value)}
                  placeholder="List known routes, cities, districts and areas of expertise..." />
              </div>

              {/* Availability toggle */}
              <label className="flex items-center gap-3 cursor-pointer group" style={{ userSelect: "none" }}>
                <div
                  className="relative flex-shrink-0 rounded-full transition-all duration-300"
                  style={{
                    width: "44px", height: "24px",
                    backgroundColor: details.isAvailable ? theme.primary : theme.border,
                    boxShadow: details.isAvailable ? `0 0 0 3px ${theme.primary}22` : "none",
                  }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                    style={{ left: details.isAvailable ? "calc(100% - 20px)" : "4px" }}
                  />
                  <input type="checkbox" className="sr-only"
                    checked={details.isAvailable}
                    onChange={(e) => handleChange("isAvailable", e.target.checked)} />
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ color: theme.text }}>
                    Available for driving duties
                  </span>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Toggle off if currently on leave or reassigned
                  </p>
                </div>
                {details.isAvailable && (
                  <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: theme.primary }} />
                )}
              </label>
            </div>
          </div>

          {/* ── Info Banner ── */}
          <div className="flex items-start gap-3 mt-5 p-3.5 rounded-xl"
            style={{
              backgroundColor: hexToRgba(theme.warning || "#f59e0b", 0.08),
              border: `1px solid ${hexToRgba(theme.warning || "#f59e0b", 0.25)}`,
            }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.warning || "#f59e0b" }} />
            <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              Driver details are used for <strong style={{ color: theme.text }}>fleet management</strong> and{" "}
              <strong style={{ color: theme.text }}>trip scheduling</strong>. Ensure license information is accurate and up to date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};