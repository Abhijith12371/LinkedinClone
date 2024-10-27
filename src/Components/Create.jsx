import React, { useContext, useState } from "react";
import { MdPermMedia } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { SiLibreofficewriter } from "react-icons/si";
import { db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { collection } from "firebase/firestore";
import { UserContext } from "../Context/context";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage"; // Import getDownloadURL

const Create = (props) => {
  const {user,profile} = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("this is the user id you are looking for ",user.uid)
  
    if (!selectedImage || !description) {
      toast.error("Please provide both an image and a description.");
      return;
    }
  
    if (!user || !user.uid) {
      toast.error("User not logged in. Please log in to upload.");
      return;
    }
  
    const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`); // Unique path for each image
  
    try {
      // Upload the image string to Firebase Storage
      await uploadString(storageRef, selectedImage, 'data_url');
      toast.success("Image uploaded successfully.");
  
      // Retrieve the download URL
      const downloadURL = await getDownloadURL(storageRef);
  
      // Add a new post document with a generated ID in Firestore
      const postRef = doc(db, "posts",user.uid); // Auto-generated document ID
      await setDoc(postRef, {
        image: downloadURL,
        description: description,
        createdAt: new Date(),
        userImage:profile.image,
        userId: user.uid, // Include the user ID
      });
  
      toast.success("Post created successfully.");
      
      // Clear the input fields
      setSelectedImage(null);
      setDescription("");
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error("Error uploading post: " + error.message);
    }
  };
  
  
  

  return (
    <div className="shadow-lg rounded-lg w-full bg-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          className="w-10 h-10 rounded-full border-2"
          src={props.image}
          alt="User"
        />
        <input
          type="text"
          placeholder="Start posting from here..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex justify-between text-gray-600 mb-2">
        <label htmlFor="file-upload" className="media flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <MdPermMedia className="text-xl" />
          <p className="text-sm font-semibold">Media</p>
        </label>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="job flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <BsPersonWorkspace className="text-xl" />
          <p className="text-sm font-semibold">Job</p>
        </div>
        <div className="write flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <SiLibreofficewriter className="text-xl" />
          <p className="text-sm font-semibold">Write</p>
        </div>
      </div>
      {selectedImage && (
        <div className="mb-4">
          <img src={selectedImage} alt="Uploaded" className="w-full h-auto rounded" />
          <input
            type="text"
            placeholder="Describe your image..."
            value={description}
            onChange={handleDescriptionChange}
            className="mt-2 border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleUpload}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default Create;
