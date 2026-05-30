import type { Metadata } from 'next';
import { searchGames, games } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import { Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Games',
  description: 'Search for your favorite games on ZyBytee Games.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? searchGames(query) : games;

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {query ? `Results for "${query}"` : 'Search Games'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'game' : 'games'} found
          </p>
        </div>
      </div>

      {results.length > 0 ? (
        <GameGrid games={results} columns={5} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No games found</h2>
          <p className="text-muted-foreground text-sm">
            Try a different search term or browse our <Link href="/categories" className="text-neon-blue hover:underline">categories</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
