"use client";

import React from "react";
import { ArrowLeft, Share2, Edit, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ActionButtonsProps {
  onBack: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons = ({
  onBack,
  onShare,
  onEdit,
  onDelete,
}: ActionButtonsProps) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        style={{
          border: `1px solid ${theme.border}`,
          color: theme.textSecondary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgba(
            theme.primary,
            0.05,
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <button
        onClick={onShare}
        className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        style={{
          border: `1px solid ${theme.border}`,
          color: theme.textSecondary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgba(
            theme.primary,
            0.05,
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      <button
        onClick={onEdit}
        className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
        style={{
          backgroundColor: theme.primary,
          color: "#fff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>

      <button
        onClick={onDelete}
        className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
        style={{
          backgroundColor: theme.error,
          color: "#fff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

export { ActionButtons };
