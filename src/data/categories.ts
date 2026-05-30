import type { Category, CategorySlug } from '@/types/game';
import { games } from './games';

export const categories: Category[] = [
  {
    slug: 'arcade',
    name: 'Arcade',
    description: 'Classic arcade games with simple controls and addictive gameplay. High scores, retro vibes, and endless fun!',
    icon: 'Joystick',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    gameCount: 0,
  },
  {
    slug: 'racing',
    name: 'Racing',
    description: 'High-speed racing games with thrilling tracks, drifting mechanics, and competitive leaderboards.',
    icon: 'Car',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    gameCount: 0,
  },
  {
    slug: 'puzzle',
    name: 'Puzzle',
    description: 'Brain-teasing puzzles that challenge your logic, memory, and problem-solving skills.',
    icon: 'Puzzle',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    gameCount: 0,
  },
  {
    slug: 'action',
    name: 'Action',
    description: 'Action-packed games with combat, platforming, and non-stop excitement. Test your reflexes!',
    icon: 'Swords',
    color: 'text-red-400',
    gradient: 'from-red-500 to-pink-500',
    gameCount: 0,
  },
  {
    slug: 'adventure',
    name: 'Adventure',
    description: 'Embark on epic adventures, explore new worlds, and uncover hidden treasures.',
    icon: 'Compass',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-yellow-500',
    gameCount: 0,
  },
  {
    slug: 'sports',
    name: 'Sports',
    description: 'Compete in your favorite sports! Football, basketball, bowling, and more.',
    icon: 'Trophy',
    color: 'text-lime-400',
    gradient: 'from-lime-500 to-green-500',
    gameCount: 0,
  },
  {
    slug: 'multiplayer',
    name: 'Multiplayer',
    description: 'Play with friends and players worldwide. Real-time battles, drawing games, and party fun!',
    icon: 'Users',
    color: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-500',
    gameCount: 0,
  },
  {
    slug: 'educational',
    name: 'Educational',
    description: 'Learn while you play! Math, typing, geography, vocabulary, and trivia games.',
    icon: 'GraduationCap',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    gameCount: 0,
  },
  {
    slug: 'strategy',
    name: 'Strategy',
    description: 'Think ahead, plan your moves, and outsmart your opponents in these strategy games.',
    icon: 'Brain',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-violet-500',
    gameCount: 0,
  },
  {
    slug: 'board-games',
    name: 'Board Games',
    description: 'Digital versions of classic board games. Chess, checkers, solitaire, and more!',
    icon: 'Dice5',
    color: 'text-teal-400',
    gradient: 'from-teal-500 to-cyan-500',
    gameCount: 0,
  },
];

// Compute game counts dynamically
categories.forEach((cat) => {
  cat.gameCount = games.filter((g) => g.category === cat.slug).length;
});

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoriesWithGames(): (Category & { slug: CategorySlug })[] {
  return categories.filter((c) => c.gameCount > 0) as (Category & { slug: CategorySlug })[];
}
