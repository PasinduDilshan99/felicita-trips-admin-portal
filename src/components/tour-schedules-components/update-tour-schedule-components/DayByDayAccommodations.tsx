"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Hotel, Bus, Utensils, Coffee, Sun, Moon, Cake, ChevronDown } from "lucide-react";
import { TourScheduleAccommodation } from "@/types/tour-schedule-types";
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

interface DayByDayAccommodationsProps {
  accommodations: TourScheduleAccommodation[];
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

const MealBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string | null;
  theme: any;
}> = ({ icon, label, description, theme }) => (
  <div className="p-2 rounded-lg text-center transition-all hover:scale-105" style={{ backgroundColor: `${theme.success}10` }}>
    <div className="flex items-center justify-center gap-1 mb-1">
      {icon}
      <p className="text-xs font-medium">{label}</p>
    </div>
    {description && <p className="text-xs mt-1 opacity-75">{description}</p>}
  </div>
);

const AccommodationCard: React.FC<{
  accommodation: TourScheduleAccommodation;
  theme: any;
}> = ({ accommodation: acc, theme }) => (
  <div
    className="rounded-xl overflow-hidden transition-all hover:shadow-md"
    style={{
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.background,
    }}
  >
    <div
      className="flex items-center gap-3 p-4"
      style={{ backgroundColor: `${theme.accent}05`, borderBottom: `1px solid ${theme.border}` }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
        style={{ backgroundColor: theme.accent }}
      >
        {acc.day}
      </div>
      <div>
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Day {acc.day}
        </h3>
      </div>
    </div>

    <div className="p-4 space-y-3">
      {/* Hotel & Transport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Hotel className="w-3.5 h-3.5" /> Hotel
          </h4>
          <p className="text-sm"><strong>ID:</strong> {acc.hotelId}</p>
          <p className="text-sm"><strong>Name:</strong> {acc.hotelName || "N/A"}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: theme.textSecondary }}>
            <Bus className="w-3.5 h-3.5" /> Transport
          </h4>
          <p className="text-sm"><strong>ID:</strong> {acc.transportId}</p>
          <p className="text-sm"><strong>Name:</strong> {acc.transportName || "N/A"}</p>
        </div>
      </div>

      {/* Meals */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {acc.breakfast && (
          <MealBadge
            icon={<Coffee className="w-3.5 h-3.5" />}
            label="Breakfast"
            description={acc.breakfastDescription}
            theme={theme}
          />
        )}
        {acc.morningTea && (
          <MealBadge
            icon={<Sun className="w-3.5 h-3.5" />}
            label="Morning Tea"
            description={acc.morningTeaDescription}
            theme={theme}
          />
        )}
        {acc.lunch && (
          <MealBadge
            icon={<Utensils className="w-3.5 h-3.5" />}
            label="Lunch"
            description={acc.lunchDescription}
            theme={theme}
          />
        )}
        {acc.eveningTea && (
          <MealBadge
            icon={<Sun className="w-3.5 h-3.5" />}
            label="Evening Tea"
            description={acc.eveningTeaDescription}
            theme={theme}
          />
        )}
        {acc.dinner && (
          <MealBadge
            icon={<Moon className="w-3.5 h-3.5" />}
            label="Dinner"
            description={acc.dinnerDescription}
            theme={theme}
          />
        )}
        {acc.snacks && (
          <MealBadge
            icon={<Cake className="w-3.5 h-3.5" />}
            label="Snacks"
            description={acc.snackNote}
            theme={theme}
          />
        )}
      </div>

      {/* Other Notes */}
      {acc.otherNotes && (
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.warning}10` }}>
          <p className="text-xs italic">📝 {acc.otherNotes}</p>
        </div>
      )}
    </div>
  </div>
);

export const DayByDayAccommodations: React.FC<DayByDayAccommodationsProps> = ({
  accommodations,
  expandedSections,
  onToggleSection,
}) => {
  const { theme } = useTheme();

  if (!accommodations || accommodations.length === 0) return null;

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
        onClick={() => onToggleSection("accommodations")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("accommodations") ? `${theme.accent}05` : "transparent",
          borderBottom: expandedSections.has("accommodations") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.accent}18`, color: theme.accent }}
          >
            <Hotel className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Day-by-Day Accommodations
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Read-only accommodation details ({accommodations.length} days)
            </p>
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 transition-transform duration-200"
          style={{ 
            transform: expandedSections.has("accommodations") ? "rotate(180deg)" : "none", 
            color: theme.textSecondary 
          }}
        />
      </button>

      <AnimatePresence>
        {expandedSections.has("accommodations") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6 space-y-4">
            {accommodations.map((acc) => (
              <AccommodationCard key={acc.accommodationId} accommodation={acc} theme={theme} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};