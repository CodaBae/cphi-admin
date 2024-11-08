import React, { useEffect, useState } from 'react'
import { CiFilter } from 'react-icons/ci'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { TbDownload } from 'react-icons/tb'
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as XLSX from "xlsx"

import Activity from "../../assets/svg/activity.svg"

import { db } from '../../firebase-config';
import { CgSpinner } from 'react-icons/cg';
import { useSelector } from 'react-redux';

const Orgs = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [orgsPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [allOrgs, setAllOrgs] = useState([])
    const [referralTotals, setReferralTotals] = useState({})
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()

    const { user } = useSelector((state) => state.adminLogin)
    const adminLoginType = user?.userType
    const adminName = user?.fullName


    
    const getAllOrgs = async () => {
        const orgsRef = collection(db, "users");
        setLoading(true)
        try {
            const q = adminLoginType === "Program Assistant" ? query(orgsRef, where("type", "==", "Organization"), where('addedBy', '==', adminName)) :  query(orgsRef, where("type", "==", "Organization"));
            const querySnapshot = await getDocs(q);
    
            const orgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            console.log("All Orgs:", orgs);
            setAllOrgs(orgs);
        } catch (err) {
            console.log(err, "Error fetching Orgs ");
        } finally {
            setLoading(false)
        }
    };

    const getTotal = async (referrerCode) => {
        try {
            const q = query(
                collection(db, 'referrals'),
                where('referrerCode', '==', referrerCode)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.size; // Get the number of docs directly
        } catch (err) {
            console.error("Error fetching user details:", err);
            return 0;
        }
    };

    const fetchTotals = async () => {
        const totals = {};
        
        // Fetch referral totals for each leaderboard user
        for (const item of allOrgs) {
            const total = await getTotal(item.referrerCode);
            totals[item.referrerCode] = total;
        }
        
        // Update the referral totals state
        setReferralTotals(totals);    
    };

    useState(() => {
        getAllOrgs()
    }, [])
    
    useEffect(() => {
        fetchTotals()
    }, [allOrgs]);


    const filteredOrgs = allOrgs?.filter((item) => (
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.emailOrPhone.toLowerCase().includes(search.toLowerCase()) || ""
    ))

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredOrgs?.length / orgsPerPage));
    }, [filteredOrgs, orgsPerPage]);

     // Calculate indices for paginated data
     const indexOfLastOrgs = currentPage * orgsPerPage;
     const indexOfFirstOrgs = indexOfLastOrgs - orgsPerPage;
     const currentOrgs = filteredOrgs?.slice(indexOfFirstOrgs, indexOfLastOrgs);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(filteredOrgs?.length / orgsPerPage)) {
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
    }, [search]);

     const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(allOrgs); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'allOrgs');
        XLSX.writeFile(workbook, `allOrgs_${Date.now()}.xlsx`);
    };

    
  return (
    <div className='w-full mt-[30px]'>
        <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
            <div className='flex items-center justify-between'>
                <p className='font-sans text-sm text-[#817F9B]'>Total Organization</p>
                <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                    <img src={Activity} alt='Activity' className='w-5 h-5' />
                </div>
            </div>
            <div className='flex flex-col mt-3 gap-5'>
                <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allOrgs?.length}</p>
            </div>
        </div>
        <div className='w-full mt-10'>
            <div className='flex items-center flex-col lg:flex-row justify-between px-5'>
                <p className='font-sans text-[18px] font-medium text-[#1C1C1E]'>Organization</p>
                <div className='flex items-center flex-col lg:flex-row gap-3'>
                    <input 
                        className='w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                        type='text'
                        placeholder='Search...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div 
                        className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 cursor-pointer rounded-lg flex items-center p-3'
                        onClick={exportExcel}
                    >
                        <TbDownload className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
                    </div>
                    <div onClick={() =>  navigate('/orgs/add')} className='w-full lg:w-[173px] h-[45px] cursor-pointer bg-[#2D84FF] gap-2 rounded-lg flex gap-1 justify-center items-center p-3'>
                        <FaPlus className="w-4 h-4 text-[#fff]" />
                        <p className='text-xs font-semibold text-center font-sans text-[#fff]'>Add Organization</p>
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
                                <p className='text-sm text-[#333843] font-sans'>Total Referrals</p>
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
                            currentOrgs?.length > 0 ?
                            currentOrgs?.map((item, index) => (
                                <tr key={index} className='w-full mt-[18px] border border-[#F0F1F3]'>
                                    
                                    <td className='w-[143px] h-[56px] text-left font-sans  p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-semibold text-sm'>{`#${index + 1}`}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#333843] font-medium text-sm'>
                                                {new Date(item?.createdAt?.seconds * 1000).toLocaleDateString()}
                                            </p>
                                            <p className='font-sans text-[#333843] font-medium text-sm'>
                                                {new Date(item?.createdAt?.seconds * 1000).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.fullName}</p>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans  p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-normal text-sm '>{item?.emailOrPhone}</p>
                                        
                                    </td>
                                    
                                    <td className='w-[168px] h-[56px] text-left cursor-pointer font-sans p-4 font-medium ' onClick={() => navigate("/referrals/details", {state: item})}>
                                        <p className='font-sans text-[#2D84FF] underline font-medium text-sm'>
                                            {referralTotals[item.referrerCode] || 0}
                                        </p>
                                    </td>                              
            
                                </tr>
                            )) : (
                                <tr className='h-[300px] bg-white border-t border-grey-100'>
                                    <td colSpan="8" className="relative">
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Organization Available</p>
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

export default Orgs