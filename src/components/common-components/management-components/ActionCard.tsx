// /components/web-management/common/ActionCard.tsx

"use client";

import React from "react";
import { hexToRgba } from "@/utils/functions";

export interface ActionCardProps {
  id: number;
  name: string;
  description?: string;
  url: string;
  accent: string;
  icon: React.ReactNode;
  pillLabel?: string;
  ctaText?: string;
  theme: {
    primary?: string;
    accent?: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDarkMode: boolean;
  onClick?: () => void;
}

const ACCENT_MAP: Record<string, { bg: string; soft: string; fg: string; mid: string; border: string; glow: string }> = {
  blue:    { bg: "#eff6ff", soft: "#dbeafe", fg: "#1e40af", mid: "#3b82f6", border: "#bfdbfe", glow: "59,130,246" },
  emerald: { bg: "#f0fdf4", soft: "#d1fae5", fg: "#065f46", mid: "#10b981", border: "#a7f3d0", glow: "16,185,129" },
  amber:   { bg: "#fffbeb", soft: "#fef3c7", fg: "#92400e", mid: "#f59e0b", border: "#fde68a", glow: "245,158,11" },
  rose:    { bg: "#fff1f2", soft: "#ffe4e6", fg: "#9f1239", mid: "#f43f5e", border: "#fecdd3", glow: "244,63,94"  },
  violet:  { bg: "#f5f3ff", soft: "#ede9fe", fg: "#5b21b6", mid: "#8b5cf6", border: "#ddd6fe", glow: "139,92,246" },
  teal:    { bg: "#f0fdfa", soft: "#ccfbf1", fg: "#134e4a", mid: "#14b8a6", border: "#99f6e4", glow: "20,184,166" },
};

export const ActionCard: React.FC<ActionCardProps> = ({
  name,
  description,
  url,
  accent,
  icon,
  pillLabel = "Manage",
  ctaText = "Open",
  theme,
  isDarkMode,
  onClick,
}) => {
  const ac = ACCENT_MAP[accent] ?? ACCENT_MAP.violet;

  return (
    <>
      <style>{`
        @keyframes _ac_shimmer {
          0%   { transform: translateX(-110%) skewX(-14deg); opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateX(230%)  skewX(-14deg); opacity: 0; }
        }
        @keyframes _ac_iconFloat {
          0%   { transform: translateY(0)    scale(1);    }
          50%  { transform: translateY(-3px) scale(1.08); }
          100% { transform: translateY(0)    scale(1);    }
        }
        @keyframes _ac_arrowNudge {
          0%   { transform: translateX(0);   }
          50%  { transform: translateX(5px); }
          100% { transform: translateX(0);   }
        }
        @keyframes _ac_dotWave {
          0%, 100% { transform: translateY(0)    scale(1);    opacity: var(--dot-base-opacity); }
          40%       { transform: translateY(-4px) scale(1.25); opacity: 1; }
          70%       { transform: translateY(1px)  scale(0.9);  opacity: var(--dot-base-opacity); }
        }

        ._ac-dot {
          border-radius: 50%;
          background: var(--ac-dot-color);
          opacity: var(--dot-base-opacity);
          transition: opacity 0.2s ease;
        }
        ._ac-root:hover ._ac-dot:nth-child(1) {
          animation: _ac_dotWave 0.7s cubic-bezier(0.34,1.56,0.64,1) 0ms    infinite;
        }
        ._ac-root:hover ._ac-dot:nth-child(2) {
          animation: _ac_dotWave 0.7s cubic-bezier(0.34,1.56,0.64,1) 100ms  infinite;
        }
        ._ac-root:hover ._ac-dot:nth-child(3) {
          animation: _ac_dotWave 0.7s cubic-bezier(0.34,1.56,0.64,1) 200ms  infinite;
        }

        ._ac-root {
          display: block;
          text-decoration: none;
          border-radius: 14px;
          padding: 1.125rem 1rem 0.9rem;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          isolation: isolate;
          will-change: transform, box-shadow;
          transition:
            transform    0.5s  cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow   0.4s  cubic-bezier(0.22, 1,    0.36, 1),
            border-color 0.35s ease;
        }
        ._ac-root:hover {
          transform: translateY(-5px) scale(1.013);
          box-shadow:
            0 0 0 1.5px rgba(${ac.glow}, 0.2),
            0 6px 18px   rgba(${ac.glow}, 0.13),
            0 18px 40px  rgba(15, 23, 42, 0.07);
        }
        ._ac-root:active {
          transform: translateY(-2px) scale(1.005);
          transition-duration: 0.1s;
        }

        ._ac-shimmer {
          position: absolute;
          inset-y: 0; left: 0;
          width: 50%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
          transform: translateX(-110%) skewX(-14deg);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
        }
        ._ac-root:hover ._ac-shimmer {
          animation: _ac_shimmer 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        ._ac-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          background: radial-gradient(ellipse 80% 55% at 50% -5%, rgba(${ac.glow}, 0.1) 0%, transparent 68%);
        }
        ._ac-root:hover ._ac-glow { opacity: 1; }

        ._ac-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2.5px;
          border-radius: 0 0 14px 14px;
          background: linear-gradient(90deg, ${ac.mid}bb, ${ac.mid}, ${ac.mid}bb);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        ._ac-root:hover ._ac-bar { transform: scaleX(1); }

        ._ac-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: box-shadow 0.35s ease;
        }
        ._ac-root:hover ._ac-icon-wrap {
          animation: _ac_iconFloat 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          box-shadow: 0 5px 14px rgba(${ac.glow}, 0.28);
        }

        ._ac-cta-arrow {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        ._ac-cta-arrow svg {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        ._ac-root:hover ._ac-cta-arrow svg {
          animation: _ac_arrowNudge 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        ._ac-name {
          transition: color 0.25s ease;
        }
        ._ac-root:hover ._ac-name { color: ${ac.fg}; }
      `}</style>

      <a
        href={url}
        className="_ac-root"
        onClick={onClick}
        style={{
          background: theme.surface,
          border: `1.5px solid ${theme.border}`,
        }}
      >
        {/* Layered bg effects */}
        <div className="_ac-glow" />
        <div className="_ac-shimmer" />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0.875rem" }}>

          {/* Top row: icon + pill */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div
              className="_ac-icon-wrap"
              style={{
                background: ac.soft,
                color: ac.fg,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 3px rgba(${ac.glow},0.15)`,
              }}
            >
              {icon}
            </div>

            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: 999,
                border: `1px solid ${ac.border}`,
                background: ac.bg,
                color: ac.fg,
                lineHeight: 1.6,
                userSelect: "none",
              }}
            >
              {pillLabel}
            </span>
          </div>

          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <p
              className="_ac-name"
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: theme.text,
                margin: 0,
                letterSpacing: "-0.013em",
                lineHeight: 1.3,
              }}
            >
              {name}
            </p>
            {description && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: theme.textSecondary,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${ac.border} 0%, transparent 100%)`,
              borderRadius: 1,
              opacity: 0.6,
            }}
          />

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="_ac-cta-arrow"
              style={{
                fontSize: "0.775rem",
                fontWeight: 600,
                color: ac.fg,
                letterSpacing: "0.01em",
              }}
            >
              {ctaText}
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>

            {/* Accent dot cluster */}
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {([
                { size: 6, opacity: 1   },
                { size: 4, opacity: 0.45 },
                { size: 4, opacity: 0.2  },
              ] as const).map(({ size, opacity }, i) => (
                <div
                  key={i}
                  className="_ac-dot"
                  style={{
                    width: size,
                    height: size,
                    ["--dot-base-opacity" as string]: opacity,
                    ["--ac-dot-color" as string]: ac.mid,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="_ac-bar"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2.5px",
            borderRadius: "0 0 14px 14px",
            background: `linear-gradient(90deg, ${ac.mid}bb, ${ac.mid}, ${ac.mid}bb)`,
            transform: "scaleX(0)",
            transformOrigin: "center",
          }}
        />
      </a>
    </>
  );
};