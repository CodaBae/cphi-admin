import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';
import { MdOutlineCalendarToday } from 'react-icons/md'

import Activity from "../../../assets/svg/activity.svg"

import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { db } from '../../../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';


const SuperAdminDashboard = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [leaderboardPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
    const [allAppointments, setAllAppointments] = useState([])
    const [allOrgs, setAllOrgs] = useState([])
    const [allIndividuals, setAllIndividuals] = useState([])
    const [leaderBoard, setLeaderBoard] = useState([])
    const [referralTotals, setReferralTotals] = useState({});
    const [selectedYear, setSelectedYear] = useState(2024);
    const [loading, setLoading] = useState(false)

    const adminData = useSelector((state) => state.adminLogin)

    const navigate = useNavigate()


    const getAllAppointments = async () => {
        const referralsRef = collection(db, "referrals");
        setLoading(true)
    
        try {
            const q = query(referralsRef, where("status", "==", "Pending"));
            const querySnapshot = await getDocs(q);
    
            const pendingReferrals = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            setAllAppointments(pendingReferrals);
        } catch (err) {
            console.log(err, "Error fetching pending referrals");
        } finally {
            setLoading(false)
        }
    };


    const getAllOrgs = async () => {
        const orgsRef = collection(db, "users");
    
        try {
            const q = query(orgsRef, where("type", "==", "Organization"));
            const querySnapshot = await getDocs(q);
    
            const orgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            setAllOrgs(orgs);
        } catch (err) {
            console.log(err, "Error fetching Orgs ");
        }
    };

    const getAllIndividuals = async () => {
        const individualRef = collection(db, "users");
    
        try {
            const q = query(individualRef, where("type", "==", "Individual"));
            const querySnapshot = await getDocs(q);
    
            const individuals = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            
            setAllIndividuals(individuals);
        } catch (err) {
            console.log(err, "Error fetching Orgs ");
        }
    };

    const getAllUsers = async () => {
        const usersRef = collection(db, "users");
    
        try {
            const querySnapshot = await getDocs(usersRef);
    
            const allUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            setLeaderBoard(allUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
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



    useEffect(() => {
        getAllAppointments()
        getAllOrgs()
        getAllIndividuals()
        getAllUsers()
    }, [])


    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'line',
            toolbar: { show: false },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val}`,
            },
            min: 0,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        dataLabels: { enabled: false },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ['#A0F9B9'],
                inverseColors: false,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 100],
            },
        },
        grid: {
            strokeDashArray: 4,
        },
        colors: ['#00E396'],
    });

   
    const [seriesData, setSeriesData] = useState([{ name: 'Referrals', data: Array(12).fill(0) }]);


    useEffect(() => {
        const monthlyReferrals = Array(12).fill(0);
    
        allAppointments?.forEach((appointment) => {
            const dateString = appointment?.date;
            if (dateString && appointment?.referrerCode) {
                const [month, day, year] = dateString.split('/').map(Number); // Parse MM/DD/YYYY
                if (month >= 1 && month <= 12) {
                    monthlyReferrals[month - 1] += 1; // Increment referrals for the month
                }
            }
        });
        // allAppointments?.forEach((appointment) => {
        //     const date = new Date(appointment?.date); // Convert to Date object
        //     if (!isNaN(date) && appointment?.referrerCode) {
        //         const month = date.getMonth(); // 0-based index for months (Jan = 0, Dec = 11)
        //         monthlyReferrals[month] += 1;
        //     }
        // });
    
        console.log('Monthly Referrals:', monthlyReferrals);
    
        setSeriesData([{ name: 'Referrals', data: monthlyReferrals }]);
    
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            yaxis: {
                ...prevOptions.yaxis,
                max: Math.max(10, ...monthlyReferrals) + 5, // Dynamic y-axis max
            },
        }));
    }, [allAppointments]);



    const getYear = (dateString) => {
        if (!dateString) return null; // Handle undefined/null cases
        const parts = dateString.split('/'); // Split the date string by '/'
        const year = parts[2]; // Get the year part (3rd element)
        return parseInt(year, 10); // Return year as a number
    };
    
     // Filter appointments by selected year
    const filteredAppointments = allAppointments?.filter(
        (booking) => {
            console.log(booking, "orile")
            return getYear(booking?.date) === selectedYear || 2024
    });



    //Service Graph
      let serviceCount = {};
      filteredAppointments?.forEach((booking) => {
          booking.about.services.forEach(service => {
              if (service) {
                  serviceCount[service] = (serviceCount[service] || 0) + 1;
              }
          });
      });
      
      let rankedServices = Object.entries(serviceCount)
          .sort((a, b) => b[1] - a[1])
          .map(([service, count]) => ({ service, count }));
      
          console.log(rankedServices, "rankedServices")

          const hasData = rankedServices?.length > 0; // Check if there's data

          console.log(hasData, "hasData")
      
    

    const chartData = {
        series: rankedServices.map((item) => item.count),
        options: {
            chart: {
                type: 'donut',
            },
            labels: rankedServices.map((item) => item.service),
            colors: ['#10B981', '#F59E0B', '#34D399', '#F87171', '#A78BFA'],
            legend: {
                show: true,
                position: 'right',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12,
                },
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: hasData, // Show "Total Bookings" only when there's data
                                label: 'Total Bookings',
                                formatter: function () {
                                    return `${allAppointments?.length}`;
                                },
                            },
                        },
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 720,
                    options: {
                        chart: {
                            width: 300,
                        },
                        legend: {
                            position: 'bottom',
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    labels: {
                                        total: {
                                            show: false, // Hide "Total Bookings" label on mobile
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        },
    };



    useEffect(() => {
        setTotalPages(Math.ceil(leaderBoard?.length / leaderboardPerPage));
    }, [leaderBoard, leaderboardPerPage]);

     const indexOfLastLeaderboard = currentPage * leaderboardPerPage;
     const indexOfFirstLeaderboard = indexOfLastLeaderboard - leaderboardPerPage;
     const currentLeaderboard = leaderBoard?.slice(indexOfFirstLeaderboard, indexOfLastLeaderboard);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(leaderBoard?.length / leaderboardPerPage)) {
             setCurrentPage(currentPage + 1);
         }
     };
     
     const handlePrevPage = () => {
         if (currentPage > 1) {
             setCurrentPage(currentPage - 1);
         }
     };

     useEffect(() => {
        const fetchTotals = async () => {
            const totals = {};
            
       
            for (const item of leaderBoard) {
                const total = await getTotal(item.referrerCode);
                totals[item.referrerCode] = total;
            }
            
            // Update the referral totals state
            setReferralTotals(totals);
            
            // Sort leaderboard by referral totals in descending order
            const sortedLeaderboard = [...leaderBoard].sort((a, b) => 
                (totals[b.referrerCode] || 0) - (totals[a.referrerCode] || 0)
            );
            
            setLeaderBoard(sortedLeaderboard);
        };
    
        if (leaderBoard?.length) {
            fetchTotals();
        }
    }, [leaderBoard]);
    

  return (
    <div className='mt-[30px] w-full'>
        <div className='flex flex-col lg:flex-row items-center gap-[10px]'>
            <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Pending Appointments</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allAppointments?.length || 0}</p>
                </div>
            </div>
            <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Orgs</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allOrgs?.length || 0}</p>
                </div>
            </div>
            <div className='w-full lg:w-[336px] rounded-lg h-[167px] border border-[#E0E2E7] flex flex-col py-[11px] px-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-sans text-sm text-[#817F9B]'>Total Individuals</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>{allIndividuals?.length || 0}</p>
                </div>
            </div>
        </div>

        <div className='flex flex-col lg:flex-row items-center gap-5 mt-5'>
            <div className='flex flex-col w-full lg:w-6/12 h-[383px] border border-[#E0E2E7] p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                    <p className='text-[#1C1A3C] font-sans text-[18px] font-medium'>Referral Growth</p>
                </div>
                <div className='mt-4'>
                    <Chart 
                        options={chartOptions} 
                        series={seriesData} 
                        type='line' 
                        height={300} 
                    />
                </div>
            </div>

            <div className='flex flex-col w-full lg:w-8/12 h-[383px] border border-[#E0E2E7] p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                    <p className='text-[#1C1A3C] font-sans text-[18px] font-medium'>Services Rank</p>
                    <div className='flex items-center justify-center gap-4 cursor-pointer border border-[#E5E5EA] rounded-lg p-2 h-auto w-[120px]'>
                        <MdOutlineCalendarToday className='w-4 h-4 text-[#1C1A3C]' />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className='font-sans text-[#1C1A3C] font-medium text-xs cursor-pointer bg-transparent border-none outline-none'
                        >
                            {[2024, 2025, 2026, 2027].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='mt-5 flex items-center flex-col lg:flex-row lg:gap-[98px]'>
                    {hasData ? (
                    <Chart
                        options={chartData?.options}
                        series={chartData?.series}
                        type='donut'
                        width={600}
                        height={240}
                    />
                 ) : (
                     <p className='text-3xl font-sans mx-auto font-medium mt-20'>No Services Available</p>
                 )}
                </div>
            </div>
                   
        </div>

        <div className='flex flex-col mt-[25px] gap-3'>
            <p className='font-semibold text-[#1C1C1E] teaxt-lg'>Leaderboard</p>

            <div className='py-5 w-full overflow-x-auto'>
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
                                <p className='text-sm text-[#333843] font-sans'>Type</p>
                            </th>
                            <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Name</p>
                            </th>
                            <th className='w-[298px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Email/Phone</p>
                            </th>
                            <th className='w-[157px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Total</p>
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
                            currentLeaderboard?.length > 0 ?
                            currentLeaderboard.map((item, index) => (
                                <tr key={index} className='w-full mt-[18px] border cursor-pointer border-[#F0F1F3]'>
                                    
                                    <td className='w-[143px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-semibold text-sm'>{`#${index + 1}`}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-sans text-[#333843] font-medium text-sm'>
                                                {new Date(item?.createdAt?.seconds * 1000).toLocaleDateString()}
                                            </p>
                                            <p className='font-sans text-[#333843] font-medium text-sm'>
                                                {new Date(item?.createdAt?.seconds * 1000).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.type}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.fullName}</p>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-normal text-sm '>{item?.emailOrPhone}</p>      
                                    </td>
                                    
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium' onClick={() => navigate("/referrals/details", {state: item})}>
                                        <p className='font-sans text-[#2D84FF] font-medium text-sm'>
                                            {referralTotals[item.referrerCode] || 0}
                                        </p>
                                    </td>
            
                                </tr>
            
                            )) : (
                                <tr className='h-[300px] bg-white border-t border-grey-100'>
                                    <td colSpan="8" className="relative">
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <div className='flex flex-col gap-2 items-center'>
                                                <p className='text-[#0C1322] font-medium text-[20px] font-inter'>No Leaderboard</p>
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

export default SuperAdminDashboard