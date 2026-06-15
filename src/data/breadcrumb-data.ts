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

export const ACTIVITY_CATEGORY_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
    { label: "Categories", href: URLS.ACTIVITY_CATEGORIES_PAGE_URL },
    { label: "Create", href: URLS.ACTIVITY_CATEGORY_TERMINATE_URL },
  ];

export const PACKAGE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
];

export const PACKAGE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "View", href: URLS.PACKAGES_VIEW_PAGE_URL },
];

export const PACKAGE_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "View", href: URLS.PACKAGES_VIEW_PAGE_URL },
];

export const PACKAGE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Create", href: URLS.PACKAGE_ADD_PAGE_URL },
];

export const PACKAGE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Update", href: URLS.PACKAGE_UPDATE_PAGE_URL },
];

export const PACKAGE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Terminate", href: URLS.PACKAGE_TERMINATE_PAGE_URL },
];

export const PACKAGE_TYPE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
];

export const PACKAGE_TYPE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
  { label: "View", href: URLS.PACKAGE_TYPE_VIEW_PAGE_URL },
];

export const PACKAGE_TYPE_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
    { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
    { label: "View", href: URLS.PACKAGE_TYPE_VIEW_PAGE_URL },
  ];

export const PACKAGE_TYPE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
  { label: "Create", href: URLS.PACKAGE_TYPE_ADD_URL },
];

export const PACKAGE_TYPE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
  { label: "Update", href: URLS.PACKAGE_TYPE_UPDATE_URL },
];

export const PACKAGE_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Packages", href: URLS.PACKAGES_PAGE_URL },
  { label: "Types", href: URLS.PACKAGE_TYPES_PAGE_URL },
  { label: "Terminate", href: URLS.PACKAGE_TYPE_TERMINATE_URL },
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

export const TOUR_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Update", href: URLS.TOUR_UPDATE_PAGE_URL },
];

export const TOUR_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Terminate", href: URLS.TOUR_TERMINATE_PAGE_URL },
];

export const TOUR_TYPE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
];

export const TOUR_TYPE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
  { label: "View", href: URLS.TOUR_TYPE_VIEW_PAGE_URL },
];

export const TOUR_TYPE_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
  { label: "View", href: URLS.TOUR_TYPE_VIEW_PAGE_URL },
];

export const TOUR_TYPE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
  { label: "Create", href: URLS.TOUR_TYPE_ADD_URL },
];

export const TOUR_TYPE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
  { label: "Update", href: URLS.TOUR_TYPE_UPDATE_URL },
];

export const TOUR_TYPE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Types", href: URLS.TOUR_TYPES_PAGE_URL },
  { label: "Terminate", href: URLS.TOUR_TYPE_TERMINATE_URL },
];

export const TOUR_CATEGORY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
];

export const TOUR_CATEGORY_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
  { label: "View", href: URLS.TOUR_CATEGORY_VIEW_PAGE_URL },
];

export const TOUR_CATEGORY_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Tours", href: URLS.TOURS_PAGE_URL },
    { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
    { label: "View", href: URLS.TOUR_CATEGORY_VIEW_PAGE_URL },
  ];

export const TOUR_CATEGORY_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
  { label: "Create", href: URLS.TOUR_CATEGORY_ADD_URL },
];

export const TOUR_CATEGORY_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
  { label: "Update", href: URLS.TOUR_CATEGORY_UPDATE_URL },
];

export const TOUR_CATEGORY_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tours", href: URLS.TOURS_PAGE_URL },
  { label: "Categories", href: URLS.TOUR_CATEGORIES_PAGE_URL },
  { label: "Terminate", href: URLS.TOUR_CATEGORY_TERMINATE_URL },
];

export const ACTIVITY_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
];

export const ACTIVITY_SCHEDULE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
  { label: "View", href: URLS.ACTIVITY_SCHEDULE_VIEW_PAGE_URL },
];

export const ACTIVITY_SCHEDULE_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
    { label: "View", href: URLS.ACTIVITY_SCHEDULE_VIEW_PAGE_URL },
  ];

export const ACTIVITY_SCHEDULE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_SCHEDULE_ADD_URL },
];

export const ACTIVITY_SCHEDULE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
  { label: "Create", href: URLS.ACTIVITY_SCHEDULE_UPDATE_PAGE_URL },
];

export const ACTIVITY_SCHEDULE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Activity Schedule", href: URLS.ACTIVITY_SCHEDULE_PAGE_URL },
    { label: "Terminate", href: URLS.ACTIVITY_SCHEDULE_TERMINATE_PAGE_URL },
  ];

export const TOUR_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
];

export const TOUR_SCHEDULE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
  { label: "View", href: URLS.TOUR_SCHEDULE_VIEW_PAGE_URL },
];

export const TOUR_SCHEDULE_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
    { label: "View", href: URLS.TOUR_SCHEDULE_VIEW_PAGE_URL },
  ];

export const TOUR_SCHEDULE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
  { label: "Create", href: URLS.TOUR_SCHEDULE_ADD_PAGE_URL },
];

export const TOUR_SCHEDULE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
  { label: "Update", href: URLS.TOUR_SCHEDULE_UPDATE_PAGE_URL },
];

export const TOUR_SCHEDULE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Tour Schedules", href: URLS.TOUR_SCHEDULE_PAGE_URL },
  { label: "Terminate", href: URLS.TOUR_SCHEDULE_TERMINATE_PAGE_URL },
];

export const PACKAGE_SCHEDULE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
];

