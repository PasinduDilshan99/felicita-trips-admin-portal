export const COMMON_STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Visible to customers",
    color: "#16a34a",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Hidden from customers",
    color: "#6b7280",
  },
  {
    value: "TERMINATED",
    label: "Terminated",
    description: "Permanently discontinued",
    color: "#dc2626",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Stored for reference only",
    color: "#9333ea",
  },
];

export const DESTINATION_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const DESTINATION_CATEGORIES_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const DESTINATION_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const DESTINATION_CATEGORY_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const ACTIVITY_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const ACTIVITY_CATEGORY_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const TOUR_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const TOUR_CATEGORY_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const TOUR_TYPE_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const PACKAGE_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
export const PACKAGE_TYPE_UPDATE_STATUS_OPTIONS = [...COMMON_STATUS_OPTIONS];
