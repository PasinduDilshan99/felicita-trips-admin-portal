"use client";

import React, { useState, useEffect, useRef } from "react";
import { themes, useTheme } from "@/contexts/ThemeContext";
import { Palette, X, Check, ChevronRight, Sparkles } from "lucide-react";

/* ── Inject styles once ── */
const THEME_PICKER_STYLES = `
  .tp-root * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
  }

  /* Panel slide */
  @keyframes tp-slide-in {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes tp-slide-out {
    from { transform: translateX(0);     opacity: 1; }
    to   { transform: translateX(-100%); opacity: 0; }
  }

  /* Overlay fade */
  @keyframes tp-fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tp-fade-out { from { opacity: 1; } to { opacity: 0; } }

  /* Trigger button */
  @keyframes tp-pop-in {
    0%   { transform: scale(0.7) rotate(-20deg); opacity: 0; }
    70%  { transform: scale(1.1) rotate(6deg); }
    100% { transform: scale(1) rotate(0deg);   opacity: 1; }
  }

  /* Row items stagger */
  @keyframes tp-fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Active dot pulse */
  @keyframes tp-pulse {
    0%, 100% { transform: scale(1);   opacity: 1; }
    50%       { transform: scale(1.5); opacity: 0.5; }
  }

  /* Color preview shimmer */
  @keyframes tp-shimmer {
    0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
    70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
  }

  /* Trigger idle breathe */
  @keyframes tp-breathe {
    0%, 100% { box-shadow: 0 4px 16px var(--tp-glow, #3b82f680); }
    50%       { box-shadow: 0 6px 24px var(--tp-glow, #3b82f6aa); }
  }

  .tp-panel-enter { animation: tp-slide-in 0.38s cubic-bezier(0.22,1,0.36,1) both; }
  .tp-panel-exit  { animation: tp-slide-out 0.28s cubic-bezier(0.4,0,1,1) both; }

  .tp-overlay-enter { animation: tp-fade-in  0.25s ease both; }
  .tp-overlay-exit  { animation: tp-fade-out 0.20s ease both; }

  .tp-trigger { animation: tp-pop-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }

  .tp-trigger:hover {
    transform: scale(1.12) rotate(14deg) !important;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1) !important;
  }
  .tp-trigger:active {
    transform: scale(0.94) rotate(0deg) !important;
    transition: transform 0.1s ease !important;
  }

  .tp-trigger-idle { animation: tp-breathe 3s ease-in-out infinite; }

  .tp-row {
    animation: tp-fade-up 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }

  .tp-theme-btn {
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.18s cubic-bezier(0.22,1,0.36,1),
      box-shadow 0.2s ease;
    will-change: transform;
  }
  .tp-theme-btn:hover  { transform: translateX(5px); }
  .tp-theme-btn:active { transform: translateX(2px) scale(0.98); }

  .tp-swatch {
    transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease;
  }
  .tp-theme-btn:hover .tp-swatch {
    transform: scale(1.08) rotate(-3deg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .tp-apply-btn {
    transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease, filter 0.2s ease;
  }
  .tp-apply-btn:hover  { transform: scale(1.03); filter: brightness(1.08); }
  .tp-apply-btn:active { transform: scale(0.97); }

  .tp-reset-btn {
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
  }
  .tp-reset-btn:hover  { transform: scale(1.02); }
  .tp-reset-btn:active { transform: scale(0.98); }

  .tp-close-btn {
    transition: background 0.15s, transform 0.15s;
    border-radius: 8px;
  }
  .tp-close-btn:hover  { transform: rotate(90deg) scale(1.1); }
  .tp-close-btn:active { transform: rotate(90deg) scale(0.92); }

  .tp-active-dot { animation: tp-pulse 2s ease-in-out infinite; }

  .tp-color-preview { animation: tp-shimmer 2s ease-in-out infinite; }

  .tp-scrollbar::-webkit-scrollbar { width: 4px; }
  .tp-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .tp-scrollbar::-webkit-scrollbar-thumb { border-radius: 99px; background: rgba(128,128,128,0.2); }
  .tp-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.4); }

  .tp-color-input {
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tp-color-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

  /* Divider line fade */
  .tp-divider {
    flex: 1;
    height: 1px;
    opacity: 0.5;
  }
`;

