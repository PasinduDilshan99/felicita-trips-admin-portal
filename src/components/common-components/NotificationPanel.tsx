"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Bell,
  X,
  Check,
  ChevronRight,
  MailOpen,
  AlertCircle,
  Info,
  AlertTriangle,
  Sparkles,
  CheckCheck,
  MapPin,
  Map,
  Plane,
  Hotel,
  Star,
  Calendar,
  Clock,
  Users,
  User,
  MessageSquare,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Tag,
  Package,
  Settings,
  Shield,
  Lock,
  Unlock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Globe,
  Image,
  Camera,
  FileText,
  Folder,
  Link,
  ExternalLink,
  Home,
  Navigation,
  Compass,
  Sunset,
  Mountain,
  Waves,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Notification, NotificationPriority } from "@/types/notification-types";

/* ── Lucide icon name → component map ── */
const LUCIDE_ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  MapPin, Map, Plane, Hotel, Star, Calendar, Clock, Users, User,
  MessageSquare, Mail, Phone, CreditCard, DollarSign, Tag, Package,
  Settings, Shield, Lock, Unlock, Eye, Heart, Bookmark, Share2,
  Upload, Download, Trash2, Edit, Plus, Minus, RefreshCw,
  CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, HelpCircle,
  Bell, Globe, Image, Camera, FileText, Folder, Link, ExternalLink,
  Home, Navigation, Compass, Sunset, Mountain, Waves, Sparkles,
};

/** Resolve an API icon string like "MapPin" → Lucide component, fallback to Info */
function resolveIcon(
  iconName: string | null | undefined
): React.FC<{ size?: number; style?: React.CSSProperties }> {
  if (!iconName) return Info;
  return LUCIDE_ICON_MAP[iconName] ?? Info;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: EASE_IN },
  },
};

const panelVariants: Variants = {
  hidden: {
    x: "100%",
    opacity: 0,
    scale: 0.97,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      duration: 0.52,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.3,
      ease: EASE_IN,
    },
  },
};

const notificationVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.045,
      duration: 0.38,
      ease: EASE_OUT,
    },
  }),
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: {
      duration: 0.32,
      ease: EASE_IN,
    },
  },
  hover: {
    x: -3,
    transition: { duration: 0.22, ease: EASE_OUT },
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
      duration: 0.4,
    },
  },
};

const dotPulseVariants: Variants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ["-400px 0", "400px 0"],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.08,
    rotate: -4,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const checkBtnVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.12,
    transition: { duration: 0.18 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  done: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.04,
    transition: { duration: 0.18 },
  },
  tap: {
    scale: 0.96,
    transition: { duration: 0.1 },
  },
};

const readAllVariants: Variants = {
  rest: { gap: 5 },
  hover: {
    gap: 8,
    transition: { duration: 0.2 },
  },
};

