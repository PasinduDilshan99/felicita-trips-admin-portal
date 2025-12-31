import ProtectedRoute from '@/components/ProtectedRoute'
import UpdateDestinationPage from '@/pages/web-management/destinations/UpdateDestinationPage'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_UPDATE"]}>
      <UpdateDestinationPage/>
    </ProtectedRoute>
  )
}

export default page
