import React, { useEffect, useRef, useState } from 'react'
import { BiSolidCopy } from 'react-icons/bi'
import { QRCodeCanvas } from 'qrcode.react';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { CiFilter } from 'react-icons/ci'
import { TbDownload } from 'react-icons/tb'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoEyeOutline } from 'react-icons/io5'

import QrCode from "../assets/png/qr_code.png"
import Logo from "../assets/svg/logo_small.svg"
import Activity from "../assets/svg/activity.svg"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { CgSpinner } from 'react-icons/cg';


const ReferralDetails = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [referralsPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [referrals, setReferrals] = useState([])
    const [loading, setLoading] = useState(false)
    

    const qrRef = useRef();
    

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(`Get free medical care using my referral code: ${text}`);
        alert('Copied to clipboard');
    };

    const navigate = useNavigate()

    const location = useLocation()
    const userDetails = location.state

   
    const referrerUrl = `https://refer.ching.org/ref/${userDetails.referrerCode || ''}`;  //`https://refer.cphinigeria.org/ref/${userDetails.referrerCode || ''}`; 

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "QRCode.png";
        link.click();
    };


    const referrerCode = userDetails?.referrerCode
    const getReferrals = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(db, 'referrals'),
                where('referrerCode', '==', referrerCode)
            );
            
            const querySnapshot = await getDocs(q);
            
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            //querySnapshot.docs.map(doc => doc.data());

            
            setReferrals(userData);
            
        } catch (err) {
            console.error("Error fetching user details:", err);
        } finally {
            setLoading(false)
        }
    };
    
    

    useEffect(() => {
        if (referrerCode) {
            getReferrals();
        }
    }, [referrerCode]);


    const filteredReferrals = referrals?.filter((item) => (
        item.profile.fullName.toLowerCase().includes(search.toLowerCase()) || 
        item.profile.emailOrphone.toLowerCase().includes(search.toLowerCase())
    ))

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(referrals?.length / referralsPerPage));
    }, [referralsPerPage]);

     // Calculate indices for paginated data
     const indexOfLastReferral = currentPage * referralsPerPage;
     const indexOfFirstReferral = indexOfLastReferral - referralsPerPage;
     const currentReferrals = filteredReferrals?.slice(indexOfFirstReferral, indexOfLastReferral);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(referrals?.length / referralsPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
     const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };



  return (
    <div className='w-full mt-[10px]'>
        <div className='flex items-center flex-col lg:flex-row gap-[10px]'>
            <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center cursor-pointer justify-between' onClick={() => copyToClipboard(referrerUrl)}>
                    <p className='font-sans text-sm text-[#424242]'>{referrerUrl}</p>
                    <BiSolidCopy className='text-[#2D84FF] w-5 h-5' />
                </div>
             
                <div className='flex flex-col mt-3 items-center gap-2'>
                    <div className='flex items-start gap-2' ref={qrRef}>
                        <QRCodeCanvas value={referrerUrl} size={61} bgColor={"#ffffff"} fgColor={"#000000"} />
                        <TbDownload className='w-4 h-4 text-[#2D84FF] cursor-pointer' onClick={downloadQRCode}/>
                    </div>
                    <img src={Logo} alt='Logo' className='w-[190px] h-[39px]' />
                </div>
                 
            </div>
            <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Referrals</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{referrals?.length}</p>
                </div>
            </div>
        </div>

        <div className='w-full mt-10'>
            <div className='flex items-center justify-between flex-col lg:flex-row px-5'>
                <p className='font-sans text-[18px] font-medium text-[#1C1C1E]'>Referrals</p>
                <div className='flex items-center flex-col lg:flex-row gap-3'>
                    <input 
                        className='w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                        type='text'
                        placeholder='Search...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 cursor-pointer rounded-lg flex items-center p-3'>
                        <CiFilter className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Status</p>
                    </div>
                    <div className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 cursor-pointer rounded-lg flex items-center p-3'>
                        <TbDownload className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
                    </div>
                   
                    
                </div>
            </div>

            <div className='mt-5 p-5 w-full overflow-x-auto'>
                <table>
                    <thead>
                        <tr className='w-full border rounded-t-xl border-[#F0F1F3] '>
                            
                            <th className='w-[243px] h-[18px] text-sm text-left font-sans text-[#333843] p-4 font-medium '>
                                ID
                            </th>
                            <th className='w-[247px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                                <div className='flex items-center gap-1'>
                                    <p className='text-sm text-[#333843] font-sans'>Date</p>
                                    <IoIosArrowDown className="text-[#667085] text-base" />
                                </div>
                            </th>
                            <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Name</p>
                            </th>
                            <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Email/Phone</p>
                            </th>
                            <th className='w-[157px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Status</p>
                            </th>
                             <th className='w-[169px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        { loading ? 
                            <tr className='h-[300px] bg-white border-t border-grey-100'>
                                <td colSpan="8" className="relative">
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <CgSpinner className='animate-spin text-[#2D84FF] text-[200px]' /> 
                                    </div>
                                </td>
                            </tr>
                           :
                            currentReferrals?.length > 0 ?
                            currentReferrals?.map((item, index) => {
                                    console.log(item, "lamba")
                                return (
                                <tr key={index} className='w-full mt-[18px] border border-[#F0F1F3]' >
                                    
                                    <td className='w-[143px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-semibold text-sm'>{`#${index + 1}`}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm'>{item?.date}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.profile?.fullName}</p>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-normal text-sm '>{item?.profile?.emailOrphone}</p>
                                        
                                    </td>
                                    
                                    <td className='w-[167px] h-[56px] text-left font-euclid text-[#667085] p-4 font-medium '>
                                        <div className={`${item?.status === "Completed" ? "bg-[#E7F4EE]" : item?.status === "No Show" ? "bg-[#FEE5EC]" : "bg-[#FDF1E8]"} w-[95px] p-1 h-auto rounded-xl`}>
                                            <p className={`${item?.status === "Completed" ? "text-[#0D894F]" : item?.status === "No Show" ? "text-[#F4003D]" : "text-[#E46A11]"} font-sans font-semibold text-center text-sm`}>{item?.status}</p>
                                        </div>
                                    </td>
                                    
                                    <td className='w-[169px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <div className='flex items-center gap-[10px]  cursor-pointer' onClick={() => navigate("/client/details", {state: item})}>
                                            <IoEyeOutline className="text-[17px] text-[#667085]" />
                                        </div>
                                    </td>
            
                                </tr>
            
                            )}) :  (
                                <tr className='h-[300px] bg-white border-t border-grey-100'>
                                    <td colSpan="8" className="relative">
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Referral Available</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
    
            <div className='w-full flex flex-col sm:flex-row items-center justify-between p-5'>
                <div className='bg-[#FAFAFE] w-full sm:w-[136px] h-[40px] flex items-center justify-center'>
                    <p className='font-sans text-[#667085] text-base'>Page {currentPage} of {totalPages}</p>
                </div>
                <div className='flex h-[34px] justify-center gap-2 items-center mt-4 sm:mt-0'>
                    <div onClick={() => handlePrevPage()} className={`bg-[#FAFAFE] w-8 h-8 flex justify-center items-center cursor-pointer ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}>
                        <IoIosArrowBack className='text-[#667085]' />
                    </div>
                    {[...Array(totalPages)].map((_, index) => (
                        <div key={index} onClick={() => setCurrentPage(index + 1)} className={`flex justify-center items-center w-8 h-8 cursor-pointer ${currentPage === index + 1 ? 'bg-[#FAFAFE] text-[#000]' : 'hover:bg-[#FAFAFE]'}`}>
                            {index + 1}
                        </div>
                    ))}
                    <div onClick={() => handleNextPage()} className={`bg-[#FAFAFE] w-8 h-8 flex justify-center items-center cursor-pointer ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}>
                        <IoIosArrowForward className='text-[#667085]' />
                    </div>
                </div>
            </div>

        </div>
    
    </div>
  )
}

export default ReferralDetails