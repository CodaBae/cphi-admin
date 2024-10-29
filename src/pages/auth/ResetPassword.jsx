import React, { useEffect, useState } from 'react'
import { Form, Formik } from "formik"
import zxcvbn from 'zxcvbn'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup"

import { toast } from 'react-toastify'

import { CgSpinner } from 'react-icons/cg'


const ResetPassword = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); 
  
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'; // reset on unmount
        };
    }, []); 
    

    
    const calculatePasswordStrength = (password) => {
        const strength = zxcvbn(password);
        setPasswordStrength(strength.score);
    }

    const formValidationSchema = Yup.object().shape({
        otp: Yup.number().required("Otp is Required"),
        password: Yup.string().required("Password is required"),
    })

    
    const submitForm = (values) => {
       
    }


  return (
    <div className='bg-[#fff] w-full flex flex-col  h-screen'>
       
        <div className='w-full  mt-[20px] gap-[56px]  flex flex-col items-center justify-center '>
           
            <div className='flex flex-col items-center gap-1'>
                <p className='text-[#1C1C1E] font-poppins text-[26px] lg:text-[34px] font-bold'>Reset Password</p>
                <p className='font-sans text-sm text-[#1C1C1E]'>An email containing a 5 digit OTP Code has been sent to your email</p>
            </div>
            <div>
                <Formik
                    initialValues={{
                        otp: "",
                        password: "",
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
                        <Form onSubmit={handleSubmit} className="flex justify-center ">
                            <div className="flex flex-col  w-[520px] gap-6">

                                
                                <div className='flex flex-col  w-full'>
                                    <input
                                        name="otp"
                                        placeholder="OTP"
                                        type="number" 
                                        value={values?.otp}
                                        onChange={handleChange}
                                        className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E5E5EA] p-2 h-[56px] border-solid "
                                    />
                                    {errors.otp && touched.otp ? (
                                    <div className="text-RED-_100 text-xs">
                                        {errors.otp}
                                    </div>
                                    ) : null}
                                </div>

                                
                                <div style={{
                                    minHeight: "60px"
                                }}>
                                    <div className='flex flex-col w-full'>
                                        <div className='relative'>
                                            <input
                                                name="password"
                                                placeholder="New Password"
                                                type={showPassword ? "text" : "password"} 
                                                value={values?.password}
                                                onChange={(e) => {
                                                    handleChange(e)
                                                    calculatePasswordStrength(e.target.value);  
                                                }}
                                                className="outline-[#2D84FF] bg-[#FFF] w-full text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E5E5EA] p-2 h-[56px] border-solid "
                                            />
                                                {showPassword ? (
                                                    <BsEyeSlash
                                                        className=" absolute top-[18px] right-4 text-[22px] lg:right-3 cursor-pointer text-[#AEAEB2]"
                                                        onClick={togglePasswordVisibility}
                                                    />
                                                    ) : (
                                                    <BsEye
                                                        className=" absolute top-[18px] text-[22px] right-4 lg:right-3 cursor-pointer text-[#AEAEB2]"
                                                        onClick={togglePasswordVisibility}
                                                    />
                                                )}
                                        </div>
                                        {errors?.password || touched?.password ? (
                                        <div className="text-RED-_100 text-xs">
                                            {errors?.password}
                                        </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={`${values?.password ? "my-2" : "hidden"}`}>
                                    <p className={`text-sm  font-poppins ${passwordStrength === 0 ? 'text-red-500' : passwordStrength === 1 ? 'text-orange-500' : passwordStrength === 2 ? 'text-yellow-500' : passwordStrength === 3 ? 'text-green-400' : 'text-green-600'}`}>
                                        {passwordStrength === 0 && "Password Strength: Weak"}
                                        {passwordStrength === 1 && "Password Strength: Fair"}
                                        {passwordStrength === 2 && "Password Strength: Good"}
                                        {passwordStrength === 3 && "Password Strength: Strong"}
                                        {passwordStrength === 4 && "Password Strength: Very Strong"}
                                    </p>
                                    <div className="w-full h-2 bg-[#E5E5EA] rounded-lg">
                                        <div
                                            className={`h-full rounded-lg ${passwordStrength === 0 ? 'bg-[#f00]' : passwordStrength === 1 ? 'bg-[#0ff]' : passwordStrength === 2 ? 'bg-[#ff0]' : passwordStrength === 3 ? 'bg-[#34C759CC]' : 'bg-[#34C759CC]'}`}
                                            style={{ width: `${(passwordStrength + 1) * 20}%` }} 
                                        />
                                    </div>
                                
                                </div>
                            
                                
                               

                                <button
                                    className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Reset Password'}</p>
                                    
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

export default ResetPassword