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
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';


// Convert ISO 8601 duration (PT12H37M27S) to readable format
const formatDuration = (duration) => {
  if (!duration) return '';
  
  // Match pattern: PT[nH][nM][nS]
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);
  
  if (!match) return duration;
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  // Return as HH:MM:SS format
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function HomeModule({ onNavigate }){

  const [user, setUser] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


 useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/user/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const last_login_logs=await fetch('http://localhost:8080/user/login-logs/last-log-by-student',{
          method: 'GET',
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        if (!last_login_logs.ok) {
          throw new Error(`Error: ${last_login_logs.statusText}`);
        }

        const data = await response.json();
        const last_login_data=await last_login_logs.json();
        setUser(data);
        setLastLogin(last_login_data);
        console.log('Fetched user data:', data);
        console.log('Fetched last login data:', last_login_data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);


  const ActionCard = ({ title, desc, icon: Icon, color, pageId }) => (
    <button 
      onClick={() => onNavigate(pageId)}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group relative overflow-hidden h-full flex flex-col"
    >
      <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color} rounded-bl-full w-32 h-32 -mr-6 -mt-6`} />
      
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} text-white shadow-md`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1">{desc}</p>
      
      <div className="flex items-center text-sm font-semibold text-[#1a4d2e] gap-2 group-hover:gap-3 transition-all mt-auto">
        Open Module <ArrowRight size={16} />
      </div>
    </button>
  );

  const loginTime = lastLogin?.login_time ? formatDuration(lastLogin.login_time) : 'N/A';
  const loginDate = lastLogin?.login_date ? new Date(lastLogin.login_date).toLocaleDateString() : 'N/A';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Hello, {user?.profile?.name || 'Student'} 👋</h1>
          <p className="text-slate-500 mt-2">Welcome back to your learning dashboard.</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-600 shadow-sm whitespace-nowrap">
          <Clock size={16} className="text-green-600" />
          <span>Last login: {loginDate} at {loginTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard 
          title="AI Tutor" 
          desc="Get instant homework help."
          icon={MessageSquareText} 
          color="bg-emerald-500" 
          pageId="chat"
        />
        <ActionCard 
          title="Daily Quiz" 
          desc="Test your knowledge."
          icon={GraduationCap} 
          color="bg-orange-500" 
          pageId="quiz"
        />
        <ActionCard 
          title="Code Studio" 
          desc="Practice Python & JS."
          icon={Code} 
          color="bg-blue-500" 
          pageId="code"
        />
        <ActionCard 
          title="Analytics" 
          desc="View your progress."
          icon={PieChart} 
          color="bg-purple-500" 
          pageId="analytics"
        />
      </div>
      
      {/* Mock Recents Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <MessageSquareText size={18} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Algebra Help</h4>
                        <p className="text-xs text-slate-400">2 mins ago</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
            </div>
             <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <GraduationCap size={18} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800">Physics Quiz</h4>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
            </div>
        </div>
      </div>
    </div>
  );
};