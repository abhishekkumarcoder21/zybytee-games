'use client';

import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Gamepad2 } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import type { Game } from '@/types/game';

// Dynamic game component registry
const gameComponents: Record<string, React.ComponentType> = {
  snake: dynamic(() => import('@/games/snake/SnakeGame'), { ssr: false }),
  '2048': dynamic(() => import('@/games/game-2048/Game2048'), { ssr: false }),
  'tic-tac-toe': dynamic(() => import('@/games/tic-tac-toe/TicTacToeGame'), { ssr: false }),
  minesweeper: dynamic(() => import('@/games/minesweeper/MinesweeperGame'), { ssr: false }),
  'flappy-bird': dynamic(() => import('@/games/flappy-bird/FlappyBirdGame'), { ssr: false }),
  wordle: dynamic(() => import('@/games/wordle/WordleGame'), { ssr: false }),
  'memory-match': dynamic(() => import('@/games/memory-match/MemoryMatchGame'), { ssr: false }),
  pong: dynamic(() => import('@/games/pong/PongGame'), { ssr: false }),
};

const PlaceholderGame = dynamic(() => import('@/games/placeholder/PlaceholderGame'), { ssr: false });

function GameLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-white/10 border-t-neon-blue animate-spin" />
        <Gamepad2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-neon-blue" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading game...</p>
    </div>
  );
}

interface GamePlayerProps {
  game: Game;
}

export function GamePlayer({ game }: GamePlayerProps) {
  const { addRecentlyPlayed } = useGameStore();

  useEffect(() => {
    addRecentlyPlayed({
      gameId: game.id,
      gameSlug: game.slug,
      gameTitle: game.title,
      gameThumbnail: game.thumbnail,
      gameCategory: game.category,
    });
  }, [game, addRecentlyPlayed]);

  // Track playtime per game (every second active)
  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.getState().incrementPlayTime(game.id, 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [game.id]);

  const GameComponent = game.hasImplementation
    ? gameComponents[game.slug] ?? PlaceholderGame
    : PlaceholderGame;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-gaming-dark">
      <div className="aspect-[16/10] w-full">
        <Suspense fallback={<GameLoader />}>
          <GameComponent />
        </Suspense>
      </div>
    </div>
  );
}
