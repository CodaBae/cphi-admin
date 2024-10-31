import React from 'react'
import { RiDeleteBinFill } from 'react-icons/ri'

import Close from "../../../assets/svg/close.svg"
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebase-config'
import { toast } from 'react-toastify'
import { CgSpinner } from 'react-icons/cg'

const DeleteAdmin = ({ handleClose, deleteData, setDeleteLoading, deleteLoading }) => {

    console.log(deleteData, "deleteData")

    const deleteItem = () => {
        setDeleteLoading(true)
        const docRef = doc(db, "admins", deleteData?.id)
        deleteDoc(docRef)
        .then(() => {
            setDeleteLoading(false)
            toast.success(`Admin Deleted Successfully`, { 
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            });
            handleClose()
        })
        .catch((err) => {
            setDeleteLoading(false)
            console.log(err,  "mystic")
            toast.error(`Error Deleting Admin`, { 
                position: "top-right",
                autoClose: 3500,
                closeOnClick: true,
            });
            handleClose()
        })
    }

  return (
    <div className='bg-[#fff] w-[400px] h-[368px] mt-[100px] rounded-lg flex flex-col gap-[32px]'>
        <div className='flex justify-end cursor-pointer p-6' onClick={handleClose}>
            <img src={Close} alt='Close' className='w-4 h-4' />
        </div>

        <div className='flex flex-col items-center justify-center px-5 gap-3'>
            <div className='w-[88px] h-[88px] rounded-full bg-[#FEE2E2] flex flex-col items-center justify-center p-2'>
                <RiDeleteBinFill className='text-[#EF4444] text-[40px]' />
            </div>
            <p className='text-[#000929] font-semibold text-[20px]'>Delete {deleteData?.fullName}</p>
            <p className='font-sans text-base text-center text-[#475569]'>
                Do you want to delete this admin? This action can’t be undone
            </p>

            <div className='flex items-center gap-6'>
                <button
                    className='w-[120px] h-[40px] rounded-lg border p-2 flex items-center justify-center border-[#E0E2E7]'
                    onClick={handleClose}
                >
                    <p className='font-sans font-semibold text-[#000929] text-[14px]'>Cancel</p>
                </button>
                <button
                    className='w-[120px] h-[40px] rounded-lg bg-[#EF4444] p-2 flex items-center justify-center'
                    onClick={deleteItem}
                >
                    {
                        deleteLoading ? 
                        <CgSpinner className="text-lg animate-spin text-[#fff]" />
                        :
                        <p className='font-sans font-semibold text-[#fff] text-[14px]'>Delete</p>
                    }
                </button>
            </div>

        </div>

    </div>
  )
}

export default DeleteAdmin