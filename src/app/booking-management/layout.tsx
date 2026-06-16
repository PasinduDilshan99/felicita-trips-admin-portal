import Sidebar from "@/components/common-components/static-components/SideBar";
import { bookingManagementSideBarData } from "@/data/side-bar-data";
import React from "react";

export default function TravelManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className="flex">
        <Sidebar data={bookingManagementSideBarData} title="Travel Management" />

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
