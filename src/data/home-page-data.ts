import { HomeCardType } from "@/types/home-page-data-types";

export const homeCardData: HomeCardType[] = [
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
      privilege: "WEB_MANAGEMENT",
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
      privilege: "TRAVEL_MANAGEMENT",
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
      privilege: "EMPLOYEE_MANAGEMENT",
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
      privilege: "HOTEL_MANAGEMENT",
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
      privilege: "VEHICLE_MANAGEMENT",
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
      privilege: "ERP_SYSTEM",
    },
  ];