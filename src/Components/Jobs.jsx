import React from "react";

const JobList = () => {
  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      description: "Join our team to develop cutting-edge software solutions.",
      logo: "https://via.placeholder.com/40", // Placeholder for company logo
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateX",
      location: "New York, NY",
      description: "Lead product development from conception to launch.",
      logo: "https://via.placeholder.com/40", // Placeholder for company logo
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Data Insights LLC",
      location: "Remote",
      description: "Analyze data trends to inform business decisions.",
      logo: "https://via.placeholder.com/40", // Placeholder for company logo
    },
  ];

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
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-blue-600">{job.title}</h2>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <p className="text-gray-600 mt-1">{job.description}</p>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200">
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
