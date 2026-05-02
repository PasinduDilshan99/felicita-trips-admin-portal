// components/employees/create-employee-components/DocumentsSection.tsx (FIXED)

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Edit2, X, FileText, Upload, Check, Eye,
  ShieldCheck, Calendar, FileImage, FileSpreadsheet, FileBadge,
  ClipboardList, HardDrive
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeDocument } from "@/types/employee-types";

interface DocumentsSectionProps {
  documents: CreateEmployeeDocument[];
  onUpdate: (documents: CreateEmployeeDocument[]) => void;
  userId: number;
}

const documentTypes = [
  "ID Card", "Passport", "Driving License", "Degree Certificate",
  "Resume/CV", "Offer Letter", "Contract", "Tax Document",
  "Bank Statement", "Medical Certificate", "Other",
];

const getEmptyDocument = (userId: number): CreateEmployeeDocument => ({
  documentType: "",
  documentName: "",
  filePath: "",
  fileSize: 0,
  mimeType: "",
  expiryDate: null,
  verified: false,
  verifiedBy: null,
  verifiedDate: null,
  notes: null,
  uploadedBy: userId,
  status: "ACTIVE",
});

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0,2),16)},${parseInt(h.substring(2,4),16)},${parseInt(h.substring(4,6),16)},${opacity})`;
};

const formatFileSize = (bytes: number): string => {
  if (!bytes) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/* ─── Doc type → icon + color ──────────────────────────────────────────────── */
const docConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "ID Card":            { color: "#6366f1", icon: <FileBadge className="w-5 h-5" /> },
  "Passport":           { color: "#0ea5e9", icon: <FileBadge className="w-5 h-5" /> },
  "Driving License":    { color: "#06b6d4", icon: <FileBadge className="w-5 h-5" /> },
  "Degree Certificate": { color: "#8b5cf6", icon: <FileText className="w-5 h-5" /> },
  "Resume/CV":          { color: "#10b981", icon: <FileText className="w-5 h-5" /> },
  "Offer Letter":       { color: "#14b8a6", icon: <FileText className="w-5 h-5" /> },
  "Contract":           { color: "#f59e0b", icon: <FileText className="w-5 h-5" /> },
  "Tax Document":       { color: "#f97316", icon: <FileSpreadsheet className="w-5 h-5" /> },
  "Bank Statement":     { color: "#3b82f6", icon: <FileSpreadsheet className="w-5 h-5" /> },
  "Medical Certificate":{ color: "#ef4444", icon: <FileImage className="w-5 h-5" /> },
  "Other":              { color: "#94a3b8", icon: <FileText className="w-5 h-5" /> },
};

const getDocConfig = (type: string) => docConfig[type] ?? docConfig["Other"];

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

/* ─── Upload Zone ────────────────────────────────────────────────────────────── */
interface UploadZoneProps {
  document: CreateEmployeeDocument;
  theme: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ document, theme, fileInputRef, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasFile = !!document.documentName;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  }, [onUpload]);

  const active = dragging || hovered;

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `2px dashed ${active ? theme.primary : hasFile ? theme.primary + "55" : theme.border}`,
        borderRadius: "14px",
        padding: "1.5rem",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: active
          ? hexToRgba(theme.primary, 0.06)
          : hasFile
          ? hexToRgba(theme.primary, 0.03)
          : "transparent",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        transform: dragging ? "scale(1.01)" : "scale(1)",
      }}
    >
      <input
        ref={fileInputRef as React.RefObject<HTMLInputElement>}
        type="file"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        className="hidden"
      />

      {hasFile ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}0e)`, border: `1.5px solid ${theme.primary}33` }}>
            <FileText className="w-5 h-5" style={{ color: theme.primary }} />
          </div>
          <div>
            <p className="text-sm font-semibold truncate max-w-xs" style={{ color: theme.text }}>
              {document.documentName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {formatFileSize(document.fileSize)} · {document.mimeType || "unknown type"}
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.1), color: theme.primary }}>
            Click to replace
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`,
              border: `1.5px solid ${theme.primary}22`,
              transform: active ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
              transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}>
            <Upload className="w-5 h-5" style={{ color: theme.primary }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: theme.text }}>
              {dragging ? "Drop file here" : "Click or drag & drop"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              PDF, JPG, PNG, DOCX up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Document Card ──────────────────────────────────────────────────────────── */
interface DocCardProps {
  doc: CreateEmployeeDocument;
  theme: any;
  animationDelay: number;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
}

const DocCard: React.FC<DocCardProps> = ({ doc, theme, animationDelay, onEdit, onDelete, onVerify }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const cfg = getDocConfig(doc.documentType);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
  const expiryColor = isExpired ? "#ef4444" : "#10b981";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setDeleteConfirm(false); }}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.98)",
        transition: "opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, box-shadow 0.25s ease",
        backgroundColor: theme.background,
        border: `1.5px solid ${hovered ? cfg.color + "55" : theme.border}`,
        boxShadow: hovered ? `0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px ${cfg.color}18` : "0 2px 8px rgba(0,0,0,0.04)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}44)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s ease",
      }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: icon + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}0e)`,
                border: `1.5px solid ${cfg.color}33`,
                color: cfg.color,
                transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0deg)",
                transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {cfg.icon}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm truncate" style={{ color: theme.text }}>
                  {doc.documentName}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>
                  {doc.documentType}
                </span>
                {doc.verified && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: "#10b98118", color: "#10b981" }}>
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: doc.status === "ACTIVE" ? "#10b98118" : "#ef444418",
                    color: doc.status === "ACTIVE" ? "#10b981" : "#ef4444",
                  }}>
                  {doc.status}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                {formatFileSize(doc.fileSize)}{doc.mimeType ? ` · ${doc.mimeType.split("/")[1]?.toUpperCase()}` : ""}
              </p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 flex-shrink-0"
            style={{ opacity: hovered ? 1 : 0.35, transition: "opacity 0.2s ease" }}>
            {!doc.verified && (
              <button onClick={onVerify} title="Verify document"
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: "#10b981" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#10b98115")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Check className="w-4 h-4" />
              </button>
            )}
            {doc.filePath && (
              <a href={doc.filePath} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-200 inline-flex"
                style={{ color: theme.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.08))}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Eye className="w-4 h-4" />
              </a>
            )}
            <button onClick={onEdit}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: theme.warning || "#f59e0b" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f59e0b18")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Edit2 className="w-4 h-4" />
            </button>
            {deleteConfirm ? (
              <button onClick={onDelete}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: theme.error || "#ef4444" }}>
                Confirm
              </button>
            ) : (
              <button onClick={() => setDeleteConfirm(true)}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: theme.error || "#ef4444" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ef444418")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 pt-3 flex flex-wrap gap-3"
          style={{ borderTop: `1px solid ${theme.border}` }}>
          {doc.expiryDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" style={{ color: expiryColor }} />
              <span className="text-xs font-medium" style={{ color: expiryColor }}>
                {isExpired ? "Expired" : "Expires"} {doc.expiryDate}
              </span>
            </div>
          )}
          {doc.fileSize > 0 && (
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                {formatFileSize(doc.fileSize)}
              </span>
            </div>
          )}
          {doc.verifiedDate && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                Verified {new Date(doc.verifiedDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {doc.notes && (
          <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.04), border: `1px solid ${theme.border}` }}>
            <ClipboardList className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>{doc.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Form Panel ─────────────────────────────────────────────────────────────── */
interface FormPanelProps {
  isEditing: boolean;
  document: CreateEmployeeDocument;
  theme: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (d: CreateEmployeeDocument) => void;
  onUpload: (file: File) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing, document, theme, fileInputRef, onChange, onUpload, onSave, onCancel
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const isValid = document.documentType && document.documentName && document.filePath;

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      transition: "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
      backgroundColor: hexToRgba(theme.primary, 0.04),
      border: `1.5px solid ${theme.primary}30`,
      borderRadius: "16px",
      padding: "1.25rem",
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.primary}25, ${theme.primary}12)`, border: `1.5px solid ${theme.primary}33` }}>
            <Upload className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <h4 className="font-bold text-sm" style={{ color: theme.text }}>
            {isEditing ? "Edit Document" : "Upload Document"}
          </h4>
        </div>
        <button onClick={onCancel}
          className="p-1.5 rounded-lg transition-all duration-200"
          style={{ color: theme.textSecondary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${theme.border}80`)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Document Type" required theme={theme} />
          <StyledSelect theme={theme} value={document.documentType}
            onChange={(e) => onChange({ ...document, documentType: e.target.value })}>
            <option value="">Select type</option>
            {documentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Expiry Date" theme={theme} />
          <StyledInput theme={theme} type="date" value={document.expiryDate || ""}
            onChange={(e) => onChange({ ...document, expiryDate: e.target.value || null })} />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Upload File" required theme={theme} />
          <UploadZone document={document} theme={theme} fileInputRef={fileInputRef} onUpload={onUpload} />
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Notes" theme={theme} />
          <StyledTextarea theme={theme} rows={3} value={document.notes || ""}
            onChange={(e) => onChange({ ...document, notes: e.target.value || null })}
            placeholder="Any notes about this document..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-5">
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ backgroundColor: theme.background, border: `1.5px solid ${theme.border}`, color: theme.textSecondary }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.primary + "66")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}>
          Cancel
        </button>
        <button onClick={onSave} disabled={!isValid}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: isValid ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary}dd)` : theme.border,
            cursor: isValid ? "pointer" : "not-allowed",
            opacity: isValid ? 1 : 0.6,
            boxShadow: isValid ? `0 4px 14px ${theme.primary}40` : "none",
          }}
          onMouseEnter={(e) => { if (isValid) e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
          {isEditing ? "Save Changes" : "Upload Document"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onUpdate, userId }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentDocument, setCurrentDocument] = useState<CreateEmployeeDocument>(getEmptyDocument(userId));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCurrentDocument((prev) => ({
      ...prev,
      documentName: file.name,
      filePath: url,
      fileSize: file.size,
      mimeType: file.type,
    }));
    setPreviewUrl(url);
  };

  const handleSave = () => {
    if (!currentDocument.documentType || !currentDocument.documentName || !currentDocument.filePath) return;
    if (editingIndex !== null) {
      const updated = [...documents];
      updated[editingIndex] = { ...currentDocument, status: "ACTIVE" };
      onUpdate(updated);
    } else {
      onUpdate([...documents, { ...currentDocument, status: "ACTIVE" }]);
    }
    reset();
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentDocument({ ...documents[index] });
    setPreviewUrl(documents[index].filePath || null);
    setIsAdding(true);
  };

  const handleVerify = (index: number) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], verified: true, verifiedBy: userId, verifiedDate: new Date().toISOString() };
    onUpdate(updated);
  };

  const reset = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentDocument(getEmptyDocument(userId));
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-3">
      {/* Empty state */}
      {documents.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl text-center"
          style={{ border: `1.5px dashed ${theme.border}`, backgroundColor: hexToRgba(theme.primary, 0.02) }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`, border: `1.5px solid ${theme.primary}22` }}>
            <FileText className="w-6 h-6" style={{ color: theme.primary, opacity: 0.7 }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>No documents uploaded</p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>Upload ID, certificates, contracts and more</p>
        </div>
      )}

      {/* Document cards */}
      {documents.map((doc, index) => (
        <DocCard
          key={index}
          doc={doc}
          theme={theme}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => onUpdate(documents.filter((_, i) => i !== index))}
          onVerify={() => handleVerify(index)}
        />
      ))}

      {/* Form panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          document={currentDocument}
          theme={theme}
          fileInputRef={fileInputRef}
          onChange={setCurrentDocument}
          onUpload={handleFileUpload}
          onSave={handleSave}
          onCancel={reset}
        />
      )}

      {/* Add button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3.5 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300"
          style={{ borderColor: theme.border, color: theme.primary, backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.primary;
            e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}>
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      )}
    </div>
  );
};