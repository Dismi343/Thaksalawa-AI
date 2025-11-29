import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutGrid, 
  MessageSquareText, 
  GraduationCap, 
  PieChart, 
  Settings, 
  LogOut, 
  Send, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  Leaf,
  Trophy,
  Target
} from 'lucide-react';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-[#1a4d2e] text-white shadow-lg shadow-green-900/20' 
        : 'text-gray-500 hover:bg-green-50 hover:text-[#1a4d2e]'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const ChatMessage = ({ role, text }) => (
  <div className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div 
      className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
        role === 'user' 
          ? 'bg-[#1a4d2e] text-white rounded-br-none' 
          : 'bg-white text-slate-700 border border-gray-100 shadow-sm rounded-bl-none'
      }`}
    >
      {text}
    </div>
  </div>
);

const QuizOption = ({ text, selected, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
      selected 
        ? 'bg-white/20 border-white/40 text-white' 
        : 'bg-white/5 border-transparent text-green-100 hover:bg-white/10'
    }`}
  >
    {selected ? <CheckCircle2 size={18} className="text-green-300" /> : <Circle size={18} className="opacity-50" />}
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi Alex! Ready to crush some Geometry today? 📐' }
  ]);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(1);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    
    const newMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "That's a great question! Let's break it down step by step..." 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans overflow-hidden selection:bg-green-200">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col p-4 lg:p-6 justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-10 text-[#1a4d2e]">
            <div className="w-8 h-8 bg-[#1a4d2e] rounded-lg flex items-center justify-center text-white">
              <Leaf size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold hidden lg:block tracking-tight">Donezo.Edu</span>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
            <SidebarItem icon={MessageSquareText} label="AI Tutor" active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} />
            <SidebarItem icon={GraduationCap} label="Quizzes" active={activeTab === 'Quiz'} onClick={() => setActiveTab('Quiz')} />
            <SidebarItem icon={PieChart} label="Analytics" active={activeTab === 'Stats'} onClick={() => setActiveTab('Stats')} />
          </nav>
        </div>

        <div className="space-y-2">
            <SidebarItem icon={Settings} label="Settings" />
            <SidebarItem icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-[#f4f7f6]">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-400 text-xs font-medium">Welcome back, Alex</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700">Alex M.</p>
              <p className="text-xs text-slate-400">Grade 10 Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 border-2 border-white shadow-md"></div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-4 lg:p-8 pt-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full max-h-[calc(100vh-8rem)]">
            
            {/* Left Column: Chat Interface (Span 2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden border border-gray-100">
              
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a4d2e]">
                    <MessageSquareText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Math AI Tutor</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs text-slate-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={20} /></button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 bg-[#f9fafb] p-6 overflow-y-auto custom-scrollbar">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} text={msg.text} />
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-50">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-green-200 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent outline-none text-sm py-2 text-slate-700 placeholder:text-slate-400"
                    placeholder="Ask a question about Quadratic Equations..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    onClick={handleSend}
                    className="w-8 h-8 bg-[#1a4d2e] rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors shadow-md shadow-green-900/10"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Quiz & Stats (Span 1 col) */}
            <div className="flex flex-col gap-6">
              
              {/* Quiz Card */}
              <div className="bg-[#1a4d2e] rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 flex flex-col justify-between relative overflow-hidden group">
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg">Daily Quiz</h3>
                      <p className="text-green-200/80 text-xs">Geometry • Level 2</p>
                    </div>
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">Q3 / 5</span>
                  </div>

                  <p className="text-white/90 font-medium text-lg mb-6 leading-snug">
                    What is the sum of angles in a triangle?
                  </p>

                  <div className="space-y-2">
                    <QuizOption text="180 degrees" selected={selectedQuizOpt === 0} onSelect={() => setSelectedQuizOpt(0)} />
                    <QuizOption text="360 degrees" selected={selectedQuizOpt === 1} onSelect={() => setSelectedQuizOpt(1)} />
                    <QuizOption text="90 degrees" selected={selectedQuizOpt === 2} onSelect={() => setSelectedQuizOpt(2)} />
                  </div>
                </div>

                <button className="mt-6 w-full bg-white text-[#1a4d2e] py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
                  Submit Answer
                </button>
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 min-h-[140px]">
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-slate-800">12</span>
                    <span className="text-xs text-slate-400 font-medium">Day Streak</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
                    <Target size={20} />
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-slate-800">85%</span>
                    <span className="text-xs text-slate-400 font-medium">Accuracy</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}