import * as URLS from "@/utils/urls";

interface breadcrumbType {
  label: string;
  href: string;
}

export const CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
];

export const DESTINATION_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
];

export const DESTINATION_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "View", href: URLS.DESTINATION_VIEW_PAGE_URL },
];

export const DESTINATION_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "View", href: URLS.DESTINATION_VIEW_PAGE_URL },
];

export const DESTINATION_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "Create", href: URLS.DESTINATION_ADD_PAGE_URL },
];

export const DESTINATION_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "Update", href: URLS.DESTINATION_UPDATE_PAGE_URL },
];

export const DESTINATION_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "Terminate", href: URLS.DESTINATION_TERMINATE_PAGE_URL },
];

export const DESTINATION_CATEGORY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
  { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
];

export const DESTINATION_CATEGORY_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
    { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
    { label: "View", href: URLS.DESTINATION_CATEGORY_VIEW_PAGE_URL },
  ];

export const DESTINATION_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
    { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
    { label: "View", href: URLS.DESTINATION_CATEGORY_VIEW_PAGE_URL },
  ];

export const DESTINATION_CATEGORY_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
    { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
    { label: "Create", href: URLS.DESTINATION_CATEGORY_ADD_URL },
  ];

export const DESTINATION_CATEGORY_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
    { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
    { label: "Update", href: URLS.DESTINATION_CATEGORY_UPDATE_URL },
  ];

export const DESTINATION_CATEGORY_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Destinations", href: URLS.DESTINATION_PAGE_URL },
    { label: "Categories", href: URLS.DESTINATION_CATEGORIES_PAGE_URL },
    { label: "Terminate", href: URLS.DESTINATION_CATEGORY_TERMINATE_URL },
  ];

export const ACTIVITY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
];

export const ACTIVITIES_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITIES_VIEW_PAGE_URL },
];

export const ACTIVITIES_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITIES_VIEW_PAGE_URL },
];

export const ACTIVITIES_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITIES_VIEW_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_ADD_PAGE_URL },
];

export const ACTIVITIES_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITIES_VIEW_PAGE_URL },
  { label: "Update", href: URLS.ACTIVITY_UPDATE_PAGE_URL },
];

export const ACTIVITY_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITIES_VIEW_PAGE_URL },
  { label: "Update", href: URLS.ACTIVITY_TERMINATE_PAGE_URL },
];

export const ACTIVITY_CATEGORY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
];

export const ACTIVITY_CATEGORY_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
  { label: "View", href: URLS.ACTIVITY_CATEGORY_VIEW_PAGE_URL },
];

export const ACTIVITY_CATEGORY_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
    { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
    { label: "View", href: URLS.ACTIVITY_CATEGORY_VIEW_PAGE_URL },
  ];

export const ACTIVITY_CATEGORY_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_CATEGORY_ADD_URL },
];

export const ACTIVITY_CATEGORY_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_CATEGORY_UPDATE_URL },
];

export const ACTIVITY_CATEGORY_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
  { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_CATEGORY_TERMINATE_URL },
];

export const PACKAGE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
];

export const PACKAGE_TYPE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
];

export const TOUR_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
];

export const TOUR_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "View", href: URLS.TOURS_VIEW_PAGE_URL },
];

export const TOUR_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "View", href: URLS.TOURS_VIEW_PAGE_URL },
];

export const TOUR_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Create", href: URLS.TOUR_ADD_PAGE_URL },
];

export const TOUR_TYPE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
];

export const TOUR_CATEGORY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
];

export const ACTIVITY_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
];

export const PACKAGE_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
];

export const TOUR_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.TOUR_SCHEDULE_PAGE_URL },
];
