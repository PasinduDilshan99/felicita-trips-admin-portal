import { SideBarDataType } from "@/types/side-bar-types";

export const webManagementSideBarData: SideBarDataType[] = [
  {
    id: 1,
    name: "Destinations",
    description: "Manage destination locations",
    color: "#3B82F6", // Blue
    url: "/destinations",
    subData: [
      {
        id: 101,
        name: "View Destinations",
        description: "View all destination locations",
        url: "/destinations"
      },
      {
        id: 102,
        name: "Add Destination",
        description: "Add a new destination location",
        url: "/destinations/add"
      },
      {
        id: 103,
        name: "Update Destination",
        description: "Update existing destination information",
        url: "/destinations/update"
      },
      {
        id: 104,
        name: "Remove Destination",
        description: "Delete destination locations",
        url: "/destinations/remove"
      }
    ]
  },
  {
    id: 2,
    name: "Activities",
    description: "Manage tour activities",
    color: "#10B981", // Green
    url: "/activities",
    subData: [
      {
        id: 201,
        name: "View Activities",
        description: "View all available activities",
        url: "/activities"
      },
      {
        id: 202,
        name: "Add Activity",
        description: "Add a new activity",
        url: "/activities/add"
      },
      {
        id: 203,
        name: "Update Activity",
        description: "Update existing activity information",
        url: "/activities/update"
      },
      {
        id: 204,
        name: "Remove Activity",
        description: "Delete activities",
        url: "/activities/remove"
      }
    ]
  },
  {
    id: 3,
    name: "Tours",
    description: "Manage tour packages",
    color: "#F59E0B", // Amber
    url: "/tours",
    subData: [
      {
        id: 301,
        name: "View Tours",
        description: "View all tour packages",
        url: "/tours"
      },
      {
        id: 302,
        name: "Add Tour",
        description: "Create a new tour package",
        url: "/tours/add"
      },
      {
        id: 303,
        name: "Update Tour",
        description: "Update existing tour information",
        url: "/tours/update"
      },
      {
        id: 304,
        name: "Remove Tour",
        description: "Delete tour packages",
        url: "/tours/remove"
      }
    ]
  },
  {
    id: 4,
    name: "Packages",
    description: "Manage holiday packages",
    color: "#8B5CF6", // Violet
    url: "/packages",
    subData: [
      {
        id: 401,
        name: "View Packages",
        description: "View all holiday packages",
        url: "/packages"
      },
      {
        id: 402,
        name: "Add Package",
        description: "Create a new holiday package",
        url: "/packages/add"
      },
      {
        id: 403,
        name: "Update Package",
        description: "Update existing package information",
        url: "/packages/update"
      },
      {
        id: 404,
        name: "Remove Package",
        description: "Delete holiday packages",
        url: "/packages/remove"
      }
    ]
  }
];