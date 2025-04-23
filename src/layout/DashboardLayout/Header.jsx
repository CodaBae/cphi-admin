import React, { useEffect, useState, useRef } from 'react';
import Note from "../../assets/svg/note.svg";
import Bell from "../../assets/svg/bell.svg";
import { IoSearch } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
    const [search, setSearch] = useState("");
    const [activity, setActivity] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const panelRef = useRef(null);

    const navigate = useNavigate();

    const getNotifications = async () => {
        try {
            const activityRef = collection(db, "activity");
            const querySnapshot = await getDocs(activityRef);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivity(data);
        } catch (err) {
            console.log("Failed to fetch doc", err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const docRef = doc(db, "activity", id);
            await deleteDoc(docRef);
            setActivity(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.log("Failed to delete notification", err);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            const activityRef = collection(db, "activity");
            const querySnapshot = await getDocs(activityRef);
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            setActivity([]);
        } catch (err) {
            console.log("Failed to delete all notifications", err);
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsPanelOpen(false);
            }
        };

        if (isPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelOpen]);

    return (
        <div className='py-[18px] px-[28px] h-[72px] flex items-center justify-between'>
            <div className="flex items-center gap-2">
                <GiHamburgerMenu className="w-6 h-6 text-[#000] lg:hidden cursor-pointer" onClick={toggleSidebar} />
                <img src={Note} alt="Note" className="w-[28px] h-[28px]" />
                <p className="font-euclid text-[#00000066] cursor-pointer text-sm">Dashboard</p>
            </div>

            <div className='flex items-center gap-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-[100px] lg:w-[254px] invisible flex items-center bg-[#0000000D] rounded-lg h-[36px] '>
                        <div className='bg-[#0000000D] h-full rounded-tl-lg rounded-bl-lg flex items-center p-2'>
                            <IoSearch className='w-4 h-4 text-[#00000066]' />
                        </div>
                        <input 
                            name='search'
                            value={search}
                            className='w-full bg-[#0000000D] h-full rounded-tr-lg rounded-br-lg p-2 outline-none'
                            placeholder='Search'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className='cursor-pointer relative' onClick={() => setIsPanelOpen(!isPanelOpen)}>
                        <img src={Bell} alt='Bell' className='w-5 h-5' />
                        {activity?.length > 0 && (
                            <div className='bg-[#27AE60] w-5 h-5 absolute bottom-3 right-0 rounded-full p-1.5 flex items-center justify-center'>
                                <p className='text-[#fff] font-inter text-xs font-medium'>{activity?.length}</p>
                            </div>
                        )}
                    </div>

                    {/* {isPanelOpen && (
                        <div
                            ref={panelRef}
                            className='bg-[#fff] w-[300px] h-[500px] overflow-y-scroll p-2 flex flex-col gap-2 shadow-2xl absolute top-6 right-10'
                        >
                            {activity?.length > 0 ? (
                                activity?.map((item) => (
                                    <p 
                                        key={item?.id} 
                                        className='text-[#000] font-sans cursor-pointer' 
                                        onClick={() => {
                                            deleteNotification(item.id);
                                            navigate("/client/details", { state: item });
                                        }}
                                    >
                                        {`${item.profile.fullName} booked an appointment`}
                                    </p>
                                ))
                            ) : (
                                <p className='text-[#000] font-sans'>No New Notification</p>
                            )}
                        </div>
                    )} */}
                    {isPanelOpen && (
                        <div
                            ref={panelRef}
                            className='bg-[#fff] w-[300px] h-[500px] flex flex-col shadow-2xl absolute top-6 right-10'
                        >
                            {/* Panel Header */}
                            <div className="flex justify-between items-center p-2 border-b">
                                <h3 className="font-semibold text-[#000]">Notifications</h3>
                                <button 
                                    onClick={deleteAllNotifications}
                                    className="text-[#000] text-sm cursor-pointer hover:text-gray-600"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {activity?.length > 0 ? (
                                    activity?.map((item) => (
                                        <p 
                                            key={item?.id} 
                                            className='text-[#000] font-sans cursor-pointer p-2 hover:bg-gray-100 rounded'
                                            onClick={() => {
                                                deleteNotification(item.id);
                                                navigate("/client/details", { state: item });
                                            }}
                                        >
                                            {`${item.profile.fullName} booked an appointment`}
                                        </p>
                                    ))
                                ) : (
                                    <p className='text-[#000] font-sans p-2'>No New Notifications</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;

