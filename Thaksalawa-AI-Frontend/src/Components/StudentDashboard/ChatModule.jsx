import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquareText, 
  MoreVertical, 
  Send, 
  Calculator, 
  Beaker, 
  Globe, 
  BookOpen, 
  ChevronLeft,
  ChevronDown,
  X,
  Check,
  GraduationCap
} from "lucide-react";

// Expanded data structure with lessons/modules
const SUBJECTS = [
  { 
    id: 'math', 
    name: 'Mathematics', 
    icon: Calculator, 
    color: 'bg-emerald-100 text-emerald-700',
    greeting: "Hello! I'm your Math Tutor.",
  },
  { 
    id: 'science', 
    name: 'Science', 
    icon: Beaker, 
    color: 'bg-blue-100 text-blue-700',
    greeting: "Welcome! I'm your Science Assistant.",
  },
  { 
    id: 'history', 
    name: 'History', 
    icon: Globe, 
    color: 'bg-amber-100 text-amber-700',
    greeting: "Greetings! I'm your History Guide.",
  },
  { 
    id: 'literature', 
    name: 'Literature', 
    icon: BookOpen, 
    color: 'bg-rose-100 text-rose-700',
    greeting: "Hello! I'm your Literature Companion.",
  }
];

const ChatModule = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Controls the "small window"
  const endRef = useRef(null);

  // Initialize chat when lesson is selected
  useEffect(() => {
    if (selectedSubject) {
      setMessages([
        { role: "ai", text: `${selectedSubject.greeting}, how can i help you?` }
      ]);
    }
  }, [selectedSubject]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: `That's a great question about ${selectedSubject}. Let me break it down for you...` 
      }]);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setSelectedLesson(null);
    setIsConfigOpen(false);
    setMessages([]);
  };

  // --- VIEW 1: Subject Selection ---
  if (!selectedSubject) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a Subject</h2>
          <p className="text-slate-500">Choose a domain to explore today</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className="flex items-center gap-4 p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/30 hover:shadow-md transition-all group bg-slate-50 hover:bg-white text-left"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${subject.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-[#1a4d2e] transition-colors">{subject.name}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VIEW 2: Lesson/Module Selection ---
 

  // --- VIEW 3: Chat Interface ---
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
      
      {/* Header */}
      <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-2">
          {/* Model/Subject Selector Pill */}
          <button 
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors group border border-transparent hover:border-slate-200"
          >
            <span className={`w-5 h-5 rounded-md flex items-center justify-center ${selectedSubject.color} text-xs`}>
              {React.createElement(selectedSubject.icon, { size: 12 })}
            </span>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{selectedSubject.name}</span>
            </div>
          </button>
        </div>
      </div>

    

      {/* Modal Backdrop (Click to close) */}
      {isConfigOpen && (
        <div 
          className="absolute inset-0 z-40 bg-black/5" 
          onClick={() => setIsConfigOpen(false)}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
              m.role === "user" 
                ? "bg-[#1a4d2e] text-white rounded-br-sm" 
                : "bg-white text-slate-700 rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
          <input 
            className="flex-1 bg-transparent px-4 outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Type your question here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              input.trim() 
                ? "bg-[#1a4d2e] text-white hover:bg-[#143d24] hover:scale-105" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;