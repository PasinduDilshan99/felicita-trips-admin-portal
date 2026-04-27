"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { NotificationService } from "@/services/notificationService";
import {
  Notification,
  NotificationsResponse,
} from "@/types/notification-types";
import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchingNotifications: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  hasUnreadNotifications: boolean;
  latestNotification: Notification | null;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  fetchingNotifications: false,
  error: null,
  fetchNotifications: async () => {},
  fetchUnreadCount: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  hasUnreadNotifications: false,
  latestNotification: null,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [fetchingNotifications, setFetchingNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await NotificationService.getUnreadNotificationCount();
      if (response.data?.count !== undefined) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch unread count",
      );
    }
  }, [user]);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setFetchingNotifications(true);
    setError(null);

    try {
      const response: NotificationsResponse =
        await NotificationService.getNotifications();
      if (response.data) {
        setNotifications(response.data);
        // Update unread count based on fetched notifications
        const unread = response.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications",
      );
    } finally {
      setFetchingNotifications(false);
    }
  }, [user]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.loggedUserId === notificationId
            ? {
                ...notification,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : notification,
        ),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read",
      );
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllNotificationsAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read",
      );
      throw err;
    }
  }, []);

  // Initial load and refresh when user changes
  useEffect(() => {
    if (user) {
      const initializeNotifications = async () => {
        setLoading(true);
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        setLoading(false);
      };

      initializeNotifications();
    } else {
      // Reset state when user logs out
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  // Optional: Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [user, fetchUnreadCount]);

  const hasUnreadNotifications = unreadCount > 0;
  const latestNotification = notifications.length > 0 ? notifications[0] : null;

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchingNotifications,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    hasUnreadNotifications,
    latestNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
