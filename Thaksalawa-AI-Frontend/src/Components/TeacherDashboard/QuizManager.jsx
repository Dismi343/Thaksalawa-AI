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

const QuizManager = () => {
  const [viewState, setViewState] = useState('list'); // 'list', 'create_setup', 'create_questions', 'assign'
  const [creationMode, setCreationMode] = useState('manual'); // 'manual' or 'ai'
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const MOCK_STUDENTS = [
  { id: 1, name: 'Alex Johnson', grade: '10-A', avgScore: 88, attendance: '95%' },
  { id: 2, name: 'Sarah Williams', grade: '10-A', avgScore: 92, attendance: '98%' },
  { id: 3, name: 'Michael Brown', grade: '10-B', avgScore: 76, attendance: '82%' },
  { id: 4, name: 'Emily Davis', grade: '10-A', avgScore: 85, attendance: '90%' },
  { id: 5, name: 'James Wilson', grade: '10-B', avgScore: 64, attendance: '75%' },
];
  
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
            onChange={(e) => setQuizConfig({...quizConfig, subject: e.target.value})}
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
            onChange={(e) => setQuizConfig({...quizConfig, lesson: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Questions</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
              value={quizConfig.questionCount}
              onChange={(e) => setQuizConfig({...quizConfig, questionCount: parseInt(e.target.value)})}
              min="1" max="20"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
            <select 
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
              value={quizConfig.type}
              onChange={(e) => setQuizConfig({...quizConfig, type: e.target.value})}
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
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
              selectedStudents.includes(student.id) 
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
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
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
export default QuizManager;