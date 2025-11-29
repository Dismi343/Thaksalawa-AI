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

export default function QuizPage(){
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Visual Header */}
        <div className="bg-[#1a4d2e] p-8 text-white relative overflow-hidden md:w-1/3 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">Physics</span>
            <h2 className="text-2xl font-bold">Newton's Laws</h2>
            <p className="text-green-100 mt-2 text-sm">Quiz: Chapter 4</p>
          </div>

          <div className="mt-8">
             <div className="text-4xl font-bold mb-1">04:12</div>
             <div className="text-xs text-green-200 uppercase tracking-wider">Time Remaining</div>
          </div>
        </div>

        {/* Right Side: Questions */}
        <div className="p-8 md:w-2/3 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 text-sm font-bold">Question 3 of 10</span>
            <div className="flex gap-1">
              {[1,2,3].map(n => <div key={n} className="w-2 h-2 rounded-full bg-[#1a4d2e]"></div>)}
              {[4,5].map(n => <div key={n} className="w-2 h-2 rounded-full bg-slate-200"></div>)}
            </div>
          </div>

          <p className="text-lg font-medium text-slate-800 mb-6">
            According to Newton's second law, what is the relationship between Force (F), Mass (m), and Acceleration (a)?
          </p>

          <div className="space-y-3 flex-1">
            {[
              "F = m / a",
              "F = m × a",
              "F = a / m",
              "F = m + a"
            ].map((opt, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#1a4d2e] hover:bg-green-50 transition-all text-left group">
                <Circle className="text-slate-300 group-hover:text-[#1a4d2e]" size={20} />
                <span className="text-slate-600 font-medium group-hover:text-slate-900">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
            <button className="text-slate-400 font-medium hover:text-slate-600 text-sm">Skip</button>
            <button className="px-6 py-2.5 bg-[#1a4d2e] text-white rounded-xl font-bold hover:bg-[#143d24] transition-colors shadow-lg shadow-green-900/10 text-sm">
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};