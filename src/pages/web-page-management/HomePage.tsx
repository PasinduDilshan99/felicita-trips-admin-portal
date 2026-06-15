"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { hexToRgba } from "@/utils/functions";
import { ActionCardSkeleton } from "@/components/common-components/management-components/ActionCardSkeleton";
import { ActionCard } from "@/components/common-components/management-components/ActionCard";
import {
  HomeIcon,
  ServicesIcon,
  DestinationsIcon,
  ToursIcon,
  ContactIcon,
  GalleryIcon,
} from "@/data/icons-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { WEBSITE_CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { webSiteContentManagementSideBarData } from "@/data/side-bar-data";
import { Reveal } from "@/components/statistics-components";

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

// Main Component
const HomePage = () => {
  const { theme, isDarkMode } = useTheme();
  const { hasPrivilege, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const homePageData = webSiteContentManagementSideBarData.find(
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

  if (!loading && accessibleSections.length === 0) {
    return (
      <div style={{ background: theme.background, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 24 }}>
          <PageHeader
            title="Home Page"
            description="Manage homepage sections and content"
            breadcrumbItems={WEBSITE_CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA}
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
              breadcrumbItems={WEBSITE_CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA}
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
