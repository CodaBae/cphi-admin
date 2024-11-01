import React, { useState } from 'react'
import PageContent from './components/PageContent'
import AllServices from './components/AllServices'
import RewardDisplay from './components/RewardDisplay'
import AdminAccess from './components/AdminAccess'

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Page Content")

    const handleChangeTab = (value) => {
        setActiveTab(value)
    }

  return (
    <div className='flex flex-col gap-[21px]'>
        <p className='font-semibold text-[#1C1C1E] text-[18px] font-sans'>Settings</p>

        <div className='flex items-center overflow-x-auto gap-5'>
            <div onClick={() => handleChangeTab("Page Content")} className={`${activeTab === "Page Content" ? "border-[#2D84FF]" : "border-b-0"} border border-t-0 p-2 cursor-pointer border-x-0`}>
                <p className={`${activeTab === "Page Content" ? "text-[#2D84FF]" : "text-[#575757]" } font-semibold font-sans text-base`}>Page Content</p>
            </div>
            <div onClick={() => handleChangeTab("All Services")} className={`${activeTab === "All Services" ? "border-[#2D84FF]" : "border-b-0"} border border-t-0 p-2 cursor-pointer border-x-0`}>
                <p className={`${activeTab === "All Services" ? "text-[#2D84FF]" : "text-[#575757]" } font-semibold font-sans text-base`}>All Services</p>
            </div>
            <div onClick={() => handleChangeTab("Rewards Display")} className={`${activeTab === "Rewards Display" ? "border-[#2D84FF]" : "border-b-0"} border border-t-0 p-2 cursor-pointer border-x-0`}>
                <p className={`${activeTab === "Rewards Display" ? "text-[#2D84FF]" : "text-[#575757]" } font-semibold font-sans text-base`}>Rewards Display</p>
            </div>
            <div onClick={() => handleChangeTab("Admin Access")} className={`${activeTab === "Admin Access" ? "border-[#2D84FF]" : "border-b-0"} border border-t-0 p-2 cursor-pointer border-x-0`}>
                <p className={`${activeTab === "Admin Access" ? "text-[#2D84FF]" : "text-[#575757]" } font-semibold font-sans text-base`}>Admin Access</p>
            </div>
        </div>

        {activeTab === "Page Content" && <PageContent />}
        {activeTab === "All Services" && <AllServices />}
        {activeTab === "Rewards Display" && <RewardDisplay />}
        {activeTab === "Admin Access" && <AdminAccess />}
        
    </div>
  )
}

export default Settings