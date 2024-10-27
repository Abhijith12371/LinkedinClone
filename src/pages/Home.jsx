import React, { useContext } from 'react';
import Profile from '../Components/Profile';
import TrendingNow from '../Components/TrendingNow';
import Create from '../Components/Create';
import UserPost from "../Components/UserPost";
import { UserContext } from '../Context/context';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, profile, post, error } = useContext(UserContext); // Accessing user, profile, posts, and error from UserContext
  const loading = post === null; // Set loading based on post data availability

  console.log("this is the profile yo", profile);

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-6 px-4 md:px-10 py-6 bg-gray-100 min-h-screen">
      <div className="w-full md:w-1/4">
        <Profile 
          userName={profile ? profile.username : "Loading..."} // Use profile data
          headline={profile ? profile.headline : "Loading..."} 
          location={profile ? profile.location : "Loading..."} 
          bio={profile ? profile.bio : "Loading..."} 
          profilePic={profile ? profile.image : "defaultProfilePic.jpg"} // Default image
        />
      </div>
      <div className="w-full md:w-2/4">
        <Create image={profile ? profile.image : "defaultProfilePic.jpg"} />
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
              />
            ))
          )}
        </div>
      </div>
      
      <div className="w-full md:w-1/4 hidden lg:block">
        <TrendingNow />
      </div>
    </div>
  );
};

export default Home;
