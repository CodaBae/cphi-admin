import React, { useState } from 'react'
import { Formik, Form } from 'formik';
import { AiOutlineClose } from 'react-icons/ai'
import { CgSpinner } from 'react-icons/cg';
import { Listbox } from '@headlessui/react'
import { IoIosArrowDown } from 'react-icons/io'
import { db } from '../../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';


const types = ["Select Type", "Admin", "Super Admin"];

const AddAdmin = ({ handleClose }) => {
    const [loading, setLoading] = useState(false)
    const [selectedType, setSelectedType] = useState(types[0])



    const generateReferrerCode = () => {
        return Math.random().toString(36).substring(2, 10).toUpperCase(); // 8-character code
    };

    
    const submitForm = async (values, action) => {
        setLoading(true);
        try {
            const referrerCode = generateReferrerCode();
            await addDoc(collection(db, 'admins'), {
                fullName: values?.name,
                email: values?.email,
                password: values?.password,
                userType: values?.type,
                referrerCode: referrerCode,
                date: new Date().toLocaleDateString()
            });
            toast.success('Admin Added successfully!');
            action.resetForm()
            handleClose()
        } catch (error) {
            toast.error('Failed to Add Admin. Try again.');
            console.error('Error adding document: ', error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='w-[668px] h-[559px] rounded-lg bg-[#fff] flex flex-col p-6 mt-[50px]  gap-[32px] '>
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

                            
                            <div className='flex flex-col gap-1'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Admin Type</label>
                                <Listbox 
                                    value={selectedType} 
                                    onChange={(value) => {
                                        setSelectedType(value);
                                        setFieldValue("type", value);
                                    }}
                                >
                                    <div className="relative mt-1">
                                        <Listbox.Button className="w-full h-[51px] font-mulish text-[#424242] cursor-pointer hover:border-[#2D84FF] border border-[#E5E5EA] rounded-md bg-[#FFF] px-4 py-2 text-left">
                                            <div className='flex items-center justify-between'>
                                                <p className='font-mulish text-[#424242] text-base'>{selectedType}</p>
                                                <IoIosArrowDown
                                                    className="h-5 w-5 text-[#2D84FF]"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute mt-1 w-full rounded-md bg-[#fff] z-20 shadow-lg">
                                            {types.map((type) => (
                                                <Listbox.Option
                                                    key={type}
                                                    value={type}
                                                    className={({ active }) =>
                                                    `cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : ''}`
                                                    }
                                                >
                                                    {type}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>
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