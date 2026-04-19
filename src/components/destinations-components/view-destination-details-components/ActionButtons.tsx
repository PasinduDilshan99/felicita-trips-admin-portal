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

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBack,
  onShare,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-7 fade-up">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-gray-100"
        style={{ color: theme.textSecondary }}
      >
        <ArrowLeft size={16} /> Back to Destinations
      </button>
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={onShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
          style={{ 
            backgroundColor: `${theme.success}10`,
            color: theme.success
          }}
        >
          <Share2 size={15} /> Share
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
          style={{ 
            backgroundColor: `${theme.primary}10`,
            color: theme.primary
          }}
        >
          <Edit size={15} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
          style={{ 
            backgroundColor: `${theme.error}10`,
            color: theme.error
          }}
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
};