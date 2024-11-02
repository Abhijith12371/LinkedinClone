import React, { useContext, useState } from "react";
import { db, storage } from "../../firebase.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { UserContext } from "../Context/context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfileSetUp = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const { user, darkMode } = useContext(UserContext);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const storageLoc = ref(storage, "images/" + `${name}` + file.name);

    try {
      await uploadBytes(storageLoc, file);
      const downloadURL = await getDownloadURL(storageLoc);
      toast.success("Profile updated successfully");

      setSelectedImage(downloadURL);

      await setDoc(doc(db, "profile", user.uid), {
        username: name,
        image: downloadURL,
        description: desc,
        headline: headline,
        location: location,
        id: user.uid,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
    console.log("Name:", name);
    console.log("Selected Image URL:", selectedImage);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div
        className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        <div
          className={`mt-5 flex flex-col w-[90%] md:w-[40%] lg:w-[30%] items-center p-6 shadow-lg rounded-lg transition-transform transform hover:scale-105 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} duration-300 ease-in-out`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Setup Your Profile</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 transition duration-200 ${darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            <input
              type="text"
              placeholder="Enter your Bio"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={`border rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 transition duration-200 ${darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            <input
              type="text"
              placeholder="Enter your Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={`border rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 transition duration-200 ${darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`border rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 transition duration-200 ${darkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'}`}
              required
            />
            <label className="cursor-pointer mb-4">
              <span className={`text-blue-600 font-semibold hover:underline ${darkMode ? 'text-blue-400' : ''}`}>
                Upload Profile Picture
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-md mb-4 transition duration-300 transform hover:scale-105"
              />
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetUp;