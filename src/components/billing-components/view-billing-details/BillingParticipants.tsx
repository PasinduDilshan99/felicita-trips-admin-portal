"use client";

import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BookingParticipant } from "@/types/billing-types";
import { hexToRgba } from "@/utils/functions";

interface BillingParticipantsProps {
  participants: BookingParticipant[];
}

export const BillingParticipants: React.FC<BillingParticipantsProps> = ({
  participants,
}) => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const visibleParticipants = showAll ? participants : participants.slice(0, 5);
  const hasMore = participants.length > 5;

  if (!participants.length) {
    return null;
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-base sm:text-lg font-semibold flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <Users
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: theme.primary }}
            />
            Participants
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {participants.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="space-y-2">
          {visibleParticipants.map((participant, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                backgroundColor:
                  idx % 2 === 0
                    ? hexToRgba(theme.primary, 0.03)
                    : "transparent",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text }}
                >
                  {participant.firstName} {participant.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Passport: {participant.passportNumber}
                </p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-xs font-medium mt-3 transition-colors hover:opacity-80"
            style={{ color: theme.primary }}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {participants.length} Participants
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
