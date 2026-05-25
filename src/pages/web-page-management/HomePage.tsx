// /app/web-management/page-management/home-page/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { webPageManagementSideBarData } from "@/data/side-bar-data";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { hexToRgba } from "@/utils/functions";
import { WEB_MANAGEMENT_URL, WEB_PAGE_MANAGEMENT_URL } from "@/utils/urls";
import { ActionCardSkeleton } from "@/components/common-components/management-components/ActionCardSkeleton";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";

// Icon Components
const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ServicesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const DestinationsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ToursIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const GalleryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="16" rx="2" />
    <circle cx="9" cy="9" r="3" />
    <path d="M22 14l-5-3-5 3-5-3-5 3" />
  </svg>
);

const ContactIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const getSectionIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("hero")) return <HomeIcon />;
  if (lower.includes("service")) return <ServicesIcon />;
  if (lower.includes("destination")) return <DestinationsIcon />;
  if (lower.includes("tour")) return <ToursIcon />;
  if (lower.includes("gallery")) return <GalleryIcon />;
  if (lower.includes("contact")) return <ContactIcon />;
  return <HomeIcon />;
};

const getSectionAccent = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("hero")) return "blue";
  if (lower.includes("service")) return "emerald";
  if (lower.includes("destination")) return "rose";
  if (lower.includes("tour")) return "violet";
  if (lower.includes("gallery")) return "amber";
  if (lower.includes("contact")) return "teal";
  return "violet";
};

// Section Header Component
const SectionHeader = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) => {
  const { theme } = useTheme();
  const p = theme.primary ?? "#0D4E4A";
  const acc = theme.accent ?? "#1a7a74";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "1.125rem",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: ".875rem" }}
      >
        <div
          style={{
            width: 4,
            minHeight: 40,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${p} 0%, ${acc} 100%)`,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        />
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".625rem",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: theme.text,
                margin: 0,
                letterSpacing: "-.018em",
              }}
            >
              {title}
            </h2>
            {badge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: ".675rem",
                  fontWeight: 700,
                  letterSpacing: ".065em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: `${p}17`,
                  color: p,
                  border: `1px solid ${p}2E`,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p
              style={{
                fontSize: ".8125rem",
                color: theme.textSecondary,
                margin: ".2rem 0 0",
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reveal Animation Wrapper
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
};

// Main Component
const HomePage = () => {
  const { theme, isDarkMode } = useTheme();
  const { hasPrivilege, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const homePageData = webPageManagementSideBarData.find(
    (item) => item.name === "Home Page",
  );

  const accessibleSections = React.useMemo(() => {
    if (!homePageData) return [];
    return homePageData.subData.filter((section) =>
      hasPrivilege(section.privilege),
    );
  }, [homePageData, hasPrivilege]);

  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => setLoading(false), 300);
    }
  }, [authLoading]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    { label: "Page Management", href: WEB_PAGE_MANAGEMENT_URL },
    { label: "Home Page", href: "#" },
  ];

  if (!loading && accessibleSections.length === 0) {
    return (
      <div style={{ background: theme.background, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
          <PageHeader
            title="Home Page"
            description="Manage homepage sections and content"
            breadcrumbItems={breadcrumbItems}
          />
          <div
            style={{
              marginTop: 48,
              borderRadius: 16,
              border: `1.5px dashed ${theme.border}`,
              background: theme.surface,
              padding: 48,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: hexToRgba(theme.textSecondary, 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: theme.textSecondary,
              }}
            >
              <svg
                style={{ width: 28, height: 28 }}
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
              You don't have permission to access any homepage sections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.background,
        minHeight: "100vh",
        transition: "background 0.3s ease",
      }}
    >
      <Reveal delay={0}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: hexToRgba(theme.surface, 0.85),
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              padding: "1rem 1.75rem",
            }}
          >
            <PageHeader
              title="Home Page"
              description="Manage homepage sections and content"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>
      </Reveal>

      <div
        style={{ maxWidth: 1440, margin: "0 auto", padding: "2rem 1.75rem" }}
      >
        <Reveal delay={60}>
          <section>
            <SectionHeader
              title="Homepage Sections"
              subtitle="Manage individual sections of your homepage"
              badge={`${accessibleSections.length} sections`}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.125rem",
              }}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <ActionCardSkeleton
                      key={i}
                      delay={i * 0.07}
                      theme={theme}
                      isDarkMode={isDarkMode}
                    />
                  ))
                : accessibleSections.map((section, idx) => (
                    <ActionCard
                      key={section.id}
                      id={section.id}
                      name={section.name}
                      description={section.description}
                      url={section.url}
                      accent={getSectionAccent(section.name)}
                      icon={getSectionIcon(section.name)}
                      pillLabel="Manage"
                      ctaText="Manage Section"
                      theme={theme}
                      isDarkMode={isDarkMode}
                    />
                  ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <div
            style={{
              marginTop: "1.875rem",
              borderRadius: 16,
              border: `1.5px solid ${theme.border}`,
              background: theme.surface,
              padding: "1.375rem 1.625rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: hexToRgba(theme.primary ?? "#0D4E4A", 0.09),
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.primary ?? "#0D4E4A",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: 18, height: 18 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: ".875rem",
                  fontWeight: 700,
                  color: theme.primary ?? "#0D4E4A",
                  marginBottom: ".25rem",
                }}
              >
                Homepage Management
              </p>
              <p
                style={{
                  fontSize: ".8125rem",
                  color: theme.textSecondary,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Each card above represents a different section of your homepage.
                Click on any section to manage its content, images, and
                settings. Changes will be reflected immediately on the public
                website.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default HomePage;
