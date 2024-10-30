import React, { useContext } from "react";
import { UserContext } from "../Context/context";

const JobList = () => {
  const { jobs, error } = useContext(UserContext); // Access jobs data and error from context

  if (error.post) {
    return <p className="text-red-500">{error.post}</p>; // Display error if fetching jobs fails
  }

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500">No job listings available at the moment.</p>; // No jobs message
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Listings</h1>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={job.logo || "https://via.placeholder.com/40"} // Use placeholder if logo is missing
              alt={`${job.company} logo`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-blue-600">{job.title}</h2>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-gray-600 mt-1">{job.description}</p>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                aria-label={`Apply for ${job.title} at ${job.company}`}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
