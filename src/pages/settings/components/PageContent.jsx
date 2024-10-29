import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { CgSpinner } from 'react-icons/cg';

const PageContent = () => {
    const [loading, setLoading] = useState(false)

    const submitForm = () => {

    }

  return (
    <div className='mt-[40px] flex flex-col'>
        <div>
            <Formik
                initialValues={{
                    heading: "",
                    sub: "",
                    link: ""
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
                        <div className="flex flex-col  w-[520px] gap-6">
                            
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Heading Text</label>
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
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Sub Text</label>
                                <input
                                    name="sub"
                                    placeholder=""
                                    type="text" 
                                    value={values?.sub}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[64px] border-solid "
                                />
                                {errors.sub && touched.sub ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.sub}
                                </div>
                                ) : null}
                            </div>
                            
                            <div className='flex flex-col gap-1'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Image</label>
                                <div className='w-[502px] h-auto rounded-lg flex p-3 items-center justify-between bg-[#FAFAFA]'>
                                    <input 
                                        type='text'
                                        className='font-sans w-full text-sm text-[#0B0B0B] outline-none p-1 bg-[#FAFAFA]'
                                        placeholder='Enter link'
                                        onChange={handleChange}
                                        value={values.link}
                                    />
                                    <button
                                        className='bg-[#2D84FF] w-[66px] h-[30px] rounded-lg flex items-center justify-center p-2'
                                    >
                                        <p className='text-[#fff] font-inter text-xs font-semibold'>Upload</p>
                                    </button>
                                </div>
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

export default PageContent