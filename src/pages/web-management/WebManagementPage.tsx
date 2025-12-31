"use client"
import React from "react";
import { webManagementSideBarData } from "@/utils/side-bar-data";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const WebManagementPage = () => {
  const { hasPrivilege, loading } = useAuth();

  // Function to get icon based on category
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "destinations":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "activities":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "tours":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
      case "packages":
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
  ];

  // Filter categories based on privileges
  const filteredCategories = React.useMemo(() => {
    return webManagementSideBarData.filter(category => {
      // Check if user has access to the main category
      const hasMainPrivilege = hasPrivilege(category.privilege);
      
      // Check if user has access to any sub item
      const hasAnySubPrivilege = category.subData.some(subItem => 
        hasPrivilege(subItem.privilege)
      );
      
      // Show category if user has either:
      // 1. Access to main category OR
      // 2. Access to any sub item
      return hasMainPrivilege || hasAnySubPrivilege;
    });
  }, [hasPrivilege]);

  // Get accessible count for each category
  const getAccessibleSubItemsCount = (category: typeof webManagementSideBarData[0]) => {
    return category.subData.filter(subItem => 
      hasPrivilege(subItem.privilege)
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // If no accessible categories
  if (filteredCategories.length === 0) {
    return (
      <div className="bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="Web Management"
            description="Manage your website content and settings"
            breadcrumbItems={breadcrumbItems}
          />
          
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have permission to access any web management features.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section with Breadcrumb */}
        <PageHeader
          title="Web Management"
          description="Manage your website content and settings"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const accessibleSubItemsCount = getAccessibleSubItemsCount(category);
            const hasFullAccess = hasPrivilege(category.privilege);
            
            return (
              <Link 
                key={category.id} 
                href={category.url} 
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-purple-300 overflow-hidden h-full relative">
                  {/* Color Bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: category.color }}
                  />

                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon Container */}
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${category.color}15`,
                          color: category.color,
                        }}
                      >
                        {getIcon(category.name)}
                      </div>

                      {/* Category Name */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-2">
                        {category.description}
                      </p>

                      {/* Arrow Icon */}
                      <div className="flex items-center text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="mr-1">
                          {hasFullAccess ? "Manage All" : "View Accessible"}
                        </span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Tip Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-purple-600"
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
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Quick Tip
              </h3>
              <p className="text-sm text-gray-600">
                You can only access modules and features based on your assigned privileges. 
                Contact your administrator if you need additional access to manage other website content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebManagementPage;