import React, { useMemo } from 'react';
import { Game } from '../types';

interface DailyChallengeProps {
  games: Game[];
  onPlay: (game: Game) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ games, onPlay }) => {
  const challengeGame = useMemo(() => {
    if (games.length === 0) return null;
    const today = new Date();
    // Use date as seed to pick a consistent game for the day
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % games.length;
    return games[index];
  }, [games]);

  if (!challengeGame) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,88,12,0.3)] mb-8 border border-white/20 group cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => onPlay(challengeGame)}>
       <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black rotate-12 pointer-events-none">📅</div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
       
       <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg overflow-hidden flex-shrink-0 bg-black">
             <img src={challengeGame.image} alt="Challenge" className="w-full h-full object-cover" />
          </div>
          
          <div className="text-center md:text-left flex-1">
             <div className="inline-block bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded mb-1 uppercase tracking-widest animate-pulse">
                Daily Challenge
             </div>
             <h3 className="text-2xl font-black text-white">{challengeGame.name}</h3>
             <p className="text-orange-100 text-sm font-medium line-clamp-1">{challengeGame.description}</p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-center">
             <div className="text-xs text-orange-200 uppercase font-bold">Reward</div>
             <div className="text-xl font-black text-yellow-400">2x XP</div>
          </div>
       </div>
    </div>
  );
};