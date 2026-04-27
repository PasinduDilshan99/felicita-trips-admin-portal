"use client";

import React from "react";
import { Eye, Edit, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryQuickActionsProps {
  categoryId: number;
  categoryName: string;
  color: string;
  hoverColor: string;
  onEdit: () => void;
  onBack: () => void;
}

const CategoryQuickActions = ({
  categoryId,
  categoryName,
  color,
  hoverColor,
  onEdit,
  onBack,
}: CategoryQuickActionsProps) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h2
        className="text-lg font-semibold mb-4 flex items-center gap-2"
        style={{ color: theme.text }}
      >
        <Eye className="w-5 h-5" style={{ color: color || theme.primary }} />
        Quick Actions
      </h2>

      <div className="flex flex-col gap-3">
        <button
          onClick={onEdit}
          className="w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${color || theme.primary}, ${
              hoverColor || theme.accent
            })`,
            color: "#fff",
          }}
        >
          <Edit className="w-4 h-4" />
          Edit Category
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          style={{
            border: `1px solid ${theme.border}`,
            color: theme.textSecondary,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>
    </div>
  );
};

export { CategoryQuickActions };