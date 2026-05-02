"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, X, History, Building, DollarSign, Calendar, FileText, Briefcase, ShieldAlert } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeWorkHistory, EmployeeCreateData } from "@/types/employee-types";

interface WorkHistoriesSectionProps {
  histories: CreateEmployeeWorkHistory[];
  onUpdate: (histories: CreateEmployeeWorkHistory[]) => void;
  employeeCreateData: EmployeeCreateData;
}

const employmentTypes = ["Full Time", "Part Time", "Contract", "Internship", "Temporary", "Consultant"];
const statuses = ["active", "inactive"];

const getEmptyHistory = (): CreateEmployeeWorkHistory => ({
  designationId: 0,
  departmentId: 0,
  salary: 0,
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  employmentType: "",
  reason: "",
  notes: null,
  status: "active",
});

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

/* ─── Styled Input ─────────────────────────────────────────────────────────── */
const StyledInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { theme: any }
> = ({ theme, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        border: `1.5px solid ${focused ? theme.primary : theme.border}`,
        boxShadow: focused
          ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12`
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition:
          "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
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
    />
  );
};

/* ─── Styled Select ────────────────────────────────────────────────────────── */
const StyledSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { theme: any }
> = ({ theme, children, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none pr-10"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          border: `1.5px solid ${focused ? theme.primary : theme.border}`,
          boxShadow: focused
            ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transition:
            "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
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
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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

/* ─── Styled Textarea ──────────────────────────────────────────────────────── */
const StyledTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { theme: any }
> = ({ theme, style, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        border: `1.5px solid ${focused ? theme.primary : theme.border}`,
        boxShadow: focused
          ? `0 0 0 3px ${theme.primary}1A, 0 2px 8px ${theme.primary}12`
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition:
          "border-color 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1)",
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
    />
  );
};

/* ─── Field Label ──────────────────────────────────────────────────────────── */
const FieldLabel: React.FC<{
  label: string;
  required?: boolean;
  theme: any;
}> = ({ label, required, theme }) => (
  <label
    className="block text-xs font-semibold uppercase tracking-wider mb-2"
    style={{ color: theme.textSecondary, letterSpacing: "0.06em" }}
  >
    {label}
    {required && (
      <span className="ml-1" style={{ color: theme.error }}>
        *
      </span>
    )}
  </label>
);

/* ─── Employment Type Badge ────────────────────────────────────────────────── */
const EmploymentTypeBadge: React.FC<{ type: string; theme: any }> = ({ type, theme }) => {
  const colors: Record<string, string> = {
    "Full Time": "#6366f1",
    "Part Time": "#10b981",
    "Contract": "#f59e0b",
    "Internship": "#06b6d4",
    "Temporary": "#ec4899",
    "Consultant": "#8b5cf6",
  };
  const color = colors[type] || theme.primary;
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {type}
    </span>
  );
};

/* ─── Work History Card ────────────────────────────────────────────────────── */
interface HistoryCardProps {
  history: CreateEmployeeWorkHistory;
  index: number;
  theme: any;
  departmentName: string;
  designationName: string;
  onEdit: () => void;
  onDelete: () => void;
  animationDelay: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  history,
  index,
  theme,
  departmentName,
  designationName,
  onEdit,
  onDelete,
  animationDelay,
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  const isCurrent = !history.endDate || history.endDate === "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setDeleteConfirm(false);
      }}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(16px) scale(0.98)",
        transition:
          "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        backgroundColor: theme.background,
        border: `1.5px solid ${hovered ? theme.primary + "55" : theme.border}`,
        boxShadow: hovered
          ? `0 6px 24px rgba(0,0,0,0.08)`
          : `0 2px 8px rgba(0,0,0,0.04)`,
        borderRadius: "16px",
        padding: "1.25rem",
      }}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)`,
              color: theme.primary,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm" style={{ color: theme.text }}>
                {designationName}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                {departmentName}
              </span>
              <EmploymentTypeBadge type={history.employmentType} theme={theme} />
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: history.status === "active" 
                    ? "#10b98118" 
                    : "#ef444418",
                  color: history.status === "active" ? "#10b981" : "#ef4444",
                }}
              >
                {history.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-1.5">
              <span className="font-bold text-sm" style={{ color: theme.success }}>
                LKR {history.salary.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-1 flex-shrink-0"
          style={{
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.2s ease",
          }}
        >
          <button
            onClick={onEdit}
            title="Edit"
            className="p-2 rounded-lg transition-all duration-200"
            style={{ color: theme.warning || "#f59e0b" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = `${theme.warning || "#f59e0b"}18`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {deleteConfirm ? (
            <button
              onClick={onDelete}
              title="Confirm delete"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 text-white"
              style={{ backgroundColor: theme.error || "#ef4444" }}
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              title="Delete"
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: theme.error || "#ef4444" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = `${theme.error || "#ef4444"}15`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div
        className="mt-3 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
          <span className="text-xs" style={{ color: theme.text }}>
            {history.startDate} — {history.endDate || "Present"}
            {isCurrent && (
              <span className="ml-2 text-xs font-medium" style={{ color: "#10b981" }}>
                (Current)
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            {history.reason}
          </span>
        </div>
        {history.notes && (
          <div className="flex items-start gap-2 sm:col-span-2 mt-1">
            <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Notes:</span>
            <span className="text-xs" style={{ color: theme.text }}>
              {history.notes}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Form Panel ──────────────────────────────────────────────────────────── */
interface FormPanelProps {
  isEditing: boolean;
  history: CreateEmployeeWorkHistory;
  theme: any;
  departments: { id: number; label: string }[];
  designations: { id: number; label: string }[];
  onChange: (h: CreateEmployeeWorkHistory) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  history,
  theme,
  departments,
  designations,
  onChange,
  onSave,
  onCancel,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    return () => setVisible(false);
  }, []);

  const isValid = history.designationId !== 0 && history.departmentId !== 0 && history.startDate && history.employmentType && history.reason;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(20px) scale(0.97)",
        transition:
          "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        backgroundColor: hexToRgba(theme.primary, 0.04),
        border: `1.5px solid ${theme.primary}30`,
        borderRadius: "16px",
        padding: "1.25rem",
      }}
    >
      {/* Form Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}25, ${theme.primary}12)`,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            <ShieldAlert className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <h4 className="font-bold text-sm" style={{ color: theme.text }}>
            {isEditing ? "Edit Work History" : "New Work History"}
          </h4>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg transition-all duration-200"
          style={{ color: theme.textSecondary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = `${theme.border}80`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Department" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={history.departmentId}
            onChange={(e) =>
              onChange({ ...history, departmentId: parseInt(e.target.value) })
            }
          >
            <option value={0}>Select department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.label}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Designation" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={history.designationId}
            onChange={(e) =>
              onChange({ ...history, designationId: parseInt(e.target.value) })
            }
          >
            <option value={0}>Select designation</option>
            {designations.map((desig) => (
              <option key={desig.id} value={desig.id}>
                {desig.label}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Employment Type" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={history.employmentType}
            onChange={(e) =>
              onChange({ ...history, employmentType: e.target.value })
            }
          >
            <option value="">Select type</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Salary (LKR)" required theme={theme} />
          <StyledInput
            theme={theme}
            type="number"
            value={history.salary}
            onChange={(e) =>
              onChange({ ...history, salary: parseFloat(e.target.value) || 0 })
            }
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div>
          <FieldLabel label="Start Date" required theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={history.startDate}
            onChange={(e) =>
              onChange({ ...history, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <FieldLabel label="End Date" theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={history.endDate}
            onChange={(e) =>
              onChange({ ...history, endDate: e.target.value })
            }
          />
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Leave empty for current position
          </p>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Reason for Change" required theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={history.reason}
            onChange={(e) =>
              onChange({ ...history, reason: e.target.value })
            }
            placeholder="e.g., Promotion, Resignation, Transfer, New Position"
          />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Additional Notes" theme={theme} />
          <StyledTextarea
            theme={theme}
            value={history.notes || ""}
            onChange={(e) =>
              onChange({ ...history, notes: e.target.value || null })
            }
            rows={3}
            placeholder="Any additional notes about this employment period..."
          />
        </div>

        <div>
          <FieldLabel label="Status" theme={theme} />
          <StyledSelect
            theme={theme}
            value={history.status}
            onChange={(e) =>
              onChange({ ...history, status: e.target.value as "active" | "inactive" })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </StyledSelect>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-5">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: theme.background,
            border: `1.5px solid ${theme.border}`,
            color: theme.textSecondary,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = theme.primary + "66")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = theme.border)
          }
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!isValid}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: isValid
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary}dd)`
              : theme.border,
            cursor: isValid ? "pointer" : "not-allowed",
            opacity: isValid ? 1 : 0.6,
            boxShadow: isValid ? `0 4px 14px ${theme.primary}40` : "none",
            transform: "scale(1)",
            transition: "box-shadow 0.2s, opacity 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            if (isValid) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isEditing ? "Save Changes" : "Add History"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const WorkHistoriesSection: React.FC<WorkHistoriesSectionProps> = ({
  histories,
  onUpdate,
  employeeCreateData,
}) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentHistory, setCurrentHistory] = useState<CreateEmployeeWorkHistory>(getEmptyHistory());

  const getDepartmentName = (id: number): string => {
    const dept = employeeCreateData?.departments?.find(d => d.id === id);
    return dept?.label || `Department ${id}`;
  };

  const getDesignationName = (id: number): string => {
    const desig = employeeCreateData?.designationTypes?.find(d => d.id === id);
    return desig?.label || `Designation ${id}`;
  };

  const handleSave = () => {
    if (!currentHistory.designationId || !currentHistory.departmentId || !currentHistory.startDate || !currentHistory.employmentType || !currentHistory.reason) return;
    if (editingIndex !== null) {
      const updated = [...histories];
      updated[editingIndex] = { ...currentHistory };
      onUpdate(updated);
    } else {
      onUpdate([...histories, { ...currentHistory }]);
    }
    setCurrentHistory(getEmptyHistory());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentHistory({ ...histories[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(histories.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentHistory(getEmptyHistory());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {histories.length === 0 && !isAdding && (
        <div
          className="flex flex-col items-center justify-center py-10 rounded-2xl text-center"
          style={{
            border: `1.5px dashed ${theme.border}`,
            backgroundColor: hexToRgba(theme.primary, 0.02),
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`,
              border: `1.5px solid ${theme.primary}22`,
            }}
          >
            <History
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No work history yet
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Add employment history, positions, and roles
          </p>
        </div>
      )}

      {/* History Cards */}
      {histories.map((history, index) => (
        <HistoryCard
          key={index}
          history={history}
          index={index}
          theme={theme}
          departmentName={getDepartmentName(history.departmentId)}
          designationName={getDesignationName(history.designationId)}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          history={currentHistory}
          theme={theme}
          departments={employeeCreateData?.departments || []}
          designations={employeeCreateData?.designationTypes || []}
          onChange={setCurrentHistory}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300"
          style={{
            borderColor: theme.border,
            color: theme.primary,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.primary;
            e.currentTarget.style.backgroundColor = hexToRgba(
              theme.primary,
              0.05,
            );
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus className="w-4 h-4" />
          Add Work History
        </button>
      )}
    </div>
  );
};