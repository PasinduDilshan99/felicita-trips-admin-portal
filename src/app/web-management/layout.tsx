// app/travel-management/layout.tsx
"use client";

import Sidebar from "@/components/common-components/SideBar";
import { webManagementSideBarData } from "@/data/side-bar-data";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function WebManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, isDarkMode } = useTheme();

  // Determine background color based on theme
  const getBackgroundColor = () => {
    if (isDarkMode) {
      return theme.background;
    }
    return "#F1F5F9"; // Keep the original light background
  };

  return (
    <div
      className="transition-colors duration-300"
      style={{
        backgroundColor: getBackgroundColor(),
        minHeight: "100vh",
      }}
    >
      <div className="flex">
        <Sidebar data={webManagementSideBarData} title="Web Management" />
        <main className="flex-1 w-full lg:ml-0">
          <div className="">
            <div className="mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
