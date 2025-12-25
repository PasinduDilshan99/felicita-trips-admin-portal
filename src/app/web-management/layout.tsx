// app/travel-management/layout.tsx
import Sidebar from "@/components/common-components/SideBar";
import { webManagementSideBarData } from "@/utils/side-bar-data";
import React from "react";

export default function TravelManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className="flex">
        <Sidebar data={webManagementSideBarData} title="Web Management" />
        <main className="flex-1 w-full lg:ml-0">
          <div className="p-2 sm:p-4 lg:p-6 pt-12 lg:pt-4">
            <div className=" mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
