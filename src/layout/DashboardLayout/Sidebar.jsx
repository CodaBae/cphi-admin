import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Logo from "../../assets/svg/logo_small.svg"
import { RxDashboard } from 'react-icons/rx'
import { TbLogout } from 'react-icons/tb'


const Sidebar = () => {

  const location = useLocation()

  const navigate = useNavigate()

  return (
    <div className='border w-full flex flex-col items-center  py-[18px] px-[24px] h-full border-l-0 overflow-y-auto overflow-x-hidden border-t-0 border-r-[#E5E5EA]'>
      <div className='flex flex-col -ml-[10%] gap-1'>
        <img src={Logo} alt='Logo' className='w-[190px] h-[81px]' />
      </div>
      <div className={`${location.pathname === "/dashboard" || location.pathname === "/referrals/details"  ? "bg-[#2D84FF]" : ""} flex items-center gap-3 group hover:bg-[#2D84FF] p-2 w-[156px] cursor-pointer rounded-lg h-auto`} onClick={() => navigate("/dashboard")}>
          <RxDashboard className={`${location.pathname === "/dashboard" || location.pathname === "/referrals/details" ? "text-[#fff]" : "text-[#575757]"} w-5 h-5  group-hover:text-[#fff]`}/>
          <p className={`${location.pathname === "/dashboard" || location.pathname === "/referrals/details"  ? "text-[#fff]" : "text-[#575757]"} font-sans  group-hover:text-[#fff] font-medium text-sm`}>Dashboard</p>
      </div>
      <hr />

      <div className={`flex items-center gap-3  p-2 w-[156px] cursor-pointer mt-10 rounded-lg h-auto`} onClick={() => navigate("/referral/login")}>
          <TbLogout className={`text-RED-_100 w-5 h-5 `}/>
          <p className={`font-sans text-[#575757]  font-medium text-sm`}>Logout</p>
      </div>


    </div>
  )
}

export default Sidebar
