import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import toast from 'react-hot-toast';
import { FaSun, FaMoon, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const Nav = () => {
    const { user, darkMode, toggleDarkMode, setNewMessageNotification } = useContext(UserContext);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const chatId = user.email;
            const messagesRef = collection(db, "messages");
            const q = query(
                messagesRef,
                where("receiverEmail", "==", chatId),
                where("read", "==", false)
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setUnreadMessages(snapshot.docs.length);
            }, (error) => {
                console.error("Error fetching unread messages:", error);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                toast.success("Logged Out Successfully");
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                toast.error("Failed to log out. Please try again.");
            });
    };

    const handleNotificationClick = () => {
        setUnreadMessages(0);
        setNewMessageNotification(false);
        navigate("/messages");
    };

    return (
        <nav className={`shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
            <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">LinkedIn Clone</h1>
                
                {/* Mobile Menu Icon */}
                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
                        {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                    </button>
                </div>

                {/* Navigation Links */}
                <ul className={`flex-col lg:flex-row lg:flex space-y-2 lg:space-y-0 lg:space-x-4 absolute lg:static ${menuOpen ? 'top-14' : 'top-[-500px]'} lg:top-auto bg-white lg:bg-transparent lg:text-gray-700 w-full lg:w-auto transition-all duration-300 ease-in lg:transition-none`}>
                    <li><Link to="/home" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Home">Home</Link></li>
                    {/* <li><Link to="/profile" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Profile">Profile</Link></li> */}
                    <li><Link to="/posts" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Posts">Posts</Link></li>
                    <li><Link to="/activity" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Activity">Activity</Link></li>
                    <li><Link to="/jobs" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Jobs">Jobs</Link></li>
                    <li><Link to="/myjobs" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="My Jobs">My Jobs</Link></li>
                    <li><Link to="/messages" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Messages">Messages</Link></li>
                </ul>

                {/* Right Side Icons and Buttons */}
                <div className="flex space-x-2 items-center">
                    {/* Notification Icon */}
                    <div className="relative" onClick={handleNotificationClick}>
                        <FaBell className="text-2xl cursor-pointer" aria-label="Unread Messages Notification" />
                        {unreadMessages > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 h-4 w-4 text-xs text-white bg-red-500 rounded-full">
                                {unreadMessages}
                            </span>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button onClick={toggleDarkMode} className="text-xl focus:outline-none" aria-label="Toggle Dark Mode">
                        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-500" />}
                    </button>

                    {/* Auth Buttons */}
                    {user && user.uid ? (
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" 
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" aria-label="Login">Login</Link>
                            <Link to="/register" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" aria-label="Register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
