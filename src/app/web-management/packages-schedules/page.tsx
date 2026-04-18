import React from "react";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { 
  WEB_MANAGEMENT_PATH, 
  WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH 
} from "@/utils/constant";
import { webManagementSideBarData } from "@/data/side-bar-data";

const PackagesSchedulesPage = () => {
  const packagesScheduleData = webManagementSideBarData.find(
    (item) => item.name === "Packages Schedules"
  );
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    { label: "Packages", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}` },
    { label: "Schedules", href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH}` },
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
    
    // Default icon for packages schedules
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  };

  // Get color variant classes
  const getColorClasses = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes("view")) {
      return {
        bg: "bg-violet-50",
        border: "border-violet-200",
        text: "text-violet-700",
        icon: "text-violet-600",
        hover: "hover:border-violet-400 hover:shadow-violet-100"
      };
    }
    
    if (lowerName.includes("add")) {
      return {
        bg: "bg-fuchsia-50",
        border: "border-fuchsia-200",
        text: "text-fuchsia-700",
        icon: "text-fuchsia-600",
        hover: "hover:border-fuchsia-400 hover:shadow-fuchsia-100"
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
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Packages Schedules"
          description="Manage holiday package schedules, availability, and booking periods"
          breadcrumbItems={breadcrumbItems}
        />

        {/* Action Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packagesScheduleData?.subData?.map((action) => {
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
                <p className="text-sm font-medium text-gray-600">Active Package Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">78</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +8 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Departures</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">14</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Next: Jan 28
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
                <p className="text-3xl font-bold text-gray-900 mt-2">22</p>
                <p className="text-xs text-amber-600 font-medium mt-1">
                  Waitlist available
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Package Types Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Distribution by Package Type</h3>
            <div className="space-y-4">
              {[
                { type: "Beach Holidays", count: 28, color: "bg-blue-500", percentage: "36%" },
                { type: "Adventure Tours", count: 18, color: "bg-emerald-500", percentage: "23%" },
                { type: "Cultural Experiences", count: 15, color: "bg-amber-500", percentage: "19%" },
                { type: "Luxury Getaways", count: 12, color: "bg-purple-500", percentage: "15%" },
                { type: "Family Packages", count: 5, color: "bg-pink-500", percentage: "7%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-3">{item.count} schedules</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`} 
                        style={{ width: item.percentage }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-3 w-8">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming High-Demand Periods</h3>
            <div className="space-y-4">
              {[
                { period: "Spring Break", dates: "Mar 15 - Apr 10", bookings: "89%", status: "High" },
                { period: "Summer Holidays", dates: "Jun 1 - Aug 31", bookings: "76%", status: "Medium" },
                { period: "Festive Season", dates: "Dec 15 - Jan 5", bookings: "92%", status: "High" },
                { period: "Autumn Getaways", dates: "Sep 15 - Nov 15", bookings: "65%", status: "Medium" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.period}</div>
                    <div className="text-sm text-gray-600">{item.dates}</div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "High" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status} Demand
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">{item.bookings} booked</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Package Schedules */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Package Schedules</h3>
              <p className="text-sm text-gray-600 mt-1">Latest scheduled packages and their availability</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
              Add New Schedule
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { package: "Bali Paradise", departure: "Feb 15, 2024", duration: "7 days", seats: "12/20", price: "$1,299", status: "Available" },
                  { package: "Swiss Alps Adventure", departure: "Feb 20, 2024", duration: "10 days", seats: "18/18", price: "$2,499", status: "Full" },
                  { package: "Japanese Culture Tour", departure: "Mar 5, 2024", duration: "14 days", seats: "8/15", price: "$3,199", status: "Available" },
                  { package: "Greek Island Hopping", departure: "Mar 12, 2024", duration: "8 days", seats: "15/20", price: "$1,899", status: "Available" },
                  { package: "African Safari", departure: "Apr 1, 2024", duration: "12 days", seats: "20/20", price: "$4,299", status: "Full" },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.package}</div>
                          <div className="text-sm text-gray-500">Holiday Package</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.departure}</div>
                      <div className="text-sm text-gray-500">Next: {item.departure}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.seats}</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(parseInt(item.seats.split('/')[0]) / parseInt(item.seats.split('/')[1])) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{item.price}</div>
                      <div className="text-xs text-gray-500">per person</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "Available" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Showing 5 of 78 package schedules</span>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-900">
                View all package schedules →
              </a>
            </div>
          </div>
        </div>

        {/* Info Section */}
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Package Schedule Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage all holiday package schedules, departure dates, and booking periods. Create new schedules 
                for packages, update existing schedules with new dates or pricing, and remove schedules that are 
                no longer available. Track seat availability, manage multiple departure dates for popular packages, 
                and monitor booking trends. Package schedules can include seasonal pricing, special offers, and 
                early bird discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white">Seasonal Schedule Planning</h3>
              <p className="text-purple-100 mt-1">Plan ahead for peak seasons and special events</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Export Calendar
              </button>
              <button className="px-4 py-2 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors">
                Create Seasonal Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSchedulesPage;