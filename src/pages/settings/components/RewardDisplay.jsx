import React, { useEffect, useState } from 'react'
import { CiFilter } from 'react-icons/ci'
import { FaPlus } from 'react-icons/fa6'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { TbDownload } from 'react-icons/tb'
import ModalPop from '../../../components/modalPop'
import AddReward from './AddReward'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase-config'
import * as XLSX from "xlsx"
import { CgSpinner } from 'react-icons/cg'
import DeleteReward from './DeleteReward'
import EditReward from './EditReward'

const RewardDisplay = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rewardPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [openAddReward, setOpenAddReward] = useState(false)
    const [rewardsData, setRewardsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [editData, setEditData] = useState([])
    const [openEditReward, setOpenEditReward] = useState(false)
    const [openDeleteReward, setOpenDeleteReward] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [editLoading, setEditLoading] = useState(false)

    // const data = [
    //     {
    //         date: "12/8/2024",
    //         range: "1 - 10",
    //         description: `Bluetooth Wireless Earbuds: Enjoy quality sound on the go with sleek, wireless audio.
    //                       Smart Home Assistant Speaker: Control your home’s lighting, get news updates, 
    //                       or play music with ease using devices like Google Home or Amazon Echo.`,
           
    //     },
    //     {
    //         date: "12/8/2024",
    //         range: "11 - 50",
    //         description: `Bluetooth Wireless Earbuds: Enjoy quality sound on the go with sleek, wireless audio.
    //         Smart Home Assistant Speaker: Control your home’s lighting, get news updates, 
    //         or play music with ease using devices like Google Home or Amazon Echo.`,
    //     },
    //     {
    //         date: "12/8/2024",
    //         range: "51 - 100",
    //         description: `Bluetooth Wireless Earbuds: Enjoy quality sound on the go with sleek, wireless audio.
    //         Smart Home Assistant Speaker: Control your home’s lighting, get news updates, 
    //         or play music with ease using devices like Google Home or Amazon Echo.`,
    //     },
        
    // ]

    const getRewards = async () => {
        setLoading(true)
        try {
            const rewardsRef = collection(db, "rewards")
            const querySnapshot = await getDocs(rewardsRef);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setRewardsData(data)
        } catch (err) {
            console.log("Failed to fetch doc", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRewards()
    }, [addLoading, deleteLoading, editLoading])

    console.log(rewardsData, "rewardsData")

    const filteredReward = rewardsData?.filter((item) => item.description.toLowerCase().includes(search.toLowerCase()) || "")

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredReward?.length / rewardPerPage));
    }, [filteredReward, rewardPerPage]);

     // Calculate indices for paginated data
     const indexOfLastReward = currentPage * rewardPerPage;
     const indexOfFirstReward = indexOfLastReward - rewardPerPage;
     const currentReward = filteredReward?.slice(indexOfFirstReward, indexOfLastReward);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(filteredReward?.length / rewardPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
     const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };

     useEffect(() => {
        setCurrentPage(1)
     }, [search])

     const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rewardsData); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'rewardsData');
        XLSX.writeFile(workbook, `rewardsData_${Date.now()}.xlsx`);
    };


  return (
    <div className='w-full mt-10'>
        <div className='flex items-center flex-col lg:flex-row justify-between px-5'>
            <p className='font-sans text-[18px] font-semibold text-[#1C1C1E]'>Reward</p>
            <div className='flex flex-col lg:flex-row items-center gap-3'>
                <input 
                    className='w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                    type='text'
                    placeholder='Search...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                    <CiFilter className='text-base text-[#6B788E]' />
                    <p className='text-xs font-semibold font-sans text-[#7A8699]'>Filter</p>
                </div> */}
                <div 
                    className='w-full lg:w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg cursor-pointer flex items-center p-3'
                    onClick={exportExcel}
                >
                    <TbDownload className='text-base text-[#6B788E]' />
                    <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
                </div>
                <div onClick={() => setOpenAddReward(true)} className='w-full lg:w-[142px] h-[45px] cursor-pointer bg-[#2D84FF] gap-2 rounded-lg flex gap-1 justify-center items-center p-3'>
                    <FaPlus className="w-4 h-4 text-[#fff]" />
                    <p className='text-xs font-semibold text-center font-sans text-[#fff]'>Add Reward</p>
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
                            <p className='text-sm text-[#333843] font-sans'>Range</p>
                        </th>
                        <th className='w-[697px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                            <p className='text-sm text-[#333843] font-sans'>Description</p>
                        </th>
                        <th className='w-[697px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                            <p className='text-sm text-[#333843] font-sans'>Action</p>
                        </th>
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
                        currentReward?.length > 0 ?
                        currentReward?.map((item, index) => (
                            <tr key={index} className='w-full mt-[18px] border border-[#F0F1F3]'>
                            
                                <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#667085] font-medium text-sm'>{item?.date}</p>
                                </td>
                                <td className='w-[147px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#333843] font-medium text-sm '>{item?.range?.from} - {item?.range?.to}</p>
                                </td>
                                <td className='w-[697px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#667085] font-normal text-sm '>{item?.description}</p>
                                </td>
                                <td className='w-[397px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                    <div className="flex items-center gap-2">
                                        <div className='bg-[#1EC677] p-2 flex items-center justify-center w-[100px] cursor-pointer rounded-xl' onClick={() => {setOpenEditReward(true), setEditData(item)}}>
                                            <p className='text-[#FFFFFF] font-sans whitespace-nowrap'>{'Edit'}</p>
                                        </div>
                                        <div className='bg-[#F4003D] flex items-center justify-center w-[100px] p-2 rounded-xl cursor-pointer' onClick={() => {setOpenDeleteReward(true), setEditData(item)}}>
                                            <p className='text-[#FFF] font-sans whitespace-nowrap'>{'Delete'}</p>
                                        </div>
                                    </div>
                                </td>
        
                            </tr>
        
                        )) : (
                            <tr className='h-[300px] bg-white border-t border-grey-100'>
                                <td colSpan="8" className="relative">
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Reward Available</p>
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

        <ModalPop isOpen={openAddReward}>
            <AddReward 
                handleClose={() => setOpenAddReward(false)}
                loading={addLoading}
                setLoading={setAddLoading} 
            />
        </ModalPop>

        <ModalPop isOpen={openEditReward}>
            <EditReward 
                handleClose={() => setOpenEditReward(false)}
                editData={editData}
                editDataLoading={editLoading}
                setEditDataLoading={setEditLoading} 
            />
        </ModalPop>

        <ModalPop isOpen={openDeleteReward}>
            <DeleteReward 
                handleClose={() => setOpenDeleteReward(false)}
                deleteData={editData}
                deleteLoading={deleteLoading}
                setDeleteLoading={setDeleteLoading} 
            />
        </ModalPop>

    </div>
  )
}

export default RewardDisplay