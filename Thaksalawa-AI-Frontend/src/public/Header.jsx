// Header.jsx

import React from 'react';

// Simple user icon placeholder
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-gray-600 cursor-pointer"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.98 5.98 0 004.546-2.084A5 5 0 0010 11z"
      clipRule="evenodd"
    />
  </svg>
);

// Simple menu icon for mobile/sidebar toggle (visible next to ThaksalawaAI)
const MenuIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-700 mr-4 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );

const Header = () => {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white shadow-md h-20 flex items-center justify-between px-8 z-10">
      <div className="flex items-center">
        <MenuIcon />
        <h1 className="text-2xl font-extrabold text-gray-800">
          ThaksalawaAI
        </h1>
      </div>
      <UserIcon />
    </header>
  );
};

export default Header;