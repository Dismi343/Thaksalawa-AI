// Sidebar.jsx

import React from 'react';

const navItems = [
  'Home',
  'Subject',
  'Quiz',
  'Check Progress',
  'About',
  'Contact Us',
];

const Sidebar = () => {
  return (
    <div className="bg-white w-64 h-full shadow-lg flex flex-col fixed left-0 top-0">
      {/* Dashboard Section */}
      <div className="bg-blue-600 text-white p-4 font-bold text-xl h-20 flex items-center">
        Dashboard
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item, index) => (
          <a
            key={item}
            href="#" // Placeholder link
            className={`block px-4 py-3 text-lg font-medium rounded-lg transition duration-150 ease-in-out
              ${index === 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Footer Links (Simplified to match layout) */}
      <div className="p-4 text-xs text-gray-500 border-t border-gray-100">
        {/* Placeholder for small footer links visible in the image bottom left */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Blog</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;