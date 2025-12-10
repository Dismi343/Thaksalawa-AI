
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

const StudentAnalytics = () => {
    const MOCK_STUDENTS = [
    { id: 1, name: 'Alex Johnson', grade: '10-A', avgScore: 88, attendance: '95%' },
    { id: 2, name: 'Sarah Williams', grade: '10-A', avgScore: 92, attendance: '98%' },
    { id: 3, name: 'Michael Brown', grade: '10-B', avgScore: 76, attendance: '82%' },
    { id: 4, name: 'Emily Davis', grade: '10-A', avgScore: 85, attendance: '90%' },
    { id: 5, name: 'James Wilson', grade: '10-B', avgScore: 64, attendance: '75%' },
    ];
    const MOCK_ASSIGNMENTS = [
  { id: 101, quizTitle: 'Newton\'s Laws', studentId: 1, score: 90, status: 'Completed', date: 'Oct 12' },
  { id: 102, quizTitle: 'Newton\'s Laws', studentId: 2, score: 95, status: 'Completed', date: 'Oct 12' },
  { id: 103, quizTitle: 'Algebra Basics', studentId: 1, score: 85, status: 'Completed', date: 'Oct 10' },
  { id: 104, quizTitle: 'Algebra Basics', studentId: 3, score: 70, status: 'Completed', date: 'Oct 10' },
  { id: 105, quizTitle: 'Periodic Table', studentId: 5, score: 0, status: 'Pending', date: '-' },
];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Student Progress</h1>
        <p className="text-slate-500">Analyze assignment scores and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Class Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase">Class Avg</p>
                <p className="text-3xl font-bold text-[#1a4d2e] mt-1">78%</p>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">92%</p>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase">Active Students</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">24</p>
             </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Assignments</h3>
              <button className="text-sm text-[#1a4d2e] font-bold flex items-center gap-1">View All <ChevronRight size={16}/></button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Quiz Name</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_ASSIGNMENTS.map((item) => {
                  const student = MOCK_STUDENTS.find(s => s.id === item.studentId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-700">{student?.name}</td>
                      <td className="p-4 text-slate-600">{item.quizTitle}</td>
                      <td className="p-4 text-slate-500">{item.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right font-bold text-slate-800">{item.score}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Student Leaderboard */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-[#1a4d2e]" /> Top Performers
          </h3>
          <div className="space-y-4">
            {MOCK_STUDENTS.sort((a,b) => b.avgScore - a.avgScore).map((student, idx) => (
              <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                  <p className="text-xs text-slate-500">Grade {student.grade}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1a4d2e]">{student.avgScore}%</p>
                  <p className="text-[10px] text-slate-400">Avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentAnalytics;