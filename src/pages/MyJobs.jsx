import React, { useContext } from "react";
import { UserContext } from "../Context/context";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const MyJobs = () => {
  const { user, jobs, error, darkMode } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return <p className="text-gray-500">Please log in to view your posted jobs.</p>;
  }

  if (error?.jobs) {
    return <p className="text-red-500">{error.jobs}</p>;
  }

  const userJobs = jobs.filter((job) => job.userId === user.uid);

  if (userJobs.length === 0) {
    return <p className="text-gray-500">You have not posted any jobs yet.</p>;
  }

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "jobs", jobId));
        toast.success("Deleted the post");
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Some error occurred, unable to delete the file");
      }
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  return (
    <div className={`max-w-4xl mx-auto p-4 ${darkMode ? 'bg-gray-900 text-gray-300' : ''}`}>
      <h1 className="text-2xl font-bold mb-6">My Job Listings</h1>
      <div className="space-y-4">
        {userJobs.map((job) => (
          <div
            key={job.id}
            className={`flex items-start rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}`}
          >
            <img
              src={job.logo || "https://via.placeholder.com/40"}
              alt={`${job.company} logo`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{job.title}</h2>
              <p className={`text-gray-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{job.company}</p>
              <p className={`text-gray-400 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{job.location}</p>
              <p className={`text-gray-400 mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.description}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(job.id)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;