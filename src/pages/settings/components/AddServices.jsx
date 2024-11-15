import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { CgSpinner } from 'react-icons/cg';
import { AiOutlineClose } from 'react-icons/ai'
import * as Yup from "yup"
import { db } from '../../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AddServices = ({ handleClose, setLoading,  loading}) => {

    const formValidationSchema = Yup.object().shape({
        heading: Yup.string()
            .test("maxWords", "Heading must be 6 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 6 : true;
            })
            .required("Heading is required"),
        description: Yup.string()
            .test("maxWords", "Sub Text must be 20 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 20 : true;
            })
            .required("description is required"),
        color: Yup.string()
            .matches(/^#([A-Fa-f0-9]{6})$/, "Color must be a valid hex code")
            .required("Color is required"),
    });

    const submitForm = async (values, action) => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'services'), {
                title: values?.heading,
                description: values?.description,
                color: values?.color,
            });
            toast.success('Service Created Successfully!');
            action.resetForm()
        } catch (error) {
            toast.error('Error Creating Service. Try again.');
            console.error('Error Creating Service: ', error);
        } finally {
            setLoading(false);
            handleClose()
        }
    };

  return (
    <div className='w-[668px] h-[549px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[50px]  gap-[32px] '>
         <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Add Services</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div className=' flex flex-col'>
            <div>
                <Formik
                    initialValues={{
                        heading: "",
                        description: "",
                        color: "#000000",
                    }}
                        validationSchema={formValidationSchema}
                        onSubmit={(values, action) => {
                        window.scrollTo(0, 0);
                     
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
                                    <label className='font-sans text-[#1C1A3C] font-medium text-sm'>title</label>
                                    <input
                                        name="heading"
                                        placeholder=""
                                        type="text" 
                                        value={values?.heading}
                                        onChange={handleChange}
                                        className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                    />
                                    {errors.heading && touched.heading ? (
                                    <div className="text-RED-_100 text-xs">
                                        {errors.heading}
                                    </div>
                                    ) : null}
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Services</label>
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
                                        placeholder="#000000"
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
                                    className={`${values.color && isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Complete'}</p>
                                    
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

export default AddServices