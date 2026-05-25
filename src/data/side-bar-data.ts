import { SideBarDataType } from "@/types/side-bar-types";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
  WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH,
  WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH,
  WEB_MANAGEMENT_TOURS_SCHEDULES_PATH,
  TRAVEL_MANAGEMENT_PATH,
  TRAVEL_MANAGEMENT_BOOKINGS_PATH,
  WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH,
} from "@/utils/constant";
import * as PRIVILEGES from "@/utils/privileges";
import {
  ACTIVITY_CATEGORIES_PAGE_URL,
  EMPLOYEE_MANAGEMENT_URL,
  PACKAGE_TYPES_PAGE_URL,
  TOUR_CATEGORIES_PAGE_URL,
  TOUR_TYPES_PAGE_URL,
  WEB_PAGE_MANAGEMENT_URL,
} from "@/utils/urls";

export const webManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Destinations",
    description: "Manage destination locations",
    color: "#3B82F6", // Blue - Primary
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    privilege: PRIVILEGES.DESTINATION_PRIVILEGE,
    subData: [
      {
        id: 101,
        name: "View Destinations",
        description: "View all destination locations",
        color: "#60A5FA", // Light Blue
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
        privilege: PRIVILEGES.DESTINATION_VIEW_PRIVILEGE,
      },
      {
        id: 102,
        name: "Add Destination",
        description: "Add a new destination location",
        color: "#34D399", // Green
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/add-new`,
        privilege: PRIVILEGES.DESTINATION_CREATE_PRIVILEGE,
      },
      {
        id: 103,
        name: "Update Destination",
        description: "Update existing destination information",
        color: "#FBBF24", // Amber
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/update`,
        privilege: PRIVILEGES.DESTINATION_UPDATE_PRIVILEGE,
      },
      {
        id: 104,
        name: "Remove Destination",
        description: "Delete destination locations",
        color: "#EF4444", // Red
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate`,
        privilege: PRIVILEGES.DESTINATION_TERMINATE_PRIVILEGE,
      },
      {
        id: 105,
        name: "Destination Categories",
        description: "Manage destination categories",
        color: "#8B5CF6", // Purple
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}`,
        privilege: PRIVILEGES.DESTINATION_CATEGORY_PRIVILEGE,
        grandSubData: [
          {
            id: 1051,
            name: "View Categories",
            description: "View all destination categories",
            color: "#A78BFA", // Light Purple
            url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}/view`,
            privilege: PRIVILEGES.DESTINATION_CATEGORY_VIEW_PRIVILEGE,
          },
          {
            id: 1052,
            name: "Add Category",
            description: "Add a new destination category",
            color: "#6EE7B7", // Mint Green
            url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}/add-new`,
            privilege: PRIVILEGES.DESTINATION_CATEGORY_CREATE_PRIVILEGE,
          },
          {
            id: 1053,
            name: "Update Category",
            description: "Update existing destination category",
            color: "#FCD34D", // Yellow
            url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}/update`,
            privilege: PRIVILEGES.DESTINATION_CATEGORY_UPDATE_PRIVILEGE,
          },
          {
            id: 1054,
            name: "Remove Category",
            description: "Delete destination categories",
            color: "#F87171", // Light Red
            url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_CATEGORY_PATH}/terminate`,
            privilege: PRIVILEGES.DESTINATION_CATEGORY_TERMINATE_PRIVILEGE,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Activities",
    description: "Manage tour activities",
    color: "#10B981", // Green
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    privilege: PRIVILEGES.ACTIVITY_PRIVILEGE,
    subData: [
      {
        id: 201,
        name: "View Activities",
        description: "View all available activities",
        color: "#34D399", // Green Light
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`,
        privilege: PRIVILEGES.ACTIVITY_VIEW_PRIVILEGE,
      },
      {
        id: 202,
        name: "Add Activity",
        description: "Add a new activity",
        color: "#60A5FA", // Blue
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/add-new`,
        privilege: PRIVILEGES.ACTIVITY_CREATE_PRIVILEGE,
      },
      {
        id: 203,
        name: "Update Activity",
        description: "Update existing activity information",
        color: "#FBBF24", // Amber
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/update`,
        privilege: PRIVILEGES.ACTIVITY_UPDATE_PRIVILEGE,
      },
      {
        id: 204,
        name: "Remove Activity",
        description: "Delete activities",
        color: "#EF4444", // Red
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/terminate`,
        privilege: PRIVILEGES.ACTIVITY_TERMINATE_PRIVILEGE,
      },
      {
        id: 205,
        name: "Activity Categories",
        description: "Manage activity categories",
        color: "#8B5CF6", // Purple
        url: `${ACTIVITY_CATEGORIES_PAGE_URL}`,
        privilege: PRIVILEGES.ACTIVITY_CATEGORY_PRIVILEGE,
        grandSubData: [
          {
            id: 2051,
            name: "View Categories",
            description: "View all activity categories",
            color: "#A78BFA", // Light Purple
            url: `${ACTIVITY_CATEGORIES_PAGE_URL}/view`,
            privilege: PRIVILEGES.ACTIVITY_CATEGORY_VIEW_PRIVILEGE,
          },
          {
            id: 2052,
            name: "Add Category",
            description: "Add a new activity category",
            color: "#6EE7B7", // Mint Green
            url: `${ACTIVITY_CATEGORIES_PAGE_URL}/add-new`,
            privilege: PRIVILEGES.ACTIVITY_CATEGORY_CREATE_PRIVILEGE,
          },
          {
            id: 2053,
            name: "Update Category",
            description: "Update existing activity category",
            color: "#FCD34D", // Yellow
            url: `${ACTIVITY_CATEGORIES_PAGE_URL}/update`,
            privilege: PRIVILEGES.ACTIVITY_CATEGORY_UPDATE_PRIVILEGE,
          },
          {
            id: 2054,
            name: "Remove Category",
            description: "Delete activity categories",
            color: "#F87171", // Light Red
            url: `${ACTIVITY_CATEGORIES_PAGE_URL}/terminate`,
            privilege: PRIVILEGES.ACTIVITY_CATEGORY_TERMINATE_PRIVILEGE,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Activities Schedules",
    description: "Manage tour activities schedules",
    color: "#10B984", // Green
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}`,
    privilege: PRIVILEGES.ACTIVITY_SCHEDULE_PRIVILEGE,
    subData: [
      {
        id: 301,
        name: "View Activities Schedules",
        description: "View all available activities schedules",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}/view`,
        privilege: PRIVILEGES.ACTIVITY_SCHEDULE_VIEW_PRIVILEGE,
      },
      {
        id: 302,
        name: "Add Activity Schedule",
        description: "Add a new activity schedule",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}/add-new`,
        privilege: PRIVILEGES.ACTIVITY_SCHEDULE_CREATE_PRIVILEGE,
      },
      {
        id: 303,
        name: "Update Activity Schedule",
        description: "Update existing activity schedule information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}/update`,
        privilege: PRIVILEGES.ACTIVITY_SCHEDULE_UPDATE_PRIVILEGE,
      },
      {
        id: 304,
        name: "Remove Activity Schedule",
        description: "Delete activities schedule",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_SCHEDULES_PATH}/terminate`,
        privilege: PRIVILEGES.ACTIVITY_SCHEDULE_TERMINATE_PRIVILEGE,
      },
    ],
  },
  {
    id: 4,
    name: "Tours",
    description: "Manage tour packages",
    color: "#F59E0B", // Amber
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    privilege: PRIVILEGES.TOUR_PRIVILEGE,
    subData: [
      {
        id: 401,
        name: "View Tours",
        description: "View all tour packages",
        color: "#FBBF24",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`,
        privilege: PRIVILEGES.TOUR_VIEW_PRIVILEGE,
      },
      {
        id: 402,
        name: "Add Tour",
        description: "Create a new tour package",
        color: "#34D399",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/add-new`,
        privilege: PRIVILEGES.TOUR_CREATE_PRIVILEGE,
      },
      {
        id: 403,
        name: "Update Tour",
        description: "Update existing tour information",
        color: "#60A5FA",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/update`,
        privilege: PRIVILEGES.TOUR_UPDATE_PRIVILEGE,
      },
      {
        id: 404,
        name: "Remove Tour",
        description: "Delete tour packages",
        color: "#EF4444",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/terminate`,
        privilege: PRIVILEGES.TOUR_TERMINATE_PRIVILEGE,
      },

      // =========================
      // TOUR TYPES
      // =========================
      {
        id: 405,
        name: "Tour Types",
        description: "Manage tour types",
        color: "#8B5CF6", // Purple
        url: `${TOUR_TYPES_PAGE_URL}`,
        privilege: PRIVILEGES.TOUR_TYPE_PRIVILEGE,
        grandSubData: [
          {
            id: 4051,
            name: "View Tour Types",
            description: "View all tour types",
            color: "#A78BFA",
            url: `${TOUR_TYPES_PAGE_URL}/view`,
            privilege: PRIVILEGES.TOUR_TYPE_VIEW_PRIVILEGE,
          },
          {
            id: 4052,
            name: "Add Tour Type",
            description: "Add a new tour type",
            color: "#6EE7B7",
            url: `${TOUR_TYPES_PAGE_URL}/add-new`,
            privilege: PRIVILEGES.TOUR_TYPE_CREATE_PRIVILEGE,
          },
          {
            id: 4053,
            name: "Update Tour Type",
            description: "Update existing tour type",
            color: "#FCD34D",
            url: `${TOUR_TYPES_PAGE_URL}/update`,
            privilege: PRIVILEGES.TOUR_TYPE_UPDATE_PRIVILEGE,
          },
          {
            id: 4054,
            name: "Remove Tour Type",
            description: "Delete tour types",
            color: "#F87171",
            url: `${TOUR_TYPES_PAGE_URL}/terminate`,
            privilege: PRIVILEGES.TOUR_TYPE_TERMINATE_PRIVILEGE,
          },
        ],
      },

      // =========================
      // TOUR CATEGORIES
      // =========================
      {
        id: 406,
        name: "Tour Categories",
        description: "Manage tour categories",
        color: "#3B82F6", // Blue
        url: `${TOUR_CATEGORIES_PAGE_URL}`,
        privilege: PRIVILEGES.TOUR_CATEGORY_PRIVILEGE,
        grandSubData: [
          {
            id: 4061,
            name: "View Categories",
            description: "View all tour categories",
            color: "#93C5FD",
            url: `${TOUR_CATEGORIES_PAGE_URL}/view`,
            privilege: PRIVILEGES.TOUR_CATEGORY_VIEW_PRIVILEGE,
          },
          {
            id: 4062,
            name: "Add Category",
            description: "Add a new tour category",
            color: "#34D399",
            url: `${TOUR_CATEGORIES_PAGE_URL}/add-new`,
            privilege: PRIVILEGES.TOUR_CATEGORY_CREATE_PRIVILEGE,
          },
          {
            id: 4063,
            name: "Update Category",
            description: "Update existing tour category",
            color: "#FBBF24",
            url: `${TOUR_CATEGORIES_PAGE_URL}/update`,
            privilege: PRIVILEGES.TOUR_CATEGORY_UPDATE_PRIVILEGE,
          },
          {
            id: 4064,
            name: "Remove Category",
            description: "Delete tour categories",
            color: "#EF4444",
            url: `${TOUR_CATEGORIES_PAGE_URL}/terminate`,
            privilege: PRIVILEGES.TOUR_CATEGORY_TERMINATE_PRIVILEGE,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Tours Schedules",
    description: "Manage tour schedule packages",
    color: "#F59E0B", // Amber
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}`,
    privilege: PRIVILEGES.TOUR_SCHEDULE_PRIVILEGE,
    subData: [
      {
        id: 501,
        name: "View Tours Schedules",
        description: "View all tour packages schedules",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}/view`,
        privilege: PRIVILEGES.TOUR_SCHEDULE_VIEW_PRIVILEGE,
      },
      {
        id: 502,
        name: "Add Tour Schedule",
        description: "Create a new tour package schedule",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}/add-new`,
        privilege: PRIVILEGES.TOUR_SCHEDULE_CREATE_PRIVILEGE,
      },
      {
        id: 503,
        name: "Update Tour Schedule",
        description: "Update existing tour schedule information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}/update`,
        privilege: PRIVILEGES.TOUR_SCHEDULE_UPDATE_PRIVILEGE,
      },
      {
        id: 504,
        name: "Remove Tour Schedule",
        description: "Delete tour schedule packages",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_SCHEDULES_PATH}/terminate`,
        privilege: PRIVILEGES.TOUR_SCHEDULE_TERMINATE_PRIVILEGE,
      },
    ],
  },
  {
    id: 6,
    name: "Packages",
    description: "Manage holiday packages",
    color: "#8B5CF6", // Violet
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}`,
    privilege: PRIVILEGES.PACKAGE_PRIVILEGE,
    subData: [
      {
        id: 601,
        name: "View Packages",
        description: "View all holiday packages",
        color: "#A78BFA",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`,
        privilege: PRIVILEGES.PACKAGE_VIEW_PRIVILEGE,
      },
      {
        id: 602,
        name: "Add Package",
        description: "Create a new holiday package",
        color: "#34D399",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/add-new`,
        privilege: PRIVILEGES.PACKAGE_CREATE_PRIVILEGE,
      },
      {
        id: 603,
        name: "Update Package",
        description: "Update existing package information",
        color: "#FBBF24",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/update`,
        privilege: PRIVILEGES.PACKAGE_UPDATE_PRIVILEGE,
      },
      {
        id: 604,
        name: "Remove Package",
        description: "Delete holiday packages",
        color: "#EF4444",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/terminate`,
        privilege: PRIVILEGES.PACKAGE_TERMINATE_PRIVILEGE,
      },

      // =========================
      // PACKAGE TYPES
      // =========================
      {
        id: 605,
        name: "Package Types",
        description: "Manage package types",
        color: "#3B82F6", // Blue
        url: `${PACKAGE_TYPES_PAGE_URL}`,
        privilege: PRIVILEGES.PACKAGE_TYPE_PRIVILEGE,
        grandSubData: [
          {
            id: 6051,
            name: "View Package Types",
            description: "View all package types",
            color: "#93C5FD",
            url: `${PACKAGE_TYPES_PAGE_URL}/view`,
            privilege: PRIVILEGES.PACKAGE_TYPE_VIEW_PRIVILEGE,
          },
          {
            id: 6052,
            name: "Add Package Type",
            description: "Create a new package type",
            color: "#6EE7B7",
            url: `${PACKAGE_TYPES_PAGE_URL}/add-new`,
            privilege: PRIVILEGES.PACKAGE_TYPE_CREATE_PRIVILEGE,
          },
          {
            id: 6053,
            name: "Update Package Type",
            description: "Update existing package type",
            color: "#FCD34D",
            url: `${PACKAGE_TYPES_PAGE_URL}/update`,
            privilege: PRIVILEGES.PACKAGE_TYPE_UPDATE_PRIVILEGE,
          },
          {
            id: 6054,
            name: "Remove Package Type",
            description: "Delete package types",
            color: "#F87171",
            url: `${PACKAGE_TYPES_PAGE_URL}/terminate`,
            privilege: PRIVILEGES.PACKAGE_TYPE_TERMINATE_PRIVILEGE,
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Packages Schedules",
    description: "Manage holiday packages schedules",
    color: "#8B5CF6", // Violet
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH}`,
    privilege: PRIVILEGES.PACKAGE_SCHEDULE_PRIVILEGE,
    subData: [
      {
        id: 701,
        name: "View Packages Schedules",
        description: "View all holiday packages schedules",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH}/view`,
        privilege: PRIVILEGES.PACKAGE_SCHEDULE_VIEW_PRIVILEGE,
      },
      {
        id: 702,
        name: "Add Package Schedule",
        description: "Create a new holiday package schedule",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH}/add-new`,
        privilege: PRIVILEGES.PACKAGE_SCHEDULE_CREATE_PRIVILEGE,
      },
      {
        id: 703,
        name: "Update Package Schedule",
        description: "Update existing package schedule information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_SCHEDULES_PATH}/update`,
        privilege: PRIVILEGES.PACKAGE_SCHEDULE_UPDATE_PRIVILEGE,
      },
      {
        id: 704,
        name: "Remove Package Schedule",
        description: "Delete holiday packages schedules",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/terminate`,
        privilege: PRIVILEGES.PACKAGE_SCHEDULE_TERMINATE_PRIVILEGE,
      },
    ],
  },
];

export const travelManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Bookings",
    description: "Manage destination locations",
    color: "#3B82F6", // Blue
    url: `${TRAVEL_MANAGEMENT_PATH}${TRAVEL_MANAGEMENT_BOOKINGS_PATH}`,
    privilege: PRIVILEGES.DESTINATION_PRIVILEGE,
    subData: [
      {
        id: 101,
        name: "View Bookings",
        description: "View all destination locations",
        url: `${TRAVEL_MANAGEMENT_PATH}${TRAVEL_MANAGEMENT_BOOKINGS_PATH}/view`,
        privilege: PRIVILEGES.DESTINATION_VIEW_PRIVILEGE,
      },
      {
        id: 102,
        name: "Add Booking",
        description: "Add a new destination location",
        url: `${TRAVEL_MANAGEMENT_PATH}${TRAVEL_MANAGEMENT_BOOKINGS_PATH}/add-new`,
        privilege: PRIVILEGES.DESTINATION_CREATE_PRIVILEGE,
      },
      {
        id: 103,
        name: "Update Booking",
        description: "Update existing destination information",
        url: `${TRAVEL_MANAGEMENT_PATH}${TRAVEL_MANAGEMENT_BOOKINGS_PATH}/update`,
        privilege: PRIVILEGES.DESTINATION_UPDATE_PRIVILEGE,
      },
      {
        id: 104,
        name: "Remove Booking",
        description: "Delete destination locations",
        url: `${TRAVEL_MANAGEMENT_PATH}${TRAVEL_MANAGEMENT_BOOKINGS_PATH}/terminate`,
        privilege: PRIVILEGES.DESTINATION_TERMINATE_PRIVILEGE,
      },
    ],
  },
];

export const webPageManagementSideBarData: SideBarDataType[] = [
  // =========================================================
  // HOME PAGE
  // =========================================================
  {
    id: 1,
    name: "Home Page",
    description: "Manage homepage sections and content",
    color: "#3B82F6",
    url: `${WEB_PAGE_MANAGEMENT_URL}/home-page`,
    privilege: PRIVILEGES.HOME_PAGE_PRIVILEGE,
    subData: [
      {
        id: 101,
        name: "Hero Section",
        description: "Manage homepage hero banner section",
        color: "#60A5FA",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/hero-section`,
        privilege: PRIVILEGES.HOME_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 102,
        name: "Why Choose Us",
        description: "Manage why choose us section",
        color: "#34D399",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/why-choose-us`,
        privilege: PRIVILEGES.HOME_WHY_CHOOSE_US_PRIVILEGE,
      },
      {
        id: 103,
        name: "Our Services",
        description: "Manage services section",
        color: "#FBBF24",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/our-services`,
        privilege: PRIVILEGES.HOME_OUR_SERVICES_PRIVILEGE,
      },
      {
        id: 104,
        name: "Trending Destinations",
        description: "Manage trending destinations section",
        color: "#F87171",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/trending-destinations`,
        privilege: PRIVILEGES.HOME_TRENDING_DESTINATIONS_PRIVILEGE,
      },
      {
        id: 105,
        name: "Active Tours",
        description: "Manage active tours section",
        color: "#8B5CF6",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/active-tours`,
        privilege: PRIVILEGES.HOME_ACTIVE_TOURS_PRIVILEGE,
      },
      {
        id: 106,
        name: "Tour Map",
        description: "Manage tour map section",
        color: "#14B8A6",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/tour-map`,
        privilege: PRIVILEGES.HOME_TOUR_MAP_PRIVILEGE,
      },
      {
        id: 107,
        name: "Activity Categories",
        description: "Manage activity categories section",
        color: "#F97316",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/activity-categories`,
        privilege: PRIVILEGES.HOME_ACTIVITY_CATEGORIES_PRIVILEGE,
      },
      {
        id: 108,
        name: "Gallery",
        description: "Manage homepage gallery section",
        color: "#EC4899",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/gallery`,
        privilege: PRIVILEGES.HOME_GALLERY_PRIVILEGE,
      },
      {
        id: 109,
        name: "Contact Form",
        description: "Manage homepage contact form section",
        color: "#6366F1",
        url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/contact-form`,
        privilege: PRIVILEGES.HOME_CONTACT_FORM_PRIVILEGE,
      },

      // {
      //   id: 110,
      //   name: "Partners",
      //   description: "Manage partners section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/partners`,
      //   privilege: PRIVILEGES.HOME_PARTNERS_PRIVILEGE,
      // },

      // {
      //   id: 111,
      //   name: "Popular Destinations",
      //   description: "Manage popular destinations section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/popular-destinations`,
      //   privilege: PRIVILEGES.HOME_POPULAR_DESTINATIONS_PRIVILEGE,
      // },

      // {
      //   id: 112,
      //   name: "New Destinations",
      //   description: "Manage new destinations section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/new-destinations`,
      //   privilege: PRIVILEGES.HOME_NEW_DESTINATIONS_PRIVILEGE,
      // },

      // {
      //   id: 113,
      //   name: "Popular Tours",
      //   description: "Manage popular tours section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/popular-tours`,
      //   privilege: PRIVILEGES.HOME_POPULAR_TOURS_PRIVILEGE,
      // },

      // {
      //   id: 114,
      //   name: "Activities",
      //   description: "Manage activities section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/activities`,
      //   privilege: PRIVILEGES.HOME_ACTIVITIES_PRIVILEGE,
      // },

      // {
      //   id: 115,
      //   name: "Packages",
      //   description: "Manage packages section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/packages`,
      //   privilege: PRIVILEGES.HOME_PACKAGES_PRIVILEGE,
      // },

      // {
      //   id: 116,
      //   name: "Accommodations",
      //   description: "Manage accommodations section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/accommodations`,
      //   privilege: PRIVILEGES.HOME_ACCOMMODATIONS_PRIVILEGE,
      // },

      // {
      //   id: 117,
      //   name: "Destination Categories",
      //   description: "Manage destination categories section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/destination-categories`,
      //   privilege: PRIVILEGES.HOME_DESTINATION_CATEGORIES_PRIVILEGE,
      // },

      // User Benefits & Loyalty

      // {
      //   id: 118,
      //   name: "User Levels",
      //   description: "Manage user levels section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/user-levels`,
      //   privilege: PRIVILEGES.HOME_USER_LEVELS_PRIVILEGE,
      // },

      // {
      //   id: 119,
      //   name: "User Levels With Benefits",
      //   description: "Manage user levels with benefits section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/user-levels-benefits`,
      //   privilege: PRIVILEGES.HOME_USER_LEVELS_BENEFITS_PRIVILEGE,
      // },

      // {
      //   id: 120,
      //   name: "User Benefits",
      //   description: "Manage user benefits section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/user-benefits`,
      //   privilege: PRIVILEGES.HOME_USER_BENEFITS_PRIVILEGE,
      // },

      // Social Proof & Content

      // {
      //   id: 121,
      //   name: "Reviews",
      //   description: "Manage reviews section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/reviews`,
      //   privilege: PRIVILEGES.HOME_REVIEWS_PRIVILEGE,
      // },

      // {
      //   id: 122,
      //   name: "Blogs Summary",
      //   description: "Manage blogs summary section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/blogs-summary`,
      //   privilege: PRIVILEGES.HOME_BLOGS_SUMMARY_PRIVILEGE,
      // },

      // Process & Promotions

      // {
      //   id: 123,
      //   name: "Workflow",
      //   description: "Manage workflow section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/workflow`,
      //   privilege: PRIVILEGES.HOME_WORKFLOW_PRIVILEGE,
      // },

      // {
      //   id: 124,
      //   name: "Promotions",
      //   description: "Manage promotions section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/promotions`,
      //   privilege: PRIVILEGES.HOME_PROMOTIONS_PRIVILEGE,
      // },

      // Support & Information

      // {
      //   id: 125,
      //   name: "FAQ",
      //   description: "Manage FAQ section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/faq`,
      //   privilege: PRIVILEGES.HOME_FAQ_PRIVILEGE,
      // },

      // {
      //   id: 126,
      //   name: "Inquire",
      //   description: "Manage inquire section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/home-page/inquire`,
      //   privilege: PRIVILEGES.HOME_INQUIRE_PRIVILEGE,
      // },
    ],
  },

  // =========================================================
  // ABOUT US PAGE
  // =========================================================
  {
    id: 2,
    name: "About Us Page",
    description: "Manage about us page sections",
    color: "#10B981",
    url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page`,
    privilege: PRIVILEGES.ABOUT_US_PAGE_PRIVILEGE,
    subData: [
      {
        id: 201,
        name: "Hero Section",
        description: "Manage about us hero section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/hero-section`,
        privilege: PRIVILEGES.ABOUT_US_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 202,
        name: "Our Story",
        description: "Manage our story section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/our-story`,
        privilege: PRIVILEGES.ABOUT_US_OUR_STORY_PRIVILEGE,
      },
      {
        id: 203,
        name: "CEO Speech",
        description: "Manage CEO speech section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/ceo-speech`,
        privilege: PRIVILEGES.ABOUT_US_CEO_SPEECH_PRIVILEGE,
      },
      {
        id: 204,
        name: "Why Choose Us",
        description: "Manage why choose us section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/why-choose-us`,
        privilege: PRIVILEGES.ABOUT_US_WHY_CHOOSE_US_PRIVILEGE,
      },

      // {
      //   id: 205,
      //   name: "All Employees",
      //   description: "Manage all employees section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/all-employees`,
      //   privilege: PRIVILEGES.ABOUT_US_ALL_EMPLOYEES_PRIVILEGE,
      // },

      // {
      //   id: 206,
      //   name: "About Us Statistics",
      //   description: "Manage statistics section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/statistics`,
      //   privilege: PRIVILEGES.ABOUT_US_STATISTICS_PRIVILEGE,
      // },

      // {
      //   id: 207,
      //   name: "Employee Social Media",
      //   description: "Manage employee social media section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/employee-social-media`,
      //   privilege: PRIVILEGES.ABOUT_US_EMPLOYEE_SOCIAL_MEDIA_PRIVILEGE,
      // },

      // {
      //   id: 208,
      //   name: "Tour Guides",
      //   description: "Manage tour guides section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/tour-guides`,
      //   privilege: PRIVILEGES.ABOUT_US_TOUR_GUIDES_PRIVILEGE,
      // },

      // {
      //   id: 209,
      //   name: "Our Office",
      //   description: "Manage office section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/our-office`,
      //   privilege: PRIVILEGES.ABOUT_US_OUR_OFFICE_PRIVILEGE,
      // },

      // {
      //   id: 210,
      //   name: "Our Features",
      //   description: "Manage features section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/our-features`,
      //   privilege: PRIVILEGES.ABOUT_US_OUR_FEATURES_PRIVILEGE,
      // },

      // {
      //   id: 211,
      //   name: "Achievements",
      //   description: "Manage achievements section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/about-us-page/achievements`,
      //   privilege: PRIVILEGES.ABOUT_US_ACHIEVEMENTS_PRIVILEGE,
      // },
    ],
  },

  // =========================================================
  // DESTINATIONS PAGE
  // =========================================================
  {
    id: 3,
    name: "Destinations Page",
    description: "Manage destinations page sections",
    color: "#F59E0B",
    url: `${WEB_PAGE_MANAGEMENT_URL}/destinations-page`,
    privilege: PRIVILEGES.DESTINATIONS_PAGE_PRIVILEGE,
    subData: [
      {
        id: 301,
        name: "Hero Section",
        description: "Manage destinations hero section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destinations-page/hero-section`,
        privilege: PRIVILEGES.DESTINATIONS_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 302,
        name: "Reviews Section",
        description: "Manage reviews section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destinations-page/reviews-section`,
        privilege: PRIVILEGES.DESTINATIONS_REVIEWS_SECTION_PRIVILEGE,
      },
      {
        id: 303,
        name: "Destination History",
        description: "Manage destination history section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destinations-page/destination-history`,
        privilege: PRIVILEGES.DESTINATIONS_HISTORY_PRIVILEGE,
      },
      {
        id: 304,
        name: "Destination History Gallery",
        description: "Manage destination gallery section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destinations-page/destination-history-gallery`,
        privilege: PRIVILEGES.DESTINATIONS_HISTORY_GALLERY_PRIVILEGE,
      },
    ],
  },

  // =========================================================
  // DESTINATION DETAILS PAGE
  // =========================================================
  {
    id: 4,
    name: "Destination Details Page",
    description: "Manage destination details page sections",
    color: "#8B5CF6",
    url: `${WEB_PAGE_MANAGEMENT_URL}/destination-details-page`,
    privilege: PRIVILEGES.DESTINATION_DETAILS_PAGE_PRIVILEGE,
    subData: [
      {
        id: 401,
        name: "Destination Details Hero Section",
        description: "Manage destination details hero section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destination-details-page/hero-section`,
        privilege: PRIVILEGES.DESTINATION_DETAILS_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 402,
        name: "Destination History",
        description: "Manage destination history section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destination-details-page/destination-history`,
        privilege: PRIVILEGES.DESTINATION_DETAILS_HISTORY_PRIVILEGE,
      },
      {
        id: 403,
        name: "Reviews Section",
        description: "Manage reviews section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destination-details-page/reviews-section`,
        privilege: PRIVILEGES.DESTINATION_DETAILS_REVIEWS_SECTION_PRIVILEGE,
      },
      {
        id: 404,
        name: "Destination History Gallery",
        description: "Manage destination history gallery section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/destination-details-page/destination-history-gallery`,
        privilege: PRIVILEGES.DESTINATION_DETAILS_HISTORY_GALLERY_PRIVILEGE,
      },
    ],
  },

  // =========================================================
  // FAQ PAGE
  // =========================================================
  {
    id: 5,
    name: "FAQ Page",
    description: "Manage FAQ page sections",
    color: "#EF4444",
    url: `${WEB_PAGE_MANAGEMENT_URL}/faq-page`,
    privilege: PRIVILEGES.FAQ_PAGE_PRIVILEGE,
    subData: [
      {
        id: 501,
        name: "FAQ Hero Section",
        description: "Manage FAQ hero section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/faq-page/hero-section`,
        privilege: PRIVILEGES.FAQ_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 502,
        name: "FAQ Questions And Answers",
        description: "Manage FAQ questions and answers",
        url: `${WEB_PAGE_MANAGEMENT_URL}/faq-page/questions-and-answers`,
        privilege: PRIVILEGES.FAQ_QUESTIONS_ANSWERS_PRIVILEGE,
      },
    ],
  },

  // =========================================================
  // CONTACT US PAGE
  // =========================================================
  {
    id: 6,
    name: "Contact Us Page",
    description: "Manage contact us page sections",
    color: "#06B6D4",
    url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page`,
    privilege: PRIVILEGES.CONTACT_US_PAGE_PRIVILEGE,
    subData: [
      {
        id: 601,
        name: "Contact Us Hero Section",
        description: "Manage contact us hero section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/hero-section`,
        privilege: PRIVILEGES.CONTACT_US_HERO_SECTION_PRIVILEGE,
      },
      {
        id: 602,
        name: "Contact Highlights",
        description: "Manage contact highlights section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/contact-highlights`,
        privilege: PRIVILEGES.CONTACT_HIGHLIGHTS_PRIVILEGE,
      },
      {
        id: 603,
        name: "Contact Form",
        description: "Manage contact form section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/contact-form`,
        privilege: PRIVILEGES.CONTACT_FORM_PRIVILEGE,
      },
      {
        id: 604,
        name: "Call To Action",
        description: "Manage call to action section",
        url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/call-to-action`,
        privilege: PRIVILEGES.CONTACT_CALL_TO_ACTION_PRIVILEGE,
      },

      // {
      //   id: 605,
      //   name: "Contact Us Office",
      //   description: "Manage office section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/contact-us-office`,
      //   privilege: PRIVILEGES.CONTACT_US_OFFICE_PRIVILEGE,
      // },

      // {
      //   id: 606,
      //   name: "Business Information",
      //   description: "Manage business information section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/business-information`,
      //   privilege: PRIVILEGES.BUSINESS_INFORMATION_PRIVILEGE,
      // },

      // {
      //   id: 607,
      //   name: "Contact Us Social Media",
      //   description: "Manage contact us social media section",
      //   url: `${WEB_PAGE_MANAGEMENT_URL}/contact-us-page/social-media`,
      //   privilege: PRIVILEGES.CONTACT_US_SOCIAL_MEDIA_PRIVILEGE,
      // },
    ],
  },
];

