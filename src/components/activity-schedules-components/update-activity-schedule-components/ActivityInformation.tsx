"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";
import { ActivityScheduleDetails } from "@/types/activity-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  },
};

interface ActivityInformationProps {
  schedule: ActivityScheduleDetails;
  formatPrice: (price: number) => string;
}

export const ActivityInformation: React.FC<ActivityInformationProps> = ({ schedule, formatPrice }) => {
  const { theme } = useTheme();

  const InfoCard = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
      <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>{label}</p>
      <p className={`text-sm ${highlight ? 'font-semibold' : ''}`} style={{ color: highlight ? theme.success : theme.text }}>
        {value}
      </p>
    </div>
  );

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
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ backgroundColor: `${theme.success}18`, color: theme.success }}
        >
          <Calendar className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
            Activity Information
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Read-only activity details
          </p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Activity Name" value={schedule.activityName} />
          <InfoCard label="Destination" value={schedule.destinationName} />
          <InfoCard label="Duration" value={`${schedule.durationHours} hours`} />
          <InfoCard label="Season" value={schedule.season} />
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Clock className="w-3 h-3" /> Available Time
            </p>
            <p className="text-sm" style={{ color: theme.text }}>
              {schedule.availableFrom?.slice(0,5)} - {schedule.availableTo?.slice(0,5)}
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
            <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <Users className="w-3 h-3" /> Participants
            </p>
            <p className="text-sm" style={{ color: theme.text }}>
              Min: {schedule.minParticipate} | Max: {schedule.maxParticipate}
            </p>
          </div>
          <InfoCard label="Local Price" value={formatPrice(schedule.priceLocal)} highlight />
          <InfoCard label="Foreigners Price" value={formatPrice(schedule.priceForeigners)} highlight />
          <InfoCard label="Activity Status" value={schedule.activityStatus} highlight={schedule.activityStatus === "ACTIVE"} />
        </div>
        {schedule.activityDescription && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${theme.border}10` }}>
            <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>Activity Description</p>
            <p className="text-sm" style={{ color: theme.textSecondary }}>{schedule.activityDescription}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};