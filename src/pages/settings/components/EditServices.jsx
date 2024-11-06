import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { CgSpinner } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai'
import * as Yup from "yup"
import { db } from '../../../firebase-config';
import { updateDoc, doc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';


const EditServices = ({ handleClose, setEditDataLoading, editDataLoading, editData }) => {

    console.log(editData, "editData")

    const formValidationSchema = Yup.object().shape({
        title: Yup.string()
            .test("maxWords", "Title must be 6 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 6 : true;
            })
            .required("Title is required"),
        description: Yup.string()
            .test("maxWords", "Description must be 20 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 20 : true;
            })
            .required("Description Text is required"),
        color: Yup.string()
            .matches(/^#([A-Fa-f0-9]{6})$/, "Color must be a valid hex code")
            .required("Color is required"),
    });

    const submitForm = async (values, action) => {
        setEditDataLoading(true)
        try {
            
            const servicesRef = doc(db, 'services', editData.id);

            await updateDoc(servicesRef, {
                title: values?.title || editData?.title,
                description: values?.description || editData?.description,
                color: values?.color || editData?.color,
            });
            setEditDataLoading(false)
            toast.success('Services updated successfully!');
            action.resetForm()
            handleClose()
        } catch (error) {
            setEditDataLoading(false)
            toast.error('Error updating Services!');
            handleClose()
            console.error('Error updating status:', error);
        }
    };

  return (
    <div className='w-[668px] h-[549px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[50px]  gap-[32px] '>
        <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Edit Services</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div className=' flex flex-col'>
            <div>
                <Formik
                    initialValues={{
                        title: editData?.title || "",
                        description: editData?.description || "",
                        color: editData?.color || "",
                    }}
                        validationSchema={formValidationSchema}
                        enableReintialize={true}
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
                                    <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Title</label>
                                    <input
                                        name="title"
                                        placeholder=""
                                        type="text" 
                                        value={values?.title}
                                        onChange={handleChange}
                                        className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                    />
                                    {errors.title && touched.title ? (
                                    <div className="text-RED-_100 text-xs">
                                        {errors.title}
                                    </div>
                                    ) : null}
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Description</label>
                                    <textarea
                                        name="description"
                                        placeholder=""
                                        type="text" 
                                        value={values?.description}
                                        onChange={handleChange}
                                        className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[119px] border-solid "
                                    ></textarea>
                                    {errors.description && touched.description ? (
                                    <div className="text-RED-_100 text-xs">
                                        {errors.description}
                                    </div>
                                    ) : null}
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Choose Color</label>
                                    <input
                                        type="color"
                                        name="color"
                                        value={values.color}
                                        
                                        onChange={(e) => setFieldValue("color", e.target.value)}
                                        className="h-[40px] cursor-pointer"
                                        // pattern="^#([A-Fa-f0-9]{6})$" // Ensures the input is a valid hex code
                                        // title="Please enter a valid hex color code (e.g., #000000)"
                                    />
                                    {errors.color && touched.color && (
                                        <div className="text-red-500 text-xs">{errors.color}</div>
                                    )}
                                </div>     

                                <button
                                    className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    <p className='text-[#fff] text-sm font-poppins font-semibold'>{editDataLoading ? <CgSpinner className=" animate-spin text-lg " /> : 'Complete'}</p>
                                    
                                </button>
                                
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </div>
  )
}

export default EditServices