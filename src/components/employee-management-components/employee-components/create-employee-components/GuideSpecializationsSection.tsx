"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, X, Compass, Star, Globe, Languages, Award, ShieldAlert } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeGuideSpecialization } from "@/types/employee-types";

interface GuideSpecializationsSectionProps {
  specializations: CreateEmployeeGuideSpecialization[];
  onUpdate: (specializations: CreateEmployeeGuideSpecialization[]) => void;
}

const specializationTypes = ["Cultural", "Historical", "Adventure", "Nature", "Wildlife", "Food", "Religious", "Shopping", "Medical"];
const languagesList = ["English", "Sinhala", "Tamil", "French", "German", "Spanish", "Italian", "Russian", "Japanese", "Chinese", "Korean", "Arabic"];

const getEmptySpecialization = (): CreateEmployeeGuideSpecialization => ({
  specializationType: "",
  regions: "",
  languages: "",
  certifications: "",
  experienceYears: 0,
  rating: 0,
  isAvailable: true,
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

/* ─── Specialization Type Badge ───────────────────────────────────────────── */
const TypeBadge: React.FC<{ type: string; theme: any }> = ({ type, theme }) => {
  const colors: Record<string, string> = {
    Cultural: "#8b5cf6",
    Historical: "#6366f1",
    Adventure: "#f59e0b",
    Nature: "#10b981",
    Wildlife: "#06b6d4",
    Food: "#ec4899",
    Religious: "#a855f7",
    Shopping: "#f97316",
    Medical: "#14b8a6",
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

/* ─── Stars Rating ─────────────────────────────────────────────────────────── */
const StarsRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array(5).fill(0).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{ 
            color: i < Math.floor(rating) ? "#fbbf24" : "#d1d5db", 
            fill: i < Math.floor(rating) ? "#fbbf24" : "none" 
          }}
        />
      ))}
      <span className="text-xs ml-1" style={{ opacity: 0.7 }}>
        ({rating})
      </span>
    </div>
  );
};

/* ─── Specialization Card ─────────────────────────────────────────────────── */
interface SpecializationCardProps {
  specialization: CreateEmployeeGuideSpecialization;
  index: number;
  theme: any;
  onEdit: () => void;
  onDelete: () => void;
  animationDelay: number;
}

const SpecializationCard: React.FC<SpecializationCardProps> = ({
  specialization,
  index,
  theme,
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
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={specialization.specializationType} theme={theme} />
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: specialization.isAvailable 
                    ? "#10b98118" 
                    : "#ef444418",
                  color: specialization.isAvailable ? "#10b981" : "#ef4444",
                }}
              >
                {specialization.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="mt-1.5">
              <StarsRating rating={specialization.rating} />
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
          <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
          <span className="text-xs" style={{ color: theme.text }}>
            {specialization.regions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
          <span className="text-xs" style={{ color: theme.text }}>
            {specialization.languages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            {specialization.experienceYears} years experience
          </span>
        </div>
        {specialization.certifications && (
          <div className="flex items-center gap-2 sm:col-span-2">
            <Award className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              {specialization.certifications}
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
  specialization: CreateEmployeeGuideSpecialization;
  theme: any;
  onChange: (s: CreateEmployeeGuideSpecialization) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  specialization,
  theme,
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

  const isValid = specialization.specializationType && specialization.regions && specialization.languages;

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
            {isEditing ? "Edit Guide Specialization" : "New Guide Specialization"}
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
          <FieldLabel label="Specialization Type" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={specialization.specializationType}
            onChange={(e) =>
              onChange({ ...specialization, specializationType: e.target.value })
            }
          >
            <option value="">Select type</option>
            {specializationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Regions" required theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={specialization.regions}
            onChange={(e) =>
              onChange({ ...specialization, regions: e.target.value })
            }
            placeholder="e.g., Colombo, Kandy, Galle"
          />
        </div>

        <div>
          <FieldLabel label="Languages" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={specialization.languages}
            onChange={(e) =>
              onChange({ ...specialization, languages: e.target.value })
            }
          >
            <option value="">Select language</option>
            {languagesList.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Experience (Years)" theme={theme} />
          <StyledInput
            theme={theme}
            type="number"
            value={specialization.experienceYears}
            onChange={(e) =>
              onChange({ ...specialization, experienceYears: parseInt(e.target.value) || 0 })
            }
            min="0"
            max="50"
            placeholder="0"
          />
        </div>

        <div>
          <FieldLabel label="Rating (0-5)" theme={theme} />
          <StyledInput
            theme={theme}
            type="number"
            value={specialization.rating}
            onChange={(e) =>
              onChange({ ...specialization, rating: parseFloat(e.target.value) || 0 })
            }
            min="0"
            max="5"
            step="0.1"
            placeholder="0"
          />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Certifications" theme={theme} />
          <StyledTextarea
            theme={theme}
            value={specialization.certifications}
            onChange={(e) =>
              onChange({ ...specialization, certifications: e.target.value })
            }
            rows={3}
            placeholder="e.g., Certified Tour Guide License, First Aid Certified, etc."
          />
        </div>

        {/* Availability toggle */}
        <div className="sm:col-span-2">
          <label
            className="flex items-center gap-3 cursor-pointer group"
            style={{ userSelect: "none" }}
          >
            <div
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: specialization.isAvailable
                  ? theme.primary
                  : theme.border,
                boxShadow: specialization.isAvailable
                  ? `0 0 0 3px ${theme.primary}22`
                  : "none",
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                style={{
                  left: specialization.isAvailable ? "calc(100% - 20px)" : "4px",
                }}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={specialization.isAvailable}
                onChange={(e) =>
                  onChange({ ...specialization, isAvailable: e.target.checked })
                }
              />
            </div>
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              Currently <strong style={{ color: theme.text }}>available</strong> for guiding
            </span>
          </label>
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
          {isEditing ? "Save Changes" : "Add Specialization"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const GuideSpecializationsSection: React.FC<GuideSpecializationsSectionProps> = ({
  specializations,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentSpecialization, setCurrentSpecialization] = useState<CreateEmployeeGuideSpecialization>(getEmptySpecialization());

  const handleSave = () => {
    if (!currentSpecialization.specializationType || !currentSpecialization.regions || !currentSpecialization.languages) return;
    if (editingIndex !== null) {
      const updated = [...specializations];
      updated[editingIndex] = { ...currentSpecialization };
      onUpdate(updated);
    } else {
      onUpdate([...specializations, { ...currentSpecialization }]);
    }
    setCurrentSpecialization(getEmptySpecialization());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentSpecialization({ ...specializations[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(specializations.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentSpecialization(getEmptySpecialization());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {specializations.length === 0 && !isAdding && (
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
            <Compass
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No guide specializations yet
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Add specializations to highlight guiding expertise
          </p>
        </div>
      )}

      {/* Specialization Cards */}
      {specializations.map((specialization, index) => (
        <SpecializationCard
          key={index}
          specialization={specialization}
          index={index}
          theme={theme}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          specialization={currentSpecialization}
          theme={theme}
          onChange={setCurrentSpecialization}
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
          Add Guide Specialization
        </button>
      )}
    </div>
  );
};