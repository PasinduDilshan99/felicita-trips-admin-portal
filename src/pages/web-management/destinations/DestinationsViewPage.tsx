import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import React from "react";

const DestinationsViewPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
    },
  ];
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Destinations View"
          description="Manage travel destination locations"
          breadcrumbItems={breadcrumbItems}
        />
      </div>
    </div>
  );
};

export default DestinationsViewPage;
