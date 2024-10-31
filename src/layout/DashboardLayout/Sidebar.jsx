import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Logo from "../../assets/svg/logo_small.svg"
import { RxDashboard } from 'react-icons/rx'
import { TbLogout } from 'react-icons/tb'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6'
import { MdOutlineCardGiftcard } from 'react-icons/md'
import { CiSettings } from 'react-icons/ci'
import { PiUsersThree } from "react-icons/pi";
import { BiUser } from 'react-icons/bi'


const Sidebar = () => {

  const location = useLocation()

  const navigate = useNavigate()

  return (
    <div className='border w-full flex flex-col items-center gap-5  py-[18px] px-[24px] h-full border-l-0 overflow-y-auto overflow-x-hidden border-t-0 border-r-[#E5E5EA]'>
      <div className='flex flex-col -ml-[10%] gap-1'>
        <img src={Logo} alt='Logo' className='w-[190px] h-[81px]' />
      </div>
      <div className={`${location.pathname === "/dashboard"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/dashboard")}>
          <RxDashboard className={`${location.pathname === "/dashboard" ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/dashboard"  ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Dashboard</p>
      </div>
      <div className={`${location.pathname === "/appointments"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/appointments")}>
          <FaRegFileAlt  className={`${location.pathname === "/appointments"  ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/appointments" ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Appointments</p>
      </div>
      <div className={`${location.pathname === "/orgs" || location.pathname === "/orgs/add"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/orgs")}>
          <PiUsersThree className={`${location.pathname === "/orgs" || location.pathname === "/orgs/add"  ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/orgs" || location.pathname === "/orgs/add"  ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Orgs</p>
      </div>
      <div className={`${location.pathname === "/individuals" || location.pathname === "/individuals/add" ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/individuals")}>
          <BiUser  className={`${location.pathname === "/individuals" || location.pathname === "/individuals/add" ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/individuals" || location.pathname === "/individuals/add" ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Individuals</p>
      </div>
      <div className={`${location.pathname === "/reward-request"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/reward-request")}>
          <MdOutlineCardGiftcard  className={`${location.pathname === "/reward-request"  ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/reward-request" ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Reward Request</p>
      </div>
      <div className={`${location.pathname === "/settings"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/settings")}>
        <CiSettings className={`${location.pathname === "/settings"  ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
        <p className={`${location.pathname === "/settings" ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Settings</p>
      </div>

      <hr />

      <div className={`flex items-center gap-3  p-2 w-[156px] cursor-pointer mt-10 rounded-lg h-auto`} onClick={() => navigate("/")}>
          <TbLogout className={`text-RED-_100 w-5 h-5 `}/>
          <p className={`font-sans text-[#575757]  font-medium text-sm`}>Logout</p>
      </div>


    </div>
  )
}

export default Sidebar