const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const bellRingVariants: Variants = {
  animate: {
    rotate: [0, 18, -14, 10, -6, 3, 0],
    transition: {
      duration: 0.65,
      ease: EASE_OUT,
    },
  },
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const PRIORITY_CONFIG: Record<
  NotificationPriority | "DEFAULT",
  { color: string; label: string; Icon: React.FC<{ size?: number; style?: React.CSSProperties }> }
> = {
  HIGH:    { color: "#ef4444", label: "High",   Icon: AlertCircle as any },
  MEDIUM:  { color: "#f59e0b", label: "Medium", Icon: AlertTriangle as any },
  LOW:     { color: "#10b981", label: "Low",    Icon: Info as any },
  DEFAULT: { color: "#6366f1", label: "Info",   Icon: Info as any },
};

function getPriorityCfg(priority: NotificationPriority, theme: any) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.DEFAULT;
  if (priority === "HIGH")   return { ...cfg, color: theme.error   || cfg.color };
  if (priority === "MEDIUM") return { ...cfg, color: theme.warning || cfg.color };
  if (priority === "LOW")    return { ...cfg, color: theme.success || cfg.color };
  return { ...cfg, color: theme.primary || cfg.color };
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ── Shimmer skeleton row ── */
function SkeletonRow({ theme }: { theme: any }) {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      style={{
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        marginBottom: 8,
        borderRadius: 13,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
          background: `linear-gradient(90deg, 
            ${theme.border}20 25%, 
            ${theme.border}40 50%, 
            ${theme.border}20 75%)`,
          backgroundSize: "800px 100%",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            height: 13,
            width: "60%",
            borderRadius: 6,
            background: `linear-gradient(90deg, 
              ${theme.border}20 25%, 
              ${theme.border}40 50%, 
              ${theme.border}20 75%)`,
            backgroundSize: "800px 100%",
          }}
        />
        <div
          style={{
            height: 11,
            width: "90%",
            borderRadius: 6,
            background: `linear-gradient(90deg, 
              ${theme.border}20 25%, 
              ${theme.border}40 50%, 
              ${theme.border}20 75%)`,
            backgroundSize: "800px 100%",
          }}
        />
        <div
          style={{
            height: 11,
            width: "40%",
            borderRadius: 6,
            background: `linear-gradient(90deg, 
              ${theme.border}20 25%, 
              ${theme.border}40 50%, 
              ${theme.border}20 75%)`,
            backgroundSize: "800px 100%",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [justRead, setJustRead] = useState<Set<number>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    fetchingNotifications,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    hasUnreadNotifications,
  } = useNotifications();
  const { theme } = useTheme();

  /* Close with exit animation */
  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => { onClose(); setIsClosing(false); }, 300);
  };

  /* Outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) closePanel();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* Bell ring on new unread */
  useEffect(() => {
    if (hasUnreadNotifications && unreadCount > 0 && isOpen) {
      setAnimateBell(true);
      const t = setTimeout(() => setAnimateBell(false), 700);
      return () => clearTimeout(t);
    }
  }, [unreadCount, hasUnreadNotifications, isOpen]);

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setJustRead(prev => new Set(prev).add(id));
    await markAsRead(id);
    setTimeout(() => {
      setJustRead(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 320);
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) await markAsRead(n.loggedUserId);
    if (n.actionUrl) { window.location.href = n.actionUrl; closePanel(); }
  };

  const isLoading = loading || fetchingNotifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[1150] cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
            onClick={closePanel}
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-[1200] flex flex-col"
            style={{
              width: "100%",
              maxWidth: 420,
              background: theme.surface,
              borderLeft: `1px solid ${theme.border}`,
              boxShadow: "-12px 0 60px rgba(0,0,0,0.18), -4px 0 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                padding: "18px 20px 16px",
                borderBottom: `1px solid ${theme.border}`,
                flexShrink: 0,
                background: `linear-gradient(180deg, ${theme.surface} 60%, ${theme.surface}00)`,
                position: "relative",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.primary}80, ${theme.primary}20, transparent)`,
                  borderRadius: "0 0 4px 4px",
                }}
              />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Left: Bell + title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 40, height: 40,
                        borderRadius: 12,
                        background: `${theme.primary}12`,
                        border: `1px solid ${theme.primary}20`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <motion.div
                        variants={bellRingVariants}
                        animate={animateBell ? "animate" : undefined}
                      >
                        <Bell size={18} style={{ color: theme.primary }} />
                      </motion.div>
                    </div>
                    {hasUnreadNotifications && (
                      <motion.span
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          position: "absolute",
                          top: -4, right: -4,
                          minWidth: 18, height: 18,
                          padding: "0 4px",
                          background: theme.error || "#ef4444",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          borderRadius: 99,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 0 2px ${theme.surface}`,
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </motion.span>
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>
                      Notifications
                    </h2>
                    <p style={{ fontSize: "0.72rem", color: theme.textSecondary, margin: "2px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                      {unreadCount > 0 ? (
                        <>
                          <motion.span
                            variants={dotPulseVariants}
                            animate="animate"
                            style={{
                              width: 6, height: 6,
                              borderRadius: "50%",
                              background: theme.primary,
                              display: "inline-block",
                            }}
                          />
                          <span style={{ color: theme.primary, fontWeight: 600 }}>{unreadCount} unread</span>
                          <span style={{ opacity: 0.5 }}>·</span>
                        </>
                      ) : null}
                      <span style={{ opacity: 0.6 }}>{notifications.length} total</span>
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {unreadCount > 0 && (
                    <motion.button
                      variants={buttonHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={markAllAsRead}
                      style={{
                        padding: "7px 12px",
                        borderRadius: 9,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        background: `${theme.primary}12`,
                        color: theme.primary,
                        border: `1px solid ${theme.primary}25`,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5,
                        letterSpacing: "0.01em",
                      }}
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </motion.button>
                  )}
                  <motion.button
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={closePanel}
                    aria-label="Close"
                    style={{
                      width: 34, height: 34,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${theme.background}`,
                      color: theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 9,
                      cursor: "pointer",
                    }}
                  >
                    <X size={15} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Body */}
            <div
              className="np-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px 10px 8px",
              }}
            >
              {/* Loading state */}
              {isLoading ? (
                <div style={{ paddingTop: 4 }}>
                  {[0, 1, 2, 3].map(i => <SkeletonRow key={i} theme={theme} />)}
                </div>

              /* Error state */
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "60px 24px", gap: 14, textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: `${theme.error || "#ef4444"}12`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <AlertCircle size={28} style={{ color: theme.error || "#ef4444" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.text, margin: "0 0 4px" }}>
                      Couldn't load notifications
                    </p>
                    <p style={{ fontSize: "0.78rem", color: theme.textSecondary, margin: 0 }}>{error}</p>
                  </div>
                  <motion.button
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={fetchNotifications}
                    style={{
                      padding: "9px 20px", borderRadius: 10,
                      background: theme.primary, color: "#fff",
                      border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                      boxShadow: `0 4px 14px ${theme.primary}40`,
                    }}
                  >
                    Try again
                  </motion.button>
                </motion.div>

              /* Empty state */
              ) : notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "70px 24px", gap: 14, textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 72, height: 72, borderRadius: 20,
                      background: `${theme.primary}08`,
                      border: `1px dashed ${theme.primary}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Sparkles size={28} style={{ color: theme.primary, opacity: 0.5 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: theme.text, margin: "0 0 5px" }}>
                      All caught up!
                    </p>
                    <p style={{ fontSize: "0.78rem", color: theme.textSecondary, margin: 0, lineHeight: 1.5, opacity: 0.7 }}>
                      No notifications yet. New alerts<br />will show up here.
                    </p>
                  </div>
                </motion.div>

              /* Notifications list */
              ) : (
                <div style={{ paddingTop: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {notifications.map((n, index) => {
                      const cfg = getPriorityCfg(n.priority, theme);
                      const isUnread = !n.isRead;
                      const wasJustRead = justRead.has(n.loggedUserId);
                      const IconComponent = resolveIcon((n as any).icon);
                      const iconColor = (n as any).color || cfg.color;

                      return (
                        <motion.div
                          key={n.loggedUserId}
                          variants={notificationVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                          custom={index}
                          onClick={() => handleNotificationClick(n)}
                          style={{
                            padding: "13px 13px 12px",
                            marginBottom: 7,
                            borderRadius: 13,
                            cursor: n.actionUrl ? "pointer" : "default",
                            background: isUnread && !wasJustRead
                              ? `linear-gradient(135deg, ${cfg.color}06 0%, ${theme.primary}05 100%)`
                              : wasJustRead
                              ? theme.background
                              : theme.background,
                            border: `1px solid ${isUnread && !wasJustRead ? `${cfg.color}22` : theme.border}`,
                            position: "relative",
                            opacity: wasJustRead ? 0.6 : 1,
                          }}
                        >
                          {/* Left colour accent for unread */}
                          {isUnread && !wasJustRead && (
                            <div
                              style={{
                                position: "absolute",
                                left: 0, top: "20%", bottom: "20%",
                                width: 3,
                                background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
                                borderRadius: "0 3px 3px 0",
                              }}
                            />
                          )}

                          <div style={{ display: "flex", gap: 11, paddingLeft: isUnread && !wasJustRead ? 4 : 0 }}>
                            {/* Icon */}
                            <motion.div
                              variants={iconVariants}
                              initial="rest"
                              whileHover="hover"
                              style={{
                                width: 40, height: 40,
                                borderRadius: 11,
                                background: `${iconColor}18`,
                                border: `1px solid ${iconColor}25`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={19} style={{ color: iconColor }} />
                            </motion.div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {/* Title row */}
                              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                                <h4 style={{
                                  fontSize: "0.84rem", fontWeight: isUnread && !wasJustRead ? 700 : 600,
                                  color: theme.text, margin: 0, lineHeight: 1.3,
                                }}>
                                  {n.title}
                                </h4>
                                <span
                                  style={{
                                    fontSize: "0.62rem",
                                    padding: "2px 6px",
                                    borderRadius: 5,
                                    background: `${cfg.color}14`,
                                    color: cfg.color,
                                    fontWeight: 700,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {cfg.label}
                                </span>
                              </div>

                              {/* Message */}
                              <p style={{
                                fontSize: "0.78rem", color: theme.textSecondary,
                                margin: "0 0 8px", lineHeight: 1.45,
                              }}>
                                {n.message}
                              </p>

                              {/* Meta row */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.68rem", color: theme.textSecondary, opacity: 0.6 }}>
                                  {formatTime(n.readAt)}
                                </span>
                                {n.sourceModule && (
                                  <span style={{
                                    fontSize: "0.62rem",
                                    padding: "2px 7px",
                                    borderRadius: 5,
                                    background: `${theme.border}50`,
                                    color: theme.textSecondary,
                                    fontWeight: 500,
                                  }}>
                                    {n.sourceModule}
                                  </span>
                                )}
                              </div>

                              {/* Action link */}
                              {n.actionText && (
                                <div style={{
                                  marginTop: 8,
                                  fontSize: "0.74rem",
                                  color: theme.primary,
                                  fontWeight: 600,
                                  display: "flex", alignItems: "center", gap: 3,
                                }}>
                                  {n.actionText}
                                  <ChevronRight size={12} />
                                </div>
                              )}
                            </div>

                            {/* Mark as read button */}
                            {isUnread && !wasJustRead && (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", gap: 6 }}>
                                <motion.div
                                  variants={dotPulseVariants}
                                  animate="animate"
                                  style={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    background: theme.primary,
                                    boxShadow: `0 0 0 2px ${theme.primary}30`,
                                  }}
                                />
                                <motion.button
                                  variants={checkBtnVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={(e) => handleMarkAsRead(n.loggedUserId, e)}
                                  title="Mark as read"
                                  style={{
                                    width: 28, height: 28,
                                    borderRadius: 7,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "transparent",
                                    border: `1px solid ${theme.border}`,
                                    cursor: "pointer",
                                    marginTop: 2,
                                  }}
                                >
                                  <Check size={13} style={{ color: theme.textSecondary }} />
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isLoading && !error && notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: "10px 20px 14px",
                  borderTop: `1px solid ${theme.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: unreadCount > 0 ? "space-between" : "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "0.7rem", color: theme.textSecondary, opacity: 0.55 }}>
                  {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                </span>
                {unreadCount > 0 && (
                  <motion.button
                    variants={readAllVariants}
                    initial="rest"
                    whileHover="hover"
                    onClick={markAllAsRead}
                    style={{
                      background: "transparent", border: "none",
                      color: theme.primary,
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 0",
                    }}
                  >
                    <MailOpen size={13} />
                    Mark all as read
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;