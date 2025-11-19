// PageFooter.jsx (Reused from HistoryPage)

import React from 'react';

const PageFooter = () => (
    <div className="relative pt-16">
        {/* Illustration Area: Student working on a laptop  */}
        {/* Placeholder for the student illustration visible in the image's bottom right */}
        <div className="absolute bottom-16 right-12 w-48 h-48 z-10 pointer-events-none">
             {/* You would place the actual SVG or image here */}
        </div>
        
        {/* Background Illustration Area */}
        <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden z-0">
            {/* Simplified layered wave pattern */}
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
                        {/* ... other links */}
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

export default PageFooter;