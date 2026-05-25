// components/package-schedules-components/PackageScheduleReadOnlyDetails.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Package,
  Hotel,
  Bus,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cake,
  Info,
  Star,
  ChevronDown,
} from "lucide-react";
import { PackageScheduleDetails, PackageScheduleFeature, PackageScheduleAccommodation } from "@/types/package-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { hexToRgba } from "@/utils/functions";

interface PackageScheduleReadOnlyDetailsProps {
  schedule: PackageScheduleDetails;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

export const PackageScheduleReadOnlyDetails: React.FC<PackageScheduleReadOnlyDetailsProps> = ({
  schedule,
  expandedSections,
  onToggleSection,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
      {/* Package Information Section */}
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
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.success}18`, color: theme.success }}
          >
            <Package className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Package Information
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              Read-only package details
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Package Name" value={schedule.packageName} theme={theme} />
            <InfoCard label="Package Type" value={schedule.packageTypeName} theme={theme} />
            <InfoCard label="Tour" value={schedule.tourName} theme={theme} />
            <InfoCard label="Tour Schedule" value={schedule.tourScheduleName || "Not assigned"} theme={theme} />
            <InfoCard 
              label="Price Per Person" 
              value={formatPrice(schedule.pricePerPerson)} 
              theme={theme} 
              highlight 
            />
            <InfoCard 
              label="Person Count" 
              value={`Min: ${schedule.minPersonCount} | Max: ${schedule.maxPersonCount}`} 
              theme={theme} 
            />
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      {schedule.features && schedule.features.length > 0 && (
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
            onClick={() => onToggleSection("features")}
            className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
            style={{
              backgroundColor: expandedSections.has("features") ? `${theme.warning}05` : "transparent",
              borderBottom: expandedSections.has("features") ? `1px solid ${theme.border}` : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: `${theme.warning}18`, color: theme.warning }}
              >
                <Star className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
                  Package Features
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  Read-only feature list ({schedule.features.length} features)
                </p>
              </div>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{ 
                transform: expandedSections.has("features") ? "rotate(180deg)" : "none", 
                color: theme.textSecondary 
              }}
            />
          </button>

          {expandedSections.has("features") && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schedule.features.map((feature) => (
                  <FeatureCard key={feature.featureId} feature={feature} theme={theme} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Accommodations Section */}
      {schedule.accommodations && schedule.accommodations.length > 0 && (
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
                  Read-only accommodation details ({schedule.accommodations.length} days)
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

          {expandedSections.has("accommodations") && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="p-6 space-y-4">
              {schedule.accommodations.map((acc) => (
                <AccommodationCard key={acc.accommodationId} accommodation={acc} theme={theme} formatPrice={formatPrice} />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Sub-component for Info Cards
const InfoCard: React.FC<{
  label: string;
  value: string | number;
  theme: any;
  highlight?: boolean;
}> = ({ label, value, theme, highlight = false }) => (
  <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
    <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>{label}</p>
    <p className={`text-sm ${highlight ? 'font-semibold' : ''}`} style={{ color: highlight ? theme.success : theme.text }}>
      {value}
    </p>
  </div>
);

// Sub-component for Feature Cards
const FeatureCard: React.FC<{
  feature: PackageScheduleFeature;
  theme: any;
}> = ({ feature, theme }) => (
  <div
    className="p-3 rounded-lg transition-all hover:scale-[1.02]"
    style={{
      backgroundColor: hexToRgba(feature.color, 0.08),
      border: `1px solid ${hexToRgba(feature.color, 0.3)}`,
    }}
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: feature.color }} />
      <span className="text-sm font-semibold" style={{ color: feature.color }}>
        {feature.name}: {feature.value}
      </span>
    </div>
    {feature.description && (
      <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
        {feature.description}
      </p>
    )}
    {feature.specialNote && (
      <div className="flex items-center gap-1 mt-1">
        <Info className="w-3 h-3" style={{ color: theme.textSecondary }} />
        <p className="text-xs italic" style={{ color: theme.textSecondary }}>
          {feature.specialNote}
        </p>
      </div>
    )}
  </div>
);

// Sub-component for Accommodation Cards
const AccommodationCard: React.FC<{
  accommodation: PackageScheduleAccommodation;
  theme: any;
  formatPrice: (price: number) => string;
}> = ({ accommodation: acc, theme, formatPrice }) => (
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
        {acc.dayNumber}
      </div>
      <div>
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
          Day {acc.dayNumber}
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

      {/* Pricing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
        <PriceCard label="Local Price" value={formatPrice(acc.localPrice)} theme={theme} />
        <PriceCard label="Price" value={formatPrice(acc.price)} theme={theme} highlight />
        <PriceCard label="Transport Cost" value={formatPrice(acc.transportCost)} theme={theme} />
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
          <p className="text-xs" style={{ color: theme.textSecondary }}>Discount</p>
          <p className="text-sm font-semibold" style={{ color: theme.text }}>{acc.discount}%</p>
        </div>
      </div>

      {/* Extra Charge */}
      {acc.extraChargeNote && (
        <div className="p-2 rounded-lg text-center" style={{ backgroundColor: `${theme.error}10` }}>
          <p className="text-xs">Extra Charge: {formatPrice(acc.extraCharge)} - {acc.extraChargeNote}</p>
        </div>
      )}
    </div>
  </div>
);

// Sub-component for Meal Badges
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

// Sub-component for Price Cards
const PriceCard: React.FC<{
  label: string;
  value: string;
  theme: any;
  highlight?: boolean;
}> = ({ label, value, theme, highlight = false }) => (
  <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
    <p className="text-xs" style={{ color: theme.textSecondary }}>{label}</p>
    <p className={`text-sm ${highlight ? 'font-semibold' : ''}`} style={{ color: highlight ? theme.success : theme.text }}>
      {value}
    </p>
  </div>
);