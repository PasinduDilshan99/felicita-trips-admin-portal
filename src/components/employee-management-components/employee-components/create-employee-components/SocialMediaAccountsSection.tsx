"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, X, Share2, Globe, Users, CheckCircle, Instagram, Facebook, Twitter, Linkedin, Youtube, Github, Star, ShieldAlert } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CreateEmployeeSocialMediaAccount, EmployeeCreateData } from "@/types/employee-types";

interface SocialMediaAccountsSectionProps {
  accounts: CreateEmployeeSocialMediaAccount[];
  onUpdate: (accounts: CreateEmployeeSocialMediaAccount[]) => void;
  employeeCreateData: EmployeeCreateData;
  userId: number;
}

const getEmptyAccount = (userId: number): CreateEmployeeSocialMediaAccount => ({
  platformId: 0,
  username: "",
  profileUrl: "",
  followerCount: 0,
  isPrimary: false,
  isPublic: true,
  verified: false,
  verifiedBy: null,
  verifiedDate: null,
  lastUpdated: new Date().toISOString(),
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

// Platform icons mapping
const getPlatformIcon = (platformName: string) => {
  const name = platformName.toLowerCase();
  if (name.includes("facebook")) return <Facebook className="w-5 h-5" />;
  if (name.includes("instagram")) return <Instagram className="w-5 h-5" />;
  if (name.includes("twitter") || name.includes("x")) return <Twitter className="w-5 h-5" />;
  if (name.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
  if (name.includes("youtube")) return <Youtube className="w-5 h-5" />;
  if (name.includes("github")) return <Github className="w-5 h-5" />;
  return <Share2 className="w-5 h-5" />;
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

/* ─── Platform Badge ───────────────────────────────────────────────────────── */
const PlatformBadge: React.FC<{ platformName: string; theme: any }> = ({ platformName, theme }) => {
  const colors: Record<string, string> = {
    "Facebook": "#1877f2",
    "Instagram": "#e4405f",
    "Twitter": "#1da1f2",
    "LinkedIn": "#0a66c2",
    "YouTube": "#ff0000",
    "GitHub": "#181717",
  };
  const color = colors[platformName] || theme.primary;
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {getPlatformIcon(platformName)}
      {platformName}
    </span>
  );
};

/* ─── Social Media Account Card ───────────────────────────────────────────── */
interface AccountCardProps {
  account: CreateEmployeeSocialMediaAccount;
  index: number;
  theme: any;
  platformName: string;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
  onSetPrimary: () => void;
  animationDelay: number;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  index,
  theme,
  platformName,
  onEdit,
  onDelete,
  onVerify,
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

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const isActive = account.status === "ACTIVE";

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
        border: `1.5px solid ${
          account.isPrimary 
            ? theme.primary 
            : hovered 
              ? theme.primary + "55" 
              : theme.border
        }`,
        boxShadow: account.isPrimary
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
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primary}11)`,
              color: theme.primary,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            {getPlatformIcon(platformName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <PlatformBadge platformName={platformName} theme={theme} />
              {account.isPrimary && (
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
              {account.verified && (
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
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: isActive ? "#10b98118" : "#ef444418",
                  color: isActive ? "#10b981" : "#ef4444",
                }}
              >
                {account.status}
              </span>
            </div>
            <div className="mt-1.5">
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                @{account.username}
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
          {!account.verified && (
            <button
              onClick={onVerify}
              title="Verify account"
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
          {!account.isPrimary && (
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
        className="mt-3 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        {account.profileUrl && (
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
            <a
              href={account.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline transition-all"
              style={{ color: theme.primary }}
            >
              View Profile
            </a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.textSecondary }} />
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            {formatFollowerCount(account.followerCount)} followers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>Privacy:</span>
          <span className="text-xs" style={{ color: account.isPublic ? "#10b981" : "#ef4444" }}>
            {account.isPublic ? "Public" : "Private"}
          </span>
        </div>
        {account.verified && account.verifiedDate && (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3" style={{ color: "#10b981" }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              Verified on {new Date(account.verifiedDate).toLocaleDateString()}
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
  account: CreateEmployeeSocialMediaAccount;
  theme: any;
  platforms: { id: number; label: string }[];
  onChange: (a: CreateEmployeeSocialMediaAccount) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  isEditing,
  account,
  theme,
  platforms,
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

  const isValid = account.platformId !== 0 && account.username;

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
            {isEditing ? "Edit Social Media Account" : "New Social Media Account"}
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
          <FieldLabel label="Platform" required theme={theme} />
          <StyledSelect
            theme={theme}
            value={account.platformId}
            onChange={(e) =>
              onChange({ ...account, platformId: parseInt(e.target.value) })
            }
          >
            <option value={0}>Select platform</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.label}
              </option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <FieldLabel label="Username" required theme={theme} />
          <StyledInput
            theme={theme}
            type="text"
            value={account.username}
            onChange={(e) =>
              onChange({ ...account, username: e.target.value })
            }
            placeholder="@username"
          />
        </div>

        <div>
          <FieldLabel label="Profile URL" theme={theme} />
          <StyledInput
            theme={theme}
            type="url"
            value={account.profileUrl}
            onChange={(e) =>
              onChange({ ...account, profileUrl: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div>
          <FieldLabel label="Follower Count" theme={theme} />
          <StyledInput
            theme={theme}
            type="number"
            value={account.followerCount}
            onChange={(e) =>
              onChange({ ...account, followerCount: parseInt(e.target.value) || 0 })
            }
            min="0"
            placeholder="0"
          />
        </div>

        <div>
          <FieldLabel label="Status" theme={theme} />
          <StyledSelect
            theme={theme}
            value={account.status}
            onChange={(e) =>
              onChange({ ...account, status: e.target.value as "ACTIVE" | "INACTIVE" })
            }
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </StyledSelect>
        </div>

        {/* Checkbox options */}
        <div className="sm:col-span-2">
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: account.isPrimary ? theme.primary : theme.border,
                  boxShadow: account.isPrimary ? `0 0 0 3px ${theme.primary}22` : "none",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: account.isPrimary ? "calc(100% - 20px)" : "4px",
                  }}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={account.isPrimary}
                  onChange={(e) =>
                    onChange({ ...account, isPrimary: e.target.checked })
                  }
                />
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                Set as <strong style={{ color: theme.text }}>primary</strong> account
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: account.isPublic ? theme.primary : theme.border,
                  boxShadow: account.isPublic ? `0 0 0 3px ${theme.primary}22` : "none",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: account.isPublic ? "calc(100% - 20px)" : "4px",
                  }}
                />
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={account.isPublic}
                  onChange={(e) =>
                    onChange({ ...account, isPublic: e.target.checked })
                  }
                />
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                <strong style={{ color: theme.text }}>Public</strong> account
              </span>
            </label>
          </div>
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
          {isEditing ? "Save Changes" : "Add Account"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const SocialMediaAccountsSection: React.FC<SocialMediaAccountsSectionProps> = ({
  accounts,
  onUpdate,
  employeeCreateData,
  userId,
}) => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentAccount, setCurrentAccount] = useState<CreateEmployeeSocialMediaAccount>(getEmptyAccount(userId));

  const getPlatformName = (id: number): string => {
    const platform = employeeCreateData?.socialMediaPlatforms?.find(p => p.id === id);
    return platform?.label || `Platform ${id}`;
  };

  const handleSave = () => {
    if (!currentAccount.platformId || !currentAccount.username) return;
    if (editingIndex !== null) {
      const updated = [...accounts];
      updated[editingIndex] = { ...currentAccount, lastUpdated: new Date().toISOString() };
      onUpdate(updated);
    } else {
      onUpdate([...accounts, { ...currentAccount, lastUpdated: new Date().toISOString() }]);
    }
    setCurrentAccount(getEmptyAccount(userId));
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentAccount({ ...accounts[index] });
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    onUpdate(accounts.filter((_, i) => i !== index));
  };

  const handleVerify = (index: number) => {
    const updated = [...accounts];
    updated[index] = {
      ...updated[index],
      verified: true,
      verifiedBy: userId,
      verifiedDate: new Date().toISOString(),
    };
    onUpdate(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = accounts.map((account, i) => ({
      ...account,
      isPrimary: i === index,
    }));
    onUpdate(updated);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setCurrentAccount(getEmptyAccount(userId));
  };

  return (
    <div className="space-y-3">
      {/* Empty State */}
      {accounts.length === 0 && !isAdding && (
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
            <Share2
              className="w-6 h-6"
              style={{ color: theme.primary, opacity: 0.7 }}
            />
          </div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: theme.text }}
          >
            No social media accounts linked
          </p>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Connect professional social media profiles
          </p>
        </div>
      )}

      {/* Account Cards */}
      {accounts.map((account, index) => (
        <AccountCard
          key={index}
          account={account}
          index={index}
          theme={theme}
          platformName={getPlatformName(account.platformId)}
          animationDelay={index * 60}
          onEdit={() => handleEdit(index)}
          onDelete={() => handleDelete(index)}
          onVerify={() => handleVerify(index)}
          onSetPrimary={() => handleSetPrimary(index)}
        />
      ))}

      {/* Form Panel */}
      {isAdding && (
        <FormPanel
          isEditing={editingIndex !== null}
          account={currentAccount}
          theme={theme}
          platforms={employeeCreateData?.socialMediaPlatforms || []}
          onChange={setCurrentAccount}
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
          Add Social Media Account
        </button>
      )}
    </div>
  );
};