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

export const ACTIVITY_PAGE_BREADCRUMB_DATA: breadcrumbType[] = [
  { label: "Content Management", href: URLS.CONTENT_MANAGEMENT_URL },
  { label: "Activities", href: URLS.ACTIVITIES_PAGE_URL },
];
