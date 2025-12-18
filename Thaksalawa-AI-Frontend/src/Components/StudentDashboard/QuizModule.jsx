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
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { GetSubjects } from '../../Api/SubjectApi';
import { GetLesson } from '../../Api/LessonApi';
import { CreateQuize } from '../../Api/QuizApi';


export default function QuizModule({activePage,selectedSubject,setSelectedSubject,setActivePage}){
  const [subjects,setSubjects]=useState([]);
  const [selectedlesson,setSelectedlesson]=useState(null);
  const [lessons,setLessons]=useState([]);
  const[quizeFrom,setQuizeFrom]=useState();
  const [quizeType,setQuizeType]=useState(null);
  const [quizeTime,setQuizeTime]=useState(null);
  const [tempararyQuizType,setTempararyQuizType]=useState(null);
  const [tempararyQuizeTime,setTempararyQuizeTime]=useState(null);
  const [loading,setLoading]=useState(false);
  const [questionCount,setQuestionCount]=useState(0);

    const loadusers=async()=>{
      try{
        const token=localStorage.getItem('token');
        const response=await GetSubjects(token);
         setSubjects(response.data);
        console.log(response.data);
      }catch(e){
        console.error("Failed to load subjects",e);
      }
    }

    const loadLessons=async(subject_id)=>{
      try{
      const response = await GetLesson(subject_id);
      console.log(response.data);
      setLessons(response.data);
      }catch(e){
        console.log("Failed to load lessons",e);
      }
    }

    const selectLessons=(subject)=>{
      setSelectedSubject(subject);
      loadLessons(subject.sub_id);
    }

    useEffect(()=>{
        if (activePage =="quiz"){
        setSelectedSubject(null);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadusers();
        }
    },[activePage])

    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------

    const onstartQuiz=async()=>{
      if (!tempararyQuizType || !tempararyQuizeTime || !questionCount) {
        alert('Please select quiz type, duration, and number of questions');
        return;
      }

      setLoading(true);
      setQuizeType(tempararyQuizType);
      setQuizeTime(tempararyQuizeTime);

      const quizData = new FormData();
      quizData.append('lesson_id', selectedlesson.lesson_id);
      quizData.append('quiz_type', tempararyQuizType);
      quizData.append('num_questions', questionCount);

      console.log('quiz_data', {
        lesson_id: selectedlesson.lesson_id,
        quiz_type: tempararyQuizType,
        num_questions: questionCount
      });
      const token = localStorage.getItem('token');
      try{
        const res=await CreateQuize(token,quizData);
        console.log("Quiz started successfully",res.data);
        setLoading(false);
      }catch(e){
        console.log("Failed to start quiz",e);
        setLoading(false);
      }
    }



    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------


  if(loading){
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[#1a4d2e] animate-spin" />
          <h2 className="text-2xl font-bold text-[#1a4d2e]">Starting Quiz...</h2>
          <p className="text-slate-500">Please wait while we prepare your quiz</p>
        </div>
      </div>
    );
  }

  if(!quizeFrom){
    return (
      <>
       <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => setActivePage('dashboard')}>
        <ArrowLeft size={24} />
      </button>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-2xl w-full px-8">
          <h1 className="text-3xl font-bold text-[#1a4d2e] mb-2 text-center">Select Quiz Source</h1>
          <p className="text-slate-500 mb-12 text-center">Choose where your quiz questions come from.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* AI Quiz Option */}
            <button
              onClick={() => setQuizeFrom("AI")}
              className="flex flex-col justify-center items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-[#2e5f5d] to-[#387D7A] hover:shadow-lg shadow border border-slate-100 hover:shadow-green-900/20 transition-all w-full h-40 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">🤖</div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-1">AI Generated</h3>
                <p className="text-green-100 text-sm">AI-powered questions based on lessons</p>
              </div>
            </button>

            {/* Teacher Quiz Option */}
            <button
              onClick={() => setQuizeFrom("Teacher")}
              className="flex flex-col justify-center items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-[#2e5f5d] to-[#387D7A] hover:shadow-lg shadow border border-slate-100 hover:shadow-green-900/20 transition-all w-full h-40 group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">👨‍🏫</div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-1">Teacher Created</h3>
                <p className="text-green-100 text-sm">Questions set by your teacher</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }
  else if(quizeFrom=="AI" && !selectedSubject){
    return (
      <>    
       <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => setQuizeFrom(null)}>
            <ArrowLeft size={24} />
          </button>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-2xl w-full px-8">
          <h1 className="text-3xl font-bold text-[#1a4d2e] mb-2 text-center">Select a Subject</h1>
          <p className="text-slate-500 mb-8 text-center">Choose a subject for lesson lesson selection.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subjects.map((subject) => (
             <button
                key={subject.name}
                onClick={() => selectLessons(subject)}
                className={`flex justify-center items-center gap-4 p-6 rounded-2xl bg-[#2e5f5d] hover:bg-[#387D7A] shadow border border-slate-100 hover:shadow-lg transition-all ${subject.color} hover:bg-opacity-80 w-full h-20`}
              >
                <span className="text-3xl">{subject.icon}</span>
                <span className="text-lg font-semibold text-white">{subject.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
        </>
    );
  }
   else if(quizeFrom=="AI" && selectedSubject && !selectedlesson){
    return (
      <>
       <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => setSelectedSubject(null)}>
            <ArrowLeft size={24} />
          </button>
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-2xl w-full px-8 my-10">
          <h1 className="text-3xl font-bold text-[#1a4d2e] mb-2 text-center">Select a Lesson</h1>
          <p className="text-slate-500 mb-8 text-center">Choose a lesson to start your quiz.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <button
                key={lesson.name}
                onClick={() => {setSelectedlesson(lesson)}}
                className={`flex items-center gap-4 p-6 rounded-2xl shadow border border-slate-100 hover:shadow-lg transition-all ${lesson.color} hover:bg-opacity-80`}
              >
                <span className="text-xl">{lesson.lesson_number}</span>
                <span className="text-lg font-semibold text-[#1a4d2e]">{lesson.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </>
      
    );
  }
  else if(quizeFrom=="AI" && selectedlesson && selectedSubject && !quizeType && !quizeTime){
    return (
     <>
        <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => setSelectedlesson(null)}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="max-w-md w-full px-8">
            <h1 className="text-3xl font-bold text-[#1a4d2e] mb-2 text-center">Select Quiz Type</h1>
            <p className="text-slate-500 mb-8 text-center">Choose the type of quiz you want to take for this lesson.</p>
            
            {/* Quiz Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#1a4d2e] mb-2">Quiz Type</label>
              <select
                className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-[#1a4d2e] text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                defaultValue=""
                onChange={e => setTempararyQuizType(e.target.value)}
              >
                <option value="" disabled>Select quiz type...</option>
                <option value="mcq">Multiple Choice (MCQ)</option>
                <option value="short">Short Answer</option>
              </select>
            </div>

            {/* Quiz Time Picker */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#1a4d2e] mb-2">Quiz Duration (minutes)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="180"
                  defaultValue="30"
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-[#1a4d2e] text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                  placeholder="Enter time in minutes"
                  onChange={e=>setTempararyQuizeTime(e.target.value)}
                />
                <span className="text-slate-500 font-medium">min</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Choose between 5 to 180 minutes</p>
            </div>
            {/* Question Count Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#1a4d2e] mb-2">Number of Questions</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="10"
                  className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-[#1a4d2e] text-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                  placeholder="Enter number of questions"
                  onChange={e => setQuestionCount(parseInt(e.target.value) || 0)}
                />
                <span className="text-slate-500 font-medium">Q's</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Choose between 1 to 50 questions</p>
            </div>

            {/* Start Button */}
            <button className="w-full p-4 rounded-2xl bg-[#1a4d2e] hover:bg-[#143d24] text-white text-lg font-bold shadow-lg transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={()=>{onstartQuiz()}}
            disabled={!tempararyQuizType || !tempararyQuizeTime || questionCount <1 || questionCount >50}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </>
    );
  }
  else if(quizeFrom==="Teacher"){
    return(
      <>
      </>
    )
  }
  else if(quizeFrom==="AI" && selectedlesson && selectedSubject && quizeType && quizeTime){
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
}
};