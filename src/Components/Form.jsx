import React, { useContext, useState } from 'react';
import { auth,db } from '../../firebase.js';
import { doc } from 'firebase/firestore';
import { setDoc,getDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../Context/context.jsx';

const Form = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [LinkedINuser,setLinkedInUser]=useState()
    const {user,profile}=useContext(UserContext)
    const navigate=useNavigate()

    const toggleForm = () => {
        setIsLogin(prev => !prev);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            // Check if the username already exists in the Users collection
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("name", "==", userName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                navigate('/'); // Redirect to homepage if username is taken
                toast.error("Username taken. Please choose another one.");
                return;
            }

            // Proceed with creating the user account
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            toast.success("User created");

            if (user) {
                await setDoc(doc(db, "Users", email), {
                    email: email,
                    name: userName,
                });
            }

        } catch (err) {
            toast.error(err.message.split("/").join(" ").split("-").join(" "));
        } 
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully");
            setLinkedInUser(user)
        } catch (err) {
            toast.error(err.message);
        }
        finally{
            navigate("/home")
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-center text-blue-600">LinkedIn</h1>
                {isLogin ? (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full p-2 mt-4 border border-gray-300 rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full p-2 mt-2 border border-gray-300 rounded"
                            />
                            <button
                            onClick={handleLogin}
                                type="submit"
                                className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
                            >
                                Sign In
                            </button>
                        </form>
                        <p className="mt-4 text-center">
                            Don't have an account?{' '}
                            <button className="text-blue-600" onClick={toggleForm}>
                                Register now
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Register</h2>
                        <form onSubmit={handleSignup}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full p-2 mt-4 border border-gray-300 rounded"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full p-2 mt-2 border border-gray-300 rounded"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full p-2 mt-2 border border-gray-300 rounded"
                            />
                            <button
                                type="submit"
                                className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
                            >
                                Join now
                            </button>
                        </form>
                        <p className="mt-4 text-center">
                            Already have an account?{' '}
                            <button className="text-blue-600" onClick={toggleForm}>
                                Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
