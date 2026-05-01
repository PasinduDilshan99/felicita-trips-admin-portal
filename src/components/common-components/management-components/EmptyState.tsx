// /components/web-management/common/EmptyState.tsx

import React from "react";
import Link from "next/link";
import { LockIcon, BackIcon } from "./icons";
import { hexToRgba } from "@/utils/functions";

interface EmptyStateProps {
  theme: {
    background: string;
    border: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  title: string;
  description: string;
  backLink: string;
  backLinkText: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  theme,
  title,
  description,
  backLink,
  backLinkText,
}) => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        transition: "background-color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
        <div
          style={{
            marginTop: 32,
            borderRadius: 16,
            border: `1.5px dashed ${theme.border}`,
            backgroundColor: theme.surface,
            padding: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: hexToRgba(theme.textSecondary, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LockIcon className="w-7 h-7" style={{ color: theme.textSecondary }} />
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: theme.text,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "0 0 20px",
              color: theme.textSecondary,
              fontSize: "0.9rem",
            }}
          >
            {description}
          </p>
          <Link
            href={backLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              borderRadius: 10,
              backgroundColor: theme.primary,
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}
          >
            <BackIcon className="w-4 h-4" />
            {backLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
};