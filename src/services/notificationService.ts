// services/notificationService.ts

import {
  NotificationsResponse,
  MarkNotificationReadRequest,
  MarkNotificationReadApiResponse,
  UnreadNotificationCountApiResponse,
  MarkAllAsReadApiResponse,
} from "@/types/notification-types";
import {
  GET_ALL_UNREAD_NOTIFICATION_COUNT_DATA_FE,
  GET_NOTIFICATIONS_DATA_FE,
  UPDATE_ALL_UNREAD_NOTIFICATIONS_READ_DATA_FE,
  UPDATE_NOTIFICATIONS_READ_DATA_FE,
} from "@/utils/frontEndConstant";

export class NotificationService {
  static async getNotifications(): Promise<NotificationsResponse> {
    try {
      const response = await fetch(GET_NOTIFICATIONS_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NotificationsResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  static async markNotificationAsRead(
    notificationId: number,
  ): Promise<MarkNotificationReadApiResponse> {
    try {
      const requestBody: MarkNotificationReadRequest = { notificationId };

      const response = await fetch(UPDATE_NOTIFICATIONS_READ_DATA_FE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MarkNotificationReadApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || "Failed to mark notification as read");
      }

      return data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  static async getUnreadNotificationCount(): Promise<UnreadNotificationCountApiResponse> {
    try {
      const response = await fetch(GET_ALL_UNREAD_NOTIFICATION_COUNT_DATA_FE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UnreadNotificationCountApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to fetch unread notification count",
        );
      }

      return data;
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      throw error;
    }
  }

  static async markAllNotificationsAsRead(): Promise<MarkAllAsReadApiResponse> {
    try {
      const response = await fetch(
        UPDATE_ALL_UNREAD_NOTIFICATIONS_READ_DATA_FE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MarkAllAsReadApiResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(
          data.message || "Failed to mark all notifications as read",
        );
      }

      return data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}
