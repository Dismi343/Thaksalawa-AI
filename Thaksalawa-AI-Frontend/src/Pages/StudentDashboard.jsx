import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/StudentDashboard/Sidebar.jsx';
import HomeModule from '../Components/StudentDashboard/HomeModule.jsx';
import QuizPage from "./QuizPage.jsx";
import QuizModule from '../Components/StudentDashboard/QuizModule.jsx';
import ChatModule from '../Components/StudentDashboard/ChatModule.jsx';
import FlashcardModule from '../Components/StudentDashboard/FlashCardModule.jsx';
import {
  LayoutGrid,
  MessageSquareText,
  GraduationCap,
  PieChart,
  Code,
  Settings,
  LogOut,
  Search,
  Bell,
  Clock,
  ArrowRight,
  MoreVertical,
  Send,
  Circle,
  Play,
  Leaf,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { GetSubjects } from '../Api/SubjectApi.jsx';

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // const [activeChatId, setActiveChatId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chatId, setChatId] = useState(null);
const [quizState, setQuizState] = useState({
  selectedSubject: null,
  selectedlesson: null,
  quizeFrom: null,
  quizeType: null,
  quizeTime: null,
  questionCount: 0,
  quizId: null
});


 useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem("token");
      const res = await GetSubjects(token);
      setSubjects(res.data);
    };
    fetchSubjects();
  }, []);

 


  // Render content based on internal state
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <HomeModule onNavigate={setActivePage} />;
      case 'chat': return <ChatModule   
      subjects={subjects}
      chatId={chatId}
      setChatId={setChatId}
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      activePage={activePage}
      />;
      case 'quiz': return <QuizModule 
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      activePage={activePage}
      setActivePage={setActivePage}
      setQuizState={setQuizState}
      quizState={quizState}
      quizId={quizState.quizId}
      setQuizId={(value) => updateQuizState('quizId', value)}
        />;
      case 'code': return <CodeModule />;
      case 'analytics': return <div className="p-8 text-center text-slate-500">Analytics Component Here</div>;
      default: return <HomeModule onNavigate={setActivePage} />;
      case 'flashcards': return <FlashcardModule />;
    }
  };

  // Helper functions to update quizState
  const updateQuizState = (key, value) => {
    setQuizState(prev => ({ ...prev, [key]: value }));
  };

  // reset quizState
  const resetQuizState = () => {
  setQuizState({
    selectedSubject: null,
    selectedlesson: null,
    quizeFrom: null,
    quizeType: null,
    quizeTime: null,
    questionCount: 0
  });
};

  const handleNavigate = (page, id = null) => {
  
  setActivePage(page);
  if (page === 'chat') {
    setChatId(id);
  } else if (page === 'quiz') {
    updateQuizState('quizId', id);
  }
};

const backtoDashboard=()=>{
  setActivePage('dashboard')
  setSelectedSubject(null);
 resetQuizState();
}



  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans text-slate-900">

      {/* Sidebar Component */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subjects={subjects}
        setQuizState={setQuizState}
        quizState={quizState}
        
      />


      {/* Main Layout */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Top Header */}
        <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-[#f4f7f6] flex-shrink-0 z-20">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <span className="cursor-pointer hover:text-slate-600 hidden md:block" onClick={() => backtoDashboard()}>Dashboard</span>
              {activePage !== 'dashboard' && (
                <>
                  <ChevronRight size={14} className="hidden md:block" />
                  <span className="text-[#1a4d2e] capitalize">{activePage}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 focus-within:border-[#1a4d2e] transition-colors shadow-sm w-48 lg:w-64">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400" />
            </div>

            <button className="relative p-2 rounded-full hover:bg-white transition-colors">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#1a4d2e] to-green-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}