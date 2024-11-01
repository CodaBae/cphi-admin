import React, { useState } from 'react'
import { Form, Formik } from 'formik';
import { AiOutlineClose } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { toast } from 'react-toastify';

const StatusUpdate = ({ handleClose, clientData, updateLoadingB, setUpdateLoadingB }) => {


    const submitForm = async (values) => {
        setUpdateLoadingB(true)
        try {
            
            const appointmentRef = doc(db, 'referrals', clientData.id);

            await updateDoc(appointmentRef, {
                status: 'Completed',
                docName: values?.fullName,
                docSummary: values?.summary,
                hivStatus: values?.hivStatus
            });
            setUpdateLoadingB(false)
            toast.success('Status updated successfully!');
            handleClose()
        } catch (error) {
            setUpdateLoadingB(false)
            toast.error('Error updating status!');
            handleClose()
            console.error('Error updating status:', error);
        }
    };

  return (
    <div className='w-[668px] h-[481px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[100px]  gap-[32px]'>
        <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Doctor Info</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div>
            <Formik
                initialValues={{
                    fullName: "",
                    summary: "",
                    hivStatus: ""
                }}
                    // validationSchema={formValidationSchema}
                    onSubmit={(values, action) => {
                    window.scrollTo(0, 0);
                    console.log(values, "market")
                    submitForm(values, action);
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    dirty,
                    isValid,
                    setFieldValue,
                    errors,
                    touched,
                    // setFieldTouched,
                    values,
                }) => (
                    <Form onSubmit={handleSubmit} className="flex  ">
                        <div className="flex flex-col  w-full gap-6">
                            
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Full Name</label>
                                <input
                                    name="fullName"
                                    placeholder=""
                                    type="text" 
                                    value={values?.fullName}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                />
                                {errors.fullName && touched.fullName ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.fullName}
                                </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Consultation Summary</label>
                                <textarea
                                    name="summary"
                                    placeholder=""
                                    type="text" 
                                    value={values?.summary}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[64px] border-solid "
                                ></textarea>
                                {errors.summary && touched.summary ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.summary}
                                </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>HIV Status</label>
                                <select name='hivStatus' onChange={handleChange} className='border border-[#E1E5F3] text-[#3A3A3C] font-poppins text-base p-2 border-solid outline-[#2D84FF] rounded-lg' value={values?.hivStatus}>
                                    <option value="">Select Status</option>
                                    <option value="Positive">Positive</option>
                                    <option value="Negative">Negative</option>
                                    <option value="Unconfirmed">Unconfirmed</option>
                                </select>
                            </div>                            
                                                    

                            <button
                                className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                type="submit"
                                disabled={!isValid}
                            >
                                <p className='text-[#fff] text-sm font-poppins font-semibold'>{updateLoadingB ? <CgSpinner className=" animate-spin text-lg " /> : 'Complete'}</p>
                                
                            </button>
                            
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    </div>
  )
}

export default StatusUpdate