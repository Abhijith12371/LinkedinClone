// src/Components/TrendingNow.jsx

import React from 'react';

const TrendingNow = () => {
    const trends = [
        { topic: '#WebDevelopment', info: '12,345 mentions' },
        { topic: '#DataScience', info: '9,876 mentions' },
        { topic: '#ArtificialIntelligence', info: '15,000 mentions' },
        { topic: '#ReactJS', info: '7,123 mentions' },
        { topic: '#CareerAdvice', info: '5,678 mentions' },
    ];

    return (
        <div className="w-full  max-w-md bg-gradient-to-r from-blue-100 to-blue-200 border border-gray-300 rounded-lg shadow-lg p-4 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Trending Now</h2>
            <ul>
                {trends.map((trend, index) => (
                    <li 
                        key={index} 
                        className="mb-3 p-2 rounded-lg hover:bg-blue-300 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        <h3 className="text-sm font-semibold text-blue-600">{trend.topic}</h3>
                        <p className="text-xs text-gray-500">{trend.info}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingNow;
