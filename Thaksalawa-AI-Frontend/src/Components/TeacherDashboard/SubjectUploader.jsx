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
  Trash2,
  UploadCloud,
  FileText,
  Eye,
  Loader2
} from 'lucide-react';

export default function SubjectUploader() {
  const [step, setStep] = useState('upload'); // 'upload', 'scanning', 'review', 'success'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedLessons, setExtractedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  // Handle File Drop/Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      startScanning();
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Mock AI Scanning Process
  const startScanning = () => {
    setStep('scanning');
    setProgress(0);
    
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishScanning();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const finishScanning = () => {
    // Mock extraction results
    setExtractedLessons([
      { id: 1, topic: 'Introduction to Mechanics', confidence: 98 },
      { id: 2, topic: 'Newton\'s First Law of Motion', confidence: 95 },
      { id: 3, topic: 'Force, Mass, and Acceleration', confidence: 92 },
      { id: 4, topic: 'Action and Reaction Forces', confidence: 88 },
      { id: 5, topic: 'Friction and Air Resistance', confidence: 85 },
    ]);
    setTimeout(() => setStep('review'), 500);
  };

  const updateLesson = (id, newVal) => {
    setExtractedLessons(extractedLessons.map(l => l.id === id ? { ...l, topic: newVal } : l));
  };

  const deleteLesson = (id) => {
    setExtractedLessons(extractedLessons.filter(l => l.id !== id));
  };

  const addLesson = () => {
    const newId = Math.max(...extractedLessons.map(l => l.id), 0) + 1;
    setExtractedLessons([...extractedLessons, { id: newId, topic: 'New Lesson Topic', confidence: 100 }]);
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Subject Content Upload</h1>
          <p className="text-slate-500">Upload syllabus PDFs to generate lesson plans automatically.</p>
        </div>
        {step === 'review' && (
          <div className="flex gap-3">
            <button onClick={() => setStep('upload')} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
            <button onClick={() => setStep('success')} className="bg-[#1a4d2e] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#143d24] flex items-center gap-2">
              <Save size={18} /> Save Lessons
            </button>
          </div>
        )}
      </div>

      {/* --- STEP 1: UPLOAD AREA --- */}
      {step === 'upload' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl m-4 hover:border-[#1a4d2e] hover:bg-green-50/30 transition-all cursor-pointer relative">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6">
            <UploadCloud size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Subject PDF</h3>
          <p className="text-slate-500 mb-8">Drag & drop or click to browse</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><FileText size={16} /> PDF only</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={16} /> Max 50MB</span>
          </div>
        </div>
      )}

      {/* --- STEP 2: SCANNING --- */}
      {step === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm m-4">
          <div className="relative w-24 h-24 mb-8">
            <Loader2 size={96} className="text-slate-200 animate-spin absolute" />
            <Loader2 size={96} className="text-[#1a4d2e] animate-spin absolute" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#1a4d2e]">
              {progress}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Analyzing Document...</h3>
          <p className="text-slate-500">Extracting lessons, topics, and keywords from your PDF.</p>
        </div>
      )}

      {/* --- STEP 3: REVIEW SPLIT SCREEN --- */}
      {step === 'review' && (
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          
          {/* LEFT: EDITABLE LESSONS */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-purple-600" /> Extracted Lessons
              </h3>
              <button onClick={addLesson} className="text-[#1a4d2e] text-sm font-bold hover:underline">+ Add Topic</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {extractedLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl group hover:border-[#1a4d2e] focus-within:border-[#1a4d2e] transition-colors shadow-sm">
                  <div className="pt-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {lesson.id}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Lesson Topic</label>
                    <input 
                      type="text" 
                      value={lesson.topic}
                      onChange={(e) => updateLesson(lesson.id, e.target.value)}
                      className="w-full font-medium text-slate-800 outline-none bg-transparent border-b border-transparent focus:border-green-200 pb-1"
                    />
                  </div>
                  <button 
                    onClick={() => deleteLesson(lesson.id)}
                    className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-800 text-sm flex items-start gap-3">
                <Zap size={20} className="shrink-0 mt-0.5" />
                <p><strong>AI Tip:</strong> Please verify the lesson order on the left matches the Table of Contents in the PDF on the right.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: PDF PREVIEW */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Eye size={18} /> Document Preview
              </h3>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{file?.name}</span>
            </div>
            <div className="flex-1 bg-slate-200 relative overflow-hidden">
              {/* Using iframe for PDF preview */}
              <iframe 
                src={previewUrl} 
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>

        </div>
      )}

      {/* --- STEP 4: SUCCESS --- */}
      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm m-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#1a4d2e] mb-6">
            <Check size={40} strokeWidth={4} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Subject Content Added!</h3>
          <p className="text-slate-500 mb-8">5 lessons have been successfully saved to your curriculum.</p>
          <button onClick={() => setStep('upload')} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200">
            Upload Another Document
          </button>
        </div>
      )}
    </div>
  );
};