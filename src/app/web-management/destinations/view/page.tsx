import DestinationsViewPage from "@/components/destinations-components/DestinationsViewPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_VIEW"]}>
      <DestinationsViewPage />
    </ProtectedRoute>
  );
};

export default page;
