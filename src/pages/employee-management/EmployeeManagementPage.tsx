// app/employee-management/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LoadingSkeleton } from "@/components/common-components/management-components/LoadingSkeleton";
import { EmptyState } from "@/components/common-components/management-components/EmptyState";
import { CategoryCard } from "@/components/common-components/management-components/CategoryCard";
import { TipBar } from "@/components/common-components/management-components/TipBar";
import { employeeManagementSideBarData } from "@/data/side-bar-data";

const EmployeeManagementPage = () => {
  const { hasPrivilege, loading } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    if (!loading) setTimeout(() => setHeaderVisible(true), 60);
  }, [loading]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employee Management", href: "/employee-management" },
  ];

  const filteredCategories = React.useMemo(
    () =>
      employeeManagementSideBarData.filter(
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
        description="You don't have permission to access any employee management features."
        backLink="/"
        backLinkText="Back to Dashboard"
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Employee Management"
            description="Manage employees, attendance, leaves, payroll, and HR operations"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
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
              itemLabel="feature"
            />
          ))}
        </div>

        <TipBar
          theme={theme}
          title="HR Tip"
          message="Employee management features are based on your role and permissions. Contact your HR administrator if you need access to additional modules."
          visible={headerVisible}
        />
      </div>
    </div>
  );
};

export default EmployeeManagementPage;
