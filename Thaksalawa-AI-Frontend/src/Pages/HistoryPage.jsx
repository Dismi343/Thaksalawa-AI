// HistoryPage.jsx

import React from 'react';
import Header from './Header'; // Reusing the Header component from the previous UI
import LessonCard from './LessonCard';

// Component for the background illustration and footer links
const PageFooter = () => (
    <div className="relative mt-12 pt-16">
        {/* Background Illustration Area */}
        <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden z-0">
            {/* Simplified layered wave pattern as seen in the image */}
            <div className="absolute bottom-0 w-full h-full bg-gray-900"></div>
            <div className="absolute bottom-0 w-full h-5/6 bg-teal-700 opacity-20 transform -skew-y-3 origin-bottom-right"></div>
            <div className="absolute bottom-0 w-full h-4/6 bg-teal-500 opacity-20 transform -skew-y-2 origin-bottom-left"></div>
            <div className="absolute bottom-0 w-full h-3/6 bg-teal-300 opacity-20"></div>
        </div>

        {/* Footer Content */}
        <footer className="relative z-10 bg-transparent text-white pt-20 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end text-xs">
                    {/* Left side links */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <a href="#" className="hover:underline">About Us</a>
                        <a href="#" className="hover:underline">Udemy Business</a>
                        <a href="#" className="hover:underline">Help And Support</a>
                        <a href="#" className="hover:underline">Contact Us</a>
                        <a href="#" className="hover:underline">Teach On Udemy</a>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Careers</a>
                        <a href="#" className="hover:underline">Get The App</a>
                        <a href="#" className="hover:underline">Blog</a>
                    </div>
                    
                    {/* Right side 'Follow Us' */}
                    <div className="text-right">
                        Follow Us:
                    </div>
                </div>
            </div>
        </footer>
    </div>
);


const HistoryPage = () => {
  // Mock data for lessons
  const lessons = [
    { id: 1, number: 1, grade: 'Grade 10' },
    { id: 2, number: 2, grade: 'Grade 10' },
    { id: 3, number: 3, grade: 'Grade 10' },
    { id: 4, number: 14, grade: 'Grade 10' }, // Lesson 14 as shown in the image
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header (Top Navigation Bar) */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-20 p-8 max-w-7xl mx-auto w-full"> 
        
        {/* Subject Title */}
        <h1 className="text-4xl font-semibold text-gray-900 mb-8">History</h1>
        
        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lessonNumber={lesson.number} 
              grade={lesson.grade} 
            />
          ))}
        </div>

        {/* More Button */}
        <div className="flex justify-center mt-12">
            <button className="px-8 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 transition duration-150 ease-in-out">
                More
            </button>
        </div>
      </main>

      {/* Footer and Illustration */}
      <PageFooter />
    </div>
  );
};

export default HistoryPage;