export const PACKAGE_SCHEDULE_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
  { label: "View", href: URLS.PACKAGE_SCHEDULE_VIEW_PAGE_URL },
];

export const PACKAGE_SCHEDULE_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
    { label: "View", href: URLS.PACKAGE_SCHEDULE_VIEW_PAGE_URL },
  ];

export const PACKAGE_SCHEDULE_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
  { label: "Create", href: URLS.PACKAGE_SCHEDULE_ADD_URL },
];

export const PACKAGE_SCHEDULE_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
  { label: "Update", href: URLS.PACKAGE_SCHEDULE_UPDATE_URL },
];

export const PACKAGE_SCHEDULE_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
    { label: "Package Schedule", href: URLS.PACKAGE_SCHEDULE_PAGE_URL },
    { label: "Terminate", href: URLS.PACKAGE_SCHEDULE_TERMINATE_URL },
  ];

export const SEASON_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
];

export const SEASON_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
  { label: "View", href: URLS.SEASONS_VIEW_PAGE_URL },
];

export const SEASON_VIEW_DETAILS_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
  { label: "View", href: URLS.SEASONS_VIEW_PAGE_URL },
];

export const SEASON_CREATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
  { label: "Create", href: URLS.SEASON_ADD_PAGE_URL },
];

export const SEASON_UPDATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
  { label: "Update", href: URLS.SEASON_UPDATE_PAGE_URL },
];

export const SEASON_TERMINATE_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Seasons", href: URLS.SEASONS_PAGE_URL },
  { label: "Terminate", href: URLS.SEASON_TERMINATE_PAGE_URL },
];

export const EMPLOYEE_MANAGEMENT_HOME_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
];

export const EMPLOYEE_MANAGEMENT_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
  { label: "Employee", href: URLS.EMPLOYEES_MANAGEMENT_PAGE_URL },
];

export const EMPLOYEE_MANAGEMENT_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
  { label: "Employee", href: URLS.EMPLOYEES_MANAGEMENT_PAGE_URL },
  { label: "View", href: URLS.EMPLOYEES_VIEW_PAGE_URL },
];

export const EMPLOYEE_MANAGEMENT_DETAILS_VIEW_PAGE_BREADCRUMB_DATA: breadcrumbType[] =
  [
    { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
    { label: "Employee", href: URLS.EMPLOYEES_MANAGEMENT_PAGE_URL },
    { label: "View", href: URLS.EMPLOYEES_VIEW_PAGE_URL },
  ];

export const WEBSITE_CONTENT_MANAGEMENT_HOME_BREADCRUMB_DATA: breadcrumbType[] =
  [
    {
      label: "Website Content Management",
      href: URLS.WEBSITE_CONTENT_MANAGEMENT_URL,
    },
  ];

export const WEBSITE_CONTENT_MANAGEMENT_TRENDING_DESTINATION_BREADCRUMB_DATA: breadcrumbType[] =
  [
    {
      label: "Website Content Management",
      href: URLS.WEBSITE_CONTENT_MANAGEMENT_URL,
    },
    {
      label: "Trending Destinations",
      href: URLS.HOME_TRENDING_DESTINATIONS_URL,
    },
  ];

export const PRIVILEGE_MANAGEMENT_HOME_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
  {
    label: "Privilege Management",
    href: URLS.PRIVILEGES_MANAGEMENT_PAGE_URL,
  },
];

export const PRIVILEGE_VIEW_BREADCRUMB_DATA: breadcrumbType[] = [
  ...PRIVILEGE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "View",
    href: URLS.PRIVILEGES_VIEW_PAGE_URL,
  },
];

export const PRIVILEGE_DETAILS_VIEW_BREADCRUMB_DATA: breadcrumbType[] = [
  ...PRIVILEGE_VIEW_BREADCRUMB_DATA,
];

export const PRIVILEGE_CREATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...PRIVILEGE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Create",
    href: URLS.PRIVILEGES_ADD_PAGE_URL,
  },
];

export const PRIVILEGE_UPDATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...PRIVILEGE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Update",
    href: URLS.PRIVILEGES_UPDATE_PAGE_URL,
  },
];

export const PRIVILEGE_TERMINATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...PRIVILEGE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Terminate",
    href: URLS.PRIVILEGES_TERMINATE_PAGE_URL,
  },
];

export const ROLE_MANAGEMENT_HOME_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Employee Management", href: URLS.EMPLOYEE_MANAGEMENT_URL },
  {
    label: "Role Management",
    href: URLS.ROLES_MANAGEMENT_PAGE_URL,
  },
];

export const ROLE_VIEW_BREADCRUMB_DATA: breadcrumbType[] = [
  ...ROLE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "View",
    href: URLS.ROLES_VIEW_PAGE_URL,
  },
];

export const ROLE_DETAILS_VIEW_BREADCRUMB_DATA: breadcrumbType[] = [
  ...ROLE_VIEW_BREADCRUMB_DATA,
];

export const ROLE_CREATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...ROLE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Create",
    href: URLS.ROLES_ADD_PAGE_URL,
  },
];

export const ROLE_UPDATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...ROLE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Update",
    href: URLS.ROLES_UPDATE_PAGE_URL,
  },
];

export const ROLE_TERMINATE_BREADCRUMB_DATA: breadcrumbType[] = [
  ...ROLE_MANAGEMENT_HOME_BREADCRUMB_DATA,
  {
    label: "Terminate",
    href: URLS.ROLES_TERMINATE_PAGE_URL,
  },
];
