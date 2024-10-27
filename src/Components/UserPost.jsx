import React from 'react';
import { FaUserCircle, FaThumbsUp, FaCommentAlt, FaShare, FaPaperPlane } from 'react-icons/fa';

const UserPost = (props) => {
    return (
        <div className="max-w-xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4 mt-5 mb-6">
            {/* UserPost Header */}
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
                    <span className="font-bold text-gray-800">{props.username || "User"}</span>
                    <span className="text-sm text-gray-500">{props.timestamp || "Just now"} • 🌐</span>
                </div>
            </div>

            {/* UserPost Content */}
            <div className="post-content">
                <p className="text-gray-800 mb-4">
                    {props.description}
                </p>
                <img
                    src={props.image || "https://img.freepik.com/free-psd/minimalist-curriculum-instagram-post-template_23-2149363288.jpg?semt=ais_hybrid"}
                    alt="Post content"
                    className="w-full rounded-lg mt-4"
                />
            </div>

            {/* UserPost Actions */}
            <div className="flex justify-around pt-4 border-t border-gray-200 text-sm text-gray-600">
                <button className="flex items-center hover:text-blue-600 transition duration-200 ease-in-out">
                    <FaThumbsUp className="mr-2" />
                    Like
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
        </div>
    );
};

export default UserPost;
