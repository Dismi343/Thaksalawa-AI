import React, { useEffect } from "react";
import { 
  LayoutGrid, MessageSquareText, GraduationCap, PieChart, 
  Code, Settings, LogOut, X, ArrowLeft, Plus, Layers,History ,Trash2
} from "lucide-react";
import axios from "axios";
import { GetChats, DeleteChat,GetAllMessagesByChat } from "../../Api/ChatAPi";
import { GetQuize } from "../../Api/QuizApi";
import { GetSubjectById } from "../../Api/SubjectApi";

// 1. Mock Data for History (In a real app, fetch this from an API)
const HISTORY_DATA = {
  chat: [
   
  ],
  quiz: [
    { id: 1, title: "Organic Chemistry", score: "85%" }
  ],
  code: [
    { id: 1, title: "Python Sort Algo", lang: "py" },
    { id: 2, title: "React Navbar", lang: "jsx" },
    { id: 3, title: "SQL Queries", lang: "sql" },
  ]
};

const Sidebar = ({ activePage,  onNavigate, isMobileOpen, setIsMobileOpen, selectedSubject, setSelectedSubject,  setQuizState }) => {

  const[historyData,setHistoryData]=React.useState(HISTORY_DATA);


  
  const fetchChatHistory = async(token,key,selectedSubject)=>{
      try{
        const subject_id=selectedSubject.sub_id;
        const res=await GetChats(token,subject_id);
        const chatsWithFirstMessage = await Promise.all(
        res.data.map(async (chat) => {
          const chat_id = chat.chat_id;
          const allMessages = await GetAllMessagesByChat(token, chat_id);
          const firstMessage = allMessages.data && allMessages.data.length > 0 ? allMessages.data[0] : null;
          console.log("First message for chat", chat_id, ":", firstMessage,":",selectedSubject);
          // Add firstMessage as a property to the chat object
          return { ...chat, firstMessage: firstMessage ? firstMessage.query : null };
          })  
        );
        setHistoryData(prev=>({
          ...prev,
          [key]:chatsWithFirstMessage
        }))
        console.log(chatsWithFirstMessage);

      }
      catch(e){
        console.log(e);
      }
  }


   // Helper functions to update quizState
  const updateQuizState = (key, value) => {
    setQuizState(prev => ({ ...prev, [key]: value }));
  };

  
  const fetchQuizeHistory = async(token,key)=>{
    
    try{
      const res=await GetQuize(token);
      console.log(res.data);
      setHistoryData(prev=>({
        ...prev,
        [key]:res.data
      }))
    }catch(e){
      console.log(e);
    }
  }

useEffect(()=>{
  const token=localStorage.getItem("token");
  let key=null;
  if (activePage === 'chat') {
        key="chat";
        fetchChatHistory(token,key,selectedSubject)
        console.log("fetch chat history");
      } else if (activePage === 'quiz') {
        key="quiz";
        fetchQuizeHistory(token,key);
       return;
      } else if (activePage === 'code') {
        key="code";
       return;//add nesseccary fetchdata method
      }
},[activePage, selectedSubject]);



  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      await axios.post("http://localhost:8080/user/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear token after server logout
      localStorage.removeItem("token");
      window.location.href = "/";

    } catch (err) {
      console.error("Logout failed:", err);

      // Still force logout on client-side
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };


  const handleDeleteChat = async (chatId, subject_id) => {
  try {
    const token = localStorage.getItem("token");
    await DeleteChat(token, chatId);
    // Refresh chat history after deletion
    fetchChatHistory(token, "chat", { sub_id: subject_id });
  } catch (e) {
    console.error("Failed to delete chat", e);
    alert("Failed to delete chat.");
  }
};

  // const updateQuizState = (key, value) => {
  //   setQuizState(prev => ({ ...prev, [key]: value }));
  // };

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

const onRefreshStatusBar=()=>{
  if(activePage==="chat"){
  historyData["chat"].length=0;
  setHistoryData(prev=>({
    ...prev,
    ["chat"]:[]
  }))

  }


  if(activePage==="quiz"){
    historyData["quiz"].length=0;
  setHistoryData(prev=>({
    ...prev,
    ["quiz"]:[]
  }))
  }
  resetQuizState();
  setSelectedSubject(null);

}
  
  // Helper to determine if we are in a "History Mode" page
  const isHistoryPage = ['chat', 'quiz', 'code'].includes(activePage);

  // 2. Component for the Standard Main Menu
  const MainMenu = () => (
    <nav className="space-y-2 animate-in fade-in slide-in-from-left-5 duration-300">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Menu</div>
      <NavItem icon={LayoutGrid} label="Dashboard" pageId="dashboard" />
      <NavItem icon={MessageSquareText} label="AI Chat" pageId="chat" />
      <NavItem icon={Layers} label="Flashcards" pageId="flashcards" /> {/* Added */}
      <NavItem icon={GraduationCap} label="Quizzes" pageId="quiz" />
      <NavItem icon={Code} label="Code Studio" pageId="code" />
      <NavItem icon={PieChart} label="Analytics" pageId="analytics" />
    </nav>
  );

  // 3. Component for the History List (Chat/Quiz/Code)
  const HistoryMenu = () => {
    const historyItems = historyData[activePage] || [];
    
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
          onClick={() => {onNavigate('dashboard');
                onRefreshStatusBar();
          }}
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

        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-green-200 text-[#1a4d2e] hover:bg-green-50 transition-all mb-4"
        onClick={() => {setSelectedSubject(null);
          resetQuizState();
        }}
        >
          <Plus size={18} />
          <span className="font-medium text-sm">{labels[activePage]?.new}</span>
        </button>

        {/* Scrollable History List */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-1 custom-scrollbar">
          {historyItems.map((item) => (
            <div
                key={item.id || item.chat_id || item.quiz_id}
                className="flex items-center w-full group"
              >
                <button
                  className="flex flex-col items-start gap-1 flex-1 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-[#1a4d2e] transition-all text-left"
                  onClick={() => {
                    if(activePage==="chat"){
                        // Fetch subject details by ID
                        const fetchAndSetSubject = async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const response = await GetSubjectById(token, item.subject_id);
                            const subjectData = {
                              sub_id: item.subject_id,
                              ...response.data  // Include all subject details
                            };
                            setSelectedSubject(subjectData);
                            
                            console.log("Selected subject:", subjectData);
                          } catch(e) {
                            console.error("Failed to fetch subject:", e);
                            // Fallback: set just the ID if fetch fails
                            setSelectedSubject({ sub_id: item.subject_id });
                          }
                        };
                        fetchAndSetSubject();
                        onNavigate('chat', item.chat_id);
                    }
                    else if(activePage==="quiz"){
                    updateQuizState('quizId', item.quiz_id);
                    onNavigate('quiz', item.quiz_id);
                   
                    }
                  }}
                >
                  <span className="font-medium text-sm truncate w-full">{item?.firstMessage || item?.title ||"No topic"}</span>
                  <span className="text-xs text-slate-400 group-hover:text-green-600/70">
                    {item?.date
                      ? new Date(item.date).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : item?.timestamp
                      ? new Date(item.timestamp).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : item?.created_at
                      ? new Date(item.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : item?.score || item?.lang || "No additional info"}
                  </span>

                </button>
                {activePage === 'chat' && (
                  <button
                    className="ml-2 p-2 rounded hover:bg-red-100 text-red-500"
                    title="Delete chat"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleDeleteChat(item.chat_id, selectedSubject?.sub_id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
            </div>
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
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;