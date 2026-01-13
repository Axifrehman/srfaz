
import React, { useEffect, useState } from 'react';
import { Game, GameStats } from '../types';
import { DEFAULT_GAME_IMAGE } from '../constants';
import { getGameFunDescription } from '../services/geminiService';

interface GameDetailsModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  stats?: GameStats;
  onRateGame: (e: React.MouseEvent, gameId: string, action: 'LIKE' | 'DISLIKE') => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ 
  game, 
  isOpen, 
  onClose, 
  onPlay,
  isFavorite,
  onToggleFavorite,
  stats,
  onRateGame
}) => {
  const [aiContent, setAiContent] = useState<{ summary: string; funFact: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (game && isOpen) {
        setLoadingAi(true);
        setAiContent(null); // Reset
        getGameFunDescription(game)
          .then(content => {
            setAiContent(content);
            setLoadingAi(false);
          })
          .catch(() => setLoadingAi(false));
    }
  }, [game, isOpen]);

  if (!isOpen || !game) return null;

  // Difficulty Color Mapping
  const difficultyColors = {
    'Easy': 'text-green-400 border-green-400/30 bg-green-400/10',
    'Medium': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    'Hard': 'text-red-400 border-red-400/30 bg-red-400/10',
  };

  const plays = stats?.plays || 0;
  const likes = (stats?.likes || 0) + (game.likes || 0);
  const wins = stats?.wins || 0;
  const losses = stats?.losses || 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#1e1b4b] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.25)] transform transition-all scale-100 relative border border-white/10 ring-4 ring-white/5 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Buttons overlay */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={onToggleFavorite}
              className={`p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 border border-white/20 ${isFavorite ? 'bg-secondary text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-secondary'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="bg-black/40 hover:bg-red-500/80 hover:text-white text-white/70 p-3 rounded-full backdrop-blur-sm transition-all shadow-lg border border-white/20 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Hero Image Section */}
        <div className="h-64 md:h-auto md:w-2/5 overflow-hidden relative group">
          <img 
            src={game.image || DEFAULT_GAME_IMAGE} 
            alt={game.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={(e) => e.currentTarget.src = DEFAULT_GAME_IMAGE}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] md:bg-gradient-to-r md:from-transparent md:to-[#1e1b4b]"></div>
          
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
             {game.category && (
                <span className="bg-accent text-black text-xs font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)] border border-yellow-200">
                  {game.category}
                </span>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 md:w-3/5 flex flex-col overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-none drop-shadow-md">{game.name}</h2>
          
          {/* Detailed Stats Row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-gray-300 text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                 🕹️ {plays} Plays
              </span>
              <span className="text-green-400 text-xs font-bold bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                 🏆 {wins} Wins
              </span>
              <span className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                 💀 {losses} Losses
              </span>
              
              {game.difficulty && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${difficultyColors[game.difficulty]}`}>
                  ⚡ {game.difficulty}
                </span>
              )}
          </div>

          <div className="mb-6 space-y-4">
              {/* Mission Brief Section */}
              <div>
                <h3 className="text-accent text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="animate-pulse">✨</span> Mission Brief
                </h3>
                
                <div className="text-indigo-100/90 font-medium leading-relaxed text-lg bg-black/20 p-4 rounded-xl border border-white/5 min-h-[60px]">
                  {aiContent ? (
                    <p className="animate-fade-in">{aiContent.summary}</p>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Downloading mission data...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fun Fact Section */}
              {aiContent && aiContent.funFact && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl animate-fade-in delay-100">
                    <h4 className="text-yellow-400 font-black text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                        <span>💡</span> Did You Know?
                    </h4>
                    <p className="text-yellow-100/80 text-sm italic">
                        {aiContent.funFact}
                    </p>
                </div>
              )}
          </div>
          
          <div className="mt-auto">
             <div className="flex items-center justify-between mb-4 bg-white/5 rounded-xl p-3 border border-white/10">
                 <span className="text-xs font-bold text-gray-400 uppercase">Rate this mission:</span>
                 <div className="flex gap-4">
                    <button 
                         onClick={(e) => onRateGame(e, game.id, 'LIKE')}
                         className="flex items-center gap-2 text-gray-300 hover:text-green-400 hover:scale-110 transition-all"
                    >
                         <span className="text-2xl">👍</span>
                         <span className="font-bold">{likes}</span>
                    </button>
                    <button 
                         onClick={(e) => onRateGame(e, game.id, 'DISLIKE')}
                         className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:scale-110 transition-all"
                    >
                         <span className="text-2xl">👎</span>
                    </button>
                 </div>
             </div>

             <button 
                onClick={onPlay}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 text-white text-2xl font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(74,222,128,0.3)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-wiggle border-b-4 border-emerald-800 active:border-b-0 active:mt-1"
             >
                <span className="bg-black/20 rounded-full p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </span>
                START GAME
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
