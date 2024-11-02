import React, { useContext, useEffect, useState } from 'react';
import Profile from '../Components/Profile';
import TrendingNow from '../Components/TrendingNow';
import Create from '../Components/Create';
import UserPost from "../Components/UserPost";
import { UserContext } from '../Context/context';
import toast from 'react-hot-toast';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase'; // Import your Firebase auth module

const Home = () => {
  const { profile, post, error, darkMode } = useContext(UserContext);
  const [userData, setUserData] = useState(null); // State to hold user data

  const loading = post === null; // Set loading based on post data availability

  // Function to fetch user data based on the logged-in user's email
  const getUserData = async (email) => {
    try {
      const q = query(collection(db, 'Users'), where('email', '==', email)); // Query to find user by email
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      const fetchedData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email
      }));
      
      console.log(fetchedData); // Check fetched data in console
      setUserData(fetchedData[0]); // Store the user data (only one user should match)
    } catch (error) {
      console.error("Error fetching user data: ", error);
      toast.error("Failed to load user data."); // Show error toast
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const user = auth.currentUser; // Get the current logged-in user
    if (user) {
      getUserData(user.email); // Call the function with the user's email
    } else {
      console.log("No user is logged in.");
    }
  }, []);

  return (
    <div className={`flex flex-col md:flex-row justify-center items-start gap-6 px-4 md:px-10 py-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen`}>
      <div className="w-full md:w-1/4">
        <Profile 
          userName={userData ? userData.name : "Loading..."} // Use fetched user data
          headline={profile ? profile.headline : "Loading..."} 
          location={profile ? profile.location : "Loading..."} 
          bio={profile ? profile.description : "Loading..."} 
          profilePic={profile ? profile.image : "defaultProfilePic.jpg"} // Default image
          darkMode={darkMode}
        />
      </div>
      <div className="w-full md:w-2/4">
        <Create darkMode={darkMode} image={profile ? profile.image : "defaultProfilePic.jpg"} />
        <div>
          {loading ? (
            <p>Loading posts...</p>
          ) : error?.post ? (
            <p>{error.post}</p>
          ) : post.length === 0 ? (
            <p>No posts available</p>
          ) : (
            post.map((userposts) => (
              <UserPost 
                key={userposts.id} 
                id={userposts.id} 
                description={userposts.description || "No description available"} 
                image={userposts.image || "defaultImage.jpg"} 
                userImage={userposts.userImage}
                username={userposts.name}
                createdat={userposts.createdAt}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="w-full md:w-1/4 hidden lg:block">
        <TrendingNow darkMode={darkMode}/>
      </div>
    </div>
  );
};

export default Home;
