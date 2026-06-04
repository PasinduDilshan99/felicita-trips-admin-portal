"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TourInformationProps } from "@/types/tour-schedule-types";
import { cardVariants } from "@/app/animations/variants";

export const TourInformation: React.FC<TourInformationProps> = ({
  schedule,
}) => {
  const { theme } = useTheme();

  const InfoCard = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }) => (
    <div
      className="p-3 rounded-lg"
      style={{ backgroundColor: `${theme.border}10` }}
    >
      <p
        className="text-xs font-medium mb-1"
        style={{ color: theme.textSecondary }}
      >
        {label}
      </p>
      <p
        className={`text-sm ${highlight ? "font-semibold" : ""}`}
        style={{ color: highlight ? theme.success : theme.text }}
      >
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
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: `${theme.success}18`,
            color: theme.success,
          }}
        >
          <MapPin className="w-4 h-4" />
        </span>
        <div>
          <h2
            className="text-sm sm:text-base font-semibold"
            style={{ color: theme.text }}
          >
            Tour Information
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Read-only tour details
          </p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Tour Name" value={schedule.tourName} />
          <InfoCard
            label="Tour Duration"
            value={`${schedule.tourDuration} days`}
          />
          <InfoCard label="Start Location" value={schedule.startLocation} />
          <InfoCard label="End Location" value={schedule.endLocation} />
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${theme.border}10` }}
          >
            <p
              className="text-xs font-medium mb-1 flex items-center gap-1"
              style={{ color: theme.textSecondary }}
            >
              <Navigation className="w-3 h-3" /> Coordinates
            </p>
            <p className="text-sm" style={{ color: theme.text }}>
              Lat: {schedule.latitude} | Lng: {schedule.longitude}
            </p>
          </div>
          <InfoCard label="Season" value={schedule.season || "Not specified"} />
          <InfoCard
            label="Tour Status"
            value={schedule.tourStatus}
            highlight={schedule.tourStatus === "ACTIVE"}
          />
          <InfoCard
            label="Assign Message"
            value={schedule.assignMessage || "No message"}
          />
        </div>
        {schedule.tourDescription && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${theme.border}10` }}
          >
            <p
              className="text-xs font-medium mb-1"
              style={{ color: theme.textSecondary }}
            >
              Tour Description
            </p>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {schedule.tourDescription}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