export const employeeManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Employee Management",
    description: "Manage employee records and staff operations",
    color: "#3B82F6",
    url: `${EMPLOYEE_MANAGEMENT_URL}/employees`,
    privilege: PRIVILEGES.EMPLOYEE_MANAGEMENT_PRIVILEGE,
    subData: [
      {
        id: 101,
        name: "View Employees",
        description: "View all employee records",
        color: "#60A5FA",
        url: `${EMPLOYEE_MANAGEMENT_URL}/employees/view`,
        privilege: PRIVILEGES.EMPLOYEE_VIEW_PRIVILEGE,
      },
      {
        id: 102,
        name: "Add Employee",
        description: "Add a new employee record",
        color: "#34D399",
        url: `${EMPLOYEE_MANAGEMENT_URL}/employees/add-new`,
        privilege: PRIVILEGES.EMPLOYEE_CREATE_PRIVILEGE,
      },
      {
        id: 103,
        name: "Update Employee",
        description: "Update existing employee information",
        color: "#FBBF24",
        url: `${EMPLOYEE_MANAGEMENT_URL}/employees/update`,
        privilege: PRIVILEGES.EMPLOYEE_UPDATE_PRIVILEGE,
      },
      {
        id: 104,
        name: "Resign Employee",
        description: "Mark employees as resigned",
        color: "#EF4444",
        url: `${EMPLOYEE_MANAGEMENT_URL}/employees/resign`,
        privilege: PRIVILEGES.EMPLOYEE_RESIGN_PRIVILEGE,
      },
    ],
  },

  {
    id: 2,
    name: "Role Management",
    description: "Manage system roles and access levels",
    color: "#10B981",
    url: `${EMPLOYEE_MANAGEMENT_URL}/roles`,
    privilege: PRIVILEGES.ROLE_MANAGEMENT_PRIVILEGE,
    subData: [
      {
        id: 201,
        name: "View Roles",
        description: "View all system roles",
        color: "#6EE7B7",
        url: `${EMPLOYEE_MANAGEMENT_URL}/roles/view`,
        privilege: PRIVILEGES.ROLE_VIEW_PRIVILEGE,
      },
      {
        id: 202,
        name: "Add Role",
        description: "Create a new system role",
        color: "#34D399",
        url: `${EMPLOYEE_MANAGEMENT_URL}/roles/add-new`,
        privilege: PRIVILEGES.ROLE_CREATE_PRIVILEGE,
      },
      {
        id: 203,
        name: "Update Role",
        description: "Update existing role information",
        color: "#FBBF24",
        url: `${EMPLOYEE_MANAGEMENT_URL}/roles/update`,
        privilege: PRIVILEGES.ROLE_UPDATE_PRIVILEGE,
      },
      {
        id: 204,
        name: "Terminate Role",
        description: "Deactivate or terminate system roles",
        color: "#EF4444",
        url: `${EMPLOYEE_MANAGEMENT_URL}/roles/terminate`,
        privilege: PRIVILEGES.ROLE_TERMINATE_PRIVILEGE,
      },
    ],
  },

  {
    id: 3,
    name: "Privilege Management",
    description: "Manage system privileges and permissions",
    color: "#8B5CF6",
    url: `${EMPLOYEE_MANAGEMENT_URL}/privileges`,
    privilege: PRIVILEGES.PRIVILEGE_MANAGEMENT_PRIVILEGE,
    subData: [
      {
        id: 301,
        name: "View Privileges",
        description: "View all system privileges",
        color: "#A78BFA",
        url: `${EMPLOYEE_MANAGEMENT_URL}/privileges/view`,
        privilege: PRIVILEGES.PRIVILEGE_VIEW_PRIVILEGE,
      },
      {
        id: 302,
        name: "Add Privilege",
        description: "Create a new system privilege",
        color: "#6EE7B7",
        url: `${EMPLOYEE_MANAGEMENT_URL}/privileges/add-new`,
        privilege: PRIVILEGES.PRIVILEGE_CREATE_PRIVILEGE,
      },
      {
        id: 303,
        name: "Update Privilege",
        description: "Update existing privilege information",
        color: "#FCD34D",
        url: `${EMPLOYEE_MANAGEMENT_URL}/privileges/update`,
        privilege: PRIVILEGES.PRIVILEGE_UPDATE_PRIVILEGE,
      },
      {
        id: 304,
        name: "Terminate Privilege",
        description: "Deactivate or terminate privileges",
        color: "#F87171",
        url: `${EMPLOYEE_MANAGEMENT_URL}/privileges/terminate`,
        privilege: PRIVILEGES.PRIVILEGE_TERMINATE_PRIVILEGE,
      },
    ],
  },
];
