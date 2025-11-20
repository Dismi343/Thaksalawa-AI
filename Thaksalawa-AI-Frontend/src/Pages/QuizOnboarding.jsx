// QuizOnboarding.jsx

import React, { useState } from 'react';
import Header from './Header'; // Reused Header
import PageFooter from './PageFooter'; // Reused Footer/Illustration structure

// Note: Assuming PageFooter component is defined as in the previous response (HistoryPage.jsx)
// If not, you should define it or include its content here.

const QuizOnboarding = () => {
  // State to manage the selected number of questions
  const [questionCount, setQuestionCount] = useState(10);
  
  const questionOptions = [10, 15, 20, 25];

  const handleStartQuiz = () => {
    console.log(`Starting quiz for Lesson 1 with ${questionCount} questions...`);
    // Logic to navigate to the actual quiz page goes here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-24 p-8 flex justify-center items-start"> 
        
        {/* The Quiz Onboarding Card */}
        <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8 border border-green-200"
             style={{ 
                 // Applying the light mint green background seen in the image's card
                 backgroundColor: '#f0fdf4',
                 borderColor: '#a7f3d0', 
                 // Adding a subtle container shadow for depth
                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
             }}
        >
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Lesson 1 In History
            </h2>
            
            <p className="text-gray-700 font-medium">
              How Much Questions Do You Prefer?
            </p>
            
            {/* Radio Buttons for Question Count Selection */}
            <div className="space-y-3">
              {questionOptions.map(count => (
                <div key={count} className="flex items-center">
                  <input
                    id={`radio-${count}`}
                    name="questionCount"
                    type="radio"
                    value={count}
                    checked={questionCount === count}
                    onChange={() => setQuestionCount(count)}
                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <label htmlFor={`radio-${count}`} className="ml-3 block text-sm font-medium text-gray-700">
                    {count}
                  </label>
                </div>
              ))}
            </div>

            {/* Information Text */}
            <p className="text-sm text-gray-600">
              Your Progress Will Be Recorded And The Results Will Be Displayed When Completing The Quiz.
            </p>
            <p className="text-sm text-gray-600">
              Lets Start Your Journey To Become Smarter...
            </p>

            {/* Start Quiz Button */}
            <div className="pt-4">
              <button
                onClick={handleStartQuiz}
                className="w-full max-w-xs px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Footer and Illustration (Reusing PageFooter) */}
      <PageFooter />
    </div>
  );
};

export default QuizOnboarding;