import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Helper function to generate page numbers
    const getPageNumbers = (currentPage, totalPages) => {
        if (totalPages <= 10) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [1];
        const startWindow = Math.max(2, currentPage - 2);
        const endWindow = Math.min(totalPages - 1, currentPage + 2);

        if (startWindow > 2) {
            pages.push('...');
        }

        for (let i = startWindow; i <= endWindow; i++) {
            pages.push(i);
        }

        if (endWindow < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);
        return pages;
    };

  return (
    <div className='w-full flex items-center justify-between p-5 -z-10'>
        <div className='bg-[#FAFAFE] w-[136px] h-[40px] flex items-center justify-center'>
            <p className='font-sans text-[#667085] text-base'>Page {currentPage} of {totalPages}</p>
        </div>

        <div>
            <div className='flex h-[34px] justify-center w-full gap-2 items-center'>
                <div 
                    onClick={handlePrevPage} 
                    className={`bg-[#FAFAFE] transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full ${
                        currentPage === 1 && 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    <IoIosArrowBack className='text-[#667085] hover:text-[#fff]'/>
                </div>

                {getPageNumbers(currentPage, totalPages).map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <div 
                            key={index}
                            className="transition-all duration-500 ease-in-out flex justify-center items-center w-8 h-full text-[#667085]"
                        >
                            ...
                        </div>
                    ) : (
                        <div 
                            key={index}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full ${
                                currentPage === pageNumber 
                                    ? 'bg-[#2D84FF] text-white'
                                    : 'bg-[#FAFAFE] hover:bg-[#FAFAFE]'
                            }`}
                        >
                            {pageNumber}
                        </div>
                    )
                ))}

                <div 
                    onClick={handleNextPage} 
                    className={`bg-[#FAFAFE] transition-all duration-500 ease-in-out flex justify-center items-center cursor-pointer w-8 h-full ${
                        currentPage === totalPages && 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    <IoIosArrowForward className='text-[#667085] hover:text-[#fff]'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Pagination