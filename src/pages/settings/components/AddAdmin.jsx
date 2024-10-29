import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { AiOutlineClose } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg';

const AddAdmin = ({ handleClose }) => {
    const[loading, setLoading] = useState(false)

  return (
    <div className='w-[668px] h-[539px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[50px]  gap-[32px] '>
        <div className='flex items-center justify-between'>
            <p className='font-semibold text-[#1C1C1E] font-sans text-[18px]'>Add Admin</p>
            <AiOutlineClose className='text-[#817F9B] cursor-pointer text-[24px]' onClick={handleClose} />
        </div>

        <div>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    type: "",
                    password: ""
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
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Name</label>
                                <input
                                    name="name"
                                    placeholder=""
                                    type="text" 
                                    value={values?.name}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                />
                                {errors.name && touched.name ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.name}
                                </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Email</label>
                                <input
                                    name="email"
                                    placeholder=""
                                    type="text" 
                                    value={values?.email}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                />
                                {errors.email && touched.email ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.email}
                                </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Type</label>
                                <input
                                    name="type"
                                    placeholder=""
                                    type="text" 
                                    value={values?.type}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                />
                                {errors.type && touched.type ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.type}
                                </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Password</label>
                                <input
                                    name="password"
                                    placeholder=""
                                    type="text" 
                                    value={values?.password}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid "
                                />
                                {errors.password && touched.password ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.password}
                                </div>
                                ) : null}
                            </div>

                            
                                                    

                            <button
                                className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
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
  )
}

export default AddAdmin