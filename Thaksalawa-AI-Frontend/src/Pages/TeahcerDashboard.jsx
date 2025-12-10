import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  FileQuestion, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Zap, 
  Search, 
  Bell, 
  ChevronRight, 
  Check, 
  MoreVertical, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  X,
  Filter,
  Save,
  Trash2,
  UploadCloud,
  FileText,
  Eye,
  Loader2
} from 'lucide-react';
import Sidebar from '../Components/TeacherDashboard/Sidebar';
import SubjectUploader from '../Components/TeacherDashboard/SubjectUploader';
import QuizManager from '../Components/TeacherDashboard/QuizManager';
import StudentAnalytics from '../Components/TeacherDashboard/StudentAnalytics';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */
const MOCK_STUDENTS = [
  { id: 1, name: 'Alex Johnson', grade: '10-A', avgScore: 88, attendance: '95%' },
  { id: 2, name: 'Sarah Williams', grade: '10-A', avgScore: 92, attendance: '98%' },
  { id: 3, name: 'Michael Brown', grade: '10-B', avgScore: 76, attendance: '82%' },
  { id: 4, name: 'Emily Davis', grade: '10-A', avgScore: 85, attendance: '90%' },
  { id: 5, name: 'James Wilson', grade: '10-B', avgScore: 64, attendance: '75%' },
];

const MOCK_ASSIGNMENTS = [
  { id: 101, quizTitle: 'Newton\'s Laws', studentId: 1, score: 90, status: 'Completed', date: 'Oct 12' },
  { id: 102, quizTitle: 'Newton\'s Laws', studentId: 2, score: 95, status: 'Completed', date: 'Oct 12' },
  { id: 103, quizTitle: 'Algebra Basics', studentId: 1, score: 85, status: 'Completed', date: 'Oct 10' },
  { id: 104, quizTitle: 'Algebra Basics', studentId: 3, score: 70, status: 'Completed', date: 'Oct 10' },
  { id: 105, quizTitle: 'Periodic Table', studentId: 5, score: 0, status: 'Pending', date: '-' },
];


/* ==========================================================================
   VIEW: CHAT (Simple)
   ========================================================================== */
const ChatView = () => (
  <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <Users size={18} className="text-[#1a4d2e]"/> Grade 10-A Classroom
      </h3>
      <button className="text-slate-400 hover:text-[#1a4d2e]"><Settings size={18}/></button>
    </div>
    <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-400 gap-4">
      <MessageSquareText size={48} className="opacity-20" />
      <p>Select a student or group to start chatting.</p>
    </div>
    <div className="p-4 border-t border-slate-100">
      <input 
        type="text" 
        placeholder="Type a message to the class..." 
        className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4d2e]/10"
      />
    </div>
  </div>
);

/* ==========================================================================
   MAIN LAYOUT
   ========================================================================== */
export default function TeacherDashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Quick Stats */}
              <div className="bg-[#1a4d2e] p-6 rounded-2xl text-white shadow-lg shadow-green-900/20">
                <p className="text-green-100 text-sm font-medium mb-1">Total Students</p>
                <h3 className="text-3xl font-bold">124</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm font-medium mb-1">Avg Attendance</p>
                <h3 className="text-3xl font-bold text-slate-800">92%</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm font-medium mb-1">Assignments</p>
                <h3 className="text-3xl font-bold text-slate-800">12</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm font-medium mb-1">Pending Grading</p>
                <h3 className="text-3xl font-bold text-orange-500">5</h3>
              </div>
            </div>
            {/* Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
               <div 
                 onClick={() => setActivePage('quiz')}
                 className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 flex flex-col justify-center items-start cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-[#1a4d2e] mb-4 shadow-sm">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Create New Quiz</h3>
                  <p className="text-slate-600 mt-2">Use AI generation or manual entry.</p>
               </div>
               <div 
                 onClick={() => setActivePage('upload')}
                 className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center items-start cursor-pointer hover:shadow-lg transition-shadow"
                >
                   <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                    <UploadCloud size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Upload Subject Content</h3>
                  <p className="text-slate-500 mt-2">Scan PDFs to create lessons.</p>
               </div>
               <div 
                 onClick={() => setActivePage('students')}
                 className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center items-start cursor-pointer hover:shadow-lg transition-shadow"
                >
                   <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">View Analytics</h3>
                  <p className="text-slate-500 mt-2">Check performance reports.</p>
               </div>
            </div>
          </div>
        );
      case 'quiz': return <QuizManager />;
      case 'students': return <StudentAnalytics />;
      case 'chat': return <ChatView />;
      case 'upload': return <SubjectUploader />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8faf9] font-sans text-slate-900 selection:bg-green-100">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
          <h2 className="font-bold text-slate-400 uppercase tracking-widest text-xs">
            {activePage === 'dashboard' ? 'Overview' : activePage}
          </h2>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 focus-within:border-[#1a4d2e] transition-colors w-64">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400" />
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700 leading-none">Ms. Sarah</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Teacher</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1a4d2e] flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                S
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}