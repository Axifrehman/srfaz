
import { Achievement, UserStats } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Played your very first game!',
    icon: '🐣',
    condition: (stats: UserStats) => stats.totalPlays >= 1
  },
  {
    id: 'first_win',
    name: 'Winner!',
    description: 'Won your first game mission.',
    icon: '🏆',
    condition: (stats: UserStats) => stats.wins >= 1
  },
  {
    id: 'high_five',
    name: 'High Five',
    description: 'Played 5 games.',
    icon: '✋',
    condition: (stats: UserStats) => stats.totalPlays >= 5
  },
  {
    id: 'pro_gamer',
    name: 'Pro Gamer',
    description: 'Reached 10 Wins.',
    icon: '🥇',
    condition: (stats: UserStats) => stats.wins >= 10
  },
  {
    id: 'xp_hunter',
    name: 'XP Hunter',
    description: 'Earned 200 XP.',
    icon: '⚡',
    condition: (stats: UserStats) => stats.xp >= 200
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Played games from 3 different categories.',
    icon: '🧭',
    condition: (stats: UserStats) => Object.keys(stats.categoryPlays || {}).length >= 3
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Played 50 games. Amazing!',
    icon: '🎖️',
    condition: (stats: UserStats) => stats.totalPlays >= 50
  },
  {
    id: 'master_mind',
    name: 'Mastermind',
    description: 'Played 10 Puzzle games.',
    icon: '🧩',
    condition: (stats: UserStats) => (stats.categoryPlays['Puzzle'] || 0) >= 10
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Played 10 Racing games.',
    icon: '🏎️',
    condition: (stats: UserStats) => (stats.categoryPlays['Racing'] || 0) >= 10
  }
];
