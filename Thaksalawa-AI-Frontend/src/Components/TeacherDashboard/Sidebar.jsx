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
import axios from 'axios';

// Move NavItem outside of Sidebar
const NavItem = ({ icon: Icon, label, pageId, activePage, onNavigate }) => (
  <button 
    onClick={() => onNavigate(pageId)}
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

export default function Sidebar({ activePage, onNavigate }){
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      await axios.post("http://127.0.0.1:8000/logout", {}, {
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

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-100 flex flex-col p-6 justify-between flex-shrink-0 h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 px-2 mb-10 text-[#1a4d2e]">
          <span className="text-xl font-bold hidden lg:block tracking-tight text-slate-800">Thaksalawa<span className="text-green-600"> AI</span></span>
        </div>

        <nav className="space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" pageId="dashboard" activePage={activePage} onNavigate={onNavigate} />
          <NavItem icon={BookOpen} label="Subject Upload" pageId="upload" activePage={activePage} onNavigate={onNavigate} />
          <NavItem icon={FileQuestion} label="Quiz Manager" pageId="quiz" activePage={activePage} onNavigate={onNavigate} />
          <NavItem icon={Users} label="Students" pageId="students" activePage={activePage} onNavigate={onNavigate} />
          <NavItem icon={MessageSquareText} label="Class Chat" pageId="chat" activePage={activePage} onNavigate={onNavigate} />
        </nav>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-6">
        <NavItem icon={Settings} label="Settings" pageId="settings" activePage={activePage} onNavigate={onNavigate} />
        <button 
        onClick={handleLogout}
        className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
        <LogOut size={20} />
        <span className="font-medium text-sm hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  );
}