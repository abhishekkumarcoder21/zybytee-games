import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { games, getGameBySlug, getGamesByCategory } from '@/data/games';
import { GamePlayer } from '@/components/game/GamePlayer';
import { GameInfo } from '@/components/game/GameInfo';
import { GameGrid } from '@/components/game/GameGrid';
import { Star, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: 'Game Not Found' };

  return {
    title: game.seo.metaTitle,
    description: game.seo.metaDescription,
    keywords: game.seo.keywords,
    openGraph: {
      title: game.seo.metaTitle,
      description: game.seo.metaDescription,
      type: 'website',
      siteName: 'ZyBytee Games',
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const relatedGames = getGamesByCategory(game.category)
    .filter((g) => g.id !== game.id)
    .slice(0, 4);

  const formatPlayCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
          <Link href="/games" className="hover:text-foreground transition-colors">Games</Link>
          <span>/</span>
          <Link href={`/categories/${game.category}`} className="hover:text-foreground transition-colors capitalize">
            {game.category.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-foreground">{game.title}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold">{game.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize border-white/20">
              {game.category.replace('-', ' ')}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              <Star className="h-3.5 w-3.5" fill="currentColor" />
              {game.rating}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {formatPlayCount(game.playCount)} plays
            </span>
          </div>
        </div>
      </div>

      {/* Game + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <GamePlayer game={game} />
        </div>
        <div className="space-y-6">
          <GameInfo game={game} />
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">More {game.category.replace('-', ' ')} Games</h2>
          <GameGrid games={relatedGames} columns={4} />
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: game.title,
            description: game.description,
            genre: game.category,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: game.rating,
              bestRating: 5,
              ratingCount: game.playCount,
            },
            url: `https://games.zybytee.in/games/${game.slug}`,
          }),
        }}
      />
    </div>
  );
}
