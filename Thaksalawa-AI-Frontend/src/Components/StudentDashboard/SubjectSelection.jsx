import React from "react";
import { GraduationCap, ChevronLeft } from "lucide-react";

// SUBJECT LIST DATA (Shared)
export const SUBJECTS = [
  {
    id: 'math', name: 'Mathematics', icon: GraduationCap,
    color: 'bg-emerald-100 text-emerald-700',
    lessons: ["Algebra Basics", "Geometry 101", "Calculus I", "Statistics"]
  },
  {
    id: 'science', name: 'Science', icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700',
    lessons: ["Biology: Cell Structure", "Chemistry: Periodic Table", "Physics: Motion", "Earth Science"]
  }
];

const SubjectSelection = ({ onSelectSubject }) => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
          <GraduationCap size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a Subject</h2>
        <p className="text-slate-500">Choose a domain to explore today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {SUBJECTS.map((subject) => {
          const Icon = subject.icon;
          return (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="flex items-center gap-4 p-6 rounded-2xl border hover:shadow-md transition-all bg-slate-50 hover:bg-white"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${subject.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{subject.name}</h3>
                <p className="text-xs text-slate-400">{subject.lessons.length} Modules Available</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelection;
