import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase-config'
import { CgSpinner } from 'react-icons/cg'
import ModalPop from './modalPop'
import StatusUpdate from '../pages/appointments/component/StatusUpdate'

const Details = () => {
    const [loading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [showModal, setShowModal] = useState(false);

    const location = useLocation()
    const userData = location.state

    console.log(userData, "mellow")

    
    const updateStatus = async () => {
        setLoading(true)
        try {
            const appointmentRef = doc(db, 'referrals', userData.id);

            await updateDoc(appointmentRef, {
                status: 'No Show',
            });
            toast.success('Status updated successfully!');
        } catch (error) {
            toast.error('Error updating status!');
            console.error('Error updating status:', error);
        } finally {
            setLoading(false)
        }
    };




  return (
    <div className='w-full'>
        <div className='flex items-center justify-between'>
            <p className='font-sans text-base text-[#1C1C1E] font-semibold text-[18px]'>Details</p>
            <div className='flex items-center gap-4'>
                <div onClick={updateStatus} className='w-[82px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#F4003D]'>
                    <p className='text-[#FFF] font-sans text-[12px] font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg text-[#FFF]" /> : 'No Show'}</p>
                </div>
                <div onClick={() => setShowModal(true)} className='w-[82px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#1EC677]' >
                    <p className='text-[#FFF] font-sans text-[12px] font-medium'>{updateLoading ? <CgSpinner className=" animate-spin text-lg text-[#FFF]" /> : 'Completed'}</p>
                </div>
            </div>
        </div>
        <div className='lg:w-[620px] h-[515px] flex flex-col mt-[32px] gap-10'>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Name</p>
                    <p className='text-[#817F9B] text-base font-sans'>{userData?.profile?.fullName}</p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Email/Phone</p>
                    <p className='text-[#817F9B] text-base font-sans'>{userData?.profile?.emailOrphone}</p>
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Phone Number</p>
                    <p className='text-[#817F9B] text-base font-sans'>N/A</p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Status</p>
                    <div className={`${userData?.status === "Completed" ? "bg-[#E7F4EE]" : userData?.status === "No Show" ? "bg-[#FEE5EC]" : "bg-[#FDF1E8]"} w-[78px] flex items-center justify-center p-1 h-auto rounded-xl`}>
                        <p className={`${userData?.status === "Completed" ? "text-[#0D894F]" : userData?.status === "No Show" ? "text-[#F4003D]" : "text-[#E46A11]"} font-sans capitalize font-semibold text-center text-[10px]`}>{userData?.status}</p>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Date/Time</p>
                    <p className='text-[#817F9B] text-base font-sans'>{userData?.date} <span>{userData?.time}</span></p>
                </div>
                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Location</p>
                    <p className='text-[#817F9B] text-base font-sans'>{userData?.location}</p>
                </div>
            </div>
            <div className='flex flex-col w-[300px] gap-2'>
                <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Service</p>
                <div className='flex items-center gap-2'>
                    {
                        userData.about?.services?.map((s, index) => (
                            <p key={index} className='text-[#817F9B] text-base whitespace-nowrap font-sans'>
                                {s}
                            </p>
                        ))
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Description</p>
                <p className='text-[#817F9B] text-base font-sans'>
                    {userData?.about?.story}
                </p>
            </div>

            {/* <div className='bg-[#E1E5F3] w-full h-[1px] mt-[43px]'></div> */}

            <div className='mt-[41px] gap-[32px] flex flex-col'>
                <p className='font-sans text-lg font-semibold text-[#1C1C1E]'>Doctor Information</p>

                <div className='flex flex-col w-[300px] gap-2'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Name</p>
                    <p className='text-[#817F9B] text-base font-sans'>{userData?.docName || "N/A"}</p>
                </div>

                <div className='flex flex-col gap-2  mb-5'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Description</p>
                    <p className='text-[#817F9B] text-base font-sans'>
                        {userData?.docSummary || "N/A"}
                    </p>
                </div>

                <div className='flex flex-col gap-2  mb-5'>
                    <p className='font-sans text-[#1C1A3C] text-sm font-medium'>Hiv Status</p>
                    <p className='text-[#817F9B] text-base font-sans'>
                        {userData?.hivStatus || "N/A"}
                    </p>
                </div>

            </div>
        </div>

        <ModalPop isOpen={showModal}>
            <StatusUpdate 
                handleClose={() => setShowModal(false)}
                clientData={userData}
                updateLoadingB={updateLoading}
                setUpdateLoadingB={setUpdateLoading}
            />
        </ModalPop>

    </div>
  )
}

export default Details