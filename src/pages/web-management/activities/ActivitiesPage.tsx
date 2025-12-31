import React from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { webManagementSideBarData } from "@/utils/side-bar-data";
import { WEB_MANAGEMENT_PATH, WEB_MANAGEMENT_ACTIVITIES_PATH } from "@/utils/constant";

const ActivitiesPage = () => {
  const activitiesData = webManagementSideBarData.find(
    (item) => item.name === "Activities"
  );
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Activities", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}` },
  ];

  // Function to get icon for each action
  const getActionIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view") || lowerName.includes("all")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    }
    
    if (lowerName.includes("add") || lowerName.includes("create")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    }
    
    if (lowerName.includes("update") || lowerName.includes("edit")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    }
    
    if (lowerName.includes("remove") || lowerName.includes("delete")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    }
    
    // Default icon for activities
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  // Get color variant classes
  const getColorClasses = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view")) {
      return {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        icon: "text-indigo-600",
        hover: "hover:border-indigo-400 hover:shadow-indigo-100"
      };
    }
    
    if (lowerName.includes("add")) {
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: "text-emerald-600",
        hover: "hover:border-emerald-400 hover:shadow-emerald-100"
      };
    }
    
    if (lowerName.includes("update")) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: "text-amber-600",
        hover: "hover:border-amber-400 hover:shadow-amber-100"
      };
    }
    
    if (lowerName.includes("remove")) {
      return {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        icon: "text-rose-600",
        hover: "hover:border-rose-400 hover:shadow-rose-100"
      };
    }
    
    return {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      icon: "text-purple-600",
      hover: "hover:border-purple-400 hover:shadow-purple-100"
    };
  };

  return (
    <div className="bg-slate-100">
      <div className="mx-auto">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Activities"
          description="Manage travel activities and experiences"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activitiesData?.subData?.map((action) => {
            const colorClasses = getColorClasses(action.name);
            
            return (
              <a
                key={action.id}
                href={action.url}
                className="group block"
              >
                <div className={`${colorClasses.bg} rounded-lg border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 h-full`}>
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-4 ${colorClasses.icon} shadow-sm`}>
                        {getActionIcon(action.name)}
                      </div>

                      {/* Action Name */}
                      <h3 className={`text-lg font-semibold mb-2 ${colorClasses.text}`}>
                        {action.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {action.description}
                      </p>

                      {/* Arrow */}
                      <div className={`flex items-center text-sm font-medium ${colorClasses.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className="mr-1">Go</span>
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
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Activities</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">15</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-indigo-600"
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
                Activity Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage all travel activities and experiences offered. Add new activities, update existing ones, 
                feature popular experiences, or remove activities that are no longer available. Activities can 
                be categorized by type, difficulty level, and duration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;