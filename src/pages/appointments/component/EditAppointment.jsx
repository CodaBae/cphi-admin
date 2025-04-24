import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from "yup"

import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Listbox } from '@headlessui/react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoIosArrowDown } from 'react-icons/io';

import { db } from '../../../firebase-config';

import { lagosLGAs, riversStateLGAs } from './Lgas';


const locations = ["Select Location", "Lagos", "Port Harcourt"];
const sexOptions = ["", "Male", "Female"]

const EditAppointment = () => {
    const { state } = useLocation()

    // Parse initial date/time from state
    const parseInitialDate = () => {
        if (!state?.date) return null
        const [day, month, year] = state.date.split('/')
        return new Date(year, month - 1, day) // Months are 0-indexed
    }

    const parseInitialTime = () => {
        if (!state?.time) return null
        const [hours, minutes] = state.time.split(':')
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        return date
    }

    const [loading, setLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(state?.location || locations[0]);
    const [selectedSex, setSelectedSex] = useState(state?.sex || sexOptions[0]);
    const [localGovernments, setLocalGovernments] = useState([]);
    const [selectedLg, setSelectedLg] = useState(state?.lg || "");
    const [selectedDate, setSelectedDate] = useState(parseInitialDate)
    const [selectedTime, setSelectedTime] = useState(parseInitialTime)


    const navigate = useNavigate()

    console.log(state, "MILK")

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'; // reset on unmount
        };
    }, []); 

      // Update local governments list based on selected location
    useEffect(() => {
        if (selectedLocation === "Lagos") {
        setLocalGovernments(lagosLGAs);
        } else if (selectedLocation === "Port Harcourt") {
        setLocalGovernments(riversStateLGAs);
        } else {
        setLocalGovernments([]);
        }
        setSelectedLg(""); // Reset LG when location changes
    }, [selectedLocation])

    // const formValidationSchema = Yup.object().shape({
    //     fullName: Yup.string().required("Full Name is Required"),
    //     emailOrPhone: Yup.string().email().required("Email or Phone is required"),
    // })

    const submitForm = async (values) => {
        setLoading(true);
        try {
            const docRef = doc(db, 'referrals', state.id);
            // Update nested fields using dot notation
            await updateDoc(docRef, {
                'profile.fullName': values.fullName || state.profile.fullName,
                'profile.emailOrphone': values.emailOrPhone || state.profile.emailOrphone, // Note lowercase 'p'
                'hivStatus': values.hivStatus || state.hivStatus,
                sex: selectedSex || state.sex,
                location: selectedLocation || state.location,
                address: selectedLocation === "Lagos" ? "1 Akintunde Cl, off Andoyi Street, Onike, Lagos 100001, Lagos, Nigeria" : "15 Omerelu Street, New GRA, Port Harcourt 500272, Rivers, Nigeria" || state.address,
                date: new Date(values?.date).toLocaleDateString() || state?.date,
                time: new Date(values?.time).toLocaleTimeString() || state?.time,
            });
            toast.success('Appointment updated successfully!');
            navigate(-1); // Optional: Navigate back after update
        } catch (error) {
            toast.error('Failed to update appointment. Try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className='flex flex-col gap-[37px]'>
        <p className='text-[#1C1C1E] font-semibold font-sans text-lg'>Edit Appointment</p>
        
        <div>
            <Formik
                initialValues={{
                    fullName: state?.profile?.fullName || "",
                    emailOrPhone: state?.profile?.emailOrphone ||  "",
                    hivStatus: state?.hivStatus || "",
                    location: state?.location || selectedLocation, 
                    date: state?.date || dateselectedDate, 
                    sex: state?.sex || selectedSex, 
                    time: state?.time || selectedTime
                }}
                    enableReinitialize={true}
                    // validationSchema={formValidationSchema}
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
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Full Name</label>
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
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Email Or Phone</label>
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

                            <div className="mb-4">
                                <label className="block text-base font-mulish font-semibold text-[#333333]">
                                    Location <span className="text-RED-_100">*</span>
                                </label>
                                <Listbox 
                                    value={selectedLocation} 
                                    onChange={(value) => {
                                    setSelectedLocation(value);
                                    setFieldValue("location", value);
                                    }}
                                >
                                    <div className="relative mt-1">
                                    <Listbox.Button className="w-full h-[51px] font-mulish text-[#424242] cursor-pointer rounded-md bg-[#F2F2F2] px-4 py-2 text-left">
                                        <div className='flex items-center justify-between'>
                                            <p className='font-mulish text-[#424242] text-base'>{selectedLocation}</p>
                                            <IoIosArrowDown
                                                className="h-5 w-5 text-[#2D84FF]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-[#fff] z-20 shadow-lg">
                                        {locations.map((location) => (
                                        <Listbox.Option
                                            key={location}
                                            value={location}
                                            className={({ active }) =>
                                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : ''}`
                                            }
                                        >
                                            {location}
                                        </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                    </div>
                                </Listbox>
                            </div>

                            <div className="mb-4">
                                <label className="block text-base font-mulish font-semibold text-[#333333]">
                                    Local Government <span className="text-RED-_100">*</span>
                                </label>
                                <Listbox 
                                    value={selectedLg} 
                                    onChange={(value) => {
                                        setSelectedLg(value);
                                        setFieldValue("lg", value);
                                    }}
                                    disabled={!selectedLocation || selectedLocation === "Select Location"}
                                >
                                    <div className="relative mt-1">
                                    <Listbox.Button className="w-full h-[51px] font-mulish text-[#424242] cursor-pointer rounded-md bg-[#F2F2F2] px-4 py-2 text-left">
                                        <div className='flex items-center justify-between'>
                                            <p className='font-mulish text-[#424242] text-base'>{selectedLg || "Select Local Government"}</p>
                                            <IoIosArrowDown
                                                className="h-5 w-5 text-[#2D84FF]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-[#fff] z-20 shadow-lg">
                                        {localGovernments.map((lg) => (
                                        <Listbox.Option
                                            key={lg}
                                            value={lg}
                                            className={({ active }) =>
                                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : ''}`
                                            }
                                        >
                                            {lg}
                                        </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                    </div>
                                </Listbox>
                            </div>
            
                            <div className="mb-4">
                                <label className="block text-base font-mulish font-semibold text-[#333333]">
                                    Sex <span className="text-RED-_100">*</span>
                                </label>
                                <Listbox 
                                    value={selectedSex} 
                                    onChange={(value) => {
                                    setSelectedSex(value);
                                    setFieldValue("sex", value);
                                    }}
                                >
                                    <div className="relative mt-1">
                                    <Listbox.Button className="w-full h-[51px] font-mulish text-[#424242] cursor-pointer rounded-md bg-[#F2F2F2] px-4 py-2 text-left">
                                        <div className='flex items-center justify-between'>
                                            <p className='font-mulish text-[#424242] text-base'>{selectedSex || "Select Sex"}</p>
                                            <IoIosArrowDown
                                                className="h-5 w-5 text-[#2D84FF]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-[#fff] z-20 shadow-lg">
                                        {sexOptions.map((gen) => (
                                        <Listbox.Option
                                            key={gen}
                                            value={gen}
                                            className={({ active }) =>
                                            `cursor-pointer select-none px-4 py-2 ${active ? 'bg-blue-100' : ''}`
                                            }
                                        >
                                            {gen}
                                        </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                    </div>
                                </Listbox>
                            </div>

                            <div className="mb-4 mt-[43px]">
                                <label className="block text-base font-mulish font-semibold text-[#333333]">
                                    Select Appointment Time <span className="text-RED-_100">*</span>
                                </label>
                                <div className="flex items-center space-x-4 mt-2 bg-[#F2F2F2] rounded-md p-2 h-[51px]">
                        
                                    <div className="flex items-center space-x-2 ">
                                    <FiCalendar className="text-gray-600" />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                        setSelectedDate(date);
                                        setFieldValue("date", date);
                                        }}
                                        dateFormat="EEE MM/dd"
                                        placeholderText="Select Date"
                                        className="bg-[#F2F2F2] font-roboto text-[#333333] w-10/12 lg:w-full outline-none"
                                    />
                                    </div>

                            
                                    <span className="text-gray-400">|</span>

                            
                                    <div className="flex items-center space-x-2">
                                    <FiClock className="text-gray-600" />
                                    <DatePicker
                                        selected={selectedTime}
                                        onChange={(time) => {
                                        setSelectedTime(time);
                                        setFieldValue("time", time);
                                        }}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Time"
                                        dateFormat="HH:mm"
                                        placeholderText="Select Time"
                                        className="bg-[#F2F2F2] font-roboto text-[#333333] w-10/12 lg:w-full outline-none"
                                    />
                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-sans text-[#1C1A3C] font-medium text-sm'>HIV Status</label>
                                <select name='hivStatus'   onChange={handleChange} className='border border-[#E1E5F3] text-[#3A3A3C] font-poppins text-base p-2 border-solid outline-[#2D84FF] rounded-lg' value={values?.hivStatus}>
                                    <option value="">Select Status</option>
                                    <option value="Positive">Positive</option>
                                    <option value="Negative">Negative</option>
                                    <option value="Unconfirmed">Unconfirmed</option>
                                    <option value="Confirmed">Confirmed</option>
                                </select>
                            </div> 
                        
                        

                            <button
                                className={`${isValid ? "bg-[#2D84FF]" : "bg-[#BABABA]"} w-full font-poppins flex items-center rounded-[6px] justify-center mt-[32px] h-[46px] text-base text-center`}
                                type="submit"
                                disabled={!isValid}
                            >
                                <p className='text-[#fff] text-sm font-poppins font-semibold'>{loading ? <CgSpinner className=" animate-spin text-lg " /> : 'Edit Appointment'}</p>
                                
                            </button>
                            
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    </div>
  )
}

export default EditAppointment