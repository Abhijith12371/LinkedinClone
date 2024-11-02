import React, { useContext } from "react";
import { UserContext } from "../Context/context";

const JobList = () => {
  const { jobs, error, profile, darkMode } = useContext(UserContext); 

  if (error?.post) {
    return <p className="text-red-500">{error.post}</p>; 
  }

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500">No job listings available at the moment.</p>; 
  }

  return (
    <div className={`max-w-4xl mx-auto p-4 ${darkMode ? 'bg-gray-900 text-gray-300' : ""}`}>
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
      <div className="space-y-4">
        {jobs?.map((job) => (
          <div
            key={job.id}
            className={`flex items-start border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
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
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                aria-label={`Apply for ${job.title} at ${job.company}`}
              >
                <a href={job.link} target="_blank" rel="noopener noreferrer">Apply</a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;