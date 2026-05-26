// components/common-components/ActionButtons.tsx
"use client";

import React from "react";
import {
  Share2,
  Edit,
  Trash2,
  Plus,
  Eye,
  Archive,
  Copy,
  Download,
  Settings,
  MoreVertical,
  Save,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export type ActionButtonVariant =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

export interface ActionButton {
  id: string;
  label: string;
  icon?: React.ElementType;
  variant?: ActionButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  show?: boolean;
  requiredPrivileges?: string[];
  requiredRoles?: string[];
  requireAll?: boolean; // If true, requires all privileges/roles; if false, requires at least one
}

interface ActionButtonsProps {
  title?: string;
  buttons?: ActionButton[];
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  onView?: () => void;
  onArchive?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  showSave?: boolean;
  showCancel?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  saveButtonVariant?: ActionButtonVariant;
  cancelButtonVariant?: ActionButtonVariant;
  showShare?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
  showView?: boolean;
  showArchive?: boolean;
  showCopy?: boolean;
  showDownload?: boolean;
  showSettings?: boolean;
  titleClassName?: string;
  buttonsClassName?: string;
  containerClassName?: string;
  // Privilege props for default buttons
  sharePrivileges?: string[];
  editPrivileges?: string[];
  deletePrivileges?: string[];
  addPrivileges?: string[];
  viewPrivileges?: string[];
  archivePrivileges?: string[];
  copyPrivileges?: string[];
  downloadPrivileges?: string[];
  settingsPrivileges?: string[];
  savePrivileges?: string[];
  cancelPrivileges?: string[];
  requireAllPrivileges?: boolean; // Global setting for all buttons
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  title,
  buttons = [],
  onShare,
  onEdit,
  onDelete,
  onAdd,
  onView,
  onArchive,
  onCopy,
  onSave,
  onCancel,
  onDownload,
  onSettings,
  showShare = false,
  showEdit = false,
  showDelete = false,
  showSave = false,
  showCancel = false,
  showAdd = false,
  showView = false,
  showArchive = false,
  showCopy = false,
  showDownload = false,
  showSettings = false,
  titleClassName = "",
  buttonsClassName = "",
  containerClassName = "",
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  saveButtonVariant = "primary",
  cancelButtonVariant = "default",
  // Privilege props
  sharePrivileges = [],
  editPrivileges = [],
  deletePrivileges = [],
  addPrivileges = [],
  viewPrivileges = [],
  archivePrivileges = [],
  copyPrivileges = [],
  downloadPrivileges = [],
  settingsPrivileges = [],
  savePrivileges = [],
  cancelPrivileges = [],
  requireAllPrivileges = false,
}) => {
  const { theme } = useTheme();
  const { hasPrivilege, hasRole, user } = useAuth();

  // Helper function to check if user has access based on privileges and roles
  const hasAccess = (
    requiredPrivileges: string[] = [],
    requiredRoles: string[] = [],
    requireAll: boolean = false
  ): boolean => {
    // If no user is logged in, only allow if no privileges/roles are required
    if (!user) {
      return requiredPrivileges.length === 0 && requiredRoles.length === 0;
    }

    // Check privileges
    let hasRequiredPrivileges = true;
    if (requiredPrivileges.length > 0) {
      if (requireAll) {
        hasRequiredPrivileges = requiredPrivileges.every(priv => hasPrivilege(priv));
      } else {
        hasRequiredPrivileges = requiredPrivileges.some(priv => hasPrivilege(priv));
      }
    }

    // Check roles
    let hasRequiredRoles = true;
    if (requiredRoles.length > 0) {
      if (requireAll) {
        hasRequiredRoles = requiredRoles.every(role => hasRole(role));
      } else {
        hasRequiredRoles = requiredRoles.some(role => hasRole(role));
      }
    }

    return hasRequiredPrivileges && hasRequiredRoles;
  };

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number): string => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Get variant colors
  const getVariantStyles = (variant: ActionButtonVariant) => {
    switch (variant) {
      case "primary":
        return {
          bg: theme.primary,
          bgLight: hexToRgba(theme.primary, 0.1),
          borderLight: hexToRgba(theme.primary, 0.2),
          borderHover: hexToRgba(theme.primary, 0.4),
          text: theme.primary,
        };
      case "success":
        return {
          bg: theme.success,
          bgLight: hexToRgba(theme.success, 0.1),
          borderLight: hexToRgba(theme.success, 0.2),
          borderHover: hexToRgba(theme.success, 0.4),
          text: theme.success,
        };
      case "error":
        return {
          bg: theme.error,
          bgLight: hexToRgba(theme.error, 0.1),
          borderLight: hexToRgba(theme.error, 0.2),
          borderHover: hexToRgba(theme.error, 0.4),
          text: theme.error,
        };
      case "warning":
        return {
          bg: theme.warning,
          bgLight: hexToRgba(theme.warning, 0.1),
          borderLight: hexToRgba(theme.warning, 0.2),
          borderHover: hexToRgba(theme.warning, 0.4),
          text: theme.warning,
        };
      case "info":
        return {
          bg: theme.accent,
          bgLight: hexToRgba(theme.accent, 0.1),
          borderLight: hexToRgba(theme.accent, 0.2),
          borderHover: hexToRgba(theme.accent, 0.4),
          text: theme.accent,
        };
      default:
        return {
          bg: theme.textSecondary,
          bgLight: hexToRgba(theme.textSecondary, 0.1),
          borderLight: hexToRgba(theme.textSecondary, 0.2),
          borderHover: hexToRgba(theme.textSecondary, 0.4),
          text: theme.textSecondary,
        };
    }
  };

  // Build default buttons from props with privilege checks
  const getDefaultButtons = (): ActionButton[] => {
    const defaultButtons: ActionButton[] = [];

    if (showAdd && onAdd && hasAccess(addPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "add",
        label: "Add",
        icon: Plus,
        variant: "success",
        onClick: onAdd,
        requiredPrivileges: addPrivileges,
      });
    }

    if (showView && onView && hasAccess(viewPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "view",
        label: "View",
        icon: Eye,
        variant: "primary",
        onClick: onView,
        requiredPrivileges: viewPrivileges,
      });
    }

    if (showEdit && onEdit && hasAccess(editPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "edit",
        label: "Edit",
        icon: Edit,
        variant: "primary",
        onClick: onEdit,
        requiredPrivileges: editPrivileges,
      });
    }

    if (showShare && onShare && hasAccess(sharePrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "share",
        label: "Share",
        icon: Share2,
        variant: "success",
        onClick: onShare,
        requiredPrivileges: sharePrivileges,
      });
    }

    if (showSave && onSave && hasAccess(savePrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "save",
        label: saveButtonText,
        icon: Save,
        variant: saveButtonVariant,
        onClick: onSave,
        requiredPrivileges: savePrivileges,
      });
    }

    if (showCancel && onCancel && hasAccess(cancelPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "cancel",
        label: cancelButtonText,
        icon: X,
        variant: cancelButtonVariant,
        onClick: onCancel,
        requiredPrivileges: cancelPrivileges,
      });
    }

    if (showCopy && onCopy && hasAccess(copyPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "copy",
        label: "Copy",
        icon: Copy,
        variant: "info",
        onClick: onCopy,
        requiredPrivileges: copyPrivileges,
      });
    }

    if (showDownload && onDownload && hasAccess(downloadPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "download",
        label: "Download",
        icon: Download,
        variant: "info",
        onClick: onDownload,
        requiredPrivileges: downloadPrivileges,
      });
    }

    if (showArchive && onArchive && hasAccess(archivePrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "archive",
        label: "Archive",
        icon: Archive,
        variant: "warning",
        onClick: onArchive,
        requiredPrivileges: archivePrivileges,
      });
    }

    if (showSettings && onSettings && hasAccess(settingsPrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "settings",
        label: "Settings",
        icon: Settings,
        variant: "default",
        onClick: onSettings,
        requiredPrivileges: settingsPrivileges,
      });
    }

    if (showDelete && onDelete && hasAccess(deletePrivileges, [], requireAllPrivileges)) {
      defaultButtons.push({
        id: "delete",
        label: "Delete",
        icon: Trash2,
        variant: "error",
        onClick: onDelete,
        requiredPrivileges: deletePrivileges,
      });
    }

    return defaultButtons;
  };

  const allButtons = buttons.length > 0 ? buttons : getDefaultButtons();
  
  // Filter buttons based on privilege checks
  const visibleButtons = allButtons.filter((btn) => {
    // Check if button should be shown based on explicit show flag
    if (btn.show === false) return false;
    
    // Check privileges and roles for custom buttons
    if (btn.requiredPrivileges?.length || btn.requiredRoles?.length) {
      return hasAccess(btn.requiredPrivileges, btn.requiredRoles, btn.requireAll);
    }
    
    // If no privileges/roles defined, always show
    return true;
  });

  if (visibleButtons.length === 0 && !title) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 mb-7 fade-up ${containerClassName}`}
    >
      {title && (
        <div
          className={`text-2xl sm:text-3xl font-bold ${titleClassName}`}
          style={{
            color: theme.primary,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
      )}
      <div className={`flex flex-wrap gap-3 ${buttonsClassName}`}>
        {visibleButtons.map((button) => {
          const variantStyles = getVariantStyles(button.variant || "default");
          const IconComponent = button.icon;

          return (
            <button
              key={button.id}
              onClick={button.onClick}
              disabled={button.disabled}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              style={{
                backgroundColor: variantStyles.bgLight,
                color: variantStyles.text,
                border: `1px solid ${variantStyles.borderLight}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (button.disabled) return;
                e.currentTarget.style.backgroundColor = variantStyles.borderHover;
                e.currentTarget.style.borderColor = variantStyles.borderHover;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                if (button.disabled) return;
                e.currentTarget.style.backgroundColor = variantStyles.bgLight;
                e.currentTarget.style.borderColor = variantStyles.borderLight;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {IconComponent && (
                <IconComponent
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-12"
                />
              )}
              {button.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActionButtons;