import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[16%] fixed top-0 left-0 h-full bg-gray-100 z-50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-[84%] ml-[16%] h-full">
        {/* Fixed Header */}
        <div className="fixed top-0 w-[84%] z-50 bg-white shadow-sm">
          <Header />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 mt-[72px] overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
