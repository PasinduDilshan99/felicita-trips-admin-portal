"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, X, Award, Star, CheckCircle, ShieldAlert } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeSkill } from "@/types/employee-types";

interface SkillsSectionProps {
  skills: CreateEmployeeSkill[];
  onUpdate: (skills: CreateEmployeeSkill[]) => void;
}

const proficiencyLevels = ["beginner", "intermediate", "advanced", "expert"];
const skillCategories = ["Technical", "Soft Skills", "Language", "Management", "Creative", "Other"];

const getEmptySkill = (): CreateEmployeeSkill => ({
  skillName: "",
  skillCategory: "",
  proficiencyLevel: "intermediate",
  certification: null,
  certifiedDate: null,
  expiryDate: null,
  verified: false,
  verifiedBy: null,
  verifiedDate: null,
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

/* ─── Skill Category Badge ─────────────────────────────────────────────────── */
const CategoryBadge: React.FC<{ category: string; theme: any }> = ({ category, theme }) => {
  const colors: Record<string, string> = {
    "Technical": "#6366f1",
    "Soft Skills": "#10b981",
    "Language": "#06b6d4",
    "Management": "#f59e0b",
    "Creative": "#ec4899",
    "Other": "#94a3b8",
  };
  const color = colors[category] || theme.primary;
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {category}
    </span>
  );
};

/* ─── Proficiency Stars ────────────────────────────────────────────────────── */
const ProficiencyStars: React.FC<{ level: string }> = ({ level }) => {
  const levelIndex = proficiencyLevels.indexOf(level);
  return (
    <div className="flex items-center gap-0.5">
      {Array(4).fill(0).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{ 
            color: i <= levelIndex ? "#fbbf24" : "#d1d5db", 
            fill: i <= levelIndex ? "#fbbf24" : "none" 
          }}
        />
      ))}
    </div>
  );
};

/* ─── Skill Card ───────────────────────────────────────────────────────────── */
interface SkillCardProps {
  skill: CreateEmployeeSkill;
  index: number;
  theme: any;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
  animationDelay: number;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  index,
  theme,
  onEdit,
  onDelete,
  onVerify,
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
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm" style={{ color: theme.text }}>
                {skill.skillName}
              </span>
              <CategoryBadge category={skill.skillCategory} theme={theme} />
              {skill.verified && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
                  style={{
                    backgroundColor: "#10b98118",
                    color: "#10b981",
                  }}
                >
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <ProficiencyStars level={skill.proficiencyLevel} />
              <span className="text-xs capitalize" style={{ color: theme.textSecondary }}>
                {skill.proficiencyLevel}
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
          {!skill.verified && (
            <button
              onClick={onVerify}
              title="Verify skill"
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: "#10b981" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#10b98118")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
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
      {(skill.certification || skill.certifiedDate || skill.expiryDate) && (
        <div
          className="mt-3 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          style={{ borderTop: `1px solid ${theme.border}` }}
        >
          {skill.certification && (
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
              <span className="text-xs truncate" style={{ color: theme.text }}>
                {skill.certification}
              </span>
            </div>
          )}
          {skill.certifiedDate && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Certified:</span>
              <span className="text-xs" style={{ color: theme.text }}>
                {skill.certifiedDate}
              </span>
            </div>
          )}
          {skill.expiryDate && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Expires:</span>
              <span className="text-xs" style={{ color: theme.text }}>
                {skill.expiryDate}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Verification Info */}
      {skill.verified && skill.verifiedDate && (
        <div
          className="mt-2.5 pt-2 flex items-center gap-2"
          style={{ borderTop: `1px solid ${theme.border}` }}
        >
          <CheckCircle className="w-3 h-3" style={{ color: "#10b981" }} />
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Verified on {new Date(skill.verifiedDate).toLocaleDateString()}
            {skill.verifiedBy && ` by ${skill.verifiedBy}`}
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Form Panel ──────────────────────────────────────────────────────────── */
interface FormPanelProps {
  isEditing: boolean;
  skill: CreateEmployeeSkill;
  theme: any;
  onChange: (s: CreateEmployeeSkill) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  skill,
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

  const isValid = skill.skillName && skill.skillCategory;

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
            {isEditing ? "Edit Skill" : "New Skill"}
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
          <FieldLabel label="Skill Name" required theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={skill.skillName}
            onChange={(e) =>
              onChange({ ...skill, skillName: e.target.value })
            }
            placeholder="e.g., JavaScript, Leadership, Spanish"
          />
        </div>

        <div>
          <FieldLabel label="Skill Category" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={skill.skillCategory}
            onChange={(e) =>
              onChange({ ...skill, skillCategory: e.target.value })
            }
          >
            <option value="">Select category</option>
            {skillCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Proficiency Level" theme={theme} />
          <StyledSelect
            theme={theme}
            value={skill.proficiencyLevel}
            onChange={(e) =>
              onChange({ ...skill, proficiencyLevel: e.target.value as any })
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Certification" theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={skill.certification || ""}
            onChange={(e) =>
              onChange({ ...skill, certification: e.target.value || null })
            }
            placeholder="Certification name"
          />
        </div>

        <div>
          <FieldLabel label="Certified Date" theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={skill.certifiedDate || ""}
            onChange={(e) =>
              onChange({ ...skill, certifiedDate: e.target.value || null })
            }
          />
        </div>

        <div>
          <FieldLabel label="Expiry Date" theme={theme} />
          <StyledInput
            theme={theme}
            type="date"
            value={skill.expiryDate || ""}
            onChange={(e) =>
              onChange({ ...skill, expiryDate: e.target.value || null })
            }
          />
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
          {isEditing ? "Save Changes" : "Add Skill"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentSkill, setCurrentSkill] = useState<CreateEmployeeSkill>(getEmptySkill());

  const handleSave = () => {
    if (!currentSkill.skillName || !currentSkill.skillCategory) return;
    if (editingIndex !== null) {
      const updated = [...skills];
      updated[editingIndex] = { ...currentSkill };
      onUpdate(updated);
    } else {
      onUpdate([...skills, { ...currentSkill }]);
    }
    setCurrentSkill(getEmptySkill());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentSkill({ ...skills[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(skills.filter((_, i) => i !== index));
  };

  const handleVerify = (index: number) => {
    const updated = [...skills];
    updated[index] = {
      ...updated[index],
      verified: true,
      verifiedDate: new Date().toISOString(),
    };
    onUpdate(updated);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentSkill(getEmptySkill());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {skills.length === 0 && !isAdding && (
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
            <Award
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No skills added yet
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Add technical skills, languages, or soft skills
          </p>
        </div>
      )}

      {/* Skill Cards */}
      {skills.map((skill, index) => (
        <SkillCard
          key={index}
          skill={skill}
          index={index}
          theme={theme}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
          onVerify={() => handleVerify(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          skill={currentSkill}
          theme={theme}
          onChange={setCurrentSkill}
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
          Add Skill
        </button>
      )}
    </div>
  );
};