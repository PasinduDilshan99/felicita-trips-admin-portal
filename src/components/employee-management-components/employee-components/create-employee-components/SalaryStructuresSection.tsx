"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  DollarSign,
  Calendar,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  CreateEmployeeSalaryStructure,
  EmployeeCreateData,
} from "@/types/employee-types";

interface SalaryStructuresSectionProps {
  structures: CreateEmployeeSalaryStructure[];
  onUpdate: (structures: CreateEmployeeSalaryStructure[]) => void;
  employeeCreateData: EmployeeCreateData;
}

const getEmptyStructure = (): CreateEmployeeSalaryStructure => ({
  componentId: 0,
  amount: 0,
  effectiveFrom: new Date().toISOString().split("T")[0],
  effectiveTo: null,
  status: "ACTIVE",
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

/* ─── Salary Component Badge ───────────────────────────────────────────────── */
const ComponentBadge: React.FC<{ componentName: string; theme: any }> = ({
  componentName,
  theme,
}) => {
  const colors: Record<string, string> = {
    "Basic Salary": "#6366f1",
    "House Rent Allowance": "#10b981",
    "Transport Allowance": "#f59e0b",
    "Medical Allowance": "#06b6d4",
    "Dearness Allowance": "#ec4899",
    "Performance Bonus": "#8b5cf6",
    "OT Allowance": "#f43f5e",
    Other: "#94a3b8",
  };
  const color = colors[componentName] || theme.primary;
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {componentName}
    </span>
  );
};

/* ─── Salary Structure Card ───────────────────────────────────────────────── */
interface StructureCardProps {
  structure: CreateEmployeeSalaryStructure;
  index: number;
  theme: any;
  componentName: string;
  onEdit: () => void;
  onDelete: () => void;
  animationDelay: number;
}

const StructureCard: React.FC<StructureCardProps> = ({
  structure,
  index,
  theme,
  componentName,
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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ComponentBadge componentName={componentName} theme={theme} />
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor:
                    structure.status === "ACTIVE" ? "#10b98118" : "#ef444418",
                  color: structure.status === "ACTIVE" ? "#10b981" : "#ef4444",
                }}
              >
                {structure.status}
              </span>
            </div>
            <div className="mt-1.5">
              <span
                className="font-bold text-sm"
                style={{ color: theme.success }}
              >
                LKR {structure.amount.toLocaleString()}
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
          <Calendar
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: theme.primary }}
          />
          <span className="text-xs" style={{ color: theme.text }}>
            From: {structure.effectiveFrom}
          </span>
        </div>
        {structure.effectiveTo && (
          <div className="flex items-center gap-2">
            <Calendar
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: theme.textSecondary }}
            />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              To: {structure.effectiveTo}
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
  structure: CreateEmployeeSalaryStructure;
  theme: any;
  salaryComponents: { id: number; label: string }[];
  onChange: (s: CreateEmployeeSalaryStructure) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  structure,
  theme,
  salaryComponents,
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

  const isValid =
    structure.componentId !== 0 &&
    structure.amount > 0 &&
    structure.effectiveFrom;

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
            {isEditing ? "Edit Salary Structure" : "New Salary Structure"}
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
          <FieldLabel label="Salary Component" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={structure.componentId}
            onChange={(e) =>
              onChange({ ...structure, componentId: parseInt(e.target.value) })
            }
          >
            <option value={0}>Select component</option>
            {salaryComponents.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.label}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Amount (LKR)" required theme={theme} />
          <StyledInput
            theme={theme}
            type="number"
            value={structure.amount}
            onChange={(e) =>
              onChange({
                ...structure,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div>
          <FieldLabel label="Effective From" required theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={structure.effectiveFrom}
            onChange={(e) =>
              onChange({ ...structure, effectiveFrom: e.target.value })
            }
          />
        </div>

        <div>
          <FieldLabel label="Effective To" theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={structure.effectiveTo || ""}
            onChange={(e) =>
              onChange({ ...structure, effectiveTo: e.target.value || null })
            }
          />
        </div>

        <div>
          <FieldLabel label="Status" theme={theme} />
          <StyledSelect
            theme={theme}
            value={structure.status}
            onChange={(e) =>
              onChange({
                ...structure,
                status: e.target.value as "ACTIVE" | "INACTIVE",
              })
            }
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
          {isEditing ? "Save Changes" : "Add Structure"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const SalaryStructuresSection: React.FC<
  SalaryStructuresSectionProps
> = ({ structures, onUpdate, employeeCreateData }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentStructure, setCurrentStructure] =
    useState<CreateEmployeeSalaryStructure>(getEmptyStructure());

  const getComponentName = (componentId: number): string => {
    const component = employeeCreateData?.salaryComponents?.find(
      (c) => c.id === componentId,
    );
    return component?.label || `Component ${componentId}`;
  };

  const handleSave = () => {
    if (
      !currentStructure.componentId ||
      currentStructure.amount <= 0 ||
      !currentStructure.effectiveFrom
    )
      return;
    if (editingIndex !== null) {
      const updated = [...structures];
      updated[editingIndex] = { ...currentStructure };
      onUpdate(updated);
    } else {
      onUpdate([...structures, { ...currentStructure }]);
    }
    setCurrentStructure(getEmptyStructure());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentStructure({ ...structures[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(structures.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentStructure(getEmptyStructure());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {structures.length === 0 && !isAdding && (
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
            <TrendingUp
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No salary structures yet
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Add salary components with amounts and effective dates
          </p>
        </div>
      )}

      {/* Structure Cards */}
      {structures.map((structure, index) => (
        <StructureCard
          key={index}
          structure={structure}
          index={index}
          theme={theme}
          componentName={getComponentName(structure.componentId)}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          structure={currentStructure}
          theme={theme}
          salaryComponents={employeeCreateData?.salaryComponents || []}
          onChange={setCurrentStructure}
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
          Add Salary Structure
        </button>
      )}
    </div>
  );
};
