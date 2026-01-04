import { SideBarDataType } from "@/types/side-bar-types";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";
import { ACTIVITY_CREATE_PRIVILEGE, ACTIVITY_PRIVILEGE, ACTIVITY_TERMINATE_PRIVILEGE, ACTIVITY_UPDATE_PRIVILEGE, ACTIVITY_VIEW_PRIVILEGE, DESTINATION_CREATE_PRIVILEGE, DESTINATION_PRIVILEGE, DESTINATION_TERMINATE_PRIVILEGE, DESTINATION_UPDATE_PRIVILEGE, DESTINATION_VIEW_PRIVILEGE, PACKAGE_CREATE_PRIVILEGE, PACKAGE_PRIVILEGE, PACKAGE_TERMINATE_PRIVILEGE, PACKAGE_UPDATE_PRIVILEGE, PACKAGE_VIEW_PRIVILEGE, TOUR_CREATE_PRIVILEGE, TOUR_PRIVILEGE, TOUR_TERMINATE_PRIVILEGE, TOUR_VIEW_PRIVILEGE } from "@/utils/privileges";

export const webManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Destinations",
    description: "Manage destination locations",
    color: "#3B82F6", // Blue
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    privilege: DESTINATION_PRIVILEGE,
    subData: [
      {
        id: 101,
        name: "View Destinations",
        description: "View all destination locations",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
        privilege: DESTINATION_VIEW_PRIVILEGE,
      },
      {
        id: 102,
        name: "Add Destination",
        description: "Add a new destination location",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/add-new`,
        privilege: DESTINATION_CREATE_PRIVILEGE,
      },
      {
        id: 103,
        name: "Update Destination",
        description: "Update existing destination information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/update`,
        privilege: DESTINATION_UPDATE_PRIVILEGE,
      },
      {
        id: 104,
        name: "Remove Destination",
        description: "Delete destination locations",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate`,
        privilege: DESTINATION_TERMINATE_PRIVILEGE,
      },
    ],
  },
  {
    id: 2,
    name: "Activities",
    description: "Manage tour activities",
    color: "#10B981", // Green
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    privilege: ACTIVITY_PRIVILEGE,
    subData: [
      {
        id: 201,
        name: "View Activities",
        description: "View all available activities",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`,
        privilege: ACTIVITY_VIEW_PRIVILEGE,
      },
      {
        id: 202,
        name: "Add Activity",
        description: "Add a new activity",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/add-new`,
        privilege: ACTIVITY_CREATE_PRIVILEGE,
      },
      {
        id: 203,
        name: "Update Activity",
        description: "Update existing activity information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/update`,
        privilege: ACTIVITY_UPDATE_PRIVILEGE,
      },
      {
        id: 204,
        name: "Remove Activity",
        description: "Delete activities",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/terminate`,
        privilege: ACTIVITY_TERMINATE_PRIVILEGE,
      },
    ],
  },
  {
    id: 3,
    name: "Tours",
    description: "Manage tour packages",
    color: "#F59E0B", // Amber
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    privilege: TOUR_PRIVILEGE,
    subData: [
      {
        id: 301,
        name: "View Tours",
        description: "View all tour packages",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`,
        privilege: TOUR_VIEW_PRIVILEGE,
      },
      {
        id: 302,
        name: "Add Tour",
        description: "Create a new tour package",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/add-new`,
        privilege: TOUR_CREATE_PRIVILEGE,
      },
      {
        id: 303,
        name: "Update Tour",
        description: "Update existing tour information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/update`,
        privilege: "TOUR_UPDATE",
      },
      {
        id: 304,
        name: "Remove Tour",
        description: "Delete tour packages",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/terminate`,
        privilege: TOUR_TERMINATE_PRIVILEGE,
      },
    ],
  },
  {
    id: 4,
    name: "Packages",
    description: "Manage holiday packages",
    color: "#8B5CF6", // Violet
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}`,
    privilege: PACKAGE_PRIVILEGE,
    subData: [
      {
        id: 401,
        name: "View Packages",
        description: "View all holiday packages",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`,
        privilege: PACKAGE_VIEW_PRIVILEGE,
      },
      {
        id: 402,
        name: "Add Package",
        description: "Create a new holiday package",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/add-new`,
        privilege: PACKAGE_CREATE_PRIVILEGE,
      },
      {
        id: 403,
        name: "Update Package",
        description: "Update existing package information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/update`,
        privilege: PACKAGE_UPDATE_PRIVILEGE,
      },
      {
        id: 404,
        name: "Remove Package",
        description: "Delete holiday packages",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/terminate`,
        privilege: PACKAGE_TERMINATE_PRIVILEGE,
      },
    ],
  },
];
