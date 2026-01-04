import DestinationsViewPage from "@/components/destinations-components/DestinationsViewPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <DestinationsViewPage />
    </ProtectedRoute>
  );
};

export default page;
