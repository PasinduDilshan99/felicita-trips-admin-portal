"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LoadingSkeleton } from "@/components/common-components/management-components/LoadingSkeleton";
import { EmptyState } from "@/components/common-components/management-components/EmptyState";
import { CategoryCard } from "@/components/common-components/management-components/CategoryCard";
import { TipBar } from "@/components/common-components/management-components/TipBar";
import { contentManagementSideBarData } from "@/data/side-bar-data";
import { CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";

const ContentManagementPage = () => {
  const { hasPrivilege, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!loading) setTimeout(() => setHeaderVisible(true), 60);
  }, [loading]);

  const filteredCategories = React.useMemo(
    () =>
      contentManagementSideBarData.filter(
        (cat) =>
          hasPrivilege(cat.privilege) ||
          cat.subData.some((s) => hasPrivilege(s.privilege)),
      ),
    [hasPrivilege],
  );

  const getAccessibleCount = (cat: any) =>
    cat.subData.filter((s: any) => hasPrivilege(s.privilege)).length;

  if (loading) {
    return <LoadingSkeleton theme={theme} columns={4} cardHeight={200} />;
  }

  if (filteredCategories.length === 0) {
    return (
      <EmptyState
        theme={theme}
        title="Access Restricted"
        description="You don't have permission to access any web management features."
        backLink="/"
        backLinkText="Back to Home"
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
            title="Content Management"
            description="Manage your website content and settings"
            breadcrumbItems={CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA}
          />
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                itemLabel="item"
              />
            ))}
          </div>

          <TipBar
            theme={theme}
            title="Quick Tip"
            message="You can only access modules based on your assigned privileges. Contact your administrator if you need additional access to manage other website content."
            visible={headerVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;
