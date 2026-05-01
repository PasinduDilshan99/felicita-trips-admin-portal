// /app/web-management/page-management/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { webPageManagementSideBarData } from "@/data/side-bar-data";
import { WEB_PAGE_MANAGEMENT_URL } from "@/utils/urls";
import { LoadingSkeleton } from "@/components/common-components/management-components/LoadingSkeleton";
import { EmptyState } from "@/components/common-components/management-components/EmptyState";
import { CategoryCard } from "@/components/common-components/management-components/CategoryCard";
import { TipBar } from "@/components/common-components/management-components/TipBar";

const WebPageManagementPage = () => {
  const { hasPrivilege, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!loading) setTimeout(() => setHeaderVisible(true), 60);
  }, [loading]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: "/web-management" },
    { label: "Page Management", href: WEB_PAGE_MANAGEMENT_URL },
  ];

  const filteredCategories = React.useMemo(
    () =>
      webPageManagementSideBarData.filter(
        (cat) =>
          hasPrivilege(cat.privilege) ||
          cat.subData.some((s) => hasPrivilege(s.privilege)),
      ),
    [hasPrivilege],
  );

  const getAccessibleCount = (cat: any) =>
    cat.subData.filter((s: any) => hasPrivilege(s.privilege)).length;

  if (loading) {
    return (
      <LoadingSkeleton
        theme={theme}
        columns={3}
        cardHeight={220}
        cardCount={6}
      />
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <EmptyState
        theme={theme}
        title="Access Restricted"
        description="You don't have permission to access any page management features."
        backLink="/web-management"
        backLinkText="Back to Web Management"
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Page Management"
            description="Manage your website pages and their sections"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                color={category.color}
                url={category.url}
                index={index}
                hasFullAccess={hasPrivilege(category.privilege)}
                accessibleCount={getAccessibleCount(category)}
                theme={theme}
                isDarkMode={isDarkMode}
                itemLabel="section"
              />
            ))}
          </div>

          <TipBar
            theme={theme}
            title="Quick Tip"
            message="Each page contains multiple sections that can be managed independently. Click on any page card to view and edit its sections based on your privileges."
            visible={headerVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default WebPageManagementPage;
