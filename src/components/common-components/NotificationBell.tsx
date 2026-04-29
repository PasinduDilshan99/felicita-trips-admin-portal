"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Bell, BellRing } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationPanel from "./NotificationPanel";

/* ─── Easing Constants ───────────────────────────────────────────────────── */

const SPRING_SNAPPY = { type: "spring", stiffness: 500, damping: 22 } as const;
const SPRING_GENTLE = { type: "spring", stiffness: 320, damping: 28 } as const;
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const bellVariants: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -12, 12, -8, 8, -4, 4, 0],
    scale: 1.08,
    transition: { duration: 0.45, ease: EASE_EXPO },
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.08, ease: "easeIn" },
  },
  notify: {
    rotate: [0, -14, 14, -10, 10, -5, 5, 0],
    scale: [1, 1.15, 1],
    transition: { duration: 0.55, ease: EASE_EXPO },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0, y: 2 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { ...SPRING_SNAPPY, delay: 0.05 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    y: 2,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const pulseRingVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [1, 1.8],
    opacity: [0.6, 0],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      repeatDelay: 1.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.18, ease: EASE_EXPO } },
  tap: { scale: 0.93, transition: { duration: 0.08 } },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

interface NotificationBellProps {
  mobile?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ mobile = false }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { unreadCount, hasUnreadNotifications } = useNotifications();
  const { theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasUnreadNotifications && !isPanelOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [hasUnreadNotifications, isPanelOpen]);

  const getBadgeText = (count: number): string =>
    count > 99 ? "99+" : count.toString();

  /* ── Desktop Bell ── */
  if (!mobile) {
    return (
      <>
        <motion.button
          ref={buttonRef}
          onClick={() => setIsPanelOpen(true)}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          className="relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer outline-none"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          aria-label={`Notifications${hasUnreadNotifications ? ` — ${unreadCount} unread` : ""}`}
        >
          {/* Icon */}
          <motion.span
            variants={bellVariants}
            animate={isAnimating ? "notify" : "rest"}
            style={{ display: "inline-flex" }}
          >
            {hasUnreadNotifications ? (
              <BellRing size={18} style={{ color: "rgba(255,255,255,0.92)" }} />
            ) : (
              <Bell size={18} style={{ color: "rgba(255,255,255,0.75)" }} />
            )}
          </motion.span>

          {/* Badge + pulse ring */}
          <AnimatePresence>
            {hasUnreadNotifications && (
              <>
                {/* Pulse ring */}
                <motion.span
                  key="pulse-ring"
                  variants={pulseRingVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full pointer-events-none"
                  style={{ background: theme.error ?? "#ef4444" }}
                />

                {/* Badge */}
                <motion.span
                  key="badge"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute -top-1 -right-1 flex items-center justify-center rounded-full pointer-events-none"
                  style={{
                    minWidth: 17,
                    height: 17,
                    background: theme.error ?? "#ef4444",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    padding: "0 4px",
                    boxShadow: `0 0 0 2px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.25)`,
                  }}
                >
                  {getBadgeText(unreadCount)}
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </motion.button>

        <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      </>
    );
  }

  /* ── Mobile Row ── */
  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={() => setIsPanelOpen(true)}
        variants={buttonVariants}
        initial="rest"
        whileTap="tap"
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer outline-none"
        style={{
          background: "transparent",
          border: "none",
          transition: "background 0.18s ease",
        }}
        onHoverStart={(e) =>
          ((e.currentTarget as HTMLElement).style.background =
            "rgba(0,0,0,0.04)")
        }
        onHoverEnd={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "transparent")
        }
        aria-label={`Notifications${hasUnreadNotifications ? ` — ${unreadCount} unread` : ""}`}
      >
        {/* Icon container */}
        <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
          style={{
            background: hasUnreadNotifications
              ? `${theme.error ?? "#ef4444"}15`
              : "rgba(0,0,0,0.05)",
            transition: "background 0.2s ease",
          }}
        >
          <motion.span
            variants={bellVariants}
            animate={isAnimating ? "notify" : "rest"}
            style={{ display: "inline-flex" }}
          >
            {hasUnreadNotifications ? (
              <BellRing size={16} style={{ color: theme.error ?? "#ef4444" }} />
            ) : (
              <Bell size={16} style={{ color: theme.textSecondary ?? "#6b7280" }} />
            )}
          </motion.span>

          {/* Badge */}
          <AnimatePresence>
            {hasUnreadNotifications && (
              <motion.span
                key="mobile-badge"
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute -top-1 -right-1 flex items-center justify-center rounded-full pointer-events-none"
                style={{
                  minWidth: 16,
                  height: 16,
                  background: theme.error ?? "#ef4444",
                  color: "#fff",
                  fontSize: 8,
                  fontWeight: 700,
                  padding: "0 3px",
                  boxShadow: `0 0 0 2px ${theme.surface ?? "#fff"}`,
                }}
              >
                {getBadgeText(unreadCount)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Label */}
        <span
          className="flex-1 text-left text-sm font-medium"
          style={{ color: theme.text ?? "#111827" }}
        >
          Notifications
        </span>

        {/* Unread pill */}
        <AnimatePresence>
          {hasUnreadNotifications ? (
            <motion.span
              key="unread-pill"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: SPRING_GENTLE }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
              className="flex items-center justify-center rounded-full px-2 py-0.5"
              style={{
                background: `${theme.error ?? "#ef4444"}18`,
                color: theme.error ?? "#ef4444",
                fontSize: 11,
                fontWeight: 600,
                minWidth: 28,
              }}
            >
              {getBadgeText(unreadCount)}
            </motion.span>
          ) : (
            /* Chevron when no notifications */
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: theme.textSecondary ?? "#9ca3af", flexShrink: 0 }}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          )}
        </AnimatePresence>
      </motion.button>

      <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default NotificationBell;