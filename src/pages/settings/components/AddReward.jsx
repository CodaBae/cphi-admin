import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg'

const AddReward = ({ handleClose }) => {
    const [addRangeOne, setAddRangeOne] = useState(0)
    const [addRangeTwo, setAddRangeTwo] = useState(0)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)


  return (
    <div className='w-[668px] h-[389px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[100px] overflow-y-scroll gap-[32px] '>
        <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Add Reward</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div className='flex flex-col gap-2'>
            <p className='font-medium text-[#1C1A3C] font-sans text-[14px] '>Number Range</p>
            <div className='flex items-center gap-2'>
                <input 
                    name='rangeOne'
                    placeholder=''
                    onChange={(e) => setAddRangeOne(e.target.value)}
                    value={addRangeOne}
                    className='border-[#E1E5F3] border outline-[#2D84FF] p-2 w-[87px] h-[40px] rounded-lg'
                />
                <input 
                    name='rangeTwo'
                    placeholder=''
                    onChange={(e) => setAddRangeTwo(e.target.value)}
                    value={addRangeTwo}
                    className='border-[#E1E5F3] border outline-[#2D84FF] p-2 w-[87px] h-[40px] rounded-lg'
                />
            </div>
        </div>

        <div className='flex flex-col gap-2'>
            <p className='font-medium text-[#1C1A3C] font-sans text-[14px] '>Description</p>
            <textarea
                name='description'
                onChange={(e) => setDescription(e.target.value)}
                placeholder=''
                value={description}
                className='border-[#E1E5F3] border outline-[#2D84FF] w-[620px] h-[64px] rounded-lg'
            >
            </textarea>
        </div>

        <button
            className="bg-[#2D84FF] w-full font-poppins flex items-center rounded-[6px] justify-center mt-[0px] h-[46px] text-base text-center"
            type="submit"
          
        >
            <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Complete'}</p>
            
        </button>


    </div>
  )
}

export default AddReward