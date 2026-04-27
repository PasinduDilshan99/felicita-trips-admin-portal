import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationCategoriesPage from "@/pages/web-management/destinations/destination-categories/DestinationCategoriesPage";
import DestinationPage from "@/pages/web-management/destinations/DestinationPage";
import { DESTINATION_CATEGORY_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CATEGORY_PRIVILEGE]}>
      <DestinationCategoriesPage />
    </ProtectedRoute>
  );
};

export default page;
