"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  EmergencyContactsCardProps,
  ShiftsCardProps,
} from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { InfoCard } from "./InfoCard";
import { formatDate } from "@/utils/utils";

export const ShiftsCard: React.FC<ShiftsCardProps> = ({
  shifts,
  animationDelay = 0,
}) => {
  const { theme } = useTheme();

  return (
    <InfoCard title="Shifts" icon="🕐" animationDelay={animationDelay}>
      {!shifts?.length ? (
        <EmptyState message="No shifts assigned" />
      ) : (
        <div className="space-y-3">
          {shifts.map((shift, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.04),
                border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                boxShadow: `0 1px 4px ${hexToRgba(theme.text, 0.04)}`,
              }}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className="font-semibold text-sm"
                  style={{ color: theme.text }}
                >
                  {shift.shiftName}
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.1),
                    color: theme.primary,
                  }}
                >
                  {shift.startTime} – {shift.endTime}
                </span>
              </div>
              <div
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: theme.textSecondary }}
              >
                <span>📅</span>
                {formatDate(shift.effectiveFrom)} —{" "}
                {shift.effectiveTo ? formatDate(shift.effectiveTo) : "Present"}
              </div>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({
  contacts,
  animationDelay = 0,
}) => {
  const { theme } = useTheme();

  return (
    <InfoCard
      title="Emergency Contacts"
      icon="🚨"
      animationDelay={animationDelay}
    >
      {!contacts?.length ? (
        <EmptyState message="No emergency contacts added" />
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.04),
                border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                boxShadow: `0 1px 4px ${hexToRgba(theme.text, 0.04)}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: theme.text }}
                  >
                    {contact.contactName}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    {contact.relationship}
                  </div>
                </div>
                {contact.primary && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.12),
                      color: theme.primary,
                    }}
                  >
                    Primary
                  </span>
                )}
              </div>
              <div
                className="mt-3 space-y-1 text-xs"
                style={{ color: theme.textSecondary }}
              >
                <div className="flex items-center gap-1.5">
                  <span>📞</span> {contact.primaryPhone}
                </div>
                {contact.secondaryPhone && (
                  <div className="flex items-center gap-1.5">
                    <span>📞</span> {contact.secondaryPhone}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span>✉️</span> {contact.email}
                </div>
                {contact.address && (
                  <div className="flex items-center gap-1.5">
                    <span>📍</span> {contact.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  const { theme } = useTheme();
  return (
    <div
      className="flex flex-col items-center justify-center py-8 rounded-xl"
      style={{
        backgroundColor: hexToRgba(theme.textSecondary, 0.04),
        border: `1px dashed ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <span className="text-2xl mb-2 opacity-40">📭</span>
      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {message}
      </p>
    </div>
  );
};
