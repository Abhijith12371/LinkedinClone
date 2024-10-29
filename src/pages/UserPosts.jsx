import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import UserPost from "../Components/UserPost";
import { UserContext } from '../Context/context';

const UserPosts = () => {
  const [posts, setPostList] = useState([]);
  const { user } = useContext(UserContext);
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.uid) return; // Ensure user ID is available before fetching
  
    try {
      const postCollection = collection(db, "posts"); // Get a reference to the posts collection
      const unsubscribe = onSnapshot(postCollection, (snapshot) => {
        // Map through each document in the snapshot to create an array of posts
        const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        setPostList(postList); // Update state with all posts for the user
        console.log("The post list is",postList); // Log the fetched posts to verify
      });
  
      return () => unsubscribe(); // Cleanup on unmount to prevent memory leaks
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map(post => (
          <UserPost key={post.id} id={post.id} description={post.description} image={post.image} userImage={post.userImage} username={post.name} createdat={post.createdAt}/>
        ))
      )}
    </div>
  );
};

export default UserPosts;
