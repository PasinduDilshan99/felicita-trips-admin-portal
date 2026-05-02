"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, X, Laptop, Monitor, Smartphone,
  Printer, Package, Tag, Hash, Calendar, ClipboardList, Cpu
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeAsset, EmployeeCreateData } from "@/types/employee-types";

interface AssetsSectionProps {
  assets: CreateEmployeeAsset[];
  onUpdate: (assets: CreateEmployeeAsset[]) => void;
  employeeCreateData: EmployeeCreateData;
}

const assetTypes = ["Laptop", "Desktop", "Monitor", "Keyboard", "Mouse", "Printer", "Scanner", "Phone", "Tablet", "Other"];

const conditions = ["New", "Excellent", "Good", "Fair", "Poor"];

const getEmptyAsset = (): CreateEmployeeAsset => ({
  assetType: "",
  assetId: null,
  assetName: "",
  serialNumber: "",
  model: "",
  assignedDate: new Date().toISOString().split("T")[0],
  returnDate: null,
  conditionOnAssignment: null,
  conditionOnReturn: null,
  notes: null,
  assignedBy: 0,
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

/* ─── Asset type config ─────────────────────────────────────────────────────── */
const assetConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  laptop:   { icon: <Laptop className="w-5 h-5" />,     color: "#6366f1" },
  desktop:  { icon: <Monitor className="w-5 h-5" />,    color: "#0ea5e9" },
  monitor:  { icon: <Monitor className="w-5 h-5" />,    color: "#06b6d4" },
  phone:    { icon: <Smartphone className="w-5 h-5" />, color: "#10b981" },
  tablet:   { icon: <Smartphone className="w-5 h-5" />, color: "#14b8a6" },
  printer:  { icon: <Printer className="w-5 h-5" />,    color: "#f59e0b" },
  scanner:  { icon: <Printer className="w-5 h-5" />,    color: "#f97316" },
  keyboard: { icon: <Cpu className="w-5 h-5" />,        color: "#8b5cf6" },
  mouse:    { icon: <Cpu className="w-5 h-5" />,        color: "#a78bfa" },
  other:    { icon: <Package className="w-5 h-5" />,    color: "#94a3b8" },
};

const getAssetConfig = (type: string) =>
  assetConfig[type.toLowerCase()] ?? assetConfig.other;

/* ─── Condition badge ────────────────────────────────────────────────────────── */
const conditionColors: Record<string, { bg: string; text: string }> = {
  New:       { bg: "#10b98120", text: "#10b981" },
  Excellent: { bg: "#06b6d420", text: "#06b6d4" },
  Good:      { bg: "#6366f120", text: "#6366f1" },
  Fair:      { bg: "#f59e0b20", text: "#f59e0b" },
  Poor:      { bg: "#ef444420", text: "#ef4444" },
};

const ConditionBadge: React.FC<{ condition: string }> = ({ condition }) => {
  const c = conditionColors[condition] ?? { bg: "#94a3b820", text: "#94a3b8" };
  return (
    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {condition}
    </span>
  );
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
          stroke={focused ? theme.primary : theme.textSecondary} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
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
    {label}
    {required && <span className="ml-1" style={{ color: theme.error }}>*</span>}
  </label>
);

/* ─── Asset Card ─────────────────────────────────────────────────────────────── */
interface AssetCardProps {
  asset: CreateEmployeeAsset;
  theme: any;
  animationDelay: number;
  onEdit: () => void;
  onDelete: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, theme, animationDelay, onEdit, onDelete }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const cfg = getAssetConfig(asset.assetType);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

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
      {/* Top accent bar */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}55)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s ease",
      }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon badge */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}0e)`,
                border: `1.5px solid ${cfg.color}33`,
                color: cfg.color,
                transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0deg)",
              }}
            >
              {cfg.icon}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm truncate" style={{ color: theme.text }}>
                  {asset.assetName}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>
                  {asset.assetType}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: asset.status === "ACTIVE" ? "#10b98118" : "#ef444418",
                    color: asset.status === "ACTIVE" ? "#10b981" : "#ef4444",
                  }}>
                  {asset.status}
                </span>
              </div>
              {asset.model && (
                <p className="text-xs mt-0.5 truncate" style={{ color: theme.textSecondary }}>
                  {asset.model}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0"
            style={{ opacity: hovered ? 1 : 0.35, transition: "opacity 0.2s ease" }}>
            <button onClick={onEdit}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: theme.warning || "#f59e0b" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f59e0b18")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Edit2 className="w-4 h-4" />
            </button>
            {deleteConfirm ? (
              <button onClick={onDelete}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
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

        {/* Info Grid */}
        <div className="mt-3 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5"
          style={{ borderTop: `1px solid ${theme.border}` }}>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Hash className="w-3 h-3" /> Serial
            </span>
            <span className="text-xs font-mono font-semibold truncate" style={{ color: theme.text }}>
              {asset.serialNumber}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Calendar className="w-3 h-3" /> Assigned
            </span>
            <span className="text-xs" style={{ color: theme.text }}>
              {asset.assignedDate}
            </span>
          </div>

          {asset.conditionOnAssignment && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Tag className="w-3 h-3" /> Condition
              </span>
              <ConditionBadge condition={asset.conditionOnAssignment} />
            </div>
          )}

          {asset.returnDate && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium flex items-center gap-1" style={{ color: theme.textSecondary }}>
                <Calendar className="w-3 h-3" /> Return
              </span>
              <span className="text-xs" style={{ color: theme.text }}>
                {asset.returnDate}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {asset.notes && (
          <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: hexToRgba(theme.primary, 0.04), border: `1px solid ${theme.border}` }}>
            <ClipboardList className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>{asset.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Form Panel ─────────────────────────────────────────────────────────────── */
interface FormPanelProps {
  isEditing: boolean;
  asset: CreateEmployeeAsset;
  theme: any;
  onChange: (a: CreateEmployeeAsset) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({ isEditing, asset, theme, onChange, onSave, onCancel }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const isValid = asset.assetType && asset.assetName && asset.serialNumber;

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
            <Package className="w-4 h-4" style={{ color: theme.primary }} />
          </div>
          <h4 className="font-bold text-sm" style={{ color: theme.text }}>
            {isEditing ? "Edit Asset" : "New Asset"}
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

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label="Asset Type" required theme={theme} />
          <StyledSelect theme={theme} value={asset.assetType}
            onChange={(e) => onChange({ ...asset, assetType: e.target.value })}>
            <option value="">Select type</option>
            {assetTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Asset Name" required theme={theme} />
          <StyledInput theme={theme} type="text" value={asset.assetName}
            onChange={(e) => onChange({ ...asset, assetName: e.target.value })}
            placeholder="e.g., MacBook Pro 14-inch" />
        </div>

        <div>
          <FieldLabel label="Serial Number" required theme={theme} />
          <StyledInput theme={theme} type="text" value={asset.serialNumber}
            onChange={(e) => onChange({ ...asset, serialNumber: e.target.value })}
            placeholder="e.g., C02XG0JHJGH6"
            style={{ fontFamily: "monospace", letterSpacing: "0.04em" }} />
        </div>

        <div>
          <FieldLabel label="Model" theme={theme} />
          <StyledInput theme={theme} type="text" value={asset.model}
            onChange={(e) => onChange({ ...asset, model: e.target.value })}
            placeholder="e.g., A2442" />
        </div>

        <div>
          <FieldLabel label="Assigned Date" required theme={theme} />
          <StyledInput theme={theme} type="date" value={asset.assignedDate}
            onChange={(e) => onChange({ ...asset, assignedDate: e.target.value })} />
        </div>

        <div>
          <FieldLabel label="Return Date" theme={theme} />
          <StyledInput theme={theme} type="date" value={asset.returnDate || ""}
            onChange={(e) => onChange({ ...asset, returnDate: e.target.value || null })} />
        </div>

        <div>
          <FieldLabel label="Condition on Assignment" theme={theme} />
          <StyledSelect theme={theme} value={asset.conditionOnAssignment || ""}
            onChange={(e) => onChange({ ...asset, conditionOnAssignment: e.target.value || null })}>
            <option value="">Select condition</option>
            {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
          </StyledSelect>
        </div>

        <div className="sm:col-span-2">
          <FieldLabel label="Notes" theme={theme} />
          <StyledTextarea theme={theme} rows={3} value={asset.notes || ""}
            onChange={(e) => onChange({ ...asset, notes: e.target.value || null })}
            placeholder="Any additional notes about this asset..." />
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
          {isEditing ? "Save Changes" : "Add Asset"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────────── */
export const AssetsSection: React.FC<AssetsSectionProps> = ({ assets, onUpdate, employeeCreateData }) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentAsset, setCurrentAsset] = useState<CreateEmployeeAsset>(getEmptyAsset());

  const handleSave = () => {
    if (!currentAsset.assetType || !currentAsset.assetName || !currentAsset.serialNumber) return;
    if (editingIndex !== null) {
      const updated = [...assets];
      updated[editingIndex] = { ...currentAsset, status: "ACTIVE" };
      onUpdate(updated);
    } else {
      onUpdate([...assets, { ...currentAsset, status: "ACTIVE" }]);
    }
    setCurrentAsset(getEmptyAsset());
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentAsset({ ...assets[index] });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentAsset(getEmptyAsset());
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {assets.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl text-center"
          style={{ border: `1.5px dashed ${theme.border}`, backgroundColor: hexToRgba(theme.primary, 0.02) }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: `linear-gradient(135deg, ${theme.primary}18, ${theme.primary}08)`, border: `1.5px solid ${theme.primary}22` }}>
            <Package className="w-6 h-6" style={{ color: theme.primary, opacity: 0.7 }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>No assets assigned</p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>Assign equipment, devices, or any company assets</p>
        </div>
      )}

      {/* Asset Cards */}
      {assets.map((asset, index) => (
        <AssetCard
          key={index}
          asset={asset}
          theme={theme}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => onUpdate(assets.filter((_, i) => i !== index))}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          asset={currentAsset}
          theme={theme}
          onChange={setCurrentAsset}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Add Button */}
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
          Add Asset
        </button>
      )}
    </div>
  );
};