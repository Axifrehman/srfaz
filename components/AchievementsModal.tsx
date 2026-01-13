
import React from 'react';
import { Achievement } from '../types';
import { ALL_ACHIEVEMENTS } from '../services/achievementData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
  kidName: string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedIds, kidName }) => {
  if (!isOpen) return null;

  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0f172a] w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 z-10">
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                 <span className="text-yellow-400 text-4xl">🏆</span> Hall of Fame
              </h2>
              <p className="text-gray-400 text-sm mt-1">{kidName}'s Collection</p>
           </div>
           <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 z-10">
           <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
              <span className="text-yellow-400">{unlockedCount} / {totalCount} Unlocked</span>
              <span className="text-gray-500">{percentage}% Complete</span>
           </div>
           <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide z-10">
           {ALL_ACHIEVEMENTS.map(achievement => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              return (
                 <div 
                    key={achievement.id}
                    className={`relative p-4 rounded-xl border transition-all duration-300 ${
                        isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 hover:border-yellow-400/50' 
                        : 'bg-black/30 border-white/5 grayscale opacity-60'
                    }`}
                 >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className={`font-bold uppercase tracking-wider text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {achievement.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-tight">
                        {isUnlocked ? achievement.description : 'Locked'}
                    </p>
                    {isUnlocked && (
                        <div className="absolute top-3 right-3 text-yellow-400 animate-pulse">
                           ✓
                        </div>
                    )}
                 </div>
              );
           })}
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};
