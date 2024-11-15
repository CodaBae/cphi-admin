import React, { useState, Fragment, useEffect } from 'react'
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore'
import { AiOutlineClose } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg'
import { toast } from 'react-toastify'
import { db } from '../../../firebase-config'


const Request = ({ handleClose, data, userDetails }) => {
    const [loading, setLoading] = useState(false)
    const [rewards, setRewards] = useState([])



    const submitForm = async () => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'requests'), {
                userDetails,
                status: "Pending",
                requestedAt: new Date(),
            });
            toast.success('Reward Request Submitted Successfully!');
            handleClose();
        } catch (error) {
            toast.error('Error Submitting Reward Request. Try again.');
            console.error('Error Submitting Reward Request: ', error);
        } finally {
            setLoading(false);
        }
    };
    
    const getRewards = async () => {
        try {
            const rewardRef = collection(db, "rewards")
            const querySnapshot = await getDocs(rewardRef)

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setRewards(data)

        } catch (err) {
            console.log("Error getting Rewards", err)
        }
    }


    useEffect(() => {
        getRewards()
    }, [])

    const getRewardDescription = () => {
        const currentLength = data?.length || 0;

        const reward = rewards.find(({ range }) => 
            currentLength >= parseInt(range.from) && currentLength <= parseInt(range.to)
        );

        return reward ? reward.description : 'No rewards available for this range';
    };


  return (
    <div className='bg-[#fff] w-[668px] h-[508px] flex flex-col p-6 mt-[100px] overflow-y-scroll relative gap-[32px] rounded-lg'>
        <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Request Reward</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div className='flex flex-col gap-[32px]'>
            <div className='w-full h-[135px] flex items-center justify-center flex-col gap-2 bg-[#2D84FF17]'>
                <p className='font-sans font-medium text-[#757575] text-base'>Total Number Of Referral </p>
                <p className='font-sans text-[#1C1C1C] font-bold text-[24px]'>{data?.length}</p>
            </div>

            <div className='w-full flex flex-col  gap-[32px]'>
                <p className='font-mulish text-[#1C1C1E] text-[17px]'>
                    {getRewardDescription()}
                </p>
               
            </div>
                <button
                    className='flex items-center absolute bottom-8 justify-center gap-2 w-11/12 rounded-lg h-[45px] p-2 bg-[#2D84FF]'
                    type='submit'
                    onClick={submitForm}
                >
                    <p className='text-[#fff] font-sans font-semibold text-sm'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Request Reward'}</p>
                </button>
        </div>

    </div>
  )
}

export default Request