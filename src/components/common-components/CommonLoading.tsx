// components/common-components/CommonLoading.tsx
"use client";

import React, { useEffect, useState } from "react";

export interface CommonLoadingProps {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

const MESSAGES = [
  "Preparing your experience…",
  "Finding the best destinations…",
  "Crafting your journey…",
];

const CommonLoading: React.FC<CommonLoadingProps> = ({
  message,
  subMessage,
  size = "md",
  fullScreen = false,
  className = "",
}) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);

  useEffect(() => {
    if (message) return; // static message — skip cycling
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setMsgVisible(true);
      }, 320);
    }, 2600);
    return () => clearInterval(interval);
  }, [message]);

  const sizeConfig = {
    sm: { globe: 48, logoText: "text-xl", tagText: "text-[9px]", dot: "w-1.5 h-1.5", msgText: "text-xs" },
    md: { globe: 72, logoText: "text-[28px]", tagText: "text-[11px]", dot: "w-1.5 h-1.5", msgText: "text-[13px]" },
    lg: { globe: 96, logoText: "text-4xl", tagText: "text-xs", dot: "w-2 h-2", msgText: "text-sm" },
  };

  const cfg = sizeConfig[size];

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center overflow-hidden
        rounded-2xl
        ${fullScreen ? "fixed inset-0 z-50" : ""}
        ${className}
      `}
      style={{
        background: fullScreen ? "rgba(240,248,246,0.92)" : "#f0f8f6",
        backdropFilter: fullScreen ? "blur(6px)" : undefined,
        minHeight: fullScreen ? undefined : 340,
      }}
    >
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width:  [160, 260, 360][i],
            height: [160, 260, 360][i],
            borderColor: "rgba(32,178,150,0.12)",
            animation: `ft-expand 3s ease-out ${i * 0.6}s infinite`,
          }}
        />
      ))}

      {/* Globe + orbiting plane */}
      <div
        className="relative z-10"
        style={{
          width: cfg.globe,
          height: cfg.globe,
          animation: "ft-float 3.2s ease-in-out infinite",
        }}
      >
        <svg
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <circle cx="36" cy="36" r="28" fill="#e8f7f4" stroke="#20b296" strokeWidth="1.2" />
          <ellipse cx="36" cy="36" rx="14" ry="28" fill="none" stroke="#20b296" strokeWidth="0.9" />
          <ellipse cx="36" cy="36" rx="28" ry="10" fill="none" stroke="#20b296" strokeWidth="0.9" />
          <line x1="8" y1="36" x2="64" y2="36" stroke="#20b296" strokeWidth="0.8" />
          <line x1="36" y1="8" x2="36" y2="64" stroke="#20b296" strokeWidth="0.8" />
        </svg>

        {/* Plane orbit */}
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ animation: "ft-orbit 3.2s linear infinite" }}
        >
          <svg
            viewBox="0 0 72 72"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <g transform="rotate(45, 36, 36)">
              <text x="63" y="39" fontSize="13" textAnchor="middle" dominantBaseline="middle">
                ✈
              </text>
            </g>
          </svg>
        </span>
      </div>

      {/* Brand name */}
      <p
        className={`z-10 mt-5 font-light tracking-widest text-[#1a6b5a] ${cfg.logoText}`}
        style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", letterSpacing: "0.08em" }}
      >
        Felicita Trips
      </p>

      {/* Tagline / subMessage */}
      <p
        className={`z-10 mt-1 uppercase tracking-[0.3em] text-[#5fa898] ${cfg.tagText}`}
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {subMessage ?? "Your world. Your journey."}
      </p>

      {/* Dots */}
      <div className="z-10 flex gap-2 mt-7">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`rounded-full bg-[#20b296] ${cfg.dot}`}
            style={{ animation: `ft-pulse 1.4s ease-in-out ${i * 0.22}s infinite` }}
          />
        ))}
      </div>

      {/* Cycling message */}
      <p
        className={`z-10 mt-3 text-[#5fa898] ${cfg.msgText}`}
        style={{
          opacity: msgVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          minHeight: "1.25rem",
          letterSpacing: "0.04em",
        }}
      >
        {message ?? MESSAGES[msgIndex]}
      </p>

      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&family=Jost:wght@300&display=swap');

        @keyframes ft-expand {
          0%   { opacity: 0.6; transform: scale(0.85); }
          100% { opacity: 0;   transform: scale(1.1); }
        }
        @keyframes ft-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes ft-orbit {
          from { transform: rotate(0deg)   translateX(${cfg.globe / 2}px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(${cfg.globe / 2}px) rotate(-360deg); }
        }
        @keyframes ft-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%       { opacity: 1;    transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CommonLoading;