"use client";

import { useAuth } from "@/contexts/AuthContext";
import { homeCardData } from "@/data/home-page-data";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Helpers ────────────────────────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ─── Card Component ──────────────────────────────────────────────────────────

interface CardProps {
  card: (typeof homeCardData)[number];
  index: number;
  onClick: () => void;
  theme: ReturnType<typeof import("@/contexts/ThemeContext").useTheme>["theme"];
  isDarkMode: boolean;
}

const DashboardCard: React.FC<CardProps> = ({
  card,
  index,
  onClick,
  theme,
  isDarkMode,
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group cursor-pointer"
      onClick={onClick}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(28px) scale(0.97)",
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      <style>{`
        @keyframes _shimmer {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%)  skewX(-12deg); }
        }
        @keyframes _iconFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-4px) scale(1.05); }
        }
        @keyframes _pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          overflow: "hidden",
          height: "100%",
          border: `1.5px solid ${hovered ? card.color : hexToRgba(card.color, 0.25)}`,
          borderRadius: "16px",
          padding: "28px 20px 24px",
          backgroundColor: theme.surface,
          boxShadow: hovered
            ? `0 16px 40px ${hexToRgba(card.color, 0.18)}, 0 4px 12px ${hexToRgba(card.color, 0.1)}`
            : isDarkMode
              ? `0 2px 10px ${hexToRgba(card.color, 0.08)}`
              : "none",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          transition:
            "border-color 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1), background-color 0.3s ease",
        }}
      >
        {/* Shimmer sweep */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, ${hexToRgba(card.color, 0.07)} 50%, transparent 100%)`,
              animation: "_shimmer 0.7s ease-out forwards",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Subtle tinted corner glow */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: hexToRgba(card.color, hovered ? 0.1 : 0.04),
            transition: "background 0.35s ease",
            pointerEvents: "none",
          }}
        />

        {/* Icon container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
            zIndex: 1,
          }}
        >
          {/* Pulse ring on hover */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: `1.5px solid ${hexToRgba(card.color, 0.5)}`,
                animation: "_pulse-ring 0.8s ease-out forwards",
              }}
            />
          )}

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              backgroundColor: hexToRgba(card.color, hovered ? 0.2 : 0.1),
              border: `1.5px solid ${hexToRgba(card.color, hovered ? 0.5 : 0.2)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: hovered
                ? "_iconFloat 1.8s ease-in-out infinite"
                : "none",
              transition: "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            <img
              src={card.iconUrl}
              alt={card.name}
              style={{
                width: 30,
                height: 30,
                objectFit: "contain",
                filter: `drop-shadow(0 2px 6px ${hexToRgba(card.color, 0.4)})`,
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: card.color,
              transition: "color 0.2s ease",
            }}
          >
            {card.name}
          </h3>

          {card.description && (
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: theme.textSecondary,
                transition: "color 0.3s ease",
              }}
            >
              {card.description}
            </p>
          )}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: hovered ? 0 : "50%",
            width: hovered ? "100%" : "0%",
            height: 3,
            borderRadius: "0 0 16px 16px",
            backgroundColor: card.color,
            transition:
              "width 0.35s cubic-bezier(0.22,1,0.36,1), left 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

const HomePage = () => {
  const router = useRouter();
  const { hasPrivilege } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const filteredCards = homeCardData.filter((card) =>
    hasPrivilege(card.privilege),
  );

  // ─── Empty state ────────────────────────────────────────────────────────
  if (filteredCards.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          backgroundColor: theme.background,
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: theme.text, transition: "color 0.3s ease" }}
          >
            Access Restricted
          </h1>
          <p className="text-lg mb-6" style={{ color: theme.textSecondary }}>
            You don't have access to any management modules. Please contact your
            administrator.
          </p>
          <div
            className="p-8 border-2 border-dashed rounded-xl"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.surface,
            }}
          >
            <p style={{ color: theme.textSecondary }}>
              No accessible modules found for your user role.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Grid columns ────────────────────────────────────────────────────────
  const count = filteredCards.length;
  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : count === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : count === 4
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        transition: "background-color 0.3s ease",
        padding: "80px 24px 64px",
      }}
    >
      <style>{`
        @keyframes _fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="mx-auto mb-14 text-center"
        style={{
          maxWidth: 720,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(18px)",
          transition:
            "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            padding: "5px 14px",
            borderRadius: 999,
            border: `1px solid ${hexToRgba(theme.text, 0.12)}`,
            backgroundColor: hexToRgba(theme.text, 0.04),
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
              animation: "_pulse-dot 2s ease-in-out infinite",
            }}
          />
          <style>{`@keyframes _pulse-dot { 0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,0.2);} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0.1);} }`}</style>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: theme.textSecondary,
              textTransform: "uppercase",
            }}
          >
            Admin Portal
          </span>
        </div>

        <h1
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: theme.text,
          }}
        >
          Business Management
          <br />
          <span
            style={{
              color: theme.textSecondary,
              fontWeight: 400,
              fontSize: "0.85em",
            }}
          >
            Dashboard
          </span>
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: 1.65,
            color: theme.textSecondary,
          }}
        >
          Centralized platform to manage all your business operations including
          travel, employees, hotels, vehicles, and enterprise resource planning
          systems.
        </p>
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className={`grid ${gridClass} gap-5`}>
          {filteredCards.map((card, index) => (
            <DashboardCard
              key={card.id}
              card={card}
              index={index}
              onClick={() => router.push(card.linkTo)}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
