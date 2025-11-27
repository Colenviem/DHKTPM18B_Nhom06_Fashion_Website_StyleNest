
import React from 'react';
import { FiSearch } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {

    const { authUser } = useAuth();

    return (
        <div
            className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b border-gray-200
            fixed top-0 left-64 right-0 z-10"
        >
            <h1 className="text-2xl font-semibold text-gray-800">Bảng điều khiển</h1>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-64"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="avatar"
                        className="rounded-full w-10 h-10 ring-2 ring-indigo-400 p-0.5 object-cover"
                    />
                    <div className="leading-tight">
                        <p className="font-medium text-gray-800">
                            {authUser ? authUser.userName : 'Loading...'}
                        </p>
                        <p className="text-sm text-gray-500">
                            {/*{authUser ? authUser.role : 'Guest'}*/}
                            ADMIN
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;