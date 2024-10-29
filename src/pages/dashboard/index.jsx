import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import Chart from 'react-apexcharts';
import { MdOutlineCalendarToday } from 'react-icons/md'

import Activity from "../../assets/svg/activity.svg"

import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [leaderboardPerPage] = useState(8)
    const [totalPages, setTotalPages] = useState(1);
 

    const [chartOptions, setChartOptions] = useState({
        chart: {
          type: 'line',
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: 'smooth', // Makes the line smooth
          width: 3, // Thickness of the line
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
        },
        yaxis: {
          labels: {
            formatter: (val) => `${val}k`, // Adds 'k' for thousands
          },
          min: 0,
          max: 120, // Max limit of the Y axis
        },
        dataLabels: {
          enabled: false, // Disable data points on the line
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#A0F9B9'], // Gradient to a lighter green
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 100],
          },
        },
        grid: {
          strokeDashArray: 4, // Dotted lines in the background
        },
        colors: ['#00E396'], // Line color
      });
    
      const [chartSeries, setChartSeries] = useState([
        {
          name: 'Revenue',
          data: [60, 75, 55, 90, 80, 70, 95, 85, 110, 100, 105, 115], // Sample data points
        },
      ]);


      const chartData = {
        series: [115900, 57000], // Completed, Pending, Overdue
        options: {
          chart: {
            type: 'donut',
          },
          labels: ['Pay In', 'Pay out'],
          colors: ['#10B981', '#F59E0B'], // Colors for the segments
          legend: {
            show: false,
            position: 'right',
            markers: {
              width: 12,
              height: 12,
              radius: 12,
            },
          },
          dataLabels: {
            enabled: false,
            formatter: function (val, opts) {
              return `${val.toFixed(0)}%`;
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Services',
                    formatter: function () {
                      return '500';
                    },
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      };


      const data = [
        {
            id: "#302010",
            date: "12/8/2024",
            name: "Heala Tech",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            type: "Individual",
            total: 5
        },
        {
            id: "#302011",
            date: "12/8/2024",
            name: "Joy Johnson",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            type: "Organization",
            total: 5
        },
        {
            id: "#302012",
            date: "12/8/2024",
            name: "John Bushmill",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            type: "Individual",
            total: 5
        },
        {
            id: "#302013",
            date: "12/8/2024",
            name: "John Doe",
            email: "mercy.p@mail.com",
            phone: "09034543234",
            type: "Organization",
            total: 5
        },
    ] 

    useEffect(() => {
        // Update total pages whenever filteredOrders changes
        setTotalPages(Math.ceil(data.length / leaderboardPerPage));
    }, [leaderboardPerPage]);

     // Calculate indices for paginated data
     const indexOfLastProduct = currentPage * leaderboardPerPage;
     const indexOfFirstProduct = indexOfLastProduct - leaderboardPerPage;
     const currentLeaderboard = data?.slice(indexOfFirstProduct, indexOfLastProduct);
 
     const handleNextPage = () => {
         if (currentPage < Math.ceil(currentLeaderboard?.length / leaderboardPerPage)) {
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
                    <p className='font-sans text-sm text-[#817F9B]'>Total Orgs</p>
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
                    <p className='font-sans text-sm text-[#817F9B]'>Total Refferal</p>
                    <div className='w-[44px] h-[44px] rounded-lg bg-[#5856D61A] p-2 flex items-center justify-center'>
                        <img src={Activity} alt='Activity' className='w-5 h-5' />
                    </div>
                </div>
                <div className='flex flex-col mt-3 gap-5'>
                    <p className='font-sans text-[#1C1C1C] text-[30px] font-semibold'>23</p>
                </div>
            </div>
        </div>

        <div className='flex items-center gap-5 mt-5'>
            <div className='flex flex-col w-6/12 h-[383px] border border-[#E0E2E7] p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
                <p className='text-[#1C1A3C] font-sans text-[18px] font-medium'>Referral Growth</p>
                <div className='flex items-center justify-center gap-4 border border-[#E5E5EA] rounded-lg h-[42px] w-[80px]'>
                    <p className='font-sans text-[#1C1A3C] font-medium text-xs'>Orgs</p>
                    <IoIosArrowDown className='w-5 h-5 text-[#1C1A3C]' />
                </div>
            </div>
            <div className='mt-4'>
                <Chart options={chartOptions} series={chartSeries} type='line' height={300} />
            </div>
            </div>

            <div className='flex flex-col w-8/12 h-[383px] border border-[#E0E2E7] p-4 rounded-lg'>
                <div className='flex items-center justify-between'>
                    <p className='text-[#1C1A3C] font-sans text-[18px] font-medium'>Services Rank</p>
                    <div className='flex items-center justify-center gap-4 border border-[#E5E5EA] rounded-lg h-[32px] w-[80px]'>
                        <MdOutlineCalendarToday className='w-4 h-4 text-[#1C1A3C]' />
                        <p className='font-sans text-[#1C1A3C] font-medium text-xs'>2024</p>
                    </div>
                </div>
                <div className='mt-5 flex items-center gap-[98px]'>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type='donut'
                        height={240}
                    />
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-start gap-4'>
                            <div className='w-[8px] h-[8px] rounded-full mt-1 bg-[#1EC677]'></div>
                            <div className='flex flex-col'>
                                <p className='font-sans text-[#AEAEB2] text-xs'>HIV</p>
                                <p className='text-base font-sans font-semibold'>300</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4'>
                            <div className='w-[8px] h-[8px] rounded-full mt-1 bg-[#FFB752]'></div>
                            <div className='flex flex-col'>
                                <p className='font-sans text-[#AEAEB2] text-xs'>HPV</p>
                                <p className='text-base font-sans font-semibold'>40</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div className='flex flex-col mt-[25px] gap-3'>
            <p className='font-semibold text-[#1C1C1E] teaxt-lg'>Leaderboard</p>

            <div className='py-5 w-full'>
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
                                <p className='text-sm text-[#333843] font-sans'>Email</p>
                            </th>
                            <th className='w-[268px] h-[18px] text-left text-sm font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Phone</p>
                            </th>
                            <th className='w-[157px] h-[18px] text-left font-sans text-[#333843] p-4 font-medium '>
                                <p className='text-sm text-[#333843] font-sans'>Total</p>
                            </th>
                          
                        </tr>
                    </thead>
                    <tbody className=''>
                        {
                            currentLeaderboard.map((item) => (
                                <tr key={item.id} className='w-full mt-[18px] border cursor-pointer border-[#F0F1F3]'>
                                    
                                    <td className='w-[143px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-semibold text-sm'>{item?.id}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm'>{item?.date}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.type}</p>
                                    </td>
                                    <td className='w-[147px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm '>{item?.name}</p>
                                    </td>
                                    <td className='w-[198px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#667085] font-normal text-xs '>{item?.email}</p>
                                        
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#333843] font-medium text-sm'>{item?.phone}</p>
                                    </td>
                                    <td className='w-[168px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <p className='font-sans text-[#2D84FF] font-medium text-sm'>{item?.total}</p>
                                    </td>
                                
                                    {/* 
                                    <td className='w-[169px] h-[56px] text-left font-sans text-[#333843] p-4 font-medium '>
                                        <div className='flex items-center gap-[10px]'>
                                            <VscEdit className='cursor-pointer text-[#667085] text-[17px]' onClick={() => navigate("/invoices/edit")}/>
                                            <IoEyeOutline className="text-[17px] text-[#667085] cursor-pointer" onClick={() => navigate("/invoices/view")}/>
                                            <TbDownload className="text-[17px] text-[#667085] cursor-pointer" />
                                            <RiDeleteBin6Line className="text-[17px] text-[#667085] cursor-pointer" onClick={() => setOpenDelete(true)} />
                                        </div>
                                    </td> */}
            
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

export default Dashboard