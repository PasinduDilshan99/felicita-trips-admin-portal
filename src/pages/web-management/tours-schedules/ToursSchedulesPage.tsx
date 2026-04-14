import React from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { 
  WEB_MANAGEMENT_PATH, 
  WEB_MANAGEMENT_TOURS_SCHEDULES_PATH,
  WEB_MANAGEMENT_TOURS_PATH 
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";

const ToursSchedulesPage = () => {
  const toursScheduleData = webManagementSideBarData.find(
    (item) => item.name === "Tours Schedules"
  );
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Tours", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}` },
    { label: "Schedules", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}` },
  ];

  // Function to get icon for each action
  const getActionIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view") || lowerName.includes("all")) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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
    
    // Default icon for tours schedules
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    );
  };

  // Get color variant classes
  const getColorClasses = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view")) {
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: "text-orange-600",
        hover: "hover:border-orange-400 hover:shadow-orange-100"
      };
    }
    
    if (lowerName.includes("add")) {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: "text-amber-600",
        hover: "hover:border-amber-400 hover:shadow-amber-100"
      };
    }
    
    if (lowerName.includes("update")) {
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        icon: "text-yellow-600",
        hover: "hover:border-yellow-400 hover:shadow-yellow-100"
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
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-600",
      hover: "hover:border-amber-400 hover:shadow-amber-100"
    };
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Tours Schedules"
          description="Manage tour schedules, departure times, and guided tour availability"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Action Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toursScheduleData?.subData?.map((action) => {
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
                <p className="text-sm font-medium text-gray-600">Active Tour Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +15 this week
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tours Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Next: 9:00 AM
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guides Available</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  4 on standby
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Tour Schedule</h3>
              <p className="text-sm text-gray-600 mt-1">Tour schedules for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Morning
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Afternoon
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                Evening
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { time: "09:00 AM", tour: "City Heritage Walk", guide: "John Doe", group: "12/20", status: "In Progress" },
              { time: "10:30 AM", tour: "Art Museum Tour", guide: "Sarah Smith", group: "18/25", status: "Ready" },
              { time: "01:00 PM", tour: "Food Tasting Tour", guide: "Mike Johnson", group: "15/15", status: "Full" },
              { time: "03:30 PM", tour: "Architecture Tour", guide: "Emma Wilson", group: "8/15", status: "Available" },
              { time: "06:00 PM", tour: "Sunset Photography", guide: "Alex Brown", group: "20/25", status: "Available" },
            ].map((item, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-16">
                    <div className="text-sm font-semibold text-gray-900">{item.time}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                      item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                      item.status === "Ready" ? "bg-green-100 text-green-800" :
                      item.status === "Full" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.tour}</h4>
                        <p className="text-sm text-gray-600 mt-1">Guide: {item.guide}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{item.group}</div>
                        <div className="text-xs text-gray-500">Participants</div>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(parseInt(item.group.split('/')[0]) / parseInt(item.group.split('/')[1])) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <a href="#" className="text-sm font-medium text-amber-600 hover:text-amber-900 flex items-center">
              <span>View full weekly schedule</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Tour Schedule Calendar Preview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tour Types</h3>
            <div className="space-y-4">
              {[
                { type: "Walking Tours", count: 45, icon: "🚶‍♂️", color: "bg-blue-100 text-blue-800" },
                { type: "Bus Tours", count: 28, icon: "🚌", color: "bg-purple-100 text-purple-800" },
                { type: "Boat Tours", count: 18, icon: "⛵", color: "bg-teal-100 text-teal-800" },
                { type: "Bike Tours", count: 22, icon: "🚲", color: "bg-green-100 text-green-800" },
                { type: "Specialty Tours", count: 11, icon: "🎭", color: "bg-pink-100 text-pink-800" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.type}</div>
                      <div className="text-sm text-gray-600">{item.count} scheduled this month</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
                    {item.count} tours
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next 7 Days Overview</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const dayIndex = (new Date().getDay() + index) % 7;
                const tourCounts = [8, 12, 10, 15, 18, 22, 14];
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mx-auto ${
                      dayIndex === 0 ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {new Date(Date.now() + index * 24 * 60 * 60 * 1000).getDate()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{tourCounts[index]} tours</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total tours next week:</span>
                <span className="font-semibold text-gray-900">99 tours scheduled</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Average per day:</span>
                <span className="font-semibold text-gray-900">14 tours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Tour Schedule Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage all tour schedules, departure times, and guide assignments. Create new tour schedules with 
                specific time slots, update existing schedules with new guides or routes, and remove schedules 
                that are no longer operational. Track participant numbers, manage guide availability, and monitor 
                tour capacity. Tour schedules can be filtered by time of day, tour type, guide availability, 
                and participant capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white">Need to assign multiple guides?</h3>
              <p className="text-amber-100 mt-1">Use our guide assignment tool for efficient scheduling</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Assign Guides
              </button>
              <button className="px-4 py-2 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition-colors">
                Schedule Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursSchedulesPage;