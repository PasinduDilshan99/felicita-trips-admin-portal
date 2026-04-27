// types/notification-types.ts

export type NotificationType = 
  | "DESTINATION_CREATED"
  | "DESTINATION_UPDATED"
  | "DESTINATION_TERMINATED"
  | "ACTIVITY_CREATED"
  | "ACTIVITY_UPDATED"
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "PAYMENT_RECEIVED"
  | string; // Allow for future types

export type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

export type TargetRole = "ADMIN" | "GUIDE" | "TOURIST" | "SYSTEM" | string;

export type SourceModule = "DESTINATION" | "ACTIVITY" | "BOOKING" | "PAYMENT" | "USER" | string;

export interface NotificationMetadata {
  [key: string]: any;
}

export interface Notification {
  loggedUserId: number;
  notificationType: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl: string | null;
  actionText: string | null;
  icon: string | null;
  color: string | null;
  metadata: NotificationMetadata | null;
  isArchived: boolean;
  isDeleted: boolean;
  assignedTo: number | null;
  targetRole: TargetRole | null;
  sourceModule: SourceModule;
  expiresAt: string | null;
  createdBy: number;
  isRead: boolean;
  readAt: string | null;
}

// Get Notifications Response
export interface NotificationsResponse {
  code: number;
  status: string;
  message: string;
  data: Notification[];
  timestamp: string;
}

// Mark Notification as Read
export interface MarkNotificationReadRequest {
  notificationId: number;
}

export interface MarkNotificationReadResponse {
  message: string;
  id: number;
}

export interface MarkNotificationReadApiResponse {
  code: number;
  status: string;
  message: string;
  data: MarkNotificationReadResponse;
  timestamp: string;
}

// Get Unread Notification Count
export interface UnreadNotificationCountResponse {
  count: number;
}

export interface UnreadNotificationCountApiResponse {
  code: number;
  status: string;
  message: string;
  data: UnreadNotificationCountResponse;
  timestamp: string;
}

// Mark All Unread Notifications as Read
export interface MarkAllAsReadResponse {
  message: string;
  id: number | null;
}

export interface MarkAllAsReadApiResponse {
  code: number;
  status: string;
  message: string;
  data: MarkAllAsReadResponse;
  timestamp: string;
}
