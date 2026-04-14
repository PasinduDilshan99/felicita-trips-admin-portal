import React from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { 
  WEB_MANAGEMENT_PATH, 
  WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH 
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";

const ActivitiesSchedulePage = () => {
  const activitiesScheduleData = webManagementSideBarData.find(
    (item) => item.name === "Activities Schedules"
  );
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Activities", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}` },
    { label: "Schedules", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}` },
  ];

  // Function to get icon for each action
  const getActionIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view") || lowerName.includes("all")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (lowerName.includes("add") || lowerName.includes("create")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
    
    // Default icon for schedules
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  // Get color variant classes
  const getColorClasses = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view")) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "text-blue-600",
        hover: "hover:border-blue-400 hover:shadow-blue-100"
      };
    }
    
    if (lowerName.includes("add")) {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "text-green-600",
        hover: "hover:border-green-400 hover:shadow-green-100"
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
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-700",
      icon: "text-teal-600",
      hover: "hover:border-teal-400 hover:shadow-teal-100"
    };
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Activities Schedules"
          description="Manage activity schedules, timings, and availability"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Action Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activitiesScheduleData?.subData?.map((action) => {
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
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +12 this week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Next: 10:30 AM
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fully Booked</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                <p className="text-xs text-amber-600 font-medium mt-1">
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.23 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Schedules Table */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity Schedules</h3>
            <p className="text-sm text-gray-600 mt-1">Latest scheduled activities and their status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { activity: "Sunset Yoga", date: "Today, 5:30 PM", capacity: "15/20", status: "Available", color: "green" },
                  { activity: "Mountain Trek", date: "Tomorrow, 8:00 AM", capacity: "20/20", status: "Full", color: "red" },
                  { activity: "Scuba Diving", date: "Jan 25, 10:00 AM", capacity: "8/12", status: "Available", color: "green" },
                  { activity: "Cooking Class", date: "Jan 26, 2:00 PM", capacity: "10/15", status: "Available", color: "green" },
                  { activity: "Wine Tasting", date: "Jan 27, 6:00 PM", capacity: "18/25", status: "Available", color: "green" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.activity}</div>
                          <div className="text-sm text-gray-500">Tour Activity</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.date}</div>
                      <div className="text-sm text-gray-500">2 hours duration</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.capacity}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(parseInt(item.capacity.split('/')[0]) / parseInt(item.capacity.split('/')[1])) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${item.color}-100 text-${item.color}-800`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Showing 5 of 156 schedules</span>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-900">
                View all schedules →
              </a>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Activity Schedule Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage all activity schedules, timings, and availability. Create new schedules for activities, 
                update existing schedules, and remove schedules that are no longer available. Track capacity, 
                manage bookings, and monitor schedule status. Schedules can be filtered by date, time, activity type, 
                and availability status.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white">Need to create multiple schedules?</h3>
              <p className="text-teal-100 mt-1">Use our bulk scheduler for efficient planning</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-teal-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Bulk Upload
              </button>
              <button className="px-4 py-2 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 transition-colors">
                Schedule Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesSchedulePage;