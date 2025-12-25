import { SideBarDataType } from "@/types/side-bar-types";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "./constant";

export const webManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Destinations",
    description: "Manage destination locations",
    color: "#3B82F6", // Blue
    url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    privilege: "DESTINATION_VIEW",
    subData: [
      {
        id: 101,
        name: "View Destinations",
        description: "View all destination locations",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
        privilege: "DESTINATION_VIEW",
      },
      {
        id: 102,
        name: "Add Destination",
        description: "Add a new destination location",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/add-new`,
        privilege: "DESTINATION_CREATE",
      },
      {
        id: 103,
        name: "Update Destination",
        description: "Update existing destination information",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/update`,
        privilege: "DESTINATION_UPDATE",
      },
      {
        id: 104,
        name: "Remove Destination",
        description: "Delete destination locations",
        url: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate`,
        privilege: "DESTINATION_TERMINATE",
      },
    ],
  },
  {
    id: 2,
    name: "Activities",
    description: "Manage tour activities",
    color: "#10B981", // Green
    url: "/activities",
    privilege: "ACTIVITY_VIEW",
    subData: [
      {
        id: 201,
        name: "View Activities",
        description: "View all available activities",
        url: "/activities",
        privilege: "ACTIVITY_VIEW",
      },
      {
        id: 202,
        name: "Add Activity",
        description: "Add a new activity",
        url: "/activities/add",
        privilege: "ACTIVITY_CREATE",
      },
      {
        id: 203,
        name: "Update Activity",
        description: "Update existing activity information",
        url: "/activities/update",
        privilege: "ACTIVITY_UPDATE",
      },
      {
        id: 204,
        name: "Remove Activity",
        description: "Delete activities",
        url: "/activities/remove",
        privilege: "ACTIVITY_TERMINATE",
      },
    ],
  },
  {
    id: 3,
    name: "Tours",
    description: "Manage tour packages",
    color: "#F59E0B", // Amber
    url: "/tours",
    privilege: "TOUR_VIEW",
    subData: [
      {
        id: 301,
        name: "View Tours",
        description: "View all tour packages",
        url: "/tours",
        privilege: "TOUR_VIEW",
      },
      {
        id: 302,
        name: "Add Tour",
        description: "Create a new tour package",
        url: "/tours/add",
        privilege: "TOUR_CREATE",
      },
      {
        id: 303,
        name: "Update Tour",
        description: "Update existing tour information",
        url: "/tours/update",
        privilege: "TOUR_UPDATE",
      },
      {
        id: 304,
        name: "Remove Tour",
        description: "Delete tour packages",
        url: "/tours/remove",
        privilege: "TOUR_TERMINATE",
      },
    ],
  },
  {
    id: 4,
    name: "Packages",
    description: "Manage holiday packages",
    color: "#8B5CF6", // Violet
    url: "/packages",
    privilege: "PACKAGE_VIEW",
    subData: [
      {
        id: 401,
        name: "View Packages",
        description: "View all holiday packages",
        url: "/packages",
        privilege: "PACKAGE_VIEW",
      },
      {
        id: 402,
        name: "Add Package",
        description: "Create a new holiday package",
        url: "/packages/add",
        privilege: "PACKAGE_CREATE",
      },
      {
        id: 403,
        name: "Update Package",
        description: "Update existing package information",
        url: "/packages/update",
        privilege: "PACKAGE_UPDATE",
      },
      {
        id: 404,
        name: "Remove Package",
        description: "Delete holiday packages",
        url: "/packages/remove",
        privilege: "PACKAGE_TERMINATE",
      },
    ],
  },
];
