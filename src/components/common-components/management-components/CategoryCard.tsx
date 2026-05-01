// /components/web-management/common/CategoryCard.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPageIcon, ArrowRightIcon } from "./icons";
import { hexToRgba } from "@/utils/functions";

export interface CategoryCardProps {
  id: number;
  name: string;
  description?: string;
  color: string;
  url: string;
  index: number;
  hasFullAccess: boolean;
  accessibleCount: number;
  theme: {
    surface: string;
    text: string;
    textSecondary: string;
  };
  isDarkMode: boolean;
  itemLabel?: string; // "item" or "section"
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  color,
  url,
  index,
  hasFullAccess,
  accessibleCount,
  theme,
  isDarkMode,
  itemLabel = "item",
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const IconComponent = getPageIcon(name);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 90);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const animationKey = `_wm_${color.replace("#", "")}`;

  return (
    <>
      <style>{`
        @keyframes ${animationKey}_shimmer {
          from { transform: translateX(-120%) skewX(-15deg); }
          to   { transform: translateX(280%)  skewX(-15deg); }
        }
        @keyframes ${animationKey}_float {
          0%,100% { transform: translateY(0)   scale(1);    }
          50%      { transform: translateY(-4px) scale(1.06); }
        }
        @keyframes ${animationKey}_ring {
          from { transform: translate(-50%,-50%) scale(1);   opacity: 0.5; }
          to   { transform: translate(-50%,-50%) scale(1.55); opacity: 0;   }
        }
        @keyframes ${animationKey}_arrowSlide {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>

      <Link
        ref={ref}
        href={url}
        className="group block"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          transition:
            "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          textDecoration: "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            height: "100%",
            borderRadius: 16,
            border: `1.5px solid ${hovered ? color : hexToRgba(color, 0.22)}`,
            backgroundColor: theme.surface,
            boxShadow: hovered
              ? `0 16px 40px ${hexToRgba(color, 0.15)}, 0 4px 12px ${hexToRgba(color, 0.08)}`
              : isDarkMode
                ? `0 2px 8px ${hexToRgba(color, 0.06)}`
                : "none",
            transform: hovered ? "translateY(-5px)" : "translateY(0)",
            transition:
              "border-color 0.3s ease, box-shadow 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: hovered ? 4 : 3,
              width: "100%",
              backgroundColor: color,
              transition: "height 0.25s ease",
            }}
          />

          {/* Shimmer */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent, ${hexToRgba(color, 0.07)}, transparent)`,
                animation: `${animationKey}_shimmer 0.65s ease-out forwards`,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {/* Corner tint */}
          <div
            style={{
              position: "absolute",
              top: -24,
              right: -24,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: hexToRgba(color, hovered ? 0.09 : 0.03),
              transition: "background 0.35s ease",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              padding: "24px 20px 22px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <div style={{ position: "relative", marginBottom: 18 }}>
                {hovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: `1.5px solid ${hexToRgba(color, 0.45)}`,
                      animation: `${animationKey}_ring 0.75s ease-out forwards`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    backgroundColor: hexToRgba(color, hovered ? 0.18 : 0.1),
                    border: `1.5px solid ${hexToRgba(color, hovered ? 0.45 : 0.18)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color,
                    animation: hovered
                      ? `${animationKey}_float 1.8s ease-in-out infinite`
                      : "none",
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease",
                    filter: `drop-shadow(0 2px 6px ${hexToRgba(color, hovered ? 0.3 : 0)})`,
                  }}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
              </div>

              {/* Name */}
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: hovered ? color : theme.text,
                  transition: "color 0.25s ease",
                }}
              >
                {name}
              </h3>

              {/* Description */}
              {description && (
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "0.8rem",
                    lineHeight: 1.55,
                    color: theme.textSecondary,
                  }}
                >
                  {description}
                </p>
              )}

              {/* Partial access badge */}
              {!hasFullAccess && accessibleCount > 0 && (
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: 10,
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    backgroundColor: hexToRgba(color, 0.1),
                    color: color,
                    border: `1px solid ${hexToRgba(color, 0.25)}`,
                  }}
                >
                  {accessibleCount} accessible{" "}
                  {accessibleCount === 1 ? itemLabel : `${itemLabel}s`}
                </span>
              )}

              {/* CTA arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: color,
                  animation: hovered
                    ? `${animationKey}_arrowSlide 0.25s ease-out forwards`
                    : "none",
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{hasFullAccess ? "Manage All" : "View Accessible"}</span>
                <ArrowRightIcon
                  className="w-4 h-4"
                  style={{
                    transform: hovered ? "translateX(3px)" : "translateX(0)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </div>
            </div>
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
              backgroundColor: color,
              transition:
                "width 0.35s cubic-bezier(0.22,1,0.36,1), left 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </Link>
    </>
  );
};