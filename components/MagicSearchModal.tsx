import React, { useState } from 'react';
import { getGameRecommendation } from '../services/geminiService';
import { Game } from '../types';

interface MagicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onGameFound: (gameName: string) => void;
}

export const MagicSearchModal: React.FC<MagicSearchModalProps> = ({ isOpen, onClose, games, onGameFound }) => {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleMagicSearch = async () => {
    if (!prompt.trim()) return;
    
    setIsThinking(true);
    setError('');
    
    try {
      // Simulate slight delay for effect if API is too fast, gives "thinking" vibe
      const resultName = await getGameRecommendation(prompt, games);
      
      if (resultName === "No exact match" || resultName.includes("Sorry")) {
        setError("I couldn't find a perfect match. Try describing it differently!");
      } else {
        onGameFound(resultName);
        onClose();
      }
    } catch (e) {
      setError("Oops, my magic wand broke. Try again!");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1e1b4b] border border-white/20 w-full max-w-md rounded-[2rem] p-8 shadow-[0_0_50px_rgba(129,140,248,0.3)] text-white relative overflow-hidden">
        
        {/* Decorative sparkles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>

        <h3 className="text-3xl font-black mb-4 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
          ✨ Magic Finder
        </h3>
        <p className="text-indigo-200 mb-6 relative z-10 font-medium leading-relaxed">
          Tell me what you want to play! <br/>
          <span className="text-xs text-white/50 italic">Example: "I want to drive a fast car in the snow" or "A game with zombies".</span>
        </p>

        <textarea
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 resize-none h-32 relative z-10 transition-all"
          placeholder="Type your wish here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isThinking}
        />

        {error && <p className="text-red-400 mt-3 text-sm font-bold animate-bounce bg-red-900/20 px-3 py-1 rounded-lg border border-red-500/20">{error}</p>}

        <div className="flex gap-3 mt-8 relative z-10">
          <button 
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-xl font-bold transition-colors text-gray-300 hover:text-white"
            disabled={isThinking}
          >
            Cancel
          </button>
          <button 
            onClick={handleMagicSearch}
            disabled={isThinking || !prompt}
            className="flex-1 bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-300 hover:to-yellow-500 text-black py-3.5 rounded-xl font-black shadow-lg shadow-yellow-500/20 transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2"
          >
            {isThinking ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </>
            ) : (
              "Find It! 🚀"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};