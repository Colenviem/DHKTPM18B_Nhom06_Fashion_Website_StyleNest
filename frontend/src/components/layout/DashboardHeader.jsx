
import React from 'react';
import { FiSearch } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {

    const { authUser } = useAuth();
    console.log(authUser)

    return (
        <div
            className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b border-gray-200
            fixed top-0 left-64 right-0 z-10"
        >
            <h1 className="text-2xl font-semibold text-gray-800">Bảng điều khiển</h1>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="leading-tight">
                        <p className="font-medium text-gray-800">
                            {authUser ? authUser.firstName+ " " + authUser.lastName : 'Loading...'}
                        </p>
                        <p className="text-sm text-gray-500">
                            {authUser ? authUser.role : 'Guest'}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;