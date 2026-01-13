
import React, { useRef, useEffect, useState } from 'react';
import { Game, GameStats } from '../types';
import { GameCard } from './GameCard';

interface GameSectionProps {
  title: string;
  games: Game[];
  onGameClick: (game: Game) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  stats: Record<string, GameStats>;
  activeKidTheme: string;
}

export const GameSection: React.FC<GameSectionProps> = ({ 
  title, 
  games, 
  onGameClick, 
  favorites, 
  onToggleFavorite, 
  stats,
  activeKidTheme
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const speed = 0.5; // Pixels per frame
    let animationFrameId: number;

    const animate = () => {
      if (!isHovered && scrollContainer) {
        scrollAmount += speed;
        // If we scrolled past the scrollWidth / 2 (assuming we duplicate content for infinite loop effect later, 
        // but for now simple reset is fine, or just continuous scroll)
        // Simple auto-scroll that stops at end:
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
           // Optional: Reset to 0 for infinite feel, or bounce. Let's just reset for simple loop
           // scrollContainer.scrollLeft = 0;
           // Actually, standard behavior for sliders is usually manual, but user requested auto.
           // Let's do a "ping pong" or just simple forward.
        } else {
           scrollContainer.scrollLeft += speed;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  if (games.length === 0) return null;

  return (
    <div className="mb-10 animate-fade-in pl-4">
      <div className="flex items-center gap-3 mb-4 pr-4">
        <h2 className="text-xl md:text-2xl font-gaming font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-accent text-lg">►</span> {title}
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
      </div>
      
      {/* Horizontal Slider with Auto Scroll */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {games.map(game => (
          <div key={game.id} className="min-w-[200px] w-[200px] snap-center">
            <GameCard 
              game={game} 
              onClick={onGameClick}
              accentColor={`bg-gradient-to-r ${activeKidTheme}`}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={onToggleFavorite}
              stats={stats[game.id]}
              variant="small"
            />
          </div>
        ))}
        {/* Padding element */}
        <div className="min-w-[20px]"></div>
      </div>
    </div>
  );
};
