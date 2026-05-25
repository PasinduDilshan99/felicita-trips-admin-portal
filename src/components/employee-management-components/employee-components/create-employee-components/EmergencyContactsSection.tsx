"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Phone,
  Mail,
  MapPin,
  Users,
  Star,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeEmergencyContact } from "@/types/employee-types";

interface EmergencyContactsSectionProps {
  contacts: CreateEmployeeEmergencyContact[];
  onUpdate: (contacts: CreateEmployeeEmergencyContact[]) => void;
}

const getEmptyContact = (): CreateEmployeeEmergencyContact => ({
  contactName: "",
  relationship: "",
  primaryPhone: "",
  secondaryPhone: null,
  email: "",
  address: null,
  isPrimary: false,
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

/* ─── Icon Badge ───────────────────────────────────────────────────────────── */
const RelationshipBadge: React.FC<{ relationship: string; theme: any }> = ({
  relationship,
  theme,
}) => {
  const colors: Record<string, string> = {
    Father: "#6366f1",
    Mother: "#ec4899",
    Spouse: "#f43f5e",
    Sibling: "#8b5cf6",
    Friend: "#06b6d4",
    Relative: "#14b8a6",
    Other: "#94a3b8",
  };
  const color = colors[relationship] || theme.primary;
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {relationship}
    </span>
  );
};

/* ─── Contact Card ─────────────────────────────────────────────────────────── */
interface ContactCardProps {
  contact: CreateEmployeeEmergencyContact;
  index: number;
  theme: any;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
  animationDelay: number;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  index,
  theme,
  onEdit,
  onDelete,
  onSetPrimary,
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
        border: `1.5px solid ${contact.isPrimary ? theme.primary : hovered ? theme.primary + "44" : theme.border}`,
        boxShadow: contact.isPrimary
          ? `0 4px 20px ${theme.primary}18, 0 0 0 1px ${theme.primary}22`
          : hovered
            ? `0 6px 24px rgba(0,0,0,0.08)`
            : `0 2px 8px rgba(0,0,0,0.04)`,
        borderRadius: "16px",
        padding: "1.25rem",
      }}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)`,
              color: theme.primary,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            {contact.contactName.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-bold text-sm truncate"
                style={{ color: theme.text }}
              >
                {contact.contactName}
              </span>
              {contact.isPrimary && (
                <span
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${theme.primary}18`,
                    color: theme.primary,
                  }}
                >
                  <Star className="w-3 h-3" fill="currentColor" />
                  Primary
                </span>
              )}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor:
                    contact.status === "ACTIVE" ? "#10b98118" : "#ef444418",
                  color: contact.status === "ACTIVE" ? "#10b981" : "#ef4444",
                }}
              >
                {contact.status}
              </span>
            </div>
            {contact.relationship && (
              <div className="mt-1">
                <RelationshipBadge
                  relationship={contact.relationship}
                  theme={theme}
                />
              </div>
            )}
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
          {!contact.isPrimary && (
            <button
              onClick={onSetPrimary}
              title="Set as primary"
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: theme.primary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = `${theme.primary}15`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Star className="w-4 h-4" />
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
      <div
        className="mt-3 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Phone
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: theme.primary }}
          />
          <span className="text-xs truncate" style={{ color: theme.text }}>
            {contact.primaryPhone}
          </span>
        </div>
        {contact.secondaryPhone && (
          <div className="flex items-center gap-2">
            <Phone
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: theme.textSecondary }}
            />
            <span
              className="text-xs truncate"
              style={{ color: theme.textSecondary }}
            >
              {contact.secondaryPhone}
            </span>
          </div>
        )}
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: theme.primary }}
            />
            <span className="text-xs truncate" style={{ color: theme.text }}>
              {contact.email}
            </span>
          </div>
        )}
        {contact.address && (
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: theme.textSecondary }}
            />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              {contact.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Add / Edit Form ──────────────────────────────────────────────────────── */
interface FormPanelProps {
  isEditing: boolean;
  contact: CreateEmployeeEmergencyContact;
  theme: any;
  onChange: (c: CreateEmployeeEmergencyContact) => void;
  onSave: () => void;
  onCancel: () => void;
}

const relationships = [
  "Father",
  "Mother",
  "Spouse",
  "Sibling",
  "Friend",
  "Relative",
  "Other",
];

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  contact,
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

  const isValid =
    contact.contactName && contact.relationship && contact.primaryPhone;

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
            {isEditing ? "Edit Emergency Contact" : "New Emergency Contact"}
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
          <FieldLabel label="Contact Name" required theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={contact.contactName}
            onChange={(e) =>
              onChange({ ...contact, contactName: e.target.value })
            }
            placeholder="Full name"
          />
        </div>

        <div>
          <FieldLabel label="Relationship" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={contact.relationship}
            onChange={(e) =>
              onChange({ ...contact, relationship: e.target.value })
            }
          >
            <option value="">Select relationship</option>
            {relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Primary Phone" required theme={theme} />
          <StyledInput
            theme={theme}
            type="tel"
            value={contact.primaryPhone}
            onChange={(e) =>
              onChange({ ...contact, primaryPhone: e.target.value })
            }
            placeholder="+94 77 000 0000"
          />
        </div>

        <div>
          <FieldLabel label="Secondary Phone" theme={theme} />
          <StyledInput
            theme={theme}
            type="tel"
            value={contact.secondaryPhone || ""}
            onChange={(e) =>
              onChange({ ...contact, secondaryPhone: e.target.value || null })
            }
            placeholder="Optional"
          />
        </div>

        <div>
          <FieldLabel label="Email" theme={theme} />
          <StyledInput
            theme={theme}
            type="email"
            value={contact.email}
            onChange={(e) => onChange({ ...contact, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <FieldLabel label="Address" theme={theme} />
          <StyledTextarea
            theme={theme}
            value={contact.address || ""}
            onChange={(e) =>
              onChange({ ...contact, address: e.target.value || null })
            }
            rows={3}
            placeholder="Street, city, district..."
          />
        </div>

        {/* Primary toggle */}
        <div className="sm:col-span-2">
          <label
            className="flex items-center gap-3 cursor-pointer group"
            style={{ userSelect: "none" }}
          >
            <div
              className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: contact.isPrimary
                  ? theme.primary
                  : theme.border,
                boxShadow: contact.isPrimary
                  ? `0 0 0 3px ${theme.primary}22`
                  : "none",
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                style={{
                  left: contact.isPrimary ? "calc(100% - 20px)" : "4px",
                }}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={contact.isPrimary}
                onChange={(e) =>
                  onChange({ ...contact, isPrimary: e.target.checked })
                }
              />
            </div>
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              Set as <strong style={{ color: theme.text }}>primary</strong>{" "}
              emergency contact
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
          {isEditing ? "Save Changes" : "Add Contact"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export const EmergencyContactsSection: React.FC<
  EmergencyContactsSectionProps
> = ({ contacts, onUpdate }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentContact, setCurrentContact] =
    useState<CreateEmployeeEmergencyContact>(getEmptyContact());

  const handleSave = () => {
    if (
      !currentContact.contactName ||
      !currentContact.relationship ||
      !currentContact.primaryPhone
    )
      return;
    if (editingIndex !== null) {
      const updated = [...contacts];
      updated[editingIndex] = { ...currentContact, status: "ACTIVE" };
      onUpdate(updated);
    } else {
      onUpdate([...contacts, { ...currentContact, status: "ACTIVE" }]);
    }
    setCurrentContact(getEmptyContact());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentContact({ ...contacts[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(contacts.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    onUpdate(contacts.map((c, i) => ({ ...c, isPrimary: i === index })));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentContact(getEmptyContact());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {contacts.length === 0 && !isAdding && (
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
            <ShieldAlert
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No emergency contacts yet
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Add at least one contact for safety
          </p>
        </div>
      )}

      {/* Contact Cards */}
      {contacts.map((contact, index) => (
        <ContactCard
          key={index}
          contact={contact}
          index={index}
          theme={theme}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
          onSetPrimary={() => handleSetPrimary(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          contact={currentContact}
          theme={theme}
          onChange={setCurrentContact}
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
          Add Emergency Contact
        </button>
      )}
    </div>
  );
};
