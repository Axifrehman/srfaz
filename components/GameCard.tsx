
import React from 'react';
import { Game, GameStats } from '../types';
import { DEFAULT_GAME_IMAGE } from '../constants';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  accentColor?: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  stats?: GameStats; 
  onRateGame?: (e: React.MouseEvent, gameId: string, action: 'LIKE' | 'DISLIKE') => void;
  variant?: 'small' | 'medium' | 'large' | 'wide';
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  onClick, 
  accentColor = "from-primary to-purple-600", 
  isFavorite, 
  onToggleFavorite,
  stats,
  onRateGame,
  variant = 'small'
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_GAME_IMAGE;
  };

  // Compact Sizes
  const containerClasses = {
    small: 'col-span-1 row-span-1 h-[240px]', 
    medium: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2 h-[480px]', 
    large: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2 h-[480px]', 
    wide: 'col-span-1 row-span-1 md:col-span-2 md:row-span-1 h-[240px]', 
  };

  const plays = stats?.plays || 0;
  const likes = (stats?.likes || 0) + (game.likes || 0); // Combine mock + real
  const wins = stats?.wins || 0;

  // Determine badges
  const isHot = (likes > 300 || plays > 50);
  const isNew = parseInt(game.id.split('-')[1] || '0') < 20; // Just mock logic for "New"
  
  const difficultyColor = {
      'Easy': 'bg-green-500 text-black',
      'Medium': 'bg-yellow-500 text-black',
      'Hard': 'bg-red-500 text-white'
  };

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-[#1e293b] border border-white/10 hover:border-accent/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] ${containerClasses[variant]}`}
      onClick={() => onClick(game)}
    >
      {/* Dynamic Accent Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-t ${accentColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

      {/* Image Area */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img 
          src={game.image} 
          alt={game.name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space via-space/20 to-transparent opacity-90"></div>
      </div>

      {/* Badges - Top Left (Always Visible) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
         {/* Difficulty Badge */}
         {game.difficulty && (
             <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg ${difficultyColor[game.difficulty]}`}>
                 {game.difficulty}
             </span>
         )}
         
         {/* Feature Badges */}
         <div className="flex gap-1">
             {isHot && (
                 <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg animate-pulse border border-white/20">
                     🔥 HOT
                 </span>
             )}
             {isNew && !isHot && (
                 <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20">
                     ✨ NEW
                 </span>
             )}
         </div>
      </div>

      {/* Top Right Actions */}
      <button 
        onClick={(e) => onToggleFavorite(e, game.id)}
        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 z-20 hover:scale-110 shadow-lg ${isFavorite ? 'bg-secondary text-white border-secondary' : 'bg-black/60 text-white/50 hover:text-white hover:bg-black/80'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isFavorite ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 z-10 flex flex-col justify-end h-full pointer-events-none">
         
         {/* Title and Base Info - Moves up on hover */}
         <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 mt-auto ease-out">
            
            <h3 className={`font-gaming font-bold text-white leading-tight drop-shadow-lg mb-1 group-hover:text-accent transition-colors ${variant === 'small' ? 'text-lg line-clamp-1' : 'text-2xl'}`}>
              {game.name}
            </h3>

            {/* Tags - Fade out on hover to make room for description */}
            <div className="flex flex-wrap gap-1 mb-2 group-hover:opacity-0 group-hover:hidden transition-opacity duration-200">
               {game.tags?.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-200 border border-white/5">
                      {tag}
                   </span>
               ))}
            </div>

            {/* Play Count (Visible Always) */}
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-300 font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/5">
                   ▶ {plays > 1000 ? (plays/1000).toFixed(1) + 'k' : plays}
                </span>
                {game.category && (
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                        {game.category}
                    </span>
                )}
            </div>

            {/* Description Reveal (Hidden by default, slides up) */}
            <p className="text-xs text-gray-300 line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden group-hover:block">
               {game.description}
            </p>

            {/* Stats & Actions Row (Reveal on Hover) */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto delay-75">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-green-400">🏆 {wins} Wins</span>
               </div>

               <div className="flex gap-1 bg-black/40 rounded-lg p-0.5">
                  <button 
                     onClick={(e) => onRateGame && onRateGame(e, game.id, 'LIKE')}
                     className="p-1.5 hover:bg-white/10 rounded-md text-xs transition-colors text-gray-400 hover:text-green-400 flex items-center gap-1"
                  >
                     👍 <span className="text-[9px] font-bold">{likes}</span>
                  </button>
                  <div className="w-[1px] bg-white/10 my-1"></div>
                  <button 
                     onClick={(e) => onRateGame && onRateGame(e, game.id, 'DISLIKE')}
                     className="p-1.5 hover:bg-white/10 rounded-md text-xs transition-colors text-gray-400 hover:text-red-400"
                  >
                     👎
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
