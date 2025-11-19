// SubjectCard.jsx

import React from 'react';

// Using a simple book icon placeholder for the yellow/blue icon in the card
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-yellow-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.414 9.38 5 7.85 5H4a2 2 0 00-2 2v10a2 2 0 002 2h4.007a2 2 0 011.838 1.127l1.492 2.516a.5.5 0 00.82 0l1.492-2.516A2 2 0 0115.993 19H20a2 2 0 002-2V7a2 2 0 00-2-2h-3.85c-1.53 0-2.982.414-4.15 1.127z"
    />
  </svg>
);

const SubjectCard = ({ title, grade }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 w-full max-w-sm">
      <div className="p-6">
        {/* Top Dark Blue Section */}
        <div className="bg-slate-700 h-24 rounded-t-md mb-4 flex items-center justify-center">
          <BookIcon />
        </div>
        
        {/* Text Content */}
        <p className="text-xl font-semibold text-gray-800 mb-1">{title}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
          <span>{grade}</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;