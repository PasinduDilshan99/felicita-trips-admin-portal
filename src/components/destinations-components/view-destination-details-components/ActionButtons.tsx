"use client";

import React from "react";
import { Share2, Edit, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ActionButtonsProps {
  destinationName: string;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  destinationName,
  onShare,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7 fade-up">
      <div 
        className="text-2xl sm:text-3xl font-bold"
        style={{
          color: theme.primary,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {destinationName}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${theme.success}10`,
            color: theme.success,
            border: `1px solid ${theme.success}20`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.success}20`;
            e.currentTarget.style.borderColor = `${theme.success}40`;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.success}10`;
            e.currentTarget.style.borderColor = `${theme.success}20`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Share2 size={16} className="transition-transform duration-200 group-hover:rotate-12" /> 
          Share
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${theme.primary}10`,
            color: theme.primary,
            border: `1px solid ${theme.primary}20`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.primary}20`;
            e.currentTarget.style.borderColor = `${theme.primary}40`;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.primary}10`;
            e.currentTarget.style.borderColor = `${theme.primary}20`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Edit size={16} className="transition-transform duration-200 group-hover:rotate-12" /> 
          Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          style={{
            backgroundColor: `${theme.error}10`,
            color: theme.error,
            border: `1px solid ${theme.error}20`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.error}20`;
            e.currentTarget.style.borderColor = `${theme.error}40`;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.error}10`;
            e.currentTarget.style.borderColor = `${theme.error}20`;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Trash2 size={16} className="transition-transform duration-200 group-hover:rotate-12" /> 
          Delete
        </button>
      </div>
    </div>
  );
};