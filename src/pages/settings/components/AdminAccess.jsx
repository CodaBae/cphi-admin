import React, { useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { FaPlus } from 'react-icons/fa6'
import { TbDownload } from 'react-icons/tb'
import { CiFilter } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import * as XLSX from "xlsx"

import { db } from '../../../firebase-config'

import ModalPop from '../../../components/modalPop'

import AddAdmin from './AddAdmin'
import EditAdmin from './EditAdmin'
import DeleteAdmin from './DeleteAdmin'

const AdminAccess = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [adminPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [openAddAdmin, setOpenAddAdmin] = useState(false)
    const [openEditAdmin, setOpenEditAdmin] = useState(false)
    const [openDeleteAdmin, setOpenDeleteAdmin] = useState(false)
    const [allAdmins, setAllAdmins] = useState([])
    const [referralTotals, setReferralTotals] = useState({})
    const [adminData, setAdminData] = useState([])
    const [editDataLoading, setEditDataLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [adminFilter, setAdminFilter] = useState("")

    const navigate = useNavigate()
    
    const data = [
        {
            type: "Admin",
            totalReferrals: 5,
            totalOrgs: 5,
            date: "12/8/2024",
            name: "John Bushmill",
            email: "Johnb@mail.com",
        },
        {
            type: "Admin",
            totalReferrals: 5,
            totalOrgs: 5,
            date: "12/8/2024",
            name: "John Bushmill",
            email: "Johnb@mail.com",
        },
        {
            type: "Admin",
            totalReferrals: 5,
            totalOrgs: 5,
            date: "12/8/2024",
            name: "John Bushmill",
            email: "Johnb@mail.com",
        },
        {
            type: "Super Admin",
            totalReferrals: 5,
            totalOrgs: 5,
            date: "12/8/2024",
            name: "John Bushmill",
            email: "Johnb@mail.com",
        },
    ]

    const getAllAdmins = async () => {
        try {
            const adminsRef = collection(db, "admins")
            const querySnapshot = await getDocs(adminsRef);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAllAdmins(data)
        } catch (err) {
            console.log("Error getting data:",  err)
        }
    }

    console.log(allAdmins, "allAdmins")

    useEffect(() => {
        getAllAdmins()
    }, [editDataLoading, deleteLoading])

    const filteredAdmin = allAdmins?.filter((item) => {
        const matchesSearch = 
        item.fullName.toLowerCase().includes(search.toLowerCase()) || 
        item.email.toLowerCase().includes(search.toLowerCase()) || "";

        const matchesStatus = 
            adminFilter === "" || 
            item.userType === adminFilter;
    
        return matchesSearch &&  matchesStatus;
    })

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
        for (const item of allAdmins) {
            const total = await getTotal(item.referrerCode);
            totals[item.referrerCode] = total;
        }
        
        // Update the referral totals state
        setReferralTotals(totals);    
    };

    useEffect(() => {
        fetchTotals()
    }, [])

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredAdmin?.length / adminPerPage));
    }, [adminPerPage]);

     // Calculate indices for paginated data
     const indexOfFirstAdmin = currentPage * adminPerPage;
     const indexOfLastAdmin = indexOfFirstAdmin - adminPerPage;
     const currentAdmin = filteredAdmin?.slice(indexOfLastAdmin, indexOfFirstAdmin);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(currentAdmin?.length / adminPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
     const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };

     const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(allAdmins); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'allAdmins');
        XLSX.writeFile(workbook, `admins_${Date.now()}.xlsx`);
    };

  return (
    <div className='w-full mt-10'>
    <div className='flex items-center flex-col lg:flex-row justify-between px-5'>
        <p className='font-sans text-[18px] font-semibold text-[#1C1C1E]'>Reward</p>
        <div className='flex items-center flex-col lg:flex-row gap-3'>
            <input 
                className='w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                type='text'
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="w-full sm:w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"  //"w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"
            >
                <option value="">Type</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
            </select>
            {/* <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                <CiFilter className='text-base text-[#6B788E]' />
                <p className='text-xs font-semibold font-sans text-[#7A8699]'>Filter</p>
            </div> */}
            <div 
                className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'
                onClick={exportExcel}
            >
                <TbDownload className='text-base text-[#6B788E]' />
                <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
            </div>
            <div onClick={() => setOpenAddAdmin(true)} className='w-full lg:w-[142px] h-[45px] cursor-pointer bg-[#2D84FF] gap-2 rounded-lg flex gap-1 justify-center items-center p-3'>
                <FaPlus className="w-4 h-4 text-[#fff]" />
                <p className='text-xs font-semibold text-center font-sans text-[#fff]'>Add Admin</p>
            </div>
        </div>
    </div>

    <div className='mt-5 p-5 w-full overflow-x-auto'>
        <table>
            <thead>
                <tr className='w-full border rounded-t-xl border-[#F0F1F3] '>
                    
                    <th className='w-[247px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                        <div className='flex items-center gap-1'>
                            <p className='text-sm text-[#333843] font-sans'>Date</p>
                            <IoIosArrowDown className="text-[#667085] text-base" />
                        </div>
                    </th>
                    <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                        <p className='text-sm text-[#333843] font-sans'>Type</p>
                    </th>
                    <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                        <p className='text-sm text-[#333843] font-sans'>Total Referrals</p>
                    </th>
                    {/* <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                        <p className='text-sm text-[#333843] font-sans'>Total Orgs</p>
                    </th> */}
                    <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                        <p className='text-sm text-[#333843] font-sans'>Name</p>
                    </th>
                    <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                        <p className='text-sm text-[#333843] font-sans'>Email</p>
                    </th>
                    <th className='w-[169px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                        Action
                    </th>
                </tr>
            </thead>
            <tbody className=''>
                {currentAdmin?.length > 0 ?
                    currentAdmin?.map((item, index) => (
                        <tr key={index} className='w-full mt-[18px] border border-[#F0F1F3]'>
                            
                        
                            <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#667085] font-medium text-sm'>{item?.date}</p>
                            </td>
                            <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#667085] font-medium text-sm'>{item?.userType}</p>
                            </td>
                            <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#2D84FF] underline font-medium text-sm'>
                                    {referralTotals[item.referrerCode] || 0}
                                </p>
                            </td>
                            {/* <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#2D84FF] underline font-medium text-sm'>{item?.totalOrgs}</p>
                            </td> */}
                            <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#333843] font-medium text-sm '>{item?.fullName}</p>
                            </td>
                            <td className='w-[198px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <p className='font-sans text-[#667085] font-normal text-sm '>{item?.email}</p>
                            </td>
                            <td className='w-[198px] h-[56px] text-left font-sans  p-4 font-medium '>
                                <div className='flex items-center gap-4'>
                                    <div onClick={() => {setOpenDeleteAdmin(true), setAdminData(item)}} className='w-[69px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#F4003D1A] '>
                                        <p className='text-[#F4003D] font-sans text-[12px] font-medium'>Delete</p>
                                    </div>
                                    <div onClick={() => {setOpenEditAdmin(true), setAdminData(item)}} className='w-[55px] h-[34px] cursor-pointer rounded-lg flex items-center justify-center bg-[#1EC6771A] '>
                                        <p className='text-[#1EC677] font-sans text-[12px] font-medium'>Edit</p>
                                    </div>
                                </div>
                            </td>
    
                        </tr>
    
                    )) : (
                        <tr className='h-[300px] bg-white border-t border-grey-100'>
                            <td colSpan="8" className="relative">
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='flex flex-col gap-2 items-center'>
                                        <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Admin Available</p>
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

    <ModalPop isOpen={openAddAdmin}>
        <AddAdmin handleClose={() => setOpenAddAdmin(false)} />
    </ModalPop>

    <ModalPop isOpen={openEditAdmin}>
        <EditAdmin 
            handleClose={() => setOpenEditAdmin(false)} 
            adminData={adminData}
            editDataLoading={editDataLoading}
            setEditDataLoading={setEditDataLoading}
        />
    </ModalPop>

    <ModalPop isOpen={openDeleteAdmin}>
        <DeleteAdmin 
            handleClose={() => setOpenDeleteAdmin(false)}
            deleteData={adminData} 
            deleteLoading={deleteLoading}
            setDeleteLoading={setDeleteLoading}
        />
    </ModalPop>

</div>
  )
}

export default AdminAccess