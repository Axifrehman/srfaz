import React, { useEffect, useState } from 'react';
import { KidProfile, UserStats } from '../types';
import { getKidStats } from '../services/storageService';
import { KIDS_PROFILES } from '../constants';

export const Leaderboard: React.FC = () => {
  const [rankedProfiles, setRankedProfiles] = useState<(KidProfile & { stats: UserStats })[]>([]);

  useEffect(() => {
    // Only rank the named kids, exclude guest if needed, or include guest
    const profilesWithStats = KIDS_PROFILES.filter(k => k.id !== 'guest').map(profile => ({
        ...profile,
        stats: getKidStats(profile.id)
    }));

    // Sort by XP descending
    const sorted = profilesWithStats.sort((a, b) => b.stats.xp - a.stats.xp);
    setRankedProfiles(sorted);
  }, []);

  return (
    <div className="bg-[#111827] rounded-3xl p-6 border border-white/10 shadow-2xl">
       <h3 className="text-2xl font-gaming font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
          <span className="text-yellow-400">🏆</span> Galactic Leaderboard
       </h3>

       <div className="space-y-3">
          {rankedProfiles.map((profile, index) => (
             <div key={profile.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                
                {/* Rank Badge */}
                <div className="w-8 flex-shrink-0 text-center font-black text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : <span className="text-gray-500 text-base">#{index + 1}</span>}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${profile.themeColor} flex items-center justify-center text-lg shadow-inner`}>
                   {profile.icon}
                </div>

                {/* Name & Stats */}
                <div className="flex-1">
                   <div className="font-bold text-white leading-none">{profile.name}</div>
                   <div className="text-[10px] text-gray-400 font-mono mt-1">
                      {profile.stats.wins} Wins • {profile.stats.totalPlays} Plays
                   </div>
                </div>

                {/* XP */}
                <div className="text-right">
                   <div className="font-gaming font-bold text-accent text-lg">{profile.stats.xp}</div>
                   <div className="text-[9px] text-accent/50 uppercase tracking-widest">XP</div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};