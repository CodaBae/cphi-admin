import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik';
import { CgSpinner } from 'react-icons/cg';
import * as Yup from "yup"
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const formValidationSchema = Yup.object().shape({
        email: Yup.string().email().required("Email is required"),
      
    })

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'; // reset on unmount
        };
    }, []);

    const navigate = useNavigate()


    const submitForm = () => {

    }

  return (
    <div className='bg-[#fff] w-full flex flex-col  h-screen'>
       
        <div className='w-full mt-[20px] gap-[18px]  flex flex-col items-center justify-center '>
           
            <div className='flex flex-col gap-1'>
                <p className='text-[#1C1C1E] font-poppins text-[26px] lg:text-[34px] font-bold'>Reset Password</p>
            </div>
            <div>
                <Formik
                    initialValues={{
                        emailOrPhone: "",
                        
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
                        <Form onSubmit={handleSubmit} className="flex justify-center ">
                            <div className="flex flex-col w-[320px] lg:w-[520px] gap-6">

                                <div className='flex flex-col w-full'>
                                    <input
                                        name="emailOrPhone"
                                        placeholder="Your Email Or Phone Number"
                                        type="text" 
                                        value={values?.emailOrPhone}
                                        onChange={handleChange}
                                        className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E5E5EA] p-2 h-[56px] border-solid "
                                    />
                                    {errors.emailOrPhone && touched.emailOrPhone ? (
                                    <div className="text-RED-_100 text-xs">
                                        {errors.emailOrPhone}
                                    </div>
                                    ) : null}
                                </div>  
                                
                                <button
                                    className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Change Password'}</p>
                                    
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

export default ChangePassword