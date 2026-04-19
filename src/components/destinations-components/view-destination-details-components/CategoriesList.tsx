"use client";

import React from "react";
import { Layers } from "lucide-react";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";

interface Category {
  id: number;
  name: string;
  description?: string;
  isPrimary: boolean;
}

interface CategoriesListProps {
  categories: Category[];
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="bg-white rounded-2xl border shadow-sm p-5 fade-up delay-4 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <h3 className="flex items-center gap-2.5 text-base font-bold mb-4" style={{ color: theme.text }}>
        <IconBadge icon={Layers} color={theme.success} />
        Categories
        <span 
          className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold"
          style={{ 
            backgroundColor: `${theme.success}10`,
            color: theme.success 
          }}
        >
          {categories.length}
        </span>
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-2.5 rounded-xl border"
            style={{ 
              backgroundColor: cat.isPrimary ? `${theme.primary}10` : theme.background,
              borderColor: cat.isPrimary ? `${theme.primary}30` : theme.border
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: theme.text }}>
                {cat.name}
              </span>
              {cat.isPrimary && (
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary 
                  }}
                >
                  Primary
                </span>
              )}
            </div>
            {cat.description && (
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                {cat.description}
              </p>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm italic text-center py-3" style={{ color: theme.textSecondary }}>
            No categories assigned
          </p>
        )}
      </div>
    </div>
  );
};