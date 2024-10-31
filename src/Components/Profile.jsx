import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userName, headline, location, bio, profilePic, darkMode }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/profile');
    };

    return (
        <div
            className={`max-w-lg mx-auto border rounded-lg shadow-md p-6 mt-5 
            ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
        >
            <div className="flex items-center mb-4">
                <div className="mr-4">
                    {profilePic ? (
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                    ) : (
                        <FaUserCircle className="text-gray-400 w-24 h-24" />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{userName || "Your Name"}</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {headline || "Your Headline"}
                    </p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        {location || "Your Location"}
                    </p>
                </div>
            </div>

            {/* Profile Bio */}
            <div className="mb-4">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-800'}>
                    {bio || "This is your bio. You can talk about your skills, experience, and more here."}
                </p>
            </div>

            {/* Edit Profile Button */}
            <div className="text-right">
                <button
                    className={`flex items-center justify-center px-4 py-2 border rounded-lg 
                    ${darkMode ? 'text-blue-300 border-blue-300 hover:bg-blue-700' : 'text-blue-600 border-blue-600 hover:bg-blue-100'}`}
                    onClick={handleEdit}
                >
                    <AiOutlineEdit className="mr-2" />
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
