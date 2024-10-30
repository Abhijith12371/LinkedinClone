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
  const { user, profile } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    logo: null,
  });

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

  const handleJobFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJobData({ ...jobData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJobInputChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleUploadJob = async () => {
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.description || !jobData.logo) {
      toast.error("Please fill out all job fields.");
      return;
    }
    try {
      const storageRef = ref(storage, `job-logos/${user.uid}/${Date.now()}`);
      await uploadString(storageRef, jobData.logo, 'data_url');
      const logoURL = await getDownloadURL(storageRef);

      const jobRef = doc(db, "jobs", uuidv4());
      await setDoc(jobRef, {
        ...jobData,
        logo: logoURL,
        userId: user.uid,
        createdAt: new Date(),
      });

      toast.success("Job posted successfully.");
      setShowJobModal(false);
      setJobData({ title: "", company: "", location: "", description: "", logo: null });
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error("Error uploading job: " + error.message);
    }
  };

  return (
    <div className="shadow-lg rounded-lg w-full bg-white p-4">
      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={jobData.title}
              onChange={handleJobInputChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={jobData.company}
              onChange={handleJobInputChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={jobData.location}
              onChange={handleJobInputChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={jobData.description}
              onChange={handleJobInputChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <label htmlFor="job-logo" className="block mb-2">Upload Company Logo:</label>
            <input
              type="file"
              id="job-logo"
              accept="image/*"
              onChange={handleJobFileChange}
              className="mb-4"
            />
            <button
              onClick={handleUploadJob}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Job
            </button>
            <button
              onClick={() => setShowJobModal(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded ml-2 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post Options */}
      <div className="flex items-center gap-3 mb-4">
        <img className="w-10 h-10 rounded-full border-2" src={props.image} alt="User" />
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
        <div
          className="job flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200"
          onClick={() => setShowJobModal(true)}
        >
          <BsPersonWorkspace className="text-xl" />
          <p className="text-sm font-semibold">Job</p>
        </div>
        <div className="write flex items-center gap-1 hover:text-blue-600 cursor-pointer transition duration-200">
          <SiLibreofficewriter className="text-xl" />
          <p className="text-sm font-semibold">Write</p>
        </div>
      </div>
    </div>
  );
};

export default Create;
