import type { Metadata } from 'next';
import { getNewGames } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Games',
  description: 'Discover the latest games added to ZyBytee Games!',
};

export default function NewGamesPage() {
  const newGames = getNewGames();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">New Games</h1>
          <p className="text-sm text-muted-foreground">{newGames.length} recently added</p>
        </div>
      </div>
      <GameGrid games={newGames} columns={5} />
    </div>
  );
}
