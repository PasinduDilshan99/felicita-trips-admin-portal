import ProtectedRoute from '@/components/ProtectedRoute'
import UpdateDestinationPage from '@/pages/web-management/destinations/UpdateDestinationPage'
import { DESTINATION_UPDATE_PRIVILEGE } from '@/utils/privileges'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_UPDATE_PRIVILEGE]}>
      <UpdateDestinationPage/>
    </ProtectedRoute>
  )
}

export default page
