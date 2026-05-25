// components/common-components/CreateConfirmationDialog.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Loader,
  Sparkles,
  Shield,
  Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface ConfirmationDetails {
  title: string;
  message: string;
  itemName?: string;
  type?: "create" | "update" | "delete" | "warning";
  estimatedTime?: string;
  tips?: string[];
}

interface CreateConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  details: ConfirmationDetails;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  showEstimatedTime?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const CreateConfirmationDialog: React.FC<CreateConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  details,
  isLoading = false,
  confirmText = "Confirm & Create",
  cancelText = "Cancel",
  showEstimatedTime = true,
  onSuccess,
  onError,
}) => {
  const { theme } = useTheme();
  const [isLeaving, setIsLeaving] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [buttonEffect, setButtonEffect] = useState<"idle" | "success" | "error">("idle");

  const loading = isLoading || localLoading;

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, loading]);

  const handleClose = () => {
    if (loading) return;
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    if (loading) return;
    
    setLocalLoading(true);
    setButtonEffect("idle");
    
    try {
      await onConfirm();
      setButtonEffect("success");
      onSuccess?.();
      
      // Auto close after success animation
      setTimeout(() => {
        handleClose();
        setLocalLoading(false);
      }, 800);
    } catch (error) {
      console.error("Confirmation action failed:", error);
      setButtonEffect("error");
      onError?.(error as Error);
      setTimeout(() => {
        setButtonEffect("idle");
        setLocalLoading(false);
      }, 1000);
    }
  };

  const getTypeStyles = () => {
    switch (details.type || "create") {
      case "create":
        return {
          icon: Sparkles,
          gradient: `linear-gradient(135deg, ${theme.success}, ${theme.primary})`,
          iconBg: `${theme.success}18`,
          iconColor: theme.success,
          confirmBg: `linear-gradient(135deg, ${theme.success}, ${theme.primary})`,
        };
      case "update":
        return {
          icon: Shield,
          gradient: `linear-gradient(135deg, ${theme.warning}, ${theme.primary})`,
          iconBg: `${theme.warning}18`,
          iconColor: theme.warning,
          confirmBg: `linear-gradient(135deg, ${theme.warning}, ${theme.primary})`,
        };
      case "delete":
        return {
          icon: AlertTriangle,
          gradient: `linear-gradient(135deg, ${theme.error}, ${theme.accent})`,
          iconBg: `${theme.error}18`,
          iconColor: theme.error,
          confirmBg: `linear-gradient(135deg, ${theme.error}, ${theme.accent})`,
        };
      default:
        return {
          icon: Sparkles,
          gradient: `linear-gradient(135deg, ${theme.success}, ${theme.primary})`,
          iconBg: `${theme.primary}18`,
          iconColor: theme.primary,
          confirmBg: `linear-gradient(135deg, ${theme.success}, ${theme.primary})`,
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes successCheck {
          0% {
            stroke-dashoffset: 24;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        @keyframes buttonGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .dialog-overlay {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .dialog-container {
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .dialog-container.leaving {
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .success-animation {
          animation: successCheck 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .button-glow {
          animation: buttonGlow 0.5s ease-out;
        }
        
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }
        
        .ripple-effect:active:after {
          width: 200px;
          height: 200px;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="dialog-overlay fixed inset-0 z-[100]"
        style={{
          backgroundColor: `rgba(0, 0, 0, 0.6)`,
          backdropFilter: "blur(4px)",
        }}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={`dialog-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4 ${
          isLeaving ? "leaving" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${styles.iconColor}20`,
          }}
        >
          {/* Gradient Border Animation */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: styles.gradient,
              filter: "blur(20px)",
              opacity: buttonEffect === "success" ? 0.6 : 0.3,
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 z-10"
            style={{
              color: theme.textSecondary,
              backgroundColor: `${theme.border}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.border}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.border}30`;
            }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: styles.iconBg,
                  background: buttonEffect === "success" ? styles.gradient : undefined,
                }}
              >
                {buttonEffect === "success" ? (
                  <CheckCircle className="w-8 h-8 text-white success-animation" />
                ) : buttonEffect === "error" ? (
                  <AlertTriangle className="w-8 h-8 shake-animation" style={{ color: theme.error }} />
                ) : (
                  <IconComponent
                    className="w-8 h-8"
                    style={{ color: styles.iconColor }}
                  />
                )}
                
                {/* Ripple effect */}
                {loading && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid ${styles.iconColor}`,
                      animation: "pulse 1.5s ease-out infinite",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-xl font-bold text-center mb-2"
              style={{ color: theme.text }}
            >
              {details.title}
            </h2>

            {/* Message */}
            <p
              className="text-sm text-center mb-4"
              style={{ color: theme.textSecondary }}
            >
              {details.message}
              {details.itemName && (
                <span
                  className="block mt-1 font-semibold"
                  style={{ color: styles.iconColor }}
                >
                  "{details.itemName}"
                </span>
              )}
            </p>

            {/* Estimated Time */}
            {showEstimatedTime && details.estimatedTime && (
              <div
                className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg"
                style={{
                  backgroundColor: `${theme.primary}08`,
                  border: `1px solid ${theme.primary}20`,
                }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                <span className="text-xs" style={{ color: theme.textSecondary }}>
                  Estimated time: {details.estimatedTime}
                </span>
              </div>
            )}

            {/* Tips */}
            {details.tips && details.tips.length > 0 && (
              <div
                className="mb-6 p-3 rounded-lg"
                style={{
                  backgroundColor: `${theme.warning}08`,
                  border: `1px solid ${theme.warning}20`,
                }}
              >
                <p
                  className="text-xs font-semibold mb-2 flex items-center gap-1"
                  style={{ color: theme.warning }}
                >
                  <Shield className="w-3 h-3" />
                  Quick Tips:
                </p>
                <ul className="space-y-1">
                  {details.tips.map((tip, index) => (
                    <li key={index} className="text-xs flex items-start gap-2">
                      <span className="text-warning">•</span>
                      <span style={{ color: theme.textSecondary }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = `${theme.primary}05`;
                  e.currentTarget.style.color = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                {cancelText}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading || buttonEffect === "success"}
                className={`ripple-effect flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 ${
                  buttonEffect === "success" ? "button-glow" : ""
                }`}
                style={{
                  background: styles.confirmBg,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : buttonEffect === "success" ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Created!</span>
                  </div>
                ) : buttonEffect === "error" ? (
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Failed</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};