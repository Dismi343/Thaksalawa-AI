import React, { useState, useEffect} from 'react';
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
  Layers, // Added for Flashcards
  Plus,   // Added for Flashcards
  Trash2, // Added for Flashcards
  RotateCcw // Added for Flashcards
} from 'lucide-react'

/* ==========================================================================
   2. FILE: src/Components/Dashboard/FlashcardModule.jsx
   ==========================================================================
*/

const FlashcardModule = () => {
  const [view, setView] = useState('selection'); // 'selection', 'teacher_deck', 'my_deck'
  const [subject, setSubject] = useState('');
  const [lesson, setLesson] = useState('');
  const [cards, setCards] = useState([]);

  const MOCK_TEACHER_CARDS = {
  "Physics": {
    "Newton's Laws": [
      { id: 1, question: "What is Newton's First Law?", answer: "An object stays at rest or in motion unless acted upon by a force.", difficulty: 'Easy' },
      { id: 2, question: "Define Force.", answer: "A push or pull upon an object resulting from the object's interaction with another object.", difficulty: 'Medium' },
      { id: 3, question: "What is the formula for the Second Law?", answer: "F = ma (Force = mass × acceleration)", difficulty: 'Hard' }
    ],
    "Thermodynamics": [
      { id: 4, question: "What is the Zeroth Law?", answer: "If two systems are in thermal equilibrium with a third system, they are in equilibrium with each other.", difficulty: 'Medium' }
    ]
  },
  "Chemistry": {
    "Periodic Table": [
      { id: 5, question: "Symbol for Gold?", answer: "Au", difficulty: 'Easy' }
    ]
  }
};
  
  // State for My Flashcards
  const [myCards, setMyCards] = useState([
    { id: 101, question: 'My Custom Q1', answer: 'My Custom Answer 1', difficulty: 'Easy' }
  ]);
  const [newCard, setNewCard] = useState({ question: '', answer: '', difficulty: 'Medium' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper: Card Component
  const FlipCard = ({ card, autoFlipDelay = null }) => {
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
      if (autoFlipDelay) {
        const timer = setTimeout(() => {
          setFlipped(true);
          setTimeout(() => setFlipped(false), 2000); // Flip back after 2s
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [autoFlipDelay]);

    const getDifficultyColor = (diff) => {
      switch(diff.toLowerCase()) {
        case 'easy': return 'bg-green-100 text-green-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'hard': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
      }
    };

    return (
      <div 
        className="h-64 w-full perspective-1000 cursor-pointer group"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d shadow-sm rounded-2xl ${flipped ? 'rotate-y-180' : ''}`} 
             style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          
          {/* FRONT */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col justify-between items-center" style={{ backfaceVisibility: 'hidden' }}>
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">QUESTION</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(card.difficulty)}`}>{card.difficulty}</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h3 className="text-lg font-bold text-slate-800">{card.question}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-4">Click to reveal answer</p>
          </div>

          {/* BACK */}
          <div className="absolute w-full h-full backface-hidden bg-[#1a4d2e] rounded-2xl p-6 flex flex-col justify-center items-center text-white" 
               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <span className="text-xs font-bold text-green-200 mb-2">ANSWER</span>
            <p className="text-lg font-medium leading-relaxed">{card.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  // Logic: View Teacher Decks
  const handleViewTeacherDeck = () => {
    if (subject && lesson && MOCK_TEACHER_CARDS[subject] && MOCK_TEACHER_CARDS[subject][lesson]) {
      setCards(MOCK_TEACHER_CARDS[subject][lesson]);
      setView('teacher_deck');
    } else {
      alert("No cards found for this selection. Try Physics > Newton's Laws");
    }
  };

  // Logic: Create Personal Card
  const handleCreateCard = () => {
    if (newCard.question && newCard.answer) {
      setMyCards([...myCards, { id: Date.now(), ...newCard }]);
      setNewCard({ question: '', answer: '', difficulty: 'Medium' });
      setShowAddForm(false);
    }
  };

  // Logic: Delete Personal Card
  const handleDeleteCard = (id) => {
    setMyCards(myCards.filter(c => c.id !== id));
  };

  /* --- VIEW 1: SELECTION MENU --- */
  if (view === 'selection') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800">Flashcards</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Teacher Decks */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-[#1a4d2e] mb-6">
              <Layers size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Subject Decks</h2>
            <p className="text-slate-500 mb-6">Study from verified flashcards created by your teachers.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {Object.keys(MOCK_TEACHER_CARDS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lesson</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  disabled={!subject}
                >
                  <option value="">Select Lesson</option>
                  {subject && Object.keys(MOCK_TEACHER_CARDS[subject] || {}).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <button 
                onClick={handleViewTeacherDeck}
                className="w-full bg-[#1a4d2e] text-white py-3 rounded-xl font-bold mt-4 hover:bg-[#143d24] transition-colors"
              >
                View Cards
              </button>
            </div>
          </div>

          {/* Card 2: My Decks */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50 -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 relative z-10">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 relative z-10">My Flashcards</h2>
            <p className="text-slate-500 mb-6 relative z-10">Create your own customized decks to focus on your weak points.</p>
            
            <div className="p-4 bg-orange-50 rounded-xl mb-6 relative z-10">
              <span className="block text-2xl font-bold text-orange-600">{myCards.length}</span>
              <span className="text-xs font-bold text-orange-400 uppercase">Personal Cards Created</span>
            </div>

            <button 
              onClick={() => setView('my_deck')}
              className="w-full border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-colors relative z-10"
            >
              Manage My Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --- VIEW 2: TEACHER DECK (WITH AUTO FLIP) --- */
  if (view === 'teacher_deck') {
    return (
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('selection')} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight className="rotate-180" /></button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{lesson}</h2>
            <p className="text-slate-500 text-sm">{subject} • {cards.length} Cards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
          {cards.map((card, index) => (
            // Pass autoFlipDelay only to the first card (index 0)
            <FlipCard key={card.id} card={card} autoFlipDelay={index === 0 ? true : false} />
          ))}
        </div>
      </div>
    );
  }

  /* --- VIEW 3: MY DECK --- */
  if (view === 'my_deck') {
    return (
      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('selection')} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight className="rotate-180" /></button>
            <h2 className="text-2xl font-bold text-slate-800">My Flashcards</h2>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-[#1a4d2e] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#143d24]"
          >
            <Plus size={18} /> Create New
          </button>
        </div>

        {/* Add New Card Form Modal (Inline for simplicity) */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-slate-800 mb-4">Create New Flashcard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                placeholder="Question"
                value={newCard.question}
                onChange={e => setNewCard({...newCard, question: e.target.value})}
              />
              <input 
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-[#1a4d2e]"
                placeholder="Answer"
                value={newCard.answer}
                onChange={e => setNewCard({...newCard, answer: e.target.value})}
              />
            </div>
            <div className="flex justify-between items-center">
              <select 
                className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm"
                value={newCard.difficulty}
                onChange={e => setNewCard({...newCard, difficulty: e.target.value})}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                <button onClick={handleCreateCard} className="px-6 py-2 bg-[#1a4d2e] text-white font-bold rounded-lg hover:bg-[#143d24]">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* List of My Cards */}
        {myCards.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            <Layers size={48} className="mx-auto mb-4 opacity-20" />
            <p>You haven't created any cards yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
            {myCards.map((card) => (
              <div key={card.id} className="relative group">
                <FlipCard card={card} />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default FlashcardModule;