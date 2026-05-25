// components/common-components/CreateConfirmModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, X, CheckCircle, Info, AlertCircle, PlusCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export type CreateConfirmModalType = "create" | "warning" | "danger" | "info" | "success";

interface CreateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: CreateConfirmModalType;
  isLoading?: boolean;
  confirmButtonColor?: string;
  itemName?: string; // Optional: name of the item being created
}

export const CreateConfirmModal: React.FC<CreateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Create",
  cancelText = "Cancel",
  type = "create",
  isLoading = false,
  confirmButtonColor,
  itemName,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Get icon and default colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: AlertTriangle,
          iconColor: theme.error || "#ef4444",
          defaultButtonColor: theme.error || "#ef4444",
          bgGlow: `${theme.error}20`,
          defaultConfirmText: "Delete",
        };
      case "success":
        return {
          icon: CheckCircle,
          iconColor: theme.success || "#10b981",
          defaultButtonColor: theme.success || "#10b981",
          bgGlow: `${theme.success}20`,
          defaultConfirmText: "Confirm",
        };
      case "info":
        return {
          icon: Info,
          iconColor: theme.primary || "#3b82f6",
          defaultButtonColor: theme.primary || "#3b82f6",
          bgGlow: `${theme.primary}20`,
          defaultConfirmText: "Confirm",
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconColor: theme.warning || "#f59e0b",
          defaultButtonColor: theme.warning || "#f59e0b",
          bgGlow: `${theme.warning}20`,
          defaultConfirmText: "Confirm",
        };
      default: // create
        return {
          icon: PlusCircle,
          iconColor: theme.primary || "#3b82f6",
          defaultButtonColor: theme.primary || "#3b82f6",
          bgGlow: `${theme.primary}20`,
          defaultConfirmText: "Create",
        };
    }
  };

  const typeConfig = getTypeConfig();
  const Icon = typeConfig.icon;
  const buttonColor = confirmButtonColor || typeConfig.defaultButtonColor;
  const finalConfirmText = confirmText || typeConfig.defaultConfirmText;

  // Format message with item name if provided
  const formattedMessage = itemName && message.includes("{itemName}")
    ? message.replace(/{itemName}/g, itemName)
    : message;

  // Handle animation and portal rendering
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      // Wait for animation to complete before removing from DOM
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
          max-width: 450px;
        }
        
        .modal-enter {
          animation: modalSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .modal-exit {
          animation: modalSlideOut 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes iconPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .icon-animation {
          animation: iconPop 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        
        @keyframes buttonRipple {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        .confirm-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .confirm-btn:active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: buttonRipple 0.5s ease-out;
        }
        
        .confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .confirm-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`backdrop ${isVisible ? "backdrop-enter" : "backdrop-exit"}`}
        onClick={!isLoading ? onClose : undefined}
        style={{
          backgroundColor: `rgba(0, 0, 0, 0.6)`,
        }}
      />

      {/* Modal */}
      <div className={`modal-container ${isVisible ? "modal-enter" : "modal-exit"}`}>
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          {/* Modal Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className="icon-animation w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${typeConfig.iconColor}15`,
                }}
              >
                <Icon
                  className="w-7 h-7"
                  style={{ color: typeConfig.iconColor }}
                />
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-xl font-semibold text-center mb-2"
              style={{ color: theme.text }}
            >
              {title}
            </h2>

            {/* Message */}
            <p
              className="text-center text-sm mb-6"
              style={{ color: theme.textSecondary }}
            >
              {formattedMessage}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
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
                disabled={isLoading}
                className="confirm-btn cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${buttonColor}, ${buttonColor}dd)`,
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {type === "create" && <PlusCircle className="w-4 h-4" />}
                    {finalConfirmText}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Close button (top-right) */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer absolute top-4 right-4 p-1 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
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
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};