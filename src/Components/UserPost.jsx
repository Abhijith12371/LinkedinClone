import React, { useContext, useEffect, useState } from "react";
import { FaUserCircle, FaThumbsUp, FaCommentAlt, FaShare, FaPaperPlane } from "react-icons/fa";
import { db } from "../../firebase";
import { UserContext } from "../Context/context";
import toast from "react-hot-toast";
import { setDoc, doc, getDoc, addDoc, collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

const UserPost = (props) => {
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const { user,profile } = useContext(UserContext);

  // Format Firestore timestamp
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return "Just now";
  };

  // Handle like button
  async function handleLike() {
    if (loading) return;
    setLoading(true);

    const updatedLikeState = !like;
    setLike(updatedLikeState);

    try {
      await setDoc(doc(db, "userLikes", `${user.uid}_${props.id}`), {
        userId: user.uid,
        postId: props.id,
        like: updatedLikeState,
      });
      toast.success(updatedLikeState ? "Liked" : "Unliked");
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("An error occurred while updating the like");
      setLike(!updatedLikeState); // Revert like state if there’s an error
    } finally {
      setLoading(false);
    }
  }

  // Fetch initial like status for the post
  useEffect(() => {
    const fetchLikedData = async () => {
      if (!user?.uid || !props.id) return;

      try {
        const likeDoc = await getDoc(doc(db, "userLikes", `${user.uid}_${props.id}`));
        if (likeDoc.exists()) {
          setLike(likeDoc.data().like);
        }
      } catch (err) {
        console.error("Error fetching like data:", err);
      }
    };

    fetchLikedData();
  }, [user, props.id]);

  // Fetch comments for the post
  useEffect(() => {
    const commentsCollection = collection(db, "posts", props.id, "comments");
    const unsubscribe = onSnapshot(commentsCollection, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [props.id]);

  // Add a comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = {
        text: commentText,
        userId: user.uid,
        username: profile.username || "Anonymous",
        createdAt: new Date(),
      };
      await addDoc(collection(db, "posts", props.id, "comments"), newComment);
      setCommentText(""); // Clear the input field
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Could not add comment.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4 mt-5 mb-6">
      <div className="flex items-center mb-4">
        {props.userImage ? (
          <img
            className="w-12 h-12 rounded-full mr-3"
            src={props.userImage}
            alt={`${props.username || "User"}'s profile`}
          />
        ) : (
          <FaUserCircle className="text-gray-400 w-12 h-12 mr-3" />
        )}
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">
            {props.username || "User"}
          </span>
          <span className="text-sm text-gray-500">
            {formatTimestamp(props.createdat)} • 🌐
          </span>
        </div>
      </div>

      {/* UserPost Content */}
      <div className="post-content">
        <p className="text-gray-800 mb-4">{props.description}</p>
        <img
          src={
            props.image ||
            "https://img.freepik.com/free-psd/minimalist-curriculum-instagram-post-template_23-2149363288.jpg?semt=ais_hybrid"
          }
          alt="Post content"
          className="w-full rounded-lg mt-4"
        />
      </div>

      {/* UserPost Actions */}
      <div className="flex justify-around pt-4 border-t border-gray-200 text-sm text-gray-600">
        <button
          className={`flex items-center ${like ? "text-blue-600" : ""}`}
          onClick={handleLike}
          disabled={loading}
        >
          <FaThumbsUp className={`mr-2 ${like ? "text-blue-600" : ""}`} />
          {loading ? "Loading..." : "Like"}
        </button>
        <button className="flex items-center hover:text-blue-600 transition duration-200 ease-in-out">
          <FaCommentAlt className="mr-2" />
          Comment
        </button>
        <button className="flex items-center hover:text-blue-600 transition duration-200 ease-in-out">
          <FaShare className="mr-2" />
          Repost
        </button>
        <button className="flex items-center hover:text-blue-600 transition duration-200 ease-in-out">
          <FaPaperPlane className="mr-2" />
          Send
        </button>
      </div>

      {/* Comment Section */}
      <div className="mt-4">
        <h4 className="font-bold mb-2">Comments:</h4>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <strong>{comment.username}:</strong> {comment.text}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        <div className="flex mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
