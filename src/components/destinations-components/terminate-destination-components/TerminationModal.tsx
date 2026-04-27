"use client";

import React from "react";
import { AlertTriangle, MapPin, AlertCircle, Loader2, Trash2, X } from "lucide-react";
import { DestinationForTerminate } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface TerminationModalProps {
  isOpen: boolean;
  selectedDestination: DestinationForTerminate | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TerminationModal: React.FC<TerminationModalProps> = ({
  isOpen,
  selectedDestination,
  loading,
  onClose,
  onConfirm,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: hexToRgba(theme.text, 0.5), backdropFilter: "blur(6px)" }}
        onClick={() => !loading && onClose()}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{
            background: theme.surface,
            boxShadow: `0 24px 64px ${hexToRgba(theme.text, 0.18)}`,
            border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
          }}
        >
          <div
            className="px-6 py-5 flex items-center gap-4"
            style={{
              background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
              borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`, color: "#fff" }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: theme.error }}>Confirm Termination</h3>
              <p className="text-xs mt-0.5" style={{ color: theme.error }}>This action cannot be reversed</p>
            </div>
          </div>
          <div className="px-6 py-6 space-y-5">
            <p className="text-sm" style={{ color: theme.textSecondary }}>You are about to permanently terminate:</p>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: hexToRgba(theme.error, 0.05),
                border: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: hexToRgba(theme.primary, 0.1), color: theme.primary }}
              >
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: theme.text }}>{selectedDestination?.destinationName}</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>ID · {selectedDestination?.destinationId}</p>
              </div>
            </div>
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl"
              style={{
                background: hexToRgba(theme.error, 0.05),
                border: `1px solid ${hexToRgba(theme.error, 0.15)}`,
              }}
            >
              <AlertCircle size={14} style={{ color: theme.error, marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs" style={{ color: theme.error }}>
                All activities and images linked to this destination will be permanently deleted. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3" style={{ borderTop: `1px solid ${hexToRgba(theme.error, 0.2)}`, paddingTop: "16px" }}>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: theme.background,
                border: `1.5px solid ${theme.border}`,
                color: theme.textSecondary,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                color: "#fff",
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? "none" : `0 3px 12px ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Terminating…
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Confirm Termination
                </>
              )}
            </button>
          </div>
          <p className="text-center text-xs pb-5" style={{ color: theme.textSecondary }}>
            By confirming, you acknowledge that all associated data will be permanently deleted.
          </p>
        </div>
      </div>
    </>
  );
};