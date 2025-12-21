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
import { useEffect, useState } from 'react';
import { GetSubjects } from '../../Api/SubjectApi';
import { GetLesson } from '../../Api/LessonApi';
import { CreateQuize, GetResult, GetQuize,GetQuizQuestion,SubmitAnswer,FinishQuiz, CurrentProgress } from '../../Api/QuizApi';


export default function QuizModule({activePage,setActivePage,quizState,setQuizState}){
  const [subjects,setSubjects]=useState([]);
  const [lessons,setLessons]=useState([]);
  const [tempararyQuizType,setTempararyQuizType]=useState(null);
  const [tempararyQuizeTime,setTempararyQuizeTime]=useState(null);
  const [loading,setLoading]=useState(false);
  const [quizResult,setQuizResult]=useState(null);
  const [quizIncomplete,setQuizIncomplete]=useState(false);
  const [incompletedQuizName,setIncompletedQuizName]=useState('');
  const [quizQuestionData,setQuizQuestionData]=useState(null);
  const [currentQuestionIndex,setCurrentQuestionIndex]=useState(0);
  const [selectedAnswers,setSelectedAnswers]=useState({});
  const [timeRemaining,setTimeRemaining]=useState(null);
  const [quizId,setQuizId]=useState(null);
  const [viewAnswerType,setViewAnswerType]=useState(null); // 'correct' or 'incorrect'
  

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

    //---------------------------------------------------------------------------------------------
    // Load quiz questions when starting a new quiz
    //---------------------------------------------------------------------------------------------
    const loadQuiz=async(quizId)=>{
      try{
        const token= localStorage.getItem('token');
        const res= await GetQuizQuestion(token,quizId);
        console.log("current quiz going to start :",res.data);
        setQuizQuestionData(res.data);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        // Initialize timer based on quiz duration
        if(tempararyQuizeTime){
          setTimeRemaining(parseInt(tempararyQuizeTime) * 60);
        }
      }catch(e){
        console.log("error loading quize : ",e)
      }
    }
    // Helper functions to update quizState
    const updateQuizState = (key, value) => {
      setQuizState(prev => ({ ...prev, [key]: value }));
    };



    // Format time as MM:SS
    const formatTime = (seconds) => {
      if (!seconds) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle answer selection
    const handleSelectAnswer = (questionIndex, answerIndex, optionOrder) => {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: optionOrder // Store option_order (0-3)
      }));
    };

    // Handle next question
    const handleNextQuestion = async() => {
      const totalQuestions = quizQuestionData.questions.length;
      
      // Submit current answer first
     
       await submitAnswer();
      
      
      // Move to next question if not at the end
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // If at last question, finish the quiz
       await finishQuiz();
      }
    };

    // Handle previous question
    const handlePreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    };

    // Handle skip question
    const handleSkipQuestion = () => {
      handleNextQuestion();
    };


    const selectLessons=(subject)=>{
      updateQuizState('selectedSubject', subject);
      loadLessons(subject.sub_id);
    }

    useEffect(()=>{
        if (activePage =="quiz"){
        // Reset selected subject when entering quiz page
        setQuizState(prev => ({...prev, selectedSubject: null}));
        loadusers();
        }
    },[activePage, setQuizState])

    //---------------------------------------------------------------------------------------------
    // Load quiz results when selected from sidebar
    //---------------------------------------------------------------------------------------------

    const loadQuizResult = async (quizId) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const result = await GetResult(token, quizId);
        setQuizResult(result.data);
        setQuizIncomplete(false);
        
        console.log("Quiz result loaded:", result.data);
      } catch (error) {
        // Check if error is 400 (quiz not completed)
        if (error.response?.status === 400) {
          // Fetch quiz details to get the quiz name
          try {
            const token = localStorage.getItem('token');
            const quizzesRes = await GetQuize(token);
            const selectedQuiz = quizzesRes.data?.find(q => q.quiz_id === quizId);
            setIncompletedQuizName(selectedQuiz?.title || `Quiz #${quizId}`);
            setQuizIncomplete(true);
            console.log("Quiz not completed:", error.response);
          } catch {
            setIncompletedQuizName(`Quiz #${quizId}`);
            setQuizIncomplete(true);
          }
        } else {
          console.error("Failed to load quiz result:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (quizState.quizId) {
        loadQuizResult(quizState.quizId);
      }
    }, [quizState.quizId]);

    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------


    //---------------------------------------------------------------------------------------------
    //submit answer function
    //---------------------------------------------------------------------------------------------
    const submitAnswer=async()=>{
      const answerData=new FormData();
      answerData.append('quiz_id',quizId);
      answerData.append('question_id',quizQuestionData.questions[currentQuestionIndex].question_id);
        if (quizState.quizeType === 'mcq') {
        answerData.append('selected_option', (selectedAnswers[currentQuestionIndex] || 0));
        answerData.append('written_answer', '');
      } else if (quizState.quizeType === 'short') {
        answerData.append('selected_option', 0); // Not applicable for short answer
        answerData.append('written_answer', selectedAnswers[currentQuestionIndex] || '');
      }

      console.log('submitting answer',{
        quiz_id: answerData.get('quiz_id'),
        question_id: answerData.get('question_id'),
        selected_option: answerData.get('selected_option'),
        written_answer: answerData.get('written_answer')
      });
      try{
        const token= localStorage.getItem('token');
        const res= await SubmitAnswer(token,answerData);
        console.log("Answer submitted successfully",res.data);
      }catch(e){
        console.log("Failed to submit answer",e);
      }
    }


    //---------------------------------------------------------------------------------------------
    //finishing the quiz function
    //---------------------------------------------------------------------------------------------

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const finishQuiz=async()=>{
        try{
          const token= localStorage.getItem('token');
          const res=await FinishQuiz(token,quizId);
          console.log("Quiz finished successfully",res.data);
          
          // Load quiz results to display them
          await loadQuizResult(quizId);
          
          // Reset quiz creation state but keep quizId to show results
          setQuizState(prev => ({
            ...prev,
            selectedSubject: null,
            selectedlesson: null,
            quizeFrom: null,
            quizeType: null,
            quizeTime: null,
            questionCount: 0,
            quizId: quizId
          }));
        }catch(e){
          console.log("Failed to submit quiz",e);
        }
    }



    //---------------------------------------------------------------------------------------------
    //current progress function
    //---------------------------------------------------------------------------------------------

    // const loadCurrentProgress=async()=>{
    //        try{
    //       const token= localStorage.getItem('token');
    //       const res=await CurrentProgress(token,quizId);
    //       console.log("Current quiz progress loaded",res.data);
    //     }catch(e){
    //       console.log("Failed to load current quiz progress",e);
    //     }
    // }


    // Timer effect
    useEffect(() => {

    if (timeRemaining === 0) {
    console.log('Time expired! Finishing quiz automatically');
    finishQuiz();
    return;
       }
      if (timeRemaining === null || timeRemaining <= 0) return;
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }, [timeRemaining,finishQuiz]);


    const onstartQuiz=async()=>{
      if (!tempararyQuizType || !tempararyQuizeTime || !quizState.questionCount) {
        alert('Please select quiz type, duration, and number of questions');
        return;
      }

      setLoading(true);
      updateQuizState('quizeType', tempararyQuizType);
      updateQuizState('quizeTime', tempararyQuizeTime);

      const quizData = new FormData();
      quizData.append('lesson_id', quizState.selectedlesson.lesson_id);
      quizData.append('question_type', tempararyQuizType);
      quizData.append('num_questions', quizState.questionCount);

      console.log('quiz_data', {
        lesson_id: quizData.get('lesson_id'),
        question_type: quizData.get('question_type'),
        num_questions: quizData.get('num_questions')
      });
      const token = localStorage.getItem('token');
     
      try{
        const res=await CreateQuize(token,quizData);
        console.log("Quiz started successfully",res.data);
        loadQuiz(res.data.quiz_id);
        setQuizId(res.data.quiz_id);
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

  // Display quiz incomplete message when quiz hasn't been completed
  if(quizState.quizId && quizIncomplete && !quizState.quizeFrom){
    return (
      <>
        <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => {
          setQuizState({
            selectedSubject: null,
            selectedlesson: null,
            quizeFrom: null,
            quizeType: null,
            quizeTime: null,
            questionCount: 0,
            quizId: null
          });
          setQuizIncomplete(false);
          setIncompletedQuizName('');
        }}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="max-w-md w-full px-8 py-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-3xl font-bold text-[#1a4d2e]">Quiz Not Completed</h1>
              <p className="text-lg text-slate-600">
                You have not completed the quiz <span className="font-semibold">{incompletedQuizName}</span>
              </p>
              <p className="text-sm text-slate-500">
                Please complete the quiz first to view your results.
              </p>
              <button 
                onClick={() => {
                  setQuizState({
                    selectedSubject: null,
                    selectedlesson: null,
                    quizeFrom: null,
                    quizeType: null,
                    quizeTime: null,
                    questionCount: 0,
                    quizId: null
                  });
                  setQuizIncomplete(false);
                  setIncompletedQuizName('');
                }}
                className="mt-6 px-6 py-3 bg-[#1a4d2e] text-white rounded-xl font-semibold hover:bg-[#143d24] transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Display quiz when selected from sidebar
  if(quizState.quizId && quizResult && !quizState.quizeFrom){
    // Filter questions for correct/incorrect answers
    const correctQuestions = quizResult?.questions_with_answers?.filter((q) => q.is_correct === true) || [];
    const incorrectQuestions = quizResult?.questions_with_answers?.filter((q) => q.is_correct === false) || [];
    
    console.log('Total questions:', quizResult?.questions_with_answers?.length);
    console.log('Correct questions:', correctQuestions.length);
    console.log('Incorrect questions:', incorrectQuestions.length);

    // View answers modal
    if(viewAnswerType) {
      const questionsToShow = viewAnswerType === 'correct' ? correctQuestions : incorrectQuestions;
      const title = viewAnswerType === 'correct' ? 'Correct Answers' : 'Incorrect Answers';

      return (
        <>
          <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => setViewAnswerType(null)}>
            <ArrowLeft size={24} />
            Back to Results
          </button>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1a4d2e] mb-6">{title}</h1>
            <div className="space-y-4">
              {questionsToShow.map((question) => {
                const studentSelectedIndex = question.student_selected; // 0-3
                //const studentSelectedOption = question.options?.[studentSelectedIndex];
                
                return (
                  <div key={question.question_id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <div className="mb-4">
                      <p className="text-slate-500 text-sm font-medium">Question {question.question_id}</p>
                      <p className="text-lg font-semibold text-slate-800 mt-2">{question.question_text}</p>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900"><strong>Explanation:</strong> {question.explanation}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {question.options?.map((option, optionIdx) => {
                        const isStudentSelected = optionIdx === studentSelectedIndex;
                        const isCorrectOption = option.is_correct === true;
                        
                        return (
                          <div 
                            key={option.option_id}
                            className={`p-4 rounded-lg border-2 ${
                              isCorrectOption 
                                ? 'border-green-500 bg-green-50'
                                : isStudentSelected && !isCorrectOption
                                ? 'border-red-500 bg-red-50'
                                : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Circle 
                                size={20} 
                                className={`mt-0.5 flex-shrink-0 ${
                                  isCorrectOption 
                                    ? 'text-green-600' 
                                    : isStudentSelected && !isCorrectOption
                                    ? 'text-red-600'
                                    : 'text-slate-400'
                                }`}
                                fill={isCorrectOption || isStudentSelected ? 'currentColor' : 'none'}
                              />
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  isCorrectOption 
                                    ? 'text-green-700' 
                                    : isStudentSelected && !isCorrectOption
                                    ? 'text-red-700'
                                    : 'text-slate-700'
                                }`}>
                                  {option.option_text}
                                </p>
                                {isStudentSelected && isCorrectOption && <p className="text-xs text-green-600 mt-1">✓ Your answer (Correct)</p>}
                                {isStudentSelected && !isCorrectOption && <p className="text-xs text-red-600 mt-1">✗ Your answer (Wrong)</p>}
                                {!isStudentSelected && isCorrectOption && <p className="text-xs text-green-600 mt-1">✓ Correct answer</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }

    // Main results view
    return (
      <>
        <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => {
          setQuizState({
            selectedSubject: null,
            selectedlesson: null,
            quizeFrom: null,
            quizeType: null,
            quizeTime: null,
            questionCount: 0,
            quizId: null
          });
          setQuizResult(null);
          setViewAnswerType(null);
        }}>
          <ArrowLeft size={24} />
        </button>
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            {/* Left Side: Visual Header */}
            <div className="bg-[#1a4d2e] p-8 text-white relative overflow-hidden md:w-1/3 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">Quiz Result</span>
                <h2 className="text-2xl font-bold">Quiz No: {quizResult.quiz_id}</h2>
                <p className="text-green-100 mt-2 text-sm">Quiz completed</p>
              </div>

              <div className="mt-8">
                  <div className="text-4xl font-bold mb-1">{parseFloat(quizResult?.percentage).toFixed(2)}%</div>
                 <div className="text-xs text-green-200 uppercase tracking-wider">Your Score</div>
              </div>
            </div>

            {/* Right Side: Quiz Results */}
            <div className="p-8 md:w-2/3 flex flex-col">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">QUIZ DETAILS</p>
                  <p className="text-lg font-semibold text-slate-800 mt-1">{quizResult?.title || `Quiz #${quizResult.quiz_id}`}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button 
                    onClick={() => setViewAnswerType('correct')}
                    className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors cursor-pointer text-left"
                  >
                    <p className="text-xs text-slate-500 font-medium">CORRECT ANSWERS</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{correctQuestions.length}</p>
                  </button>
                  <button 
                    onClick={() => setViewAnswerType('incorrect')}
                    className="bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-left"
                  >
                    <p className="text-xs text-slate-500 font-medium">INCORRECT ANSWERS</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{incorrectQuestions.length}</p>
                  </button>
                </div>

                {quizResult?.total_questions && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-xs text-slate-500 font-medium">TOTAL QUESTIONS</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{quizResult.total_questions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if(!quizState.quizeFrom){
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
              onClick={() => updateQuizState("quizeFrom", "AI")}
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
              onClick={() => updateQuizState("quizeFrom", "Teacher")}
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
  else if(quizState.quizeFrom=="AI" && !quizState.selectedSubject){
    return (
      <>    
       <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => updateQuizState("quizeFrom", null)}>
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
   else if(quizState.quizeFrom=="AI" && quizState.selectedSubject && !quizState.selectedlesson){
    return (
      <>
       <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => updateQuizState("selectedSubject", null)}>
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
                onClick={() => {updateQuizState("selectedlesson", lesson)}}
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
  else if(quizState.quizeFrom=="AI" && quizState.selectedlesson && quizState.selectedSubject && !quizState.quizeType && !quizState.quizeTime){
    return (
     <>
        <button className="flex items-center gap-2 text-[#1a4d2e] hover:text-[#387D7A] mb-6 transition" onClick={() => updateQuizState("selectedlesson", null)}>
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
                  onChange={e => updateQuizState("questionCount", parseInt(e.target.value))}
                />
                <span className="text-slate-500 font-medium">Q's</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Choose between 1 to 50 questions</p>
            </div>

            {/* Start Button */}
            <button className="w-full p-4 rounded-2xl bg-[#1a4d2e] hover:bg-[#143d24] text-white text-lg font-bold shadow-lg transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={()=>{onstartQuiz()}}
            disabled={!tempararyQuizeTime || !tempararyQuizType || tempararyQuizeTime <1 || quizState.questionCount >50 ||  quizState.questionCount <1}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </>
    );
  }
  else if(quizState.quizeFrom==="AI" && quizState.selectedlesson && quizState.selectedSubject && quizState.quizeType && quizState.quizeTime && quizQuestionData){
    const currentQuestion = quizQuestionData.questions[currentQuestionIndex];
    const totalQuestions = quizQuestionData.questions.length;
    
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-center py-6">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Visual Header */}
          <div className="bg-[#1a4d2e] p-8 text-white relative overflow-hidden md:w-1/3 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">{quizState.selectedSubject?.name || 'Quiz'}</span>
              <h2 className="text-2xl font-bold">{quizState.selectedlesson?.name || 'Quiz'}</h2>
              <p className="text-green-100 mt-2 text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>

            <div className="mt-8">
               <div className={`text-4xl font-bold mb-1 transition-colors ${
                timeRemaining <= 300 ? 'text-red-400 animate-pulse' : 
                timeRemaining <= 600 ? 'text-yellow-300' : 
                'text-white'
              }`}>
                {formatTime(timeRemaining)}</div>
               <div className="text-xs text-green-200 uppercase tracking-wider">Time Remaining</div>
               {/* Progress bar for visual countdown */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    timeRemaining <= 300 ? 'bg-red-400' : 
                    timeRemaining <= 600 ? 'bg-yellow-400' : 
                    'bg-green-400'
                  }`}
                  style={{
                    width: `${(timeRemaining / (parseInt(quizState.quizeTime) * 60)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Questions */}
          <div className="p-8 md:w-2/3 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-sm font-bold">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i <= currentQuestionIndex ? 'bg-[#1a4d2e]' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-lg font-medium text-slate-800 mb-6">
              {currentQuestion?.question_text}
            </p>

           <div className="flex-1">
              {/* MCQ Type - Show Options */}
              {quizState.quizeType === 'mcq' && (
                <div className="space-y-3">
                  {currentQuestion?.options?.map((option, i) => (
                    <button 
                      key={option.option_id} 
                      onClick={() => handleSelectAnswer(currentQuestionIndex, i, option.option_order)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group ${
                        selectedAnswers[currentQuestionIndex] === option.option_order
                          ? 'border-[#1a4d2e] bg-green-50'
                          : 'border-slate-200 hover:border-[#1a4d2e] hover:bg-green-50'
                      }`}
                    >
                      <Circle 
                        className={`${
                          selectedAnswers[currentQuestionIndex] === option.option_order
                            ? 'text-[#1a4d2e]' 
                            : 'text-slate-300 group-hover:text-[#1a4d2e]'
                        }`} 
                        size={20} 
                        fill={selectedAnswers[currentQuestionIndex] === option.option_order ? '#1a4d2e' : 'none'}
                      />
                      <span className={`font-medium ${selectedAnswers[currentQuestionIndex] === option.option_order ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {option.option_text}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Short Answer Type - Show Text Input */}
              {quizState.quizeType === 'short' && (
                <div>
                  <textarea
                    value={selectedAnswers[currentQuestionIndex] || ''}
                    onChange={(e) => setSelectedAnswers(prev => ({
                      ...prev,
                      [currentQuestionIndex]: e.target.value
                    }))}
                    placeholder="Type your answer here..."
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-[#1a4d2e] focus:outline-none resize-none transition-colors"
                    rows="6"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    {selectedAnswers[currentQuestionIndex]?.length || 0} characters
                  </p>
                </div>
              )}
            </div>


            <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
              <button 
                onClick={handleSkipQuestion}
                className="text-slate-400 font-medium hover:text-slate-600 text-sm"
              >
                Skip
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                <button 
                  onClick={handleNextQuestion}
      
                  className="px-6 py-2.5 bg-[#1a4d2e] text-white rounded-xl font-bold hover:bg-[#143d24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/10 text-sm"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next Question'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if(quizState.quizeFrom==="Teacher"){
    return(
      <>
      </>
    )
  }
};