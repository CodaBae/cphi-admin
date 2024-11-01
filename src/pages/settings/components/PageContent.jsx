import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';
import axios from "axios";
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const PageContent = () => {
    const [loading, setLoading] = useState(false);
    const [imageUploadloading, setImageUploadLoading] = useState(false);
    const [contentData, setContentData] = useState([])

    // Validation schema to limit word count
    const formValidationSchema = Yup.object().shape({
        heading: Yup.string()
            .test("maxWords", "Heading must be 10 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 10 : true;
            })
            .required("Heading is required"),
        sub: Yup.string()
            .test("maxWords", "Sub Text must be 30 words or less", (value) => {
                return value ? value.trim().split(/\s+/).length <= 30 : true;
            })
            .required("Sub Text is required"),
        link: Yup.string().url("Enter a valid URL")
    });

    const handleFileChange = async (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'rztljgso'); // replace with your Cloudinary preset

            setImageUploadLoading(true);
            try {
                const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/dizlp3hvp/upload", formData);
                const data = uploadResponse.data;
                setFieldValue("link", data?.secure_url); 
                toast.success("Image Uploaded Successfully");
            } catch (error) {
                toast.error("Error Uploading Image");
                console.error('Error uploading file:', error);
            } finally {
                setImageUploadLoading(false);
            }
        }
    };

    const getContent = async () => {
        try {
            const contentRef = collection(db, "content")
            const querySnapshot = await getDocs(contentRef);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setContentData(data)
        } catch (err) {
            console.log("Failed to fetch doc", err)
        }
    }

    useEffect(() => {
        getContent()
    }, [])

    console.log(contentData, "contentData")

    const submitForm = async (values, actions) => {
        setLoading(true)
        try {
            
            const contentRef = doc(db, 'content', contentData[0]?.id);

            await updateDoc(contentRef, {
                heading: values?.heading,
                sub: values?.sub,
                img: values?.link
            });
            setLoading(false)
            toast.success('Content updated successfully!');
            actions.resetForm()
        } catch (error) {
            setLoading(false)
            toast.error('Error updating content!');
            console.error('Error updating content:', error);
        }
    };



    return (
        <div className='mt-[40px] flex flex-col'>
            <Formik
                initialValues={{
                    heading: "",
                    sub: "",
                    link: ""
                }}
                validationSchema={formValidationSchema}
                onSubmit={(values, actions) => {
                    window.scrollTo(0, 0);
                    submitForm(values, actions);
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
                    values,
                }) => (
                    <Form onSubmit={handleSubmit} className="flex flex-col w-[320px] lg:w-[520px] gap-6">
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Heading Text</label>
                            <input
                                name="heading"
                                type="text"
                                value={values.heading}
                                onChange={handleChange}
                                className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[40px] border-solid"
                            />
                            {errors.heading && touched.heading && (
                                <div className="text-red-500 text-xs">{errors.heading}</div>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Sub Text</label>
                            <textarea
                                name="sub"
                                type="text"
                                value={values.sub}
                                onChange={handleChange}
                                className="outline-[#2D84FF] bg-[#FFF] text-[#3A3A3C] font-poppins text-base rounded-lg border border-[#E1E5F3] p-2 h-[64px] border-solid"
                            ></textarea>
                            {errors.sub && touched.sub && (
                                <div className="text-red-500 text-xs">{errors.sub}</div>
                            )}
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label className='font-sans text-[#1C1A3C] font-medium text-sm'>Image</label>
                            <div className='lg:w-[502px] h-auto rounded-lg flex p-3 items-center justify-between bg-[#FAFAFA]'>
                                <input 
                                    type='text'
                                    name="link"
                                    onChange={handleChange}
                                    value={values.link}
                                    placeholder='Enter link'
                                    className='font-sans w-full text-sm text-[#0B0B0B] outline-none p-1 bg-[#FAFAFA]'
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                    className="hidden"
                                    id="fileInput"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("fileInput").click()}
                                    className='bg-[#2D84FF] w-[66px] h-[30px] rounded-lg flex items-center text-[#fff] justify-center p-2'
                                >
                                    {imageUploadloading ? <CgSpinner className=" animate-spin text-lg text-[#fff]" /> : 'Upload'}
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
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PageContent;
