import React from 'react'
import Logo from "../../assets/svg/logo_small.svg"

const Header = () => {
  return (
    <div className='w-full fixed z-50 bg-[#fff]'>
        <img src={Logo} alt="Logo" className='w-[276px] h-[82px]' />
    </div>
  )
}

export default Header