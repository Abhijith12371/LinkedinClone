import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/context';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import { FaSun, FaMoon } from 'react-icons/fa';

const Nav = () => {
    const { user, darkMode, toggleDarkMode } = useContext(UserContext); // Use darkMode from UserContext
    const navigate = useNavigate();

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
        console.log("User logged out");
    };

    return (
        <nav className={`shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">LinkedIn Clone</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/home" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Profile">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/posts" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Posts">
                            Posts
                        </Link>
                    </li>
                    <li>
                        <Link to="/activity" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Activity">
                            Activity
                        </Link>
                    </li>
                    <li>
                        <Link to="/jobs" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Jobs">
                            Jobs
                        </Link>
                    </li>
                    <li>
                        <Link to="/myjobs" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="My Jobs">
                            My Jobs
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages" className={`hover:text-blue-600 ${darkMode ? 'text-white' : 'text-gray-700'}`} aria-label="Messages">
                            Messages
                        </Link>
                    </li>
                </ul>
                <div className="flex space-x-2 items-center">
                    <button onClick={toggleDarkMode} className="text-xl focus:outline-none" aria-label="Toggle Dark Mode">
                        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-500" />}
                    </button>
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
                            <Link
                                to="/"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                                aria-label="Login"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                aria-label="Register"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
