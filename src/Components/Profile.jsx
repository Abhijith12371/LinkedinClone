import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userName, headline, location, bio, profilePic }) => {
    const navigate=useNavigate()
    const handleEdit=()=>{
        navigate('/profile')
    }
    return (
        <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-6 mt-5">
           
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
                    <h2 className="text-xl font-bold text-gray-800">{userName || "Your Name"}</h2>
                    <p className="text-gray-600">{headline || "Your Headline"}</p>
                    <p className="text-sm text-gray-500">{location || "Your Location"}</p>
                </div>
            </div>

            {/* Profile Bio */}
            <div className="mb-4">
                <p className="text-gray-800">
                    {bio || "This is your bio. You can talk about your skills, experience, and more here."}
                </p>
            </div>

            {/* Edit Profile Button */}
            <div className="text-right">
                <button className="flex items-center justify-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100">
                    <AiOutlineEdit className="mr-2" onClick={handleEdit} />
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
