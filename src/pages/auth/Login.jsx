import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import * as Yup from "yup"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"

import Lock from "../../assets/svg/lock.svg"
import { loginAdmin } from '../../features/adminLoginSlice';


const Login = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const formValidationSchema = Yup.object().shape({
        emailOrPhone: Yup.string().required("Email or Phone is required"),
        password: Yup.string().required("Password is required"),
    })

    const dispatch = useDispatch()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'; 
        };
    }, []);

    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submitForm = async (values) => {
        setLoading(true)
        const emailOrPhone = values?.emailOrPhone
        const password = values?.password
    
        dispatch(loginAdmin({emailOrPhone, password}))
        .then((res) => {
            console.log(res, "pablo")
            setLoading(false)
            if(res?.type === "login/loginAdmin/fulfilled") {
                navigate("/dashboard")
            } 
        })

    }

    


  return (
    <div className='bg-[#fff] w-full flex flex-col  h-screen'>
       
        <div className='w-full mt-[20px] gap-[18px]  flex flex-col items-center justify-center '>
           
            <div className='flex flex-col gap-1'>
                <p className='text-[#1C1C1E] font-poppins text-[26px] lg:text-[34px] font-bold'>Admin Log In</p>
            </div>
            <div>
                <Formik
                    initialValues={{
                        emailOrPhone: "",
                        password: "",
                        check: false
                    }}
                        validationSchema={formValidationSchema}
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
                                
                                <div style={{
                                    minHeight: "60px"
                                }}>
                                    <div className='flex flex-col w-full'>
                                        <div className='relative'>
                                            <input
                                                name="password"
                                                placeholder="Password"
                                                type={showPassword ? "text" : "password"} 
                                                value={values?.password}
                                                onChange={(e) => {
                                                    handleChange(e)
                                                    
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
                              
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-1.5 items-center'>
                                    <input 
                                        type="checkbox"
                                        value={values.check}
                                        onChange={handleChange}
                                        className="custom-checkbox" 
                                    />
                                        <p className='text-[#1C1C1E] font-poppins text-sm'>Stay signed in</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <img src={Lock} alt='Lock' className='w-6 h-6' />
                                        <p onClick={() => navigate('/reset-password')} className="text-[#2D84FF] font-poppins text-xs mt-1.5 font-semibold cursor-pointer">Forgot Password?</p>
                                    </div>
                                </div>
                                
                                <button
                                    className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Sign In'}</p>
                                    
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

export default Login