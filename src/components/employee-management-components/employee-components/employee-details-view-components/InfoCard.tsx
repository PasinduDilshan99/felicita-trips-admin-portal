"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { InfoCardProps, InfoRowProps } from "@/types/employee-types";

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  children,
  className = "",
  animationDelay = 0,
}) => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 1px 3px ${hexToRgba(theme.text, 0.04)}, 0 4px 16px ${hexToRgba(theme.text, 0.06)}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${animationDelay}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${animationDelay}ms`,
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.07)} 0%, ${hexToRgba(theme.primary, 0.02)} 100%)`,
          borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}`,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.12),
          }}
        >
          {icon}
        </div>
        <h2
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: theme.text, letterSpacing: "0.04em" }}
        >
          {title}
        </h2>
      </div>

      {/* Card Body */}
      <div className="px-5 py-5">{children}</div>
    </div>
  );
};

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  fullWidth,
}) => {
  const { theme } = useTheme();
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <div
        className="text-xs font-medium uppercase tracking-wider mb-1"
        style={{ color: theme.textSecondary, letterSpacing: "0.06em" }}
      >
        {label}
      </div>
      <div className="text-sm font-medium" style={{ color: theme.text }}>
        {value ?? "—"}
      </div>
    </div>
  );
};
