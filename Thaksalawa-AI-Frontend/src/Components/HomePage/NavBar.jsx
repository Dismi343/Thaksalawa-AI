import React,{useState} from "react";
import { 
  Leaf, 
  Menu, 
  X, 

} from 'lucide-react';


export default function Navbar({ onOpenLogin }){
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#1a4d2e]">
          {/*<div className="w-8 h-8 bg-[#1a4d2e] rounded-lg flex items-center justify-center text-white">
            <Leaf size={18} fill="currentColor" />
          </div>*/}
          <span className="text-xl font-bold tracking-tight text-slate-900">Thaksalawa<span className="text-green-600"> AI</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-[#1a4d2e] transition-colors">Features</a>
          <a href="#for-teachers" className="hover:text-[#1a4d2e] transition-colors">For Teachers</a>
          <a href="#about" className="hover:text-[#1a4d2e] transition-colors">About Us</a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => onOpenLogin('login')} 
            className="text-slate-600 font-medium hover:text-[#1a4d2e]"
          >
            Log in
          </button>
          
          <button 
            onClick={() => onOpenLogin('register')} 
            className="bg-[#1a4d2e] text-white px-5 py-2.5 rounded-full font-medium hover:bg-green-800 transition-all shadow-lg shadow-green-900/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl">
          <a href="#features" className="text-slate-600 font-medium py-2">Features</a>
          <a href="#for-teachers" className="text-slate-600 font-medium py-2">For Teachers</a>
          <a href="#pricing" className="text-slate-600 font-medium py-2">Pricing</a>
          <hr className="border-slate-100" />
          <button 
            onClick={() => { onOpenLogin('login'); setIsMobileMenuOpen(false); }} 
            className="w-full text-center py-3 text-slate-600 font-bold"
          >
            Log in
          </button>
          
          <button 
            onClick={() => { onOpenLogin('register'); setIsMobileMenuOpen(false); }}
            className="w-full bg-[#1a4d2e] text-white py-3 rounded-xl font-bold"
          >
            Get Started Free
          </button>
        </div>
      )}
    </nav>
    
  );
};