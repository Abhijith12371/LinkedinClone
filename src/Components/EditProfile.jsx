import React, { useContext, useEffect, useState } from "react";
import { storage, db } from '../../firebase'; // Import your Firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { UserContext } from "../Context/context";

const EditProfile = ({ user, onClose }) => {
    const { fetchProfile } = useContext(UserContext); // Fetch profile function from context
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator

    // Fetch user data from Firestore on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const userDocRef = doc(db, 'Users', user?.email);
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setUsername(userData.username || '');
                setEmail(userData.email || '');
                setIsExistingUser(true);
            } else {
                setIsExistingUser(false);
            }
        };
        fetchUserData();
    }, [user?.email]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username && !email && !image) {
            toast.error("Please complete at least one field.");
            return;
        }

        setLoading(true); // Set loading to true

        let imageUrl = null;
        if (image) {
            const imageRef = ref(storage, `profileImages/${user?.email}`);
            await uploadBytes(imageRef, image);
            imageUrl = await getDownloadURL(imageRef);
        }

        try {
            const userDocRef = doc(db, 'Users', user?.email);
            await updateDoc(userDocRef, {
                ...(username && { username }),
                ...(email && { email }),
                ...(imageUrl && { profilePic: imageUrl }),
            });

            // Trigger a re-fetch of the user's profile data
            await fetchProfile(user.uid); // Pass the user UID to re-fetch

            toast.success("Profile updated successfully.");
            onClose(); // Close the modal or component after update
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false); // Set loading to false after completion
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">{isExistingUser ? "Edit Profile" : "Set Up Profile"}</h2>
                {loading ? ( // Show loading indicator if loading
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2">
                            <span className="text-gray-700">Username:</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isExistingUser}
                                disabled={isExistingUser}
                                className="block w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            <span className="text-gray-700">Email:</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={!isExistingUser}
                                disabled={isExistingUser}
                                className="block w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block mb-4">
                            <span className="text-gray-700">Profile Image:</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full mt-1" />
                        </label>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            {isExistingUser ? "Update Profile" : "Save Profile"}
                        </button>
                    </form>
                )}
                <button onClick={onClose} className="mt-4 w-full text-gray-500 underline">Close</button>
            </div>
        </div>
    );
};

export default EditProfile;
