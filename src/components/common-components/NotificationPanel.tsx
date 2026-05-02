"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Bell, X, Check, ChevronRight, MailOpen, AlertCircle, Info,
  AlertTriangle, Sparkles, CheckCheck, MapPin, Map, Plane, Hotel,
  Star, Calendar, Clock, Users, User, MessageSquare, Mail, Phone,
  CreditCard, DollarSign, Tag, Package, Settings, Shield, Lock,
  Unlock, Eye, Heart, Bookmark, Share2, Upload, Download, Trash2,
  Edit, Plus, Minus, RefreshCw, CheckCircle, XCircle, HelpCircle,
  Globe, Image, Camera, FileText, Folder, Link, ExternalLink, Home,
  Navigation, Compass, Sunset, Mountain, Waves, Filter, SlidersHorizontal,
} from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Notification, NotificationPriority } from "@/types/notification-types";

/* ── Lucide icon map ── */
const LUCIDE_ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  MapPin, Map, Plane, Hotel, Star, Calendar, Clock, Users, User,
  MessageSquare, Mail, Phone, CreditCard, DollarSign, Tag, Package,
  Settings, Shield, Lock, Unlock, Eye, Heart, Bookmark, Share2,
  Upload, Download, Trash2, Edit, Plus, Minus, RefreshCw,
  CheckCircle, XCircle, AlertCircle, AlertTriangle, Info, HelpCircle,
  Bell, Globe, Image, Camera, FileText, Folder, Link, ExternalLink,
  Home, Navigation, Compass, Sunset, Mountain, Waves, Sparkles,
};

function resolveIcon(iconName: string | null | undefined): React.FC<{ size?: number; style?: React.CSSProperties }> {
  if (!iconName) return Info;
  return LUCIDE_ICON_MAP[iconName] ?? Info;
}

/* ─── Filter Types ─── */
type FilterStatus = "all" | "unread" | "read";
type FilterPriority = "all" | "HIGH" | "MEDIUM" | "LOW";

interface FilterState {
  status: FilterStatus;
  priority: FilterPriority;
}

/* ─── Animation Variants ─── */
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: EASE_IN } },
};

const panelVariants: Variants = {
  hidden: { x: "100%", opacity: 0, scale: 0.97 },
  visible: {
    x: 0, opacity: 1, scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 200, duration: 0.52 },
  },
  exit: {
    x: "100%", opacity: 0, scale: 0.96,
    transition: { duration: 0.3, ease: EASE_IN },
  },
};

const notificationVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: (custom: number) => ({
    opacity: 1, x: 0,
    transition: { delay: custom * 0.04, duration: 0.35, ease: EASE_OUT },
  }),
  exit: {
    opacity: 0, x: 40, scale: 0.96,
    transition: { duration: 0.28, ease: EASE_IN },
  },
  hover: { x: -3, transition: { duration: 0.22, ease: EASE_OUT } },
};

const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
};

const dotPulseVariants: Variants = {
  animate: {
    scale: [1, 1.5, 1], opacity: [1, 0.7, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ["-400px 0", "400px 0"],
    transition: { duration: 1.6, repeat: Infinity, ease: "linear" },
  },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: -4, transition: { duration: 0.2, ease: EASE_OUT } },
};

const checkBtnVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.12, transition: { duration: 0.18 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.18 } },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

const bellRingVariants: Variants = {
  animate: {
    rotate: [0, 18, -14, 10, -6, 3, 0],
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const filterBarVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -8 },
  visible: {
    opacity: 1, height: "auto", y: 0,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
  exit: {
    opacity: 0, height: 0, y: -6,
    transition: { duration: 0.22, ease: EASE_IN },
  },
};

const spinVariants: Variants = {
  spinning: {
    rotate: 360,
    transition: { duration: 0.75, repeat: Infinity, ease: "linear" },
  },
  idle: { rotate: 0 },
};

const chipVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.15 } },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

/* ─── Helpers ─── */
const PRIORITY_CONFIG: Record<
  NotificationPriority | "DEFAULT",
  { color: string; label: string; Icon: React.FC<{ size?: number; style?: React.CSSProperties }> }
> = {
  HIGH: { color: "#ef4444", label: "High", Icon: AlertCircle as any },
  MEDIUM: { color: "#f59e0b", label: "Medium", Icon: AlertTriangle as any },
  LOW: { color: "#10b981", label: "Low", Icon: Info as any },
  DEFAULT: { color: "#6366f1", label: "Info", Icon: Info as any },
};

