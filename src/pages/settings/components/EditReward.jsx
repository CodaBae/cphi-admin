import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai'
import { db } from '../../../firebase-config';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

const EditReward = ({ handleClose, setEditDataLoading, editDataLoading, editData }) => {
    const [addRangeOne, setAddRangeOne] = useState(editData.range.from || 0)
    const [addRangeTwo, setAddRangeTwo] = useState(editData.range.to || 0)
    const [description, setDescription] = useState(editData.description || "")

    const submitForm = async () => {
        setEditDataLoading(true);
        try {
            const rewardsRef = doc(db, 'rewards', editData.id);

            await updateDoc(rewardsRef, {
                range: {
                    from: addRangeOne,
                    to: addRangeTwo
                },
                description: description,
                date: editData.date
            });
            toast.success('Reward Created Successfully!');
            setAddRangeOne(0);
            setAddRangeTwo(0);
            setDescription("")
            handleClose()
        } catch (error) {
            toast.error('Error Creating Reward. Try again.');
            console.error('Error Creating Service: ', error);
        } finally {
            setEditDataLoading(false);
        }
    };


    return (
        <div className='w-[668px] h-[389px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[100px] overflow-y-scroll gap-[32px] '>
            <div className='flex items-center justify-between'>
                <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Add Reward</p>
                <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
            </div>
    
            <div className='flex flex-col gap-2'>
                <p className='font-medium text-[#1C1A3C] font-sans text-[14px]'>Number Range</p>
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
                    className='border-[#E1E5F3] p-2 border outline-[#2D84FF] w-full lg:w-[620px] h-[64px] rounded-lg'
                >
                </textarea>
            </div>
    
            <button
                className="bg-[#2D84FF] w-full font-poppins flex items-center rounded-[6px] justify-center mt-[0px] h-[46px] text-base text-center"
                type="submit"
                onClick={submitForm}
            >
                <p className='text-[#fff] text-sm font-poppins font-semibold'>{editDataLoading ? <CgSpinner className=" animate-spin text-lg " /> : 'Complete'}</p>
                
            </button>
    
    
        </div>
      )
}

export default EditReward