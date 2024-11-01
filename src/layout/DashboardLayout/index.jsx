import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
     <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop and mobile */}
      <div className={`fixed top-0 left-0 h-full bg-gray-100 z-50 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:w-[16%]`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-full lg:w-[84%] lg:ml-[16%] h-full">
        {/* Header with toggle button */}
        <div className="fixed top-0 w-full lg:w-[84%] z-50 bg-white shadow-sm">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Content */}
        <div className="flex-1 mt-[72px] overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
