"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Bell, BellRing } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationPanel from "./NotificationPanel";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const bellVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  notify: {
    scale: [1, 1.2, 1],
    rotate: [0, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      duration: 0.2,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: EASE_IN,
    },
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

interface NotificationBellProps {
  mobile?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ mobile = false }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { unreadCount, hasUnreadNotifications, markAsRead } = useNotifications();
  const { theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Trigger animation when new notification arrives
  useEffect(() => {
    if (hasUnreadNotifications && !isPanelOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hasUnreadNotifications, isPanelOpen]);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  // Get badge display text
  const getBadgeText = (count: number): string => {
    if (count > 99) return "99+";
    return count.toString();
  };

  return (
    <>
      <div className={`relative ${mobile ? "w-full" : ""}`}>
        <motion.button
          ref={buttonRef}
          onClick={handleOpenPanel}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          animate={isAnimating ? "notify" : "rest"}
          className={`
            relative rounded-full transition-colors cursor-pointer
            ${mobile 
              ? "w-full flex items-center justify-between px-4 py-3 rounded-lg" 
              : "p-2 hover:bg-white/10"
            }
          `}
          style={{
            transition: "all 0.2s ease",
            backgroundColor: mobile ? "transparent" : "transparent",
          }}
          aria-label={`Notifications${hasUnreadNotifications ? ` (${unreadCount} unread)` : ""}`}
        >
          <div className={`flex items-center ${mobile ? "gap-3" : ""}`}>
            <div className="relative">
              <motion.div
                variants={bellVariants}
                animate={isAnimating ? "notify" : "rest"}
                style={{ display: "inline-block" }}
              >
                {hasUnreadNotifications ? (
                  <BellRing 
                    size={mobile ? 20 : 20} 
                    className={mobile ? "text-gray-600 dark:text-gray-400" : "text-white"}
                  />
                ) : (
                  <Bell 
                    size={mobile ? 20 : 20} 
                    className={mobile ? "text-gray-600 dark:text-gray-400" : "text-white"}
                  />
                )}
              </motion.div>

              {/* Notification Badge */}
              <AnimatePresence mode="wait">
                {hasUnreadNotifications && (
                  <motion.span
                    key="badge"
                    variants={badgeVariants}
                    initial="hidden"
                    animate={["visible", "pulse"]}
                    exit="exit"
                    className="absolute -top-1 -right-1 flex items-center justify-center"
                    style={{
                      minWidth: "18px",
                      height: "18px",
                      background: theme.error || "#ef4444",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: "bold",
                      borderRadius: "9999px",
                      padding: "0 4px",
                      boxShadow: `0 0 0 2px ${mobile ? theme.surface : "rgba(255,255,255,0.2)"}`,
                    }}
                  >
                    {getBadgeText(unreadCount)}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile text */}
            {mobile && (
              <span 
                className="flex-1 text-left text-sm font-medium"
                style={{ color: theme.text }}
              >
                Notifications
                {hasUnreadNotifications && (
                  <span 
                    className="ml-2 text-xs font-normal"
                    style={{ color: theme.error }}
                  >
                    ({unreadCount} new)
                  </span>
                )}
              </span>
            )}

            {/* Mobile chevron indicator */}
            {mobile && (
              <svg
                className="w-4 h-4 transition-transform duration-200"
                style={{ color: theme.textSecondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </div>
        </motion.button>
      </div>

      <NotificationPanel isOpen={isPanelOpen} onClose={handleClosePanel} />
    </>
  );
};

export default NotificationBell;