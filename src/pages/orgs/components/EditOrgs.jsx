import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate, useLocation } from 'react-router-dom';
import zxcvbn from 'zxcvbn'
import * as Yup from "yup"
import { db } from '../../../firebase-config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const EditOrgs = () => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); 


    const { state } = useLocation()

    console.log(state, "fish")

    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
        fullName: Yup.string().required("Full Name is Required"),
        emailOrPhone: Yup.string().email().required("Email or Phone is required"),
        password: Yup.string().required("Password is required"),
        // checked: Yup.boolean().required("Checkbox is required")
    })

    const submitForm = async (values, action) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'users', state.emailOrPhone);
            
            const updateData = {
                fullName: values.fullName,
                emailOrPhone: values?.emailOrPhone
            };
    
            if (values.password) {
                updateData.password = values.password;
            }
    
            await updateDoc(docRef, updateData);
            toast.success('Account updated successfully!');
            navigate(-1);
        } catch (error) {
            toast.error('Failed to update account. Try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // const submitForm = async (values, action) => {
    //     setLoading(true);
    //     try {
    //             // Update existing document
    //             const docRef = doc(db, 'users', state.emailOrPhone);
    //             const updateData = {
    //                 fullName: values.fullName,
    //                 emailOrPhone: values.emailOrPhone,
    //                 ...state
    //             };
                
    //             if (values.password) {
    //                 updateData.password = values.password;
    //             }

    //             await setDoc(docRef, updateData, { merge: true });
    //             toast.success('Account updated successfully!');
           
    //         navigate(-1); // Navigate back after success
    //     } catch (error) {
    //         toast.error(state ? 'Failed to update account. Try again.' : 'Failed to create account. Try again.');
    //         console.error('Error:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    
    // const submitForm = async (values, action) => {
    //     setLoading(true);
    //     try {
    //         const referrerCode = generateReferrerCode();
    //         await setDoc(doc(db, 'users', values.emailOrPhone), {
    //             ...values,
    //             type: "Organization",
    //             addedBy: adminName,
    //             referrerCode,
    //             checked: true,
    //             createdAt: new Date(),
    //         });
    //         toast.success('Account created successfully!');
    //         action.resetForm()
    //     } catch (error) {
    //         toast.error('Failed to create account. Try again.');
    //         console.error('Error adding document: ', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };



  return (
    <div className='flex flex-col gap-[37px]'>
        <p className='text-[#1C1C1E] font-semibold font-sans text-lg'>Edit Organization</p>
        
        <div>
            <Formik
                initialValues={{
                    fullName: state?.fullName || "",
                    emailOrPhone: state?.emailOrPhone ||  "",
                    password: state?.password || "",
                }}
                    enableReinitialize={true}
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
                        <div className="flex flex-col  w-[520px] gap-6">
                            
                            <div className='flex flex-col  w-full'>
                                <input
                                    name="fullName"
                                    placeholder="Name"
                                    type="text" 
                                    value={values?.fullName}
                                    onChange={handleChange}
                                    className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E5E5EA] p-2 h-[56px] border-solid "
                                />
                                {errors.fullName && touched.fullName ? (
                                <div className="text-RED-_100 text-xs">
                                    {errors.fullName}
                                </div>
                                ) : null}
                            </div>

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
                            
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col w-full'>
                                    <div className='relative'>
                                        <input
                                            name="password"
                                            placeholder="Password"
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

                                <div className={`${values?.password ? "mb-2" : "hidden"}`}>
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
                            </div>
                        

                            <button
                                className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                type="submit"
                                disabled={!isValid}
                            >
                                <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Edit Account'}</p>
                                
                            </button>
                            
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    </div>
  )
}

export default EditOrgs