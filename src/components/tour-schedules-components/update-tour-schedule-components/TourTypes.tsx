"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Layers, Star, ChevronDown } from "lucide-react";
import { TourScheduleType } from "@/types/tour-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
  },
};

interface TourTypesProps {
  types: TourScheduleType[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

export const TourTypes: React.FC<TourTypesProps> = ({
  types,
  expandedSections,
  onToggleSection,
}) => {
  const { theme } = useTheme();

  if (!types || types.length === 0) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("types")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("types") ? `${theme.accent}05` : "transparent",
          borderBottom: expandedSections.has("types") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
          >
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Tour Types
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Read-only type list ({types.length} types)
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{ 
            transform: expandedSections.has("types") ? "rotate(180deg)" : "none", 
            color: theme.textSecondary 
          }}
        />
      </button>

      <AnimatePresence>
        {expandedSections.has("types") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <span
                  key={type.typeId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${theme.accent}15`,
                    color: theme.accent,
                    border: `1px solid ${theme.accent}30`,
                  }}
                >
                  <Layers className="w-3 h-3" />
                  {type.typeName}
                  {type.primaryType && (
                    <Star className="w-3 h-3 ml-0.5" style={{ color: theme.warning, fill: theme.warning }} />
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};