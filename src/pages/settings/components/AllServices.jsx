import React, { useEffect, useState } from 'react'
import { CiFilter } from 'react-icons/ci'
import { FaPlus } from 'react-icons/fa6'
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { TbDownload } from 'react-icons/tb'
import ModalPop from '../../../components/modalPop'
import AddServices from "./AddServices"
import EditServices from "./EditServices"
import DeleteService from "./DeleteService"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase-config'
import * as XLSX from "xlsx"
import { CgSpinner } from 'react-icons/cg'

const AllServices = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [servicesPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [openAddService, setOpenAddService] = useState(false)
    const [servicesData, setServicesData] = useState([])
    const [loading, setLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [openEditService, setOpenEditService] = useState(false)
    const [openDeleteService, setOpenDeleteService] = useState(false)
    const [editData, setEditData] = useState([])


    const getServices = async () => {
        setLoading(true)
        try {
            const servicesRef = collection(db, "services")
            const querySnapshot = await getDocs(servicesRef);

            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setServicesData(data)
        } catch (err) {
            console.log("Failed to fetch doc", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getServices()
    }, [addLoading, editLoading, deleteLoading])

    console.log(servicesData, "servicesData")

    const filteredReward = servicesData?.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || "")

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredReward?.length / servicesPerPage));
    }, [filteredReward, servicesPerPage]);

     // Calculate indices for paginated data
     const indexOfLastReward = currentPage * servicesPerPage;
     const indexOfFirstReward = indexOfLastReward - servicesPerPage;
     const currentReward = filteredReward?.slice(indexOfFirstReward, indexOfLastReward);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(filteredReward?.length / servicesPerPage)) {
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
        const worksheet = XLSX.utils.json_to_sheet(servicesData); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'servicesData');
        XLSX.writeFile(workbook, `services_${Date.now()}.xlsx`);
    };

    
  return (
    <div className='w-full mt-10'>
        <div className='flex items-center flex-col lg:flex-row justify-between px-5'>
            <p className='font-sans text-[18px] font-semibold text-[#1C1C1E]'>Services</p>
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
                <div onClick={() => setOpenAddService(true)} className='w-full lg:w-[142px] h-[45px] cursor-pointer bg-[#2D84FF] gap-2 rounded-lg flex gap-1 justify-center items-center p-3'>
                    <FaPlus className="w-4 h-4 text-[#fff]" />
                    <p className='text-xs font-semibold text-center font-sans text-[#fff]'>Add Services</p>
                </div>
            </div>
        </div>

        <div className='mt-5 p-5 w-full overflow-x-auto'>
            <table>
                <thead>
                    <tr className='w-full border rounded-t-xl border-[#F0F1F3] '>
                        
                        {/* <th className='w-[247px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                            <div className='flex items-center gap-1'>
                                <p className='text-sm text-[#333843] font-sans'>Date</p>
                                <IoIosArrowDown className="text-[#667085] text-base" />
                            </div>
                        </th> */}
                        <th className='w-[247px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                            <div className='flex items-center gap-1'>
                                <p className='text-sm text-[#333843] font-sans'>ID</p>
                                <IoIosArrowDown className="text-[#667085] text-base" />
                            </div>
                        </th>
                        <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                            <p className='text-sm text-[#333843] font-sans'>Title</p>
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
                            
                                <td className='w-[647px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#667085] font-medium text-sm'>{`#${index + 1}`}</p>
                                </td>
                                <td className='w-[647px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#667085] font-medium text-sm'>{item?.title}</p>
                                </td>
                                <td className='w-[1597px] h-[56px] text-left font-sans  p-4 font-medium '>
                                    <p className='font-sans text-[#667085] font-normal text-sm '>{item?.description}</p>
                                </td>
                                <td className='w-[397px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                    <div className="flex items-center gap-2">
                                        <div className='bg-[#1EC677] p-2 flex items-center justify-center w-[100px] cursor-pointer rounded-xl' onClick={() => {setOpenEditService(true), setEditData(item)}}>
                                            <p className='text-[#FFFFFF] font-sans whitespace-nowrap'>{'Edit'}</p>
                                        </div>
                                        <div className='bg-[#F4003D] flex items-center justify-center w-[100px] p-2 rounded-xl cursor-pointer' onClick={() => {setOpenDeleteService(true), setEditData(item)}}>
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

        <ModalPop isOpen={openAddService}>
            <AddServices 
                handleClose={() => setOpenAddService(false)}
                loading={addLoading}
                setLoading={setAddLoading} 
            />
        </ModalPop>

        <ModalPop isOpen={openEditService}>
            <EditServices 
                handleClose={() => setOpenEditService(false)}
                editData={editData}
                editDataLoading={editLoading}
                setEditDataLoading={setEditLoading} 
            />
        </ModalPop>

        <ModalPop isOpen={openDeleteService}>
            <DeleteService 
                handleClose={() => setOpenDeleteService(false)}
                deleteData={editData}
                deleteLoading={deleteLoading}
                setDeleteLoading={setDeleteLoading} 
            />
        </ModalPop>

    </div>
  )
}

export default AllServices