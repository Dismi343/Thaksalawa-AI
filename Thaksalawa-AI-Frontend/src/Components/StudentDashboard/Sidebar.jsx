import React from "react";
import { 
  LayoutGrid, MessageSquareText, GraduationCap, PieChart, 
  Code, Settings, LogOut, X, ArrowLeft, Plus, History 
} from "lucide-react";

// 1. Mock Data for History (In a real app, fetch this from an API)
const HISTORY_DATA = {
  chat: [
    { id: 1, title: "Biology Revision 101", date: "Today" },
    { id: 2, title: "Calculus Problem Help", date: "Yesterday" },
    { id: 3, title: "Essay Structure Ideas", date: "2 days ago" },
  ],
  quiz: [
    { id: 1, title: "Organic Chemistry", score: "85%" },
    { id: 2, title: "World History", score: "92%" },
  ],
  code: [
    { id: 1, title: "Python Sort Algo", lang: "py" },
    { id: 2, title: "React Navbar", lang: "jsx" },
    { id: 3, title: "SQL Queries", lang: "sql" },
  ]
};

const Sidebar = ({ activePage, onNavigate, isMobileOpen, setIsMobileOpen }) => {
  
  // Helper to determine if we are in a "History Mode" page
  const isHistoryPage = ['chat', 'quiz', 'code'].includes(activePage);

  // 2. Component for the Standard Main Menu
  const MainMenu = () => (
    <nav className="space-y-2 animate-in fade-in slide-in-from-left-5 duration-300">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
      <NavItem icon={LayoutGrid} label="Dashboard" pageId="dashboard" />
      <NavItem icon={MessageSquareText} label="AI Chat" pageId="chat" />
      <NavItem icon={GraduationCap} label="Quizzes" pageId="quiz" />
      <NavItem icon={Code} label="Code Studio" pageId="code" />
      <NavItem icon={PieChart} label="Analytics" pageId="analytics" />
    </nav>
  );

  // 3. Component for the History List (Chat/Quiz/Code)
  const HistoryMenu = () => {
    const historyItems = HISTORY_DATA[activePage] || [];
    
    // Dynamic labels based on page
    const labels = {
      chat: { title: "Chat History", new: "New Chat" },
      quiz: { title: "Past Quizzes", new: "New Quiz" },
      code: { title: "Saved Snippets", new: "New Snippet" }
    };

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4d2e] transition-colors px-2 mb-4"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Menu</span>
        </button>

        {/* Section Header & New Button */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {labels[activePage]?.title}
          </span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-green-200 text-[#1a4d2e] hover:bg-green-50 transition-all mb-4">
          <Plus size={18} />
          <span className="font-medium text-sm">{labels[activePage]?.new}</span>
        </button>

        {/* Scrollable History List */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-1 custom-scrollbar">
          {historyItems.map((item) => (
            <button 
              key={item.id}
              className="flex flex-col items-start gap-1 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-[#1a4d2e] transition-all text-left group"
            >
              <span className="font-medium text-sm truncate w-full">{item.title}</span>
              <span className="text-xs text-slate-400 group-hover:text-green-600/70">
                {item.date || item.score || item.lang}
              </span>
            </button>
          ))}
          
          {historyItems.length === 0 && (
            <div className="text-center p-4 text-slate-400 text-sm">
              No history found.
            </div>
          )}
        </div>
      </div>
    );
  };

  const NavItem = ({ icon: Icon, label, pageId }) => (
    <button 
      onClick={() => {
        onNavigate(pageId);
        setIsMobileOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group ${
        activePage === pageId 
          ? 'bg-[#1a4d2e] text-white shadow-lg shadow-green-900/20' 
          : 'text-slate-500 hover:bg-green-50 hover:text-[#1a4d2e]'
      }`}
    >
      <Icon size={20} className={activePage === pageId ? 'text-green-300' : 'text-slate-400 group-hover:text-[#1a4d2e]'} />
      <span className="font-medium text-sm">{label}</span>
      {activePage === pageId && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
    </button>
  );

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 
        flex flex-col p-6 justify-between transition-transform duration-300 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-8 text-[#1a4d2e] shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">Thaksalawa<span className="text-green-600"> AI</span></span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* Conditional Rendering: Main Menu OR History Menu */}
          {isHistoryPage ? <HistoryMenu /> : <MainMenu />}
        </div>

        {/* Bottom Actions (Always visible) */}
        <div className="space-y-2 pt-6 border-t border-slate-100 shrink-0">
          {!isHistoryPage && <NavItem icon={Settings} label="Settings" pageId="settings" />}
          <button 
            onClick={() => window.location.href = "/"} 
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;