function getPriorityCfg(priority: NotificationPriority, theme: any) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.DEFAULT;
  if (priority === "HIGH") return { ...cfg, color: theme.error || cfg.color };
  if (priority === "MEDIUM") return { ...cfg, color: theme.warning || cfg.color };
  if (priority === "LOW") return { ...cfg, color: theme.success || cfg.color };
  return { ...cfg, color: theme.primary || cfg.color };
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ── Shimmer skeleton ── */
function SkeletonRow({ theme }: { theme: any }) {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      style={{
        padding: "14px 14px",
        display: "flex", gap: 12, marginBottom: 8, borderRadius: 13,
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(90deg, ${theme.border}20 25%, ${theme.border}40 50%, ${theme.border}20 75%)`,
          backgroundSize: "800px 100%",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {["60%", "90%", "40%"].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 13 : 11, width: w, borderRadius: 6,
              background: `linear-gradient(90deg, ${theme.border}20 25%, ${theme.border}40 50%, ${theme.border}20 75%)`,
              backgroundSize: "800px 100%",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Filter Chip ── */
interface FilterChipProps {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
  theme: any;
  dot?: boolean;
}

function FilterChip({ label, active, color, onClick, theme, dot }: FilterChipProps) {
  const accentColor = color || theme.primary;
  return (
    <motion.button
      variants={chipVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{
        padding: "5px 11px",
        borderRadius: 8,
        fontSize: "0.7rem",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        border: `1px solid ${active ? `${accentColor}40` : theme.border}`,
        background: active ? `${accentColor}15` : "transparent",
        color: active ? accentColor : theme.textSecondary,
        display: "inline-flex", alignItems: "center", gap: 5,
        transition: "background 0.18s, color 0.18s, border-color 0.18s",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: active ? accentColor : theme.textSecondary,
            opacity: active ? 1 : 0.4,
            flexShrink: 0,
            transition: "background 0.18s",
          }}
        />
      )}
      {label}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [justRead, setJustRead] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ status: "all", priority: "all" });
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications, unreadCount, loading, fetchingNotifications, error,
    fetchNotifications, markAsRead, markAllAsRead, hasUnreadNotifications,
  } = useNotifications();
  const { theme } = useTheme();

  /* Filtered notifications */
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const statusOk =
        filters.status === "all" ? true :
        filters.status === "unread" ? !n.isRead :
        n.isRead;
      const priorityOk =
        filters.priority === "all" ? true :
        n.priority === filters.priority;
      return statusOk && priorityOk;
    });
  }, [notifications, filters]);

  const isFiltered = filters.status !== "all" || filters.priority !== "all";
  const activeFilterCount = (filters.status !== "all" ? 1 : 0) + (filters.priority !== "all" ? 1 : 0);

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

  /* Refresh handler */
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await fetchNotifications();
    // Min visual spin of 700ms for polish
    setTimeout(() => setIsRefreshing(false), 700);
  };

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

  const clearFilters = () => setFilters({ status: "all", priority: "all" });

  const isLoading = loading || fetchingNotifications;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[1150] cursor-pointer"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
            onClick={closePanel}
          />

          {/* Side Panel */}
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed right-0 top-0 bottom-0 z-[1200] flex flex-col"
            style={{
              width: "100%", maxWidth: 420,
              background: theme.surface,
              borderLeft: `1px solid ${theme.border}`,
              boxShadow: "-12px 0 60px rgba(0,0,0,0.18), -4px 0 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                padding: "18px 20px 14px",
                borderBottom: `1px solid ${theme.border}`,
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${theme.primary}80, ${theme.primary}20, transparent)`,
                  borderRadius: "0 0 4px 4px",
                }}
              />

              {/* Title row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Left: Bell + title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: `${theme.primary}12`, border: `1px solid ${theme.primary}20`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <motion.div variants={bellRingVariants} animate={animateBell ? "animate" : undefined}>
                        <Bell size={18} style={{ color: theme.primary }} />
                      </motion.div>
                    </div>
                    {hasUnreadNotifications && (
                      <motion.span
                        variants={badgeVariants} initial="hidden" animate="visible"
                        style={{
                          position: "absolute", top: -4, right: -4,
                          minWidth: 18, height: 18, padding: "0 4px",
                          background: theme.error || "#ef4444", color: "#fff",
                          fontSize: "10px", fontWeight: 700, borderRadius: 99,
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
                            variants={dotPulseVariants} animate="animate"
                            style={{ width: 6, height: 6, borderRadius: "50%", background: theme.primary, display: "inline-block" }}
                          />
                          <span style={{ color: theme.primary, fontWeight: 600 }}>{unreadCount} unread</span>
                          <span style={{ opacity: 0.5 }}>·</span>
                        </>
                      ) : null}
                      <span style={{ opacity: 0.6 }}>{notifications.length} total</span>
                    </p>
                  </div>
                </div>

                {/* Right: action buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Mark all read */}
                  {unreadCount > 0 && (
                    <motion.button
                      variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                      onClick={markAllAsRead}
                      style={{
                        padding: "7px 11px", borderRadius: 9, fontSize: "0.72rem", fontWeight: 600,
                        background: `${theme.primary}12`, color: theme.primary,
                        border: `1px solid ${theme.primary}25`, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.01em",
                      }}
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </motion.button>
                  )}

                  {/* Refresh */}
                  <motion.button
                    variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Refresh notifications"
                    title="Refresh"
                    style={{
                      width: 34, height: 34,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isRefreshing ? `${theme.primary}10` : theme.background,
                      color: isRefreshing ? theme.primary : theme.textSecondary,
                      border: `1px solid ${isRefreshing ? `${theme.primary}30` : theme.border}`,
                      borderRadius: 9, cursor: isRefreshing ? "default" : "pointer",
                      transition: "background 0.2s, color 0.2s, border-color 0.2s",
                    }}
                  >
                    <motion.div
                      variants={spinVariants}
                      animate={isRefreshing ? "spinning" : "idle"}
                    >
                      <RefreshCw size={14} />
                    </motion.div>
                  </motion.button>

                  {/* Filter toggle */}
                  <motion.button
                    variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                    onClick={() => setShowFilters(v => !v)}
                    aria-label="Toggle filters"
                    title="Filter"
                    style={{
                      width: 34, height: 34,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: showFilters || isFiltered ? `${theme.primary}12` : theme.background,
                      color: showFilters || isFiltered ? theme.primary : theme.textSecondary,
                      border: `1px solid ${showFilters || isFiltered ? `${theme.primary}30` : theme.border}`,
                      borderRadius: 9, cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s, color 0.2s, border-color 0.2s",
                    }}
                  >
                    <SlidersHorizontal size={14} />
                    {/* Active filter badge */}
                    {activeFilterCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        style={{
                          position: "absolute", top: -3, right: -3,
                          width: 14, height: 14,
                          background: theme.primary, color: "#fff",
                          fontSize: "8px", fontWeight: 800, borderRadius: 99,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 0 2px ${theme.surface}`,
                        }}
                      >
                        {activeFilterCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Close */}
                  <motion.button
                    variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                    onClick={closePanel} aria-label="Close"
                    style={{
                      width: 34, height: 34,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: theme.background, color: theme.textSecondary,
                      border: `1px solid ${theme.border}`, borderRadius: 9, cursor: "pointer",
                    }}
                  >
                    <X size={15} />
                  </motion.button>
                </div>
              </div>

              {/* ── Filter Bar ── */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    variants={filterBarVariants}
                    initial="hidden" animate="visible" exit="exit"
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        marginTop: 14,
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: `${theme.background}`,
                        border: `1px solid ${theme.border}`,
                        display: "flex", flexDirection: "column", gap: 10,
                      }}
                    >
                      {/* Status row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.67rem", fontWeight: 600, color: theme.textSecondary, opacity: 0.7, letterSpacing: "0.05em", textTransform: "uppercase", minWidth: 44 }}>
                          Status
                        </span>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {(["all", "unread", "read"] as FilterStatus[]).map((s) => (
                            <FilterChip
                              key={s}
                              label={s === "all" ? "All" : s === "unread" ? "Unread" : "Read"}
                              active={filters.status === s}
                              color={s === "unread" ? theme.primary : s === "read" ? theme.success || "#10b981" : undefined}
                              dot={s !== "all"}
                              onClick={() => setFilters(f => ({ ...f, status: s }))}
                              theme={theme}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: theme.border, opacity: 0.6 }} />

                      {/* Priority row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.67rem", fontWeight: 600, color: theme.textSecondary, opacity: 0.7, letterSpacing: "0.05em", textTransform: "uppercase", minWidth: 44 }}>
                          Priority
                        </span>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {([
                            { key: "all", label: "All", color: undefined },
                            { key: "HIGH", label: "High", color: theme.error || "#ef4444" },
                            { key: "MEDIUM", label: "Medium", color: theme.warning || "#f59e0b" },
                            { key: "LOW", label: "Low", color: theme.success || "#10b981" },
                          ] as { key: FilterPriority; label: string; color?: string }[]).map(({ key, label, color }) => (
                            <FilterChip
                              key={key}
                              label={label}
                              active={filters.priority === key}
                              color={color}
                              dot={key !== "all"}
                              onClick={() => setFilters(f => ({ ...f, priority: key }))}
                              theme={theme}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Clear filters */}
                      {isFiltered && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <motion.button
                            variants={chipVariants} initial="rest" whileHover="hover" whileTap="tap"
                            onClick={clearFilters}
                            style={{
                              fontSize: "0.69rem", fontWeight: 600,
                              color: theme.textSecondary, opacity: 0.7,
                              background: "transparent", border: "none",
                              cursor: "pointer", padding: "2px 4px",
                              display: "flex", alignItems: "center", gap: 4,
                            }}
                          >
                            <X size={11} />
                            Clear filters
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active filter summary strip (when bar is closed but filters active) */}
              <AnimatePresence>
                {!showFilters && isFiltered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    style={{ overflow: "hidden", marginTop: 10 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.68rem", color: theme.textSecondary, opacity: 0.6 }}>Filtered:</span>
                      {filters.status !== "all" && (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                          background: `${theme.primary}14`, color: theme.primary,
                          textTransform: "capitalize",
                        }}>
                          {filters.status}
                        </span>
                      )}
                      {filters.priority !== "all" && (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                          background: `${PRIORITY_CONFIG[filters.priority]?.color || theme.primary}14`,
                          color: PRIORITY_CONFIG[filters.priority]?.color || theme.primary,
                        }}>
                          {filters.priority}
                        </span>
                      )}
                      <button
                        onClick={clearFilters}
                        style={{
                          fontSize: "0.65rem", color: theme.textSecondary, opacity: 0.5,
                          background: "none", border: "none", cursor: "pointer", padding: "0 2px",
                          display: "flex", alignItems: "center", gap: 2,
                        }}
                      >
                        <X size={10} /> Clear
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Body ── */}
            <div
              className="np-scroll"
              style={{ flex: 1, overflowY: "auto", padding: "10px 10px 8px" }}
            >
              {isLoading ? (
                <div style={{ paddingTop: 4 }}>
                  {[0, 1, 2, 3].map(i => <SkeletonRow key={i} theme={theme} />)}
                </div>

              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "60px 24px", gap: 14, textAlign: "center",
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: `${theme.error || "#ef4444"}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <AlertCircle size={28} style={{ color: theme.error || "#ef4444" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: theme.text, margin: "0 0 4px" }}>
                      Couldn't load notifications
                    </p>
                    <p style={{ fontSize: "0.78rem", color: theme.textSecondary, margin: 0 }}>{error}</p>
                  </div>
                  <motion.button
                    variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                    onClick={fetchNotifications}
                    style={{
                      padding: "9px 20px", borderRadius: 10, background: theme.primary, color: "#fff",
                      border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                      boxShadow: `0 4px 14px ${theme.primary}40`,
                    }}
                  >
                    Try again
                  </motion.button>
                </motion.div>

              ) : filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "70px 24px", gap: 14, textAlign: "center",
                  }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: `${theme.primary}08`, border: `1px dashed ${theme.primary}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isFiltered
                      ? <Filter size={26} style={{ color: theme.primary, opacity: 0.45 }} />
                      : <Sparkles size={28} style={{ color: theme.primary, opacity: 0.5 }} />
                    }
                  </div>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: theme.text, margin: "0 0 5px" }}>
                      {isFiltered ? "No matches" : "All caught up!"}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: theme.textSecondary, margin: 0, lineHeight: 1.5, opacity: 0.7 }}>
                      {isFiltered
                        ? <>No notifications match the<br />current filters.</>
                        : <>No notifications yet. New alerts<br />will show up here.</>
                      }
                    </p>
                  </div>
                  {isFiltered && (
                    <motion.button
                      variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap"
                      onClick={clearFilters}
                      style={{
                        padding: "8px 18px", borderRadius: 9,
                        background: `${theme.primary}12`, color: theme.primary,
                        border: `1px solid ${theme.primary}25`, cursor: "pointer",
                        fontSize: "0.78rem", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      <X size={13} />
                      Clear filters
                    </motion.button>
                  )}
                </motion.div>

              ) : (
                <div style={{ paddingTop: 2 }}>
                  {/* Result count when filtered */}
                  {isFiltered && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{
                        fontSize: "0.68rem", color: theme.textSecondary,
                        opacity: 0.55, marginBottom: 8, paddingLeft: 2,
                      }}
                    >
                      Showing {filteredNotifications.length} of {notifications.length}
                    </motion.div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((n, index) => {
                      const cfg = getPriorityCfg(n.priority, theme);
                      const isUnread = !n.isRead;
                      const wasJustRead = justRead.has(n.loggedUserId);
                      const IconComponent = resolveIcon((n as any).icon);
                      const iconColor = (n as any).color || cfg.color;

                      return (
                        <motion.div
                          key={n.loggedUserId}
                          variants={notificationVariants}
                          initial="hidden" animate="visible" exit="exit"
                          whileHover="hover"
                          custom={index}
                          onClick={() => handleNotificationClick(n)}
                          style={{
                            padding: "13px 13px 12px",
                            marginBottom: 7, borderRadius: 13,
                            cursor: n.actionUrl ? "pointer" : "default",
                            background: isUnread && !wasJustRead
                              ? `linear-gradient(135deg, ${cfg.color}06 0%, ${theme.primary}05 100%)`
                              : theme.background,
                            border: `1px solid ${isUnread && !wasJustRead ? `${cfg.color}22` : theme.border}`,
                            position: "relative",
                            opacity: wasJustRead ? 0.6 : 1,
                          }}
                        >
                          {isUnread && !wasJustRead && (
                            <div
                              style={{
                                position: "absolute", left: 0, top: "20%", bottom: "20%",
                                width: 3,
                                background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
                                borderRadius: "0 3px 3px 0",
                              }}
                            />
                          )}

                          <div style={{ display: "flex", gap: 11, paddingLeft: isUnread && !wasJustRead ? 4 : 0 }}>
                            {/* Icon */}
                            <motion.div
                              variants={iconVariants} initial="rest" whileHover="hover"
                              style={{
                                width: 40, height: 40, borderRadius: 11,
                                background: `${iconColor}18`, border: `1px solid ${iconColor}25`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <IconComponent size={19} style={{ color: iconColor }} />
                            </motion.div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                                <h4 style={{
                                  fontSize: "0.84rem", fontWeight: isUnread && !wasJustRead ? 700 : 600,
                                  color: theme.text, margin: 0, lineHeight: 1.3,
                                }}>
                                  {n.title}
                                </h4>
                                <span style={{
                                  fontSize: "0.62rem", padding: "2px 6px", borderRadius: 5,
                                  background: `${cfg.color}14`, color: cfg.color,
                                  fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                                }}>
                                  {cfg.label}
                                </span>
                              </div>
                              <p style={{ fontSize: "0.78rem", color: theme.textSecondary, margin: "0 0 8px", lineHeight: 1.45 }}>
                                {n.message}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.68rem", color: theme.textSecondary, opacity: 0.6 }}>
                                  {formatTime(n.readAt)}
                                </span>
                                {n.sourceModule && (
                                  <span style={{
                                    fontSize: "0.62rem", padding: "2px 7px", borderRadius: 5,
                                    background: `${theme.border}50`, color: theme.textSecondary, fontWeight: 500,
                                  }}>
                                    {n.sourceModule}
                                  </span>
                                )}
                              </div>
                              {n.actionText && (
                                <div style={{
                                  marginTop: 8, fontSize: "0.74rem", color: theme.primary,
                                  fontWeight: 600, display: "flex", alignItems: "center", gap: 3,
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
                                  variants={dotPulseVariants} animate="animate"
                                  style={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    background: theme.primary, boxShadow: `0 0 0 2px ${theme.primary}30`,
                                  }}
                                />
                                <motion.button
                                  variants={checkBtnVariants} initial="rest" whileHover="hover" whileTap="tap"
                                  onClick={(e) => handleMarkAsRead(n.loggedUserId, e)}
                                  title="Mark as read"
                                  style={{
                                    width: 28, height: 28, borderRadius: 7,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "transparent", border: `1px solid ${theme.border}`,
                                    cursor: "pointer", marginTop: 2,
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

            {/* ── Footer ── */}
            {!isLoading && !error && notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{
                  padding: "10px 20px 14px",
                  borderTop: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center",
                  justifyContent: unreadCount > 0 ? "space-between" : "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "0.7rem", color: theme.textSecondary, opacity: 0.55 }}>
                  {isFiltered
                    ? `${filteredNotifications.length} of ${notifications.length} shown`
                    : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`
                  }
                </span>
                {unreadCount > 0 && (
                  <motion.button
                    initial="rest" whileHover="hover"
                    variants={{ rest: { gap: 5 }, hover: { gap: 8, transition: { duration: 0.2 } } }}
                    onClick={markAllAsRead}
                    style={{
                      background: "transparent", border: "none", color: theme.primary,
                      fontSize: "0.74rem", fontWeight: 600, cursor: "pointer",
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 0",
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