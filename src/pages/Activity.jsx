// Activity.jsx
import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { UserContext } from '../Context/context';
import UserPost from "../Components/UserPost";
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';

const Activity = () => {
  const [view, setView] = useState("myPosts"); // toggle view: "myPosts" or "liked"
  const [posts, setPosts] = useState([]);
  const { user, darkMode } = useContext(UserContext);

  // Fetch the user's own posts
  const fetchMyPosts = async () => {
    try {
      const postCollection = collection(db, "posts");
      const unsubscribe = onSnapshot(postCollection, (snapshot) => {
        const userPosts = snapshot.docs
          .filter(doc => doc.data().userId === user.uid) // filter for user's posts
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  // Fetch liked or commented posts
  const fetchLikedCommentedPosts = async () => {
    try {
      const likesRef = collection(db, "userLikes");
      const likesSnapshot = await getDocs(likesRef);
      const likedPostIds = likesSnapshot.docs
        .filter(doc => doc.data().userId === user.uid && doc.data().like)
        .map(doc => doc.data().postId);

      const likedPostsPromises = likedPostIds.map(postId =>
        getDoc(doc(db, "posts", postId))
      );

      const likedPosts = (await Promise.all(likedPostsPromises))
        .filter(post => post.exists())
        .map(post => ({ id: post.id, ...post.data() }));

      setPosts(likedPosts);
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  // Handle toggling between views
  useEffect(() => {
    if (view === "myPosts") {
      fetchMyPosts();
    } else {
      fetchLikedCommentedPosts();
    }
  }, [view, user]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen p-4`}>
      <div className="flex justify-around mt-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${view === "myPosts" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setView("myPosts")}
        >
          My Posts
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${view === "liked" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setView("liked")}
        >
          Liked/Commented
        </button>
      </div>

      <div>
        {posts.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{view === "myPosts" ? "No posts uploaded yet" : "No liked/commented posts"}</p>
        ) : (
          posts.map(post => (
            <UserPost 
              key={post.id}
              id={post.id}
              description={post.description || "No description available"}
              image={post.image || "defaultImage.jpg"}
              userImage={post.userImage}
              username={post.name}
              createdat={post.createdAt}
              darkMode={darkMode} // pass darkMode to UserPost
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Activity;
