import React, { useEffect, useRef, useState } from 'react'
import { BiSolidCopy } from 'react-icons/bi'
import { QRCodeCanvas } from 'qrcode.react';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { CiFilter } from 'react-icons/ci'
import { TbDownload } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import * as XLSX from 'xlsx';

import { db } from '../../../firebase-config'

import Logo from "../../../assets/svg/logo_small.svg"
import Activity from "../../../assets/svg/activity.svg"

import ModalPop from '../../../components/modalPop'
import Request from './Request'
import { CgSpinner } from 'react-icons/cg';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [referralsPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [openRequest, setOpenRequest] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [referrals, setReferrals] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(false)

    const qrRef = useRef();
    
    const { user } = useSelector((state) => state.adminLogin)


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(`Get free medical care using my referral code: ${text}`);
        alert('Copied to clipboard');
    };

    const navigate = useNavigate()


    const referrerUrl = `https://refer.cphinigeria.org/ref/${user?.referrerCode || ''}`; 

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "QRCode.png";
        link.click();
    };

    const referrerCode = user?.referrerCode
    const getReferrals = async () => {
        try {
            const q = query(
                collection(db, 'referrals'),
                where('referrerCode', '==', referrerCode)
            );
            
            const querySnapshot = await getDocs(q);
            
            const userData = querySnapshot.docs.map(doc => doc.data());
            
            setReferrals(userData);
            
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };
    
    console.log(referrals, "scheme");

    useEffect(() => {
        if (referrerCode) {
            getReferrals();
        }
    }, [referrerCode]);

    const filteredReferrals = referrals?.filter((item) => {
        const matchesSearch = 
            item.profile.fullName.toLowerCase().includes(search.toLowerCase()) || 
            item.profile.emailOrphone.toLowerCase().includes(search.toLowerCase());
    
        const matchesStatus = 
            statusFilter === "" || 
            item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    })

    useEffect(() => {
        setTotalPages(Math.ceil(filteredReferrals?.length / referralsPerPage));
    }, [filteredReferrals, referralsPerPage]);


     const indexOfLastReferral = currentPage * referralsPerPage;
     const indexOfFirstReferral = indexOfLastReferral - referralsPerPage;
     const currentReferrals = filteredReferrals?.slice(indexOfFirstReferral, indexOfLastReferral);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(filteredReferrals?.length / referralsPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
    const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };

     useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

     const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(referrals); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'referrals');
        XLSX.writeFile(workbook, `referrals_${Date.now()}.xlsx`);
    };


  return (
    <div className='w-full mt-2 '>
        <div  className='flex flex-col sm:flex-row items-center gap-4 sm:gap-10'> {/*  className='flex items-center gap-[10px]' */}
            <div className='w-full sm:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-3 px-5' > {/* className='w-[336px] rounded-lg h-auto border border-[#E0E2E7] flex flex-col py-[11px] px-5' */}
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
            <div className='w-full sm:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-3 px-5'> {/* className='w-[336px] rounded-lg  border border-[#E0E2E7] flex flex-col py-[11px] px-5' */}
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Referrals</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{referrals?.length || 0}</p>
                </div>
            </div>
        </div>

        <div className='w-full mt-10'>
            <div className='flex flex-col sm:flex-row items-center justify-between px-5 gap-3'> {/*  className='flex items-center justify-between px-5' */}
                <p className='font-sans text-[18px] font-medium text-[#1C1C1E]'>Referrals</p>
                <div className='flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto'> {/* className='flex items-center gap-3' */}
                    <input 
                        className='w-full sm:w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'     //'w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                        type='text'
                        placeholder='Search...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-[120px] h-[40px] border cursor-pointer border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"  //"w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"
                    >
                        <option value="">Filter</option>
                        <option value="Pending">Pending</option>
                        <option value="No Show">No Show</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {/* <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 cursor-pointer rounded-lg flex items-center p-3'>
                        <CiFilter className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Filter</p>
                    </div> */}
                    <div 
                        className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 cursor-pointer rounded-lg flex items-center p-3'
                        onClick={exportExcel}
                    >
                        <TbDownload className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
                    </div>
                    <div onClick={() => {setOpenRequest(true), setUserData(userDetails)}} className='w-full lg:w-[141px] h-[45px] cursor-pointer bg-[#2D84FF] gap-1 rounded-lg flex flex-col justify-center items-center p-3'>
                        <p className='text-xs font-semibold text-center font-sans text-[#fff]'>Request Reward</p>
                    </div>
                    
                </div>
            </div>

            <div className='mt-5 px-0 lg:px-5 py-5 w-full overflow-x-auto'>
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
                            {/* <th className='w-[268px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Phone</p>
                            </th> */}
                            <th className='w-[157px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Status</p>
                            </th>
                            {/* <th className='w-[157px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Total</p>
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className=''>
                        {loading ? 
                            <tr className='h-[300px] bg-white border-t border-grey-100'>
                                <td colSpan="8" className="relative">
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <CgSpinner className='animate-spin text-[#2D84FF] text-[200px]' /> 
                                    </div>
                                </td>
                            </tr>
                            :
                            currentReferrals?.length > 0 ?
                            currentReferrals?.map((item, index) => (
                                <tr key={index} className='w-full mt-[18px] border border-[#F0F1F3]'> {/*  onClick={() => navigate("/referrals/details", { state: item })} */}
                                    
                                    <td className='w-[143px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-semibold text-sm'>{`#${index}`}</p>
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
                                    {/* <td className='w-[168px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm'>{item?.phone}</p>
                                    </td> */}
                                    <td className='w-[167px] h-[56px] text-left font-euclid text-[#333843] p-4 font-medium '>
                                        <div className={`${item?.status === "Completed" ? "bg-[#E7F4EE]" : item?.status === "No Show" ? "bg-[#FEE5EC]" : "bg-[#FDF1E8]"} w-[95px] p-1 h-auto rounded-xl`}>
                                            <p className={`${item?.status === "Completed" ? "text-[#0D894F]" : item?.status === "No Show" ? "text-[#F4003D]" : "text-[#E46A11]"} font-sans font-semibold text-center text-sm capitalize`}>{item?.status}</p>
                                        </div>
                                    </td>
                        
                                </tr>
            
                            )) : (
                                <tr className='h-[300px] bg-white border-t border-grey-100'>
                                    <td colSpan="8" className="relative">
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Referrers</p>
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
            {/* <div className='w-full flex items-center justify-between p-5'>
                <div className='bg-[#FAFAFE] w-[136px] h-[40px] flex items-center justify-center'>
                    <p className='font-sans text-[#667085] text-base'>Page 1 of 1</p>
                </div>

                <div>
                    <div className='flex h-[34px] justify-center  w-full gap-2 items-center'>

                        <div 
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                            className={`bg-[#FAFAFE] transition-all duration-500 ease-in-out  flex justify-center items-center cursor-pointer w-8 h-full  ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                        >
                            <IoIosArrowBack className='text-[#667085] hover:text-[#fff]'/>
                        </div>

                        {[...Array(totalPages)].map((_, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setCurrentPage(index + 1)} 
                                    className={`transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full bg-[#FAFAFE] ${currentPage === index + 1 ? 'bg-[#FAFAFE] text-[#000]' : 'hover:bg-[#FAFAFE]'}`}
                                >
                                    {index + 1}
                                </div>
                            ))}


                        <div 
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} 
                            className={`bg-[#FAFAFE] transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full  bg-[#FAFAFE] ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                        >
                            <IoIosArrowForward className='text-[#667085] hover:text-[#fff]'/>
                        </div>
                    </div>
                </div>

            </div> */}

        </div>
        <ModalPop isOpen={openRequest}>
            <Request 
                handleClose={() => setOpenRequest(false)}
                data={referrals}
                userDetails={user}
            />
        </ModalPop>
    </div>
  )
}

export default AdminDashboard