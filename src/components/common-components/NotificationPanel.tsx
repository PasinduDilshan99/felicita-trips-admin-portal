// components/NotificationPanel.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
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
  // Notification icon set — extend as your API grows
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
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Notification, NotificationPriority } from "@/types/notification-types";

/* ─────────────────────────────────────────────
   Styles — injected once into <head>
───────────────────────────────────────────── */
const NP_STYLES = `
  .np-root * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
  }

  /* ── Panel ── */
  @keyframes np-panel-in {
    0%   { transform: translateX(110%) scale(0.97); opacity: 0; }
    60%  { transform: translateX(-6px) scale(1.005); opacity: 1; }
    100% { transform: translateX(0) scale(1); opacity: 1; }
  }
  @keyframes np-panel-out {
    0%   { transform: translateX(0) scale(1); opacity: 1; }
    100% { transform: translateX(110%) scale(0.96); opacity: 0; }
  }

  /* ── Overlay ── */
  @keyframes np-overlay-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes np-overlay-out { from { opacity: 1; } to { opacity: 0; } }

  /* ── Notification rows ── */
  @keyframes np-row-in {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes np-row-out {
    from { opacity: 1; transform: translateX(0) scale(1); max-height: 120px; margin-bottom: 8px; }
    to   { opacity: 0; transform: translateX(40px) scale(0.96); max-height: 0; margin-bottom: 0; }
  }

  /* ── Bell ring ── */
  @keyframes np-bell {
    0%   { transform: rotate(0deg); }
    15%  { transform: rotate(18deg); }
    35%  { transform: rotate(-14deg); }
    55%  { transform: rotate(10deg); }
    75%  { transform: rotate(-6deg); }
    90%  { transform: rotate(3deg); }
    100% { transform: rotate(0deg); }
  }

  /* ── Badge bounce ── */
  @keyframes np-badge-in {
    0%   { transform: scale(0); }
    60%  { transform: scale(1.3); }
    80%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  /* ── Shimmer loader ── */
  @keyframes np-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  /* ── Dot pulse ── */
  @keyframes np-dot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.5); opacity: 0.7; }
  }

  /* ── Spin ── */
  @keyframes np-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Mark-read checkmark pop ── */
  @keyframes np-check-pop {
    0%   { transform: scale(0.7); }
    60%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .np-panel-enter { animation: np-panel-in  0.52s cubic-bezier(0.22,1,0.36,1) both; }
  .np-panel-exit  { animation: np-panel-out 0.30s cubic-bezier(0.4,0,0.6,1) both; }

  .np-overlay-enter { animation: np-overlay-in  0.25s ease both; }
  .np-overlay-exit  { animation: np-overlay-out 0.22s ease both; }

  .np-bell-ring { animation: np-bell 0.65s cubic-bezier(0.22,1,0.36,1); }
  .np-badge-pop { animation: np-badge-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }

  /* ── Notification row ── */
  .np-row {
    animation: np-row-in 0.38s cubic-bezier(0.22,1,0.36,1) both;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1),
                background 0.18s ease,
                box-shadow 0.22s ease,
                border-color 0.18s ease;
    overflow: hidden;
  }
  .np-row:hover {
    transform: translateX(-3px);
  }
  .np-row-exiting {
    animation: np-row-out 0.32s cubic-bezier(0.4,0,0.6,1) forwards;
  }

  /* ── Icon container shimmer ── */
  .np-icon-bg {
    transition: transform 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  .np-row:hover .np-icon-bg {
    transform: scale(1.08) rotate(-4deg);
  }

  /* ── Dot pulse ── */
  .np-dot-live {
    animation: np-dot-pulse 2s ease-in-out infinite;
  }

  /* ── Mark-read btn ── */
  .np-check-btn {
    transition: background 0.18s ease, border-color 0.18s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  .np-check-btn:hover {
    transform: scale(1.12);
  }
  .np-check-btn-done {
    animation: np-check-pop 0.35s cubic-bezier(0.22,1,0.36,1);
  }

  /* ── Shimmer skeleton ── */
  .np-shimmer {
    background: linear-gradient(90deg,
      rgba(128,128,128,0.08) 25%,
      rgba(128,128,128,0.16) 50%,
      rgba(128,128,128,0.08) 75%);
    background-size: 800px 100%;
    animation: np-shimmer 1.6s ease-in-out infinite;
    border-radius: 8px;
  }

  /* ── Scrollbar ── */
  .np-scroll::-webkit-scrollbar { width: 3px; }
  .np-scroll::-webkit-scrollbar-track { background: transparent; }
  .np-scroll::-webkit-scrollbar-thumb {
    border-radius: 99px;
    background: rgba(128,128,128,0.18);
  }
  .np-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(128,128,128,0.35);
  }

  /* ── Header action buttons ── */
  .np-btn-ghost {
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }
  .np-btn-ghost:hover { transform: scale(1.04); }

  /* ── Footer read-all ── */
  .np-readall-btn {
    transition: color 0.18s ease, gap 0.2s ease;
  }
  .np-readall-btn:hover { gap: 8px !important; }

  /* ── Spin loader ── */
  .np-spinner {
    animation: np-spin 0.9s linear infinite;
  }

  /* ── Priority badge ── */
  .np-priority-badge {
    transition: transform 0.18s ease;
  }
  .np-row:hover .np-priority-badge {
    transform: scale(1.06);
  }
`;

