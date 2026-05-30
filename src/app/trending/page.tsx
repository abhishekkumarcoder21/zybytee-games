import type { Metadata } from 'next';
import { getTrendingGames } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import { TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trending Games',
  description: 'Play the most popular trending games right now on ZyBytee Games!',
};

export default function TrendingPage() {
  const trending = getTrendingGames();

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Trending Games</h1>
          <p className="text-sm text-muted-foreground">{trending.length} games trending now</p>
        </div>
      </div>
      <GameGrid games={trending} columns={5} />
    </div>
  );
}
