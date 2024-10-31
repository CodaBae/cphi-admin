import React, { useEffect, useState } from 'react'

import Activity from "../../assets/svg/activity.svg"
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { CiFilter } from 'react-icons/ci'
import { TbDownload } from 'react-icons/tb'
import * as XLSX from "xlsx"

import { db } from '../../firebase-config'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import ModalPop from '../../components/modalPop'
import StatusUpdate from './component/StatusUpdate'
import { CgSpinner } from 'react-icons/cg'
import { toast } from 'react-toastify'

const Appointments = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [appointmentsPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("")
    const [allAppointments, setAllAppointments] = useState([])
    const [allPendingAppointments, setAllPendingAppointments] = useState([])
    const [allNoShowAppointments, setAllNoShowAppointments] = useState([])
    const [allCompletedAppointments, setAllCompletedAppointments] = useState([])
    const [locationFilter, setLocationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [clientData, setClientData] = useState([])
    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateLoadingB, setUpdateLoadingB] = useState(false)


    const getAllAppointments = async () => {
        const referralsRef = collection(db, "referrals");
    
        try {
            const querySnapshot = await getDocs(referralsRef);
    
            const allReferrals = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            console.log("All Referrals:", allReferrals);
            setAllAppointments(allReferrals);
        } catch (err) {
            console.log(err, "Error fetching referrals");
        }
    };

    const getAllAppointmentsByStatus = async () => {
        const referralsRef = collection(db, "referrals");
    
        try {
            const p = query(referralsRef, where("status", "==", "Pending"));
            const n = query(referralsRef, where("status", "==", "No Show"));
            const c = query(referralsRef, where("status", "==", "Completed"));
            const pendingQuerySnapshot = await getDocs(p);
            const noShowQuerySnapshot = await getDocs(n);
            const completedQuerySnapshot = await getDocs(c);
    
            const pendingReferrals = pendingQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            const noShowReferrals = noShowQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const completedReferrals = completedQuerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            console.log("Pending Referrals:", pendingReferrals);
            console.log("No Show Referrals:", noShowReferrals);
            console.log("Completed Referrals:", completedReferrals);
            setAllPendingAppointments(pendingReferrals);
            setAllNoShowAppointments(noShowReferrals);
            setAllCompletedAppointments(completedReferrals);
        } catch (err) {
            console.log(err, "Error fetching pending referrals");
        }
    };

    useEffect(() => {
        getAllAppointments()
        getAllAppointmentsByStatus()
    }, [updateLoading, updateLoadingB])

    console.log(allAppointments, "allAppointments")



    const filteredAppointments = allAppointments?.filter((item) => {
        const matchesSearch = 
            item.profile.fullName.toLowerCase().includes(search.toLowerCase()) || 
            item.profile.emailOrphone.toLowerCase().includes(search.toLowerCase());
    
        const matchesLocation = 
            locationFilter === "" || 
            item.location === locationFilter;

        const matchesStatus = 
            statusFilter === "" || 
            item.status === statusFilter;
        
        return matchesSearch && matchesLocation && matchesStatus;
    })

 

    useEffect(() => {
        // Update status pages whenever filteredOrders changes
        setTotalPages(Math.ceil(filteredAppointments?.length / appointmentsPerPage));
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

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(allAppointments); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'allAppointments');
        XLSX.writeFile(workbook, `appointments_${Date.now()}.xlsx`);
    };


    const updateStatus = async (item) => {
        setUpdateLoading(true)
        try {
            
            const appointmentRef = doc(db, 'referrals', item.id);

            await updateDoc(appointmentRef, {
                status: 'No Show',
            });
            setUpdateLoading(false)
            toast.success('Status updated successfully!');
        } catch (error) {
            setUpdateLoading(false)
            toast.error('Error updating status!');
            console.error('Error updating status:', error);
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
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allPendingAppointments?.length || 0}</p>
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
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allCompletedAppointments?.length || 0}</p>
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
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allNoShowAppointments?.length || 0}</p>
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
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full sm:w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"  //"w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"
                    >
                        <option value="">Location</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Port Harcourt">Port Harcourt</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"  //"w-[120px] h-[40px] border border-[#EBEDF0] outline-[#2D84FF] rounded-lg p-2"
                    >
                        <option value="">Status</option>
                        <option value="Pending">Pending</option>
                        <option value="No Show">No Show</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div 
                        className='w-[87px] h-[40px] border border-[#EBEDF0] gap-1 rounded-lg flex items-center p-3'
                        onClick={exportExcel}
                    >
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
                                <p className='text-sm text-[#333843] font-medium  font-inter'>Name</p>
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
                            <th className='w-[169px] h-[18px] text-left text-sm font-sans text-[#667085] p-4 font-medium '>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {currentAppointments?.length > 0 ?
                            currentAppointments?.map((item) => (
                                <tr key={item.id} className='w-full mt-[18px] border border-[#F0F1F3]'>
                                    
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#667085] font-medium text-sm'>{item?.date}</p>
                                            <p className='font-sans text-[#667085] font-medium text-sm'>{item?.time}</p>
                                        </div>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#333843] font-medium text-sm '>{item?.profile?.fullName}</p>
                                        </div>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-medium text-sm'>{item?.profile?.emailOrphone}</p>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] truncate font-medium text-sm'>{item?.about?.story?.slice(0, 20)}</p>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        {
                                            item.about.services?.map((s, index) => (
                                                <div key={index} className='flex items-center gap-1'>
                                                    <p className='font-sans text-[#667085] font-medium text-sm'>{s}</p>
                                                </div>
                                            ))
                                        }
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-medium text-sm'>
                                            {item?.location}
                                        </p>
                                    </td>
                                    <td className='w-[167px] h-[56px] text-left font-euclid text-[#667085] p-4 font-medium '>
                                        <div className={`${item?.status === "Completed" ? "bg-[#E7F4EE]" : item?.status === "No Show" ? "bg-[#FEE5EC]" : "bg-[#FDF1E8]"} w-[95px] p-1 h-auto rounded-xl`}>
                                            <p className={`${item?.status === "Completed" ? "text-[#0D894F]" : item?.status === "No Show" ? "text-[#F4003D]" : "text-[#E46A11]"} font-sans capitalize font-semibold text-center text-sm`}>{item?.status}</p>
                                        </div>
                                    </td>
                                    <td className='w-[157px] h-[56px] text-left font-sans text-[#667085] p-4 font-medium '>
                                        <div className="flex items-center gap-2">
                                           <div className='bg-[#F4003D1A] p-2 rounded-lg cursor-pointer' onClick={() => updateStatus(item)}>
                                                <p className='text-[#F4003D] font-sans whitespace-nowrap'>{updateLoading ? <CgSpinner className=" animate-spin text-lg " /> : 'No Show'}</p>
                                           </div>
                                           <div className='bg-[#1EC6771A] p-2 cursor-pointer rounded-lg' onClick={() => {setShowModal(true), setClientData(item)}}>
                                                <p className='text-[#1EC677] font-sans whitespace-nowrap'>{updateLoadingB ? <CgSpinner className=" animate-spin text-lg " /> : 'Completed'}</p>
                                           </div>
                                        </div>
                                    </td>
                                </tr>
            
                            )) : (
                                <tr className='h-[300px] bg-white border-t border-grey-100'>
                                    <td colSpan="8" className="relative">
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Appointment</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
              
            </div>
    
            <div className='w-full flex items-center justify-between p-5'>
                <div className='bg-[#FAFAFE] w-[136px] h-[40px] flex items-center justify-center'>
                    <p className='font-sans text-[#667085] text-base'>Page {currentPage} of {totalPages}</p>
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

        <ModalPop isOpen={showModal}>
            <StatusUpdate 
                handleClose={() => setShowModal(false)}
                clientData={clientData}
                updateLoadingB={updateLoadingB}
                setUpdateLoadingB={setUpdateLoadingB}
            />
        </ModalPop>

    </div>
  )
}

export default Appointments