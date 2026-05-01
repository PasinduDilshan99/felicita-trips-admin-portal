// /components/web-management/common/TipBar.tsx

import React from "react";
import { InfoIcon } from "./icons";

interface TipBarProps {
  theme: {
    border: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
  title: string;
  message: string;
  visible?: boolean;
}

export const TipBar: React.FC<TipBarProps> = ({
  theme,
  title,
  message,
  visible = true,
}) => {
  return (
    <div
      style={{
        marginTop: 28,
        borderRadius: 14,
        border: `1.5px solid ${theme.border}`,
        backgroundColor: theme.surface,
        padding: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition:
          "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <InfoIcon className="w-5 h-5" style={{ color: theme.primary }} />
      </div>
      <div>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: theme.text,
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            lineHeight: 1.55,
            color: theme.textSecondary,
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};