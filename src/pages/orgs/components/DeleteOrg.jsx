import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { CgSpinner } from 'react-icons/cg';
import { doc, deleteDoc } from 'firebase/firestore';

import { db } from '../../../firebase-config';


const DeleteOrg = ({ handleClose, orgData }) => {
    const [loading, setLoading] = useState(false)

    console.log(orgData, "mask")


    const submitForm = async () => {
        setLoading(true);
        try {
            // Create a reference to the document to delete
            const orgDocRef = doc(db, 'users', orgData.id);
            
            // Delete the document from Firestore
            await deleteDoc(orgDocRef);
            
            toast.success('Organization deleted successfully!');
            handleClose(); // Close the modal after successful deletion
            window.location.reload()
        } catch (error) {
            console.error('Error deleting organization:', error);
            toast.error('Failed to delete organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className='bg-[#fff] w-[300px] h-[200px] mt-[100px] flex flex-col items-center p-8 gap-8 rounded-lg'>
        <p className='text-center text-lg font-medium font-merri '>Are you sure you want to delete this Organization?</p>
        <div className='flex justify-between gap-8'>
            <button className='border w-[100px] h-[50px]   rounded-lg border-[#EB5757] bg-[#fff] text' onClick={handleClose}>
                <p className='font-sans font-bold text-base text-[#EB5757]'>Cancel</p>
            </button>
            <button onClick={submitForm} className='bg-[#6FCF97] w-[140px] border-none flex items-center justify-center p-2 rounded-lg'>
            <p className='text-[#fff] text-base  font-sans text-center  font-medium'>{loading ? <CgSpinner className=" animate-spin text-lg  " /> : ' Yes, Delete'}</p>
               
            </button>
        </div>
    </div>
  )
}

export default DeleteOrg