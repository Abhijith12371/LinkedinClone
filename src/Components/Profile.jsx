import React, { useContext, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../Context/context';
import { auth, db } from '../../firebase';

const Profile = ({ darkMode }) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState({});
    const email = auth.currentUser?.email;

    const fetchUserData = async () => {
        if (email) {
            try {
                // Fetch the user document based on the user's email
                const userDocRef = doc(db, "Users", email);
                const userDoc = await getDoc(userDocRef);
                console.log(userDoc.data())
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [email]);

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
                    {userData.profilePic ? (
                        <img
                            src={userData.profilePic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                    ) : (
                        <FaUserCircle className="text-gray-400 w-24 h-24" />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{userData.name || "Your Name"}</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        {userData.email || "Your Location"}
                    </p>
                </div>
            </div>

            {/* Profile Bio */}
            {/* <div className="mb-4">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-800'}>
                    {userData.bio || "This is your bio. You can talk about your skills, experience, and more here."}
                </p>
            </div> */}

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
