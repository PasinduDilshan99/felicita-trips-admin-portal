// components/common-components/TerminateConfirmModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  X, 
  Trash2, 
  AlertCircle,
  Shield,
  CheckCircle2
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface TerminateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemId?: number;
  itemType?: "privilege" | "role" | "destination" | "user";
  additionalInfo?: {
    label: string;
    value: string | number;
  }[];
  warningMessage?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const TerminateConfirmModal: React.FC<TerminateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemId,
  itemType = "privilege",
  additionalInfo = [],
  warningMessage,
  confirmText = "Permanently Terminate",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const getTypeConfig = () => {
    switch (itemType) {
      case "role":
        return {
          icon: Shield,
          iconColor: theme.warning || "#f59e0b",
          bgGlow: `${theme.warning}20`,
          headerBg: `${theme.warning}08`,
          defaultWarning: "This role is assigned to one or more users. Terminating it will affect their permissions.",
        };
      case "destination":
        return {
          icon: AlertCircle,
          iconColor: theme.error || "#ef4444",
          bgGlow: `${theme.error}20`,
          headerBg: `${theme.error}08`,
          defaultWarning: "This destination has associated activities, packages, and bookings. All related data will be permanently removed.",
        };
      case "user":
        return {
          icon: AlertTriangle,
          iconColor: theme.error || "#ef4444",
          bgGlow: `${theme.error}20`,
          headerBg: `${theme.error}08`,
          defaultWarning: "This user has associated data. All user data will be permanently removed.",
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: theme.error || "#ef4444",
          bgGlow: `${theme.error}20`,
          headerBg: `${theme.error}08`,
          defaultWarning: "This action is permanent and cannot be undone. All associated data will be lost.",
        };
    }
  };

  const typeConfig = getTypeConfig();
  const Icon = typeConfig.icon;
  const finalWarningMessage = warningMessage || typeConfig.defaultWarning;

  // Reset confirmation input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmInput("");
    }
  }, [isOpen]);

  // Handle animation and portal rendering
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, isLoading, onClose]);

  if (!shouldRender) return null;

  const isConfirmEnabled = confirmInput === itemName && !isLoading;

  return (
    <>
      <style jsx>{`
        @keyframes modalBackdropFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(4px); }
        }
        @keyframes modalBackdropFadeOut {
          from { opacity: 1; backdrop-filter: blur(4px); }
          to { opacity: 0; backdrop-filter: blur(0px); }
        }
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes modalSlideOut {
          from { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
          to { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.95);
          }
        }
        @keyframes iconPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(0px);
          z-index: 9998;
        }
        
        .backdrop-enter {
          animation: modalBackdropFadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .backdrop-exit {
          animation: modalBackdropFadeOut 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: 90%;
          max-width: 500px;
        }
        
        .modal-enter {
          animation: modalSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .modal-exit {
          animation: modalSlideOut 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .icon-animation {
          animation: iconPop 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`backdrop ${isVisible ? "backdrop-enter" : "backdrop-exit"}`}
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className={`modal-container ${isVisible ? "modal-enter" : "modal-exit"}`}>
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${typeConfig.iconColor}`,
          }}
        >
          {/* Header */}
          <div
            className="p-6 border-b"
            style={{
              borderColor: `${typeConfig.iconColor}30`,
              backgroundColor: typeConfig.headerBg,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="icon-animation w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${typeConfig.iconColor}15`,
                }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: typeConfig.iconColor }}
                />
              </div>
              <div className="flex-1">
                <h2
                  className="text-xl font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  Terminate {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  This action is permanent and cannot be undone
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer p-1 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.border}40`;
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Item Info */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: `${typeConfig.iconColor}08`,
                border: `1px solid ${typeConfig.iconColor}20`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                  {itemType.toUpperCase()} DETAILS
                </span>
                {itemId && (
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${typeConfig.iconColor}15`,
                      color: typeConfig.iconColor,
                    }}
                  >
                    ID: {itemId}
                  </span>
                )}
              </div>
              <p className="text-lg font-semibold break-words" style={{ color: theme.text }}>
                {itemName}
              </p>
            </div>

            {/* Additional Info */}
            {additionalInfo.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: `${theme.border}20`,
                }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                  Additional Information
                </p>
                <div className="space-y-1">
                  {additionalInfo.map((info, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span style={{ color: theme.textSecondary }}>{info.label}:</span>
                      <span className="font-medium" style={{ color: theme.text }}>
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Message */}
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: `${theme.warning}08`,
                border: `1px solid ${theme.warning}30`,
              }}
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: theme.warning }} />
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: theme.warning }}>
                    Warning!
                  </p>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    {finalWarningMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textSecondary }}
              >
                Type <span className="font-bold" style={{ color: typeConfig.iconColor }}>"{itemName}"</span> to confirm termination
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={`Enter "${itemName}" to confirm`}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm transition-all duration-200"
                style={{
                  backgroundColor: theme.background,
                  borderColor: confirmInput === itemName ? theme.success : theme.border,
                  color: theme.text,
                }}
                autoFocus
              />
              {confirmInput && confirmInput !== itemName && (
                <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: theme.error }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  Please enter the exact name to confirm
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="p-6 border-t flex gap-3"
            style={{ borderColor: theme.border }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.border}30`;
                e.currentTarget.style.borderColor = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.background;
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={!isConfirmEnabled}
              className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0 disabled:hover:translate-y-0"
              style={{
                background: `linear-gradient(135deg, ${typeConfig.iconColor}, ${typeConfig.iconColor}dd)`,
                boxShadow: isConfirmEnabled ? `0 4px 12px ${typeConfig.iconColor}40` : "none",
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
};