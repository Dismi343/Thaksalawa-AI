import React from 'react';
import { 
  Leaf, 
  ArrowRight, 
} from 'lucide-react';




export default function Footer(){
  return (
    <footer className="bg-[#0f2d1b] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-white mb-6">
            {/*<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-[#0f2d1b]">
              <Leaf size={18} fill="currentColor" />
            </div>*/}
            <span className="text-xl font-bold tracking-tight">Thaksalawa AI</span>
          </div>
          <p className="text-green-100/60 text-sm leading-relaxed mb-6">
            Empowering the next generation of learners with AI-driven tools and accessible education for everyone.
          </p>
          <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 cursor-pointer transition-colors">
                <span className="text-xs font-bold">X</span>
             </div>
             <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 cursor-pointer transition-colors">
                <span className="text-xs font-bold">In</span>
             </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="font-bold text-lg mb-6">Platform</h4>
          <ul className="space-y-4 text-green-100/60 text-sm">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">For Schools</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Code Editor</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="font-bold text-lg mb-6">Company</h4>
          <ul className="space-y-4 text-green-100/60 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
          <p className="text-green-100/60 text-sm mb-4">Get the latest updates on AI features.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter email" 
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-green-100/30 focus:outline-none focus:border-green-500 flex-1"
            />
            <button className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-green-100/40">
        <p>&copy; 2025 Thaksalawa AI. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};