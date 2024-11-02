import React, { useContext, useState } from "react";
import { MdPermMedia } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { SiLibreofficewriter } from "react-icons/si";
import { db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import { UserContext } from "../Context/context";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Create = (props) => {
  const { user, profile,userData } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    link: "",  // Fixed: Added missing link reset
    logo: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPost = async () => {
    if (!postContent && !selectedImage) {
      toast.error("Please enter text or upload an image.");
      return;
    }
  
    // Show "Posting..." toast notification
    const loadingToastId = toast.loading("Posting...");
  
    try {
      const postRef = doc(db, "posts", uuidv4());
      let imageUrl = null;
  
      if (selectedImage) {
        const storageRef = ref(storage, `post-images/${user.uid}/${Date.now()}`);
        await uploadString(storageRef, selectedImage, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await setDoc(postRef, {
        image: imageUrl,
        name: profile.username,
        description: postContent,
        userImage: profile.image,
        userId: user.uid,
        createdAt: new Date(),
      });
  
      // Dismiss "Posting..." toast and show success
      toast.dismiss(loadingToastId);
      toast.success("Post created successfully.");
      
      // Reset the form state
      setPostContent("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
  
      // Dismiss "Posting..." toast and show error
      toast.dismiss(loadingToastId);
      toast.error("Error creating post: " + error.message);
    }
  };
  
  const handleUploadJob = async () => {
    const { title, company, location, description, link } = jobData;

    if (!title || !company || !location || !description) {
      toast.error("Please fill out all job fields.");
      return;
    }

    try {
      const jobRef = doc(db, "jobs", uuidv4());
      await setDoc(jobRef, {
        ...jobData,
        logo: profile.image,
        userId: user.uid,
        link,
        createdAt: new Date(),
      });

      toast.success("Job posted successfully.");
      setShowJobModal(false);
      setJobData({ title: "", company: "", location: "", description: "", link: "", logo: null });
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error("Error uploading job: " + error.message);
    }
  };

  return (
    <div className={`shadow-lg rounded-lg w-full p-4 ${props.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      {showJobModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${props.darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
            <input type="text" name="title" placeholder="Job Title" value={jobData.title} onChange={handleJobInputChange} className={`w-full mb-2 p-2 rounded ${props.darkMode ? "bg-gray-600 text-white" : "border border-gray-300"}`} />
            <input type="text" name="company" placeholder="Company Name" value={jobData.company} onChange={handleJobInputChange} className={`w-full mb-2 p-2 rounded ${props.darkMode ? "bg-gray-600 text-white" : "border border-gray-300"}`} />
            <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleJobInputChange} className={`w-full mb-2 p-2 rounded ${props.darkMode ? "bg-gray-600 text-white" : "border border-gray-300"}`} />
            <textarea name="description" placeholder="Job Description" value={jobData.description} onChange={handleJobInputChange} className={`w-full mb-2 p-2 rounded ${props.darkMode ? "bg-gray-600 text-white" : "border border-gray-300"}`} />
            <textarea name="link" placeholder="Job Link" value={jobData.link} onChange={handleJobInputChange} className={`w-full mb-2 p-2 rounded ${props.darkMode ? "bg-gray-600 text-white" : "border border-gray-300"}`} />
            <button onClick={handleUploadJob} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Job</button>
            <button onClick={() => setShowJobModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded ml-2 hover:bg-gray-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <img className="w-10 h-10 rounded-full border-2" src={userData?.profilePic} alt="User" /> {/* Updated to use profile image */}
        <input type="text" placeholder="Start posting from here..." value={postContent} onChange={(e) => setPostContent(e.target.value)} className={`flex-grow p-2 rounded-lg focus:outline-none ${props.darkMode ? "bg-gray-700 text-white" : "border border-gray-300"}`} />
        <button onClick={handleUploadPost} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
      </div>

      <div className="flex justify-between text-gray-600 mb-2">
        <label htmlFor="file-upload" className="media flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <MdPermMedia className="text-xl" />
          <p className="text-sm font-semibold">Media</p>
        </label>
        <input type="file" accept="image/*" id="file-upload" onChange={handleFileChange} className="hidden" />
        <div className="job flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200" onClick={() => setShowJobModal(true)}>
          <BsPersonWorkspace className="text-xl" />
          <p className="text-sm font-semibold">Job</p>
        </div>
        <div className="write flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <SiLibreofficewriter className="text-xl" />
          <p className="text-sm font-semibold">Write</p>
        </div>
      </div>

      {selectedImage && (
        <div className="mt-2">
          <img src={selectedImage} alt="Selected" className="max-w-full rounded" />
        </div>
      )}
    </div>
  );
};

export default Create;
