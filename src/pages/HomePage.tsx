"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface HomeCardType {
  id: number;
  name: string;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
  bgColor: string;
  linkTo: string;
  iconUrl: string;
}

const HomePage = () => {
  const router = useRouter();

  const homeCardData: HomeCardType[] = [
    {
      id: 1,
      name: "Web Management",
      label: "web",
      description:
        "Manage travel requests, itineraries, bookings, and expense tracking for business trips",
      color: "#3B82F6",
      hoverColor: "#2563EB",
      bgColor: "bg-purple-50",
      linkTo: "/web-management",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/826/826070.png",
    },
    {
      id: 2,
      name: "Travel Management",
      label: "Travel",
      description:
        "Manage travel requests, itineraries, bookings, and expense tracking for business trips",
      color: "#3B82F6",
      hoverColor: "#2563EB",
      bgColor: "bg-blue-50",
      linkTo: "/travel-management",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/826/826070.png",
    },
    {
      id: 3,
      name: "Employee Management",
      label: "Employees",
      description:
        "Handle employee records, attendance, performance reviews, and HR operations",
      color: "#10B981",
      hoverColor: "#059669",
      bgColor: "bg-green-50",
      linkTo: "/employee-management",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
    },
    {
      id: 4,
      name: "Hotels Management",
      label: "Hotels",
      description:
        "Manage hotel bookings, room allocations, guest services, and hospitality operations",
      color: "#F59E0B",
      hoverColor: "#D97706",
      bgColor: "bg-yellow-50",
      linkTo: "/hotels-management",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1179/1179968.png",
    },
    {
      id: 5,
      name: "Vehicle Management",
      label: "Vehicles",
      description:
        "Track vehicle fleet, maintenance schedules, fuel consumption, and driver assignments",
      color: "#EF4444",
      hoverColor: "#DC2626",
      bgColor: "bg-red-50",
      linkTo: "/vehicle-management",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    },
    {
      id: 6,
      name: "ERP System",
      label: "ERP",
      description:
        "Enterprise Resource Planning - Integrated management of core business processes",
      color: "#8B5CF6",
      hoverColor: "#7C3AED",
      bgColor: "bg-purple-50",
      linkTo: "/erp-system",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    },
  ];

  return (
    <div className="bg-gray-50 p-6 py-24">
      {/* Header Section */}
      <div className="mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-7xl font-bold text-gray-900 mb-4 text-center">
          Business Management Dashboard
        </h1>
        <p className="text-lg text-gray-600 text-center ">
          Centralized platform to manage all your business operations including
          travel, employees, hotels, vehicles, and enterprise resource planning
          systems.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {homeCardData.map((card) => (
            <div
              key={card.id}
              className="group cursor-pointer"
              onClick={() => {
                router.push(card.linkTo);
              }}
            >
              {/* Card Container with Border */}
              <div className="h-full border-2 border-gray-200 rounded-xl p-6 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-lg bg-white">
                {/* Icon Container */}
                <div className="flex justify-center mb-4">
                  <div
                    className="p-4 rounded-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${card.color}15`, // Adding alpha for light background
                      border: `2px solid ${card.color}40`,
                    }}
                  >
                    <img
                      src={card.iconUrl}
                      alt={card.name}
                      className="w-12 h-12 object-contain"
                      style={{
                        filter: `drop-shadow(0 2px 4px ${card.color}40)`,
                      }}
                    />
                  </div>
                </div>

                {/* Card Name */}
                <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">
                  {card.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Instructions or Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm text-center">
          Click on any card to access the corresponding management system
        </p>
      </div>
    </div>
  );
};

export default HomePage;
