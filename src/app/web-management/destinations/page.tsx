import { useAuth } from "@/contexts/AuthContext";
import DestinationPage from "@/pages/web-management/destinations/DestinationPage";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const { hasPrivilege } = useAuth();

  if (!hasPrivilege("DESTINATION_VIEW")) {
    router.back();
  }

  return (
    <div>
      <DestinationPage />
    </div>
  );
};

export default page;
