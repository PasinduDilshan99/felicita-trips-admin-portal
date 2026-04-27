// components/NotificationBell.tsx
"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationPanel from "./NotificationPanel";

const NotificationBell = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { unreadCount, hasUnreadNotifications } = useNotifications();
  const { theme } = useTheme();

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleOpenPanel}
          className="p-2 rounded-full hover:bg-white/10 transition-colors relative text-white"
          style={{
            transition: "all 0.2s ease",
          }}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {hasUnreadNotifications && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center"
              style={{
                minWidth: "20px",
                height: "20px",
                background: theme.error || "#ef4444",
                color: "#ffffff",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "9999px",
                padding: "0 4px",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      <NotificationPanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </>
  );
};

export default NotificationBell;