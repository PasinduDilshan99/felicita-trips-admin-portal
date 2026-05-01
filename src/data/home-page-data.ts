import { HomeCardType } from "@/types/home-page-data-types";
import {
  ERP_SYSTEM_PRIVILEGE,
  HOTEL_MANAGEMENT_PRIVILEGE,
  TRAVEL_MANAGEMENT_PRIVILEGE,
  VEHICLE_MANAGEMENT_PRIVILEGE,
  WEB_MANAGEMENT_PRIVILEGE,
  WEB_PAGE_MANAGEMENT_PRIVILEGE,
} from "@/utils/privileges";
import {
  ERP_SYSTEM_URL,
  HOTEL_MANAGEMENT_URL,
  TRAVEL_MANAGEMENT_URL,
  VEHICLE_MANAGEMENT_URL,
  WEB_MANAGEMENT_URL,
  WEB_PAGE_MANAGEMENT_URL,
} from "@/utils/urls";

export const homeCardData: HomeCardType[] = [
  {
    id: 1,
    name: "Web Management",
    label: "web",
    description:
      "Control website content, pages, destinations, and public-facing travel information.",
    color: "#6366F1", // indigo — distinct from Travel blue
    hoverColor: "#4F46E5",
    bgColor: "bg-indigo-50",
    linkTo: WEB_MANAGEMENT_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006363.png",
    privilege: WEB_MANAGEMENT_PRIVILEGE,
  },
  {
    id: 2,
    name: "Travel Management",
    label: "Travel",
    description:
      "Manage itineraries, bookings, tour packages, and client travel experiences.",
    color: "#3B82F6", // blue
    hoverColor: "#2563EB",
    bgColor: "bg-blue-50",
    linkTo: TRAVEL_MANAGEMENT_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/870/870175.png",
    privilege: TRAVEL_MANAGEMENT_PRIVILEGE,
  },
  {
    id: 3,
    name: "Web Page Management",
    label: "Web Pages",
    description:
      "Manage website pages, banners, layouts, SEO content, and page configurations.",
    color: "#EC4899", // pink
    hoverColor: "#DB2777",
    bgColor: "bg-pink-50",
    linkTo: WEB_PAGE_MANAGEMENT_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    privilege: WEB_PAGE_MANAGEMENT_PRIVILEGE,
  },
  {
    id: 4,
    name: "Employee Management",
    label: "Employees",
    description:
      "Handle employee records, attendance, performance reviews, and HR operations.",
    color: "#10B981", // emerald
    hoverColor: "#059669",
    bgColor: "bg-green-50",
    linkTo: "/employee-management",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
    privilege: "EMPLOYEE_MANAGEMENT",
  },
  {
    id: 5,
    name: "Hotel Management",
    label: "Hotels",
    description:
      "Manage hotel bookings, room allocations, guest services, and hospitality operations.",
    color: "#F59E0B", // amber
    hoverColor: "#D97706",
    bgColor: "bg-yellow-50",
    linkTo: HOTEL_MANAGEMENT_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1179/1179968.png",
    privilege: HOTEL_MANAGEMENT_PRIVILEGE,
  },
  {
    id: 6,
    name: "Vehicle Management",
    label: "Vehicles",
    description:
      "Track fleet, maintenance schedules, fuel consumption, and driver assignments.",
    color: "#EF4444", // red
    hoverColor: "#DC2626",
    bgColor: "bg-red-50",
    linkTo: VEHICLE_MANAGEMENT_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    privilege: VEHICLE_MANAGEMENT_PRIVILEGE,
  },
  {
    id: 7,
    name: "ERP System",
    label: "ERP",
    description:
      "Integrated management of core business processes and enterprise resources.",
    color: "#8B5CF6", // violet
    hoverColor: "#7C3AED",
    bgColor: "bg-purple-50",
    linkTo: ERP_SYSTEM_URL,
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
    privilege: ERP_SYSTEM_PRIVILEGE,
  },
];
