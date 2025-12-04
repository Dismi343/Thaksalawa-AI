import React, { useState, useEffect } from 'react';
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
    Trash2
} from 'lucide-react';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */
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

/* ==========================================================================
   COMPONENT: SIDEBAR
   ========================================================================== */
const Sidebar = ({ activePage, onNavigate }) => {
    const NavItem = ({ icon: Icon, label, pageId }) => (
        <button
            onClick={() => onNavigate(pageId)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group ${activePage === pageId
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
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-100 flex flex-col p-6 justify-between flex-shrink-0 h-screen sticky top-0">
            <div>
                <div className="flex items-center gap-3 px-2 mb-10 text-[#1a4d2e]">
                    <div className="w-8 h-8 bg-[#1a4d2e] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        T
                    </div>
                    <span className="text-xl font-bold hidden lg:block tracking-tight text-slate-800">Donezo<span className="text-green-600">.Teach</span></span>
                </div>

                <nav className="space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" pageId="dashboard" />
                    <NavItem icon={MessageSquareText} label="Class Chat" pageId="chat" />
                    <NavItem icon={FileQuestion} label="Quiz Manager" pageId="quiz" />
                    <NavItem icon={Users} label="Students" pageId="students" />
                </nav>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-6">
                <NavItem icon={Settings} label="Settings" pageId="settings" />
                <button className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut size={20} />
                    <span className="font-medium text-sm hidden lg:block">Logout</span>
                </button>
            </div>
        </aside>
    );
};

/* ==========================================================================
   VIEW: QUIZ MANAGER (Core Feature)
   ========================================================================== */
const QuizManager = () => {
    const [viewState, setViewState] = useState('list'); // 'list', 'create_setup', 'create_questions', 'assign'
    const [creationMode, setCreationMode] = useState('manual'); // 'manual' or 'ai'
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // Quiz Form State
    const [quizConfig, setQuizConfig] = useState({
        subject: 'Mathematics',
        lesson: '',
        questionCount: 5,
        type: 'MCQ' // 'MCQ' or 'Structured'
    });

    const [questions, setQuestions] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Mock AI Generation
    const handleGenerateAI = () => {
        setIsLoadingAI(true);
        setTimeout(() => {
            // Mock generated questions
            const generated = Array.from({ length: quizConfig.questionCount }).map((_, i) => ({
                id: i,
                text: `AI Generated Question ${i + 1} about ${quizConfig.lesson}?`,
                type: quizConfig.type,
                options: quizConfig.type === 'MCQ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : [],
                correct: 'Option A'
            }));
            setQuestions(generated);
            setIsLoadingAI(false);
            setViewState('create_questions');
        }, 2000);
    };

    const handleManualSetup = () => {
        // Initialize empty questions for manual entry
        const emptyQs = Array.from({ length: quizConfig.questionCount }).map((_, i) => ({
            id: i,
            text: '',
            type: quizConfig.type,
            options: quizConfig.type === 'MCQ' ? ['', '', '', ''] : [],
            correct: ''
        }));
        setQuestions(emptyQs);
        setViewState('create_questions');
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleOptionChange = (qId, optIndex, value) => {
        setQuestions(questions.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[optIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    // --- SUB-COMPONENTS FOR WIZARD STEPS ---

    const SetupStep = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    {creationMode === 'ai' ? '✨ Generate with AI' : '✏️ Create Manually'}
                </h2>
                <button onClick={() => setViewState('list')} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                    <select
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                        value={quizConfig.subject}
                        onChange={(e) => setQuizConfig({ ...quizConfig, subject: e.target.value })}
                    >
                        <option>Mathematics</option>
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>History</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Lesson / Topic</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                        placeholder="e.g. Quadratic Equations"
                        value={quizConfig.lesson}
                        onChange={(e) => setQuizConfig({ ...quizConfig, lesson: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Questions</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                            value={quizConfig.questionCount}
                            onChange={(e) => setQuizConfig({ ...quizConfig, questionCount: parseInt(e.target.value) })}
                            min="1" max="20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                        <select
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                            value={quizConfig.type}
                            onChange={(e) => setQuizConfig({ ...quizConfig, type: e.target.value })}
                        >
                            <option value="MCQ">Multiple Choice</option>
                            <option value="Structured">Structured / Essay</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={creationMode === 'ai' ? handleGenerateAI : handleManualSetup}
                    disabled={!quizConfig.lesson}
                    className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#143d24] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoadingAI ? (
                        <>Generating <span className="animate-spin">⏳</span></>
                    ) : (
                        <>Next Step <ChevronRight size={20} /></>
                    )}
                </button>
            </div>
        </div>
    );

    const QuestionsStep = () => (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Review Questions</h2>
                    <p className="text-slate-500">{quizConfig.subject} • {quizConfig.lesson}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setViewState('create_setup')} className="text-slate-500 font-medium px-4 py-2">Back</button>
                    <button
                        onClick={() => setViewState('assign')}
                        className="bg-[#1a4d2e] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#143d24]"
                    >
                        Finish & Assign
                    </button>
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <span className="font-bold text-[#1a4d2e]">Question {idx + 1}</span>
                            <button className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>

                        <textarea
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 outline-none focus:border-[#1a4d2e]"
                            placeholder="Enter question text..."
                            value={q.text}
                            onChange={(e) => handleQuestionChange(q.id, 'text', e.target.value)}
                            rows={2}
                        />

                        {q.type === 'MCQ' && (
                            <div className="grid grid-cols-2 gap-4">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs text-slate-500 font-bold">
                                            {String.fromCharCode(65 + optIdx)}
                                        </div>
                                        <input
                                            className="flex-1 p-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-blue-400 text-sm"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(q.id, optIdx, e.target.value)}
                                            placeholder={`Option ${optIdx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === 'Structured' && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm text-center">
                                Student will see a text area to answer this.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const AssignStep = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mx-auto mb-4">
                    <Users size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Assign Quiz</h2>
                <p className="text-slate-500">Select students to assign "{quizConfig.lesson}"</p>
            </div>

            <div className="max-h-60 overflow-y-auto mb-8 space-y-2 pr-2 custom-scrollbar">
                {MOCK_STUDENTS.map(student => (
                    <div
                        key={student.id}
                        onClick={() => toggleStudent(student.id)}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${selectedStudents.includes(student.id)
                                ? 'bg-green-50 border-[#1a4d2e]'
                                : 'bg-white border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{student.name}</p>
                                <p className="text-xs text-slate-500">Grade {student.grade}</p>
                            </div>
                        </div>
                        {selectedStudents.includes(student.id) ? (
                            <CheckCircle2 className="text-[#1a4d2e]" fill="currentColor" />
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setViewState('create_questions')}
                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
                >
                    Back
                </button>
                <button
                    onClick={() => {
                        alert(`Quiz Assigned to ${selectedStudents.length} students!`);
                        setViewState('list');
                    }}
                    disabled={selectedStudents.length === 0}
                    className="flex-1 bg-[#1a4d2e] text-white py-3 rounded-xl font-bold hover:bg-[#143d24] disabled:opacity-50"
                >
                    Confirm Assignment
                </button>
            </div>
        </div>
    );

    // --- MAIN RENDER FOR QUIZ MANAGER ---
    if (viewState === 'create_setup') return <SetupStep />;
    if (viewState === 'create_questions') return <QuestionsStep />;
    if (viewState === 'assign') return <AssignStep />;

    // Default List View
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quiz Management</h1>
                    <p className="text-slate-500">Create, edit, and assign assessments.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setCreationMode('manual'); setViewState('create_setup'); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                    >
                        <Plus size={18} /> Add Manually
                    </button>
                    <button
                        onClick={() => { setCreationMode('ai'); setViewState('create_setup'); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1a4d2e] text-white font-bold rounded-xl hover:bg-[#143d24] shadow-lg shadow-green-900/20"
                    >
                        <Zap size={18} /> Create with AI
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Existing Quizzes */}
                {['Algebra 101', 'Newton\'s Laws', 'The Solar System'].map((title, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#1a4d2e]">
                                <FileQuestion size={24} />
                            </div>
                            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{title}</h3>
                        <p className="text-sm text-slate-500 mb-4">10 Questions • MCQ</p>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg text-sm font-bold hover:bg-slate-100">Edit</button>
                            <button className="flex-1 bg-[#1a4d2e] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#143d24]">Assign</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ==========================================================================
   VIEW: STUDENT ANALYTICS
   ========================================================================== */
const StudentAnalytics = () => {
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
                            <button className="text-sm text-[#1a4d2e] font-bold flex items-center gap-1">View All <ChevronRight size={16} /></button>
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
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
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
                        {MOCK_STUDENTS.sort((a, b) => b.avgScore - a.avgScore).map((student, idx) => (
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

/* ==========================================================================
   VIEW: CHAT (Simple)
   ========================================================================== */
const ChatView = () => (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-[#1a4d2e]" /> Grade 10-A Classroom
            </h3>
            <button className="text-slate-400 hover:text-[#1a4d2e]"><Settings size={18} /></button>
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-400 gap-4">
            <MessageSquareText size={48} className="opacity-20" />
            <p>Select a student or group to start chatting.</p>
        </div>
        <div className="p-4 border-t border-slate-100">
            <input
                type="text"
                placeholder="Type a message to the class..."
                className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4d2e]/10"
            />
        </div>
    </div>
);

/* ==========================================================================
   MAIN LAYOUT
   ========================================================================== */
export default function TeacherDashboard() {
    const [activePage, setActivePage] = useState('dashboard');

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Quick Stats */}
                            <div className="bg-[#1a4d2e] p-6 rounded-2xl text-white shadow-lg shadow-green-900/20">
                                <p className="text-green-100 text-sm font-medium mb-1">Total Students</p>
                                <h3 className="text-3xl font-bold">124</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-slate-500 text-sm font-medium mb-1">Avg Attendance</p>
                                <h3 className="text-3xl font-bold text-slate-800">92%</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-slate-500 text-sm font-medium mb-1">Assignments</p>
                                <h3 className="text-3xl font-bold text-slate-800">12</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-slate-500 text-sm font-medium mb-1">Pending Grading</p>
                                <h3 className="text-3xl font-bold text-orange-500">5</h3>
                            </div>
                        </div>
                        {/* Shortcuts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                            <div
                                onClick={() => setActivePage('quiz')}
                                className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 flex flex-col justify-center items-start cursor-pointer hover:scale-[1.02] transition-transform"
                            >
                                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-[#1a4d2e] mb-4 shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Create New Quiz</h3>
                                <p className="text-slate-600 mt-2">Use AI generation or manual entry.</p>
                            </div>
                            <div
                                onClick={() => setActivePage('students')}
                                className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center items-start cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">View Analytics</h3>
                                <p className="text-slate-500 mt-2">Check performance reports.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'quiz': return <QuizManager />;
            case 'students': return <StudentAnalytics />;
            case 'chat': return <ChatView />;
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8faf9] font-sans text-slate-900 selection:bg-green-100">
            <Sidebar activePage={activePage} onNavigate={setActivePage} />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
                    <h2 className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                        {activePage === 'dashboard' ? 'Overview' : activePage}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 focus-within:border-[#1a4d2e] transition-colors w-64">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400" />
                        </div>
                        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700 leading-none">Ms. Sarah</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Teacher</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#1a4d2e] flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                S
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}