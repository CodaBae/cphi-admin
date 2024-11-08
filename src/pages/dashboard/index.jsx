import React from 'react'
import AdminDashboard from './components/AdminDashboard'
import SuperAdminDashboard from './components/SuperAdminDashboard'
import { useSelector } from 'react-redux'

const Dashboard = () => {

    const { user } = useSelector((state) => state.adminLogin)
    const adminLoginType = user?.userType
    console.log(user, "user")


  return (
    <>
        {adminLoginType === "Program Assistant" ? <AdminDashboard /> : <SuperAdminDashboard />}
    </>
  )
}

export default Dashboard