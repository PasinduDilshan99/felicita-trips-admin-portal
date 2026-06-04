import { SortOption } from "@/types/filter-types";

export const DESTINATION_VIEW_SORTING_OPTIONS: SortOption[] = [
  { value: "name", label: "Destination Name" },
  { value: "destination_id", label: "Destination ID" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "location", label: "Location" },
];

export const DESTINATION_CATEGORY_VIEW_SORTING_OPTIONS: SortOption[] = [
  { value: "category", label: "Category Name" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "categoryId", label: "Category ID" },
];

export const ACTIVITIES_VIEW_SORTING_OPTIONS: SortOption[] = [
  { value: "name", label: "Activity Name" },
  { value: "activity_id", label: "Activity ID" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "price_local", label: "Price (Local)" },
  { value: "duration_hours", label: "Duration" },
];

export const ACTIVITY_CATEGORY_VIEW_SORTING_OPTIONS: SortOption[] = [
  { value: "categoryName", label: "Category Name" },
  { value: "createdAt", label: "Created Date" },
  { value: "categoryStatus", label: "Status" },
  { value: "numberOfActivities", label: "Number of Activities" },
  { value: "updatedAt", label: "Updated Date" },
];

export const TOURS_VIEW_SORTING_OPTIONS = [
  { value: "tourName", label: "Tour Name" },
  { value: "tourId", label: "Tour ID" },
  { value: "duration", label: "Duration" },
  { value: "tourTypeName", label: "Tour Type" },
  { value: "tourCategoryName", label: "Category" },
  { value: "seasonName", label: "Season" },
];

export const TOUR_CATEGORIES_VIEW_SORTING_OPTIONS = [
  { value: "categoryName", label: "Category Name" },
  { value: "categoryId", label: "Category ID" },
  { value: "status", label: "Status" },
];

export const TOUR_TYPES_VIEW_SORTING_OPTIONS = [
  { value: "typeName", label: "Type Name" },
  { value: "typeId", label: "Type ID" },
  { value: "status", label: "Status" },
];

export const PACKAGE_VIEW_SORTING_OPTIONS = [
  { value: "packageName", label: "Package Name" },
  { value: "packageId", label: "Package ID" },
  { value: "totalPrice", label: "Total Price" },
  { value: "pricePerPerson", label: "Price Per Person" },
  { value: "duration", label: "Duration" },
  { value: "startDate", label: "Start Date" },
  { value: "endDate", label: "End Date" },
  { value: "createdAt", label: "Created Date" },
];

export const PACKAGE_TYPE_VIEW_SORTING_OPTIONS = [
  { value: "typeName", label: "Type Name" },
  { value: "typeId", label: "Type ID" },
  { value: "status", label: "Status" },
];

export const ACTIVITY_SCHEDULE_VIEW_SORTING_OPTIONS = [
  { value: "activityName", label: "Activity Name" },
  { value: "activityScheduleName", label: "Schedule Name" },
  { value: "durationHours", label: "Duration" },
  { value: "priceLocal", label: "Local Price" },
  { value: "priceForeigners", label: "Foreigner Price" },
  { value: "scheduleAssumeStartDate", label: "Start Date" },
  { value: "scheduleAssumeEndDate", label: "End Date" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

export const TOUR_SCHEDULE_VIEW_SORTING_OPTIONS = [
  { value: "tourScheduleName", label: "Schedule Name" },
  { value: "tourName", label: "Tour Name" },
  { value: "assumeStartDate", label: "Start Date" },
  { value: "assumeEndDate", label: "End Date" },
  { value: "durationStart", label: "Duration Start" },
  { value: "durationEnd", label: "Duration End" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

export const PACKAGE_SCHEDULE_VIEW_SORTING_OPTIONS = [
  { value: "packageScheduleName", label: "Schedule Name" },
  { value: "packageName", label: "Package Name" },
  { value: "startDate", label: "Start Date" },
  { value: "endDate", label: "End Date" },
  { value: "durationStart", label: "Duration Start" },
  { value: "durationEnd", label: "Duration End" },
  { value: "tourScheduleName", label: "Tour Schedule Name" },
];