let npInjected = false;
function injectNpStyles() {
  if (npInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.id = "np-styles";
  el.textContent = NP_STYLES;
  document.head.appendChild(el);
  npInjected = true;
}

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
    <div style={{ padding: "14px 14px", display: "flex", gap: 12, marginBottom: 8 }}>
      <div className="np-shimmer" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="np-shimmer" style={{ height: 13, width: "60%", borderRadius: 6 }} />
        <div className="np-shimmer" style={{ height: 11, width: "90%", borderRadius: 6 }} />
        <div className="np-shimmer" style={{ height: 11, width: "40%", borderRadius: 6 }} />
      </div>
    </div>
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
  injectNpStyles();

  const [isClosing, setIsClosing]   = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [justRead, setJustRead]     = useState<Set<number>>(new Set());
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
    setTimeout(() => { onClose(); setIsClosing(false); }, 280);
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
    if (hasUnreadNotifications && unreadCount > 0) {
      setAnimateBell(true);
      const t = setTimeout(() => setAnimateBell(false), 700);
      return () => clearTimeout(t);
    }
  }, [unreadCount, hasUnreadNotifications]);

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setJustRead(prev => new Set(prev).add(id));
    await markAsRead(id);
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) await markAsRead(n.loggedUserId);
    if (n.actionUrl) { window.location.href = n.actionUrl; closePanel(); }
  };

  if (!isOpen) return null;

  const isLoading = loading || fetchingNotifications;

  return (
    <div className="np-root">

      {/* ── Overlay ── */}
      <div
        className={`fixed inset-0 z-[1150] ${isClosing ? "np-overlay-exit" : "np-overlay-enter"}`}
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
        onClick={closePanel}
      />

      {/* ── Side Panel ── */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 bottom-0 z-[1200] flex flex-col ${isClosing ? "np-panel-exit" : "np-panel-enter"}`}
        style={{
          width: 420,
          background: theme.surface,
          borderLeft: `1px solid ${theme.border}`,
          boxShadow: "-12px 0 60px rgba(0,0,0,0.18), -4px 0 20px rgba(0,0,0,0.08)",
        }}
      >

        {/* ── Header ── */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${theme.border}`,
          flexShrink: 0,
          background: `linear-gradient(180deg, ${theme.surface} 60%, ${theme.surface}00)`,
          position: "relative",
        }}>
          {/* Subtle top accent line */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.primary}80, ${theme.primary}20, transparent)`,
            borderRadius: "0 0 4px 4px",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Left: Bell + title */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: `${theme.primary}12`,
                  border: `1px solid ${theme.primary}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Bell
                    size={18}
                    style={{ color: theme.primary }}
                    className={animateBell ? "np-bell-ring" : ""}
                  />
                </div>
                {hasUnreadNotifications && (
                  <span
                    className="np-badge-pop"
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
                  </span>
                )}
              </div>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: theme.text, margin: 0, letterSpacing: "-0.01em" }}>
                  Notifications
                </h2>
                <p style={{ fontSize: "0.72rem", color: theme.textSecondary, margin: "2px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                  {unreadCount > 0 ? (
                    <>
                      <span
                        className="np-dot-live"
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

            {/* Right: actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {unreadCount > 0 && (
                <button
                  className="np-btn-ghost"
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
                </button>
              )}
              <button
                className="np-btn-ghost"
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
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          className="np-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "10px 10px 8px" }}
        >
          {/* Loading state */}
          {isLoading ? (
            <div style={{ paddingTop: 4 }}>
              {[0, 1, 2, 3].map(i => <SkeletonRow key={i} theme={theme} />)}
            </div>

          /* Error state */
          ) : error ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "60px 24px", gap: 14, textAlign: "center",
            }}>
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
              <button
                onClick={fetchNotifications}
                style={{
                  padding: "9px 20px", borderRadius: 10,
                  background: theme.primary, color: "#fff",
                  border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                  boxShadow: `0 4px 14px ${theme.primary}40`,
                }}
              >
                Try again
              </button>
            </div>

          /* Empty state */
          ) : notifications.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "70px 24px", gap: 14, textAlign: "center",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: `${theme.primary}08`,
                border: `1px dashed ${theme.primary}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
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
            </div>

          /* Notifications list */
          ) : (
            <div style={{ paddingTop: 2 }}>
              {notifications.map((n, index) => {
                const cfg = getPriorityCfg(n.priority, theme);
                const isUnread = !n.isRead;
                const wasJustRead = justRead.has(n.loggedUserId);

                return (
                  <div
                    key={n.loggedUserId}
                    className={`np-row${wasJustRead ? " np-row-exiting" : ""}`}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      padding: "13px 13px 12px",
                      marginBottom: 7,
                      borderRadius: 13,
                      cursor: n.actionUrl ? "pointer" : "default",
                      background: isUnread
                        ? `linear-gradient(135deg, ${cfg.color}06 0%, ${theme.primary}05 100%)`
                        : theme.background,
                      border: `1px solid ${isUnread ? `${cfg.color}22` : theme.border}`,
                      position: "relative",
                      animationDelay: `${index * 0.045}s`,
                    }}
                  >
                    {/* Left colour accent for unread */}
                    {isUnread && (
                      <div style={{
                        position: "absolute",
                        left: 0, top: "20%", bottom: "20%",
                        width: 3,
                        background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
                        borderRadius: "0 3px 3px 0",
                      }} />
                    )}

                    <div style={{ display: "flex", gap: 11, paddingLeft: isUnread ? 4 : 0, transition: "padding 0.2s ease" }}>

                      {/* Icon — resolves API string e.g. "MapPin" → Lucide component */}
                      {(() => {
                        const iconColor = (n as any).color || cfg.color;
                        const ResolvedIcon = resolveIcon((n as any).icon);
                        return (
                          <div
                            className="np-icon-bg"
                            style={{
                              width: 40, height: 40,
                              borderRadius: 11,
                              background: `${iconColor}18`,
                              border: `1px solid ${iconColor}25`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <ResolvedIcon size={19} style={{ color: iconColor }} />
                          </div>
                        );
                      })()}

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                          <h4 style={{
                            fontSize: "0.84rem", fontWeight: isUnread ? 700 : 600,
                            color: theme.text, margin: 0, lineHeight: 1.3,
                          }}>
                            {n.title}
                          </h4>
                          <span
                            className="np-priority-badge"
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
                            {formatTime(n.readAt || n.expiresAt)}
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
                      {isUnread && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", gap: 6 }}>
                          {/* Unread dot */}
                          <div style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: theme.primary,
                            boxShadow: `0 0 0 2px ${theme.primary}30`,
                          }} />
                          <button
                            className="np-check-btn"
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
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!isLoading && !error && notifications.length > 0 && (
          <div style={{
            padding: "10px 20px 14px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: unreadCount > 0 ? "space-between" : "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: "0.7rem", color: theme.textSecondary, opacity: 0.55 }}>
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </span>
            {unreadCount > 0 && (
              <button
                className="np-readall-btn"
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
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;