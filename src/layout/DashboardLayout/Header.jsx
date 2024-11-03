import React, { useState } from 'react'
import Note from "../../assets/svg/note.svg"
import Bell from "../../assets/svg/bell.svg"
import { IoSearch } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi';

const Header = ({ toggleSidebar }) => {
    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const location = useLocation()


  return (
    <div className='py-[18px] px-[28px] h-[72px] flex items-center justify-between'>
        <div className="flex items-center gap-2">
            <GiHamburgerMenu className="w-6 h-6 text-[#000] lg:hidden cursor-pointer" onClick={toggleSidebar} />
            <img src={Note} alt="Note" className="w-[28px] h-[28px]" />
            <p className="font-euclid text-[#00000066] cursor-pointer text-sm">Dashboard</p>
        </div>
       
        <div className='flex items-center gap-6'>
            <div className='flex items-center gap-3'>
                <div className='w-[100px] lg:w-[254px] invisible flex items-center bg-[#0000000D] rounded-lg h-[36px] '>
                    <div className='bg-[#0000000D] h-full rounded-tl-lg rounded-bl-lg flex items-center p-2'>
                        <IoSearch className='w-4 h-4 text-[#00000066]' />
                    </div>
                    <input 
                        name='search'
                        value={search}
                        className='w-full bg-[#0000000D] h-full rounded-tr-lg rounded-br-lg p-2 outline-none'
                        placeholder='Search'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <img src={Bell} alt='Bell' className='w-5 h-5' />
            </div>
            
        </div>

    </div>
  )
}

export default Header
