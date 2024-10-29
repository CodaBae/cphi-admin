import React from 'react'

const Details = () => {
  return (
    <div className='w-full'>
        <div className='flex items-center justify-between'>
            <p className='font-sans text-base text-[#1C1C1E] font-semibold text-[18px]'>Details</p>
            <div className='flex items-center gap-4'>
                <div className='w-[82px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#F4003D1A] '>
                    <p className='text-[#F4003D] font-sans text-[12px] font-medium'> No Show</p>
                </div>
                <div className='w-[82px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#1EC6771A] '>
                    <p className='text-[#1EC677] font-sans text-[12px] font-medium'>Completed</p>
                </div>
            </div>
        </div>
        <div className='w-[620px] h-[515px] flex flex-col mt-[32px] gap-10'>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Name</p>
                    <p className='text-[#817F9B] text-base font-sans'>Janet Doug</p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Email</p>
                    <p className='text-[#817F9B] text-base font-sans'>Janet.doug@mail.com</p>
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Phone Number</p>
                    <p className='text-[#817F9B] text-base font-sans'>+2348123456789</p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Status</p>
                    <div className='w-[78px] bg-[#F4CB0042] h-[23px] flex items-center justify-center rounded-xl'>
                        <p className='text-[#FF9909] text-[10px] font-sans'>Pending</p>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Date/Time</p>
                    <p className='text-[#817F9B] text-base font-sans'>9 - 08 - 2024 10:00</p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Location</p>
                    <p className='text-[#817F9B] text-base font-sans'>Lagos</p>
                </div>
            </div>
            <div className='flex flex-col w-[300px] gap-2'>
                <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Service</p>
                <p className='text-[#817F9B] text-base font-sans'>Test, Consultation, Treatment</p>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Description</p>
                <p className='text-[#817F9B] text-base font-sans'>
                    I’ve been feeling unwell lately and have noticed some unusual symptoms. 
                    I also recently had unprotected sex and am worried about my health. 
                    I believe it's important to get tested to ensure my safety and the safety of my partner.
                </p>
            </div>

            {/* <div className='bg-[#E1E5F3] w-full h-[1px] mt-[43px]'></div> */}

            <div className='mt-[41px] gap-[32px] flex flex-col'>
                <p className='font-sans text-lg font-semibold text-[#1C1C1E]'>Doctor Information</p>

                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Name</p>
                    <p className='text-[#817F9B] text-base font-sans'>Janet Doug</p>
                </div>

                <div className='flex flex-col gap-2  mb-5'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Description</p>
                    <p className='text-[#817F9B] text-base font-sans'>
                       The consultation went well, I refereed her to do some test
                    </p>
                </div>

            </div>
        </div>

    </div>
  )
}

export default Details