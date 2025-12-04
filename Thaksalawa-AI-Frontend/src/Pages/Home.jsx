import React, { useState } from 'react';
import { 
  Leaf, 
  Menu, 
  X, 
  MessageSquareText, 
  GraduationCap, 
  Code, 
  PieChart, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Users
} from 'lucide-react';
import Footer from '../Components/HomePage/Footer';
import Navbar from '../Components/HomePage/NavBar';
import LoginModal from '../Components/Login/LoginModal';


const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-green-50/50 to-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-[#1a4d2e] rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            New: AI Analysis V1.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Master Any Subject with <span className="text-[#1a4d2e]">AI-Powered</span> Learning.
          </h1>
          
          <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
            Thaksalawa AI combines intelligent chat tutoring, interactive quizzes, and real-time coding environments to help students learn 3x faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 bg-[#1a4d2e] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl shadow-green-900/20 group">
              Start Learning Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
              <Play size={20} className="text-[#1a4d2e]" fill="currentColor" />
              Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p>Trusted by 10,000+ students</p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Mock Dashboard Preview */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 aspect-[4/3] flex flex-col">
              <div className="h-10 bg-white border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 col-span-2 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700"><MessageSquareText size={20}/></div>
                    <div>
                        <div className="h-2 w-32 bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 w-48 bg-slate-100 rounded"></div>
                    </div>
                 </div>
                 <div className="bg-[#1a4d2e] p-4 rounded-xl shadow-sm text-white flex flex-col justify-between">
                    <GraduationCap size={24} className="mb-2 opacity-80" />
                    <div className="h-2 w-16 bg-white/30 rounded"></div>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <PieChart size={24} className="mb-2 text-purple-500" />
                    <div className="h-2 w-16 bg-slate-200 rounded"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

/* ==========================================================================
   FEATURES SECTION
   ==========================================================================
*/
const Features = () => {
  const FeatureCard = ({ icon: Icon, title, desc, color }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to excel</h2>
          <p className="text-slate-500 text-lg">We've built a comprehensive ecosystem to support every style of learning, from visual quizzes to code execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={MessageSquareText}
            title="AI Personal Tutor"
            desc="24/7 homework help that guides you to the answer rather than just giving it to you. Supports Math, Science, and History."
            color="bg-emerald-500"
          />
          <FeatureCard 
            icon={GraduationCap}
            title="Gamified Quizzes"
            desc="Turn studying into a game. Earn streaks, badges, and track your progress against global leaderboards."
            color="bg-orange-500"
          />
          <FeatureCard 
            icon={Code}
            title="Live Code Studio"
            desc="Write, run, and debug Python and JavaScript code directly in your browser with AI-powered error explanations."
            color="bg-blue-500"
          />
          <FeatureCard 
            icon={PieChart}
            title="Smart Analytics"
            desc="Visualize your learning curve. Identify weak spots and get personalized recommendations on what to study next."
            color="bg-purple-500"
          />
          <FeatureCard 
            icon={Users}
            title="Classroom Mode"
            desc="Teachers can create assignments, monitor student progress in real-time, and export detailed grade reports."
            color="bg-rose-500"
          />
          <FeatureCard 
            icon={Leaf}
            title="Distraction Free"
            desc="A clean, calm interface designed to reduce cognitive load and keep focus on the material at hand."
            color="bg-[#1a4d2e]"
          />
        </div>
      </div>
    </section>
  );
};


export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
    
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleOpenLogin = (mode = 'login') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
  };
      
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-[#1a4d2e]">
      <Navbar onOpenLogin={handleOpenLogin} />
      <Hero />
      <Features />
      {/* Additional CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#1a4d2e] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your grades?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of students who are already using Donezo.Edu to ace their exams and master coding.</p>
            <button onClick={() => window.location.href='/studentdashboard'} className="bg-white text-[#1a4d2e] px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all shadow-xl">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
      <Footer />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        initialMode={authMode} 
      />
    </div>
  );
}