import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UploadCloud, FileText, CheckCircle2, Loader2, 
  Zap, Eye, Save, Trash2, AlertTriangle, BookOpen 
} from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

export default function SubjectUploader() {
  // Steps: 'initial', 'uploading', 'processing', 'review', 'success'
  const [step, setStep] = useState('initial'); 
  const [subjectName, setSubjectName] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedLessons, setExtractedLessons] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  

      useEffect(() => {
        const fetchData = async () => {
          try {
            setLoadingExisting(true);

            const [subjectsRes, lessonsRes] = await Promise.all([
              axios.get(`${API_URL}/subjects/get-all`),
              axios.get(`${API_URL}/lessons/all`)
            ]);

            const lessonsBySubject = lessonsRes.data.reduce((acc, lesson) => {
              const sid = lesson.Subject_sub_id;
              if (!acc[sid]) acc[sid] = [];
              acc[sid].push(lesson);
              return acc;
            }, {});

            const merged = subjectsRes.data.map(sub => ({
              ...sub,
              lessons: lessonsBySubject[sub.sub_id] || []
            }));

            setExistingSubjects(merged);
          } catch (err) {
            console.error(err);
          } finally {
           setTimeout(() => setLoadingExisting(false), 2500); //testing purpose
          }
        };

        fetchData();
      }, []);

      const SubjectSkeleton = () => (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm animate-pulse">
        <div className="p-5 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-3 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    );

    const LessonSkeleton = () => (
      <div className="p-3 rounded-2xl border border-slate-200 animate-pulse">
        <div className="h-3 w-20 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-52 bg-slate-200 rounded"></div>
      </div>
    );


  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      console.log(file.name);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // 2. The Main Processing Pipeline
 const startFullProcess = async () => {
  if (!subjectName || !file) {
    alert("Please provide both a subject name and a PDF file.");
    return;
  }

  let uploadRes = null;
  let subjectRes = null;

  try {
    // --- STEP A: UPLOAD PDF ---
    setStep('uploading');
    setLoadingMessage('Uploading PDF to server...');

    const formData = new FormData();
    formData.append("file", file);

    try {
      uploadRes = await axios.post(`${API_URL}/pdfs/upload`, formData);
      console.log("UPLOAD RESPONSE:", uploadRes);
    } catch (err) {
      console.error("UPLOAD FAILED:", err?.response || err);
      console.log("UPLOAD RESPONSE (PARTIAL):", uploadRes);
      throw err; // stop further steps
    }

    const pdfId = uploadRes.data.pdf_id;
    const file_name = uploadRes.data.file_name;

    // --- STEP B: CREATE SUBJECT ---
    setLoadingMessage('Creating subject entry...');

    try {
      subjectRes = await axios.post(`${API_URL}/subjects/create`, {
        name: subjectName,
        pdf_id: pdfId
      });
      console.log("SUBJECT RESPONSE:", subjectRes);
    } catch (err) {
      console.error("SUBJECT CREATION FAILED:", err?.response || err);
      console.log("SUBJECT RESPONSE (PARTIAL):", subjectRes);
      throw err;
    }

    const subjectId = subjectRes.data.sub_id;

    // --- STEP C: PROCESS LESSONS ---
    setStep('processing');
    setLoadingMessage('AI is extracting lessons. This usually takes 3-10 minutes.');

    const lessonsRes = await axios.post(
      `${API_URL}/lessons/process-and-store`,
      {
        pdf_filename: file_name,
        subject_id: subjectId,
      }
    );

    setExtractedLessons(lessonsRes.data.lessons);
    setStep('review');

  } catch (error) {
    console.error("FULL PROCESS FAILED:", error?.response || error);

    // Always log what we have
    console.log("FINAL UPLOAD RESPONSE:", uploadRes);
    console.log("FINAL SUBJECT RESPONSE:", subjectRes);

    alert("An error occurred during processing. Please check the console.");
    setStep('initial');
  }
};


  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Subject Content Upload</h1>
          <p className="text-slate-500">Transform your syllabus into structured digital lessons.</p>
        </div>
        {step === 'review' && (
          <button onClick={() => setStep('success')} className="bg-[#1a4d2e] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
            <Save size={18} /> Finish Setup
          </button>
        )}
      </div>

      {/* --- STEP 1: INITIAL INPUT --- */}
      {step === 'initial' && (
        <>
        <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject Name</label>
              <input 
                type="text" 
                placeholder="e.g. Grade 10 History"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#1a4d2e] outline-none transition-all"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            
            <div className="relative h-48 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center hover:border-[#1a4d2e] transition-colors group">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <UploadCloud size={40} className="text-slate-400 group-hover:text-[#1a4d2e] mb-2" />
              <p className="font-medium text-slate-600">{file ? file.name : "Select Syllabus PDF"}</p>
              <p className="text-xs text-slate-400 mt-1">PDF up to 50MB</p>
            </div>

            <button 
              onClick={startFullProcess}
              disabled={!file || !subjectName}
              className="w-full bg-[#1a4d2e] disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
            >
              Start AI Analysis
            </button>
          </div>
          
          <div className="bg-green-50 rounded-3xl p-8 flex flex-col justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e]"><Zap size={20}/></div>
              <p className="text-sm font-medium">AI will identify lesson topics automatically</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><BookOpen size={20}/></div>
              <p className="text-sm font-medium">Lesson content is indexed for your curriculum</p>
            </div>
          </div>
        </div>

        {/* --- EXISTING SUBJECTS & LESSONS --- */}
          <div className="mt-10 py-5 max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-[#1a4d2e]" />
              <h2 className="text-xl font-bold text-slate-800">
                Already Uploaded Subjects
              </h2>
            </div>

            {loadingExisting ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <SubjectSkeleton key={i} />
                ))}
              </div>
            ) : existingSubjects.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-500 text-center">
                No subjects uploaded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {existingSubjects.map(subject => (
                  <div
                    key={subject.sub_id}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm"
                  >
                    {/* SUBJECT HEADER */}
                    <div
                      onClick={() =>
                        setExpandedSubjectId(
                          expandedSubjectId === subject.sub_id ? null : subject.sub_id
                        )
                      }
                      className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                    >
                      <div>
                        <h3 className="font-bold text-slate-800">{subject.name}</h3>
                        <p className="text-xs text-slate-500">
                          {subject.lessons.length} lessons • {subject.file_name}
                        </p>
                      </div>
                      <Eye size={18} className="text-slate-400" />
                    </div>

                    {/* LESSONS */}
                    {expandedSubjectId === subject.sub_id && (
                      <div className="border-t border-slate-100 p-4 space-y-3">
                        {subject.lessons.length === 0
                          ? [...Array(3)].map((_, i) => <LessonSkeleton key={i} />)
                          : subject.lessons.map(lesson => (
                              <div
                                key={lesson.lesson_id}
                                className="p-3 rounded-2xl border border-slate-200 hover:border-[#1a4d2e]"
                              >
                                <span className="text-xs font-bold text-slate-500">
                                  Lesson {lesson.lesson_number}
                                </span>
                                <p className="font-medium text-slate-800">
                                  {lesson.name}
                                </p>
                              </div>
                            ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>


        </>
      )}

      {/* --- STEP 2 & 3: LOADING STATES --- */}
      {(step === 'uploading' || step === 'processing') && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative w-24 h-24 mb-8">
            <Loader2 size={96} className="text-[#1a4d2e] animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{loadingMessage}</h3>
          
          {step === 'processing' && (
            <div className="max-w-md bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 mt-4">
              <AlertTriangle className="text-amber-600 shrink-0" />
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Please do not close this tab or refresh the page. 
                Our AI is reading and structuring the entire document. This can take several minutes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- STEP 4: REVIEW SPLIT SCREEN --- */}
      {step === 'review' && (
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          {/* LEFT: REAL LESSON DATA */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" /> Extracted Lessons ({extractedLessons.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {extractedLessons.map((lesson) => (
                <div key={lesson.lesson_id} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#1a4d2e] transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">
                      Lesson {lesson.lesson_number}
                    </span>
                    <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{lesson.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {lesson.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PDF PREVIEW */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Eye size={18} /> Source Document</h3>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{file?.name}</span>
            </div>
            <iframe src={previewUrl} className="w-full h-full" title="PDF Preview" />
          </div>
        </div>
      )}

      {/* --- STEP 5: SUCCESS --- */}
      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">Setup Complete!</h3>
          <p className="text-slate-500 mb-8">Subject "{subjectName}" is ready with {extractedLessons.length} lessons.</p>
          <button onClick={() => window.location.reload()} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200">
            Go to Dashboard
          </button>
        </div>
      )}

      
    </div>
  );
}