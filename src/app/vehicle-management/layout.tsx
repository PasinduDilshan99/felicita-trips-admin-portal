// app/travel-management/layout.tsx
import Sidebar from "@/components/common-components/static-components/SideBar";
import React from "react";

// Sidebar data for travel management
const vehicleManagementSideBarData = [
  {
    id: 1,
    name: "Travel Requests",
    description: "Manage travel requests and approvals",
    color: "#3B82F6", // Blue
    url: "/travel-management",
    privilege: "",
    subData: [
      {
        id: 101,
        name: "All Requests",
        description: "View all travel requests",
        url: "/travel-management",
        privilege: "",
      },
      {
        id: 102,
        name: "New Request",
        description: "Create a new travel request",
        url: "/travel-management/new",
        privilege: "",
      },
      {
        id: 103,
        name: "Pending Approval",
        description: "Requests pending approval",
        url: "/travel-management/pending",
        privilege: "",
      },
      {
        id: 104,
        name: "Approved",
        description: "Approved travel requests",
        url: "/travel-management/approved",
        privilege: "",
      },
    ],
  },
  {
    id: 2,
    name: "Bookings",
    description: "Manage flight and hotel bookings",
    color: "#10B981", // Green
    url: "/travel-management/bookings",
    privilege: "",

    subData: [
      {
        id: 201,
        name: "All Bookings",
        description: "View all bookings",
        url: "/travel-management/bookings",
        privilege: "",
      },
      {
        id: 202,
        name: "Flights",
        description: "Flight bookings",
        url: "/travel-management/bookings/flights",
        privilege: "",
      },
      {
        id: 203,
        name: "Hotels",
        description: "Hotel bookings",
        url: "/travel-management/bookings/hotels",
        privilege: "",
      },
      {
        id: 204,
        name: "Transport",
        description: "Transport arrangements",
        url: "/travel-management/bookings/transport",
        privilege: "",
      },
    ],
  },
  {
    id: 3,
    name: "Expenses",
    description: "Track travel expenses",
    color: "#F59E0B", // Amber
    url: "/travel-management/expenses",
    privilege: "",

    subData: [
      {
        id: 301,
        name: "All Expenses",
        description: "View all expenses",
        url: "/travel-management/expenses",
        privilege: "",
      },
      {
        id: 302,
        name: "Submit Expense",
        description: "Submit new expense",
        url: "/travel-management/expenses/submit",
        privilege: "",
      },
      {
        id: 303,
        name: "Pending Claims",
        description: "Expenses pending approval",
        url: "/travel-management/expenses/pending",
        privilege: "",
      },
      {
        id: 304,
        name: "Reimbursed",
        description: "Reimbursed expenses",
        url: "/travel-management/expenses/reimbursed",
        privilege: "",
      },
    ],
  },
  {
    id: 4,
    name: "Reports",
    description: "Travel reports and analytics",
    color: "#8B5CF6", // Violet
    url: "/travel-management/reports",
    privilege: "",

    subData: [
      {
        id: 401,
        name: "Travel Summary",
        description: "Overall travel summary",
        url: "/travel-management/reports",
        privilege: "",
      },
      {
        id: 402,
        name: "Budget Analysis",
        description: "Travel budget analysis",
        url: "/travel-management/reports/budget",
        privilege: "",
      },
      {
        id: 403,
        name: "Employee Travel",
        description: "Employee travel patterns",
        url: "/travel-management/reports/employee",
        privilege: "",
      },
      {
        id: 404,
        name: "Cost Savings",
        description: "Cost saving analysis",
        url: "/travel-management/reports/savings",
        privilege: "",
      },
    ],
  },
  {
    id: 5,
    name: "Policy",
    description: "Travel policy and compliance",
    color: "#EF4444", // Red
    url: "/travel-management/policy",
    privilege: "",

    subData: [
      {
        id: 501,
        name: "View Policy",
        description: "Company travel policy",
        url: "/travel-management/policy",
        privilege: "",
      },
      {
        id: 502,
        name: "Compliance",
        description: "Policy compliance reports",
        url: "/travel-management/policy/compliance",
        privilege: "",
      },
      {
        id: 503,
        name: "Approvers",
        description: "Approver hierarchy",
        url: "/travel-management/policy/approvers",
        privilege: "",
      },
      {
        id: 504,
        name: "Settings",
        description: "Policy settings",
        url: "/travel-management/policy/settings",
        privilege: "",
      },
    ],
  },
];

export default function VehicleManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className="flex">
        {/* Sidebar - Handles its own positioning */}
        <Sidebar data={vehicleManagementSideBarData} title="Vehicle Management" />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-h-screen lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