let tpStylesInjected = false;
function injectTpStyles() {
  if (tpStylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = THEME_PICKER_STYLES;
  document.head.appendChild(el);
  tpStylesInjected = true;
}

const themeMeta: Record<string, { label: string; desc: string }> = {
  light: { label: "Light", desc: "Clean & minimal" },
  dark: { label: "Dark", desc: "Easy on the eyes" },
  blue: { label: "Ocean", desc: "Cool & focused" },
  green: { label: "Forest", desc: "Natural & calm" },
  purple: { label: "Violet", desc: "Creative & bold" },
  orange: { label: "Ember", desc: "Warm & energetic" },
};

const ThemeEmoji: Record<string, string> = {
  light: "☀️",
  dark: "🌙",
  blue: "🌊",
  green: "🌿",
  purple: "💜",
  orange: "🔥",
};

const ThemePicker = () => {
  injectTpStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("#3b82f6");
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    themeName,
    setTheme,
    customColor,
    setCustomColor,
    theme,
    availableThemes,
    isDarkMode,
  } = useTheme();

  const currentColor =
    customColor ??
    themes[themeName as keyof typeof themes]?.primary ??
    "#3b82f6";

  // Helper function to determine if a color is light or dark
  const isLightColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const iconColor = isLightColor(currentColor) ? "#1f2937" : "#ffffff";
  const applyButtonTextColor = isLightColor(customColorInput)
    ? "#1f2937"
    : "#ffffff";

  /* ── Close helpers ── */
  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 260);
  };

  const openPanel = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const togglePanel = () => (isOpen ? closePanel() : openPanel());

  /* ── Outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleThemeSelect = (t: string) => setTheme(t);
  const handleCustomApply = () => setCustomColor(customColorInput);
  const handleReset = () => setCustomColor(null);

  return (
    <div className="tp-root">
      {/* ── Trigger button ── */}
      <button
        onClick={togglePanel}
        className="tp-trigger tp-trigger-idle fixed left-6 bottom-8 z-[1100] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: currentColor,
          ["--tp-glow" as string]: `${currentColor}80`,
          transition: "background 0.3s ease",
        }}
        title="Theme Settings"
        aria-label="Open theme picker"
      >
        <Palette size={20} color={iconColor} />
      </button>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[1050] ${
            isClosing ? "tp-overlay-exit" : "tp-overlay-enter"
          }`}
          onClick={closePanel}
        />
      )}

      {/* ── Side Panel ── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`fixed left-0 top-0 bottom-0 w-[340px] z-[1200] flex flex-col shadow-2xl ${
            isClosing ? "tp-panel-exit" : "tp-panel-enter"
          }`}
          style={{
            background: theme.surface,
            borderRight: `1px solid ${theme.border}`,
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg, ${currentColor}, ${currentColor}55)`,
              transition: "background 0.4s ease",
              borderRadius: "0 0 3px 3px",
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "18px 20px 16px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: theme.text,
                  margin: 0,
                  marginBottom: 2,
                }}
              >
                Appearance
              </h2>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: theme.textSecondary,
                  margin: 0,
                }}
              >
                Personalise your workspace
              </p>
            </div>
            <button
              className="tp-close-btn"
              onClick={closePanel}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.background,
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`,
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div
            className="tp-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Active preview */}
            <div
              className="tp-row"
              style={{
                animationDelay: "0.05s",
                padding: "14px 16px",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: `linear-gradient(135deg, ${currentColor}14 0%, ${currentColor}07 100%)`,
                border: `1.5px solid ${currentColor}30`,
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
            >
              <div
                className="tp-color-preview"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: currentColor,
                  flexShrink: 0,
                  transition: "background 0.3s ease",
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme.text,
                    margin: 0,
                  }}
                >
                  {customColor
                    ? "Custom Color"
                    : (themeMeta[themeName]?.label ?? themeName)}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: theme.textSecondary,
                    margin: "2px 0 0",
                  }}
                >
                  {customColor
                    ? currentColor
                    : (themeMeta[themeName]?.desc ?? "Active theme")}
                </p>
              </div>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: currentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.3s ease",
                }}
              >
                <Check
                  size={13}
                  color={isLightColor(currentColor) ? "#1f2937" : "#ffffff"}
                />
              </div>
            </div>

            {/* Preset Themes */}
            <div className="tp-row" style={{ animationDelay: "0.10s" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={13} color={theme.textSecondary} />
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: theme.textSecondary,
                  }}
                >
                  Preset Themes
                </span>
                <div
                  className="tp-divider"
                  style={{ background: theme.border }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {availableThemes.map((t, i) => {
                  const meta = themeMeta[t];
                  const tPrimary = themes[t as keyof typeof themes]?.primary;
                  const isActive = themeName === t && !customColor;

                  return (
                    <button
                      key={t}
                      className="tp-theme-btn"
                      onClick={() => handleThemeSelect(t)}
                      onMouseEnter={() => setHoveredTheme(t)}
                      onMouseLeave={() => setHoveredTheme(null)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: isActive ? `${tPrimary}12` : "transparent",
                        border: `1.5px solid ${isActive ? tPrimary + "60" : theme.border}`,
                        animationDelay: `${0.12 + i * 0.04}s`,
                        textAlign: "left",
                      }}
                      aria-pressed={isActive}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: `${tPrimary}1a`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className="tp-swatch"
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            background: tPrimary,
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: theme.text,
                            margin: 0,
                          }}
                        >
                          {meta?.label ?? t}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: theme.textSecondary,
                            margin: "1px 0 0",
                          }}
                        >
                          {meta?.desc ?? ""}
                        </p>
                      </div>

                      {isActive ? (
                        <div
                          className="tp-active-dot"
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: tPrimary,
                            flexShrink: 0,
                          }}
                        />
                      ) : hoveredTheme === t ? (
                        <ChevronRight
                          size={15}
                          color={tPrimary}
                          style={{ flexShrink: 0, transition: "opacity 0.15s" }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color */}
            <div className="tp-row" style={{ animationDelay: "0.18s" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <Palette size={13} color={theme.textSecondary} />
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: theme.textSecondary,
                  }}
                >
                  Custom Color
                </span>
                <div
                  className="tp-divider"
                  style={{ background: theme.border }}
                />
              </div>

              <div
                style={{
                  borderRadius: 14,
                  padding: "14px 16px",
                  background: theme.background,
                  border: `1.5px solid ${theme.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: theme.textSecondary,
                    margin: 0,
                  }}
                >
                  Pick any color to create your custom theme
                </p>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="color"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    className="tp-color-input"
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      border: `2px solid ${theme.border}`,
                      cursor: "pointer",
                      padding: 2,
                      background: theme.background,
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: customColorInput,
                      border: `2px solid ${theme.border}`,
                      boxShadow: `0 2px 10px ${customColorInput}55`,
                      transition:
                        "background 0.15s ease, box-shadow 0.15s ease",
                    }}
                  />

                  <button
                    className="tp-apply-btn"
                    onClick={handleCustomApply}
                    style={{
                      flex: 1,
                      height: 46,
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: applyButtonTextColor,
                      background: customColorInput,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: `0 2px 10px ${customColorInput}55`,
                      transition: "background 0.15s ease",
                    }}
                  >
                    Apply
                  </button>
                </div>

                <p
                  style={{
                    margin: 0,
                    textAlign: "center",
                    fontSize: "0.72rem",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: theme.textSecondary,
                  }}
                >
                  {customColorInput.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Reset */}
            {customColor && (
              <button
                className="tp-reset-btn tp-row"
                onClick={handleReset}
                style={{
                  animationDelay: "0.22s",
                  width: "100%",
                  padding: "10px 0",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  background: "transparent",
                  border: `1.5px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                }}
              >
                ↩ Reset to {themeMeta[themeName]?.label ?? themeName} theme
              </button>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 20px",
              borderTop: `1px solid ${theme.border}`,
              textAlign: "center",
              fontSize: "0.72rem",
              color: theme.textSecondary,
              flexShrink: 0,
            }}
          >
            Theme preference is saved automatically
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
