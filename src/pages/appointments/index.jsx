import React, { useEffect, useState } from 'react'

import Activity from "../../assets/svg/activity.svg"
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { CiFilter } from 'react-icons/ci'
import { TbDownload } from 'react-icons/tb'

const Appointments = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [appointmentsPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("")


    const data = [
        {
            id: "#302010",
            date: "12/8/2024",
            time:"10:20",
            name: "Heala Tech",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            location: "Lagos",
            story: "I’ve been feeling unwell lately and have noticed...",
            service: ["Consultation", "Test", "Treatment" ],
            status: "Completed"
        },
        {
            id: "#302011",
            date: "12/8/2024",
            time:"10:20",
            name: "Joy Johnson",
            email: "mercy.p@mail.com",
            location: "Lagos",
            phone: "09034543234",
            service: ["Test"],
            story: "I’ve been feeling unwell lately and have noticed...",
            status: "No Show"
        },
        {
            id: "#302012",
            date: "12/8/2024",
            time: "10:20",
            name: "John Bushmill",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            location: "Lagos",
            service: ["Treatment" ],
            story: "I’ve been feeling unwell lately and have noticed...",
            status: "Completed"
        },
        {
            id: "#302013",
            date: "12/8/2024",
            time: "10:20",
            name: "John Doe",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            service: ["Consultation"],
            location: "Lagos",
            story: "I’ve been feeling unwell lately and have noticed...",
            status: "No Show"
        },
    ] 

    const filteredAppointments = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || "")

    useEffect(() => {
        // Update status pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredAppointments.length / appointmentsPerPage));
    }, [appointmentsPerPage]);

     // Calculate indices for paginated data
     const indexOfLastAppointments = currentPage * appointmentsPerPage;
     const indexOfFirstAppointments = indexOfLastAppointments - appointmentsPerPage;
     const currentAppointments = filteredAppointments?.slice(indexOfFirstAppointments, indexOfLastAppointments);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(currentAppointments?.length / appointmentsPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
     const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };

  return (
    <div className='mt-[30px] w-full'>
        <div className='flex items-center gap-[10px]'>
            <div className='w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Appointments</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>100</p>
                </div>
            </div>
            <div className='w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Completed</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>23</p>
                </div>
            </div>
            <div className='w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total No Show</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>23</p>
                </div>
            </div>
        </div>

        <div className='w-full mt-10'>
            <div className='flex items-center justify-between px-5'>
                <p className='font-sans text-[18px] font-medium text-[#1C1C1E]'>Appointments</p>
                <div className='flex items-center gap-3'>
                    <input 
                        className='w-[290px] h-[40px] outline-[#2D84FF] rounded-lg p-2 border border-[#E1E5F3]'
                        type='text'
                        placeholder='Search...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                        <CiFilter className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Location</p>
                    </div>
                    <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                        <CiFilter className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Type</p>
                    </div>
                    <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                        <CiFilter className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Status</p>
                    </div>
                    <div className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'>
                        <TbDownload className='text-base text-[#6B788E]' />
                        <p className='text-xs font-semibold font-sans text-[#7A8699]'>Export</p>
                    </div>
                </div>
            </div>

            <div className='mt-5 p-5 w-full'>
                <table>
                    <thead>
                        <tr className='w-full border rounded-t-xl border-[#F0F1F3] '>
                            
                            <th className='w-[247px] h-[18px] text-left text-sm  text-[#333843] p-4 font-medium '>
                                <div className='flex items-center gap-1'>
                                    <p className='text-sm text-[#333843] font-medium font-inter'>Date/Time</p>
                                </div>
                            </th>
                            <th className='w-[298px] h-[18px] text-left  text-[#333843] p-4 font-medium '>
                                <div className='flex gap-1 flex-col'>
                                    <p className='text-sm text-[#333843] font-medium  font-inter'>Name</p>
                              
                                </div>
                            </th>
                            <th className='w-[268px] h-[18px] text-left text-sm text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-medium font-inter'>Phone</p>
                            </th>
                            <th className='w-[268px] h-[18px] text-left text-sm text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-medium font-inter'>Story</p>
                            </th>
                            <th className='w-[268px] h-[18px] text-left text-sm  text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-medium font-inter'>Service</p>
                            </th>
                            <th className='w-[268px] h-[18px] text-left text-sm text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-medium font-inter'>Location</p>
                            </th>
                            <th className='w-[157px] h-[18px] text-left text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-medium font-inter'>Status</p>
                            </th>
                            {/*  <th className='w-[169px] h-[18px] text-left text-sm font-sans text-[#667085] p-4 font-medium '>
                                Action
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className=''>
                        {
                            currentAppointments.map((item) => (
                                <tr key={item.id} className='w-full mt-[18px] border border-[#F0F1F3]'>
                                    
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#667085] font-medium text-sm'>{item?.date}</p>
                                            <p className='font-sans text-[#667085] font-medium text-sm'>{item?.time}</p>
                                        </div>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#333843] font-medium text-sm '>{item?.name}</p>
                                            <p className='font-sans text-[#667085] font-normal text-sm '>{item?.email}</p>
                                        </div>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-medium text-sm'>{item?.phone}</p>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-medium text-sm'>{item?.story}</p>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        {
                                            item?.service?.map((s, index) => (
                                                <div key={index} className='flex items-center gap-1'>
                                                    <p className='font-sans text-[#667085] font-medium text-sm'>{s}</p>
                                                </div>
                                            ))
                                        }
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-medium text-sm'>{item?.location}</p>
                                    </td>
                                    <td className='w-[167px] h-[56px] text-left font-euclid text-[#667085] p-4 font-medium '>
                                        <div className={`${item?.status === "Completed" ? "bg-[#E7F4EE]" : item?.status === "No Show" ? "bg-[#FEE5EC]" : "bg-[#FDF1E8]"} w-[95px] p-1 h-auto rounded-xl`}>
                                            <p className={`${item?.status === "Completed" ? "text-[#0D894F]" : item?.status === "No Show" ? "text-[#F4003D]" : "text-[#E46A11]"} font-sans font-semibold text-center text-sm`}>{item?.status}</p>
                                        </div>
                                    </td>
                                
                              
            
                                </tr>
            
                            ))
                        }
                    </tbody>
                </table>
            </div>
    
            <div className='w-full flex items-center justify-between p-5'>
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

            </div>

        </div>

    </div>
  )
}

export default Appointments