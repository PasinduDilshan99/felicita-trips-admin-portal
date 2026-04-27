"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { webManagementSideBarData } from "@/data/side-bar-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const hexToRgba = (hex: string, opacity: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const getIcon = (name: string) => {
  const props = {
    className: "w-7 h-7",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  };
  const sw = {
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.75,
  };

  switch (name.toLowerCase()) {
    case "destinations":
      return (
        <svg {...props}>
          <path
            {...sw}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path {...sw} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "activities":
      return (
        <svg {...props}>
          <path {...sw} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "tours":
      return (
        <svg {...props}>
          <path
            {...sw}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      );
    case "packages":
      return (
        <svg {...props}>
          <path
            {...sw}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path
            {...sw}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
  }
};

// ─── Card ─────────────────────────────────────────────────────────────────────

type Category = (typeof webManagementSideBarData)[number];

interface CardProps {
  category: Category;
  index: number;
  hasFullAccess: boolean;
  accessibleCount: number;
  theme: ReturnType<typeof import("@/contexts/ThemeContext").useTheme>["theme"];
  isDarkMode: boolean;
}

const CategoryCard: React.FC<CardProps> = ({
  category,
  index,
  hasFullAccess,
  accessibleCount,
  theme,
  isDarkMode,
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

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

  return (
    <>
      <style>{`
        @keyframes _wm_shimmer {
          from { transform: translateX(-120%) skewX(-15deg); }
          to   { transform: translateX(280%)  skewX(-15deg); }
        }
        @keyframes _wm_float {
          0%,100% { transform: translateY(0)   scale(1);    }
          50%      { transform: translateY(-4px) scale(1.06); }
        }
        @keyframes _wm_ring {
          from { transform: translate(-50%,-50%) scale(1);   opacity: 0.5; }
          to   { transform: translate(-50%,-50%) scale(1.55); opacity: 0;   }
        }
        @keyframes _wm_arrowSlide {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>

      <Link
        ref={ref}
        href={category.url}
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
            border: `1.5px solid ${hovered ? category.color : hexToRgba(category.color, 0.22)}`,
            backgroundColor: theme.surface,
            boxShadow: hovered
              ? `0 16px 40px ${hexToRgba(category.color, 0.15)}, 0 4px 12px ${hexToRgba(category.color, 0.08)}`
              : isDarkMode
                ? `0 2px 8px ${hexToRgba(category.color, 0.06)}`
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
              backgroundColor: category.color,
              transition: "height 0.25s ease",
            }}
          />

          {/* Shimmer */}
          {hovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent, ${hexToRgba(category.color, 0.07)}, transparent)`,
                animation: "_wm_shimmer 0.65s ease-out forwards",
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
              background: hexToRgba(category.color, hovered ? 0.09 : 0.03),
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
                      border: `1.5px solid ${hexToRgba(category.color, 0.45)}`,
                      animation: "_wm_ring 0.75s ease-out forwards",
                    }}
                  />
                )}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    backgroundColor: hexToRgba(
                      category.color,
                      hovered ? 0.18 : 0.1,
                    ),
                    border: `1.5px solid ${hexToRgba(category.color, hovered ? 0.45 : 0.18)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: category.color,
                    animation: hovered
                      ? "_wm_float 1.8s ease-in-out infinite"
                      : "none",
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease",
                    filter: `drop-shadow(0 2px 6px ${hexToRgba(category.color, hovered ? 0.3 : 0)})`,
                  }}
                >
                  {getIcon(category.name)}
                </div>
              </div>

              {/* Name */}
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: hovered ? category.color : theme.text,
                  transition: "color 0.25s ease",
                }}
              >
                {category.name}
              </h3>

              {/* Description */}
              {category.description && (
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "0.8rem",
                    lineHeight: 1.55,
                    color: theme.textSecondary,
                  }}
                >
                  {category.description}
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
                    backgroundColor: hexToRgba(category.color, 0.1),
                    color: category.color,
                    border: `1px solid ${hexToRgba(category.color, 0.25)}`,
                  }}
                >
                  {accessibleCount} accessible{" "}
                  {accessibleCount === 1 ? "item" : "items"}
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
                  color: category.color,
                  animation: hovered
                    ? "_wm_arrowSlide 0.25s ease-out forwards"
                    : "none",
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{hasFullAccess ? "Manage All" : "View Accessible"}</span>
                <svg
                  style={{
                    width: 14,
                    height: 14,
                    transform: hovered ? "translateX(3px)" : "translateX(0)",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
              backgroundColor: category.color,
              transition:
                "width 0.35s cubic-bezier(0.22,1,0.36,1), left 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </Link>
    </>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton: React.FC<{
  theme: CardProps["theme"];
  isDarkMode: boolean;
}> = ({ theme, isDarkMode }) => (
  <>
    <style>{`
      @keyframes _wm_skeleton {
        0%   { opacity: 1; }
        50%  { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `}</style>
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        {/* Skeleton header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 180,
              height: 14,
              borderRadius: 8,
              backgroundColor: theme.border,
              marginBottom: 12,
              animation: "_wm_skeleton 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: 260,
              height: 28,
              borderRadius: 8,
              backgroundColor: theme.border,
              marginBottom: 8,
              animation: "_wm_skeleton 1.5s ease-in-out infinite 0.1s",
            }}
          />
          <div
            style={{
              width: 380,
              height: 14,
              borderRadius: 8,
              backgroundColor: theme.border,
              animation: "_wm_skeleton 1.5s ease-in-out infinite 0.2s",
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 200,
                borderRadius: 16,
                backgroundColor: theme.surface,
                border: `1.5px solid ${theme.border}`,
                animation: `_wm_skeleton 1.5s ease-in-out infinite ${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const WebManagementPage = () => {
  const { hasPrivilege, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!loading) setTimeout(() => setHeaderVisible(true), 60);
  }, [loading]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
  ];

  const filteredCategories = React.useMemo(
    () =>
      webManagementSideBarData.filter(
        (cat) =>
          hasPrivilege(cat.privilege) ||
          cat.subData.some((s) => hasPrivilege(s.privilege)),
      ),
    [hasPrivilege],
  );

  const getAccessibleCount = (cat: Category) =>
    cat.subData.filter((s) => hasPrivilege(s.privilege)).length;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton theme={theme} isDarkMode={isDarkMode} />;

  // ── Empty state ──────────────────────────────────────────────────────────
  if (filteredCategories.length === 0) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: theme.background,
          transition: "background-color 0.3s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
          <PageHeader
            title="Web Management"
            description="Manage your website content and settings"
            breadcrumbItems={breadcrumbItems}
          />
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
              <svg
                style={{ width: 28, height: 28, color: theme.textSecondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: theme.text,
              }}
            >
              Access Restricted
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                color: theme.textSecondary,
                fontSize: "0.9rem",
              }}
            >
              You don't have permission to access any web management features.
            </p>
            <Link
              href="/"
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
              <svg
                style={{ width: 15, height: 15 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        transition: "background-color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
        {/* Header */}
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(14px)",
            transition:
              "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <PageHeader
            title="Web Management"
            description="Manage your website content and settings"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              hasFullAccess={hasPrivilege(category.privilege)}
              accessibleCount={getAccessibleCount(category)}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Tip bar */}
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
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}
        >
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            <svg
              style={{ width: 18, height: 18, color: theme.primary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
              Quick Tip
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                lineHeight: 1.55,
                color: theme.textSecondary,
              }}
            >
              You can only access modules based on your assigned privileges.
              Contact your administrator if you need additional access to manage
              other website content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebManagementPage;
