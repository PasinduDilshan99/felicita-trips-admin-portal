// components/destination-categories-components/destination-categories-terminate-components/TerminationConfirmationModal.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface TerminationConfirmationModalProps {
  isOpen: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const TerminationConfirmationModal: React.FC<TerminationConfirmationModalProps> = ({
  isOpen,
  categoryName,
  onClose,
  onConfirm,
  loading,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => !loading && onClose()}
    >
      <div
        className="max-w-md w-full mx-4 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-once"
              style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}
            >
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: theme.text }}>
                Confirm Termination
              </h3>
              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                Are you sure you want to terminate this category?
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div
            className="mb-4 p-3 rounded-lg"
            style={{
              backgroundColor: hexToRgba(theme.error, 0.1),
              border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
            }}
          >
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              You are about to terminate{" "}
              <span className="font-semibold" style={{ color: theme.error }}>
                {categoryName}
              </span>
              . This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.error,
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Terminating...
                </>
              ) : (
                <>
                  <span className="text-lg">🗑️</span>
                  Yes, Terminate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-once {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-pulse-once {
          animation: pulse-once 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TerminationConfirmationModal;