"use client";

import React from "react";

export const ACTION_CONFIG: Record<
  string,
  { accent: string; icon: React.ReactNode; pillLabel: string }
> = {
  view: {
    accent: "blue",
    pillLabel: "Browse",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  add: {
    accent: "emerald",
    pillLabel: "Create",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  update: {
    accent: "amber",
    pillLabel: "Edit",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
        <path d="M17.586 3.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  remove: {
    accent: "rose",
    pillLabel: "Remove",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  default: {
    accent: "violet",
    pillLabel: "Manage",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
};

export const getActionConfig = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("view") || lower.includes("all"))
    return ACTION_CONFIG.view;
  if (lower.includes("add") || lower.includes("create"))
    return ACTION_CONFIG.add;
  if (lower.includes("update") || lower.includes("edit"))
    return ACTION_CONFIG.update;
  if (
    lower.includes("remove") ||
    lower.includes("delete") ||
    lower.includes("terminate")
  )
    return ACTION_CONFIG.remove;
  return ACTION_CONFIG.default;
};
